import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'public' | 'authenticated' | 'agent' | 'admin';

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: UserRole;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  email?: string;
}

export interface ProfileFormData {
  first_name?: string;
  last_name?: string;
  role?: UserRole;
  phone?: string;
  avatar_url?: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone?: string;
}

// Fetch all profiles with emails using database function
export const useProfiles = () => {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .rpc('imotidesk_get_users_with_profiles', { requesting_user_id: (await supabase.auth.getUser()).data.user?.id || '' });

      if (error) throw error;

      return profiles as Profile[];
    }
  });
};

// Update profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, profile }: { id: string; profile: ProfileFormData }) => {
      const { data, error } = await supabase
        .from('imotidesk_profiles')
        .update(profile)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({
        title: "Профилът е обновен успешно!",
        description: "Промените бяха запазени.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Грешка при обновяване на профила",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};

// Delete profile using database function
export const useDeleteProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .rpc('imotidesk_delete_user_as_admin', { 
          admin_user_id: user.id, 
          user_to_delete_id: userId 
        });

      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({
        title: "Профилът е изтрит успешно!",
        description: "Потребителят беше премахнат от системата.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Грешка при изтриване на профила",
        description: error.message,
        variant: "destructive",
      });
    }
  });
};

// Create new user using database function
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userData: CreateUserData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .rpc('imotidesk_create_user_as_admin', {
          admin_user_id: user.id,
          new_user_email: userData.email,
          new_user_password: userData.password,
          new_user_first_name: userData.first_name,
          new_user_last_name: userData.last_name,
          new_user_role: userData.role
        });

      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({
        title: "Потребителят е създаден успешно!",
        description: "Новият акаунт беше добавен в системата.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Грешка при създаване на потребител",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}; 