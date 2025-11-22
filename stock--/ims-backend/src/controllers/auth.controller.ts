// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/constants';
import prisma from '../config/database';
import { sendResponse, sendError } from '../utils/apiResponse';

const SALT_ROUNDS = 10;

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return sendError(res, 400, 'Email already in use');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    sendResponse(res, 201, 'User registered successfully', {
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    sendError(res, 500, 'Error during registration');
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return sendError(res, 401, 'Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendError(res, 401, 'Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    sendResponse(res, 200, 'Login successful', {
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    sendError(res, 500, 'Error during login');
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - req.user is added by the auth middleware
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    sendResponse(res, 200, 'Current user retrieved successfully', { user });
  } catch (error) {
    console.error('Get current user error:', error);
    sendError(res, 500, 'Error retrieving current user');
  }
};