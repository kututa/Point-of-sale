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
import { Edit2, Search, Download, UserPlus, AlertTriangle, CheckCircle } from 'lucide-react';
import { UserRole } from '../../types/auth';

interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE';
  lastLogin: Date | null;
  email: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    username: 'john.doe',
    fullName: 'John Doe',
    role: 'ADMIN',
    status: 'ACTIVE',
    lastLogin: new Date(),
    email: 'john@example.com'
  },
  // Add more mock users as needed
];

const columnHelper = createColumnHelper<User>();

export function UsersList() {
  const [globalFilter, setGlobalFilter] = useState('');
  const navigate = useNavigate();

  const columns = [
    columnHelper.accessor('username', {
      header: 'Username',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('fullName', {
      header: 'Full Name',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('role', {
      header: 'Role',
      cell: info => (
        <span className="px-2 py-1 text-sm rounded-full bg-primary/10 text-primary">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <div className="flex items-center space-x-1">
          {info.getValue() === 'ACTIVE' ? (
            <>
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-success">Active</span>
            </>
          ) : (
            <>
              <AlertTriangle className="h-4 w-4 text-error" />
              <span className="text-error">Inactive</span>
            </>
          )}
        </div>
      ),
    }),
    columnHelper.accessor('lastLogin', {
      header: 'Last Login',
      cell: info => info.getValue() ? format(info.getValue() as Date, 'PPp') : 'Never',
    }),
    columnHelper.display({
      id: 'actions',
      cell: info => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(`/admin/users/${info.row.original.id}`)}
            className="p-1 hover:bg-primary/10 rounded-full"
          >
            <Edit2 className="h-4 w-4 text-primary" />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: mockUsers,
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary dark:text-accent-dark">
          User Management
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/users/new')}
            className="btn-primary flex items-center space-x-2"
          >
            <UserPlus className="h-5 w-5" />
            <span>Add User</span>
          </button>
          <button className="btn-secondary flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-lg shadow-soft">
        <div className="p-4 border-b border-border dark:border-primary/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary/50" />
            <input
              type="text"
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder="Search users..."
              className="pl-10 input-field"
            />
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