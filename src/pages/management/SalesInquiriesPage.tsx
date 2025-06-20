import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
  Eye, 
  Check, 
  X, 
  Calendar, 
  Home,
  ChevronDown,
  Filter,
  Trash2,
  Loader2,
  ArrowLeft,
  Search,
  Phone,
  Mail,
  MapPin,
  Building2,
  Euro,
  MessageCircle,
  MessageSquare,
  Clock,
  ShoppingCart,
  User,
  AlertCircle,
  LayoutDashboard,
  Building,
  BriefcaseBusiness,
  Users,
  FileText,
  Image,
  Share2,
  BarChart2,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  useSellRequests, 
  useUpdateSellRequestStatus,
  useDeleteSellRequest,
  type SellRequest
} from '@/hooks/use-sell-requests';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Sidebar item type definition
type SidebarItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  type?: 'section' | 'page';
  path?: string;
};

const SalesInquiriesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, loading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'contacted' | 'converted' | 'rejected' | 'all'>('pending');
  const [selectedRequest, setSelectedRequest] = useState<SellRequest | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // Ref to track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  // Fetch sell requests
  const { data: sellRequests = [], isLoading, error } = useSellRequests();
  const updateStatus = useUpdateSellRequestStatus();
  const deleteSellRequest = useDeleteSellRequest();

  // Define sidebar items
  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Табло', icon: <LayoutDashboard className="w-5 h-5" />, type: 'section' },
    { id: 'properties', label: 'Имоти', icon: <Building className="w-5 h-5" />, type: 'section' },
    { id: 'sales-inquiries', label: 'Заявки за продажба', icon: <MessageSquare className="w-5 h-5" />, type: 'page', path: '/management/sales-inquiries' },
    { id: 'property-inquiries', label: 'Запитвания имоти', icon: <MessageCircle className="w-5 h-5" />, type: 'page', path: '/management/property-inquiries' },
    { id: 'careers', label: 'Отворени Позиции', icon: <BriefcaseBusiness className="w-5 h-5" />, type: 'section' },
    { id: 'team', label: 'Нашият Екип', icon: <Users className="w-5 h-5" />, type: 'section' },
    { id: 'blog', label: 'Новини', icon: <FileText className="w-5 h-5" />, type: 'section' },
    { id: 'analytics', label: 'Аналитика', icon: <BarChart2 className="w-5 h-5" />, type: 'section' },
    { id: 'slideshow', label: 'Начален Слайдшоу', icon: <Image className="w-5 h-5" />, type: 'section' },
    { id: 'viber', label: 'Viber Настройки', icon: <MessageCircle className="w-5 h-5 text-[#7360f2]" />, type: 'section' },
    { id: 'social-media', label: 'Социални Медии', icon: <Share2 className="w-5 h-5" />, type: 'section' },
  ];

  // Redirect if not authenticated or not authorized
  React.useEffect(() => {
    if (!loading && (!user || !profile || !['admin', 'agent'].includes(profile.role))) {
      navigate('/login', { replace: true });
    }
  }, [user, profile, loading, navigate]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Filter requests by status and search term
  const filteredRequests = useMemo(() => {
    if (!sellRequests) return [];
    
    let filtered = sellRequests;
    
    // Filter by status
    if (activeTab !== 'all') {
      filtered = filtered.filter(req => req.status === activeTab);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(req => 
        req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.phone.includes(searchTerm) ||
        req.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.property_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (req.title && req.title.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return filtered;
  }, [sellRequests, activeTab, searchTerm]);

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
  const handleViewClick = useCallback((request: SellRequest) => {
    if (!isMountedRef.current) return;
    setSelectedRequest(request);
    setIsViewDialogOpen(true);
  }, []);

  // Close dialog handler
  const handleCloseDialog = useCallback(() => {
    if (!isMountedRef.current) return;
    setIsViewDialogOpen(false);
    // Use setTimeout to prevent race conditions
    setTimeout(() => {
      if (isMountedRef.current) {
        setSelectedRequest(null);
      }
    }, 100);
  }, []);

  // Helper function to handle dropdown actions with proper focus management
  const handleDropdownAction = useCallback((action: () => void) => {
    // Blur the currently focused element to prevent aria-hidden conflicts
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    // Use setTimeout to allow the blur to take effect before executing the action
    setTimeout(() => {
      if (isMountedRef.current) {
        action();
      }
    }, 10);
  }, []);

  // Handle status update
  const handleStatusUpdate = useCallback(async (id: string, status: string) => {
    if (!isMountedRef.current) return;
    try {
      await updateStatus.mutateAsync({ id, status });
      if (isMountedRef.current) {
        toast({
          title: "Статусът е обновен успешно",
          description: `Заявката е маркирана като ${formatStatus(status).toLowerCase()}.`,
        });
      }
    } catch (error: unknown) {
      if (isMountedRef.current) {
        toast({
          title: "Грешка при обновяване на статуса",
          description: error instanceof Error ? error.message : "Възникна неочаквана грешка",
          variant: "destructive"
        });
      }
    }
  }, [updateStatus, toast]);

  // Handle delete request
  const handleDeleteRequest = useCallback(async (id: string) => {
    if (!window.confirm("Сигурни ли сте, че искате да изтриете тази заявка? Тази операция е необратима.")) {
      return;
    }

    try {
      await deleteSellRequest.mutateAsync(id);
      if (isMountedRef.current) {
        toast({
          title: "Заявката е изтрита успешно",
          description: "Заявката беше премахната от системата.",
        });
        // Close dialog using the handler
        handleCloseDialog();
      }
    } catch (error: unknown) {
      console.error('Delete request error:', error);
      if (isMountedRef.current) {
        toast({
          title: "Грешка при изтриване на заявката",
          description: error instanceof Error ? error.message : "Възникна неочаквана грешка",
          variant: "destructive"
        });
      }
      // Don't close dialog on error, let user try again or close manually
    }
  }, [deleteSellRequest, toast, handleCloseDialog]);

  // Handle convert to property
  const handleConvertClick = (request: SellRequest) => {
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

  // Handle sidebar item click
  const handleItemClick = (item: SidebarItem) => {
    if (item.type === 'page' && item.path) {
      navigate(item.path);
    } else {
      navigate(`/management?section=${item.id}`);
    }
    setIsOpen(false);
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

  // Show loading state while checking authentication
  if (loading || !user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Проверка на достъп...</p>
        </div>
      </div>
    );
  }

  // If not authorized, don't render anything (redirect will happen)
  if (!['admin', 'agent'].includes(profile.role)) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow flex">
          {/* Desktop Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 hidden md:block">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Админ Панел</h2>
                <p className="text-sm text-gray-500">Управление на съдържание</p>
              </div>
              <nav className="p-4 space-y-1 flex-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={cn(
                      "flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md transition-colors",
                      item.id === 'sales-inquiries'
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Mobile Sidebar */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="fixed top-20 left-4 z-50">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="h-full flex flex-col">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Админ Панел</h2>
                    <p className="text-sm text-gray-500">Управление на съдържание</p>
                  </div>
                  <nav className="p-4 space-y-1 flex-1">
                    {sidebarItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        className={cn(
                          "flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md transition-colors",
                          item.id === 'sales-inquiries'
                            ? "bg-gray-100 text-gray-900 font-medium"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        )}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Main content */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow flex">
          {/* Desktop Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 hidden md:block">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Админ Панел</h2>
                <p className="text-sm text-gray-500">Управление на съдържание</p>
              </div>
              <nav className="p-4 space-y-1 flex-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={cn(
                      "flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md transition-colors",
                      item.id === 'sales-inquiries'
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Mobile Sidebar */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="fixed top-20 left-4 z-50">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="h-full flex flex-col">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Админ Панел</h2>
                    <p className="text-sm text-gray-500">Управление на съдържание</p>
                  </div>
                  <nav className="p-4 space-y-1 flex-1">
                    {sidebarItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        className={cn(
                          "flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md transition-colors",
                          item.id === 'sales-inquiries'
                            ? "bg-gray-100 text-gray-900 font-medium"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        )}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Main content */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <div className="text-center p-8">
                <div className="mb-4 flex flex-col items-center">
                  <div className="bg-red-100 text-red-800 p-3 rounded-full mb-4">
                    <X className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Грешка при зареждане на заявките</h3>
                  <p className="text-neutral-500 mb-4">
                    Възникна проблем при достъп до заявките. Моля, опитайте отново.
                  </p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    className="bg-red-700 hover:bg-red-800"
                  >
                    Презареди страницата
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Заявки за продажба | Automation Aid Управление</title>
        <meta name="description" content="Управление на заявки за продажба от клиенти" />
      </Helmet>
      
      <div className="flex-grow flex">
        {/* Desktop Sidebar */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 hidden md:block">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Админ Панел</h2>
              <p className="text-sm text-gray-500">Управление на съдържание</p>
            </div>
            <nav className="p-4 space-y-1 flex-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md transition-colors",
                    item.id === 'sales-inquiries'
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="fixed top-20 left-4 z-50">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-800">Админ Панел</h2>
                  <p className="text-sm text-gray-500">Управление на съдържание</p>
                </div>
                <nav className="p-4 space-y-1 flex-1">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className={cn(
                        "flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md transition-colors",
                        item.id === 'sales-inquiries'
                          ? "bg-gray-100 text-gray-900 font-medium"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Main content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 md:mt-0 mt-8">Заявки за продажба</h1>
            
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Търсене по име, имейл, телефон, адрес или тип имот..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Tabs */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'pending' | 'contacted' | 'converted' | 'rejected' | 'all')} className="mb-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="pending" className="gap-2">
                  <Clock className="h-4 w-4" />
                  Чакащи ({statusCounts.pending})
                </TabsTrigger>
                <TabsTrigger value="contacted" className="gap-2">
                  <Phone className="h-4 w-4" />
                  Контактирани ({statusCounts.contacted})
                </TabsTrigger>
                <TabsTrigger value="converted" className="gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Конвертирани ({statusCounts.converted})
                </TabsTrigger>
                <TabsTrigger value="rejected" className="gap-2">
                  <X className="h-4 w-4" />
                  Отказани ({statusCounts.rejected})
                </TabsTrigger>
                <TabsTrigger value="all" className="gap-2">
                  Всички ({statusCounts.all})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Requests Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequests.map((request) => (
                <Card key={request.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-semibold truncate pr-2">
                        {request.title || `${request.property_type} за продажба`}
                      </CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <ChevronDown size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleDropdownAction(() => handleViewClick(request))}>
                            <Eye size={14} className="mr-2" />
                            Преглед
                          </DropdownMenuItem>
                          
                          {request.status === 'pending' && (
                            <>
                              <DropdownMenuItem onClick={() => handleDropdownAction(() => handleStatusUpdate(request.id, 'contacted'))}>
                                <Phone size={14} className="mr-2" />
                                Маркирай като контактиран
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDropdownAction(() => handleConvertClick(request))}>
                                <Building2 size={14} className="mr-2" />
                                Конвертирай в имот
                              </DropdownMenuItem>
                            </>
                          )}
                          
                          {request.status === 'contacted' && (
                            <>
                              <DropdownMenuItem onClick={() => handleDropdownAction(() => handleConvertClick(request))}>
                                <Building2 size={14} className="mr-2" />
                                Конвертирай в имот
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDropdownAction(() => handleStatusUpdate(request.id, 'rejected'))}>
                                <X size={14} className="mr-2" />
                                Маркирай като отказана
                              </DropdownMenuItem>
                            </>
                          )}
                          
                          <DropdownMenuItem 
                            onClick={() => handleDropdownAction(() => handleDeleteRequest(request.id))}
                            className="text-red-600"
                          >
                            <Trash2 size={14} className="mr-2" />
                            Изтрий
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription className="flex flex-wrap gap-2 mt-2">
                      <Badge variant={getStatusBadgeVariant(request.status)}>
                        {formatStatus(request.status)}
                      </Badge>
                      <Badge variant="outline">{request.property_type}</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">От:</span>
                        <span className="font-medium">{request.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{request.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{request.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{request.address}</span>
                      </div>
                      {request.price && (
                        <div className="flex items-center gap-2">
                          <Euro className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs font-medium">{request.price.toLocaleString()} лв.</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(request.created_at).toLocaleDateString('bg-BG', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* View Request Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={(open) => {
              if (!open) {
                handleCloseDialog();
              } else {
                setIsViewDialogOpen(true);
              }
            }}>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Детайли на заявката за продажба</DialogTitle>
                  <DialogDescription>
                    Пълна информация за заявката за продажба на имот.
                  </DialogDescription>
                </DialogHeader>

                {selectedRequest && (
                  <div className="space-y-4 py-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        {selectedRequest.title || `${selectedRequest.property_type} за продажба`}
                      </h3>
                      <div className="flex gap-2">
                        <Badge variant={getStatusBadgeVariant(selectedRequest.status)}>
                          {formatStatus(selectedRequest.status)}
                        </Badge>
                        <Badge variant="outline">{selectedRequest.property_type}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Име</p>
                        <p className="font-medium">{selectedRequest.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Имейл</p>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">{selectedRequest.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Телефон</p>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">{selectedRequest.phone}</p>
                        </div>
                      </div>
                      {selectedRequest.price && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Цена</p>
                          <div className="flex items-center gap-2">
                            <Euro className="h-4 w-4 text-muted-foreground" />
                            <p className="font-medium">{selectedRequest.price.toLocaleString()} лв.</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Адрес</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{selectedRequest.address}</p>
                      </div>
                    </div>

                    {selectedRequest.description && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Описание</p>
                        <div className="flex items-start gap-2">
                          <MessageCircle className="h-4 w-4 text-muted-foreground mt-1" />
                          <p className="text-sm p-3 bg-gray-50 rounded-md flex-1">{selectedRequest.description}</p>
                        </div>
                      </div>
                    )}

                    {selectedRequest.consultation_date && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Желана дата за консултация</p>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">
                            {new Date(selectedRequest.consultation_date).toLocaleDateString('bg-BG', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Дата на създаване</p>
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2 text-muted-foreground" />
                        <p>{new Date(selectedRequest.created_at).toLocaleDateString('bg-BG', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</p>
                      </div>
                    </div>

                    <div className="pt-4 flex gap-2 flex-wrap">
                      {selectedRequest.status === 'pending' && (
                        <>
                          <Button 
                            variant="default"
                            className="gap-2"
                            onClick={() => {
                              handleStatusUpdate(selectedRequest.id, 'contacted');
                              handleCloseDialog();
                            }}
                            disabled={updateStatus.isPending}
                          >
                            <Phone size={16} />
                            Маркирай като контактиран
                          </Button>
                          <Button 
                            variant="outline"
                            className="gap-2"
                            onClick={() => {
                              handleConvertClick(selectedRequest);
                            }}
                          >
                            <Building2 size={16} />
                            Конвертирай в имот
                          </Button>
                        </>
                      )}
                      
                      {selectedRequest.status === 'contacted' && (
                        <>
                          <Button 
                            variant="default"
                            className="gap-2"
                            onClick={() => {
                              handleConvertClick(selectedRequest);
                            }}
                          >
                            <Building2 size={16} />
                            Конвертирай в имот
                          </Button>
                          <Button 
                            variant="outline"
                            className="gap-2"
                            onClick={() => {
                              handleStatusUpdate(selectedRequest.id, 'rejected');
                              handleCloseDialog();
                            }}
                            disabled={updateStatus.isPending}
                          >
                            <X size={16} />
                            Маркирай като отказана
                          </Button>
                        </>
                      )}
                      
                      <Button 
                        variant="destructive" 
                        className="gap-2"
                        onClick={async () => {
                          try {
                            await handleDeleteRequest(selectedRequest.id);
                            // Dialog will be closed by handleDeleteRequest on success
                          } catch (error) {
                            // Error is already handled in handleDeleteRequest
                            console.error('Delete error:', error);
                          }
                        }}
                        disabled={deleteSellRequest.isPending}
                      >
                        <Trash2 size={16} />
                        Изтрий
                      </Button>
                    </div>
                  </div>
                )}

                <DialogFooter>
                  <Button 
                    variant="secondary" 
                    onClick={handleCloseDialog}
                  >
                    Затвори
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Empty State */}
            {filteredRequests.length === 0 && (
              <div className="text-center py-10">
                <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {searchTerm ? 'Няма намерени заявки' : activeTab === 'all' ? 'Няма налични заявки' : `Няма ${formatStatus(activeTab).toLowerCase()} заявки`}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm 
                    ? 'Опитайте с различни критерии за търсене.'
                    : 'Заявките за продажба от клиенти ще се появят тук.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesInquiriesPage;