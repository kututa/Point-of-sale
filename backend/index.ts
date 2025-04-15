import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import { errorHandler } from '../';
import { authRouter } from '../frontend/src/server/routes/auth';
import { inventoryRouter } from '../frontend/src/server/routes/inventory';
import { salesRouter } from './routes/sales'; // Adjust the path as neededimport { expensesRouter } from '../frontend/src/server/routes/expenses';
import { usersRouter } from '../frontend/src/server/routes/users';
import { reportsRouter } from '../frontend/src/server/routes/reports';
import logger from '../frontend/src/server/config/logger';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables
dotenv.config();

// Initialize Prisma
export const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/sales', salesRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/users', usersRouter);
app.use('/api/reports', reportsRouter);

// Error handling
app.use(errorHandler);

// Connect to Prisma before starting the server
prisma.$connect()
  .then(() => {
    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    logger.error('Failed to connect to database:', error);
    process.exit(1);
  });

export default app;