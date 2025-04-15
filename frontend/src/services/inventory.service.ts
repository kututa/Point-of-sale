import api from './api';
import { InventoryItem } from '../types/inventory';

export const inventoryService = {
  async getAll() {
    const { data } = await api.get('/inventory');
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get(`/inventory/${id}`);
    return data;
  },

  async create(item: Omit<InventoryItem, 'id'>) {
    const { data } = await api.post('/inventory', item);
    return data;
  },

  async update(id: string, item: Partial<InventoryItem>) {
    const { data } = await api.put(`/inventory/${id}`, item);
    return data;
  },

  async delete(id: string) {
    await api.delete(`/inventory/${id}`);
  },

  async getLowStock() {
    const { data } = await api.get('/inventory/low-stock');
    return data;
  },
};