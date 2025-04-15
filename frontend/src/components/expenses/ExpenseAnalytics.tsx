import React, { useState } from 'react';
import { format, subMonths } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import regression from 'regression';
import { DollarSign, TrendingUp, Calendar, ArrowUp, ArrowDown } from 'lucide-react';

const COLORS = ['#6B4F3B', '#D6A75B', '#A2674C', '#8B6B4F', '#5B3C28', '#C69449'];

const mockData = {
  monthlyExpenses: [
    { month: 'Jan', amount: 4500 },
    { month: 'Feb', amount: 5200 },
    { month: 'Mar', amount: 4800 },
    { month: 'Apr', amount: 5500 },
    { month: 'May', amount: 4900 },
    { month: 'Jun', amount: 5100 },
  ],
  categoryDistribution: [
    { name: 'Rent', value: 2500 },
    { name: 'Utilities', value: 800 },
    { name: 'Supplies', value: 1200 },
    { name: 'Marketing', value: 600 },
    { name: 'Insurance', value: 400 },
    { name: 'Other', value: 500 },
  ],
  revenueVsExpenses: [
    { month: 'Jan', revenue: 12000, expenses: 4500 },
    { month: 'Feb', revenue: 13500, expenses: 5200 },
    { month: 'Mar', revenue: 12800, expenses: 4800 },
    { month: 'Apr', revenue: 14500, expenses: 5500 },
    { month: 'May', revenue: 13900, expenses: 4900 },
    { month: 'Jun', revenue: 15100, expenses: 5100 },
  ],
};

// Calculate trend
const expenseData = mockData.monthlyExpenses.map((item, index) => [index, item.amount]);
const result = regression.linear(expenseData);
const trend = result.equation[0]; // Slope of the trend line

export function ExpenseAnalytics() {
  const [dateRange, setDateRange] = useState({
    from: format(subMonths(new Date(), 6), 'yyyy-MM-dd'),
    to: format(new Date(), 'yyyy-MM-dd'),
  });

  const totalExpenses = mockData.monthlyExpenses.reduce((sum, item) => sum + item.amount, 0);
  const averageExpenses = totalExpenses / mockData.monthlyExpenses.length;
  const latestExpense = mockData.monthlyExpenses[mockData.monthlyExpenses.length - 1].amount;
  const previousExpense = mockData.monthlyExpenses[mockData.monthlyExpenses.length - 2].amount;
  const monthOverMonthChange = ((latestExpense - previousExpense) / previousExpense) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-primary dark:text-accent-dark">
          Expense Analytics
        </h2>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            className="input-field"
          />
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            className="input-field"
          />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface rounded-lg shadow-soft p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-dark/60">Total Expenses</p>
              <p className="text-2xl font-semibold text-primary">
                ${totalExpenses.toFixed(2)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow-soft p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-dark/60">Monthly Average</p>
              <p className="text-2xl font-semibold text-primary">
                ${averageExpenses.toFixed(2)}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-secondary" />
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow-soft p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-dark/60">Month over Month</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-semibold text-primary">
                  {Math.abs(monthOverMonthChange).toFixed(1)}%
                </p>
                {monthOverMonthChange > 0 ? (
                  <ArrowUp className="h-6 w-6 text-error" />
                ) : (
                  <ArrowDown className="h-6 w-6 text-success" />
                )}
              </div>
            </div>
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow-soft p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-dark/60">Trend</p>
              <p className="text-2xl font-semibold text-primary">
                {trend > 0 ? '+' : ''}{(trend * 100).toFixed(1)}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-secondary" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Expenses Trend */}
        <div className="bg-surface rounded-lg shadow-soft p-6">
          <h3 className="text-lg font-semibold text-primary dark:text-accent-dark mb-4">
            Monthly Expenses Trend
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData.monthlyExpenses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#6B4F3B"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-surface rounded-lg shadow-soft p-6">
          <h3 className="text-lg font-semibold text-primary dark:text-accent-dark mb-4">
            Expense Distribution by Category
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockData.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: $${value}`}
                >
                  {mockData.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue vs Expenses */}
        <div className="lg:col-span-2 bg-surface rounded-lg shadow-soft p-6">
          <h3 className="text-lg font-semibold text-primary dark:text-accent-dark mb-4">
            Revenue vs Expenses
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData.revenueVsExpenses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#D6A75B" name="Revenue" />
                <Bar dataKey="expenses" fill="#6B4F3B" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}