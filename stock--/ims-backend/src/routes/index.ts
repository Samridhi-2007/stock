// src/routes/index.ts
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import authRoutes from './auth.routes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(StatusCodes.OK).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API routes
router.use('/auth', authRoutes);

export default router;