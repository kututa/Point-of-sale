import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../../types/auth';
import {
  getSalesSummary,
  getProfitAnalysis,
  getInventoryValue,
  getExpenseSummary,
} from '../controllers/reports.controller';

const router = Router();

// All report routes require authentication and admin/owner role
router.use(authenticate, authorize(UserRole.ADMIN, UserRole.OWNER));

router.get('/sales-summary', getSalesSummary);
router.get('/profit-analysis', getProfitAnalysis);
router.get('/inventory-value', getInventoryValue);
router.get('/expense-summary', getExpenseSummary);

export const reportsRouter = router;