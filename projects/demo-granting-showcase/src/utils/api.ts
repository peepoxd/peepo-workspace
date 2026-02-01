// Mock API Layer - ไม่ต้องใช้ backend จริง
import { useAuthStore } from '../hooks/useAuthStore';

// Dummy api object for compatibility
export const api = {
  get: async (url: string) => ({ data: {} }),
  post: async (url: string, data?: any) => ({ data: { success: true } }),
  put: async (url: string, data?: any) => ({ data: { success: true } }),
  delete: async (url: string) => ({ data: { success: true } }),
};
import {
  mockUsers,
  mockProposals,
  mockDashboard,
  mockScreenings,
  mockContracts,
  mockPayments,
  mockProjectsForClosure,
  generateMockToken,
  getNextProposalId,
  type Proposal,
} from './mockData';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ===== AUTH API =====
export const authApi = {
  login: async (email: string, password: string) => {
    await delay(500); // Simulate network

    const user = mockUsers[email];
    if (!user || user.password !== password) {
      throw { response: { data: { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' } } };
    }

    const token = generateMockToken(email);
    return {
      token,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  },

  logout: async () => {
    await delay(200);
    return { success: true };
  },
};

// ===== PROPOSALS API =====
export const proposalsApi = {
  list: async () => {
    await delay(300);

    const user = useAuthStore.getState().user;
    let filtered = [...mockProposals];

    // Filter by role
    if (user?.role === 'partner') {
      filtered = filtered.filter(p => p.createdBy === user.email);
    }

    return { proposals: filtered, total: filtered.length };
  },

  get: async (id: number) => {
    await delay(200);

    const proposal = mockProposals.find(p => p.id === id);
    if (!proposal) {
      throw { response: { status: 404, data: { error: 'Proposal not found' } } };
    }

    return proposal;
  },

  create: async (data: Omit<Proposal, 'id' | 'status' | 'createdBy' | 'createdAt' | 'updatedAt'>) => {
    await delay(400);

    const user = useAuthStore.getState().user;
    const now = new Date().toISOString();

    const newProposal: Proposal = {
      id: getNextProposalId(),
      ...data,
      status: 'draft',
      createdBy: user?.email || 'unknown',
      createdAt: now,
      updatedAt: now,
    };

    mockProposals.push(newProposal);
    return newProposal;
  },

  update: async (id: number, data: Partial<Proposal>) => {
    await delay(300);

    const index = mockProposals.findIndex(p => p.id === id);
    if (index === -1) {
      throw { response: { status: 404, data: { error: 'Proposal not found' } } };
    }

    mockProposals[index] = {
      ...mockProposals[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return mockProposals[index];
  },

  submit: async (id: number) => {
    await delay(400);

    const index = mockProposals.findIndex(p => p.id === id);
    if (index === -1) {
      throw { response: { status: 404, data: { error: 'Proposal not found' } } };
    }

    if (mockProposals[index].status !== 'draft') {
      throw { response: { status: 400, data: { error: 'Only draft proposals can be submitted' } } };
    }

    const now = new Date().toISOString();
    mockProposals[index] = {
      ...mockProposals[index],
      status: 'submitted',
      submittedAt: now,
      updatedAt: now,
    };

    return mockProposals[index];
  },

  delete: async (id: number) => {
    await delay(300);

    const index = mockProposals.findIndex(p => p.id === id);
    if (index === -1) {
      throw { response: { status: 404, data: { error: 'Proposal not found' } } };
    }

    mockProposals.splice(index, 1);
    return { success: true };
  },
};

// ===== DASHBOARD API =====
export const dashboardApi = {
  getKPIs: async () => {
    await delay(400);

    // Update counts from actual mock data
    const statusCounts = mockProposals.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      ...mockDashboard,
      summary: {
        ...mockDashboard.summary,
        totalProposals: mockProposals.length,
        approvedProposals: statusCounts['approved'] || 0,
        pendingProposals: (statusCounts['submitted'] || 0) + (statusCounts['screening'] || 0),
      },
    };
  },
};

// ===== SCREENING API =====
export const screeningApi = {
  list: async () => {
    await delay(300);

    // Get proposals that need screening
    const pendingScreening = mockProposals
      .filter(p => p.status === 'submitted' || p.status === 'screening')
      .map(p => ({
        ...p,
        screening: mockScreenings.find(s => s.proposalId === p.id),
      }));

    return { proposals: pendingScreening, total: pendingScreening.length };
  },

  get: async (proposalId: number) => {
    await delay(200);
    return mockScreenings.find(s => s.proposalId === proposalId) || null;
  },

  submit: async (proposalId: number, data: { criteria: any[]; comments: string; recommendation: string }) => {
    await delay(500);

    const proposalIndex = mockProposals.findIndex(p => p.id === proposalId);
    if (proposalIndex !== -1) {
      mockProposals[proposalIndex].status = 'screening';
      mockProposals[proposalIndex].updatedAt = new Date().toISOString();
    }

    return { success: true, message: 'บันทึกผลการคัดกรองสำเร็จ' };
  },
};

// ===== APPROVAL API =====
export const approvalApi = {
  list: async () => {
    await delay(300);

    const pendingApproval = mockProposals
      .filter(p => p.status === 'screening')
      .map(p => ({
        ...p,
        screening: mockScreenings.find(s => s.proposalId === p.id),
      }));

    return { proposals: pendingApproval, total: pendingApproval.length };
  },

  approve: async (proposalId: number, data: { comments: string }) => {
    await delay(500);

    const index = mockProposals.findIndex(p => p.id === proposalId);
    if (index !== -1) {
      mockProposals[index].status = 'approved';
      mockProposals[index].updatedAt = new Date().toISOString();
    }

    return { success: true, message: 'อนุมัติโครงการสำเร็จ' };
  },

  reject: async (proposalId: number, data: { comments: string; reason: string }) => {
    await delay(500);

    const index = mockProposals.findIndex(p => p.id === proposalId);
    if (index !== -1) {
      mockProposals[index].status = 'rejected';
      mockProposals[index].updatedAt = new Date().toISOString();
    }

    return { success: true, message: 'ปฏิเสธโครงการสำเร็จ' };
  },
};

// ===== CONTRACTS API =====
export const contractsApi = {
  list: async () => {
    await delay(300);
    return { contracts: mockContracts, total: mockContracts.length };
  },

  get: async (id: number) => {
    await delay(200);
    const contract = mockContracts.find(c => c.id === id);
    if (!contract) {
      throw { response: { status: 404, data: { error: 'Contract not found' } } };
    }
    return contract;
  },

  create: async (data: any) => {
    await delay(500);
    return { success: true, message: 'สร้างสัญญาสำเร็จ' };
  },
};

// ===== PAYMENTS API =====
export const paymentsApi = {
  list: async () => {
    await delay(300);
    return { payments: mockPayments, total: mockPayments.length };
  },

  get: async (id: number) => {
    await delay(200);
    const payment = mockPayments.find(p => p.id === id);
    if (!payment) {
      throw { response: { status: 404, data: { error: 'Payment not found' } } };
    }
    return payment;
  },

  approve: async (id: number) => {
    await delay(500);
    const index = mockPayments.findIndex(p => p.id === id);
    if (index !== -1) {
      mockPayments[index].status = 'paid';
      mockPayments[index].paidDate = new Date().toISOString().split('T')[0];
    }
    return { success: true, message: 'อนุมัติการเบิกจ่ายสำเร็จ' };
  },
};

// ===== REPORTS API =====
export const reportsApi = {
  getSummary: async () => {
    await delay(400);
    return {
      totalProposals: mockProposals.length,
      totalBudget: mockProposals.reduce((sum, p) => sum + p.budget, 0),
      byStatus: mockProposals.reduce((acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byMonth: mockDashboard.monthlyTrend,
    };
  },

  export: async (format: 'pdf' | 'excel') => {
    await delay(1000);
    return { success: true, message: `ส่งออกรายงาน ${format.toUpperCase()} สำเร็จ` };
  },
};

// ===== CLOSURE API (ปิดโครงการ) =====
export const closureApi = {
  list: async () => {
    await delay(300);
    return { projects: mockProjectsForClosure, total: mockProjectsForClosure.length };
  },

  get: async (id: number) => {
    await delay(200);
    const project = mockProjectsForClosure.find(p => p.id === id);
    if (!project) {
      throw { response: { status: 404, data: { error: 'Project not found' } } };
    }
    return project;
  },

  // ภาคี: ส่งรายงานสรุป
  submitFinalReport: async (projectId: number, data: { report: string }) => {
    await delay(500);
    const index = mockProjectsForClosure.findIndex(p => p.id === projectId);
    if (index !== -1) {
      mockProjectsForClosure[index].finalReportSubmitted = true;
      mockProjectsForClosure[index].status = 'pending_check';
    }
    return { success: true, message: 'ส่งรายงานสรุปสำเร็จ' };
  },

  // นักวิชาการ: ตรวจครุภัณฑ์
  checkEquipment: async (projectId: number, data: { notes: string; passed: boolean }) => {
    await delay(500);
    const index = mockProjectsForClosure.findIndex(p => p.id === projectId);
    if (index !== -1) {
      mockProjectsForClosure[index].equipmentChecked = true;
      mockProjectsForClosure[index].status = 'pending_approval';
    }
    return { success: true, message: 'บันทึกผลตรวจครุภัณฑ์สำเร็จ' };
  },

  // ศูนย์สัญญา/กฎหมาย: อนุมัติปิด
  approveClosure: async (projectId: number) => {
    await delay(500);
    const index = mockProjectsForClosure.findIndex(p => p.id === projectId);
    if (index !== -1) {
      mockProjectsForClosure[index].status = 'closed';
    }
    return { success: true, message: 'อนุมัติปิดโครงการสำเร็จ' };
  },
};
