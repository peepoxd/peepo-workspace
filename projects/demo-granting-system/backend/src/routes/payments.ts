import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate, authorize, requirePermission } from '../middleware/auth';
import { logger } from '../utils/logger';
import { cacheGet, cacheSet, cacheDel } from '../utils/cache';

export const paymentsRouter = Router();

const PaymentRequestSchema = z.object({
  contractId: z.number(),
  installmentNumber: z.number(),
  amount: z.number(),
  description: z.string(),
  attachments: z.array(z.string()).optional(),
});

let payments: any[] = [];
let nextId = 1;

// GET /api/payments
paymentsRouter.get('/', authenticate, async (req: Request, res: Response) => {
  const cacheKey = `payments:list:${req.user?.role}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return res.json(cached);

  let filtered = payments;
  if (req.user?.role === 'partner') {
    filtered = payments.filter(p => p.requestedBy === req.user?.email);
  }

  const result = { payments: filtered, total: filtered.length };
  await cacheSet(cacheKey, result, 60);
  res.json(result);
});

// POST /api/payments/request - Request payment
paymentsRouter.post('/request',
  authenticate,
  requirePermission('payment:request'),
  async (req: Request, res: Response) => {
    try {
      const data = PaymentRequestSchema.parse(req.body);
      const payment = {
        id: nextId++,
        ...data,
        status: 'pending',
        requestedBy: req.user?.email,
        requestedAt: new Date().toISOString(),
      };
      payments.push(payment);
      await cacheDel('payments:list:*');
      logger.info(`Payment request ${payment.id} by ${req.user?.email}`);
      res.status(201).json(payment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid input', details: error.errors });
      }
      throw error;
    }
  }
);

// POST /api/payments/:id/approve
paymentsRouter.post('/:id/approve',
  authenticate,
  requirePermission('payment:approve'),
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = payments.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: 'Payment not found' });

    payments[index] = {
      ...payments[index],
      status: 'approved',
      approvedBy: req.user?.email,
      approvedAt: new Date().toISOString(),
    };

    await cacheDel('payments:list:*');
    logger.info(`Payment ${id} approved by ${req.user?.email}`);
    res.json(payments[index]);
  }
);
