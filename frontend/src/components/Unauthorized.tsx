import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
      <div className="text-center">
        <ShieldAlert className="h-16 w-16 text-error mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-primary dark:text-accent-dark mb-2">
          Access Denied
        </h1>
        <p className="text-text-dark dark:text-text-light mb-6">
          You don't have permission to access this page.
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}