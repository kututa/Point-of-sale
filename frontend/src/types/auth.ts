import { User } from '@supabase/supabase-js';

export enum UserRole {
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
  ATTENDANT = 'ATTENDANT'
}

export interface AuthUser extends User {
  role: UserRole;
}

export interface Permission {
  action: string;
  subject: string;
}

export const PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    { action: 'manage', subject: 'all' },
    { action: 'manage', subject: 'users' },
    { action: 'manage', subject: 'inventory' },
    { action: 'manage', subject: 'reports' },
    { action: 'manage', subject: 'settings' },
    { action: 'manage', subject: 'finances' },
  ],
  [UserRole.OWNER]: [
    { action: 'manage', subject: 'inventory' },
    { action: 'read', subject: 'reports' },
    { action: 'manage', subject: 'expenses' },
    { action: 'read', subject: 'notifications' },
  ],
  [UserRole.ATTENDANT]: [
    { action: 'read', subject: 'inventory' },
    { action: 'manage', subject: 'sales' },
    { action: 'read', subject: 'dashboard' },
  ],
};