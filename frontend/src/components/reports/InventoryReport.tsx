import React from 'react';
import { DateRange } from 'react-day-picker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, Package, TrendingUp, ArrowRight } from 'lucide-react';

interface InventoryReportProps {
  dateRange: DateRange;
}

const COLORS = ['#D6A75B', '#6B4F3B', '#A2674C', '#8B6B4F'];

const mockInventoryData = {
  stockLevels: {
    total: 450,
    lowStock: 15,
    outOfStock: 3,
    value: 125000,
  },
  categoryBreakdown: [
    { name: 'Timepieces', value: 35 },
    { name: 'Furniture', value: 25 },
    { name: 'Decor', value: 20 },
    { name: 'Art', value: 20 },
  ],
  turnoverRates: [
    { category: 'Timepieces', rate: 2.5 },
    { category: 'Furniture', rate: 1.8 },
    { category: 'Decor', rate: 2.2 },
    { category: 'Art', rate: 1.5 },
  ],
  lowStockItems: [
    { name: 'Vintage Clock', quantity: 2, threshold: 5 },
    { name: 'Antique Vase', quantity: 1, threshold: 3 },
    { name: 'Classic Chair', quantity: 3, threshold: 5 },
  ],
  fastMoving: [
    { name: 'Vintage Clock', soldPerMonth: 12 },
    { name: 'Antique Vase', soldPerMonth: 8 },
    { name: 'Classic Chair', soldPerMonth: 6 },
  ],
};

export function InventoryReport({ dateRange }: InventoryReportProps) {
  return (
    <div className="space-y-6">
      {/* Inventory Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface rounded-lg shadow-soft p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-dark/60">Total Items</p>
              <p className="text-2xl font-semibold text-primary">
                {mockInventoryData.stockLevels.total}
              </p>
            </div>
            <Package className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div className="bg-surface rounded-lg shadow-soft p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-dark/60">Low Stock Items</p>
              <p className="text-2xl font-semibold text-error">
                {mockInventoryData.stockLevels.lowStock}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-error" />
          </div>
        </div>
        <div className="bg-surface rounded-lg shadow-soft p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-dark/60">Out of Stock</p>
              <p className="text-2xl font-semibold text-error">
                {mockInventoryData.stockLevels.outOfStock}
              </p>
            </div>
            <Package className="h-8 w-8 text-error" />
          </div>
        </div>
        <div className="bg-surface rounded-lg shadow-soft p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-dark/60">Total Value</p>
              <p className="text-2xl font-semibold text-success">
                ${mockInventoryData.stockLevels.value}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-success" />
          </div>
        </div>
      </div>

      {/* Category Distribution and Turnover */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface rounded-lg shadow-soft p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">
            Category Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockInventoryData.categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value}%)`}
                >
                  {mockInventoryData.categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow-soft p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">
            Inventory Turnover Rates
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockInventoryData.turnoverRates}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="rate" fill="#D6A75B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-surface rounded-lg shadow-soft p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">
          Low Stock Alerts
        </h3>
        <div className="space-y-4">
          {mockInventoryData.lowStockItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-error/5 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <AlertTriangle className="h-5 w-5 text-error" />
                <div>
                  <p className="font-medium text-primary">{item.name}</p>
                  <p className="text-sm text-error">
                    {item.quantity} items remaining (Threshold: {item.threshold})
                  </p>
                </div>
              </div>
              <button className="btn-primary text-sm px-3 py-1 flex items-center space-x-1">
                <span>Restock</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Fast Moving Items */}
      <div className="bg-surface rounded-lg shadow-soft p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">
          Fast Moving Items
        </h3>
        <div className="space-y-4">
          {mockInventoryData.fastMoving.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-border dark:border-primary/20 last:border-0"
            >
              <div>
                <p className="font-medium text-primary">{item.name}</p>
                <p className="text-sm text-text-dark/60">
                  {item.soldPerMonth} units sold per month
                </p>
              </div>
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}