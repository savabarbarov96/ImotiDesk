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
import { Loader2, Plus, PencilIcon, Trash2Icon, MapPin, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

type CareerPosition = {
  id: string;
  title: string;
  department: string;
  location: string;
  description: string;
  requirements: string;
  is_active: boolean;
  created_at: string;
};

const formSchema = z.object({
  title: z.string().min(2, 'Заглавието трябва да бъде поне 2 символа'),
  department: z.string().min(2, 'Отделът трябва да бъде поне 2 символа'),
  location: z.string().min(2, 'Локацията трябва да бъде поне 2 символа'),
  description: z.string().min(10, 'Описанието трябва да бъде поне 10 символа'),
  requirements: z.string().min(10, 'Изискванията трябва да бъде поне 10 символа'),
  is_active: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

const CareersManagement = () => {
  const { data: user } = useUser();
  const [positions, setPositions] = useState<CareerPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [positionToDelete, setPositionToDelete] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      department: '',
      location: '',
      description: '',
      requirements: '',
      is_active: true,
    },
  });

  const fetchPositions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setPositions(data || []);
    } catch (error) {
      console.error('Error fetching positions:', error);
      toast({
        title: "Грешка",
        description: "Възникна проблем при зареждането на позициите.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const handleEdit = (position: CareerPosition) => {
    setEditingId(position.id);
    form.reset({
      title: position.title,
      department: position.department,
      location: position.location,
      description: position.description,
      requirements: position.requirements,
      is_active: position.is_active,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('careers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Supabase delete error:", error);
        const errorMessage = error.message || "Неопределена грешка от базата данни.";
        toast({
          title: "Грешка при изтриване",
          description: `Проблем: ${errorMessage}`,
          variant: "destructive",
        });
        return;
      }

      await fetchPositions(); // Fetch positions again to ensure consistency
      
      toast({
        title: "Успешно",
        description: "Позицията беше изтрита.",
      });
    } catch (error: any) {
      console.error('Error deleting position (catch block):', error);
      toast({
        title: "Грешка",
        description: error.message || "Възникна неочакван проблем при изтриването на позицията.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
      setPositionToDelete(null);
    }
  };

  const confirmDelete = (id: string) => {
    console.log("Confirming delete for position ID:", id);
    setPositionToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Ensure values have all required fields for Supabase
      const careerData = {
        title: values.title,
        department: values.department,
        location: values.location,
        description: values.description,
        requirements: values.requirements,
        is_active: values.is_active,
      };
      
      // Check if we're authenticated before proceeding
      if (!user) {
        throw new Error("Моля, влезте в системата за да добавите или редактирате позиция");
      }
      
      if (editingId) {
        // Update existing position
        const { error } = await supabase
          .from('careers')
          .update(careerData)
          .eq('id', editingId);

        if (error) {
          throw error;
        }

        await fetchPositions(); // Fetch positions to reflect changes

        toast({
          title: "Успешно",
          description: "Позицията беше обновена.",
        });
      } else {
        // Create new position
        const { error } = await supabase
          .from('careers')
          .insert(careerData)
          .select('*'); // select('*') is fine, or just rely on fetchPositions

        if (error) {
          throw error;
        }

        await fetchPositions(); // Fetch positions to include the new one

        toast({
          title: "Успешно",
          description: "Позицията беше създадена.",
        });
      }

      // Reset form
      form.reset({
        title: '',
        department: '',
        location: '',
        description: '',
        requirements: '',
        is_active: true,
      });
      setEditingId(null);
    } catch (error: any) { // Added : any for error type
      console.error('Error submitting position:', error);
      toast({
        title: "Грешка",
        description: `Възникна проблем при запазването на позицията: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Отворени Позиции</h2>
          <p className="text-muted-foreground">Управлявайте кариерни позиции за вашата компания</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Добави позиция
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Редактирай позиция' : 'Добави нова позиция'}</DialogTitle>
              <DialogDescription>
                Попълнете информацията за позицията. Натиснете запази, когато сте готови.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Заглавие</FormLabel>
                      <FormControl>
                        <Input placeholder="Брокер недвижими имоти" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Отдел</FormLabel>
                        <FormControl>
                          <Input placeholder="Продажби" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Локация</FormLabel>
                        <FormControl>
                          <Input placeholder="София" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Описание</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Подробно описание на позицията и отговорностите..." 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Изисквания</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Необходими умения и квалификация..." 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Активна позиция</FormLabel>
                        <FormDescription>
                          Само активните позиции се показват на страницата за кариери
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" type="button" onClick={() => {
                      form.reset();
                      setEditingId(null);
                    }}>
                      Отказ
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Запази
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : positions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <p className="text-muted-foreground mb-4">Няма добавени позиции</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Добави първата позиция
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                  <DialogTitle>Добави нова позиция</DialogTitle>
                  <DialogDescription>
                    Попълнете информацията за позицията. Натиснете запази, когато сте готови.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Заглавие</FormLabel>
                          <FormControl>
                            <Input placeholder="Брокер недвижими имоти" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Отдел</FormLabel>
                            <FormControl>
                              <Input placeholder="Продажби" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Локация</FormLabel>
                            <FormControl>
                              <Input placeholder="София" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Описание</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Подробно описание на позицията и отговорностите..." 
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="requirements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Изисквания</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Необходими умения и квалификация..." 
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="is_active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Активна позиция</FormLabel>
                            <FormDescription>
                              Само активните позиции се показват на страницата за кариери
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" type="button" onClick={() => {
                          form.reset();
                          setEditingId(null);
                        }}>
                          Отказ
                        </Button>
                      </DialogClose>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Запази
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Позиция</TableHead>
                  <TableHead>Информация</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="w-[100px]">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.map((position) => (
                  <TableRow key={position.id}>
                    <TableCell className="font-medium">{position.title}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center text-sm text-muted-foreground mb-1">
                          <Users className="h-3 w-3 mr-1" />
                          {position.department}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          {position.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {position.is_active ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Активна</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Неактивна</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(position)}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[625px]">
                            <DialogHeader>
                              <DialogTitle>Редактирай позиция</DialogTitle>
                              <DialogDescription>
                                Попълнете информацията за позицията. Натиснете запази, когато сте готови.
                              </DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                  control={form.control}
                                  name="title"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Заглавие</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Брокер недвижими имоти" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                  <FormField
                                    control={form.control}
                                    name="department"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Отдел</FormLabel>
                                        <FormControl>
                                          <Input placeholder="Продажби" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Локация</FormLabel>
                                        <FormControl>
                                          <Input placeholder="София" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <FormField
                                  control={form.control}
                                  name="description"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Описание</FormLabel>
                                      <FormControl>
                                        <Textarea 
                                          placeholder="Подробно описание на позицията и отговорностите..." 
                                          className="min-h-[100px]"
                                          {...field} 
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="requirements"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Изисквания</FormLabel>
                                      <FormControl>
                                        <Textarea 
                                          placeholder="Необходими умения и квалификация..." 
                                          className="min-h-[100px]"
                                          {...field} 
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="is_active"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                      <div className="space-y-1 leading-none">
                                        <FormLabel>Активна позиция</FormLabel>
                                        <FormDescription>
                                          Само активните позиции се показват на страницата за кариери
                                        </FormDescription>
                                      </div>
                                    </FormItem>
                                  )}
                                />
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline" type="button" onClick={() => {
                                      form.reset();
                                      setEditingId(null);
                                    }}>
                                      Отказ
                                    </Button>
                                  </DialogClose>
                                  <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Запази
                                  </Button>
                                </DialogFooter>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete(position.id);
                          }}
                        >
                          <Trash2Icon className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Потвърждение за изтриване</DialogTitle>
            <DialogDescription>
              Сигурни ли сте, че искате да изтриете тази позиция? Това действие не може да бъде отменено.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отказ
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (positionToDelete) {
                  handleDelete(positionToDelete);
                }
              }}
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Изтрий
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CareersManagement; 