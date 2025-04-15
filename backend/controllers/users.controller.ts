import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import logger from '../config/logger';
import { z } from 'zod';
import { UserRole } from '../../types/auth';
import { supabase } from '../../lib/supabase';

const userSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  role: z.nativeEnum(UserRole),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
});

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = userSchema.parse(req.body);

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

    logger.info('Created new user:', { userId: user.id });
    res.status(201).json(user);
  } catch (error) {
    logger.error('Error creating user:', error);
    next(error);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
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

    res.json(users);
  } catch (error) {
    logger.error('Error fetching users:', error);
    next(error);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        role: true,
        status: true,
        lastLogin: true,
        createdAt: true,
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

    res.json(user);
  } catch (error) {
    logger.error('Error fetching user:', error);
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = userSchema.parse(req.body);

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

    // Update user in our database
    const user = await prisma.user.update({
      where: { id },
      data: {
        username: data.username,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
      },
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

    logger.info('Updated user:', { userId: user.id });
    res.json(user);
  } catch (error) {
    logger.error('Error updating user:', error);
    next(error);
  }
};

export const deactivateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Deactivate user in Supabase
    const { error: authError } = await supabase.auth.admin.updateUserById(
      id,
      { ban_duration: '999999h' }
    );

    if (authError) {
      throw new AppError(400, authError.message);
    }

    // Update user status in our database
    const user = await prisma.user.update({
      where: { id },
      data: {
        status: 'INACTIVE',
      },
    });

    logger.info('Deactivated user:', { userId: user.id });
    res.json(user);
  } catch (error) {
    logger.error('Error deactivating user:', error);
    next(error);
  }
};

export const getUserStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

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

    const stats = {
      totalSales: salesStats._count,
      totalProfit: salesStats._sum.profit || 0,
      itemsSold: salesStats._sum.quantity || 0,
      totalExpenses: expenseStats._sum.amount || 0,
      expenseCount: expenseStats._count,
    };

    res.json(stats);
  } catch (error) {
    logger.error('Error fetching user stats:', error);
    next(error);
  }
};