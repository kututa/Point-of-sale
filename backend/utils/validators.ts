import { z } from 'zod';
import { UserRole } from '../../types/auth';
import { NotificationType, NotificationPriority } from '../../types/notification';

// User validation schemas
export const userSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  role: z.nativeEnum(UserRole),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
});

// Inventory validation schemas
export const inventorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  buyingPrice: z.number().min(0, 'Buying price must be positive'),
  sellingPrice: z.number().min(0, 'Selling price must be positive'),
  quantity: z.number().int().min(0, 'Quantity must be positive'),
  imageUrl: z.string().url().optional(),
});

// Sales validation schemas
export const saleSchema = z.object({
  itemId: z.string().uuid(),
  quantity: z.number().int().positive(),
  sellingPrice: z.number().positive(),
});

// Expense validation schemas
export const expenseSchema = z.object({
  description: z.string().min(2, 'Description must be at least 2 characters'),
  amount: z.number().positive('Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
  date: z.string().transform(str => new Date(str)),
});

// Notification validation schemas
export const notificationSchema = z.object({
  type: z.nativeEnum(NotificationType),
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  priority: z.nativeEnum(NotificationPriority),
  link: z.string().url().optional(),
  roleAccess: z.array(z.nativeEnum(UserRole)).optional(),
});

// Query parameter validation schemas
export const dateRangeSchema = z.object({
  startDate: z.string().transform(str => new Date(str)),
  endDate: z.string().transform(str => new Date(str)),
});

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});