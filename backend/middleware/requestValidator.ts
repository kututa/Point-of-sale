import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from './errorHandler';

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Add validated data to request
      req.body = data.body;
      req.query = data.query;
      req.params = data.params;

      next();
    } catch (error) {
      next(new AppError(400, 'Validation failed'));
    }
  };
};