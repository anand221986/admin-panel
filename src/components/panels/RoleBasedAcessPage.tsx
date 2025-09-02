import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import RolePermissionsModal from '@/components/RolePermissionsModal';

const RoleBasedAcessPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-foreground">Role Permissions Manager</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Configure role-based permissions for different modules including Recruiting, Sales, Productivity, and more.
        </p>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-3 text-lg"
        >
          Open Role Permissions
        </Button>
      </div>
      
      <RolePermissionsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default RoleBasedAcessPage;