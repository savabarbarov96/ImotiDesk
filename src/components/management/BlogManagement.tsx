import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/auth/use-user';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  Plus, 
  PencilIcon, 
  Trash2Icon, 
  UploadIcon, 
  ImageIcon,
  FileEdit,
  Calendar,
  FolderOpen,
  ExternalLink,
  Eye,
  X
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { BlogPost } from '@/hooks/use-blog-posts';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';

const BUCKET_NAME = 'blog-images';

// Regex for URL-friendly slug
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const formSchema = z.object({
  title: z.string().min(5, 'Заглавието трябва да бъде поне 5 символа'),
  slug: z.string().min(3, 'Slug трябва да бъде поне 3 символа').regex(slugRegex, 'Невалиден slug формат. Използвайте само малки букви, цифри и тире.'),
  content: z.string().min(20, 'Съдържанието трябва да бъде поне 20 символа'),
  excerpt: z.string().min(10, 'Краткото описание трябва да бъде поне 10 символа'),
  category: z.enum(['Market Analysis', 'Tips & News', 'Client Stories'], {
    errorMap: () => ({ message: 'Моля, изберете категория' }),
  }),
  // image_url will be handled separately with file upload
});

type FormValues = z.infer<typeof formSchema>;

const BlogManagement = () => {
  const { data: user } = useUser();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      category: 'Tips & News',
    },
  });

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Cast the data to ensure category is a valid enum value
      const typedPosts = data?.map(post => ({
        ...post,
        category: post.category as "Market Analysis" | "Tips & News" | "Client Stories"
      })) || [];
      
      setPosts(typedPosts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: "Грешка",
        description: "Възникна проблем при зареждането на блог постовете.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  
  // Function to generate a slug from title
  const generateSlug = (title: string) => {
    // Transliteration map for Bulgarian to Latin
    const transliterationMap: { [key: string]: string } = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ж': 'zh', 'з': 'z',
      'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p',
      'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
      'ш': 'sh', 'щ': 'sht', 'ъ': 'a', 'ь': 'y', 'ю': 'yu', 'я': 'ya',
      'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ж': 'Zh', 'З': 'Z',
      'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P',
      'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch',
      'Ш': 'Sh', 'Щ': 'Sht', 'Ъ': 'A', 'Ь': 'Y', 'Ю': 'Yu', 'Я': 'Ya'
    };

    return title
      .trim()
      // Transliterate Bulgarian characters
      .split('')
      .map(char => transliterationMap[char] || char)
      .join('')
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')  // Remove special chars
      .replace(/\s+/g, '-')      // Replace spaces with hyphens
      .replace(/-+/g, '-')       // Remove consecutive hyphens
      .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens
  };

  // Check if a slug is available (not used by another post)
  const checkSlugAvailability = async (slug: string, excludeId?: string) => {
    setCheckingSlug(true);
    setSlugError(null);
    
    try {
      let query = supabase
        .from('blog_posts')
        .select('id, slug')
        .eq('slug', slug);
        
      if (excludeId) {
        query = query.neq('id', excludeId);
      }
        
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setSlugError('Този slug вече съществува. Моля, изберете друг.');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking slug:', error);
      setSlugError('Грешка при проверка на slug.');
      return false;
    } finally {
      setCheckingSlug(false);
    }
  };

  // Watch for title changes to suggest a slug
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'title' && value.title && !editingId) {
        const generatedSlug = generateSlug(value.title as string);
        form.setValue('slug', generatedSlug);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, editingId]);

  const handleEdit = async (post: BlogPost) => {
    setEditingId(post.id);
    setShowEditor(true);
    
    form.reset({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category as any,
    });
    
    setImagePreview(post.image_url);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    processImageFile(file);
  };

  const processImageFile = (file: File) => {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Грешка",
        description: "Изображението не може да бъде по-голямо от 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Грешка",
        description: "Моля, изберете валиден файл с изображение (JPEG, PNG, GIF, WEBP).",
        variant: "destructive",
      });
      return;
    }

    setImageFile(file);
    
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.onerror = () => {
      toast({
        title: "Грешка",
        description: "Проблем при четенето на изображението.",
        variant: "destructive",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processImageFile(files[0]);
    }
  };

  const uploadImage = async (id: string): Promise<string | null> => {
    if (!imageFile) return null;
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}${fileExt ? `.${fileExt}` : ''}`;
      const filePath = `${id}/${fileName}`;
      
      // Upload the file
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, imageFile, {
          upsert: true,
          contentType: imageFile.type,
        });

      if (error) {
        console.error('Supabase storage upload error:', error);
        throw error;
      }

      if (!data?.path) {
        throw new Error('Uploaded file path is undefined');
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

      if (!urlData?.publicUrl) {
        throw new Error('Failed to get public URL for uploaded image');
      }

      console.log('Uploaded image URL:', urlData.publicUrl);
      setUploadProgress(100);
      return urlData.publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Грешка при качване на изображение",
        description: error.message || "Възникна проблем при качването на изображението",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsSubmitting(true);
      
      // Get the post to find the image path
      const { data: postData } = await supabase
        .from('blog_posts')
        .select('image_url')
        .eq('id', id)
        .single();
      
      // Delete from the database
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // If there's an image, try to delete it from storage
      if (postData?.image_url) {
        try {
          // Extract the path from the URL
          const url = new URL(postData.image_url);
          const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/blog-images\/(.+)/);
          
          if (pathMatch && pathMatch[1]) {
            await supabase.storage
              .from(BUCKET_NAME)
              .remove([decodeURIComponent(pathMatch[1])]);
          }
        } catch (storageError) {
          console.error('Error deleting image from storage:', storageError);
          // Don't throw here, just log the error, as the database deletion was successful
        }
      }

      await fetchPosts();
      
      toast({
        title: "Успешно",
        description: "Блог постът беше изтрит.",
      });
    } catch (error: any) {
      console.error('Error deleting blog post:', error);
      toast({
        title: "Грешка",
        description: error.message || "Възникна проблем при изтриването на блог поста.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const confirmDelete = (id: string) => {
    setPostToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      // Validate slug uniqueness
      const isSlugValid = await checkSlugAvailability(values.slug, editingId);
      if (!isSlugValid) {
        return; // Exit if slug is not valid
      }
      
      setIsSubmitting(true);
      
      // Check if we're authenticated before proceeding
      if (!user) {
        throw new Error("Моля, влезте в системата за да добавите или редактирате блог пост");
      }
      
      let imageUrl = imagePreview;
      const now = new Date().toISOString();
      
      if (editingId) {
        // If editing and new image uploaded, update the image
        if (imageFile) {
          const newImageUrl = await uploadImage(editingId);
          if (newImageUrl) {
            imageUrl = newImageUrl;
          }
        }
        
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title: values.title,
            slug: values.slug,
            content: values.content,
            excerpt: values.excerpt,
            category: values.category,
            image_url: imageUrl,
            updated_at: now
          })
          .eq('id', editingId);

        if (error) throw error;

        toast({
          title: "Успешно",
          description: "Блог постът беше обновен.",
        });
      } else {
        // For new posts, determine if we have an image to upload
        const hasImageToUpload = !!imageFile;
        
        // Create new post with required fields
        const { data, error } = await supabase
          .from('blog_posts')
          .insert({
            title: values.title,
            slug: values.slug,
            content: values.content,
            excerpt: values.excerpt,
            category: values.category,
            author_id: user.id,
            image_url: null, // Will be updated after upload if image exists
            published_at: now,
            created_at: now,
            updated_at: now
          })
          .select()
          .single();

        if (error) throw error;

        // If new image uploaded, update with the image URL
        if (hasImageToUpload && data) {
          const newImageUrl = await uploadImage(data.id);
          if (newImageUrl) {
            // Update the newly created post with the image URL
            const { error: updateError } = await supabase
              .from('blog_posts')
              .update({ image_url: newImageUrl })
              .eq('id', data.id);
              
            if (updateError) {
              console.error('Error updating image URL:', updateError);
              // Don't throw, but log the error
            }
          }
        }

        toast({
          title: "Успешно",
          description: "Блог постът беше създаден.",
        });
      }

      // Reset form and state
      resetForm();
      
      // Refresh the posts list
      await fetchPosts();

    } catch (error: any) {
      console.error('Error submitting blog post:', error);
      toast({
        title: "Грешка",
        description: `Възникна проблем при запазването: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    form.reset({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      category: 'Tips & News',
    });
    setEditingId(null);
    setImageFile(null);
    setImagePreview(null);
    setShowEditor(false);
  };

  const handleCancel = () => {
    resetForm();
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd MMM yyyy, HH:mm', { locale: bg });
    } catch (error) {
      return dateStr;
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'Market Analysis':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Tips & News':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Client Stories':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getCategoryTranslation = (category: string) => {
    switch (category) {
      case 'Market Analysis':
        return 'Пазарен анализ';
      case 'Tips & News':
        return 'Съвети и новини';
      case 'Client Stories':
        return 'Истории на клиенти';
      default:
        return category;
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Управление на новините</CardTitle>
          <CardDescription>
            Създавайте, редактирайте и изтривайте новини.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showEditor ? (
            <div className="mb-6">
              <Button 
                onClick={() => setShowEditor(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Нова новина
              </Button>
            </div>
          ) : (
            <div className="space-y-6 mb-8 border rounded-lg p-6 bg-white shadow-sm">
              <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingId ? 'Редактиране на новина' : 'Създаване на нова новина'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {editingId ? 'Обновете информацията за новината' : 'Попълнете формата за да създадете нова новина'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="hover:bg-gray-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Затвори
                </Button>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Заглавие</FormLabel>
                        <FormControl>
                          <Input placeholder="Въведете заглавие" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug (URL)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="example-post-url" 
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              // Reset error when user types
                              if (slugError) setSlugError(null);
                            }} 
                          />
                        </FormControl>
                        <FormDescription>
                          Използвайте само малки букви, цифри и тирета. Не използвайте интервали.
                        </FormDescription>
                        {slugError && <p className="text-sm text-destructive mt-1">{slugError}</p>}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Категория</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Изберете категория" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Market Analysis">Пазарен анализ</SelectItem>
                              <SelectItem value="Tips & News">Съвети и новини</SelectItem>
                              <SelectItem value="Client Stories">Истории на клиенти</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-2">
                      <FormLabel>Изображение за корицата</FormLabel>
                      <div 
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 min-h-[120px] flex items-center justify-center ${
                          isDragOver 
                            ? 'border-primary bg-primary/10 scale-[1.02]' 
                            : 'border-gray-300 hover:border-primary hover:bg-primary/5'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="blog-image-upload"
                          onChange={handleImageChange}
                        />
                        <label 
                          htmlFor="blog-image-upload" 
                          className="flex flex-col items-center justify-center cursor-pointer space-y-3 w-full"
                        >
                          <div className={`p-3 rounded-full transition-colors ${
                            isDragOver ? 'bg-primary/20' : 'bg-gray-100'
                          }`}>
                            <UploadIcon className={`h-8 w-8 transition-colors ${
                              isDragOver ? 'text-primary' : 'text-gray-600'
                            }`} />
                          </div>
                          <div className="text-center">
                            <span className={`text-sm font-medium block transition-colors ${
                              isDragOver ? 'text-primary' : 'text-gray-700'
                            }`}>
                              {isDragOver ? 'Пуснете файла тук' : 'Качете изображение за корицата'}
                            </span>
                            <span className="text-xs text-muted-foreground block mt-1">
                              {isDragOver ? 'Пуснете за качване' : 'Плъзнете и пуснете или кликнете за избор'}
                            </span>
                            <span className="text-xs text-muted-foreground block">
                              PNG, JPG, GIF до 5MB
                            </span>
                          </div>
                          {!isDragOver && (
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              className="mt-2"
                              onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('blog-image-upload')?.click();
                              }}
                            >
                              <UploadIcon className="h-4 w-4 mr-2" />
                              Избери файл
                            </Button>
                          )}
                        </label>
                      </div>
                      {isUploading && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                            <span>Качване...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {imagePreview && (
                    <div className="space-y-4">
                      <FormLabel className="text-base font-semibold text-gray-900">Преглед на изображението</FormLabel>
                      <div className="relative group">
                        {/* Main preview container with improved aspect ratio */}
                        <div className="relative w-full max-w-2xl mx-auto bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                          {/* Image container with dynamic height based on aspect ratio */}
                          <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="absolute inset-0 w-full h-full object-contain bg-gray-50"
                              style={{ objectPosition: 'center' }}
                            />
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                            
                            {/* Full-size preview button */}
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 hover:bg-white shadow-sm"
                              onClick={() => window.open(imagePreview, '_blank')}
                              title="Преглед в пълен размер"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Преглед
                            </Button>
                            
                            {/* Delete button */}
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm"
                              onClick={() => {
                                setImageFile(null);
                                setImagePreview(null);
                                // Reset the file input
                                const fileInput = document.getElementById('blog-image-upload') as HTMLInputElement;
                                if (fileInput) fileInput.value = '';
                              }}
                              title="Премахни изображението"
                            >
                              <Trash2Icon className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          {/* Image info bar */}
                          <div className="bg-gray-50 border-t border-gray-200 px-4 py-3">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center space-x-4 text-gray-600">
                                <span className="flex items-center">
                                  <ImageIcon className="h-4 w-4 mr-1.5" />
                                  {imageFile?.name || 'Изображение'}
                                </span>
                                {imageFile && (
                                  <>
                                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                    <span className="font-medium">
                                      {(imageFile.size / 1024 / 1024).toFixed(1)} MB
                                    </span>
                                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                    <span className="text-gray-500">
                                      {imageFile.type.split('/')[1].toUpperCase()}
                                    </span>
                                  </>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center text-green-600">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></div>
                                  <span className="text-xs font-medium">Готово за качване</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Alternative view options */}
                        <div className="mt-3 flex items-center justify-center space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                              const img = document.querySelector('.object-contain') as HTMLImageElement;
                              if (img) {
                                img.className = img.className.includes('object-contain') 
                                  ? img.className.replace('object-contain', 'object-cover')
                                  : img.className.replace('object-cover', 'object-contain');
                              }
                            }}
                          >
                            Превключи изглед
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Кратко описание</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Въведете кратко описание" 
                            {...field} 
                            rows={2}
                          />
                        </FormControl>
                        <FormDescription>
                          Това ще се показва в прегледа на статията.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Съдържание</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Въведете съдържанието на поста" 
                            {...field} 
                            rows={12}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                      className="hover:bg-gray-50"
                    >
                      Отказ
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || checkingSlug}
                      className="bg-primary hover:bg-primary/90 min-w-[120px]"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Запазване...
                        </>
                      ) : editingId ? (
                        <>
                          <PencilIcon className="mr-2 h-4 w-4" />
                          Обнови новина
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Създай новина
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
          
          <div className="pt-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Управление на новините</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {posts.length} {posts.length === 1 ? 'новина' : 'новини'} общо
                </p>
              </div>
              {posts.length > 0 && (
                <div className="text-sm text-gray-500">
                  Последна актуализация: {new Date().toLocaleDateString('bg-BG')}
                </div>
              )}
            </div>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-gray-500">Зареждане на новините...</p>
                </div>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-200">
                <div className="max-w-sm mx-auto">
                  <div className="bg-gray-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <FileEdit className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Няма новини</h3>
                  <p className="text-gray-500 mb-4">Започнете като създадете първата си новина.</p>
                  <Button 
                    onClick={() => setShowEditor(true)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Създай първата новина
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead className="font-semibold text-gray-700 py-4">Новина</TableHead>
                      <TableHead className="font-semibold text-gray-700">Категория</TableHead>
                      <TableHead className="font-semibold text-gray-700">Дата</TableHead>
                      <TableHead className="text-right font-semibold text-gray-700">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map((post) => (
                      <TableRow key={post.id} className="hover:bg-gray-50/50 transition-colors">
                        <TableCell className="font-medium py-4">
                          <div className="flex items-center space-x-4">
                            <div className="h-20 w-20 rounded-lg overflow-hidden flex-shrink-0 border-2 border-gray-200 bg-gray-50">
                              {post.image_url ? (
                                <div className="relative group cursor-pointer">
                                  <img 
                                    src={post.image_url} 
                                    alt={post.title} 
                                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-200"
                                    title="Кликнете за преглед в пълен размер"
                                    onClick={() => window.open(post.image_url, '_blank')}
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                      <div className="bg-white/90 rounded-full p-1">
                                        <Eye className="h-3 w-3 text-gray-700" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                  <ImageIcon className="h-8 w-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-sm leading-tight text-gray-900 mb-1">{post.title}</p>
                              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                              <div className="flex items-center mt-2 space-x-2">
                                <span className="text-xs text-gray-400">ID: {post.id.slice(0, 8)}</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span className="text-xs text-gray-400 font-mono">{post.slug}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge variant="outline" className={getCategoryBadgeColor(post.category)}>
                            {getCategoryTranslation(post.category)}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(post.published_at)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <div className="flex justify-end space-x-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                              asChild
                              title="Преглед на новината"
                            >
                              <a href={`/news/${post.slug}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                                <span className="sr-only">Преглед</span>
                              </a>
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 hover:bg-amber-50 hover:text-amber-600"
                              onClick={() => handleEdit(post)}
                              title="Редактиране на новината"
                            >
                              <PencilIcon className="h-4 w-4" />
                              <span className="sr-only">Редактирай</span>
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => confirmDelete(post.id)}
                              title="Изтриване на новината"
                            >
                              <Trash2Icon className="h-4 w-4" />
                              <span className="sr-only">Изтрий</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Потвърдете изтриването</DialogTitle>
            <DialogDescription>
              Сигурни ли сте, че искате да изтриете тази новина? Това действие не може да бъде отменено.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Отказ
            </Button>
            <Button
              variant="destructive"
              onClick={() => postToDelete && handleDelete(postToDelete)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Изтриване...
                </>
              ) : (
                'Изтрий'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogManagement; 