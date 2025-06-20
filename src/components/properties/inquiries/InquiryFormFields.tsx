
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { InquiryFormData } from './types';

interface InquiryFormFieldsProps {
  register: UseFormRegister<InquiryFormData>;
  errors: FieldErrors<InquiryFormData>;
  isViewingRequest: boolean;
}

const InquiryFormFields = ({ register, errors, isViewingRequest }: InquiryFormFieldsProps) => {
  return (
    <>
      <div>
        <Input
          {...register('name', { required: 'Name is required' })}
          placeholder="Full Name"
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && (
          <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
        )}
      </div>
      
      <div>
        <Input
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          placeholder="Email"
          type="email"
          className={errors.email ? 'border-destructive' : ''}
        />
        {errors.email && (
          <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
        )}
      </div>
      
      <div>
        <Input
          {...register('phone', { 
            required: 'Phone number is required' 
          })}
          placeholder="Phone Number"
          type="tel"
          className={errors.phone ? 'border-destructive' : ''}
        />
        {errors.phone && (
          <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
        )}
      </div>
      
      <div>
        <Textarea
          {...register('message')}
          placeholder={isViewingRequest ? "Any specific details about your visit?" : "How can we help you?"}
          rows={4}
          className={errors.message ? 'border-destructive' : ''}
        />
        {errors.message && (
          <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
        )}
      </div>
    </>
  );
};

export default InquiryFormFields;
