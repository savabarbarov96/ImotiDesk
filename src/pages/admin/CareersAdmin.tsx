
import React from 'react';
import { Helmet } from 'react-helmet';
import { Briefcase } from 'lucide-react';
import AdminPlaceholder from '@/components/admin/AdminPlaceholder';

const CareersAdmin: React.FC = () => {
  return (
    <div>
      <Helmet>
        <title>Управление на кариери | Automation Aid Админ</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Управление на кариери</h1>
        <p className="text-muted-foreground">Преглед на позиции и кандидатури</p>
      </div>

      <AdminPlaceholder 
        title="Управлението на кариери е в разработка"
        description="Тук ще можете да създавате нови позиции и да преглеждате кандидатури. Тази функционалност скоро ще бъде достъпна."
        icon={Briefcase}
      />
    </div>
  );
};

export default CareersAdmin;
