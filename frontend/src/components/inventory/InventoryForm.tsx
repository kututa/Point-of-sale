import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Calculator } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import toast from 'react-hot-toast';

const inventorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  buyingPrice: z.number().min(0, 'Buying price must be positive'),
  sellingPrice: z.number().min(0, 'Selling price must be positive'),
  quantity: z.number().int().min(0, 'Quantity must be positive'),
  imageUrl: z.string().optional(),
});

type InventoryFormData = z.infer<typeof inventorySchema>;

const mockCategories = [
  'Timepieces',
  'Furniture',
  'Art',
  'Jewelry',
  'Books',
  'Collectibles',
];

export function InventoryForm() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      buyingPrice: 0,
      sellingPrice: 0,
      quantity: 0,
    },
  });

  const buyingPrice = watch('buyingPrice');
  const sellingPrice = watch('sellingPrice');
  const profitMargin = buyingPrice > 0 ? ((sellingPrice - buyingPrice) / buyingPrice) * 100 : 0;

  const onSubmit = async (data: InventoryFormData) => {
    try {
      // Handle form submission here
      console.log(data);
      toast.success('Item saved successfully');
      navigate('/inventory');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save item');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/inventory')}
          className="p-2 hover:bg-primary/10 rounded-full"
        >
          <ArrowLeft className="h-6 w-6 text-primary" />
        </button>
        <h1 className="text-2xl font-bold text-primary dark:text-accent-dark">
          Add New Item
        </h1>
      </div>

      <div className="bg-surface rounded-lg shadow-soft p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-dark dark:text-text-light mb-2">
                Item Image
              </label>
              <ImageUpload
                value={watch('imageUrl')}
                onChange={(value) => setValue('imageUrl', value)}
                onRemove={() => setValue('imageUrl', '')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark dark:text-text-light mb-2">
                Name
              </label>
              <input
                {...register('name')}
                type="text"
                className="input-field"
                placeholder="Enter item name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-error">{errors.name.message}</p>
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
                {mockCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-error">{errors.category.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-dark dark:text-text-light mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="input-field"
                placeholder="Enter item description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-error">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark dark:text-text-light mb-2">
                Buying Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-dark/60">
                  $
                </span>
                <input
                  {...register('buyingPrice', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="input-field pl-8"
                  placeholder="0.00"
                />
              </div>
              {errors.buyingPrice && (
                <p className="mt-1 text-sm text-error">{errors.buyingPrice.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark dark:text-text-light mb-2">
                Selling Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-dark/60">
                  $
                </span>
                <input
                  {...register('sellingPrice', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="input-field pl-8"
                  placeholder="0.00"
                />
              </div>
              {errors.sellingPrice && (
                <p className="mt-1 text-sm text-error">{errors.sellingPrice.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark dark:text-text-light mb-2">
                Quantity
              </label>
              <input
                {...register('quantity', { valueAsNumber: true })}
                type="number"
                className="input-field"
                placeholder="Enter quantity"
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-error">{errors.quantity.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark dark:text-text-light mb-2">
                Profit Margin
              </label>
              <div className="flex items-center space-x-2 p-3 bg-primary/5 rounded-md">
                <Calculator className="h-5 w-5 text-primary" />
                <span className="text-primary font-medium">
                  {profitMargin.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/inventory')}
              className="px-4 py-2 text-text-dark dark:text-text-light hover:bg-primary/10 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>Save Item</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}