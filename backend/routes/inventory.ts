import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../../types/auth';
import {
  getInventory,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from '../controllers/inventory.controller';

const router = Router();

router.get('/', authenticate, getInventory);
router.get('/:id', authenticate, getInventoryItem);

router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.OWNER),
  createInventoryItem
);

router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.OWNER),
  updateInventoryItem
);

router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  deleteInventoryItem
);

export const inventoryRouter = router;