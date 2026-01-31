import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { cacheGet, cacheSet } from '../utils/cache';

export const dashboardRouter = Router();

// GET /api/dashboard - Dashboard KPIs
dashboardRouter.get('/', authenticate, async (req, res) => {
  const cacheKey = 'dashboard:kpi';

  // Try cache first (TTL 5 minutes for dashboard)
  const cached = await cacheGet(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  // Mock KPI data
  const kpi = {
    proposals: {
      total: 45,
      draft: 12,
      submitted: 15,
      approved: 10,
      rejected: 8,
    },
    budget: {
      total: 25000000,
      allocated: 18500000,
      disbursed: 12000000,
      remaining: 6500000,
    },
    timeline: {
      onTrack: 28,
      delayed: 7,
      completed: 10,
    },
    alerts: [
      { type: 'warning', message: '3 โครงการใกล้ครบกำหนดส่งรายงาน', count: 3 },
      { type: 'info', message: '5 ข้อเสนอรอการพิจารณา', count: 5 },
    ],
  };

  await cacheSet(cacheKey, kpi, 300); // 5 minutes

  res.json(kpi);
});
