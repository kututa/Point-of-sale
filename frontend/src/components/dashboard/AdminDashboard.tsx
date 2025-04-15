import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Package, DollarSign, TrendingUp } from 'lucide-react';

const mockData = {
  salesData: [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ],
  metrics: {
    totalSales: 25550,
    totalProfit: 8500,
    inventoryValue: 45000,
    activeUsers: 12
  }
};

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary dark:text-accent-dark">
        Admin Dashboard
      </h1>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface rounded-lg shadow-soft p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-dark/60 dark:text-text-light/60">Total Sales</p>
              <p className="text-2xl font-semibold text-primary dark:text-accent-dark">
                ${mockData.metrics.totalSales}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-secondary" />
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow-soft p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-dark/60 dark:text-text-light/60">Total Profit</p>
              <p className="text-2xl font-semibold text-primary dark:text-accent-dark">
                ${mockData.metrics.totalProfit}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-success" />
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow-soft p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-dark/60 dark:text-text-light/60">Inventory Value</p>
              <p className="text-2xl font-semibold text-primary dark:text-accent-dark">
                ${mockData.metrics.inventoryValue}
              </p>
            </div>
            <Package className="h-8 w-8 text-secondary" />
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow-soft p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-dark/60 dark:text-text-light/60">Active Users</p>
              <p className="text-2xl font-semibold text-primary dark:text-accent-dark">
                {mockData.metrics.activeUsers}
              </p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-surface rounded-lg shadow-soft p-6">
        <h2 className="text-lg font-semibold text-primary dark:text-accent-dark mb-4">
          Weekly Sales
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockData.salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#D6A75B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-surface rounded-lg shadow-soft p-6">
        <h2 className="text-lg font-semibold text-primary dark:text-accent-dark mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {[
            { message: 'New user registered', time: '5 minutes ago' },
            { message: 'Inventory updated', time: '1 hour ago' },
            { message: 'Sales report generated', time: '2 hours ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-border dark:border-primary/20 last:border-0">
              <p className="text-text-dark dark:text-text-light">{activity.message}</p>
              <span className="text-sm text-text-dark/60 dark:text-text-light/60">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}