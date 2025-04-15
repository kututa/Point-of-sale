import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import logger from '../config/logger';
import { z } from 'zod';

const dateRangeSchema = z.object({
  startDate: z.string().transform(str => new Date(str)),
  endDate: z.string().transform(str => new Date(str)),
});

export const getSalesSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = dateRangeSchema.parse(req.query);

    const [sales, topProducts, attendantPerformance] = await prisma.$transaction([
      // Overall sales metrics
      prisma.sale.aggregate({
        where: {
          saleDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        _sum: {
          profit: true,
          quantity: true,
          sellingPrice: true,
        },
        _avg: {
          profit: true,
          sellingPrice: true,
        },
      }),
      // Top selling products
      prisma.sale.groupBy({
        by: ['itemId'],
        where: {
          saleDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        _sum: {
          quantity: true,
          profit: true,
        },
        orderBy: {
          _sum: {
            quantity: 'desc',
          },
        },
        take: 5,
        having: {
          quantity: {
            _sum: {
              gt: 0,
            },
          },
        },
      }),
      // Attendant performance
      prisma.sale.groupBy({
        by: ['attendantId'],
        where: {
          saleDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        _sum: {
          profit: true,
          quantity: true,
        },
        _count: true,
      }),
    ]);

    res.json({
      summary: {
        totalSales: sales._sum.sellingPrice || 0,
        totalProfit: sales._sum.profit || 0,
        totalQuantity: sales._sum.quantity || 0,
        averageProfit: sales._avg.profit || 0,
        averageSaleValue: sales._avg.sellingPrice || 0,
      },
      topProducts,
      attendantPerformance,
    });
  } catch (error) {
    logger.error('Error generating sales summary:', error);
    next(error);
  }
};

export const getProfitAnalysis = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = dateRangeSchema.parse(req.query);

    const [profitTrend, categoryProfits, expenses] = await prisma.$transaction([
      // Daily profit trend
      prisma.sale.groupBy({
        by: ['saleDate'],
        where: {
          saleDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        _sum: {
          profit: true,
          sellingPrice: true,
        },
        orderBy: {
          saleDate: 'asc',
        },
      }),
      // Profit by category
      prisma.$queryRaw`
        SELECT 
          i.category,
          SUM(s.profit) as total_profit,
          SUM(s.selling_price) as total_revenue
        FROM sales s
        JOIN inventory i ON s.item_id = i.id
        WHERE s.sale_date BETWEEN ${startDate} AND ${endDate}
        GROUP BY i.category
        ORDER BY total_profit DESC
      `,
      // Total expenses for the period
      prisma.expense.aggregate({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    res.json({
      profitTrend,
      categoryProfits,
      totalExpenses: expenses._sum.amount || 0,
    });
  } catch (error) {
    logger.error('Error generating profit analysis:', error);
    next(error);
  }
};

export const getInventoryValue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [currentValue, categoryValue, lowStock] = await prisma.$transaction([
      // Total inventory value
      prisma.inventory.aggregate({
        _sum: {
          buyingPrice: true,
          sellingPrice: true,
        },
      }),
      // Value by category
      prisma.inventory.groupBy({
        by: ['category'],
        _sum: {
          buyingPrice: true,
          sellingPrice: true,
          quantity: true,
        },
      }),
      // Low stock items
      prisma.inventory.findMany({
        where: {
          quantity: {
            lte: 5, // Configurable threshold
          },
        },
        select: {
          id: true,
          name: true,
          quantity: true,
          category: true,
        },
        orderBy: {
          quantity: 'asc',
        },
      }),
    ]);

    res.json({
      currentValue: {
        cost: currentValue._sum.buyingPrice || 0,
        retail: currentValue._sum.sellingPrice || 0,
      },
      categoryValue,
      lowStock,
    });
  } catch (error) {
    logger.error('Error generating inventory value report:', error);
    next(error);
  }
};

export const getExpenseSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = dateRangeSchema.parse(req.query);

    const [summary, categoryBreakdown, trend] = await prisma.$transaction([
      // Overall summary
      prisma.expense.aggregate({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        _sum: {
          amount: true,
        },
        _avg: {
          amount: true,
        },
        _count: true,
      }),
      // Breakdown by category
      prisma.expense.groupBy({
        by: ['category'],
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        _sum: {
          amount: true,
        },
        _count: true,
        orderBy: {
          _sum: {
            amount: 'desc',
          },
        },
      }),
      // Daily trend
      prisma.expense.groupBy({
        by: ['date'],
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        _sum: {
          amount: true,
        },
        orderBy: {
          date: 'asc',
        },
      }),
    ]);

    res.json({
      summary: {
        totalExpenses: summary._sum.amount || 0,
        averageExpense: summary._avg.amount || 0,
        totalTransactions: summary._count,
      },
      categoryBreakdown,
      trend,
    });
  } catch (error) {
    logger.error('Error generating expense summary:', error);
    next(error);
  }
};