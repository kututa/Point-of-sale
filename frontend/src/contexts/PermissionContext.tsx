import React, { createContext, useContext } from 'react';
import { Permission, PERMISSIONS, UserRole } from '../types/auth';
import { useAuthStore } from '../store/authStore';

interface PermissionContextType {
  can: (action: string, subject: string) => boolean;
  userRole: UserRole | null;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function PermissionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const userRole = user?.user_metadata?.role as UserRole;

  const can = (action: string, subject: string): boolean => {
    if (!userRole) return false;

    const userPermissions = PERMISSIONS[userRole];
    return userPermissions.some(
      (permission: Permission) =>
        (permission.action === action || permission.action === 'manage') &&
        (permission.subject === subject || permission.subject === 'all')
    );
  };

  return (
    <PermissionContext.Provider value={{ can, userRole }}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
}