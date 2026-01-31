import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate, authorize, requirePermission } from '../middleware/auth';
import { logger } from '../utils/logger';
import { cacheGet, cacheSet, cacheDel } from '../utils/cache';

export const contractsRouter = Router();

const ContractSchema = z.object({
  proposalId: z.number(),
  contractNumber: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  totalBudget: z.number(),
  installments: z.array(z.object({
    number: z.number(),
    amount: z.number(),
    dueDate: z.string(),
  })),
});

let contracts: any[] = [];
let nextId = 1;

// GET /api/contracts
contractsRouter.get('/', authenticate, async (req: Request, res: Response) => {
  const cacheKey = `contracts:list:${req.user?.role}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return res.json(cached);

  let filtered = contracts;
  if (req.user?.role === 'partner') {
    filtered = contracts.filter(c => c.partnerEmail === req.user?.email);
  }

  const result = { contracts: filtered, total: filtered.length };
  await cacheSet(cacheKey, result, 60);
  res.json(result);
});

// GET /api/contracts/:id
contractsRouter.get('/:id', authenticate, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const contract = contracts.find(c => c.id === id);
  if (!contract) return res.status(404).json({ error: 'Contract not found' });
  res.json(contract);
});

// POST /api/contracts - Create contract
contractsRouter.post('/',
  authenticate,
  requirePermission('contract:create'),
  async (req: Request, res: Response) => {
    try {
      const data = ContractSchema.parse(req.body);
      const contract = {
        id: nextId++,
        ...data,
        status: 'draft',
        createdBy: req.user?.email,
        createdAt: new Date().toISOString(),
        signatures: [],
      };
      contracts.push(contract);
      await cacheDel('contracts:list:*');
      logger.info(`Contract ${contract.id} created by ${req.user?.email}`);
      res.status(201).json(contract);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid input', details: error.errors });
      }
      throw error;
    }
  }
);

// POST /api/contracts/:id/sign - Sign contract
contractsRouter.post('/:id/sign',
  authenticate,
  requirePermission('contract:sign'),
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = contracts.findIndex(c => c.id === id);
    if (index === -1) return res.status(404).json({ error: 'Contract not found' });

    contracts[index].signatures.push({
      signedBy: req.user?.email,
      signedAt: new Date().toISOString(),
      role: req.user?.role,
    });

    if (contracts[index].signatures.length >= 2) {
      contracts[index].status = 'signed';
    }

    await cacheDel('contracts:list:*');
    logger.info(`Contract ${id} signed by ${req.user?.email}`);
    res.json(contracts[index]);
  }
);
