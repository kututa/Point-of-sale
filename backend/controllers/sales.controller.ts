import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import logger from '../config/logger';
import { z } from 'zod';

const saleSchema = z.object({
  itemId: z.string().uuid(),
  quantity: z.number().int().positive(),
  sellingPrice: z.number().positive(),
});

export const createSale = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = saleSchema.parse(req.body);

    // Get the inventory item
    const item = await prisma.inventory.findUnique({
      where: { id: data.itemId },
    });

    if (!item) {
      throw new AppError(404, 'Inventory item not found');
    }

    if (item.quantity < data.quantity) {
      throw new AppError(400, 'Insufficient inventory');
    }

    // Calculate profit
    const profit = (data.sellingPrice - item.buyingPrice) * data.quantity;

    // Create sale and update inventory in a transaction
    const sale = await prisma.$transaction(async (tx) => {
      // Create the sale record
      const sale = await tx.sale.create({
        data: {
          itemId: data.itemId,
          quantity: data.quantity,
          sellingPrice: data.sellingPrice,
          profit,
          attendantId: req.user!.id,
        },
      });

      // Update inventory quantity
      await tx.inventory.update({
        where: { id: data.itemId },
        data: {
          quantity: {
            decrement: data.quantity,
          },
        },
      });

      return sale;
    });

    logger.info('Created new sale:', { saleId: sale.id });
    res.status(201).json(sale);
  } catch (error) {
    logger.error('Error creating sale:', error);
    next(error);
  }
};

export const getSales = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        item: true,
        attendant: {
          select: {
            username: true,
            fullName: true,
          },
        },
      },
    });

    res.json(sales);
  } catch (error) {
    logger.error('Error fetching sales:', error);
    next(error);
  }
};

export const getSalesByDateRange = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      throw new AppError(400, 'Start date and end date are required');
    }

    const sales = await prisma.sale.findMany({
      where: {
        saleDate: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        },
      },
      include: {
        item: true,
        attendant: {
          select: {
            username: true,
            fullName: true,
          },
        },
      },
    });

    res.json(sales);
  } catch (error) {
    logger.error('Error fetching sales by date range:', error);
    next(error);
  }
};

export const getSaleStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await prisma.sale.aggregate({
      _sum: {
        profit: true,
        quantity: true,
      },
      _avg: {
        profit: true,
        sellingPrice: true,
      },
    });

    res.json(stats);
  } catch (error) {
    logger.error('Error fetching sale stats:', error);
    next(error);
  }
};