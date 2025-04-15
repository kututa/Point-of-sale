import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { UserRole } from '../../types/auth';

const userSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  role: z.nativeEnum(UserRole),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type UserFormData = z.infer<typeof userSchema>;

const roleDescriptions = {
  [UserRole.ADMIN]: 'Full access to all system features including user management and system settings',
  [UserRole.OWNER]: 'Access to inventory management, reports, and expense tracking',
  [UserRole.ATTENDANT]: 'Basic access for sales and inventory viewing'
};

export function UserForm() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema)
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      // Handle user creation/update here
      console.log(data);
      toast.success('User saved successfully');
      navigate('/admin/users');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save user');
    }
  };

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
          Create New User
        </h1>
      </div>

      <div className="bg-surface rounded-lg shadow-soft p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-dark dark:text-text-light mb-2">
                Username
              </label>
              <input
                {...register('username')}
                type="text"
                className="input-field"
                placeholder="Enter username"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-error">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark dark:text-text-light mb-2">
                Full Name
              </label>
              <input
                {...register('fullName')}
                type="text"
                className="input-field"
                placeholder="Enter full name"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-error">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark dark:text-text-light mb-2">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                className="input-field"
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-error">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark dark:text-text-light mb-2">
                Role
              </label>
              <select
                {...register('role')}
                className="input-field"
              >
                {Object.values(UserRole).map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-error">{errors.role.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark dark:text-text-light mb-2">
                Password
              </label>
              <input
                {...register('password')}
                type="password"
                className="input-field"
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-error">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark dark:text-text-light mb-2">
                Confirm Password
              </label>
              <input
                {...register('confirmPassword')}
                type="password"
                className="input-field"
                placeholder="Confirm password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-error">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div className="bg-primary/5 rounded-lg p-4 mt-6">
            <h3 className="text-lg font-semibold text-primary dark:text-accent-dark mb-2">
              Role Permissions
            </h3>
            <div className="space-y-2">
              {Object.entries(roleDescriptions).map(([role, description]) => (
                <div key={role} className="flex items-start space-x-2">
                  <div className="w-24 font-medium text-primary">{role}</div>
                  <p className="text-sm text-text-dark/80 dark:text-text-light/80">{description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/users')}
              className="px-4 py-2 text-text-dark dark:text-text-light hover:bg-primary/10 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>Save User</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}