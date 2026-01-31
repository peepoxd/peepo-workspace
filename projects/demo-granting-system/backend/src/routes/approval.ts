import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate, authorize, requirePermission } from '../middleware/auth';
import { logger } from '../utils/logger';
import { cacheGet, cacheSet, cacheDel } from '../utils/cache';

export const approvalRouter = Router();

const ApprovalSchema = z.object({
  proposalId: z.number(),
  decision: z.enum(['approved', 'conditionally_approved', 'rejected']),
  conditions: z.array(z.string()).optional(),
  budgetApproved: z.number().optional(),
  comments: z.string().optional(),
});

let approvals: any[] = [];
let nextId = 1;

// GET /api/approval - List approvals
approvalRouter.get('/', authenticate, authorize('approver', 'partner'), async (req: Request, res: Response) => {
  const cacheKey = `approval:list:${req.user?.role}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return res.json(cached);

  let filtered = approvals;
  if (req.user?.role === 'partner') {
    filtered = approvals.filter(a => a.partnerEmail === req.user?.email);
  }

  const result = { approvals: filtered, total: filtered.length };
  await cacheSet(cacheKey, result, 60);
  res.json(result);
});

// POST /api/approval - Create approval decision
approvalRouter.post('/',
  authenticate,
  requirePermission('approval:create'),
  async (req: Request, res: Response) => {
    try {
      const data = ApprovalSchema.parse(req.body);
      const approval = {
        id: nextId++,
        ...data,
        approvedBy: req.user?.email,
        approvedAt: new Date().toISOString(),
      };
      approvals.push(approval);
      await cacheDel('approval:list:*');
      logger.info(`Approval ${approval.id} - ${data.decision} by ${req.user?.email}`);
      res.status(201).json(approval);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid input', details: error.errors });
      }
      throw error;
    }
  }
);
