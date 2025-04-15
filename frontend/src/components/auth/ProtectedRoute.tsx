import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { usePermissions } from '../../contexts/PermissionContext';
import { UserRole } from '../../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermissions?: { action: string; subject: string }[];
}

export function ProtectedRoute({ 
  children, 
  allowedRoles, 
  requiredPermissions 
}: ProtectedRouteProps) {
  const { user, loading } = useAuthStore();
  const { can, userRole } = usePermissions();
  const location = useLocation();

  useEffect(() => {
    let inactivityTimer: number;

    const resetTimer = () => {
      window.clearTimeout(inactivityTimer);
      inactivityTimer = window.setTimeout(() => {
        useAuthStore.getState().signOut();
      }, 30 * 60 * 1000); // 30 minutes
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => document.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      window.clearTimeout(inactivityTimer);
      events.forEach(event => document.removeEventListener(event, resetTimer));
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredPermissions && !requiredPermissions.every(({ action, subject }) => can(action, subject))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}