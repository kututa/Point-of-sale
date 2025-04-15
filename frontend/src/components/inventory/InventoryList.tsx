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
  Edit2,
  Trash2,
  AlertTriangle,
  Package,
  Filter,
  MoreVertical,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  buyingPrice: number;
  sellingPrice: number;
  quantity: number;
  imageUrl: string;
  description: string;
  lastModified: Date;
}

const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Vintage Clock',
    category: 'Timepieces',
    buyingPrice: 150,
    sellingPrice: 299,
    quantity: 2,
    imageUrl: 'https://images.unsplash.com/photo-1584208124218-0e1d8a5c1726?auto=format&fit=crop&w=100',
    description: 'Beautiful antique wall clock from the 1920s',
    lastModified: new Date(),
  },
  // Add more mock items as needed
];

const columnHelper = createColumnHelper<InventoryItem>();

const LOW_STOCK_THRESHOLD = 5;

export function InventoryList() {
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const navigate = useNavigate();

  const columns = [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
        />
      ),
    }),
    columnHelper.accessor('imageUrl', {
      header: 'Image',
      cell: info => (
        <div className="w-12 h-12">
          <img
            src={info.getValue()}
            alt={info.row.original.name}
            className="w-full h-full object-cover rounded-md"
          />
        </div>
      ),
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => (
        <div>
          <p className="font-medium text-primary">{info.getValue()}</p>
          <p className="text-sm text-text-dark/60">{info.row.original.description}</p>
        </div>
      ),
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      cell: info => (
        <span className="px-2 py-1 text-sm rounded-full bg-primary/10 text-primary">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('buyingPrice', {
      header: 'Buying Price',
      cell: info => `$${info.getValue().toFixed(2)}`,
    }),
    columnHelper.accessor('sellingPrice', {
      header: 'Selling Price',
      cell: info => `$${info.getValue().toFixed(2)}`,
    }),
    columnHelper.accessor('quantity', {
      header: 'Quantity',
      cell: info => (
        <div className="flex items-center space-x-2">
          <span className={info.getValue() <= LOW_STOCK_THRESHOLD ? 'text-error' : ''}>
            {info.getValue()}
          </span>
          {info.getValue() <= LOW_STOCK_THRESHOLD && (
            <AlertTriangle className="h-4 w-4 text-error" />
          )}
        </div>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      cell: info => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(`/inventory/${info.row.original.id}`)}
            className="p-1 hover:bg-primary/10 rounded-full"
          >
            <Edit2 className="h-4 w-4 text-primary" />
          </button>
          <button
            onClick={() => handleDelete(info.row.original.id)}
            className="p-1 hover:bg-error/10 rounded-full"
          >
            <Trash2 className="h-4 w-4 text-error" />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: mockInventory,
    columns,
    state: {
      globalFilter,
      rowSelection: {},
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
  });

  const handleDelete = (id: string) => {
    // Handle delete logic here
    toast.success('Item deleted successfully');
  };

  const handleExport = () => {
    // Handle export logic here
    toast.success('Inventory exported successfully');
  };

  const handleBulkAction = (action: string) => {
    // Handle bulk actions here
    toast.success(`Bulk action "${action}" completed`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary dark:text-accent-dark">
          Inventory Management
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/inventory/new')}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Item</span>
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
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary/50" />
              <input
                type="text"
                value={globalFilter ?? ''}
                onChange={e => setGlobalFilter(e.target.value)}
                placeholder="Search inventory..."
                className="pl-10 input-field"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn-secondary flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filter</span>
              </button>
              {selectedItems.length > 0 && (
                <div className="flex items-center space-x-2">
                  <select
                    onChange={(e) => handleBulkAction(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Bulk Actions</option>
                    <option value="delete">Delete Selected</option>
                    <option value="category">Update Category</option>
                  </select>
                </div>
              )}
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