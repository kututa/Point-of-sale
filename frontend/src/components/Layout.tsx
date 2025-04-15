import React from 'react';
import { Home, Users, Package, BarChart3, DollarSign, Database, Settings } from 'lucide-react';
import { UserRole } from '../types/auth';
import { usePermissions } from '../contexts/PermissionContext';

export function Layout({ children }: { children: React.ReactNode }) {
  const { can, userRole } = usePermissions();
  
  const navigationItems = [
    {
      name: 'Dashboard',
      icon: Home,
      href: `/${userRole?.toLowerCase()}`,
      show: true
    },
    {
      name: 'Users',
      icon: Users,
      href: '/admin/users',
      show: can('manage', 'users')
    },
    {
      name: 'Inventory',
      icon: Package,
      href: `/${userRole?.toLowerCase()}/inventory`,
      show: can('manage', 'inventory') || can('read', 'inventory')
    },
    {
      name: 'Reports',
      icon: BarChart3,
      href: `/${userRole?.toLowerCase()}/reports`,
      show: can('read', 'reports')
    },
    {
      name: 'Sales',
      icon: DollarSign,
      href: '/attendant/sales',
      show: can('manage', 'sales')
    },
    {
      name: 'Data',
      icon: Database,
      href: `/${userRole?.toLowerCase()}/data`,
      show: userRole === UserRole.ADMIN || userRole === UserRole.OWNER
    },
    {
      name: 'Settings',
      icon: Settings,
      href: '/admin/settings',
      show: can('manage', 'settings')
    }
  ].filter(item => item.show);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-900 hover:text-gray-600"
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}