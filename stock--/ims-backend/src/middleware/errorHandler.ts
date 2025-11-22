import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Prisma } from '@prisma/client';
import logger from '../utils/logger';

interface ErrorResponse {
  success: boolean;
  message: string;
  error?: any;
  stack?: string;
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const response: ErrorResponse = {
    success: false,
    message: err.message || 'Internal Server Error',
  };

  if (process.env.NODE_ENV === 'development') {
    response.error = err;
    response.stack = err.stack;
  }

  // Handle known error types
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle specific Prisma errors
    switch (err.code) {
      case 'P2002':
        response.message = `Duplicate field value: ${err.meta?.target || 'unknown'}`;
        return res.status(StatusCodes.CONFLICT).json(response);
      case 'P2025':
        response.message = 'Record not found';
        return res.status(StatusCodes.NOT_FOUND).json(response);
      default:
        response.message = 'Database error occurred';
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    response.message = 'Validation error occurred';
    return res.status(StatusCodes.BAD_REQUEST).json(response);
  } else if (err.name === 'JsonWebTokenError') {
    response.message = 'Invalid token';
    return res.status(StatusCodes.UNAUTHORIZED).json(response);
  } else if (err.name === 'TokenExpiredError') {
    response.message = 'Token expired';
    return res.status(StatusCodes.UNAUTHORIZED).json(response);
  }

  // Log the error
  logger.error(err);

  // Default to 500 Internal Server Error
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
};