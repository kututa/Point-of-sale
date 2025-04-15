import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <ShoppingBag className="h-12 w-12 text-primary dark:text-accent-dark" />
          </div>
          <h1 className="text-2xl font-bold text-primary dark:text-accent-dark">
            Antique Haven
          </h1>
          <p className="text-text-dark dark:text-text-light mt-2">{title}</p>
        </div>
        <div className="bg-surface rounded-lg shadow-soft p-8">
          {children}
        </div>
      </div>
    </div>
  );
}