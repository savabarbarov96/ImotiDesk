import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Dashboard from '@/components/management/Dashboard';
import PropertiesManagement from '@/components/management/PropertiesManagement';
import InquiriesManagement from '@/components/management/InquiriesManagement';
import SellRequestsManagement from '@/components/management/SellRequestsManagement';
import CareersManagement from '@/components/management/CareersManagement';
import TeamMembersManagement from '@/components/management/TeamMembersManagement';
import BlogManagement from '@/components/management/BlogManagement';
import SlideshowManagement from '@/components/management/SlideshowManagement';
import { ViberSettings } from "@/components/management/ViberSettings";
import SocialMediaLinksManagement from '@/components/management/SocialMediaLinksManagement';
import AnalyticsManagement from '@/components/management/AnalyticsManagement';
import ProfilesManagement from '@/components/management/ProfilesManagement';
import AddPropertyPage from './AddPropertyPage';
import EditPropertyPage from './EditPropertyPage';
import PropertyInquiriesPage from './PropertyInquiriesPage';
import SalesInquiriesPage from './SalesInquiriesPage';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate, useSearchParams, useLocation, Routes, Route } from 'react-router-dom';
import { Loader2, Home, MessageSquare, Building, BriefcaseBusiness, Users, FileText, Image, MessageCircle, Share2, BarChart2, LayoutDashboard, UserCog } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

// Sidebar item type definition
type SidebarItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  type?: 'section' | 'page';
  path?: string;
};

const ManagementPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const sectionParam = searchParams.get('section');
  const [activeSection, setActiveSection] = useState(sectionParam || 'dashboard');
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Check if we're on a sub-route
  const isSubRoute = location.pathname.includes('/management/') && location.pathname !== '/management';

  // Update active section when URL parameter changes
  useEffect(() => {
    if (sectionParam) {
      setActiveSection(sectionParam);
    }
  }, [sectionParam]);

  // Define sidebar items based on user role
  const getSidebarItems = (): SidebarItem[] => {
    const commonItems: SidebarItem[] = [
      { id: 'dashboard', label: 'Табло', icon: <LayoutDashboard className="w-5 h-5" />, type: 'section' },
      { id: 'properties', label: 'Имоти', icon: <Building className="w-5 h-5" />, type: 'section' },
    ];

    // Agent-only items
    if (profile?.role === 'agent') {
      return commonItems;
    }

    // Admin items (full access)
    return [
      ...commonItems,
      { id: 'profiles', label: 'Профили', icon: <UserCog className="w-5 h-5" />, type: 'section' },
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
  };

  const sidebarItems = getSidebarItems();

  // Redirect if not authenticated or not authorized
  useEffect(() => {
    let mounted = true;
    let hasAttemptedRedirect = false;

    const checkAuth = async () => {
      // Only redirect if the component is still mounted, we're done loading, and haven't attempted a redirect yet
      if (mounted && !loading && !hasAttemptedRedirect) {
        hasAttemptedRedirect = true;
        
        if (!user) {
          console.log("No user found, redirecting to login");
          navigate('/login', { replace: true });
        } else if (profile && !['admin', 'agent'].includes(profile.role)) {
          console.log("User doesn't have required role, redirecting to home");
          navigate('/', { replace: true });
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [user, profile, loading, navigate]);

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

  // Handle section change or navigation
  const handleItemClick = (item: SidebarItem) => {
    if (item.type === 'page' && item.path) {
      navigate(item.path);
    } else {
      setActiveSection(item.id);
    }
    setIsOpen(false); // Close mobile menu if open
  };

  // Render the content based on the active section
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard onSectionChange={(section: string) => setActiveSection(section)} />;
      case 'properties':
        return <PropertiesManagement />;
      case 'profiles':
        // Only render if user is admin
        return profile?.role === 'admin' ? <ProfilesManagement /> : <PropertiesManagement />;
      case 'careers':
        return <CareersManagement />;
      case 'team':
        return <TeamMembersManagement />;
      case 'blog':
        return <BlogManagement />;
      case 'analytics':
        return <AnalyticsManagement />;
      case 'slideshow':
        return <SlideshowManagement />;
      case 'viber':
        return <ViberSettings />;
      case 'social-media':
        return <SocialMediaLinksManagement />;
      default:
        return <Dashboard onSectionChange={(section: string) => setActiveSection(section)} />;
    }
  };

  const SidebarContent = () => (
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
              "flex items-center justify-start gap-3 w-full px-3 py-2 text-sm rounded-md transition-colors",
              (activeSection === item.id && item.type === 'section') || 
              (item.type === 'page' && location.pathname === item.path)
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
  );

  return (
    <Routes>
      <Route path="add-property" element={<AddPropertyPage />} />
      <Route path="edit-property/:id" element={<EditPropertyPage />} />
      <Route path="property-inquiries" element={<PropertyInquiriesPage />} />
      <Route path="sales-inquiries" element={<SalesInquiriesPage />} />
      <Route path="*" element={
        <div className="min-h-screen flex flex-col">
          <Helmet>
            <title>Управление на имоти | Automation Aid</title>
          </Helmet>
          <Navbar />
          
          <div className="flex-grow flex">
            {/* Desktop Sidebar */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 hidden md:block">
              <SidebarContent />
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
                  <SidebarContent />
                </SheetContent>
              </Sheet>
            </div>

            {/* Main content */}
            <div className="flex-1 p-6 overflow-auto">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 md:mt-0 mt-8">
                  {sidebarItems.find(item => item.id === activeSection)?.label || 'Управление'}
                </h1>
                {renderContent()}
              </div>
            </div>
          </div>

          {/* <Footer /> */}
        </div>
      } />
    </Routes>
  );
};

export default ManagementPage; 