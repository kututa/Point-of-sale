import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import logger from '../config/logger';

export class SalesService {
  static async createSale(data: {
    itemId: string;
    quantity: number;
    sellingPrice: number;
    attendantId: string;
  }) {
    try {
      const item = await prisma.inventory.findUnique({
        where: { id: data.itemId },
      });

      if (!item) {
        throw new AppError(404, 'Inventory item not found');
      }

      if (item.quantity < data.quantity) {
        throw new AppError(400, 'Insufficient inventory');
      }

      const profit = (data.sellingPrice - item.buyingPrice) * data.quantity;

      return await prisma.$transaction(async (tx) => {
        const sale = await tx.sale.create({
          data: {
            itemId: data.itemId,
            quantity: data.quantity,
            sellingPrice: data.sellingPrice,
            profit,
            attendantId: data.attendantId,
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
    } catch (error) {
      logger.error('Error in createSale service:', error);
      throw error;
    }
  }

  static async getSales() {
    try {
      return await prisma.sale.findMany({
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
    } catch (error) {
      logger.error('Error in getSales service:', error);
      throw error;
    }
  }

  static async getSalesByDateRange(startDate: Date, endDate: Date) {
    try {
      return await prisma.sale.findMany({
        where: {
          saleDate: {
            gte: startDate,
            lte: endDate,
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
    } catch (error) {
      logger.error('Error in getSalesByDateRange service:', error);
      throw error;
    }
  }

  static async getSaleStats() {
    try {
      const [aggregates, topProducts, attendantStats] = await prisma.$transaction([
        prisma.sale.aggregate({
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
        prisma.sale.groupBy({
          by: ['itemId'],
          _sum: {
            quantity: true,
            profit: true,
          },
          orderBy: {
            _sum: {
              profit: 'desc',
            },
          },
          take: 5,
          include: {
            item: true,
          },
        }),
        prisma.sale.groupBy({
          by: ['attendantId'],
          _sum: {
            profit: true,
          },
          _count: true,
          include: {
            attendant: {
              select: {
                username: true,
                fullName: true,
              },
            },
          },
        }),
      ]);

      return {
        totals: {
          profit: aggregates._sum.profit || 0,
          quantity: aggregates._sum.quantity || 0,
          revenue: aggregates._sum.sellingPrice || 0,
        },
        averages: {
          profit: aggregates._avg.profit || 0,
          saleValue: aggregates._avg.sellingPrice || 0,
        },
        topProducts: topProducts.map(product => ({
          itemId: product.itemId,
          name: product.item.name,
          quantitySold: product._sum.quantity || 0,
          totalProfit: product._sum.profit || 0,
        })),
        attendantPerformance: attendantStats.map(stat => ({
          attendantId: stat.attendantId,
          name: stat.attendant.fullName,
          totalSales: stat._count,
          totalProfit: stat._sum.profit || 0,
        })),
      };
    } catch (error) {
      logger.error('Error in getSaleStats service:', error);
      throw error;
    }
  }
}