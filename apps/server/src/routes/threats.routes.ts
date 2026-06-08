import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth';

export const threatsRouter = Router();

// GET /threats — List all threats (public, filterable, paginated)
threatsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const {
      type, speedClass, altitudeClass, radarVisibility, search,
      page = '1', pageSize = '20',
      sortBy = 'threatScore', sortOrder = 'desc',
    } = req.query;

    const where: Record<string, unknown> = {};
    if (type) where.type = type;
    if (speedClass) where.speedClass = speedClass;
    if (altitudeClass) where.altitudeClass = altitudeClass;
    if (radarVisibility) where.radarVisibility = radarVisibility;
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const skip = (parseInt(page as string) - 1) * parseInt(pageSize as string);
    const take = parseInt(pageSize as string);

    const [threats, total] = await Promise.all([
      prisma.threat.findMany({
        where: where as any,
        skip,
        take,
        orderBy: { [sortBy as string]: sortOrder },
      }),
      prisma.threat.count({ where: where as any }),
    ]);

    res.json({
      success: true,
      data: threats,
      total,
      page: parseInt(page as string),
      pageSize: take,
      totalPages: Math.ceil(total / take),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch threats' });
  }
});

// GET /threats/:id
threatsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const threat = await prisma.threat.findUnique({ where: { id: req.params.id as string } });
    if (!threat) {
      res.status(404).json({ success: false, error: 'Threat not found' });
      return;
    }
    res.json({ success: true, data: threat });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch threat' });
  }
});

// POST /threats (admin)
threatsRouter.post('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const threat = await prisma.threat.create({ data: req.body });
    res.status(201).json({ success: true, data: threat });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create threat' });
  }
});

// PUT /threats/:id (admin)
threatsRouter.put('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const threat = await prisma.threat.update({ where: { id: req.params.id as string }, data: req.body });
    res.json({ success: true, data: threat });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update threat' });
  }
});

// DELETE /threats/:id (admin)
threatsRouter.delete('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.threat.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Threat deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete threat' });
  }
});
