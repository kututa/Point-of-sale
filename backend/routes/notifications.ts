import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationPreferences,
  updateNotificationPreferences,
} from '../controllers/notification.controller';

const router = Router();

// All notification routes require authentication
router.use(authenticate);

// Notification CRUD routes
router.post('/', createNotification);
router.get('/', getNotifications);
router.post('/:id/read', markAsRead);
router.post('/read-all', markAllAsRead);
router.delete('/:id', deleteNotification);

// Notification preferences routes
router.get('/preferences', getNotificationPreferences);
router.put('/preferences', updateNotificationPreferences);

export const notificationRouter = router;