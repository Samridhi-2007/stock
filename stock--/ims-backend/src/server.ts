// src/server.ts
import app from './app';
import { PORT } from './config/constants';
import logger from './utils/logger';
import prisma from './config/database';

const server = app.listen(PORT, async () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  try {
    await prisma.$connect();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Database connection error:', error);
    process.exit(1);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    prisma.$disconnect().then(() => {
      logger.info('Prisma Client disconnected');
      process.exit(0);
    });
  });
});