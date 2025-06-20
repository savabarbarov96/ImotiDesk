
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, profile, loading } = useAuth();
  
  // Show loading state while checking authentication and profile
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg text-muted-foreground">Проверка на администраторски достъп...</span>
      </div>
    );
  }
  
  // If not authenticated or not an admin, redirect to auth page
  if (!user || !profile || profile.role !== 'admin') {
    return <Navigate to="/auth" replace />;
  }
  
  // If authenticated and admin, render children
  return <>{children}</>;
};

export default AdminRoute;
