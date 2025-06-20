
import * as React from "react";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import { cn } from "@/lib/utils";

// Regular AspectRatio component from Radix UI
const AspectRatio = AspectRatioPrimitive.Root;

// Animation-enhanced AspectRatio component (without framer-motion)
interface AnimatedAspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number;
}

const AnimatedAspectRatio = React.forwardRef<
  HTMLDivElement, 
  AnimatedAspectRatioProps
>(({
  ratio = 16 / 9,
  className,
  children,
  ...props
}, ref) => (
  <div className={cn("relative w-full", className)}>
    <div style={{ paddingBottom: `${100 / ratio}%` }} />
    <div
      ref={ref}
      className="absolute inset-0 transition-all duration-300"
      {...props}
    >
      {children}
    </div>
  </div>
));

AnimatedAspectRatio.displayName = "AnimatedAspectRatio";

export { AspectRatio, AnimatedAspectRatio };
