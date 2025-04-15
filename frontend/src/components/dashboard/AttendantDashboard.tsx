import React from 'react';
import { DollarSign, Package, TrendingUp, ShoppingCart } from 'lucide-react';

const mockData = {
  metrics: {
    dailySales: 1250,
    itemsSold: 8,
    availableItems: 156,
    personalSales: 5600
  },
  recentSales: [
    { item: 'Vintage Clock', price: 450, time: '2 hours ago' },
    { item: 'Antique Vase', price: 800, time: '4 hours ago' },
    { item: 'Classic Chair', price: 600, time: '5 hours ago' }
  ]
};

export function AttendantDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary dark:text-accent-dark">
          Attendant Dashboard
        </h1>
        <button className="btn-primary flex items-center space-x-2">
          <ShoppingCart className="h-5 w-5" />
          <span>New Sale</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface rounded-lg shadow-soft p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-dark/60 dark:text-text-light/60">Today's Sales</p>
              <p className="text-2xl font-semibold text-primary dark:text-accent-dark">
                ${mockData.metrics.dailySales}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-secondary" />
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow-soft p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-dark/60 dark:text-text-light/60">Items Sold Today</p>
              <p className="text-2xl font-semibold text-primary dark:text-accent-dark">
                {mockData.metrics.itemsSold}
              </p>
            </div>
            <ShoppingCart className="h-8 w-8 text-success" />
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow-soft p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-dark/60 dark:text-text-light/60">Available Items</p>
              <p className="text-2xl font-semibold text-primary dark:text-accent-dark">
                {mockData.metrics.availableItems}
              </p>
            </div>
            <Package className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow-soft p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-dark/60 dark:text-text-light/60">Personal Sales</p>
              <p className="text-2xl font-semibold text-primary dark:text-accent-dark">
                ${mockData.metrics.personalSales}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-secondary" />
          </div>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="bg-surface rounded-lg shadow-soft p-6">
        <h2 className="text-lg font-semibold text-primary dark:text-accent-dark mb-4">
          Recent Sales
        </h2>
        <div className="space-y-4">
          {mockData.recentSales.map((sale, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-border dark:border-primary/20 last:border-0">
              <div>
                <p className="text-text-dark dark:text-text-light">{sale.item}</p>
                <p className="text-sm text-text-dark/60 dark:text-text-light/60">{sale.time}</p>
              </div>
              <span className="text-success font-semibold">${sale.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}