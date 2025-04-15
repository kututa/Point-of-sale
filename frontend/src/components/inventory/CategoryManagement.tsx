import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  color: string;
  itemCount: number;
}

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Timepieces',
    color: '#D6A75B',
    itemCount: 15,
  },
  {
    id: '2',
    name: 'Furniture',
    color: '#6B4F3B',
    itemCount: 28,
  },
  // Add more categories as needed
];

export function CategoryManagement() {
  const [categories, setCategories] = useState(mockCategories);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '#000000',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      // Handle update
      setCategories(categories.map(cat =>
        cat.id === editingCategory.id
          ? { ...cat, ...newCategory }
          : cat
      ));
      toast.success('Category updated successfully');
    } else {
      // Handle create
      setCategories([...categories, {
        id: Date.now().toString(),
        ...newCategory,
        itemCount: 0,
      }]);
      toast.success('Category created successfully');
    }
    setNewCategory({ name: '', color: '#000000' });
    setEditingCategory(null);
  };

  const handleDelete = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
    toast.success('Category deleted successfully');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary dark:text-accent-dark">
        Category Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Category Form */}
        <div className="bg-surface rounded-lg shadow-soft p-6">
          <h2 className="text-lg font-semibold text-primary dark:text-accent-dark mb-4">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-dark dark:text-text-light mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="input-field"
                placeholder="Enter category name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark dark:text-text-light mb-2">
                Color
              </label>
              <input
                type="color"
                value={newCategory.color}
                onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                className="w-full h-10 rounded-md cursor-pointer"
              />
            </div>
            <div className="flex justify-end space-x-4">
              {editingCategory && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingCategory(null);
                    setNewCategory({ name: '', color: '#000000' });
                  }}
                  className="px-4 py-2 text-text-dark dark:text-text-light hover:bg-primary/10 rounded-md"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>{editingCategory ? 'Update' : 'Add'} Category</span>
              </button>
            </div>
          </form>
        </div>

        {/* Categories List */}
        <div className="md:col-span-2 bg-surface rounded-lg shadow-soft p-6">
          <h2 className="text-lg font-semibold text-primary dark:text-accent-dark mb-4">
            Categories
          </h2>
          <div className="space-y-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 bg-primary/5 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <p className="font-medium text-primary">{category.name}</p>
                    <p className="text-sm text-text-dark/60">
                      {category.itemCount} items
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingCategory(category);
                      setNewCategory({
                        name: category.name,
                        color: category.color,
                      });
                    }}
                    className="p-1 hover:bg-primary/10 rounded-full"
                  >
                    <Edit2 className="h-4 w-4 text-primary" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-1 hover:bg-error/10 rounded-full"
                  >
                    <Trash2 className="h-4 w-4 text-error" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}