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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  Plus, 
  PencilIcon, 
  Trash2Icon, 
  UploadIcon, 
  ImageIcon,
  CheckCircle,
  AlertCircle,
  ArrowUpDown
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TeamMember } from '@/integrations/supabase/types';
import { SocialMediaLinks } from '@/components/icons/SocialMediaIcons';

const BUCKET_NAME = 'trendimo';

const formSchema = z.object({
  name: z.string().min(2, 'Името трябва да бъде поне 2 символа'),
  position: z.string().min(2, 'Позицията трябва да бъде поне 2 символа'),
  bio: z.string().optional(),
  email: z.string().email('Невалиден имейл адрес').optional().nullable(),
  phone_number: z.string().optional().nullable(),
  facebook_url: z.string().url('Невалиден Facebook URL').optional().or(z.literal('')),
  instagram_url: z.string().url('Невалиден Instagram URL').optional().or(z.literal('')),
  tiktok_url: z.string().url('Невалиден TikTok URL').optional().or(z.literal('')),
  order_index: z.coerce.number().int().default(0),
  is_active: z.boolean().default(true),
  // image_url will be handled separately with file upload
});

type FormValues = z.infer<typeof formSchema>;

const TeamMembersManagement = () => {
  const { data: user } = useUser();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      position: '',
      bio: '',
      email: '',
      phone_number: '',
      facebook_url: '',
      instagram_url: '',
      tiktok_url: '',
      order_index: 0,
      is_active: true,
    },
  });

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('imotidesk_team_members')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        throw error;
      }

      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast({
        title: "Грешка",
        description: "Възникна проблем при зареждането на членовете на екипа.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleEdit = (member: TeamMember) => {
    setEditingId(member.id);
    form.reset({
      name: member.name,
      position: member.position,
      bio: member.bio || '',
      email: member.email || '',
      phone_number: member.phone_number || '',
      facebook_url: member.facebook_url || '',
      instagram_url: member.instagram_url || '',
      tiktok_url: member.tiktok_url || '',
      order_index: member.order_index,
      is_active: member.is_active,
    });
    setImagePreview(member.image_url);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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

  const uploadImage = async (id: string): Promise<string | null> => {
    if (!imageFile) return null;
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}${fileExt ? `.${fileExt}` : ''}`;
      const filePath = `team_members/${id}/${fileName}`;
      
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
      
      // Get the team member to find the image path
      const { data: memberData } = await supabase
        .from('imotidesk_team_members')
        .select('image_url')
        .eq('id', id)
        .single();
      
      // Delete from the database
      const { error } = await supabase
        .from('imotidesk_team_members')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // If there's an image, try to delete it from storage
      if (memberData?.image_url) {
        try {
          // Extract the path from the URL
          const url = new URL(memberData.image_url);
          const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/trendimo\/(.+)/);
          
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

      await fetchTeamMembers();
      
      toast({
        title: "Успешно",
        description: "Членът на екипа беше изтрит.",
      });
    } catch (error: any) {
      console.error('Error deleting team member:', error);
      toast({
        title: "Грешка",
        description: error.message || "Възникна проблем при изтриването на члена на екипа.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
      setMemberToDelete(null);
    }
  };

  const confirmDelete = (id: string) => {
    setMemberToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Check if we're authenticated before proceeding
      if (!user) {
        throw new Error("Моля, влезте в системата за да добавите или редактирате член на екипа");
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
        
        // Update existing member
        const { error } = await supabase
          .from('imotidesk_team_members')
          .update({
            name: values.name,
            position: values.position,
            bio: values.bio || null,
            email: values.email || null,
            phone_number: values.phone_number || null,
            facebook_url: values.facebook_url || null,
            instagram_url: values.instagram_url || null,
            tiktok_url: values.tiktok_url || null,
            order_index: values.order_index,
            is_active: values.is_active,
            image_url: imageUrl,
            updated_at: now
          })
          .eq('id', editingId);

        if (error) throw error;

        toast({
          title: "Успешно",
          description: "Членът на екипа беше обновен.",
        });
      } else {
        // For new members, determine if we have an image to upload
        const hasImageToUpload = !!imageFile;
        
        // Create new member with required fields
        const { data, error } = await supabase
          .from('imotidesk_team_members')
          .insert({
            name: values.name,
            position: values.position,
            bio: values.bio || null,
            email: values.email || null,
            phone_number: values.phone_number || null,
            facebook_url: values.facebook_url || null,
            instagram_url: values.instagram_url || null,
            tiktok_url: values.tiktok_url || null,
            order_index: values.order_index,
            is_active: values.is_active,
            image_url: null, // Will be updated after upload if image exists
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
            // Update the newly created member with the image URL
            const { error: updateError } = await supabase
              .from('imotidesk_team_members')
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
          description: "Членът на екипа беше създаден.",
        });
      }

      // Reset form and state
      form.reset({
        name: '',
        position: '',
        bio: '',
        email: '',
        phone_number: '',
        facebook_url: '',
        instagram_url: '',
        tiktok_url: '',
        order_index: 0,
        is_active: true,
      });
      setEditingId(null);
      setImageFile(null);
      setImagePreview(null);
      
      // Refresh the team members list
      await fetchTeamMembers();

    } catch (error: any) {
      console.error('Error submitting team member:', error);
      toast({
        title: "Грешка",
        description: `Възникна проблем при запазването: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset({
      name: '',
      position: '',
      bio: '',
      email: '',
      phone_number: '',
      facebook_url: '',
      instagram_url: '',
      tiktok_url: '',
      order_index: 0,
      is_active: true,
    });
    setEditingId(null);
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Управление на екипа</CardTitle>
          <CardDescription>
            Добавяйте, редактирайте и премахвайте членовете на екипа, които се показват в секцията "Нашият екип".
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Име</FormLabel>
                        <FormControl>
                          <Input placeholder="Въведете име" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Позиция</FormLabel>
                        <FormControl>
                          <Input placeholder="Въведете позиция" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Имейл</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="Въведете имейл адрес" 
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription>
                          Контактен имейл на члена на екипа
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Телефон</FormLabel>
                        <FormControl>
                          <Input 
                            type="tel" 
                            placeholder="Въведете телефонен номер" 
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription>
                          Контактен телефон на члена на екипа
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Биография</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Въведете кратка биография (по избор)" 
                          {...field} 
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="order_index"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Позиция в списъка</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          По-ниските числа се показват първи
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Активен</FormLabel>
                          <FormDescription>
                            Показва се в секцията за екипа
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Социални мрежи</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="facebook_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Facebook профил</FormLabel>
                          <FormControl>
                            <Input 
                              type="url" 
                              placeholder="https://facebook.com/username" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            URL към Facebook профила на агента
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="instagram_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instagram профил</FormLabel>
                          <FormControl>
                            <Input 
                              type="url" 
                              placeholder="https://instagram.com/username" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            URL към Instagram профила на агента
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="tiktok_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TikTok профил</FormLabel>
                        <FormControl>
                          <Input 
                            type="url" 
                            placeholder="https://tiktok.com/@username" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          URL към TikTok профила на агента
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <FormLabel>Снимка</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary hover:bg-primary/5 transition-colors">
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="image-upload"
                          onChange={handleImageChange}
                        />
                        <label 
                          htmlFor="image-upload" 
                          className="flex flex-col items-center justify-center cursor-pointer space-y-2 h-full"
                        >
                          <UploadIcon className="h-8 w-8 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Качете изображение (макс. 5MB)
                          </span>
                          <Button 
                            type="button" 
                            variant="secondary" 
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              document.getElementById('image-upload')?.click();
                            }}
                          >
                            Избери Файл
                          </Button>
                        </label>
                      </div>
                      {isUploading && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-primary h-2.5 rounded-full" 
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="relative">
                      {imagePreview ? (
                        <div className="relative h-40 w-40 mx-auto overflow-hidden rounded-md border border-input">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-40 w-40 mx-auto flex items-center justify-center bg-gray-100 rounded-md border border-input">
                          <ImageIcon className="h-10 w-10 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  {editingId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                    >
                      Отказ
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Запазване...
                      </>
                    ) : editingId ? (
                      'Обнови член на екипа'
                    ) : (
                      'Добави член на екипа'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
            
            <div className="pt-4">
              <h3 className="text-lg font-medium">Членове на екипа</h3>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : teamMembers.length === 0 ? (
                <div className="text-center py-8 bg-muted/20 rounded-lg">
                  <p className="text-muted-foreground">Все още няма добавени членове на екипа.</p>
                </div>
              ) : (
                <div className="mt-4 overflow-hidden border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">№</TableHead>
                        <TableHead className="w-12">Снимка</TableHead>
                        <TableHead>Име</TableHead>
                        <TableHead>Позиция</TableHead>
                        <TableHead>Контакт</TableHead>
                        <TableHead>Социални мрежи</TableHead>
                        <TableHead className="text-center">Статус</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamMembers.map((member, index) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>
                            {member.image_url ? (
                              <div className="h-10 w-10 rounded-full overflow-hidden">
                                <img 
                                  src={member.image_url} 
                                  alt={member.name} 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{member.name}</TableCell>
                          <TableCell>{member.position}</TableCell>
                          <TableCell>
                            <div className="flex flex-col text-sm">
                              {member.email && (
                                <span className="text-muted-foreground">
                                  {member.email}
                                </span>
                              )}
                              {member.phone_number && (
                                <span className="text-muted-foreground">
                                  {member.phone_number}
                                </span>
                              )}
                              {!member.email && !member.phone_number && (
                                <span className="text-muted-foreground italic">
                                  Няма контактна информация
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <SocialMediaLinks
                              facebookUrl={member.facebook_url}
                              instagramUrl={member.instagram_url}
                              tiktokUrl={member.tiktok_url}
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {member.is_active ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Активен
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                Неактивен
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEdit(member)}
                              >
                                <PencilIcon className="h-4 w-4" />
                                <span className="sr-only">Редактирай</span>
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => confirmDelete(member.id)}
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
          </div>
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Потвърдете изтриването</DialogTitle>
            <DialogDescription>
              Сигурни ли сте, че искате да изтриете този член на екипа? Това действие не може да бъде отменено.
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
              onClick={() => memberToDelete && handleDelete(memberToDelete)}
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

export default TeamMembersManagement; 