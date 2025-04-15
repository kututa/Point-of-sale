import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { PermissionProvider } from './contexts/PermissionContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Layout } from './components/Layout';
import { LoginForm } from './components/auth/LoginForm';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthLayout } from './components/auth/AuthLayout';
import { Unauthorized } from './components/Unauthorized';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { OwnerDashboard } from './components/dashboard/OwnerDashboard';
import { AttendantDashboard } from './components/dashboard/AttendantDashboard';
import { useAuthStore } from './store/authStore';
import { supabase } from './lib/supabase';

function App() {
  const { setUser, setSession, user } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setSession]);

  return (
    <ThemeProvider>
      <PermissionProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={
                <AuthLayout title="Sign in to your account">
                  <LoginForm />
                </AuthLayout>
              } />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected Routes */}
              <Route path="/admin/*" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/owner/*" element={
                <ProtectedRoute allowedRoles={['OWNER']}>
                  <Layout>
                    <OwnerDashboard />
                  </Layout>
                </ProtectedRoute>
              } />

              <Route path="/attendant/*" element={
                <ProtectedRoute allowedRoles={['ATTENDANT']}>
                  <Layout>
                    <AttendantDashboard />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Default Route */}
              <Route path="/" element={
                user ? (
                  <Navigate to={`/${user.user_metadata?.role?.toLowerCase() || 'login'}`} replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              } />
            </Routes>
          </Router>
        </NotificationProvider>
      </PermissionProvider>
    </ThemeProvider>
  );
}

export default App;