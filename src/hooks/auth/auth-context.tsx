import React, { createContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { UserProfile } from './types';

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // This is just a placeholder component to define the context
  // The actual implementation is in the useAuthProvider hook
  return (
    <AuthContext.Provider value={undefined as any}>
      {children}
    </AuthContext.Provider>
  );
};
