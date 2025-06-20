import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { InquiryFormData } from './types';

export const useInquirySubmission = (propertyId: string) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<InquiryFormData>();
  
  const onSubmit = async (data: InquiryFormData) => {
    setIsLoading(true);
    
    try {
      // Prepare the message with preferred contact time if provided
      let finalMessage = data.message;
      
      if (data.preferred_contact_time && data.preferred_contact_time.trim()) {
        finalMessage += `\n\nПредпочитано време за контакт: ${data.preferred_contact_time.trim()}`;
      }
      
      // Prepare the inquiry data - only include user_id if the user is authenticated
      const inquiryData = {
        property_id: propertyId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: finalMessage,
        responded: false,
      };
      
      // Add user_id only if authenticated
      if (user?.id) {
        // @ts-expect-error - Dynamically adding a property
        inquiryData.user_id = user.id;
      }
      
      // Submit the inquiry
      const { error: inquiryError } = await supabase
        .from('inquiries')
        .insert(inquiryData);
      
      if (inquiryError) throw inquiryError;
      
      toast({
        title: "Успешно",
        description: "Запитването беше изпратено успешно!"
      });
      
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Грешка",
        description: "Неуспешно изпращане на запитването. Моля, опитайте отново.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    register,
    handleSubmit,
    errors,
    onSubmit,
    setValue,
    watch
  };
};
