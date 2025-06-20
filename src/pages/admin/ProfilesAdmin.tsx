import React from 'react';
import { Helmet } from 'react-helmet';
import ProfilesManagement from '@/components/management/ProfilesManagement';
import { useAuth } from '@/hooks/use-auth';
import { Navigate } from 'react-router-dom';

const ProfilesAdmin = () => {
  const { profile } = useAuth();

  // Only allow admin access
  if (profile?.role !== 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div>
      <Helmet>
        <title>Управление на профили | Automation Aid Admin</title>
        <meta name="description" content="Администрирайте потребителски профили и роли" />
      </Helmet>
      <ProfilesManagement />
    </div>
  );
};

export default ProfilesAdmin; 