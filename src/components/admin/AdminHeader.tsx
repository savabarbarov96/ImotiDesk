
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Settings, User } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from '@/hooks/use-toast';

const AdminHeader: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignout = async () => {
    await signOut();
    toast({
      title: "Излязохте от администраторския панел",
      description: "Успешно излязохте от вашия акаунт.",
    });
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Админ панел</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" type="button">
          <Bell size={20} />
        </Button>
        
        <Button variant="ghost" size="icon" type="button">
          <Settings size={20} />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2" type="button">
              <User size={20} />
              <span className="hidden sm:inline-block">{user?.email}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Моят акаунт</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => navigate('/profile')}>
              Профил
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleSignout}>
              Изход
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AdminHeader;
