import { Router, Response } from 'express';
import { prisma } from '../config/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';

export const procurementRouter = Router();

// GET /procurement/catalog
procurementRouter.get('/catalog', async (_req, res: Response) => {
  try {
    const systems = await prisma.airDefenceSystem.findMany({
      orderBy: { category: 'asc' },
      select: {
        id: true, name: true, category: true, cost: true,
        operatingCostPerHour: true, maxRange: true, accuracy: true,
        countryOfOrigin: true, isIndian: true,
      },
    });
    res.json({ success: true, data: systems });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch catalog' });
  }
});

// POST /procurement/purchase
procurementRouter.post('/purchase', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { systemId } = req.body;
    const system = await prisma.airDefenceSystem.findUnique({ where: { id: systemId } });
    if (!system) {
      res.status(404).json({ success: false, error: 'System not found' });
      return;
    }

    const procurement = await prisma.procurement.create({
      data: {
        userId: req.userId!,
        systemId,
        purchaseCost: system.cost,
        maintenanceCost: system.operatingCostPerHour * 8760, // yearly
      },
      include: { system: true },
    });

    res.status(201).json({ success: true, data: procurement });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Purchase failed' });
  }
});

// POST /procurement/upgrade
procurementRouter.post('/upgrade', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { procurementId } = req.body;
    const procurement = await prisma.procurement.findUnique({ where: { id: procurementId } });
    if (!procurement || procurement.userId !== req.userId) {
      res.status(403).json({ success: false, error: 'Not authorized' });
      return;
    }
    if (procurement.level >= 5) {
      res.status(400).json({ success: false, error: 'Max level reached' });
      return;
    }

    const upgradeCost = procurement.purchaseCost * 0.2 * procurement.level;
    const updated = await prisma.procurement.update({
      where: { id: procurementId },
      data: {
        level: procurement.level + 1,
        purchaseCost: procurement.purchaseCost + upgradeCost,
        status: 'UPGRADING',
      },
    });

    res.json({ success: true, data: updated, upgradeCost });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Upgrade failed' });
  }
});

// GET /procurement/budget
procurementRouter.get('/budget', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const procurements = await prisma.procurement.findMany({
      where: { userId: req.userId },
      include: { system: { select: { name: true, category: true } } },
    });

    const totalSpent = procurements.reduce((sum, p) => sum + p.purchaseCost, 0);
    const yearlyMaintenance = procurements.reduce((sum, p) => sum + p.maintenanceCost, 0);

    res.json({
      success: true,
      data: {
        procurements,
        totalSpent,
        yearlyMaintenance,
        systemCount: procurements.length,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch budget' });
  }
});
