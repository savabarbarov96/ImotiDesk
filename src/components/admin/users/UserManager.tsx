import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/hooks/auth/types';
import { UserWithProfile } from '@/components/admin/users/types';
import { toast } from '@/hooks/use-toast';
import UsersFilter from '@/components/admin/users/UsersFilter';
import UsersList from '@/components/admin/users/UsersList';
import EditUserDialog from '@/components/admin/users/EditUserDialog';
import CreateUserDialog from '@/components/admin/users/CreateUserDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// Define the Supabase project URL
const SUPABASE_PROJECT_URL = new URL("https://zanfdpuiblradrbtfzhl.supabase.co");
// Create the Edge Function URL correctly using URL constructor
const EDGE_FUNCTION_URL = new URL("/functions/v1/manage-users", SUPABASE_PROJECT_URL).toString();

console.log("Using Edge Function URL:", EDGE_FUNCTION_URL);

// Create user data type
interface CreateUserData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserProfile['role'];
}

const UserManager: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | undefined>('all');
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [createUserDialogOpen, setCreateUserDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserWithProfile | null>(null);
  const [newRole, setNewRole] = useState<UserProfile['role']>('authenticated');
  
  const queryClient = useQueryClient();

  // Get the current session
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    },
  });

  // Fetch users with their profiles using the Edge Function
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      if (!session?.access_token) {
        throw new Error('No access token available');
      }

      console.log('Fetching users from:', EDGE_FUNCTION_URL);
      console.log('Using token:', session.access_token.substring(0, 10) + '...');
      
      try {
        const response = await fetch(EDGE_FUNCTION_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'list' }),
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const error = await response.json();
          console.error('API error:', error);
          throw new Error(error.error || 'Failed to fetch users');
        }

        const data = await response.json();
        console.log('Users data:', data);
        
        const { users } = data;
        return users.map((user: any) => ({
          ...user,
          email: user.auth.users.email,
          created_at: user.auth.users.created_at,
          full_name: user.full_name || 'No name',
          updated_at: user.updated_at || null,
        }));
      } catch (error) {
        console.error('Fetch error:', error);
        throw error;
      }
    },
    enabled: !!session?.access_token,
  });

  // Create user mutation
  const createUser = useMutation({
    mutationFn: async (userData: CreateUserData) => {
      if (!session?.access_token) {
        throw new Error('No access token available');
      }

      console.log('Creating user with data:', {
        email: userData.email,
        role: userData.role,
        first_name: userData.first_name,
        last_name: userData.last_name,
      });

      const response = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create',
          userData: {
            email: userData.email,
            password: userData.password,
            first_name: userData.first_name,
            last_name: userData.last_name,
            role: userData.role,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Create user error response:', errorData);
        throw new Error(errorData.error || 'Failed to create user');
      }

      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'User created successfully',
        variant: 'default',
      });
      setCreateUserDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error: Error) => {
      console.error('Create user error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create user',
        variant: 'destructive',
      });
    },
  });

  // Update user role mutation
  const updateUserRole = useMutation({
    mutationFn: async ({ userId, role, full_name }: { userId: string; role: UserProfile['role']; full_name: string }) => {
      if (!session?.access_token) {
        throw new Error('No access token available');
      }

      const response = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update',
          userData: { id: userId, role, full_name },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update user');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "Ролята е обновена успешно",
        description: "Потребителската роля беше променена.",
      });
      setEditUserDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Грешка при обновяване на ролята",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete user mutation
  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      if (!session?.access_token) {
        throw new Error('No access token available');
      }

      const response = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          userData: { id: userId },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete user');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "Потребителят е изтрит успешно",
        description: "Потребителят беше премахнат от системата.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Грешка при изтриване на потребител",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEditUser = (user: UserWithProfile) => {
    setCurrentUser(user);
    setNewRole(user.role);
    setEditUserDialogOpen(true);
  };

  const handleUpdateUserRole = () => {
    if (!currentUser || !newRole) return;
    
    updateUserRole.mutate({ 
      userId: currentUser.id, 
      role: newRole,
      full_name: currentUser.full_name || '',
    });
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Сигурни ли сте, че искате да изтриете този потребител?')) {
      await deleteUser.mutateAsync(userId);
    }
  };

  // Filter users by search and role
  const filteredUsers = users?.filter(user => {
    const matchesSearch = search.trim() === '' || 
      (user.email && user.email.toLowerCase().includes(search.toLowerCase())) || 
      (user.full_name && user.full_name.toLowerCase().includes(search.toLowerCase()));
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <UsersFilter 
          search={search}
          setSearch={setSearch}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
        />
        <Button onClick={() => setCreateUserDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <UsersList 
        users={filteredUsers}
        isLoading={isLoading} 
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
      />

      <EditUserDialog 
        open={editUserDialogOpen}
        onOpenChange={setEditUserDialogOpen}
        currentUser={currentUser}
        newRole={newRole}
        setNewRole={setNewRole}
        onUpdate={handleUpdateUserRole}
        isUpdating={updateUserRole.isPending}
      />

      <CreateUserDialog
        open={createUserDialogOpen}
        onOpenChange={setCreateUserDialogOpen}
        onSubmit={(data: CreateUserData) => createUser.mutate(data)}
        isCreating={createUser.isPending}
      />
    </>
  );
};

export default UserManager;
