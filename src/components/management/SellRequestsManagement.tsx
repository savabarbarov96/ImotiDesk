import React, { useState, useMemo, useEffect } from 'react';
import { 
  Eye, 
  Check, 
  X, 
  Calendar, 
  Home,
  ChevronDown,
  Filter,
  History,
  Trash2,
  Loader2
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/auth/use-user';
import { useNavigate } from 'react-router-dom';
import { 
  useSellRequests, 
  useUpdateSellRequestStatus,
  useDeleteSellRequest,
  type SellRequest
} from '@/hooks/use-sell-requests';

const SellRequestsManagement = () => {
  const { toast } = useToast();
  const { data: user } = useUser();
  const navigate = useNavigate();
  const { data: sellRequests, isLoading, error, refetch: refetchSellRequests } = useSellRequests();
  const updateStatus = useUpdateSellRequestStatus();
  const deleteSellRequest = useDeleteSellRequest();

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<SellRequest | null>(null);
  const [activeTab, setActiveTab] = useState('pending');

  // --- Start Debug Logs ---
  useEffect(() => {
    console.log('[SellRequestsManagement] Detected change in sellRequests data:', sellRequests);
  }, [sellRequests]);

  useEffect(() => {
    console.log('[SellRequestsManagement] Active tab changed to:', activeTab);
  }, [activeTab]);
  // --- End Debug Logs ---

  // Filter requests by status
  const filteredRequests = useMemo(() => {
    if (!sellRequests) {
      console.log('[SellRequestsManagement] filteredRequests: no sellRequests data, returning [].');
      return [];
    }
    let newFilteredRequests;
    switch (activeTab) {
      case 'pending':
        newFilteredRequests = sellRequests.filter(req => req.status === 'pending');
        break;
      case 'contacted':
        newFilteredRequests = sellRequests.filter(req => req.status === 'contacted');
        break;
      case 'converted':
        newFilteredRequests = sellRequests.filter(req => req.status === 'converted');
        break;
      case 'rejected':
        newFilteredRequests = sellRequests.filter(req => req.status === 'rejected');
        break;
      case 'all':
      default:
        newFilteredRequests = sellRequests;
        break;
    }
    console.log(`[SellRequestsManagement] filteredRequests for tab '${activeTab}':`, newFilteredRequests);
    return newFilteredRequests;
  }, [sellRequests, activeTab]);

  // Get counts for each status
  const statusCounts = useMemo(() => {
    if (!sellRequests) return { pending: 0, contacted: 0, converted: 0, rejected: 0, all: 0 };
    
    return {
      pending: sellRequests.filter(req => req.status === 'pending').length,
      contacted: sellRequests.filter(req => req.status === 'contacted').length,
      converted: sellRequests.filter(req => req.status === 'converted').length,
      rejected: sellRequests.filter(req => req.status === 'rejected').length,
      all: sellRequests.length
    };
  }, [sellRequests]);

  // Open view dialog
  const handleViewClick = (request: SellRequest) => {
    setCurrentRequest(request);
    setIsViewDialogOpen(true);
  };

  // Handle convert to property - redirect to add-property page
  const handleConvertClick = (request: SellRequest) => {
    // Store the request data in sessionStorage to pre-fill the form
    sessionStorage.setItem('convertSellRequest', JSON.stringify({
      id: request.id,
      title: request.title || `${request.property_type} в ${request.address.split(',')[1]?.trim() || 'града'}`,
      description: request.description || '',
      price: request.price || 0,
      address: request.address,
      city: request.address.split(',')[1]?.trim() || '',
      property_type: request.property_type,
      contact_name: request.name,
      contact_email: request.email,
      contact_phone: request.phone
    }));
    
    navigate('/management/add-property');
  };

  // Handle status update with loading feedback
  const handleStatusUpdate = (id: string, status: string) => {
    updateStatus.mutate({ id, status }, {
      onSuccess: () => {
        toast({
          title: "Статусът е обновен успешно",
          description: `Заявката е маркирана като ${status === 'contacted' ? 'контактирана' : status === 'converted' ? 'конвертирана' : status === 'rejected' ? 'отказана' : status}.`,
        });
        // refetchSellRequests(); // Manual refetch if needed, but invalidateQueries should handle it
      },
      onError: (error) => {
        toast({
          title: "Грешка при обновяване на статуса",
          description: error.message,
          variant: "destructive"
        });
      }
    });
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: string): "default" | "destructive" | "secondary" | "outline" => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'contacted':
        return 'default';
      case 'converted':
        return 'outline';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Format status display
  const formatStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Чакаща';
      case 'contacted':
        return 'Контактиран';
      case 'converted':
        return 'Конвертирана';
      case 'rejected':
        return 'Отказана';
      default:
        return status;
    }
  };

  // Handle delete request
  const handleDeleteRequest = (id: string) => {
    if (window.confirm("Сигурни ли сте, че искате да изтриете тази заявка? Тази операция е необратима.")) {
      deleteSellRequest.mutate(id, {
        onSuccess: () => {
          toast({
            title: "Заявката е изтрита успешно",
            description: "Заявката беше премахната от системата.",
          });
          setCurrentRequest(null); // Clear current request if it was deleted
          setIsViewDialogOpen(false); // Close dialog if open
          // The hook should handle query invalidation and refetch
        },
        onError: (error) => {
          toast({
            title: "Грешка при изтриване на заявката",
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
      <div className="text-center p-4">
        <p className="text-red-500">Грешка при зареждане на заявките: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Заявки за продажба</h2>
          <p className="text-muted-foreground mt-1">
            Преглед и управление на заявки за продажба от клиенти.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => {
            console.log('Manual refetch triggered');
            window.location.reload();
          }}
          className="gap-2"
        >
          <History size={16} />
          Обнови данните
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Filter size={16} />
            Чакащи
            {statusCounts.pending > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {statusCounts.pending}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="contacted" className="flex items-center gap-2">
            <Check size={16} />
            Контактирани
            {statusCounts.contacted > 0 && (
              <Badge variant="default" className="ml-1 text-xs">
                {statusCounts.contacted}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="converted" className="flex items-center gap-2">
            <Home size={16} />
            Конвертирани
            {statusCounts.converted > 0 && (
              <Badge variant="outline" className="ml-1 text-xs">
                {statusCounts.converted}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            <X size={16} />
            Отказани
            {statusCounts.rejected > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs">
                {statusCounts.rejected}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <History size={16} />
            Всички
            <Badge variant="secondary" className="ml-1 text-xs">
              {statusCounts.all}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6" key={`${activeTab}-${sellRequests?.length || 0}-${JSON.stringify(statusCounts)}`}>
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Filter className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Няма заявки в тази категория
              </h3>
              <p className="text-gray-500">
                {activeTab === 'pending' && 'Няма чакащи заявки за обработка.'}
                {activeTab === 'contacted' && 'Няма контактирани клиенти.'}
                {activeTab === 'converted' && 'Няма конвертирани заявки в имоти.'}
                {activeTab === 'rejected' && 'Няма отказани заявки.'}
                {activeTab === 'all' && 'Няма заявки за продажба.'}
              </p>
              {/* Debug info */}
              <div className="mt-4 text-xs text-gray-400">
                Debug: Total requests: {sellRequests?.length || 0}, Filtered: {filteredRequests.length}, Active tab: {activeTab}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequests.map((request) => (
                <Card key={request.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-semibold truncate pr-2">
                        {request.title || request.address.split(',')[0]}
                      </CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <ChevronDown size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewClick(request)}>
                            <Eye size={14} className="mr-2" />
                            Преглед
                          </DropdownMenuItem>
                          
                          {request.status !== 'converted' && (
                            <DropdownMenuItem onClick={() => handleConvertClick(request)}>
                              <Home size={14} className="mr-2" />
                              Конвертирай в имот
                            </DropdownMenuItem>
                          )}
                          
                          {request.status === 'pending' && (
                            <DropdownMenuItem onClick={() => handleStatusUpdate(request.id, 'contacted')}>
                              <Check size={14} className="mr-2" />
                              Маркирай като контактиран
                            </DropdownMenuItem>
                          )}
                          
                          {(request.status === 'pending' || request.status === 'contacted') && (
                            <DropdownMenuItem 
                              onClick={() => handleStatusUpdate(request.id, 'rejected')}
                              className="text-orange-600"
                            >
                              <X size={14} className="mr-2" />
                              Маркирай като отказан
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem 
                            onClick={() => handleDeleteRequest(request.id)}
                            className="text-red-600"
                          >
                            <Trash2 size={14} className="mr-2" />
                            Изтрий заявката
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription className="flex flex-wrap gap-2 mt-2">
                      <Badge variant={getStatusBadgeVariant(request.status)}>
                        {formatStatus(request.status)}
                      </Badge>
                      <Badge variant="outline">
                        {request.property_type}
                      </Badge>
                      {/* Debug info */}
                      <span className="text-xs text-gray-400">
                        (Status: {request.status})
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Клиент:</span>
                        <span className="font-medium">{request.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Контакт:</span>
                        <span>{request.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Телефон:</span>
                        <span>{request.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Адрес:</span>
                        <span className="text-right">{request.address}</span>
                      </div>
                      {request.price && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Очаквана цена:</span>
                          <span>{request.price.toLocaleString('bg-BG')} лв.</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="text-xs text-muted-foreground">
                      Създадена на: {new Date(request.created_at).toLocaleDateString('bg-BG')}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* View Request Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Детайли на заявката</DialogTitle>
            <DialogDescription>
              Пълна информация за заявката за продажба.
            </DialogDescription>
          </DialogHeader>

          {currentRequest && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {currentRequest.title || currentRequest.address.split(',')[0]}
                </h3>
                <Badge variant={getStatusBadgeVariant(currentRequest.status)}>
                  {formatStatus(currentRequest.status)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Тип имот</p>
                  <p className="font-medium">{currentRequest.property_type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Адрес</p>
                  <p className="font-medium">{currentRequest.address}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Име</p>
                  <p className="font-medium">{currentRequest.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Имейл</p>
                  <p className="font-medium">{currentRequest.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Телефон</p>
                  <p className="font-medium">{currentRequest.phone}</p>
                </div>
                {currentRequest.price && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Очаквана цена</p>
                    <p className="font-medium">{currentRequest.price.toLocaleString('bg-BG')} лв.</p>
                  </div>
                )}
              </div>

              {currentRequest.description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Описание</p>
                  <p className="text-sm">{currentRequest.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Дата на създаване</p>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2 text-muted-foreground" />
                    <p>{new Date(currentRequest.created_at).toLocaleDateString('bg-BG')}</p>
                  </div>
                </div>
                {currentRequest.consultation_date && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Дата за консултация</p>
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2 text-muted-foreground" />
                      <p>{new Date(currentRequest.consultation_date).toLocaleDateString('bg-BG')}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 flex gap-2 flex-wrap">
                {currentRequest.status === 'pending' && (
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    disabled={updateStatus.isPending}
                    onClick={() => {
                      handleStatusUpdate(currentRequest.id, 'contacted');
                      // setIsViewDialogOpen(false); // Keep dialog open to see changes or close manually
                    }}
                  >
                    {updateStatus.isPending && updateStatus.variables?.id === currentRequest.id && updateStatus.variables?.status === 'contacted' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check size={16} />}
                    {updateStatus.isPending && updateStatus.variables?.id === currentRequest.id && updateStatus.variables?.status === 'contacted' ? 'Обновява...' : 'Маркирай като контактиран'}
                  </Button>
                )}
                
                {currentRequest.status !== 'converted' && (
                  <Button 
                    className="gap-2"
                    onClick={() => {
                      // setIsViewDialogOpen(false); // Close dialog before navigating
                      handleConvertClick(currentRequest);
                    }}
                  >
                    <Home size={16} />
                    Конвертирай в имот
                  </Button>
                )}
                
                {(currentRequest.status === 'pending' || currentRequest.status === 'contacted') && (
                  <Button 
                    variant="outline" // Changed to outline for consistency
                    className="gap-2 text-orange-600 border-orange-600 hover:bg-orange-50 hover:text-orange-700"
                    disabled={updateStatus.isPending}
                    onClick={() => {
                      handleStatusUpdate(currentRequest.id, 'rejected');
                      // setIsViewDialogOpen(false);
                    }}
                  >
                    {updateStatus.isPending && updateStatus.variables?.id === currentRequest.id && updateStatus.variables?.status === 'rejected' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X size={16} />}
                    {updateStatus.isPending && updateStatus.variables?.id === currentRequest.id && updateStatus.variables?.status === 'rejected' ? 'Обновява...' : 'Маркирай като отказан'}
                  </Button>
                )}

                <Button 
                  variant="destructive" 
                  className="gap-2"
                  disabled={deleteSellRequest.isPending}
                  onClick={() => {
                    handleDeleteRequest(currentRequest.id);
                    // Dialog will be closed by handleDeleteRequest on success
                  }}
                >
                  {deleteSellRequest.isPending && deleteSellRequest.variables === currentRequest.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 size={16} />}
                  {deleteSellRequest.isPending && deleteSellRequest.variables === currentRequest.id ? 'Изтрива...' : 'Изтрий заявката'}
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

      {sellRequests && sellRequests.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Няма налични заявки за продажба</p>
        </div>
      )}
    </div>
  );
};

export default SellRequestsManagement; 