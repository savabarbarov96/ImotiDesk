
import React, { createContext, useContext } from 'react';
import { useAuthProvider } from './auth/use-auth-provider';

// Create context with a more specific type
const AuthContext = createContext<ReturnType<typeof useAuthProvider> | undefined>(undefined);

// Create the actual AuthProvider component that uses the hook
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuthProvider();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
