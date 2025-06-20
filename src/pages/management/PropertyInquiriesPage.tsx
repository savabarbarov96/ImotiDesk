import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, 
  Check, 
  ChevronDown,
  Calendar,
  Home,
  X,
  ArrowLeft,
  Search,
  Filter,
  Trash2,
  Phone,
  Mail,
  MessageCircle,
  MessageSquare,
  Clock,
  Loader2,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  useInquiries, 
  useMarkInquiryResponded,
  useDeleteInquiry,
  type Inquiry 
} from '@/hooks/use-inquiries';
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

const PropertyInquiriesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, loading } = useAuth();
  const { data: inquiries, isLoading, error } = useInquiries();
  const markResponded = useMarkInquiryResponded();
  const deleteInquiry = useDeleteInquiry();

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentInquiry, setCurrentInquiry] = useState<Inquiry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'responded'>('all');
  const [isOpen, setIsOpen] = useState(false);
  
  // Ref to track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

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

  // Filter inquiries based on search term and status
  const filteredInquiries = React.useMemo(() => {
    if (!inquiries) return [];
    
    return inquiries.filter((inquiry) => {
      const matchesSearch = 
        inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.phone.includes(searchTerm) ||
        (inquiry.message && inquiry.message.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = 
        statusFilter === 'all' ||
        (statusFilter === 'pending' && !inquiry.responded) ||
        (statusFilter === 'responded' && inquiry.responded);
      
      return matchesSearch && matchesStatus;
    });
  }, [inquiries, searchTerm, statusFilter]);

  // Open view dialog
  const handleViewClick = useCallback((inquiry: Inquiry) => {
    if (!isMountedRef.current) return;
    setCurrentInquiry(inquiry);
    setIsViewDialogOpen(true);
  }, []);

  // Close dialog handler
  const handleCloseDialog = useCallback(() => {
    if (!isMountedRef.current) return;
    setIsViewDialogOpen(false);
    // Use setTimeout to prevent race conditions
    setTimeout(() => {
      if (isMountedRef.current) {
        setCurrentInquiry(null);
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

  // Handle mark as responded
  const handleMarkResponded = useCallback(async (inquiryId: string, responded: boolean) => {
    if (!isMountedRef.current) return;
    try {
      await markResponded.mutateAsync({ id: inquiryId, responded });
      if (isMountedRef.current) {
        toast({
          title: responded ? "Маркирано като отговорено" : "Маркирано като неотговорено",
          description: responded 
            ? "Запитването е маркирано като отговорено."
            : "Запитването е маркирано като неотговорено.",
        });
      }
    } catch (error: unknown) {
      if (isMountedRef.current) {
        toast({
          title: "Грешка при промяна на статуса",
          description: error instanceof Error ? error.message : "Възникна неочаквана грешка",
          variant: "destructive"
        });
      }
    }
  }, [markResponded, toast]);

  // Handle delete inquiry
  const handleDeleteInquiry = useCallback(async (inquiryId: string) => {
    if (!window.confirm("Сигурни ли сте, че искате да изтриете това запитване? Тази операция е необратима.")) {
      return;
    }

    try {
      await deleteInquiry.mutateAsync(inquiryId);
      if (isMountedRef.current) {
        toast({
          title: "Запитването е изтрито успешно",
          description: "Запитването беше премахнато от системата.",
        });
        // Close dialog using the handler
        handleCloseDialog();
      }
    } catch (error: unknown) {
      console.error('Delete inquiry error:', error);
      if (isMountedRef.current) {
        toast({
          title: "Грешка при изтриване на запитването",
          description: error instanceof Error ? error.message : "Възникна неочаквана грешка",
          variant: "destructive"
        });
      }
      // Don't close dialog on error, let user try again or close manually
    }
  }, [deleteInquiry, toast, handleCloseDialog]);

  // Handle sidebar item click
  const handleItemClick = (item: SidebarItem) => {
    if (item.type === 'page' && item.path) {
      navigate(item.path);
    } else {
      navigate(`/management?section=${item.id}`);
    }
    setIsOpen(false);
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
                      item.id === 'property-inquiries'
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
                          item.id === 'property-inquiries'
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
                      item.id === 'property-inquiries'
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
                          item.id === 'property-inquiries'
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
                  <h3 className="text-xl font-bold mb-2">Грешка при зареждане на запитванията</h3>
                  <p className="text-neutral-500 mb-4">
                    Възникна проблем при достъп до запитванията. Моля, опитайте отново.
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
        <title>Запитвания имоти | Automation Aid Управление</title>
        <meta name="description" content="Управление на запитвания за имоти от клиенти" />
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
                    item.id === 'property-inquiries'
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
                        item.id === 'property-inquiries'
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
            <h1 className="text-2xl font-bold mb-6 md:mt-0 mt-8">Запитвания за имоти</h1>
            
            {/* Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Търсене по име, имейл, телефон или съобщение..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Филтър по статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Всички ({inquiries?.length || 0})</SelectItem>
                    <SelectItem value="pending">
                      Чакащи ({inquiries?.filter(i => !i.responded).length || 0})
                    </SelectItem>
                    <SelectItem value="responded">
                      Отговорени ({inquiries?.filter(i => i.responded).length || 0})
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Inquiries Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInquiries.map((inquiry) => (
                <Card key={inquiry.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-semibold truncate pr-2">
                        {(inquiry as any).properties?.title || "Запитване за имот"}
                      </CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <ChevronDown size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleDropdownAction(() => handleViewClick(inquiry))}>
                            <Eye size={14} className="mr-2" />
                            Преглед
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem onClick={() => handleDropdownAction(() => handleMarkResponded(inquiry.id, !inquiry.responded))}>
                            <Check size={14} className="mr-2" />
                            {inquiry.responded ? "Маркирай като неотговорено" : "Маркирай като отговорено"}
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            onClick={() => handleDropdownAction(() => handleDeleteInquiry(inquiry.id))}
                            className="text-red-600"
                          >
                            <Trash2 size={14} className="mr-2" />
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
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">От:</span>
                        <span className="font-medium">{inquiry.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{inquiry.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{inquiry.phone}</span>
                      </div>
                      {inquiry.message && (
                        <div className="flex items-start gap-2">
                          <MessageCircle className="h-3 w-3 text-muted-foreground mt-0.5" />
                          <p className="text-xs line-clamp-2">{inquiry.message}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(inquiry.created_at).toLocaleDateString('bg-BG', {
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

            {/* View Inquiry Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={(open) => {
              if (!open) {
                handleCloseDialog();
              } else {
                setIsViewDialogOpen(true);
              }
            }}>
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
                        {(currentInquiry as any).properties?.title || "Запитване за имот"}
                      </h3>
                      <Badge variant={currentInquiry.responded ? "default" : "secondary"}>
                        {currentInquiry.responded ? "Отговорено" : "Чакащо"}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Имот</p>
                      <div className="flex items-center">
                        <Home size={16} className="mr-2 text-muted-foreground" />
                        <p className="font-medium">{(currentInquiry as any).properties?.title || "Неизвестен имот"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Име</p>
                        <p className="font-medium">{currentInquiry.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Имейл</p>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">{currentInquiry.email}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Телефон</p>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{currentInquiry.phone}</p>
                      </div>
                    </div>

                    {currentInquiry.message && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Съобщение</p>
                        <div className="flex items-start gap-2">
                          <MessageCircle className="h-4 w-4 text-muted-foreground mt-1" />
                          <p className="text-sm p-3 bg-gray-50 rounded-md flex-1">{currentInquiry.message}</p>
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Дата на създаване</p>
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2 text-muted-foreground" />
                        <p>{new Date(currentInquiry.created_at).toLocaleDateString('bg-BG', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</p>
                      </div>
                    </div>

                    <div className="pt-4 flex gap-2 flex-wrap">
                      <Button 
                        variant={currentInquiry.responded ? "outline" : "default"} 
                        className="gap-2"
                        onClick={() => {
                          handleMarkResponded(currentInquiry.id, !currentInquiry.responded);
                          handleCloseDialog();
                        }}
                        disabled={markResponded.isPending}
                      >
                        <Check size={16} />
                        {currentInquiry.responded ? "Маркирай като неотговорено" : "Маркирай като отговорено"}
                      </Button>
                      
                      <Button 
                        variant="destructive" 
                        className="gap-2"
                        onClick={async () => {
                          try {
                            await handleDeleteInquiry(currentInquiry.id);
                            // Dialog will be closed by handleDeleteInquiry on success
                          } catch (error) {
                            // Error is already handled in handleDeleteInquiry
                            console.error('Delete error:', error);
                          }
                        }}
                        disabled={deleteInquiry.isPending}
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
            {filteredInquiries.length === 0 && (
              <div className="text-center py-10">
                <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {searchTerm || statusFilter !== 'all' ? 'Няма намерени запитвания' : 'Няма налични запитвания'}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Опитайте с различни критерии за търсене.'
                    : 'Запитванията от клиенти ще се появят тук.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyInquiriesPage;