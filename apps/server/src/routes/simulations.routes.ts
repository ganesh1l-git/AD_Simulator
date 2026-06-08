import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { runSimulation } from '../services/simulation/engine';

export const simulationsRouter = Router();

// POST /simulations — Create and optionally run a simulation
simulationsRouter.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, scenarioId, config, autoRun = false } = req.body;

    const scenario = await prisma.scenario.findUnique({ where: { id: scenarioId } });
    if (!scenario) {
      res.status(404).json({ success: false, error: 'Scenario not found' });
      return;
    }

    const simulation = await prisma.simulation.create({
      data: {
        name: name || `Simulation ${Date.now()}`,
        userId: req.userId!,
        scenarioId,
        config: config || {},
        status: 'PENDING',
      },
    });

    if (autoRun) {
      // Run simulation asynchronously
      runSimulation(simulation.id).catch(console.error);
    }

    res.status(201).json({ success: true, data: simulation });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create simulation' });
  }
});

// POST /simulations/client-save — Save results of a simulation completed on the client
simulationsRouter.post('/client-save', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, config, results, duration } = req.body;

    // Find or create a default scenario for client sandbox simulations
    let scenario = await prisma.scenario.findFirst({
      where: { userId: req.userId }
    });
    
    if (!scenario) {
      // Find any scenario in the database (e.g. the seeded one)
      scenario = await prisma.scenario.findFirst();
    }
    
    if (!scenario) {
      res.status(404).json({ success: false, error: 'No scenario found. Please run seed script first.' });
      return;
    }

    const simulation = await prisma.simulation.create({
      data: {
        name: name || `Sandbox Sim ${Date.now()}`,
        userId: req.userId!,
        scenarioId: scenario.id,
        config: config || {},
        status: 'COMPLETED',
        results: results || {},
        duration: duration || 0,
        completedAt: new Date(),
      },
    });

    // Save analytics record for the simulation
    await prisma.analyticsRecord.create({
      data: {
        simulationId: simulation.id,
        interceptionRate: results.interceptionRate || 0,
        detectionRate: results.detectionRate || 0,
        costEfficiency: results.costPerSuccessfulInterception || 0,
        radarEffectiveness: results.detectionRate * 0.9 || 0,
        threatPenetrationRate: results.totalThreats > 0 ? (results.threatsImpacted / results.totalThreats) : 0,
        systemUtilization: 0.8, // estimated
      }
    });

    // Update user stats
    await prisma.user.update({
      where: { id: req.userId },
      data: {
        simulationsRun: { increment: 1 },
        interceptionRate: results.interceptionRate || 0,
        totalCostSpent: { increment: results.totalCost || 0 },
      },
    });

    res.status(201).json({ success: true, data: simulation });
  } catch (err) {
    console.error('Failed to save client simulation:', err);
    res.status(500).json({ success: false, error: 'Failed to save client simulation' });
  }
});

// GET /simulations — List user's simulations
simulationsRouter.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = '1', pageSize = '10', status } = req.query;
    const where: Record<string, unknown> = { userId: req.userId };
    if (status) where.status = status;

    const skip = (parseInt(page as string) - 1) * parseInt(pageSize as string);
    const take = parseInt(pageSize as string);

    const [simulations, total] = await Promise.all([
      prisma.simulation.findMany({
        where: where as any,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { scenario: { select: { name: true } } },
      }),
      prisma.simulation.count({ where: where as any }),
    ]);

    res.json({
      success: true,
      data: simulations,
      total,
      page: parseInt(page as string),
      pageSize: take,
      totalPages: Math.ceil(total / take),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch simulations' });
  }
});

// GET /simulations/:id
simulationsRouter.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const simulation = await prisma.simulation.findUnique({
      where: { id: req.params.id as string },
      include: {
        scenario: true,
        events: { orderBy: { timestamp: 'asc' } },
      },
    });

    if (!simulation) {
      res.status(404).json({ success: false, error: 'Simulation not found' });
      return;
    }

    res.json({ success: true, data: simulation });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch simulation' });
  }
});

// GET /simulations/:id/replay
simulationsRouter.get('/:id/replay', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const replay = await prisma.replayData.findUnique({
      where: { simulationId: req.params.id as string },
    });

    if (!replay) {
      res.status(404).json({ success: false, error: 'Replay data not found' });
      return;
    }

    res.json({ success: true, data: replay });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch replay' });
  }
});

// GET /simulations/:id/report
simulationsRouter.get('/:id/report', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const simulation = await prisma.simulation.findUnique({
      where: { id: req.params.id as string },
      include: {
        scenario: true,
        analytics: true,
        events: { orderBy: { timestamp: 'asc' } },
      },
    });

    if (!simulation) {
      res.status(404).json({ success: false, error: 'Simulation not found' });
      return;
    }

    res.json({
      success: true,
      data: {
        simulation,
        results: simulation.results,
        analytics: simulation.analytics,
        eventCount: simulation.events.length,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to generate report' });
  }
});

// DELETE /simulations/:id
simulationsRouter.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.simulation.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Simulation deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete simulation' });
  }
});
