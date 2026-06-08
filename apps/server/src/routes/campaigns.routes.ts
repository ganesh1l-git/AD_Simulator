import { Router, Response } from 'express';
import { prisma } from '../config/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';

export const campaignsRouter = Router();

// POST /campaigns — Start a new campaign
campaignsRouter.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, difficulty = 'MEDIUM', totalDays = 10, budget = 1000 } = req.body;
    const campaign = await prisma.campaign.create({
      data: {
        name, userId: req.userId!, difficulty, totalDays,
        budget, remainingBudget: budget,
        ownedSystems: [],
      },
    });
    // Create first day
    await prisma.campaignDay.create({
      data: {
        campaignId: campaign.id,
        day: 1,
        budget: budget * 0.1,
        threats: [],
        systemDamage: {},
        ammoUsed: {},
      },
    });
    res.status(201).json({ success: true, data: campaign });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create campaign' });
  }
});

// GET /campaigns
campaignsRouter.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const campaigns = await prisma.campaign.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      include: { days: { orderBy: { day: 'asc' } } },
    });
    res.json({ success: true, data: campaigns });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch campaigns' });
  }
});

// GET /campaigns/:id
campaignsRouter.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: req.params.id as string },
      include: { days: { orderBy: { day: 'asc' } } },
    });
    if (!campaign) {
      res.status(404).json({ success: false, error: 'Campaign not found' });
      return;
    }
    res.json({ success: true, data: campaign });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch campaign' });
  }
});

// POST /campaigns/:id/advance — Advance to next day
campaignsRouter.post('/:id/advance', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const campaign = await prisma.campaign.findUnique({ where: { id: req.params.id as string } });
    if (!campaign || campaign.userId !== req.userId) {
      res.status(403).json({ success: false, error: 'Not authorized' });
      return;
    }
    if (campaign.currentDay >= campaign.totalDays) {
      res.status(400).json({ success: false, error: 'Campaign completed' });
      return;
    }

    const nextDay = campaign.currentDay + 1;
    const dailyBudget = campaign.remainingBudget * 0.1;

    await prisma.campaignDay.create({
      data: {
        campaignId: campaign.id,
        day: nextDay,
        budget: dailyBudget,
        threats: [],
        systemDamage: {},
        ammoUsed: {},
      },
    });

    const updated = await prisma.campaign.update({
      where: { id: campaign.id },
      data: {
        currentDay: nextDay,
        status: nextDay >= campaign.totalDays ? 'WON' : 'ACTIVE',
      },
      include: { days: { orderBy: { day: 'asc' } } },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to advance campaign' });
  }
});
