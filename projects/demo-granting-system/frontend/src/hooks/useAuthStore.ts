import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'partner' | 'academic' | 'approver' | 'contract_center' | 'legal';

interface User {
  email: string;
  name: string;
  role: Role;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Role-based access control helpers
export const ROLE_LABELS: Record<Role, string> = {
  partner: 'ภาคีเครือข่าย',
  academic: 'นักวิชาการ',
  approver: 'ผู้อนุมัติ',
  contract_center: 'ศูนย์สัญญา',
  legal: 'กฎหมาย',
};

export const canAccessRoute = (role: Role | undefined, route: string): boolean => {
  if (!role) return false;

  const routePermissions: Record<string, Role[]> = {
    '/dashboard': ['partner', 'academic', 'approver', 'contract_center', 'legal'],
    '/proposals': ['partner', 'academic', 'approver'],
    '/screening': ['academic', 'approver'],
    '/approval': ['approver'],
    '/contracts': ['partner', 'approver', 'contract_center'],
    '/payments': ['partner', 'academic', 'approver', 'legal'],
    '/reports': ['academic', 'approver', 'legal'],
  };

  const allowedRoles = routePermissions[route];
  return allowedRoles ? allowedRoles.includes(role) : false;
};
