import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from './hooks/use-auth';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import ErrorBoundary from './components/ErrorBoundary';
import RouteErrorBoundary from './components/RouteErrorBoundary';
import { LoadingFallback } from './components/ui/loading-fallback';
import { PropertyModalProvider } from './components/properties/PropertyModalProvider';
import { MotionProvider } from './lib/animations/motion-provider';
import { EnhancedPageTransition } from './lib/animations/enhanced-page-transitions';

// Import pages
import Index from './pages/Index';
import Auth from './pages/Auth';
import AboutPage from './pages/AboutPage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetail from './pages/PropertyDetail';
import SellPage from './pages/SellPage';
import CareersPage from './pages/CareersPage';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import ServicesPage from './pages/ServicesPage';
import BlogIndexPage from './pages/blog/index';
import BlogPostPage from './pages/blog/[slug]';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import CookiesPage from './pages/CookiesPage';
import MakeAdmin from './pages/admin/make-admin';
import ManagementPage from './pages/management';
import TubelightNavbarDemo from './pages/TubelightNavbarDemo';
import TestPage from './pages/TestPage';
import TransitionsDemo from './pages/TransitionsDemo';

// Admin pages
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProfilesAdmin from './pages/admin/ProfilesAdmin';
import Users from './pages/admin/Users';
import Properties from './pages/admin/Properties';
import Inquiries from './pages/admin/Inquiries';
import SellRequests from './pages/admin/SellRequests';
import BlogAdmin from './pages/admin/BlogAdmin';
import CareersAdmin from './pages/admin/CareersAdmin';
import ServicesAdmin from './pages/admin/ServicesAdmin';
import Settings from './pages/admin/Settings';

import { ReactLenis, useLenis } from 'lenis/react'

// Import our enhanced navbar and navigation items
import { TransparentNavbar } from './components/ui/transparent-navbar';
import { mainNavItems } from './data/navigation-items';

// Root layout with providers
const AppRoot = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  const isMainPage = location.pathname === '/';

  // Add custom scrollbar styles and Montserrat font
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Import Montserrat font for Bulgarian */
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
      
      /* Apply Montserrat font to the entire website */
      body {
        font-family: 'Montserrat', sans-serif;
      }
      
      /* Custom Scrollbar Styles - Premium Minimal Design */
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      
      ::-webkit-scrollbar-track {
        background: #eaeef5;
        border-radius: 3px;
        margin: 1px;
      }
      
      ::-webkit-scrollbar-thumb {
        background: rgba(82, 82, 82, 0.4);
        border-radius: 3px;
        border: 1px solid rgba(255, 255, 255, 0.03);
        transition: all 0.2s ease;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(128, 128, 128, 0.6);
      }
      
      ::-webkit-scrollbar-corner {
        background: transparent;
      }
    `;
    document.head.appendChild(style);
    
    // Add Montserrat font preload
    const linkPreload = document.createElement('link');
    linkPreload.rel = 'preconnect';
    linkPreload.href = 'https://fonts.googleapis.com';
    document.head.appendChild(linkPreload);

    const linkPreload2 = document.createElement('link');
    linkPreload2.rel = 'preconnect';
    linkPreload2.href = 'https://fonts.gstatic.com';
    linkPreload2.crossOrigin = 'anonymous';
    document.head.appendChild(linkPreload2);
    
    // Add some padding to the top of the body to compensate for the fixed navbar
    const addBodyPadding = () => {
      // Skip padding for main page (TestPage has its own navbar)
      if (isMainPage) {
        document.body.style.paddingTop = '0';
        return;
      }
      
      if (window.innerWidth < 768) {
        document.body.style.paddingTop = '60px';
      } else {
        document.body.style.paddingTop = '80px';
      }
    };

    // Initial call and set listener
    addBodyPadding();
    window.addEventListener('resize', addBodyPadding);

    return () => {
      document.head.removeChild(style);
      document.head.removeChild(linkPreload);
      document.head.removeChild(linkPreload2);
      document.body.style.paddingTop = '';
      window.removeEventListener('resize', addBodyPadding);
    };
  }, [isMainPage]);
  
  return (
    <ReactLenis root>
      <AuthProvider>
        <PropertyModalProvider>
          <MotionProvider>
            {!isAuthPage && !isMainPage && <TransparentNavbar items={mainNavItems} isDark={false} />}
            <EnhancedPageTransition>
              <Outlet />
            </EnhancedPageTransition>
          </MotionProvider>
        </PropertyModalProvider>
      </AuthProvider>
    </ReactLenis>
  );
};

// Define routes configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppRoot />,
    errorElement: <RouteErrorBoundary />,
        children: [      {        index: true,        element: (          <Suspense fallback={<LoadingFallback />}>            <TestPage />          </Suspense>        )      },      {        path: "deprecated",        element: (          <Suspense fallback={<LoadingFallback />}>            <Index />          </Suspense>        )      },
      { 
        path: "auth", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Auth />
          </Suspense>
        ) 
      },
      { 
        path: "about", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AboutPage />
          </Suspense>
        ) 
      },
      { 
        path: "properties", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PropertiesPage />
          </Suspense>
        ) 
      },
      { 
        path: "properties/:id", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PropertyDetail />
          </Suspense>
        ) 
      },
      { 
        path: "sell", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <SellPage />
          </Suspense>
        ) 
      },
      { 
        path: "careers", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <CareersPage />
          </Suspense>
        ) 
      },
      { 
        path: "services", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ServicesPage />
          </Suspense>
        ) 
      },
      { 
        path: "news", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <BlogIndexPage />
          </Suspense>
        ) 
      },
      { 
        path: "news/:slug", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <BlogPostPage />
          </Suspense>
        ) 
      },
      { 
        path: "terms", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <TermsPage />
          </Suspense>
        ) 
      },
      { 
        path: "privacy", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PrivacyPage />
          </Suspense>
        ) 
      },
      { 
        path: "cookies", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <CookiesPage />
          </Suspense>
        ) 
      },
      { 
        path: "make-admin", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <MakeAdmin />
          </Suspense>
        ) 
      },
      { 
        path: "tubelight-navbar-demo", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <TubelightNavbarDemo />
          </Suspense>
        ) 
      },
      { 
        path: "transitions-demo", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <TransitionsDemo />
          </Suspense>
        ) 
      },
      
      // Private routes
      {
        path: "profile",
        element: <PrivateRoute><Outlet /></PrivateRoute>,
        children: [
          { 
            index: true, 
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <Profile />
              </Suspense>
            ) 
          }
        ]
      },
      
      // Management routes
      {
        path: "management/*",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ManagementPage />
          </Suspense>
        )
      },
      
      // Admin routes
      {
        path: "admin",
        element: <AdminRoute><AdminLayout /></AdminRoute>,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "profiles", element: <ProfilesAdmin /> },
          { path: "users", element: <Users /> },
          { path: "properties", element: <Properties /> },
          { path: "inquiries", element: <Inquiries /> },
          { path: "sell-requests", element: <SellRequests /> },
          { path: "blog", element: <BlogAdmin /> },
          { path: "careers", element: <CareersAdmin /> },
          { path: "services", element: <ServicesAdmin /> },
          { path: "settings", element: <Settings /> }
        ]
      },
      
      // 404 route
      { 
        path: "*", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <NotFound />
          </Suspense>
        ) 
      }
    ]
  }
]);

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;
