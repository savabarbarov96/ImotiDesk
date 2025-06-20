
import React, { createContext, useContext, useState } from "react";

// Simplified context without framer-motion
export interface AnimationSettings {
  shouldAnimate: boolean;
}

// Create default animation settings
const defaultAnimationSettings: AnimationSettings = {
  shouldAnimate: true
};

const AnimationContext = createContext<AnimationSettings>(defaultAnimationSettings);

export const useAnimationSettings = (): AnimationSettings => {
  const context = useContext(AnimationContext);
  // Guard against null context with nullish coalescing
  return context ?? defaultAnimationSettings;
};

export const MotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings] = useState<AnimationSettings>(defaultAnimationSettings);
  
  return (
    <AnimationContext.Provider value={settings}>
      {children}
    </AnimationContext.Provider>
  );
};
