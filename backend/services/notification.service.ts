import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import logger from '../config/logger';
import { NotificationType, NotificationPriority } from '../../types/notification';
import { UserRole } from '../../types/auth';

export class NotificationService {
  static async createNotification(data: {
    type: NotificationType;
    title: string;
    message: string;
    priority: NotificationPriority;
    link?: string;
    roleAccess?: UserRole[];
    createdBy: string;
  }) {
    try {
      return await prisma.notification.create({
        data,
        include: {
          creator: {
            select: {
              username: true,
              fullName: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error('Error in createNotification service:', error);
      throw error;
    }
  }

  static async getNotifications(filters: {
    userId: string;
    userRole: UserRole;
    type?: NotificationType;
    priority?: NotificationPriority;
    unreadOnly?: boolean;
  }) {
    try {
      const where: any = {
        OR: [
          { roleAccess: { has: filters.userRole } },
          { roleAccess: { isEmpty: true } },
        ],
      };

      if (filters.type) {
        where.type = filters.type;
      }

      if (filters.priority) {
        where.priority = filters.priority;
      }

      if (filters.unreadOnly) {
        where.readBy = {
          none: {
            id: filters.userId,
          },
        };
      }

      return await prisma.notification.findMany({
        where,
        include: {
          creator: {
            select: {
              username: true,
              fullName: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      logger.error('Error in getNotifications service:', error);
      throw error;
    }
  }

  static async markAsRead(notificationId: string, userId: string) {
    try {
      return await prisma.notification.update({
        where: { id: notificationId },
        data: {
          readBy: {
            connect: { id: userId },
          },
        },
      });
    } catch (error) {
      logger.error('Error in markAsRead service:', error);
      throw error;
    }
  }

  static async markAllAsRead(userId: string, userRole: UserRole) {
    try {
      const notifications = await prisma.notification.findMany({
        where: {
          OR: [
            { roleAccess: { has: userRole } },
            { roleAccess: { isEmpty: true } },
          ],
        },
        select: { id: true },
      });

      await prisma.user.update({
        where: { id: userId },
        data: {
          readNotifications: {
            connect: notifications,
          },
        },
      });
    } catch (error) {
      logger.error('Error in markAllAsRead service:', error);
      throw error;
    }
  }

  static async deleteNotification(id: string) {
    try {
      return await prisma.notification.delete({
        where: { id },
      });
    } catch (error) {
      logger.error('Error in deleteNotification service:', error);
      throw error;
    }
  }

  static async getNotificationPreferences(userId: string) {
    try {
      const preferences = await prisma.notificationPreferences.findUnique({
        where: { userId },
      });

      if (!preferences) {
        throw new AppError(404, 'Notification preferences not found');
      }

      return preferences;
    } catch (error) {
      logger.error('Error in getNotificationPreferences service:', error);
      throw error;
    }
  }

  static async updateNotificationPreferences(userId: string, data: {
    enableEmailNotifications?: boolean;
    notificationTypes?: Record<NotificationType, boolean>;
    summaryFrequency?: string;
  }) {
    try {
      return await prisma.notificationPreferences.upsert({
        where: { userId },
        update: data,
        create: {
          userId,
          ...data,
        },
      });
    } catch (error) {
      logger.error('Error in updateNotificationPreferences service:', error);
      throw error;
    }
  }
}