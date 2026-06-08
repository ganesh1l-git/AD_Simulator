import { Router, Response } from 'express';
import { prisma } from '../config/database';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth';

export const adminRouter = Router();

// All admin routes require auth + admin role
adminRouter.use(authMiddleware);
adminRouter.use(adminMiddleware);

// GET /admin/users
adminRouter.get('/users', async (_req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, email: true, name: true, role: true,
        simulationsRun: true, multiplayerWins: true, multiplayerLosses: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
});

// PUT /admin/users/:id
adminRouter.put('/users/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id as string },
      data: { role },
      select: { id: true, email: true, name: true, role: true },
    });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update user' });
  }
});

// GET /admin/stats
adminRouter.get('/stats', async (_req: AuthRequest, res: Response) => {
  try {
    const [users, systems, threats, simulations, campaigns, rooms] = await Promise.all([
      prisma.user.count(),
      prisma.airDefenceSystem.count(),
      prisma.threat.count(),
      prisma.simulation.count(),
      prisma.campaign.count(),
      prisma.room.count({ where: { status: 'WAITING' } }),
    ]);

    res.json({
      success: true,
      data: { users, systems, threats, simulations, campaigns, activeRooms: rooms },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
});
