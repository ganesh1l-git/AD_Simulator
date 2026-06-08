import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { generateToken, authMiddleware, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { z } from 'zod';

export const authRouter = Router();

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(50),
  password: z.string().min(6).max(100),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// POST /auth/register
authRouter.post('/register', validate(registerSchema), async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(400).json({ success: false, error: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, name, passwordHash },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    const token = generateToken(user.id, user.role);

    res.status(201).json({
      success: true,
      data: { user, token },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

// POST /auth/login
authRouter.post('/login', validate(loginSchema), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    const token = generateToken(user.id, user.role);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          simulationsRun: user.simulationsRun,
          interceptionRate: user.interceptionRate,
          multiplayerWins: user.multiplayerWins,
          multiplayerLosses: user.multiplayerLosses,
        },
        token,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// GET /auth/me
authRouter.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true, email: true, name: true, role: true, avatar: true,
        simulationsRun: true, interceptionRate: true, totalCostSpent: true,
        campaignsCompleted: true, multiplayerWins: true, multiplayerLosses: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
});
