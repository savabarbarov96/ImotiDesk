import { useState, useEffect, useRef } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  signInWithEmailPassword, 
  signUpWithEmailPassword, 
  signOutUser
} from './auth-utils';
import { useProfile } from './use-profile';

export function useAuthProvider() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isInitialized = useRef(false);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  
  // Use the extracted profile hook
  const { profile } = useProfile(user);

  // Initialize auth and set up listeners
  useEffect(() => {
    let mounted = true;
    let isFirstLoad = true;
    let previousSession = null;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (!mounted) return;

        // Update state regardless of event
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        // Only show toasts and navigate on actual sign in/out events
        if (event === 'SIGNED_IN') {
          // Only show toast and navigate if this is a new sign in (not a session refresh)
          if (!previousSession && !isFirstLoad) {
            toast({
              title: 'Успешен вход',
              description: 'Добре дошли отново!',
            });
            // Defer navigation to prevent deadlocks
            setTimeout(() => {
              navigate('/');
            }, 0);
          }
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: 'Излязохте от профила си',
            description: 'Довиждане!',
          });
          navigate('/');
        }

        // Update previous session reference
        previousSession = currentSession;
        
        // After first auth state change, mark initial load as complete
        isFirstLoad = false;
      }
    );

    // Check for existing session on initial load
    if (!isInitialized.current) {
      const initializeAuth = async () => {
        try {
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          
          if (mounted) {
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            previousSession = currentSession;
            setLoading(false);
            isFirstLoad = false;
            isInitialized.current = true;
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          if (mounted) {
            setLoading(false);
            isInitialized.current = true;
          }
        }
      };

      initializeAuth();
    }

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Set up token refresh only when the session changes
  useEffect(() => {
    // Clear any existing timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }

    // If no session or user, don't set up refresh
    if (!session?.user) return;

    const expiresAt = session.expires_at;
    if (!expiresAt) return;
      
    const expiryTime = expiresAt * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const timeUntilExpiry = expiryTime - currentTime;
    
    // Only refresh if token is not expired
    if (timeUntilExpiry <= 0) return;
    
    // Refresh when token is at 85% of its lifetime
    const refreshTime = timeUntilExpiry * 0.85;
    console.log(`Token will refresh in ${Math.round(refreshTime / 1000 / 60)} minutes`);
    
    refreshTimeoutRef.current = setTimeout(async () => {
      try {
        const { error } = await supabase.auth.refreshSession();
        if (error) {
          console.error('Error refreshing session:', error);
          // If refresh fails, try to get a new session
          await supabase.auth.getSession();
        }
      } catch (error) {
        console.error('Error in session refresh:', error);
      }
    }, refreshTime);

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
    };
  }, [session?.expires_at]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailPassword(email, password);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    try {
      await signUpWithEmailPassword(email, password, fullName);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await signOutUser();
    } finally {
      setLoading(false);
    }
  };

  return {
    session,
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut
  };
}
