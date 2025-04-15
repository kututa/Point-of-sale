import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { 
  BarChart3, 
  Calendar, 
  Download, 
  Mail, 
  Clock, 
  DollarSign, 
  Package, 
  TrendingUp,
  AlertTriangle,
  Save,
  FileText
} from 'lucide-react';
import { SalesReport } from './SalesReport';
import { InventoryReport } from './InventoryReport';
import { FinancialReport } from './FinancialReport';

type ReportType = 'sales' | 'inventory' | 'financial';
type DatePreset = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

interface SavedReport {
  id: string;
  name: string;
  type: ReportType;
  dateRange: DateRange;
  createdAt: Date;
}

const mockMetrics = {
  totalSales: 25500,
  totalProfit: 8500,
  averageMargin: 35.2,
  lowStockItems: 8,
  topCategory: 'Timepieces',
};

export function ReportDashboard() {
  const [reportType, setReportType] = useState<ReportType>('sales');
  const [datePreset, setDatePreset] = useState<DatePreset>('monthly');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [reportName, setReportName] = useState('');

  const handleDatePresetChange = (preset: DatePreset) => {
    setDatePreset(preset);
    const today = new Date();

    switch (preset) {
      case 'daily':
        setDateRange({ from: today, to: today });
        break;
      case 'weekly':
        setDateRange({ from: subDays(today, 7), to: today });
        break;
      case 'monthly':
        setDateRange({ from: startOfMonth(today), to: endOfMonth(today) });
        break;
      case 'yearly':
        setDateRange({ from: startOfYear(today), to: endOfYear(today) });
        break;
      // 'custom' is handled by the date picker directly
    }
  };

  const handleSaveReport = () => {
    if (!reportName) return;

    const newReport: SavedReport = {
      id: Date.now().toString(),
      name: reportName,
      type: reportType,
      dateRange,
      createdAt: new Date(),
    };

    setSavedReports([...savedReports, newReport]);
    setReportName('');
  };

  const handleExport = (format: 'pdf' | 'csv') => {
    // Handle export logic here
  };

  const handleEmailReport = () => {
    // Handle email sending logic here
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary dark:text-accent-dark">
          Reports Dashboard
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleExport('pdf')}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => handleEmailReport()}
            className="btn-primary flex items-center space-x-2"
          >
            <Mail className="h-5 w-5" />
            <span>Email Report</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-surface rounded-lg shadow-soft p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-dark/60">Total Sales</p>
              <p className="text-2xl font-semibold text-primary">
                ${mockMetrics.totalSales}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-secondary" />
          </div>
        </div>
        <div className="bg-surface rounded-lg shadow-soft p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-dark/60">Total Profit</p>
              <p className="text-2xl font-semibold text-success">
                ${mockMetrics.totalProfit}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-success" />
          </div>
        </div>
        <div className="bg-surface rounded-lg shadow-soft p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-dark/60">Avg. Margin</p>
              <p className="text-2xl font-semibold text-primary">
                {mockMetrics.averageMargin}%
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div className="bg-surface rounded-lg shadow-soft p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-dark/60">Low Stock Items</p>
              <p className="text-2xl font-semibold text-error">
                {mockMetrics.lowStockItems}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-error" />
          </div>
        </div>
        <div className="bg-surface rounded-lg shadow-soft p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-dark/60">Top Category</p>
              <p className="text-2xl font-semibold text-secondary">
                {mockMetrics.topCategory}
              </p>
            </div>
            <Package className="h-8 w-8 text-secondary" />
          </div>
        </div>
      </div>

      {/* Report Configuration */}
      <div className="bg-surface rounded-lg shadow-soft p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Report Type Selection */}
          <div>
            <label className="block text-sm font-medium text-text-dark dark:text-text-light mb-2">
              Report Type
            </label>
            <div className="space-y-2">
              {[
                { id: 'sales', label: 'Sales Report', icon: DollarSign },
                { id: 'inventory', label: 'Inventory Report', icon: Package },
                { id: 'financial', label: 'Financial Report', icon: TrendingUp },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setReportType(id as ReportType)}
                  className={`w-full flex items-center space-x-2 p-3 rounded-md transition-colors ${
                    reportType === id
                      ? 'bg-primary text-white'
                      : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Selection */}
          <div>
            <label className="block text-sm font-medium text-text-dark dark:text-text-light mb-2">
              Date Range
            </label>
            <div className="space-y-2">
              {[
                { id: 'daily', label: 'Daily', icon: Clock },
                { id: 'weekly', label: 'Weekly', icon: Calendar },
                { id: 'monthly', label: 'Monthly', icon: Calendar },
                { id: 'yearly', label: 'Yearly', icon: Calendar },
                { id: 'custom', label: 'Custom Range', icon: Calendar },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleDatePresetChange(id as DatePreset)}
                  className={`w-full flex items-center space-x-2 p-3 rounded-md transition-colors ${
                    datePreset === id
                      ? 'bg-primary text-white'
                      : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Save Report Configuration */}
          <div>
            <label className="block text-sm font-medium text-text-dark dark:text-text-light mb-2">
              Save Report
            </label>
            <div className="space-y-4">
              <input
                type="text"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="Enter report name"
                className="input-field"
              />
              <button
                onClick={handleSaveReport}
                disabled={!reportName}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                <Save className="h-5 w-5" />
                <span>Save Configuration</span>
              </button>
            </div>

            {savedReports.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-text-dark dark:text-text-light mb-2">
                  Saved Reports
                </h3>
                <div className="space-y-2">
                  {savedReports.map((report) => (
                    <button
                      key={report.id}
                      onClick={() => {
                        setReportType(report.type);
                        setDateRange(report.dateRange);
                      }}
                      className="w-full flex items-center space-x-2 p-2 rounded-md bg-primary/10 hover:bg-primary/20"
                    >
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="text-sm text-primary">{report.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-surface rounded-lg shadow-soft p-6">
        {reportType === 'sales' && <SalesReport dateRange={dateRange} />}
        {reportType === 'inventory' && <InventoryReport dateRange={dateRange} />}
        {reportType === 'financial' && <FinancialReport dateRange={dateRange} />}
      </div>
    </div>
  );
}