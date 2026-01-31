import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate, requirePermission } from '../middleware/auth';
import { logger } from '../utils/logger';
import { cacheGet, cacheSet, cacheDel } from '../utils/cache';

export const proposalsRouter = Router();

// Schema
const ProposalSchema = z.object({
  projectName: z.string().min(5),
  description: z.string().min(20),
  budget: z.number().positive(),
  duration: z.number().min(1).max(36), // months
  objectives: z.array(z.string()).min(1),
  targetGroup: z.string(),
});

// In-memory storage for demo (use database in production)
let proposals: any[] = [];
let nextId = 1;

// GET /api/proposals - List all proposals
proposalsRouter.get('/', authenticate, async (req: Request, res: Response) => {
  const cacheKey = `proposals:list:${req.user?.role}`;

  // Try cache first (TTL 1 minute for API)
  const cached = await cacheGet(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  // Filter by role
  let filtered = proposals;
  if (req.user?.role === 'partner') {
    filtered = proposals.filter(p => p.createdBy === req.user?.email);
  }

  const result = { proposals: filtered, total: filtered.length };
  await cacheSet(cacheKey, result, 60);

  res.json(result);
});

// GET /api/proposals/:id - Get single proposal
proposalsRouter.get('/:id', authenticate, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const proposal = proposals.find(p => p.id === id);

  if (!proposal) {
    return res.status(404).json({ error: 'Proposal not found' });
  }

  res.json(proposal);
});

// POST /api/proposals - Create proposal
proposalsRouter.post('/',
  authenticate,
  requirePermission('proposal:create'),
  async (req: Request, res: Response) => {
    try {
      const data = ProposalSchema.parse(req.body);

      const proposal = {
        id: nextId++,
        ...data,
        status: 'draft',
        createdBy: req.user?.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      proposals.push(proposal);

      // Invalidate cache
      await cacheDel('proposals:list:*');

      logger.info(`Proposal ${proposal.id} created by ${req.user?.email}`);

      res.status(201).json(proposal);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid input', details: err.errors });
      }
      throw err;
    }
  }
);

// PUT /api/proposals/:id - Update proposal
proposalsRouter.put('/:id',
  authenticate,
  requirePermission('proposal:edit'),
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = proposals.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    const proposal = proposals[index];

    // Only owner can edit
    if (proposal.createdBy !== req.user?.email && req.user?.role !== 'approver') {
      return res.status(403).json({ error: 'Not authorized to edit this proposal' });
    }

    try {
      const data = ProposalSchema.partial().parse(req.body);

      proposals[index] = {
        ...proposal,
        ...data,
        updatedAt: new Date().toISOString(),
      };

      await cacheDel('proposals:list:*');

      logger.info(`Proposal ${id} updated by ${req.user?.email}`);

      res.json(proposals[index]);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid input', details: err.errors });
      }
      throw err;
    }
  }
);

// POST /api/proposals/:id/submit - Submit proposal for review
proposalsRouter.post('/:id/submit',
  authenticate,
  requirePermission('proposal:submit'),
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = proposals.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    const proposal = proposals[index];

    if (proposal.status !== 'draft') {
      return res.status(400).json({ error: 'Only draft proposals can be submitted' });
    }

    proposals[index] = {
      ...proposal,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await cacheDel('proposals:list:*');

    logger.info(`Proposal ${id} submitted by ${req.user?.email}`);

    res.json(proposals[index]);
  }
);
