import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import logger from '../config/logger';
import { z } from 'zod';

const inventorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  buyingPrice: z.number().min(0, 'Buying price must be positive'),
  sellingPrice: z.number().min(0, 'Selling price must be positive'),
  quantity: z.number().int().min(0, 'Quantity must be positive'),
  imageUrl: z.string().optional(),
});

export const getInventory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inventory = await prisma.inventory.findMany({
      include: {
        modifier: {
          select: {
            username: true,
            fullName: true,
          },
        },
      },
    });

    res.json(inventory);
  } catch (error) {
    logger.error('Error fetching inventory:', error);
    next(error);
  }
};

export const getInventoryItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const item = await prisma.inventory.findUnique({
      where: { id },
      include: {
        modifier: {
          select: {
            username: true,
            fullName: true,
          },
        },
      },
    });

    if (!item) {
      throw new AppError(404, 'Inventory item not found');
    }

    res.json(item);
  } catch (error) {
    logger.error('Error fetching inventory item:', error);
    next(error);
  }
};

export const createInventoryItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = inventorySchema.parse(req.body);

    const item = await prisma.inventory.create({
      data: {
        ...data,
        modifiedBy: req.user?.id,
      },
    });

    logger.info('Created new inventory item:', { itemId: item.id });
    res.status(201).json(item);
  } catch (error) {
    logger.error('Error creating inventory item:', error);
    next(error);
  }
};

export const updateInventoryItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = inventorySchema.parse(req.body);

    const item = await prisma.inventory.update({
      where: { id },
      data: {
        ...data,
        modifiedBy: req.user?.id,
      },
    });

    logger.info('Updated inventory item:', { itemId: item.id });
    res.json(item);
  } catch (error) {
    logger.error('Error updating inventory item:', error);
    next(error);
  }
};

export const deleteInventoryItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.inventory.delete({
      where: { id },
    });

    logger.info('Deleted inventory item:', { itemId: id });
    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting inventory item:', error);
    next(error);
  }
};