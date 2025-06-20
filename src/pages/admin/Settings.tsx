
import React from 'react';
import { Helmet } from 'react-helmet';
import { Settings as SettingsIcon } from 'lucide-react';
import AdminPlaceholder from '@/components/admin/AdminPlaceholder';

const Settings: React.FC = () => {
  return (
    <div>
      <Helmet>
        <title>Настройки | Automation Aid Админ</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Настройки на системата</h1>
        <p className="text-muted-foreground">Конфигурация на Automation Aid администрация</p>
      </div>

      <AdminPlaceholder 
        title="Системни настройки са в разработка"
        description="Тук ще можете да конфигурирате глобални настройки на платформата. Тази функционалност скоро ще бъде достъпна."
        icon={SettingsIcon}
      />
    </div>
  );
};

export default Settings;
