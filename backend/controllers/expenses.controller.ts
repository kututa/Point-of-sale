import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import logger from '../config/logger';
import { z } from 'zod';

const expenseSchema = z.object({
  description: z.string().min(2, 'Description must be at least 2 characters'),
  amount: z.number().positive('Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
  date: z.string().transform(str => new Date(str)),
});

export const createExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = expenseSchema.parse(req.body);

    const expense = await prisma.expense.create({
      data: {
        ...data,
        addedBy: req.user!.id,
      },
      include: {
        user: {
          select: {
            username: true,
            fullName: true,
          },
        },
      },
    });

    logger.info('Created new expense:', { expenseId: expense.id });
    res.status(201).json(expense);
  } catch (error) {
    logger.error('Error creating expense:', error);
    next(error);
  }
};

export const getExpenses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, startDate, endDate } = req.query;

    const where: any = {};

    if (category) {
      where.category = category as string;
    }

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    const expenses = await prisma.expense.findMany({
      where,
      include: {
        user: {
          select: {
            username: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    res.json(expenses);
  } catch (error) {
    logger.error('Error fetching expenses:', error);
    next(error);
  }
};

export const getExpenseStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query;

    const where: any = {};

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    const [totalAmount, categoryBreakdown] = await prisma.$transaction([
      prisma.expense.aggregate({
        where,
        _sum: {
          amount: true,
        },
      }),
      prisma.expense.groupBy({
        where,
        by: ['category'],
        _sum: {
          amount: true,
        },
      }),
    ]);

    const stats = {
      totalAmount: totalAmount._sum.amount || 0,
      categoryBreakdown: categoryBreakdown.map(item => ({
        category: item.category,
        amount: item._sum.amount || 0,
      })),
    };

    res.json(stats);
  } catch (error) {
    logger.error('Error fetching expense stats:', error);
    next(error);
  }
};

export const updateExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = expenseSchema.parse(req.body);

    const expense = await prisma.expense.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            username: true,
            fullName: true,
          },
        },
      },
    });

    logger.info('Updated expense:', { expenseId: expense.id });
    res.json(expense);
  } catch (error) {
    logger.error('Error updating expense:', error);
    next(error);
  }
};

export const deleteExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.expense.delete({
      where: { id },
    });

    logger.info('Deleted expense:', { expenseId: id });
    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting expense:', error);
    next(error);
  }
};