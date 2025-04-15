import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../../types/auth';
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deactivateUser,
  getUserStats,
} from '../controllers/users.controller';

const router = Router();

// Only admins can manage users
router.use(authenticate, authorize(UserRole.ADMIN));

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUser);
router.get('/:id/stats', getUserStats);
router.put('/:id', updateUser);
router.post('/:id/deactivate', deactivateUser);

export const usersRouter = router;