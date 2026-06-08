import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';

export const scenariosRouter = Router();

// GET /scenarios — List scenarios (public + own)
scenariosRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { search, page = '1', pageSize = '20' } = req.query;
    const where: Record<string, unknown> = { isPublic: true };
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const skip = (parseInt(page as string) - 1) * parseInt(pageSize as string);
    const take = parseInt(pageSize as string);

    const [scenarios, total] = await Promise.all([
      prisma.scenario.findMany({
        where: where as any,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } } },
      }),
      prisma.scenario.count({ where: where as any }),
    ]);

    res.json({ success: true, data: scenarios, total, page: parseInt(page as string), pageSize: take, totalPages: Math.ceil(total / take) });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch scenarios' });
  }
});

// GET /scenarios/:id
scenariosRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const scenario = await prisma.scenario.findUnique({
      where: { id: req.params.id as string },
      include: { user: { select: { name: true } } },
    });
    if (!scenario) {
      res.status(404).json({ success: false, error: 'Scenario not found' });
      return;
    }
    res.json({ success: true, data: scenario });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch scenario' });
  }
});

// POST /scenarios
scenariosRouter.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const scenario = await prisma.scenario.create({
      data: { ...req.body, userId: req.userId },
    });
    res.status(201).json({ success: true, data: scenario });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create scenario' });
  }
});

// PUT /scenarios/:id
scenariosRouter.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const scenario = await prisma.scenario.findUnique({ where: { id: req.params.id as string } });
    if (!scenario || scenario.userId !== req.userId) {
      res.status(403).json({ success: false, error: 'Not authorized' });
      return;
    }
    const updated = await prisma.scenario.update({ where: { id: req.params.id as string }, data: req.body });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update scenario' });
  }
});

// DELETE /scenarios/:id
scenariosRouter.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const scenario = await prisma.scenario.findUnique({ where: { id: req.params.id as string } });
    if (!scenario || scenario.userId !== req.userId) {
      res.status(403).json({ success: false, error: 'Not authorized' });
      return;
    }
    await prisma.scenario.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Scenario deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete scenario' });
  }
});

// POST /scenarios/import
scenariosRouter.post('/import', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { scenarioData } = req.body;
    const scenario = await prisma.scenario.create({
      data: { ...scenarioData, userId: req.userId, isPublic: false },
    });
    res.status(201).json({ success: true, data: scenario });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Import failed' });
  }
});

// GET /scenarios/:id/export
scenariosRouter.get('/:id/export', async (req: Request, res: Response) => {
  try {
    const scenario = await prisma.scenario.findUnique({ where: { id: req.params.id as string } });
    if (!scenario) {
      res.status(404).json({ success: false, error: 'Scenario not found' });
      return;
    }
    res.json({
      success: true,
      data: {
        name: scenario.name,
        description: scenario.description,
        mapConfig: scenario.mapConfig,
        defenderSetup: scenario.defenderSetup,
        attackerSetup: scenario.attackerSetup,
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Export failed' });
  }
});
