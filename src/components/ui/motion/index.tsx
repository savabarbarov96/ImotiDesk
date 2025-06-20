
import React from 'react';
import { useAnimationSettings } from '@/lib/animations/motion';

interface FallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  animate?: boolean;
  delay?: number;
}

// Simplified components that use CSS animations instead of framer-motion
export const FadeIn: React.FC<FallbackProps> = ({ children, className, animate, delay, ...props }) => {
  const { shouldAnimate } = useAnimationSettings() ?? { shouldAnimate: true };
  const shouldShow = animate === undefined ? shouldAnimate : animate;
  
  return (
    <div 
      className={`${shouldShow ? 'animate-fade-in' : ''} ${className || ''}`}
      style={delay ? { animationDelay: `${delay}s` } : undefined} 
      {...props}
    >
      {children}
    </div>
  );
};

export const FadeUp: React.FC<FallbackProps> = ({ children, className, animate, delay, ...props }) => {
  const { shouldAnimate } = useAnimationSettings() ?? { shouldAnimate: true };
  const shouldShow = animate === undefined ? shouldAnimate : animate;
  
  return (
    <div 
      className={`transition-all duration-500 ${shouldShow ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} ${className || ''}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

export const SlideIn: React.FC<FallbackProps> = ({ children, className, animate, delay, ...props }) => {
  const { shouldAnimate } = useAnimationSettings() ?? { shouldAnimate: true };
  const shouldShow = animate === undefined ? shouldAnimate : animate;
  
  return (
    <div 
      className={`${shouldShow ? 'animate-slide-in-right' : ''} ${className || ''}`}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

export const ScaleIn: React.FC<FallbackProps> = ({ children, className, animate, delay, ...props }) => {
  const { shouldAnimate } = useAnimationSettings() ?? { shouldAnimate: true };
  const shouldShow = animate === undefined ? shouldAnimate : animate;
  
  return (
    <div 
      className={`transition-all duration-300 ${shouldShow ? 'scale-100 opacity-100' : 'scale-95 opacity-0'} ${className || ''}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

export const StaggerContainer: React.FC<FallbackProps> = ({ children, className, animate, ...props }) => {
  return (
    <div className={className || ''} {...props}>
      {children}
    </div>
  );
};

export const StaggerItem: React.FC<FallbackProps> = ({ children, className, delay, ...props }) => {
  return (
    <div 
      className={`animate-fade-in ${className || ''}`} 
      style={delay ? { animationDelay: `${delay}s` } : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

export const MotionDiv: React.FC<FallbackProps> = ({ children, className, ...props }) => (
  <div className={className || ''} {...props}>
    {children}
  </div>
);

export const MotionButton: React.FC<ButtonProps> = ({ 
  children, 
  className,
  ...props 
}) => (
  <button 
    className={`transition-all duration-200 hover:scale-105 active:scale-95 ${className || ''}`}
    {...props}
  >
    {children}
  </button>
);

export const MotionImage: React.FC<ImageProps> = ({ 
  src,
  alt,
  className,
  containerClassName,
  loadingComponent,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  
  return (
    <div className={containerClassName}>
      {!isLoaded && loadingComponent}
      <img
        src={src}
        alt={alt || ""}
        className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className || ''}`}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </div>
  );
};

export const MotionList: React.FC<ListProps> = ({ 
  children,
  className,
  ...props
}) => (
  <ul className={className || ''} {...props}>
    {React.Children.map(children, (child, index) => (
      <li 
        className="animate-fade-in" 
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {child}
      </li>
    ))}
  </ul>
);

// Types to maintain compatibility
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
  loadingComponent?: React.ReactNode;
}

interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  staggerDelay?: number;
}

export type MotionDivProps = FallbackProps;
export type MotionButtonProps = ButtonProps;
export type MotionImageProps = ImageProps;
export type MotionListProps = ListProps;
