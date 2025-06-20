import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'public' | 'authenticated' | 'agent' | 'admin';
}

export const useUser = () => {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: async (): Promise<UserProfile | null> => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        return null;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.session.user.id)
        .single();
        
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      return data as UserProfile;
    },
  });
}; 