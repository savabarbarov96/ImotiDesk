
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Skeleton } from './skeleton';

interface LoadingFallbackProps {
  message?: string;
  className?: string;
  showSkeleton?: boolean;
  skeletonCount?: number;
}

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({ 
  message = "Loading...", 
  className = "",
  showSkeleton = false,
  skeletonCount = 3
}) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[50vh] ${className}`}>
      {showSkeleton ? (
        <div className="w-full max-w-md space-y-4">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <Skeleton 
              key={i} 
              className={`h-12 w-full ${i % 2 === 0 ? 'w-full' : 'w-4/5'}`} 
            />
          ))}
        </div>
      ) : (
        <>
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-muted-foreground">{message}</p>
        </>
      )}
    </div>
  );
};
