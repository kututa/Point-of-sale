import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import logger from '../config/logger';
import { z } from 'zod';
import { NotificationType, NotificationPriority } from '../../types/notification';

const notificationSchema = z.object({
  type: z.nativeEnum(NotificationType),
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  priority: z.nativeEnum(NotificationPriority),
  link: z.string().optional(),
  roleAccess: z.array(z.string()).optional(),
});

export const createNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = notificationSchema.parse(req.body);

    const notification = await prisma.notification.create({
      data: {
        ...data,
        createdBy: req.user!.id,
      },
      include: {
        creator: {
          select: {
            username: true,
            fullName: true,
          },
        },
      },
    });

    logger.info('Created new notification:', { notificationId: notification.id });
    res.status(201).json(notification);
  } catch (error) {
    logger.error('Error creating notification:', error);
    next(error);
  }
};

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, priority, unreadOnly } = req.query;
    const userId = req.user!.id;

    const where: any = {
      OR: [
        { roleAccess: { has: req.user!.role } },
        { roleAccess: { isEmpty: true } },
      ],
    };

    if (type) {
      where.type = type;
    }

    if (priority) {
      where.priority = priority;
    }

    if (unreadOnly === 'true') {
      where.readBy = {
        none: {
          id: userId,
        },
      };
    }

    const notifications = await prisma.notification.findMany({
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

    res.json(notifications);
  } catch (error) {
    logger.error('Error fetching notifications:', error);
    next(error);
  }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    await prisma.notification.update({
      where: { id },
      data: {
        readBy: {
          connect: { id: userId },
        },
      },
    });

    res.status(204).send();
  } catch (error) {
    logger.error('Error marking notification as read:', error);
    next(error);
  }
};

export const markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    await prisma.user.update({
      where: { id: userId },
      data: {
        readNotifications: {
          connect: await prisma.notification.findMany({
            where: {
              OR: [
                { roleAccess: { has: req.user!.role } },
                { roleAccess: { isEmpty: true } },
              ],
            },
            select: { id: true },
          }),
        },
      },
    });

    res.status(204).send();
  } catch (error) {
    logger.error('Error marking all notifications as read:', error);
    next(error);
  }
};

export const deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.notification.delete({
      where: { id },
    });

    logger.info('Deleted notification:', { notificationId: id });
    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting notification:', error);
    next(error);
  }
};

export const getNotificationPreferences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const preferences = await prisma.notificationPreferences.findUnique({
      where: { userId },
    });

    if (!preferences) {
      throw new AppError(404, 'Notification preferences not found');
    }

    res.json(preferences);
  } catch (error) {
    logger.error('Error fetching notification preferences:', error);
    next(error);
  }
};

export const updateNotificationPreferences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { enableEmailNotifications, notificationTypes, summaryFrequency } = req.body;

    const preferences = await prisma.notificationPreferences.upsert({
      where: { userId },
      update: {
        enableEmailNotifications,
        notificationTypes,
        summaryFrequency,
      },
      create: {
        userId,
        enableEmailNotifications,
        notificationTypes,
        summaryFrequency,
      },
    });

    logger.info('Updated notification preferences:', { userId });
    res.json(preferences);
  } catch (error) {
    logger.error('Error updating notification preferences:', error);
    next(error);
  }
};