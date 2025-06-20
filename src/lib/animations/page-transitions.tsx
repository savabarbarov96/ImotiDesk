import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
  mode?: 'out-in' | 'in-out' | 'default';
  duration?: number;
  className?: string;
}

// Page transition variants similar to Nuxt's pageTransition
const pageVariants = {
  initial: {
    opacity: 0,
    x: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    x: -20,
    scale: 0.98,
  },
};

// Alternative fade transition
const fadeVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
};

// Slide transition
const slideVariants = {
  initial: {
    opacity: 0,
    y: 50,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -50,
  },
};

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  mode = 'out-in',
  duration = 0.3,
  className = '',
}) => {
  const location = useLocation();

  const transitionProps = {
    initial: 'initial',
    animate: 'in',
    exit: 'out',
    variants: pageVariants,
    transition: {
      duration,
      ease: [0.4, 0, 0.2, 1], // Smooth easing
    },
  };

  if (mode === 'out-in') {
    return (
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          className={`w-full ${className}`}
          {...transitionProps}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={location.pathname}
        className={`w-full ${className}`}
        {...transitionProps}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Alternative transition components for different effects
export const FadeTransition: React.FC<PageTransitionProps> = ({
  children,
  mode = 'out-in',
  duration = 0.2,
  className = '',
}) => {
  const location = useLocation();

  return (
    <AnimatePresence mode={mode === 'out-in' ? 'wait' : undefined} initial={false}>
      <motion.div
        key={location.pathname}
        className={`w-full ${className}`}
        initial="initial"
        animate="in"
        exit="out"
        variants={fadeVariants}
        transition={{
          duration,
          ease: 'easeInOut',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export const SlideTransition: React.FC<PageTransitionProps> = ({
  children,
  mode = 'out-in',
  duration = 0.4,
  className = '',
}) => {
  const location = useLocation();

  return (
    <AnimatePresence mode={mode === 'out-in' ? 'wait' : undefined} initial={false}>
      <motion.div
        key={location.pathname}
        className={`w-full ${className}`}
        initial="initial"
        animate="in"
        exit="out"
        variants={slideVariants}
        transition={{
          duration,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Hook for custom page transition settings
export const usePageTransition = () => {
  const location = useLocation();
  
  // You can customize transitions based on routes
  const getTransitionConfig = (pathname: string) => {
    // Example: Different transitions for different sections
    if (pathname.startsWith('/admin')) {
      return { component: FadeTransition, duration: 0.2 };
    }
    
    if (pathname.startsWith('/auth')) {
      return { component: SlideTransition, duration: 0.3 };
    }
    
    // Default transition
    return { component: PageTransition, duration: 0.3 };
  };

  return {
    currentPath: location.pathname,
    config: getTransitionConfig(location.pathname),
  };
}; 