import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { generateToken, Role } from '../middleware/auth';
import { logger } from '../utils/logger';
import { cacheSet } from '../utils/cache';

export const authRouter = Router();

// Demo users (in production, use database)
const DEMO_USERS: Record<string, { password: string; role: Role; name: string }> = {
  'partner@demo.com': { password: 'partner123', role: 'partner', name: 'ภาคีเครือข่าย' },
  'academic@demo.com': { password: 'academic123', role: 'academic', name: 'นักวิชาการ' },
  'approver@demo.com': { password: 'approver123', role: 'approver', name: 'ผู้อนุมัติ' },
  'contract@demo.com': { password: 'contract123', role: 'contract_center', name: 'ศูนย์สัญญา' },
  'legal@demo.com': { password: 'legal123', role: 'legal', name: 'กฎหมาย' },
};

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// POST /api/auth/login
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);

    const user = DEMO_USERS[email];
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({
      userId: email,
      email,
      role: user.role,
    });

    // Cache session (TTL 30 minutes)
    await cacheSet(`session:${email}`, { loggedIn: true }, 1800);

    logger.info(`User ${email} logged in as ${user.role}`);

    res.json({
      token,
      user: {
        email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: err.errors });
    }
    throw err;
  }
});

// POST /api/auth/logout
authRouter.post('/logout', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    // In production, add token to blacklist
    logger.info('User logged out');
  }

  res.json({ message: 'Logged out successfully' });
});

// GET /api/auth/me
authRouter.get('/me', async (_req: Request, res: Response) => {
  // Return current user info (simplified for demo)
  res.json({ authenticated: true });
});

// GET /api/auth/roles
authRouter.get('/roles', (req: Request, res: Response) => {
  res.json({
    roles: [
      { id: 'partner', name: 'ภาคีเครือข่าย', description: 'ผู้ยื่นข้อเสนอโครงการ' },
      { id: 'academic', name: 'นักวิชาการ', description: 'ผู้คัดกรองและกลั่นกรอง' },
      { id: 'approver', name: 'ผู้อนุมัติ', description: 'ผู้พิจารณาอนุมัติโครงการ' },
      { id: 'contract_center', name: 'ศูนย์สัญญา', description: 'ผู้ดูแลสัญญา' },
      { id: 'legal', name: 'กฎหมาย', description: 'ผู้ตรวจสอบด้านกฎหมาย' },
    ],
  });
});
