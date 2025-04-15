import api from './api';
import { Sale } from '../types/sales';

export const salesService = {
  async create(sale: Omit<Sale, 'id'>) {
    const { data } = await api.post('/sales', sale);
    return data;
  },

  async getAll() {
    const { data } = await api.get('/sales');
    return data;
  },

  async getByDateRange(startDate: Date, endDate: Date) {
    const { data } = await api.get('/sales/date-range', {
      params: { startDate, endDate },
    });
    return data;
  },

  async getStats() {
    const { data } = await api.get('/sales/stats');
    return data;
  },
};