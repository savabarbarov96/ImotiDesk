import React, { useState } from 'react';
import { Plus, Edit2, Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  useProfiles, 
  useUpdateProfile, 
  useDeleteProfile,
  useCreateUser,
  type Profile, 
  type ProfileFormData,
  type CreateUserData,
  type UserRole
} from '@/hooks/use-profiles';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ProfilesManagement = () => {
  const { toast } = useToast();
  const { data: profiles, isLoading, error } = useProfiles();
  const updateProfile = useUpdateProfile();
  const deleteProfile = useDeleteProfile();
  const createUser = useCreateUser();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);

  const [editFormData, setEditFormData] = useState<ProfileFormData>({
    first_name: '',
    last_name: '',
    role: 'authenticated',
    phone: ''
  });

  const [createFormData, setCreateFormData] = useState<CreateUserData>({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'authenticated',
    phone: ''
  });

  const roleLabels: Record<UserRole, string> = {
    'public': 'Публичен',
    'authenticated': 'Потребител',
    'agent': 'Агент',
    'admin': 'Админ'
  };

  const roleColors: Record<UserRole, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    'public': 'outline',
    'authenticated': 'outline',
    'agent': 'outline',
    'admin': 'outline'
  };

  // Reset edit form
  const resetEditForm = () => {
    setEditFormData({
      first_name: '',
      last_name: '',
      role: 'authenticated',
      phone: ''
    });
  };

  // Reset create form
  const resetCreateForm = () => {
    setCreateFormData({
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      role: 'authenticated',
      phone: ''
    });
  };

  // Open edit dialog
  const handleEditClick = (profile: Profile) => {
    setCurrentProfile(profile);
    setEditFormData({
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      role: profile.role,
      phone: profile.phone || ''
    });
    setIsEditDialogOpen(true);
  };

  // Close edit dialog
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setCurrentProfile(null);
    resetEditForm();
  };

  // Open create dialog
  const handleCreateClick = () => {
    setIsCreateDialogOpen(true);
  };

  // Close create dialog
  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
    resetCreateForm();
  };

  // Open delete dialog
  const handleDeleteClick = (profile: Profile) => {
    setCurrentProfile(profile);
    setIsDeleteDialogOpen(true);
  };

  // Close delete dialog
  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCurrentProfile(null);
  };

  // Handle edit form submission
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProfile) return;

    updateProfile.mutate({
      id: currentProfile.id,
      profile: editFormData
    }, {
      onSuccess: () => {
        handleCloseEditDialog();
      }
    });
  };

  // Handle create form submission
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!createFormData.email || !createFormData.password || !createFormData.first_name || !createFormData.last_name) {
      toast({
        title: "Моля попълнете всички задължителни полета",
        variant: "destructive",
      });
      return;
    }

    createUser.mutate(createFormData, {
      onSuccess: () => {
        handleCloseCreateDialog();
      }
    });
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (!currentProfile) return;

    deleteProfile.mutate(currentProfile.id, {
      onSuccess: () => {
        handleCloseDeleteDialog();
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Зареждане на профили...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Грешка при зареждане на профилите</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Управление на профили</h2>
        <Button onClick={handleCreateClick} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Добави потребител
        </Button>
      </div>

      <div className="grid gap-4">
        {profiles?.map((profile) => (
          <Card key={profile.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg">
                      {profile.first_name || profile.last_name 
                        ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
                        : 'Няма име'
                      }
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={roleColors[profile.role]}
                    className="text-xs px-2 py-1"
                  >
                    {roleLabels[profile.role]}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(profile)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(profile)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Телефон:</span> {profile.phone || 'Не е посочен'}
                </div>
                <div>
                  <span className="font-medium">Създаден:</span> {new Date(profile.created_at).toLocaleDateString('bg-BG')}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Редактиране на профил</DialogTitle>
            <DialogDescription>
              Редактирайте информацията за потребителя.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">Име</Label>
                <Input
                  id="first_name"
                  value={editFormData.first_name}
                  onChange={(e) => setEditFormData({...editFormData, first_name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="last_name">Фамилия</Label>
                <Input
                  id="last_name"
                  value={editFormData.last_name}
                  onChange={(e) => setEditFormData({...editFormData, last_name: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                value={editFormData.phone}
                onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="role">Роля</Label>
              <Select 
                value={editFormData.role} 
                onValueChange={(value: UserRole) => setEditFormData({...editFormData, role: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="authenticated">Потребител</SelectItem>
                  <SelectItem value="agent">Агент</SelectItem>
                  <SelectItem value="admin">Админ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCloseEditDialog}>
                Отказ
              </Button>
              <Button type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending ? 'Запазване...' : 'Запази'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Добавяне на нов потребител</DialogTitle>
            <DialogDescription>
              Създайте нов потребителски акаунт.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={createFormData.email}
                onChange={(e) => setCreateFormData({...createFormData, email: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="password">Парола *</Label>
              <Input
                id="password"
                type="password"
                required
                value={createFormData.password}
                onChange={(e) => setCreateFormData({...createFormData, password: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="create_first_name">Име *</Label>
                <Input
                  id="create_first_name"
                  required
                  value={createFormData.first_name}
                  onChange={(e) => setCreateFormData({...createFormData, first_name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="create_last_name">Фамилия *</Label>
                <Input
                  id="create_last_name"
                  required
                  value={createFormData.last_name}
                  onChange={(e) => setCreateFormData({...createFormData, last_name: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="create_phone">Телефон</Label>
              <Input
                id="create_phone"
                value={createFormData.phone}
                onChange={(e) => setCreateFormData({...createFormData, phone: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="create_role">Роля</Label>
              <Select 
                value={createFormData.role} 
                onValueChange={(value: UserRole) => setCreateFormData({...createFormData, role: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="authenticated">Потребител</SelectItem>
                  <SelectItem value="agent">Агент</SelectItem>
                  <SelectItem value="admin">Админ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCloseCreateDialog}>
                Отказ
              </Button>
              <Button type="submit" disabled={createUser.isPending}>
                {createUser.isPending ? 'Създаване...' : 'Създай'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Потвърждение за изтриване</DialogTitle>
            <DialogDescription>
              Сигурни ли сте, че искате да изтриете този потребител? Това действие не може да бъде отменено.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCloseDeleteDialog}>
              Отказ
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              disabled={deleteProfile.isPending}
            >
              {deleteProfile.isPending ? 'Изтриване...' : 'Изтрий'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilesManagement; 