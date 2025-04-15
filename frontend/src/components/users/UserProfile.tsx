import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Mail, User, Shield, Activity } from 'lucide-react';
import { format } from 'date-fns';

const mockUser = {
  id: '1',
  username: 'john.doe',
  fullName: 'John Doe',
  email: 'john@example.com',
  role: 'ADMIN',
  status: 'ACTIVE',
  lastLogin: new Date(),
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  recentActivity: [
    { action: 'Updated inventory item', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { action: 'Created new user', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    { action: 'Generated sales report', timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000) },
  ]
};

export function UserProfile() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/admin/users')}
          className="p-2 hover:bg-primary/10 rounded-full"
        >
          <ArrowLeft className="h-6 w-6 text-primary" />
        </button>
        <h1 className="text-2xl font-bold text-primary dark:text-accent-dark">
          User Profile
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info Card */}
        <div className="lg:col-span-2">
          <div className="bg-surface rounded-lg shadow-soft p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-primary dark:text-accent-dark">
                    {mockUser.fullName}
                  </h2>
                  <p className="text-text-dark/60 dark:text-text-light/60">
                    {mockUser.username}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate(`/admin/users/${id}/edit`)}
                className="btn-primary"
              >
                Edit Profile
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-text-dark dark:text-text-light">{mockUser.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-text-dark dark:text-text-light">{mockUser.role}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-text-dark dark:text-text-light">
                  Last login: {format(mockUser.lastLogin, 'PPp')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-primary" />
                <span className="text-text-dark dark:text-text-light">
                  Member since: {format(mockUser.createdAt, 'PP')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-surface rounded-lg shadow-soft p-6">
          <h3 className="text-lg font-semibold text-primary dark:text-accent-dark mb-4">
            Account Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-text-dark dark:text-text-light">Status</span>
              <span className={`px-2 py-1 rounded-full text-sm ${
                mockUser.status === 'ACTIVE'
                  ? 'bg-success/10 text-success'
                  : 'bg-error/10 text-error'
              }`}>
                {mockUser.status}
              </span>
            </div>
            <button className="w-full btn-secondary">
              Reset Password
            </button>
            <button className="w-full border border-error text-error hover:bg-error/10 px-4 py-2 rounded-md transition-colors">
              Deactivate Account
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-3 bg-surface rounded-lg shadow-soft p-6">
          <h3 className="text-lg font-semibold text-primary dark:text-accent-dark mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {mockUser.recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-border dark:border-primary/20 last:border-0"
              >
                <span className="text-text-dark dark:text-text-light">
                  {activity.action}
                </span>
                <span className="text-sm text-text-dark/60 dark:text-text-light/60">
                  {format(activity.timestamp, 'PPp')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}