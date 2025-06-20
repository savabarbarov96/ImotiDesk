
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormActionsProps {
  isLoading: boolean;
  isViewingRequest: boolean;
  setIsViewingRequest: (value: boolean) => void;
  hasViewingDate: boolean;
}

const FormActions = ({ 
  isLoading, 
  isViewingRequest, 
  setIsViewingRequest,
  hasViewingDate
}: FormActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button 
        type="submit" 
        disabled={isLoading || (isViewingRequest && !hasViewingDate)}
        className="flex-1"
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isViewingRequest ? "Schedule Viewing" : "Send Inquiry"}
      </Button>
      
      <Button 
        type="button" 
        variant="outline"
        onClick={() => {
          setIsViewingRequest(!isViewingRequest);
        }}
        className="flex-1"
      >
        {isViewingRequest ? "Just Send Inquiry" : "Schedule a Viewing"}
      </Button>
    </div>
  );
};

export default FormActions;
