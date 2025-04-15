import api from './api';
import { UserRole } from '../types/auth';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('authToken', data.token);
    return data;
  },

  async logout() {
    await api.post('/auth/logout');
    localStorage.removeItem('authToken');
  },

  async register(userData: RegisterData) {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },

  async getCurrentUser() {
    const { data } = await api.get('/auth/me');
    return data;
  },

  async changePassword(oldPassword: string, newPassword: string) {
    const { data } = await api.post('/auth/change-password', {
      oldPassword,
      newPassword,
    });
    return data;
  },
};