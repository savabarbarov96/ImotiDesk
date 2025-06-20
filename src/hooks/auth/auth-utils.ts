
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Clean up any existing auth state
export const cleanupAuthState = () => {
  localStorage.removeItem('supabase.auth.token');
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
};

// Fetch user profile
export const fetchUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return null;
  }
};

// Authentication helpers
export const signInWithEmailPassword = async (email: string, password: string) => {
  try {
    // Clean up existing state
    cleanupAuthState();
    
    // Attempt global sign out
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      // Continue even if this fails
    }
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      toast({
        title: 'Грешка при вход',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error signing in:', error);
    return { success: false, error };
  }
};

export const signUpWithEmailPassword = async (email: string, password: string, fullName: string) => {
  try {
    // Clean up existing state
    cleanupAuthState();
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    
    if (error) {
      toast({
        title: 'Грешка при регистрация',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    } else {
      toast({
        title: 'Успешна регистрация',
        description: 'Моля, проверете електронната си поща за потвърждение.',
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error signing up:', error);
    return { success: false, error };
  }
};

export const signOutUser = async () => {
  try {
    // Clean up auth state
    cleanupAuthState();
    
    // Attempt global sign out
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    
    if (error) {
      toast({
        title: 'Грешка при изход',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, error };
  }
};

export const signInWithProvider = async (provider: 'google' | 'facebook') => {
  try {
    // Clean up existing state
    cleanupAuthState();
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
    });
    
    if (error) {
      toast({
        title: `Грешка при вход с ${provider === 'google' ? 'Google' : 'Facebook'}`,
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error(`Error signing in with ${provider}:`, error);
    return { success: false, error };
  }
};
