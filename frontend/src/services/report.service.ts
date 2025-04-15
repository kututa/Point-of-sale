import api from './api';

export const reportService = {
  async getSalesSummary(startDate: Date, endDate: Date) {
    const { data } = await api.get('/reports/sales-summary', {
      params: { startDate, endDate },
    });
    return data;
  },

  async getProfitAnalysis(startDate: Date, endDate: Date) {
    const { data } = await api.get('/reports/profit-analysis', {
      params: { startDate, endDate },
    });
    return data;
  },

  async getInventoryValue() {
    const { data } = await api.get('/reports/inventory-value');
    return data;
  },

  async getExpenseSummary(startDate: Date, endDate: Date) {
    const { data } = await api.get('/reports/expense-summary', {
      params: { startDate, endDate },
    });
    return data;
  },
};