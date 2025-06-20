
import * as React from "react";
import { cn } from "@/lib/utils";
import { useAnimationSettings } from "@/lib/animations/motion";

interface AnimatedSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
  animated?: boolean;
}

export function AnimatedSkeleton({
  className,
  count = 1,
  animated = true,
  ...props
}: AnimatedSkeletonProps) {
  const { shouldAnimate = true } = useAnimationSettings() ?? {};
  
  // If animations are disabled or animated prop is false, use static skeleton
  if (!shouldAnimate || !animated) {
    return (
      <>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={cn("bg-muted rounded-md", className)}
            {...props}
          />
        ))}
      </>
    );
  }
  
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "rounded-md bg-muted relative overflow-hidden",
            "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite]",
            "before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
            className
          )}
          {...props}
        />
      ))}
    </>
  );
}

export default AnimatedSkeleton;
