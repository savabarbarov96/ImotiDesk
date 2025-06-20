
import React from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ViewingDateSelectorProps {
  viewingDate: Date | undefined;
  setViewingDate: (date: Date | undefined) => void;
}

const ViewingDateSelector = ({ viewingDate, setViewingDate }: ViewingDateSelectorProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium">Select a Date for Viewing</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !viewingDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {viewingDate ? format(viewingDate, "PPP") : "Select date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={viewingDate}
            onSelect={setViewingDate}
            initialFocus
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ViewingDateSelector;
