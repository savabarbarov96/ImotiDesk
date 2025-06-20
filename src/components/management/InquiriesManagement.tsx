import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Check, 
  ChevronDown,
  Calendar,
  Home,
  X
} from 'lucide-react';
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
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  useInquiries, 
  useMarkInquiryResponded,
  useDeleteInquiry,
  type Inquiry 
} from '@/hooks/use-inquiries';

// Extended inquiry type to include properties
interface InquiryWithProperty extends Inquiry {
  properties?: {
    title: string;
  };
}

// Helper function to safely format dates
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Невалидна дата';
    }
    return date.toLocaleDateString('bg-BG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Невалидна дата';
  }
};

const InquiriesManagement = () => {
  const { toast } = useToast();
  const { data: inquiries, isLoading, error } = useInquiries();
  const markResponded = useMarkInquiryResponded();
  const deleteInquiry = useDeleteInquiry();

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentInquiry, setCurrentInquiry] = useState<Inquiry | null>(null);

  // --- Start Debug Logs ---
  useEffect(() => {
    console.log('[InquiriesManagement] Detected change in inquiries data:', inquiries);
  }, [inquiries]);

  useEffect(() => {
    if (currentInquiry) {
      console.log('[InquiriesManagement] currentInquiry changed:', currentInquiry);
    }
  }, [currentInquiry]);
  // --- End Debug Logs ---

  // Open view dialog
  const handleViewClick = (inquiry: Inquiry) => {
    setCurrentInquiry(inquiry);
    setIsViewDialogOpen(true);
  };

  // Handle mark as responded
  const handleMarkResponded = (inquiryId: string, responded: boolean) => {
    markResponded.mutate({ id: inquiryId, responded }, {
      onSuccess: () => {
        toast({
          title: responded ? "Маркирано като отговорено" : "Маркирано като неотговорено",
          description: responded 
            ? "Запитването е маркирано като отговорено."
            : "Запитването е маркирано като неотговорено.",
        });
      },
      onError: (error) => {
        toast({
          title: "Грешка при промяна на статуса",
          description: error.message,
          variant: "destructive"
        });
      }
    });
  };

  // Handle delete inquiry
  const handleDeleteInquiry = (inquiryId: string) => {
    if (confirm("Сигурни ли сте, че искате да изтриете това запитване?")) {
      deleteInquiry.mutate(inquiryId, {
        onSuccess: () => {
          toast({
            title: "Запитването е изтрито успешно",
            description: "Запитването беше премахнато от системата.",
          });
          setIsViewDialogOpen(false);
        },
        onError: (error) => {
          toast({
            title: "Грешка при изтриване на запитването",
            description: error.message,
            variant: "destructive"
          });
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="mb-4 flex flex-col items-center">
          <div className="bg-red-100 text-red-800 p-3 rounded-full mb-4">
            <X className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Грешка при зареждане на запитванията</h3>
          <p className="text-neutral-500 mb-4">
            Възникна проблем при достъп до запитванията. Моля, опитайте отново.
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-red-700 hover:bg-red-800"
          >
            Опитайте отново
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Запитвания имоти</h2>
        <p className="text-muted-foreground mt-1">
          Преглед и управление на запитвания от потенциални клиенти.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inquiries && inquiries.map((inquiry: InquiryWithProperty) => (
          <Card key={inquiry.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold truncate pr-2">
                  {inquiry.properties?.title || "Запитване за имот"}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <ChevronDown size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewClick(inquiry)}>
                      <Eye size={14} className="mr-2" />
                      Преглед
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => handleMarkResponded(inquiry.id, !inquiry.responded)}>
                      <Check size={14} className="mr-2" />
                      {inquiry.responded ? "Маркирай като неотговорено" : "Маркирай като отговорено"}
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      onClick={() => handleDeleteInquiry(inquiry.id)}
                      className="text-red-600"
                    >
                      <X size={14} className="mr-2" />
                      Изтрий
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription className="flex flex-wrap gap-2 mt-2">
                <Badge variant={inquiry.responded ? "default" : "secondary"}>
                  {inquiry.responded ? "Отговорено" : "Чакащо"}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">От:</span>
                  <span className="font-medium">{inquiry.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Имейл:</span>
                  <span>{inquiry.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Телефон:</span>
                  <span>{inquiry.phone}</span>
                </div>
                {inquiry.message && (
                  <div>
                    <span className="text-muted-foreground">Съобщение:</span>
                    <p className="text-xs mt-1 line-clamp-2">{inquiry.message}</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <div className="text-xs text-muted-foreground">
                Създадено на: {formatDate(inquiry.created_at)}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* View Inquiry Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Детайли на запитването</DialogTitle>
            <DialogDescription>
              Пълна информация за запитването относно имот.
            </DialogDescription>
          </DialogHeader>

          {currentInquiry && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {(currentInquiry as InquiryWithProperty).properties?.title || "Запитване за имот"}
                </h3>
                <Badge variant={currentInquiry.responded ? "default" : "secondary"}>
                  {currentInquiry.responded ? "Отговорено" : "Чакащо"}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Имот</p>
                <div className="flex items-center">
                  <Home size={16} className="mr-2 text-muted-foreground" />
                  <p className="font-medium">{(currentInquiry as InquiryWithProperty).properties?.title || "Неизвестен имот"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Име</p>
                  <p className="font-medium">{currentInquiry.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Имейл</p>
                  <p className="font-medium">{currentInquiry.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Телефон</p>
                  <p className="font-medium">{currentInquiry.phone}</p>
                </div>
              </div>

              {currentInquiry.message && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Съобщение</p>
                  <p className="text-sm p-3 bg-gray-50 rounded-md">{currentInquiry.message}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-1">Дата на създаване</p>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2 text-muted-foreground" />
                  <p>{formatDate(currentInquiry.created_at)}</p>
                </div>
              </div>

              <div className="pt-4 flex gap-2 flex-wrap">
                <Button 
                  variant={currentInquiry.responded ? "outline" : "default"} 
                  className="gap-2"
                  onClick={() => {
                    handleMarkResponded(currentInquiry.id, !currentInquiry.responded);
                    setIsViewDialogOpen(false);
                  }}
                >
                  <Check size={16} />
                  {currentInquiry.responded ? "Маркирай като неотговорено" : "Маркирай като отговорено"}
                </Button>
                
                <Button 
                  variant="destructive" 
                  className="gap-2"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    handleDeleteInquiry(currentInquiry.id);
                  }}
                >
                  <X size={16} />
                  Изтрий
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="secondary" 
              onClick={() => setIsViewDialogOpen(false)}
            >
              Затвори
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {inquiries && inquiries.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Няма налични запитвания</p>
        </div>
      )}
    </div>
  );
};

export default InquiriesManagement; 