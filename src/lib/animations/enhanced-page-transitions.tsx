import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { getTransitionConfig, TransitionConfig } from './transition-config';

interface EnhancedPageTransitionProps {
  children: React.ReactNode;
  className?: string;
  override?: Partial<TransitionConfig>;
}

// Transition variants for different types
const transitionVariants = {
  default: {
    initial: {
      opacity: 0,
      x: 20,
      scale: 0.98,
      filter: 'blur(1rem)',
    },
    in: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: 'blur(0rem)',
    },
    out: {
      opacity: 0,
      x: -20,
      scale: 0.98,
      filter: 'blur(1rem)',
    },
  },
  fade: {
    initial: {
      opacity: 0,
      filter: 'blur(1rem)',
    },
    in: {
      opacity: 1,
      filter: 'blur(0rem)',
    },
    out: {
      opacity: 0,
      filter: 'blur(1rem)',
    },
  },
  slide: {
    initial: {
      opacity: 0,
      y: 50,
      filter: 'blur(1rem)',
    },
    in: {
      opacity: 1,
      y: 0,
      filter: 'blur(0rem)',
    },
    out: {
      opacity: 0,
      y: -50,
      filter: 'blur(1rem)',
    },
  },
  scale: {
    initial: {
      opacity: 0,
      scale: 0.9,
      filter: 'blur(1rem)',
    },
    in: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0rem)',
    },
    out: {
      opacity: 0,
      scale: 1.05,
      filter: 'blur(1rem)',
    },
  },
  blur: {
    initial: {
      opacity: 0,
      filter: 'blur(1rem)',
    },
    in: {
      opacity: 1,
      filter: 'blur(0rem)',
    },
    out: {
      opacity: 0,
      filter: 'blur(1rem)',
    },
  },
};

export const EnhancedPageTransition: React.FC<EnhancedPageTransitionProps> = ({
  children,
  className = '',
  override = {},
}) => {
  const location = useLocation();
  const config = { ...getTransitionConfig(location.pathname), ...override };
  
  const variants = transitionVariants[config.type] || transitionVariants.default;

  return (
    <AnimatePresence 
      mode={config.mode === 'out-in' ? 'wait' : undefined} 
      initial={false}
    >
      <motion.div
        key={location.pathname}
        className={`w-full ${className}`}
        initial="initial"
        animate="in"
        exit="out"
        variants={variants}
        transition={{
          duration: config.duration,
          ease: config.ease,
        }}
        style={{ 
          willChange: 'transform, opacity, filter',
          backfaceVisibility: 'hidden',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Custom hook for accessing current transition config
export const useCurrentTransition = () => {
  const location = useLocation();
  return getTransitionConfig(location.pathname);
}; 