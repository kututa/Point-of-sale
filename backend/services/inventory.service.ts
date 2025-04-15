import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import logger from '../config/logger';

export class InventoryService {
  static async createItem(data: {
    name: string;
    category: string;
    description?: string;
    buyingPrice: number;
    sellingPrice: number;
    quantity: number;
    imageUrl?: string;
    modifiedBy?: string;
  }) {
    try {
      return await prisma.inventory.create({
        data,
        include: {
          modifier: {
            select: {
              username: true,
              fullName: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error('Error in createItem service:', error);
      throw error;
    }
  }

  static async getItems() {
    try {
      return await prisma.inventory.findMany({
        include: {
          modifier: {
            select: {
              username: true,
              fullName: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error('Error in getItems service:', error);
      throw error;
    }
  }

  static async getItemById(id: string) {
    try {
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

      return item;
    } catch (error) {
      logger.error('Error in getItemById service:', error);
      throw error;
    }
  }

  static async updateItem(id: string, data: {
    name?: string;
    category?: string;
    description?: string;
    buyingPrice?: number;
    sellingPrice?: number;
    quantity?: number;
    imageUrl?: string;
    modifiedBy?: string;
  }) {
    try {
      return await prisma.inventory.update({
        where: { id },
        data,
        include: {
          modifier: {
            select: {
              username: true,
              fullName: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error('Error in updateItem service:', error);
      throw error;
    }
  }

  static async deleteItem(id: string) {
    try {
      return await prisma.inventory.delete({
        where: { id },
      });
    } catch (error) {
      logger.error('Error in deleteItem service:', error);
      throw error;
    }
  }

  static async getLowStockItems(threshold: number) {
    try {
      return await prisma.inventory.findMany({
        where: {
          quantity: {
            lte: threshold,
          },
        },
        include: {
          modifier: {
            select: {
              username: true,
              fullName: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error('Error in getLowStockItems service:', error);
      throw error;
    }
  }

  static async getInventoryStats() {
    try {
      const [totalValue, categoryStats] = await prisma.$transaction([
        prisma.inventory.aggregate({
          _sum: {
            buyingPrice: true,
            sellingPrice: true,
          },
          _count: true,
        }),
        prisma.inventory.groupBy({
          by: ['category'],
          _sum: {
            quantity: true,
          },
          _count: true,
        }),
      ]);

      return {
        totalItems: totalValue._count,
        totalBuyingValue: totalValue._sum.buyingPrice || 0,
        totalSellingValue: totalValue._sum.sellingPrice || 0,
        categoryBreakdown: categoryStats.map(stat => ({
          category: stat.category,
          itemCount: stat._count,
          totalQuantity: stat._sum.quantity || 0,
        })),
      };
    } catch (error) {
      logger.error('Error in getInventoryStats service:', error);
      throw error;
    }
  }
}