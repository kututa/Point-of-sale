import { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose';
import { AppError } from './errorHandler';
import { UserRole } from '../../types/auth';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
      };
    }
  }
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new AppError(401, 'Authentication required');
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    req.user = {
      id: payload.sub as string,
      role: payload.role as UserRole,
    };

    next();
  } catch (error) {
    next(new AppError(401, 'Invalid or expired token'));
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, 'Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, 'Insufficient permissions'));
    }

    next();
  };
};