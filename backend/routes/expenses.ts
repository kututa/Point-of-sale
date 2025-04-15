import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../../types/auth';
import {
  createExpense,
  getExpenses,
  getExpenseStats,
  updateExpense,
  deleteExpense,
} from '../controllers/expenses.controller';

const router = Router();

// Only admins and owners can manage expenses
router.use(authenticate, authorize(UserRole.ADMIN, UserRole.OWNER));

router.post('/', createExpense);
router.get('/', getExpenses);
router.get('/stats', getExpenseStats);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export const expensesRouter = router;