import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SellRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  property_type: string;
  title: string | null;
  description: string | null;
  price: number | null;
  consultation_date: string | null;
  created_at: string;
  status: string;
  user_id: string | null;
}

// Hook to fetch all sell requests
export const useSellRequests = () => {
  return useQuery({
    queryKey: ['sell-requests'],
    queryFn: async (): Promise<SellRequest[]> => {
      const { data, error } = await supabase
        .from('imotidesk_sell_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching sell requests:', error);
        throw new Error('Failed to fetch sell requests');
      }

      return data as SellRequest[];
    },
    staleTime: 0, // Always consider data stale
    gcTime: 0, // Don't cache data
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

// Hook to update a sell request status
export const useUpdateSellRequestStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }): Promise<void> => {
      console.log('Attempting to update sell request status:', { id, status });
      
      // First check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user?.email);
      
      if (!user) {
        throw new Error('Не сте влезли в системата. Моля, влезте отново.');
      }

      const { error, data } = await supabase
        .from('imotidesk_sell_requests')
        .update({ status })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error updating sell request status:', error);
        if (error.code === '42501') {
          throw new Error('Нямате права за тази операция. Моля, свържете се с администратор.');
        }
        throw new Error(`Failed to update sell request status: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error('Заявката не е намерена или нямате достъп до нея');
      }
      
      console.log('Successfully updated sell request status:', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sell-requests'] });
    },
    onError: (error) => {
      console.error('Status update failed:', error);
    }
  });
};

// Hook to update sell request details
export const useUpdateSellRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      sellRequest 
    }: { 
      id: string, 
      sellRequest: Partial<SellRequest> 
    }): Promise<SellRequest> => {
      const { data, error } = await supabase
        .from('imotidesk_sell_requests')
        .update(sellRequest)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating sell request:', error);
        throw new Error('Failed to update sell request');
      }

      return data as SellRequest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sell-requests'] });
    },
  });
};

// Hook to delete a sell request
export const useDeleteSellRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      console.log('Attempting to delete sell request:', id);
      
      // First check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user?.email);
      
      if (!user) {
        throw new Error('Не сте влезли в системата. Моля, влезте отново.');
      }

      const { error, data } = await supabase
        .from('imotidesk_sell_requests')
        .delete()
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error deleting sell request:', error);
        if (error.code === '42501') {
          throw new Error('Нямате права за тази операция. Моля, свържете се с администратор.');
        }
        throw new Error(`Failed to delete sell request: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error('Заявката не е намерена или нямате достъп до нея');
      }
      
      console.log('Successfully deleted sell request:', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sell-requests'] });
    },
    onError: (error) => {
      console.error('Delete sell request failed:', error);
    }
  });
};

// Hook to convert a sell request to a property
export const useConvertSellRequestToProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      sellRequestId, 
      propertyData,
      ownerId 
    }: { 
      sellRequestId: string, 
      propertyData: {
        title: string;
        description?: string;
        price: number;
        address: string;
        city: string;
        property_type: string;
      },
      ownerId: string
    }): Promise<void> => {
      const { error: insertError } = await supabase
        .from('imotidesk_properties')
        .insert({
          ...propertyData,
          listing_type: 'sale',
          is_published: true,
          owner_id: ownerId
        });

      if (insertError) {
        console.error('Error converting sell request to property:', insertError);
        throw new Error('Failed to convert sell request to property');
      }

      // Update sell request status to "converted"
      const { error: updateError } = await supabase
        .from('imotidesk_sell_requests')
        .update({ status: 'converted' })
        .eq('id', sellRequestId);

      if (updateError) {
        console.error('Error updating sell request status:', updateError);
        throw new Error('Failed to update sell request status');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sell-requests'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}; 