
import React from 'react';
import { Helmet } from 'react-helmet';
import { Building2 } from 'lucide-react';
import AdminPlaceholder from '@/components/admin/AdminPlaceholder';

const SellRequests: React.FC = () => {
  return (
    <div>
      <Helmet>
        <title>Заявки за продажба | Automation Aid Админ</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Заявки за продажба</h1>
        <p className="text-muted-foreground">Преглед и обработка на заявки за продажба на имоти</p>
      </div>

      <AdminPlaceholder 
        title="Управлението на заявки за продажба е в разработка"
        description="Тук ще можете да преглеждате и обработвате заявки от клиенти, които искат да продадат своите имоти. Тази функционалност скоро ще бъде достъпна."
        icon={Building2}
      />
    </div>
  );
};

export default SellRequests;
