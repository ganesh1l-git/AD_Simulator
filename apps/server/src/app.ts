import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { authRouter } from './routes/auth.routes';
import { systemsRouter } from './routes/systems.routes';
import { threatsRouter } from './routes/threats.routes';
import { simulationsRouter } from './routes/simulations.routes';
import { scenariosRouter } from './routes/scenarios.routes';
import { campaignsRouter } from './routes/campaigns.routes';
import { procurementRouter } from './routes/procurement.routes';
import { analyticsRouter } from './routes/analytics.routes';
import { adminRouter } from './routes/admin.routes';
import { errorHandler } from './middleware/errorHandler';

export const app = express();

// ---- Middleware ----
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// ---- Health Check ----
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'IADES Backend', timestamp: new Date().toISOString() });
});

// ---- API Routes ----
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/systems', systemsRouter);
app.use('/api/v1/threats', threatsRouter);
app.use('/api/v1/simulations', simulationsRouter);
app.use('/api/v1/scenarios', scenariosRouter);
app.use('/api/v1/campaigns', campaignsRouter);
app.use('/api/v1/procurement', procurementRouter);
app.use('/api/v1/analytics', analyticsRouter);
app.use('/api/v1/admin', adminRouter);

// ---- Error Handler ----
app.use(errorHandler);
