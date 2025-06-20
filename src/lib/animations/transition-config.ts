// Configuration for page transitions
export interface TransitionConfig {
  duration: number;
  mode: 'out-in' | 'in-out' | 'default';
  type: 'default' | 'fade' | 'slide' | 'scale' | 'blur';
  ease: number[] | string;
}

// Default transition configuration (similar to Nuxt's pageTransition)
export const defaultTransitionConfig: TransitionConfig = {
  duration: 0.4,
  mode: 'out-in',
  type: 'blur',
  ease: [0.4, 0, 0.2, 1], // Custom cubic-bezier for smooth motion
};

// Route-specific transition configurations
export const routeTransitions: Record<string, Partial<TransitionConfig>> = {
  // Auth pages - slide up effect
  '/auth': {
    type: 'slide',
    duration: 0.4,
  },
  
  // Admin section - quick fade
  '/admin': {
    type: 'fade',
    duration: 0.2,
  },
  
  // Property details - scale effect
  '/properties': {
    type: 'scale',
    duration: 0.35,
  },
  
  // Blog/News - slide effect
  '/news': {
    type: 'slide',
    duration: 0.3,
  },
  
  // Main page - no transition or very subtle
  '/': {
    type: 'fade',
    duration: 0.15,
  },
};

// Function to get transition config for a specific route
export const getTransitionConfig = (pathname: string): TransitionConfig => {
  // Check for exact matches first
  if (routeTransitions[pathname]) {
    return { ...defaultTransitionConfig, ...routeTransitions[pathname] };
  }
  
  // Check for partial matches (e.g., /admin/users matches /admin)
  const matchingRoute = Object.keys(routeTransitions).find(route => 
    pathname.startsWith(route) && route !== '/'
  );
  
  if (matchingRoute) {
    return { ...defaultTransitionConfig, ...routeTransitions[matchingRoute] };
  }
  
  // Return default config
  return defaultTransitionConfig;
};

// Easing presets
export const easingPresets = {
  smooth: [0.4, 0, 0.2, 1],
  snappy: [0.4, 0, 0.6, 1],
  gentle: [0.25, 0.46, 0.45, 0.94],
  bounce: [0.68, -0.55, 0.265, 1.55],
} as const; 