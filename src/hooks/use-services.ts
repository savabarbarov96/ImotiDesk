
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  is_highlighted: boolean;
  created_at?: string;
}

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: async (): Promise<Service[]> => {
      const { data, error } = await supabase
        .from('imotidesk_services')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching services:', error);
        throw new Error('Failed to fetch services');
      }
      
      return data || [];
    }
  });
};
