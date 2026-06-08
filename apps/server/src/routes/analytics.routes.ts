import { Router, Response } from 'express';
import { prisma } from '../config/database';

export const analyticsRouter = Router();

// GET /analytics/overview — Dashboard stats
analyticsRouter.get('/overview', async (_req, res: Response) => {
  try {
    const [totalUsers, totalSystems, totalThreats, totalSimulations, activeSimulations] = await Promise.all([
      prisma.user.count(),
      prisma.airDefenceSystem.count(),
      prisma.threat.count(),
      prisma.simulation.count(),
      prisma.simulation.count({ where: { status: 'RUNNING' } }),
    ]);

    // Calculate aggregate stats from analytics records
    const analyticsAgg = await prisma.analyticsRecord.aggregate({
      _avg: { interceptionRate: true, costEfficiency: true },
      _count: true,
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalSystems,
        totalThreats,
        totalSimulations,
        activeSimulations,
        avgInterceptionRate: analyticsAgg._avg.interceptionRate || 0,
        avgCostEfficiency: analyticsAgg._avg.costEfficiency || 0,
        totalAnalyticsRecords: analyticsAgg._count,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch overview' });
  }
});

// GET /analytics/simulations
analyticsRouter.get('/simulations', async (_req, res: Response) => {
  try {
    const records = await prisma.analyticsRecord.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { simulation: { select: { name: true, createdAt: true } } },
    });

    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch simulation analytics' });
  }
});

// GET /analytics/costs
analyticsRouter.get('/costs', async (_req, res: Response) => {
  try {
    const records = await prisma.analyticsRecord.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: { costEfficiency: true, createdAt: true, simulation: { select: { name: true } } },
    });

    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch cost analytics' });
  }
});

// GET /analytics/systems
analyticsRouter.get('/systems', async (_req, res: Response) => {
  try {
    const systems = await prisma.airDefenceSystem.findMany({
      select: {
        id: true, name: true, category: true, accuracy: true, cost: true,
        maxRange: true, _count: { select: { procurements: true } },
      },
      orderBy: { name: 'asc' },
    });

    res.json({ success: true, data: systems });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch system analytics' });
  }
});
