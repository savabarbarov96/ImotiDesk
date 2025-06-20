import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Inquiry {
  id: string;
  property_id: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  created_at: string;
  responded: boolean;
  properties?: {
    title: string;
  };
}

// Hook to fetch all inquiries
export const useInquiries = () => {
  return useQuery({
    queryKey: ['inquiries'],
    queryFn: async () => {
      try {
        // First, try to fetch inquiries with property join
        const { data, error } = await supabase
          .from('imotidesk_inquiries')
          .select('*, properties:imotidesk_properties!property_id(title)')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching inquiries with join:', error);
          
          // If that fails, try without the join
          const { data: basicData, error: basicError } = await supabase
            .from('imotidesk_inquiries')
            .select('*')
            .order('created_at', { ascending: false });
            
          if (basicError) {
            console.error('Error fetching basic inquiries:', basicError);
            throw new Error(`Failed to fetch inquiries: ${basicError.message}`);
          }
          
          return basicData;
        }

        return data;
      } catch (err) {
        console.error('Unhandled error in useInquiries:', err);
        throw new Error('Failed to fetch inquiries. Please check your access permissions.');
      }
    },
    retry: 1,
    staleTime: 0, // Always consider data stale
    gcTime: 0, // Don't cache data
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

// Hook to mark an inquiry as responded
export const useMarkInquiryResponded = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, responded }: { id: string, responded: boolean }): Promise<void> => {
      console.log('Attempting to mark inquiry as responded:', { id, responded });
      
      // First check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user?.email);
      
      if (!user) {
        throw new Error('Не сте влезли в системата. Моля, влезте отново.');
      }

      const { error, data } = await supabase
        .from('imotidesk_inquiries')
        .update({ responded })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error marking inquiry as responded:', error);
        if (error.code === '42501') {
          throw new Error('Нямате права за тази операция. Моля, свържете се с администратор.');
        }
        throw new Error(`Failed to mark inquiry as responded: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error('Запитването не е намерено или нямате достъп до него');
      }
      
      console.log('Successfully marked inquiry as responded:', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    },
    onError: (error) => {
      console.error('Mark as responded failed:', error);
    }
  });
};

// Hook to delete an inquiry
export const useDeleteInquiry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      console.log('Attempting to delete inquiry:', id);
      
      // First check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user?.email);
      
      if (!user) {
        throw new Error('Не сте влезли в системата. Моля, влезте отново.');
      }

      const { error, data } = await supabase
        .from('imotidesk_inquiries')
        .delete()
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error deleting inquiry:', error);
        if (error.code === '42501') {
          throw new Error('Нямате права за тази операция. Моля, свържете се с администратор.');
        }
        throw new Error(`Failed to delete inquiry: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error('Запитването не е намерено или нямате достъп до него');
      }
      
      console.log('Successfully deleted inquiry:', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    },
    onError: (error) => {
      console.error('Delete inquiry failed:', error);
    }
  });
}; 