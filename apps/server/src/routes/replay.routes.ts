import { Router, Response } from 'express';
import { prisma } from '../config/database';

export const replayRouter = Router();

// GET /replay/:simulationId
replayRouter.get('/:simulationId', async (req, res: Response) => {
  try {
    const replay = await prisma.replayData.findUnique({
      where: { simulationId: req.params.simulationId },
    });
    if (!replay) {
      res.status(404).json({ success: false, error: 'Replay not found' });
      return;
    }
    res.json({ success: true, data: replay });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch replay' });
  }
});
