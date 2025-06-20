import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

interface AgentRouteProps {
  children: React.ReactNode;
}

const AgentRoute: React.FC<AgentRouteProps> = ({ children }) => {
  const { user, profile, loading } = useAuth();
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg text-muted-foreground">Проверка на достъп...</span>
      </div>
    );
  }
  
  // If not authenticated or not agent/admin, redirect to home page
  if (!user || (profile?.role !== 'agent' && profile?.role !== 'admin')) {
    return <Navigate to="/" replace />;
  }
  
  // If authenticated and has agent role, render children
  return <>{children}</>;
};

export default AgentRoute; 