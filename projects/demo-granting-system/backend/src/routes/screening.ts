import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate, authorize, requirePermission } from '../middleware/auth';
import { logger } from '../utils/logger';
import { cacheGet, cacheSet, cacheDel } from '../utils/cache';

export const screeningRouter = Router();

const ScreeningSchema = z.object({
  proposalId: z.number(),
  eligibilityCheck: z.boolean(),
  documentComplete: z.boolean(),
  budgetReasonable: z.boolean(),
  comments: z.string().optional(),
  recommendation: z.enum(['pass', 'revise', 'reject']),
});

// In-memory storage for demo
let screenings: any[] = [];
let nextId = 1;

// GET /api/screening - List screenings
screeningRouter.get('/', authenticate, authorize('academic', 'approver'), async (req: Request, res: Response) => {
  const cacheKey = 'screening:list';
  const cached = await cacheGet(cacheKey);
  if (cached) return res.json(cached);

  const result = { screenings, total: screenings.length };
  await cacheSet(cacheKey, result, 60);
  res.json(result);
});

// GET /api/screening/:id
screeningRouter.get('/:id', authenticate, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const screening = screenings.find(s => s.id === id);
  if (!screening) return res.status(404).json({ error: 'Screening not found' });
  res.json(screening);
});

// POST /api/screening - Create screening
screeningRouter.post('/',
  authenticate,
  requirePermission('screening:create'),
  async (req: Request, res: Response) => {
    try {
      const data = ScreeningSchema.parse(req.body);
      const screening = {
        id: nextId++,
        ...data,
        screenedBy: req.user?.email,
        screenedAt: new Date().toISOString(),
        status: data.recommendation === 'pass' ? 'approved' : data.recommendation,
      };
      screenings.push(screening);
      await cacheDel('screening:list');
      logger.info(`Screening ${screening.id} created by ${req.user?.email}`);
      res.status(201).json(screening);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid input', details: error.errors });
      }
      throw error;
    }
  }
);
