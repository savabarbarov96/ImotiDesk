import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Upload, X, Image as ImageIcon, Check, AlertTriangle, RefreshCw, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SlideshowManagement = () => {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingImages, setUploadingImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchSlideshowImages();
  }, []);

  // Fetch the current slideshow images
  const fetchSlideshowImages = async () => {
    setIsLoading(true);
    try {
      const { data: images, error } = await supabase.storage
        .from('trendimo')
        .list('hero_slideshow/', {
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) {
        console.error('Error fetching slideshow images:', error);
        toast.error('Грешка при зареждане на изображенията');
        return;
      }

      // Filter for image files only
      const imageFiles = images ? images.filter(item => 
        !item.id.endsWith('/') && 
        (item.name.match(/\.(jpg|jpeg|png|gif|webp)$/i))
      ) : [];

      // Get the public URLs for each image
      const urls = imageFiles.map(file => {
        const { data: { publicUrl } } = supabase
          .storage
          .from('trendimo')
          .getPublicUrl('hero_slideshow/' + file.name);

        return publicUrl;
      });

      setImages(urls);
    } catch (error) {
      console.error('Error in fetchSlideshowImages:', error);
      toast.error('Грешка при зареждане на изображенията');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Convert FileList to array and filter for image files
      const newFiles = Array.from(e.target.files).filter(file => 
        file.type.startsWith('image/')
      );
      
      // Add selected files to state
      setUploadingImages(prev => [...prev, ...newFiles]);
    }
  };

  // Remove image from upload queue
  const removeImageFromQueue = (index: number) => {
    setUploadingImages(prev => prev.filter((_, i) => i !== index));
  };

  // Upload selected images
  const uploadImages = async () => {
    if (uploadingImages.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    const totalFiles = uploadingImages.length;
    let uploadedFiles = 0;
    let successCount = 0;
    
    for (const file of uploadingImages) {
      try {
        // Generate a unique file name
        const fileExt = file.name.split('.').pop();
        const fileName = `slide_${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `hero_slideshow/${fileName}`;

        // Upload to Supabase
        const { data, error } = await supabase.storage
          .from('trendimo')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error('Error uploading image:', error);
          toast.error(`Грешка при качване на ${file.name}`);
        } else {
          successCount++;
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Възникна грешка при качването');
      } finally {
        uploadedFiles++;
        setUploadProgress(Math.floor((uploadedFiles / totalFiles) * 100));
      }
    }

    setIsUploading(false);
    setUploadingImages([]);
    
    if (successCount > 0) {
      toast.success(`Успешно качени ${successCount} изображения`);
      await fetchSlideshowImages();
      setShowSuccess(true);
      
      // Hide success message after 10 seconds
      setTimeout(() => setShowSuccess(false), 10000);
    }
  };

  // Delete image from storage
  const deleteImage = async (imageUrl: string) => {
    try {
      // Extract the path from the URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `hero_slideshow/${fileName}`;

      // Delete from Supabase
      const { error } = await supabase.storage
        .from('trendimo')
        .remove([filePath]);

      if (error) {
        console.error('Error deleting image:', error);
        toast.error('Грешка при изтриването');
        return;
      }

      toast.success('Изображението е изтрито');
      
      // Update the images list
      setImages(prev => prev.filter(img => img !== imageUrl));
      setShowSuccess(true);
      
      // Hide success message after 10 seconds
      setTimeout(() => setShowSuccess(false), 10000);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Възникна грешка при изтриването');
    }
  };

  const handleReloadPage = () => {
    window.location.reload();
  };

  return (
    <Card className="w-full shadow-md border-neutral-200">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Управление на слайдшоу изображения</CardTitle>
        <CardDescription>
          Настройка на изображенията в началната страница
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {showSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-800">Промените са запазени</AlertTitle>
            <AlertDescription className="text-green-700">
              Промените ще се отразят след презареждане на началната страница. 
              <Button variant="link" className="p-0 h-auto text-green-700 font-bold" onClick={handleReloadPage}>
                Презареди страницата сега
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="images" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="images">Текущи изображения</TabsTrigger>
            <TabsTrigger value="upload">Качване на нови</TabsTrigger>
          </TabsList>
          
          <TabsContent value="images">
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Зареждане на изображения...</span>
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed rounded-lg">
                <ImageIcon className="h-12 w-12 mx-auto text-neutral-400" />
                <p className="mt-2 text-neutral-600">Няма качени изображения</p>
                <p className="text-sm text-neutral-500">Отидете в раздел "Качване на нови" за да добавите изображения</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((imageUrl, index) => (
                  <div key={index} className="relative group rounded-lg overflow-hidden border bg-card">
                    <img 
                      src={imageUrl} 
                      alt={`Slideshow image ${index + 1}`}
                      className="w-full aspect-video object-cover transition-transform group-hover:scale-105"
                    />
                    
                    <div className="absolute top-2 right-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon" className="h-8 w-8 opacity-80 hover:opacity-100">
                            <X className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Изтриване на изображение</AlertDialogTitle>
                            <AlertDialogDescription>
                              Сигурни ли сте, че искате да изтриете това изображение?
                              Действието е необратимо.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отказ</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteImage(imageUrl)}>
                              Изтрий
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-sm">
                      Slide {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upload">
            <div className="space-y-6">
              <div 
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-neutral-50 transition-colors"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                <Upload className="h-10 w-10 mx-auto text-neutral-400" />
                <p className="mt-2 text-neutral-700">Кликнете или плъзнете изображения тук</p>
                <p className="text-sm text-neutral-500">Поддържани формати: JPG, PNG, GIF (макс. 5MB)</p>
                <input 
                  type="file" 
                  id="image-upload" 
                  className="hidden" 
                  accept="image/*" 
                  multiple 
                  onChange={handleImageSelect}
                  disabled={isUploading}
                />
                
                <Button 
                  variant="outline" 
                  className="mt-4"
                  disabled={isUploading}
                >
                  Избери файлове
                </Button>
              </div>
              
              {uploadingImages.length > 0 && (
                <div className="bg-neutral-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Избрани изображения</h3>
                    <Badge variant="outline">{uploadingImages.length} файла</Badge>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Файл</TableHead>
                        <TableHead>Размер</TableHead>
                        <TableHead>Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {uploadingImages.map((file, index) => (
                        <TableRow key={index}>
                          <TableCell className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded overflow-hidden bg-neutral-200 flex-shrink-0">
                              <img 
                                src={URL.createObjectURL(file)} 
                                className="w-full h-full object-cover"
                                alt={file.name}
                              />
                            </div>
                            <div className="truncate max-w-[200px]">{file.name}</div>
                          </TableCell>
                          <TableCell>{(file.size / 1024 / 1024).toFixed(2)} MB</TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-500"
                              onClick={() => removeImageFromQueue(index)}
                              disabled={isUploading}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              
              {uploadingImages.length > 0 && (
                <div className="bg-neutral-50 rounded-lg p-4">
                  {isUploading ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Качване на изображения...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                        <span>Избраните изображения не са качени</span>
                      </div>
                      
                      <Button 
                        variant="default" 
                        className="gap-2"
                        onClick={uploadImages}
                      >
                        <Upload className="h-4 w-4" />
                        Качи изображенията
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex items-center justify-between border-t px-6 py-4 bg-neutral-50">
        <div className="text-sm text-neutral-600">
          <p>Препоръчителен размер: 1920x1080 пиксела</p>
          <p>За оптимално представяне използвайте 16:9 съотношение</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleReloadPage}
          >
            <RefreshCw className="h-4 w-4" />
            Презареди страницата
          </Button>
          
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={fetchSlideshowImages}
            disabled={isLoading}
          >
            <Check className="h-4 w-4" />
            Обнови списъка
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SlideshowManagement; 