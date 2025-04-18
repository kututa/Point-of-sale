import rateLimit from 'express-rate-limit';
import { AppError } from './errorHandler';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  handler: (req, res, next) => {
    next(new AppError(429, 'Too many requests, please try again later.'));
  },
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 failed login attempts per hour
  skipSuccessfulRequests: true,
  handler: (req, res, next) => {
    next(new AppError(429, 'Too many login attempts, please try again later.'));
  },
});