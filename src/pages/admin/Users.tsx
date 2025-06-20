
import React from 'react';
import { Helmet } from 'react-helmet';
import UserManager from '@/components/admin/users/UserManager';

const Users: React.FC = () => {
  return (
    <div>
      <Helmet>
        <title>Управление на потребители | Automation Aid Админ</title>
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Управление на потребители</h1>
          <p className="text-muted-foreground">Преглед и управление на всички потребители в системата</p>
        </div>
      </div>

      <UserManager />
    </div>
  );
};

export default Users;
