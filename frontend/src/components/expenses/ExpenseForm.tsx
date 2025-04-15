import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import { ImageUpload } from '../inventory/ImageUpload';
import toast from 'react-hot-toast';

const expenseSchema = z.object({
  description: z.string().min(2, 'Description is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  date: z.string(),
  category: z.string().min(1, 'Category is required'),
  isRecurring: z.boolean().optional(),
  recurringFrequency: z.string().optional(),
  receiptUrl: z.string().optional(),
  notes: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

const EXPENSE_CATEGORIES = [
  'Rent',
  'Utilities',
  'Transportation',
  'Supplies',
  'Marketing',
  'Insurance',
  'Maintenance',
  'Other',
];

export function ExpenseForm() {
  const navigate = useNavigate();
  const [isRecurring, setIsRecurring] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      isRecurring: false,
    },
  });

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      // Handle form submission here
      console.log(data);
      toast.success('Expense saved successfully');
      navigate('/expenses');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save expense');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/expenses')}
          className="p-2 hover:bg-primary/10 rounded-full"
        >
          <ArrowLeft className="h-6 w-6 text-primary" />
        </button>
        <h1 className="text-2xl font-bold text-primary dark:text-accent-dark">
          Add New Expense
        </h1>
      </div>

      <div className="bg-surface rounded-lg shadow-soft p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-dark dark:text-text-light mb-2">
                Description
              </label>
              <input
                {...register('description')}
                type="text"
                className="input-field"
                placeholder="Enter expense description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-error">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark dark:text-text-light mb-2">
                Category
              </label>
              <select
                {...register('category')}
                className="input-field"
              >
                <option value="">Select category</option>
                {EXPENSE_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-error">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark dark:text-text-light mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-dark/60">
                  $
                </span>
                <input
                  {...register('amount', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="input-field pl-8"
                  placeholder="0.00"
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-error">{errors.amount.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark dark:text-text-light mb-2">
                Date
              </label>
              <input
                {...register('date')}
                type="date"
                className="input-field"
              />
              {errors.date && (
                <p className="mt-1 text-sm text-error">{errors.date.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                />
                <label className="text-sm font-medium text-text-dark dark:text-text-light">
                  Recurring Expense
                </label>
              </div>

              {isRecurring && (
                <div>
                  <select
                    {...register('recurringFrequency')}
                    className="input-field"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-dark dark:text-text-light mb-2">
                Receipt Image
              </label>
              <ImageUpload
                value={watch('receiptUrl')}
                onChange={(value) => setValue('receiptUrl', value)}
                onRemove={() => setValue('receiptUrl', '')}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-dark dark:text-text-light mb-2">
                Notes
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="input-field"
                placeholder="Add any additional notes"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/expenses')}
              className="px-4 py-2 text-text-dark dark:text-text-light hover:bg-primary/10 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>Save Expense</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}