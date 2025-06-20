
import React from 'react';
import { LayoutDashboard, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface AdminPlaceholderProps {
  title: string;
  description: string;
  icon: React.ElementType;
}

const AdminPlaceholder: React.FC<AdminPlaceholderProps> = ({
  title,
  description,
  icon: Icon,
}) => {
  const navigate = useNavigate();

  return (
    <div className="border rounded-lg p-8 text-center flex flex-col items-center justify-center gap-4">
      <div className="bg-primary/10 p-4 rounded-full">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-muted-foreground max-w-md">{description}</p>
      <div className="flex gap-3 mt-4">
        <Button onClick={() => navigate('/admin')} variant="outline">
          <LayoutDashboard className="h-4 w-4 mr-2" />
          Към табло
        </Button>
        <Button onClick={() => navigate('/admin/settings')}>
          <Settings className="h-4 w-4 mr-2" />
          Настройки
        </Button>
      </div>
    </div>
  );
};

export default AdminPlaceholder;
