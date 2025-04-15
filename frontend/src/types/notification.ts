import { UserRole } from './auth';

export enum NotificationType {
  SYSTEM = 'SYSTEM',
  INVENTORY = 'INVENTORY',
  SALES = 'SALES',
  USER = 'USER',
  EXPENSE = 'EXPENSE'
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  timestamp: Date;
  read: boolean;
  link?: string;
  roleAccess?: UserRole[];
  createdBy?: string;
  readBy?: string[];
}

export interface NotificationPreferences {
  id: string;
  userId: string;
  enableEmailNotifications: boolean;
  notificationTypes: Record<NotificationType, boolean>;
  summaryFrequency: 'daily' | 'weekly' | 'never';
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationStats {
  totalUnread: number;
  byPriority: Record<NotificationPriority, number>;
  byType: Record<NotificationType, number>;
}