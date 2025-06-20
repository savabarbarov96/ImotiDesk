
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { uploadFilesToStorage } from "@/utils/storageHelpers";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

type CareerPosition = {
  id: string;
  title: string;
  department: string;
};

const applicationFormSchema = z.object({
  full_name: z.string().min(2, { message: "Името е задължително" }),
  email: z.string().email({ message: "Невалиден имейл адрес" }),
  phone: z.string().min(6, { message: "Телефонният номер е задължителен" }),
  position_id: z.string().optional(),
  cover_letter: z.string().optional(),
  cv_file: z.instanceof(FileList).optional(),
});

type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

const CareerApplicationForm = () => {
  const [positions, setPositions] = useState<CareerPosition[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      position_id: undefined,
      cover_letter: "",
    },
  });

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const { data, error } = await supabase
          .from('careers')
          .select('id, title, department')
          .eq('is_active', true)
          .order('title', { ascending: true });

        if (error) {
          throw error;
        }

        setPositions(data || []);
      } catch (error) {
        console.error('Error fetching positions:', error);
      }
    };

    fetchPositions();
  }, []);

  // Handle file upload
  const handleFileUpload = async (files: FileList | null): Promise<string | null> => {
    if (!files || files.length === 0) return null;
    
    try {
      // Start upload animation
      const animateProgress = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 5;
          if (progress >= 90) {
            clearInterval(interval);
          }
          setUploadProgress(progress);
        }, 100);
        
        return () => clearInterval(interval);
      };
      
      const stopAnimation = animateProgress();
      
      // Convert FileList to File array
      const fileArray = [files[0]];
      
      // Upload to storage
      const urls = await uploadFilesToStorage('careers', 'applications/', fileArray);
      
      // Complete upload animation
      stopAnimation();
      setUploadProgress(100);
      
      // Reset progress after a delay
      setTimeout(() => setUploadProgress(0), 1000);
      
      return urls[0] || null;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  const onSubmit = async (values: ApplicationFormValues) => {
    setIsSubmitting(true);
    
    try {
      let cv_url = null;
      
      // Upload CV if provided
      if (values.cv_file && values.cv_file.length > 0) {
        cv_url = await handleFileUpload(values.cv_file);
      }
      
      // Prepare application data
      const applicationData = {
        full_name: values.full_name,
        email: values.email,
        phone: values.phone,
        position_id: values.position_id || null,
        cover_letter: values.cover_letter || null,
        cv_url: cv_url,
      };
      
      // Save to database
      const { error } = await supabase
        .from('careers_applications')
        .insert([applicationData]);
      
      if (error) throw error;
      
      // Show success message
      toast({
        title: "Благодарим за интереса!",
        description: "Вашата кандидатура беше успешно изпратена.",
      });
      
      // Reset form
      form.reset();
      
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Възникна грешка",
        description: "Моля, опитайте отново по-късно или се свържете с нас директно.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto" id="career-application-form">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="position_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Позиция</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Изберете позиция" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="general">Обща кандидатура</SelectItem>
                      {positions.map((position) => (
                        <SelectItem key={position.id} value={position.id}>
                          {position.title} ({position.department})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Име и фамилия *</FormLabel>
                  <FormControl>
                    <Input placeholder="Въведете вашите имена" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имейл адрес *</FormLabel>
                    <FormControl>
                      <Input placeholder="example@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Телефон *</FormLabel>
                    <FormControl>
                      <Input placeholder="+359" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="cover_letter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Мотивационно писмо</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Споделете защо се интересувате от тази позиция..." 
                      className="min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cv_file"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Прикачете автобиография</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        onChange(e.target.files);
                      }}
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormMessage />
                  {uploadProgress > 0 && (
                    <Progress value={uploadProgress} className="h-2 w-full" />
                  )}
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Изпращане..." : "Изпратете кандидатура"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CareerApplicationForm;
