import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email?: string;
  phone: string | null;
  avatar_url: string | null;
  role: 'public' | 'authenticated' | 'agent' | 'admin';
  created_at: string;
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
        .from('imotidesk_profiles')
        .select('*')
        .eq('id', session.session.user.id)
        .single();
        
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      return data as UserProfile;
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes (renamed from cacheTime)
    refetchOnWindowFocus: false, // Disable automatic refetching on window focus
    refetchInterval: false, // Disable periodic refetching
  });
}; 