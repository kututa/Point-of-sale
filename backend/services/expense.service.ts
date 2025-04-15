import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import logger from '../config/logger';

export class ExpenseService {
  static async createExpense(data: {
    description: string;
    amount: number;
    category: string;
    date: Date;
    addedBy: string;
  }) {
    try {
      return await prisma.expense.create({
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
    } catch (error) {
      logger.error('Error in createExpense service:', error);
      throw error;
    }
  }

  static async getExpenses(filters?: {
    category?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    try {
      const where: any = {};

      if (filters?.category) {
        where.category = filters.category;
      }

      if (filters?.startDate && filters?.endDate) {
        where.date = {
          gte: filters.startDate,
          lte: filters.endDate,
        };
      }

      return await prisma.expense.findMany({
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
    } catch (error) {
      logger.error('Error in getExpenses service:', error);
      throw error;
    }
  }

  static async getExpenseStats(filters?: {
    startDate?: Date;
    endDate?: Date;
  }) {
    try {
      const where: any = {};

      if (filters?.startDate && filters?.endDate) {
        where.date = {
          gte: filters.startDate,
          lte: filters.endDate,
        };
      }

      const [totalAmount, categoryBreakdown, monthlyTrend] = await prisma.$transaction([
        prisma.expense.aggregate({
          where,
          _sum: {
            amount: true,
          },
          _avg: {
            amount: true,
          },
        }),
        prisma.expense.groupBy({
          where,
          by: ['category'],
          _sum: {
            amount: true,
          },
          _count: true,
        }),
        prisma.expense.groupBy({
          where,
          by: ['date'],
          _sum: {
            amount: true,
          },
          orderBy: {
            date: 'asc',
          },
        }),
      ]);

      return {
        total: totalAmount._sum.amount || 0,
        average: totalAmount._avg.amount || 0,
        categoryBreakdown: categoryBreakdown.map(item => ({
          category: item.category,
          amount: item._sum.amount || 0,
          count: item._count,
        })),
        monthlyTrend: monthlyTrend.map(item => ({
          date: item.date,
          amount: item._sum.amount || 0,
        })),
      };
    } catch (error) {
      logger.error('Error in getExpenseStats service:', error);
      throw error;
    }
  }

  static async updateExpense(id: string, data: {
    description?: string;
    amount?: number;
    category?: string;
    date?: Date;
  }) {
    try {
      return await prisma.expense.update({
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
    } catch (error) {
      logger.error('Error in updateExpense service:', error);
      throw error;
    }
  }

  static async deleteExpense(id: string) {
    try {
      return await prisma.expense.delete({
        where: { id },
      });
    } catch (error) {
      logger.error('Error in deleteExpense service:', error);
      throw error;
    }
  }
}