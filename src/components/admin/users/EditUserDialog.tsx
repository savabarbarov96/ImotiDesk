import React from 'react';
import { Loader2 } from 'lucide-react';
import { UserProfile } from '@/hooks/auth/types';
import { UserWithProfile } from './types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: UserWithProfile | null;
  newRole: UserProfile['role'];
  setNewRole: (role: UserProfile['role']) => void;
  onUpdate: () => void;
  isUpdating: boolean;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({
  open,
  onOpenChange,
  currentUser,
  newRole,
  setNewRole,
  onUpdate,
  isUpdating,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Промяна на роля</DialogTitle>
          <DialogDescription>
            Променете ролята на потребителя {currentUser?.full_name || currentUser?.email}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right col-span-1">Текуща роля:</span>
            <div className="col-span-3">
              <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                ${currentUser?.role === 'admin' ? 'bg-red-100 text-red-800' : 
                'bg-blue-100 text-blue-800'}`}
              >
                {currentUser?.role === 'admin' ? 'Administrator' : 'Regular User'}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right col-span-1">Нова роля:</span>
            <Select 
              value={newRole} 
              onValueChange={(value) => setNewRole(value as UserProfile['role'])}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Изберете роля" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="authenticated">Regular User</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
            Отказ
          </Button>
          <Button 
            onClick={onUpdate} 
            disabled={isUpdating}
            type="button"
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Записва се...</span>
              </>
            ) : (
              <span>Запази промените</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
