// src/routes/auth.routes.ts
import { Router } from 'express';
import { register, login, getCurrentUser } from '../controllers/auth.controller';
import { auth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { loginSchema, registerSchema } from '../validators/auth.validator';

const router = Router();

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

// Protected routes
router.get('/me', auth, getCurrentUser);

export default router;