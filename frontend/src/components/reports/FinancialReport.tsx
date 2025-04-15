import React from 'react';
import { DateRange } from 'react-day-picker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DollarSign, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';

interface FinancialReportProps {
  dateRange: DateRange;
}

const mockFinancialData = {
  overview: {
    revenue: 45000,
    expenses: 15000,
    profit: 30000,
    profitMargin: 66.7,
  },
  revenueBreakdown: [
    { date: '2025-04-01', revenue: 8000, expenses: 3000 },
    { date: '2025-04-02', revenue: 12000, expenses: 4000 },
    { date: '2025-04-03', revenue: 9000, expenses: 3500 },
    { date: '2025-04-04', revenue: 11000, expenses: 3800 },
    { date: '2025-04-05', revenue: 5000, expenses: 2000 },
  ],
  expenseCategories: [
    { category: 'Inventory', amount: 8000 },
    { category: 'Utilities', amount: 2000 },
    { category: 'Rent', amount: 3500 },
    { category: 'Marketing', amount: 1500 },
  ],
  profitTrends: [
    { month: 'Jan', profit: 25000 },
    { month: 'Feb', profit: 28000 },
    { month: 'Mar', profit: 27000 },
    { month: 'Apr', profit: 30000 },
  ],
  projections: {
    nextMonth: {
      revenue: 48000,
      growth: 6.7,
    },
    expenses: {
      current: 15000,
      projected: 16000,
      change: 6.7,
    },
  },
};

export function FinancialReport({ dateRange }: FinancialReportProps) {
  return (
    <div className="space-y-6">
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface rounded-lg shadow-soft p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-dark/60">Total Revenue</p>
              <p className="text-2xl font-semibold text-primary">
                ${mockFinancialData.overview.revenue}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-secondary" />
          </div>
        </div>
        <div className="bg-surface rounded-lg shadow-soft p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-dark/60">Total Expenses</p>
              <p className="text-2xl font-semibold text-error">
                ${mockFinancialData.overview.expenses}
              </p>
            </div>
            <ArrowDown className="h-8 w-8 text-error" />
          </div>
        </div>
        <div className="bg-surface rounded-lg shadow-soft p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-dark/60">Net Profit</p>
              <p className="text-2xl font-semibold text-success">
                ${mockFinancialData.overview.profit}
              </p>
            </div>
            <ArrowUp className="h-8 w-8 text-success" />
          </div>
        </div>
        <div className="bg-surface rounded-lg shadow-soft p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-dark/60">Profit Margin</p>
              <p className="text-2xl font-semibold text-primary">
                {mockFinancialData.overview.profitMargin}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Revenue vs Expenses */}
      <div className="bg-surface rounded-lg shadow-soft p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">
          Revenue vs Expenses
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockFinancialData.revenueBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#5CB85C" name="Revenue" />
              <Bar dataKey="expenses" fill="#D9534F" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense Breakdown and Profit Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface rounded-lg shadow-soft p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">
            Expense Breakdown
          </h3>
          <div className="space-y-4">
            {mockFinancialData.expenseCategories.map((category, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-border dark:border-primary/20 last:border-0"
              >
                <span className="text-text-dark">{category.category}</span>
                <span className="text-error font-semibold">
                  ${category.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow-soft p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">
            Profit Trends
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockFinancialData.profitTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#5CB85C"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Projections */}
      <div className="bg-surface rounded-lg shadow-soft p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">
          Financial Projections
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-primary/5 rounded-lg p-4">
            <h4 className="text-primary font-medium mb-2">Revenue Projection</h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-primary">
                  ${mockFinancialData.projections.nextMonth.revenue}
                </p>
                <p className="text-sm text-text-dark/60">Next Month</p>
              </div>
              <div className="flex items-center text-success">
                <ArrowUp className="h-5 w-5 mr-1" />
                <span>{mockFinancialData.projections.nextMonth.growth}%</span>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 rounded-lg p-4">
            <h4 className="text-primary font-medium mb-2">Expense Projection</h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-primary">
                  ${mockFinancialData.projections.expenses.projected}
                </p>
                <p className="text-sm text-text-dark/60">Next Month</p>
              </div>
              <div className="flex items-center text-error">
                <ArrowUp className="h-5 w-5 mr-1" />
                <span>{mockFinancialData.projections.expenses.change}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}