
import React from 'react';
import { Helmet } from 'react-helmet';
import { MenuSquare } from 'lucide-react';
import AdminPlaceholder from '@/components/admin/AdminPlaceholder';

const ServicesAdmin: React.FC = () => {
  return (
    <div>
      <Helmet>
        <title>Управление на услуги | Automation Aid Админ</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Управление на услуги</h1>
        <p className="text-muted-foreground">Конфигуриране на услуги предлагани от Automation Aid</p>
      </div>

      <AdminPlaceholder 
        title="Управлението на услуги е в разработка"
        description="Тук ще можете да добавяте и редактирате услуги, които предлагате. Тази функционалност скоро ще бъде достъпна."
        icon={MenuSquare}
      />
    </div>
  );
};

export default ServicesAdmin;
