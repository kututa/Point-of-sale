import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../../types/auth';
import {
  createSale,
  getSales,
  getSalesByDateRange,
  getSaleStats,
} from '../controllers/sales.controller';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.OWNER, UserRole.ATTENDANT),
  createSale
);

router.get(
  '/',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.OWNER),
  getSales
);

router.get(
  '/date-range',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.OWNER),
  getSalesByDateRange
);

router.get(
  '/stats',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.OWNER),
  getSaleStats
);

export const salesRouter = router;