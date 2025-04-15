import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import {
  Search,
  Download,
  Plus,
  Filter,
  Calendar,
  DollarSign,
  FileText,
  Tag,
  Repeat,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Expense {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: Date;
  isRecurring: boolean;
  receiptUrl?: string;
}

const mockExpenses: Expense[] = [
  {
    id: '1',
    description: 'Monthly Rent',
    category: 'Rent',
    amount: 2500,
    date: new Date(),
    isRecurring: true,
  },
  {
    id: '2',
    description: 'Electricity Bill',
    category: 'Utilities',
    amount: 350,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isRecurring: true,
  },
];

const columnHelper = createColumnHelper<Expense>();

const EXPENSE_CATEGORIES = [
  'All',
  'Rent',
  'Utilities',
  'Transportation',
  'Supplies',
  'Marketing',
  'Insurance',
  'Maintenance',
  'Other',
];

export function ExpenseList() {
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    to: format(new Date(), 'yyyy-MM-dd'),
  });
  const navigate = useNavigate();

  const columns = [
    columnHelper.accessor('description', {
      header: 'Description',
      cell: info => (
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-primary/50" />
          <span>{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      cell: info => (
        <div className="flex items-center space-x-2">
          <Tag className="h-5 w-5 text-primary/50" />
          <span className="px-2 py-1 text-sm rounded-full bg-primary/10 text-primary">
            {info.getValue()}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: info => (
        <div className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-primary/50" />
          <span className="font-medium">${info.getValue().toFixed(2)}</span>
        </div>
      ),
    }),
    columnHelper.accessor('date', {
      header: 'Date',
      cell: info => (
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-primary/50" />
          <span>{format(info.getValue(), 'PP')}</span>
        </div>
      ),
    }),
    columnHelper.accessor('isRecurring', {
      header: 'Type',
      cell: info => info.getValue() ? (
        <div className="flex items-center space-x-1 text-secondary">
          <Repeat className="h-5 w-5" />
          <span>Recurring</span>
        </div>
      ) : (
        <span className="text-text-dark/60">One-time</span>
      ),
    }),
  ];

  const table = useReactTable({
    data: mockExpenses,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleExport = () => {
    // Handle export logic here
    toast.success('Expenses exported successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary dark:text-accent-dark">
          Expense Management
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/expenses/new')}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Expense</span>
          </button>
          <button
            onClick={handleExport}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-lg shadow-soft">
        <div className="p-4 border-b border-border dark:border-primary/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary/50" />
              <input
                type="text"
                value={globalFilter ?? ''}
                onChange={e => setGlobalFilter(e.target.value)}
                placeholder="Search expenses..."
                className="pl-10 input-field"
              />
            </div>

            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                {EXPENSE_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="border-b border-border dark:border-primary/20">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-3 text-left text-sm font-semibold text-primary dark:text-accent-dark">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-b border-border dark:border-primary/20 hover:bg-primary/5">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 text-sm text-text-dark dark:text-text-light">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border dark:border-primary/20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 rounded-md bg-primary/10 text-primary disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 rounded-md bg-primary/10 text-primary disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <span className="text-sm text-text-dark/60 dark:text-text-light/60">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </span>
        </div>
      </div>
    </div>
  );
}