import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

// RBAC: 5 Roles from e-Granting spec
export type Role = 'partner' | 'academic' | 'approver' | 'contract_center' | 'legal';

export interface JWTPayload {
  userId: string;
  email: string;
  role: Role;
  permissions: string[];
}

// Permission Matrix from e-Granting spec
const ROLE_PERMISSIONS: Record<Role, string[]> = {
  partner: ['proposal:create', 'proposal:edit', 'proposal:submit', 'contract:view', 'payment:request'],
  academic: ['proposal:view', 'screening:create', 'screening:edit', 'payment:view'],
  approver: ['approval:create', 'approval:edit', 'contract:approve', 'payment:approve'],
  contract_center: ['contract:create', 'contract:edit', 'contract:sign'],
  legal: ['payment:review', 'contract:review'],
};

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.substring(7);
  const secret = process.env.JWT_SECRET || 'demo-secret';

  try {
    const decoded = jwt.verify(token, secret) as JWTPayload;
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn('Invalid token attempt');
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(`Access denied for role ${req.user.role}`);
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  };
};

export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const userPermissions = ROLE_PERMISSIONS[req.user.role];

    if (!userPermissions.includes(permission)) {
      logger.warn(`Permission ${permission} denied for role ${req.user.role}`);
      return res.status(403).json({ error: 'Permission denied' });
    }

    next();
  };
};

export const generateToken = (payload: Omit<JWTPayload, 'permissions'>): string => {
  const secret = process.env.JWT_SECRET || 'demo-secret';
  const permissions = ROLE_PERMISSIONS[payload.role];

  return jwt.sign(
    { ...payload, permissions },
    secret,
    { expiresIn: '8h' }
  );
};
