import api from './api';
import { Expense } from '../types/expense';

export const expenseService = {
  async create(expense: Omit<Expense, 'id'>) {
    const { data } = await api.post('/expenses', expense);
    return data;
  },

  async getAll() {
    const { data } = await api.get('/expenses');
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get(`/expenses/${id}`);
    return data;
  },

  async update(id: string, expense: Partial<Expense>) {
    const { data } = await api.put(`/expenses/${id}`, expense);
    return data;
  },

  async delete(id: string) {
    await api.delete(`/expenses/${id}`);
  },

  async getStats() {
    const { data } = await api.get('/expenses/stats');
    return data;
  },
};