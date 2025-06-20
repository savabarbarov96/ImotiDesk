
import React from 'react';
import { Helmet } from 'react-helmet';
import { MessageSquare } from 'lucide-react';
import AdminPlaceholder from '@/components/admin/AdminPlaceholder';

const Inquiries: React.FC = () => {
  return (
    <div>
      <Helmet>
        <title>Запитвания | Automation Aid Админ</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Управление на запитвания</h1>
        <p className="text-muted-foreground">Преглед и обработка на запитвания за имоти</p>
      </div>

      <AdminPlaceholder 
        title="Управлението на запитвания е в разработка"
        description="Тук ще можете да преглеждате и обработвате запитвания от клиенти за имоти. Тази функционалност скоро ще бъде достъпна."
        icon={MessageSquare}
      />
    </div>
  );
};

export default Inquiries;
