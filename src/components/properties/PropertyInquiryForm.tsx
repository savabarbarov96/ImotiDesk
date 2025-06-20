import React from 'react';
import { useInquirySubmission } from './inquiries/useInquirySubmission';
import { InquirySubmissionProps } from './inquiries/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Clock } from 'lucide-react';

const PropertyInquiryForm = ({ propertyId, propertyTitle }: InquirySubmissionProps) => {
  const {
    isLoading,
    register,
    handleSubmit,
    errors,
    onSubmit
  } = useInquirySubmission(propertyId);
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-3">
        <div>
          <Label htmlFor="name">Вашето име</Label>
          <Input
            id="name"
            placeholder="Въведете вашето име"
            {...register('name', { required: 'Името е задължително' })}
            className={errors.name ? 'border-gray-500' : ''}
          />
          {errors.name && (
            <p className="text-gray-600 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="email">Имейл адрес</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              {...register('email', { 
                required: 'Имейлът е задължителен',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Невалиден имейл адрес'
                }
              })}
              className={errors.email ? 'border-gray-500' : ''}
            />
            {errors.email && (
              <p className="text-gray-600 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="phone">Телефон</Label>
            <Input
              id="phone"
              placeholder="+359 88 888 8888"
              {...register('phone', { required: 'Телефонът е задължителен' })}
              className={errors.phone ? 'border-gray-500' : ''}
            />
            {errors.phone && (
              <p className="text-gray-600 text-xs mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>
        
        <div>
          <Label htmlFor="preferred_contact_time" className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            Удобно време за контакт
          </Label>
          <Input
            id="preferred_contact_time"
            placeholder="напр. утре след 18:00"
            {...register('preferred_contact_time')}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            По избор - опишете кога е най-удобно да се свържем с вас
          </p>
        </div>
        
        <div>
          <Label htmlFor="message">Съобщение</Label>
          <Textarea
            id="message"
            placeholder={`Здравейте, интересувам се от имот "${propertyTitle}". Моля, свържете се с мен за повече информация.`}
            rows={4}
            {...register('message', { required: 'Съобщението е задължително' })}
            className={errors.message ? 'border-gray-500' : ''}
          />
          {errors.message && (
            <p className="text-gray-600 text-xs mt-1">{errors.message.message}</p>
          )}
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-gray-800 hover:bg-gray-900 text-white" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Изпращане...
          </>
        ) : (
          'Изпратете запитване'
        )}
      </Button>
      
      <p className="text-xs text-gray-500 text-center">
        Изпращайки това запитване, се съгласявате да получите отговор от нашите агенти по посочените от вас контакти.
      </p>
    </form>
  );
};

export default PropertyInquiryForm;
