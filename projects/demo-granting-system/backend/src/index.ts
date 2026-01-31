import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { logger } from './utils/logger';
import { authRouter } from './routes/auth';
import { proposalsRouter } from './routes/proposals';
import { screeningRouter } from './routes/screening';
import { approvalRouter } from './routes/approval';
import { contractsRouter } from './routes/contracts';
import { paymentsRouter } from './routes/payments';
import { dashboardRouter } from './routes/dashboard';
import { reportsRouter } from './routes/reports';
import { filesRouter } from './routes/files';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimit';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(rateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/proposals', proposalsRouter);
app.use('/api/screening', screeningRouter);
app.use('/api/approval', approvalRouter);
app.use('/api/contracts', contractsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/files', filesRouter);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info('Demo Granting System - Backend Ready');
});

export default app;
