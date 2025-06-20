
import React from 'react';
import { useMakeAdmin } from '@/hooks/use-make-admin';
import { Loader2 } from 'lucide-react';

const MakeAdmin: React.FC = () => {
  const { loading, success } = useMakeAdmin();

  return (
    <div className="flex items-center justify-center h-screen">
      {loading && (
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-lg">Making slavastinov@gmail.com an admin...</p>
        </div>
      )}
      {success && (
        <div>
          <h1 className="text-2xl font-bold text-green-600">Success!</h1>
          <p className="mt-2">User slavastinov@gmail.com is now an admin.</p>
        </div>
      )}
    </div>
  );
};

export default MakeAdmin;
