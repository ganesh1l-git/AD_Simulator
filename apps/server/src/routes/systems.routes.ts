import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth';

export const systemsRouter = Router();

// GET /systems — List all systems (public, filterable, paginated)
systemsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const {
      category, country, search, isIndian,
      page = '1', pageSize = '20',
      sortBy = 'name', sortOrder = 'asc',
    } = req.query;

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (country) where.countryOfOrigin = { contains: country as string, mode: 'insensitive' };
    if (isIndian !== undefined) where.isIndian = isIndian === 'true';
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { radarType: { contains: search as string, mode: 'insensitive' } },
        { missileType: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const skip = (parseInt(page as string) - 1) * parseInt(pageSize as string);
    const take = parseInt(pageSize as string);

    const [systems, total] = await Promise.all([
      prisma.airDefenceSystem.findMany({
        where: where as any,
        skip,
        take,
        orderBy: { [sortBy as string]: sortOrder },
      }),
      prisma.airDefenceSystem.count({ where: where as any }),
    ]);

    res.json({
      success: true,
      data: systems,
      total,
      page: parseInt(page as string),
      pageSize: take,
      totalPages: Math.ceil(total / take),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch systems' });
  }
});

// GET /systems/categories — Get category counts
systemsRouter.get('/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.airDefenceSystem.groupBy({
      by: ['category'],
      _count: { category: true },
    });

    res.json({
      success: true,
      data: categories.map(c => ({
        category: c.category,
        count: c._count.category,
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
});

// GET /systems/compare — Compare multiple systems
systemsRouter.get('/compare', async (req: Request, res: Response) => {
  try {
    const ids = (req.query.ids as string)?.split(',') || [];
    if (ids.length < 2 || ids.length > 4) {
      res.status(400).json({ success: false, error: 'Provide 2-4 system IDs' });
      return;
    }

    const systems = await prisma.airDefenceSystem.findMany({
      where: { id: { in: ids } },
    });

    res.json({ success: true, data: systems });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Comparison failed' });
  }
});

// GET /systems/:id — Get system details
systemsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const system = await prisma.airDefenceSystem.findUnique({
      where: { id: req.params.id as string },
    });

    if (!system) {
      res.status(404).json({ success: false, error: 'System not found' });
      return;
    }

    res.json({ success: true, data: system });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch system' });
  }
});

// POST /systems — Create system (admin only)
systemsRouter.post('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const system = await prisma.airDefenceSystem.create({ data: req.body });
    res.status(201).json({ success: true, data: system });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create system' });
  }
});

// PUT /systems/:id — Update system (admin only)
systemsRouter.put('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const system = await prisma.airDefenceSystem.update({
      where: { id: req.params.id as string },
      data: req.body,
    });
    res.json({ success: true, data: system });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update system' });
  }
});

// DELETE /systems/:id — Delete system (admin only)
systemsRouter.delete('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.airDefenceSystem.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'System deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete system' });
  }
});
