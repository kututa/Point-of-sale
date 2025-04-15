import React from 'react';
import { DateRange } from 'react-day-picker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, Users, Package } from 'lucide-react';

interface SalesReportProps {
  dateRange: DateRange;
}

const mockSalesData = {
  dailySales: [
    { date: '2025-04-01', sales: 1200 },
    { date: '2025-04-02', sales: 1800 },
    { date: '2025-04-03', sales: 1400 },
    { date: '2025-04-04', sales: 2200 },
    { date: '2025-04-05', sales: 1900 },
  ],
  topProducts: [
    { name: 'Vintage Clock', sales: 12, revenue: 3600 },
    { name: 'Antique Vase', sales: 8, revenue: 2400 },
    { name: 'Classic Chair', sales: 6, revenue: 3000 },
  ],
  attendantPerformance: [
    { name: 'John Doe', sales: 15, revenue: 4500 },
    { name: 'Jane Smith', sales: 12, revenue: 3600 },
    { name: 'Mike Johnson', sales: 10, revenue: 3000 },
  ],
  categoryBreakdown: [
    { category: 'Timepieces', sales: 25, revenue: 7500 },
    { category: 'Furniture', sales: 18, revenue: 9000 },
    { category: 'Decor', sales: 22, revenue: 6600 },
  ],
  comparisonData: {
    currentPeriod: 15300,
    previousPeriod: 12800,
    percentageChange: 19.5,
  },
};

export function SalesReport({ dateRange }: SalesReportProps) {
  const { comparisonData } = mockSalesData;
  const isPositiveGrowth = comparisonData.percentageChange > 0;

  return (
    <div className="space-y-6">
      {/* Period Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-primary/5 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">
            Period Comparison
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-dark/60">Current Period</p>
              <p className="text-2xl font-semibold text-primary">
                ${comparisonData.currentPeriod}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-text-dark/60">vs Previous Period</p>
              <div className="flex items-center space-x-2">
                {isPositiveGrowth ? (
                  <TrendingUp className="h-5 w-5 text-success" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-error" />
                )}
                <span className={isPositiveGrowth ? 'text-success' : 'text-error'}>
                  {comparisonData.percentageChange}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">
            Sales Overview
          </h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockSalesData.dailySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => format(new Date(date), 'MMM d')}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(date) => format(new Date(date), 'PPP')}
                  formatter={(value) => [`$${value}`, 'Sales']}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#D6A75B"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Products and Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface rounded-lg shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-primary">Top Products</h3>
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-4">
            {mockSalesData.topProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-border dark:border-primary/20 last:border-0"
              >
                <div>
                  <p className="font-medium text-primary">{product.name}</p>
                  <p className="text-sm text-text-dark/60">{product.sales} units sold</p>
                </div>
                <span className="text-secondary font-semibold">
                  ${product.revenue}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-primary">Category Performance</h3>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockSalesData.categoryBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#D6A75B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Attendant Performance */}
      <div className="bg-surface rounded-lg shadow-soft p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary">Attendant Performance</h3>
          <Users className="h-5 w-5 text-primary" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border dark:border-primary/20">
                <th className="text-left py-3 px-4 text-text-dark/60">Attendant</th>
                <th className="text-right py-3 px-4 text-text-dark/60">Sales Count</th>
                <th className="text-right py-3 px-4 text-text-dark/60">Revenue</th>
                <th className="text-right py-3 px-4 text-text-dark/60">Avg. Sale</th>
              </tr>
            </thead>
            <tbody>
              {mockSalesData.attendantPerformance.map((attendant, index) => (
                <tr
                  key={index}
                  className="border-b border-border dark:border-primary/20 last:border-0"
                >
                  <td className="py-3 px-4 text-primary">{attendant.name}</td>
                  <td className="text-right py-3 px-4 text-text-dark">
                    {attendant.sales}
                  </td>
                  <td className="text-right py-3 px-4 text-success">
                    ${attendant.revenue}
                  </td>
                  <td className="text-right py-3 px-4 text-secondary">
                    ${(attendant.revenue / attendant.sales).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}