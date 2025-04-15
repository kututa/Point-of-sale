import React from 'react';
import { Package, AlertTriangle, DollarSign, TrendingUp } from 'lucide-react';

const mockData = {
  metrics: {
    totalItems: 156,
    lowStock: 8,
    recentSales: 12500,
    expenses: 3500
  },
  lowStockItems: [
    { name: 'Vintage Clock', quantity: 2 },
    { name: 'Antique Vase', quantity: 1 },
    { name: 'Classic Chair', quantity: 3 }
  ]
};

export function OwnerDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary dark:text-accent-dark">
          Owner Dashboard
        </h1>
        <button className="btn-primary flex items-center space-x-2">
          <Package className="h-5 w-5" />
          <span>Add Inventory</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface rounded-lg shadow-soft p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-dark/60 dark:text-text-light/60">Total Items</p>
              <p className="text-2xl font-semibold text-primary dark:text-accent-dark">
                {mockData.metrics.totalItems}
              </p>
            </div>
            <Package className="h-8 w-8 text-secondary" />
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow-soft p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-dark/60 dark:text-text-light/60">Low Stock Items</p>
              <p className="text-2xl font-semibold text-error">
                {mockData.metrics.lowStock}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-error" />
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow-soft p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-dark/60 dark:text-text-light/60">Recent Sales</p>
              <p className="text-2xl font-semibold text-primary dark:text-accent-dark">
                ${mockData.metrics.recentSales}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-success" />
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow-soft p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-dark/60 dark:text-text-light/60">Monthly Expenses</p>
              <p className="text-2xl font-semibold text-primary dark:text-accent-dark">
                ${mockData.metrics.expenses}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-surface rounded-lg shadow-soft p-6">
        <h2 className="text-lg font-semibold text-primary dark:text-accent-dark mb-4">
          Low Stock Alerts
        </h2>
        <div className="space-y-4">
          {mockData.lowStockItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-border dark:border-primary/20 last:border-0">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-error" />
                <p className="text-text-dark dark:text-text-light">{item.name}</p>
              </div>
              <span className="text-sm px-2 py-1 bg-error/10 text-error rounded-full">
                {item.quantity} left
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}