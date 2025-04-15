import { prisma } from '../config/database';
import { UserRole } from '../../types/auth';
import { AppError } from '../middleware/errorHandler';
import { supabase } from '../../lib/supabase';
import logger from '../config/logger';

export class UserService {
  static async createUser(data: {
    username: string;
    fullName: string;
    email: string;
    role: UserRole;
    password: string;
  }) {
    try {
      // Create Supabase auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: {
          role: data.role,
        },
      });

      if (authError) {
        throw new AppError(400, authError.message);
      }

      // Create user in our database
      const user = await prisma.user.create({
        data: {
          id: authData.user.id,
          username: data.username,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
        },
      });

      return user;
    } catch (error) {
      logger.error('Error in createUser service:', error);
      throw error;
    }
  }

  static async getUsers() {
    try {
      return await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          fullName: true,
          email: true,
          role: true,
          status: true,
          lastLogin: true,
          createdAt: true,
        },
      });
    } catch (error) {
      logger.error('Error in getUsers service:', error);
      throw error;
    }
  }

  static async getUserById(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          modifiedInventory: {
            select: {
              id: true,
              name: true,
              updatedAt: true,
            },
          },
          sales: {
            select: {
              id: true,
              saleDate: true,
              profit: true,
            },
          },
          expenses: {
            select: {
              id: true,
              description: true,
              amount: true,
              date: true,
            },
          },
        },
      });

      if (!user) {
        throw new AppError(404, 'User not found');
      }

      return user;
    } catch (error) {
      logger.error('Error in getUserById service:', error);
      throw error;
    }
  }

  static async updateUser(id: string, data: {
    username?: string;
    fullName?: string;
    email?: string;
    role?: UserRole;
    password?: string;
  }) {
    try {
      // Update user metadata in Supabase if role changed
      if (data.role) {
        const { error: authError } = await supabase.auth.admin.updateUserById(
          id,
          { user_metadata: { role: data.role } }
        );

        if (authError) {
          throw new AppError(400, authError.message);
        }
      }

      // Update password if provided
      if (data.password) {
        const { error: passwordError } = await supabase.auth.admin.updateUserById(
          id,
          { password: data.password }
        );

        if (passwordError) {
          throw new AppError(400, passwordError.message);
        }
      }

      return await prisma.user.update({
        where: { id },
        data: {
          username: data.username,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
        },
      });
    } catch (error) {
      logger.error('Error in updateUser service:', error);
      throw error;
    }
  }

  static async deactivateUser(id: string) {
    try {
      // Deactivate user in Supabase
      const { error: authError } = await supabase.auth.admin.updateUserById(
        id,
        { ban_duration: '999999h' }
      );

      if (authError) {
        throw new AppError(400, authError.message);
      }

      return await prisma.user.update({
        where: { id },
        data: {
          status: 'INACTIVE',
        },
      });
    } catch (error) {
      logger.error('Error in deactivateUser service:', error);
      throw error;
    }
  }

  static async getUserStats(id: string) {
    try {
      const [salesStats, expenseStats] = await prisma.$transaction([
        prisma.sale.aggregate({
          where: {
            attendantId: id,
          },
          _sum: {
            profit: true,
            quantity: true,
          },
          _count: true,
        }),
        prisma.expense.aggregate({
          where: {
            addedBy: id,
          },
          _sum: {
            amount: true,
          },
          _count: true,
        }),
      ]);

      return {
        totalSales: salesStats._count,
        totalProfit: salesStats._sum.profit || 0,
        itemsSold: salesStats._sum.quantity || 0,
        totalExpenses: expenseStats._sum.amount || 0,
        expenseCount: expenseStats._count,
      };
    } catch (error) {
      logger.error('Error in getUserStats service:', error);
      throw error;
    }
  }
}