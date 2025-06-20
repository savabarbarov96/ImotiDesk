import React from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RouteErrorBoundary() {
  const error = useRouteError();
  
  // Get error message based on error type
  let errorMessage = '';
  if (isRouteErrorResponse(error)) {
    // Route error response (e.g. 404)
    errorMessage = `${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    // JavaScript Error object
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    // Plain string error
    errorMessage = error;
  } else {
    // Unknown error type
    errorMessage = 'Unknown error occurred';
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-6 text-center">
        <div className="bg-muted/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <RefreshCw className="h-8 w-8 text-muted-foreground" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        
        <p className="text-muted-foreground mb-4">
          We're having trouble loading this page
        </p>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-destructive/10 p-2 rounded mb-4 text-left">
            <p className="text-sm font-mono break-words">
              {errorMessage}
            </p>
          </div>
        )}
        
        <div className="flex gap-4 justify-center">
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reload page
          </Button>
          
          <Button variant="outline" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Go home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
