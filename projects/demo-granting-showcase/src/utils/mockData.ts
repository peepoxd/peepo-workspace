// Mock Data Layer สำหรับ Demo Showcase
// ไม่ต้องใช้ backend จริง

export type Role = 'partner' | 'academic' | 'approver' | 'contract_center' | 'legal';

export interface User {
  email: string;
  name: string;
  role: Role;
  password: string;
}

export interface Proposal {
  id: number;
  projectName: string;
  description: string;
  budget: number;
  duration: number;
  objectives: string[];
  targetGroup: string;
  status: 'draft' | 'submitted' | 'screening' | 'approved' | 'rejected';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
}

// ===== MOCK USERS =====
export const mockUsers: Record<string, User> = {
  'partner@demo.com': {
    email: 'partner@demo.com',
    name: 'สมชาย ภาคีเครือข่าย',
    role: 'partner',
    password: 'partner123',
  },
  'academic@demo.com': {
    email: 'academic@demo.com',
    name: 'ดร.สมหญิง นักวิชาการ',
    role: 'academic',
    password: 'academic123',
  },
  'approver@demo.com': {
    email: 'approver@demo.com',
    name: 'คุณประยุทธ์ ผู้อนุมัติ',
    role: 'approver',
    password: 'approver123',
  },
  'contract@demo.com': {
    email: 'contract@demo.com',
    name: 'คุณสมศรี ศูนย์สัญญา',
    role: 'contract_center',
    password: 'contract123',
  },
  'legal@demo.com': {
    email: 'legal@demo.com',
    name: 'ทนายสมปอง กฎหมาย',
    role: 'legal',
    password: 'legal123',
  },
};

// ===== MOCK PROPOSALS (15 โครงการ ครอบคลุมทุกสถานะ) =====
export let mockProposals: Proposal[] = [
  // === APPROVED (4 โครงการ) ===
  {
    id: 1,
    projectName: 'โครงการพัฒนาชุมชนยั่งยืน ตำบลบ้านนา',
    description: 'โครงการพัฒนาศักยภาพชุมชนในพื้นที่ชนบทให้มีความยั่งยืนทางเศรษฐกิจและสังคม ผ่านการส่งเสริมอาชีพ การศึกษา และสุขภาพ โดยมุ่งเน้นการมีส่วนร่วมของชุมชนเป็นหลัก',
    budget: 500000,
    duration: 12,
    objectives: ['พัฒนาอาชีพในชุมชน', 'สร้างรายได้เพิ่ม 30%', 'ลดความเหลื่อมล้ำในพื้นที่'],
    targetGroup: 'ชุมชนในพื้นที่ชนบท 5 หมู่บ้าน ประชากร 2,500 คน',
    status: 'approved',
    createdBy: 'partner@demo.com',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    submittedAt: '2024-01-16T09:00:00Z',
  },
  {
    id: 5,
    projectName: 'โครงการส่งเสริมสุขภาพผู้สูงอายุ',
    description: 'ดูแลสุขภาพผู้สูงอายุในชุมชนแบบองค์รวม ทั้งกาย จิต สังคม ผ่านกิจกรรมออกกำลังกาย การตรวจสุขภาพ และกลุ่มสัมพันธ์',
    budget: 280000,
    duration: 12,
    objectives: ['ตรวจสุขภาพผู้สูงอายุ 500 คน', 'จัดกิจกรรมออกกำลังกาย', 'ลดอัตราการเจ็บป่วย 20%'],
    targetGroup: 'ผู้สูงอายุ 60 ปีขึ้นไป ในเขตเทศบาล',
    status: 'approved',
    createdBy: 'partner@demo.com',
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-25T16:00:00Z',
    submittedAt: '2024-01-06T09:00:00Z',
  },
  {
    id: 7,
    projectName: 'โครงการลดขยะพลาสติกในชุมชน',
    description: 'รณรงค์และสร้างจิตสำนึกลดการใช้พลาสติก พร้อมจัดตั้งธนาคารขยะและระบบรีไซเคิล',
    budget: 180000,
    duration: 8,
    objectives: ['ลดขยะพลาสติก 40%', 'จัดตั้งธนาคารขยะ 5 แห่ง', 'อบรมประชาชน 1,000 คน'],
    targetGroup: 'ประชาชนในเขตเทศบาลตำบล 3 แห่ง',
    status: 'approved',
    createdBy: 'partner@demo.com',
    createdAt: '2023-12-01T09:00:00Z',
    updatedAt: '2023-12-20T14:00:00Z',
    submittedAt: '2023-12-02T10:00:00Z',
  },
  {
    id: 11,
    projectName: 'โครงการพัฒนาแหล่งน้ำชุมชน',
    description: 'ขุดลอกและพัฒนาแหล่งน้ำชุมชนเพื่อการเกษตรและอุปโภคบริโภค',
    budget: 650000,
    duration: 6,
    objectives: ['ขุดลอกสระ 10 แห่ง', 'เพิ่มปริมาณน้ำกักเก็บ 50%', 'ลดปัญหาภัยแล้ง'],
    targetGroup: 'เกษตรกร 500 ครัวเรือน',
    status: 'approved',
    createdBy: 'partner@demo.com',
    createdAt: '2023-11-15T10:00:00Z',
    updatedAt: '2023-12-01T11:00:00Z',
    submittedAt: '2023-11-16T09:00:00Z',
  },

  // === SCREENING (3 โครงการ - รอคัดกรอง) ===
  {
    id: 2,
    projectName: 'โครงการส่งเสริมการเกษตรอินทรีย์ จังหวัดเชียงใหม่',
    description: 'ส่งเสริมให้เกษตรกรปรับเปลี่ยนมาทำเกษตรอินทรีย์ เพื่อสุขภาพที่ดีของผู้ผลิตและผู้บริโภค รวมถึงรักษาสิ่งแวดล้อม ลดการใช้สารเคมี และสร้างมูลค่าเพิ่มให้ผลผลิต',
    budget: 750000,
    duration: 18,
    objectives: ['อบรมเกษตรกร 100 ราย', 'รับรองมาตรฐานอินทรีย์ 50 ราย', 'สร้างตลาดสีเขียว 3 แห่ง'],
    targetGroup: 'เกษตรกรในจังหวัดเชียงใหม่ 5 อำเภอ',
    status: 'screening',
    createdBy: 'partner@demo.com',
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-05T11:00:00Z',
    submittedAt: '2024-02-02T10:00:00Z',
  },
  {
    id: 6,
    projectName: 'โครงการพัฒนาผลิตภัณฑ์ OTOP ชุมชน',
    description: 'ยกระดับผลิตภัณฑ์ชุมชนให้ได้มาตรฐาน พัฒนาบรรจุภัณฑ์ และสร้างช่องทางการตลาดออนไลน์',
    budget: 350000,
    duration: 8,
    objectives: ['พัฒนาผลิตภัณฑ์ 20 รายการ', 'ขึ้นทะเบียน อย. 10 รายการ', 'เปิดร้านค้าออนไลน์'],
    targetGroup: 'กลุ่มวิสาหกิจชุมชน 15 กลุ่ม',
    status: 'screening',
    createdBy: 'partner@demo.com',
    createdAt: '2024-02-08T11:00:00Z',
    updatedAt: '2024-02-12T09:00:00Z',
    submittedAt: '2024-02-09T10:00:00Z',
  },
  {
    id: 12,
    projectName: 'โครงการส่งเสริมการท่องเที่ยวเชิงวัฒนธรรม',
    description: 'พัฒนาแหล่งท่องเที่ยวเชิงวัฒนธรรมและอบรมมัคคุเทศก์ท้องถิ่น',
    budget: 420000,
    duration: 10,
    objectives: ['พัฒนาเส้นทางท่องเที่ยว 5 เส้นทาง', 'อบรมมัคคุเทศก์ 30 คน', 'เพิ่มนักท่องเที่ยว 30%'],
    targetGroup: 'ชุมชนในพื้นที่แหล่งท่องเที่ยว 3 ตำบล',
    status: 'screening',
    createdBy: 'partner@demo.com',
    createdAt: '2024-02-10T10:00:00Z',
    updatedAt: '2024-02-15T11:00:00Z',
    submittedAt: '2024-02-11T09:00:00Z',
  },

  // === SUBMITTED (3 โครงการ - ยื่นแล้ว รอคัดกรอง) ===
  {
    id: 3,
    projectName: 'โครงการพัฒนาทักษะดิจิทัลเยาวชน',
    description: 'พัฒนาทักษะด้านดิจิทัลให้กับเยาวชนในพื้นที่ห่างไกล เพื่อเตรียมความพร้อมสู่ตลาดแรงงานในอนาคต รวมถึงการสร้าง portfolio และเชื่อมต่อกับผู้ประกอบการ',
    budget: 300000,
    duration: 6,
    objectives: ['อบรมเยาวชน 200 คน', 'สร้าง portfolio ดิจิทัล', 'เชื่อมต่อกับผู้ประกอบการ 10 ราย'],
    targetGroup: 'เยาวชนอายุ 15-25 ปี ในพื้นที่ห่างไกล 3 จังหวัด',
    status: 'submitted',
    createdBy: 'partner@demo.com',
    createdAt: '2024-02-10T08:00:00Z',
    updatedAt: '2024-02-10T08:00:00Z',
    submittedAt: '2024-02-10T08:30:00Z',
  },
  {
    id: 4,
    projectName: 'โครงการอนุรักษ์ป่าชุมชน ลุ่มน้ำแม่กลอง',
    description: 'อนุรักษ์และฟื้นฟูป่าชุมชน สร้างจิตสำนึกรักษ์สิ่งแวดล้อมให้กับคนในชุมชน พร้อมสร้างรายได้จากการท่องเที่ยวเชิงนิเวศ',
    budget: 450000,
    duration: 24,
    objectives: ['ปลูกป่า 100 ไร่', 'สร้างแนวกันไฟ 5 กม.', 'ตั้งกลุ่มอนุรักษ์ 3 กลุ่ม'],
    targetGroup: 'ชุมชนรอบป่าสงวน 3 ตำบล ประชากร 5,000 คน',
    status: 'draft',
    createdBy: 'partner@demo.com',
    createdAt: '2024-02-15T14:00:00Z',
    updatedAt: '2024-02-15T14:00:00Z',
  },
  {
    id: 5,
    projectName: 'โครงการส่งเสริมสุขภาพผู้สูงอายุ',
    description: 'ดูแลสุขภาพผู้สูงอายุในชุมชนแบบองค์รวม ทั้งกาย จิต สังคม ผ่านกิจกรรมออกกำลังกาย การตรวจสุขภาพ และกลุ่มสัมพันธ์',
    budget: 280000,
    duration: 12,
    objectives: ['ตรวจสุขภาพผู้สูงอายุ 500 คน', 'จัดกิจกรรมออกกำลังกาย', 'ลดอัตราการเจ็บป่วย 20%'],
    targetGroup: 'ผู้สูงอายุ 60 ปีขึ้นไป ในเขตเทศบาล',
    status: 'approved',
    createdBy: 'partner@demo.com',
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-25T16:00:00Z',
    submittedAt: '2024-01-06T09:00:00Z',
  },
  {
    id: 6,
    projectName: 'โครงการพัฒนาผลิตภัณฑ์ OTOP ชุมชน',
    description: 'ยกระดับผลิตภัณฑ์ชุมชนให้ได้มาตรฐาน พัฒนาบรรจุภัณฑ์ และสร้างช่องทางการตลาดออนไลน์',
    budget: 350000,
    duration: 8,
    objectives: ['พัฒนาผลิตภัณฑ์ 20 รายการ', 'ขึ้นทะเบียน อย. 10 รายการ', 'เปิดร้านค้าออนไลน์'],
    targetGroup: 'กลุ่มวิสาหกิจชุมชน 15 กลุ่ม',
    status: 'screening',
    createdBy: 'partner@demo.com',
    createdAt: '2024-02-08T11:00:00Z',
    updatedAt: '2024-02-12T09:00:00Z',
    submittedAt: '2024-02-09T10:00:00Z',
  },
];

// ===== MOCK DASHBOARD =====
export const mockDashboard = {
  summary: {
    totalProposals: 45,
    totalBudget: 25750000,
    approvedProposals: 12,
    pendingProposals: 18,
    rejectedProposals: 5,
    inProgressProposals: 10,
  },
  proposals: {
    total: 45,
    draft: 15,
    submitted: 10,
    approved: 12,
    rejected: 5,
  },
  budget: {
    total: 25000000,
    allocated: 15000000,
    disbursed: 8000000,
    remaining: 10000000,
  },
  timeline: {
    onTrack: 12,
    delayed: 3,
    completed: 8,
  },
  alerts: [] as any[],
  proposalsByStatus: [
    { status: 'draft', count: 15, label: 'ฉบับร่าง', color: '#9CA3AF' },
    { status: 'submitted', count: 10, label: 'ยื่นแล้ว', color: '#3B82F6' },
    { status: 'screening', count: 8, label: 'กำลังคัดกรอง', color: '#F59E0B' },
    { status: 'approved', count: 12, label: 'อนุมัติ', color: '#10B981' },
  ],
  recentActivities: [
    { id: 1, action: 'สร้างข้อเสนอใหม่', project: 'โครงการอนุรักษ์ป่าชุมชน', user: 'สมชาย ภาคีเครือข่าย', time: '2 ชั่วโมงที่แล้ว', type: 'create' },
    { id: 2, action: 'อนุมัติโครงการ', project: 'โครงการพัฒนาชุมชนยั่งยืน', user: 'คุณประยุทธ์ ผู้อนุมัติ', time: '1 วันที่แล้ว', type: 'approve' },
    { id: 3, action: 'ส่งคัดกรอง', project: 'โครงการส่งเสริมการเกษตรอินทรีย์', user: 'ดร.สมหญิง นักวิชาการ', time: '2 วันที่แล้ว', type: 'screen' },
    { id: 4, action: 'แก้ไขข้อเสนอ', project: 'โครงการพัฒนาผลิตภัณฑ์ OTOP', user: 'สมชาย ภาคีเครือข่าย', time: '3 วันที่แล้ว', type: 'edit' },
    { id: 5, action: 'ยื่นข้อเสนอ', project: 'โครงการพัฒนาทักษะดิจิทัล', user: 'สมชาย ภาคีเครือข่าย', time: '5 วันที่แล้ว', type: 'submit' },
  ],
  budgetByCategory: [
    { category: 'การศึกษา', amount: 8500000, percentage: 33 },
    { category: 'สุขภาพ', amount: 6200000, percentage: 24 },
    { category: 'สิ่งแวดล้อม', amount: 5050000, percentage: 20 },
    { category: 'เศรษฐกิจชุมชน', amount: 6000000, percentage: 23 },
  ],
  monthlyTrend: [
    { month: 'ม.ค.', proposals: 8, budget: 4200000 },
    { month: 'ก.พ.', proposals: 12, budget: 5800000 },
    { month: 'มี.ค.', proposals: 10, budget: 4500000 },
    { month: 'เม.ย.', proposals: 15, budget: 7200000 },
  ],
};

// ===== MOCK SCREENING =====
export const mockScreenings = [
  {
    id: 1,
    proposalId: 2,
    proposalName: 'โครงการส่งเสริมการเกษตรอินทรีย์',
    screenedBy: 'academic@demo.com',
    screenedByName: 'ดร.สมหญิง นักวิชาการ',
    status: 'in_progress',
    criteria: [
      { name: 'ความสอดคล้องกับวัตถุประสงค์', score: 8, maxScore: 10 },
      { name: 'ความเป็นไปได้ของโครงการ', score: 7, maxScore: 10 },
      { name: 'งบประมาณเหมาะสม', score: 8, maxScore: 10 },
      { name: 'ผลกระทบต่อชุมชน', score: 9, maxScore: 10 },
    ],
    comments: 'โครงการมีความน่าสนใจ แต่ควรเพิ่มรายละเอียดแผนการตลาด',
    createdAt: '2024-02-05T10:00:00Z',
  },
  {
    id: 2,
    proposalId: 6,
    proposalName: 'โครงการพัฒนาผลิตภัณฑ์ OTOP',
    screenedBy: 'academic@demo.com',
    screenedByName: 'ดร.สมหญิง นักวิชาการ',
    status: 'pending',
    criteria: [],
    comments: '',
    createdAt: '2024-02-12T09:00:00Z',
  },
];

// ===== MOCK CONTRACTS =====
export const mockContracts = [
  {
    id: 1,
    proposalId: 1,
    projectName: 'โครงการพัฒนาชุมชนยั่งยืน ตำบลบ้านนา',
    contractNumber: 'CTR-2024-001',
    amount: 500000,
    totalBudget: 500000,
    startDate: '2024-02-01',
    endDate: '2025-01-31',
    status: 'active',
    signedDate: '2024-01-25',
    partner: 'สมชาย ภาคีเครือข่าย',
    signatures: [
      { signedBy: 'สมชาย ภาคีเครือข่าย', signedAt: '2024-01-25', role: 'ภาคี' },
      { signedBy: 'คุณสมศรี ศูนย์สัญญา', signedAt: '2024-01-25', role: 'ศูนย์สัญญา' },
    ],
  },
  {
    id: 2,
    proposalId: 5,
    projectName: 'โครงการส่งเสริมสุขภาพผู้สูงอายุ',
    contractNumber: 'CTR-2024-002',
    amount: 280000,
    totalBudget: 280000,
    startDate: '2024-02-15',
    endDate: '2025-02-14',
    status: 'pending_signature',
    signedDate: '2024-02-10',
    partner: 'สมชาย ภาคีเครือข่าย',
    signatures: [],
  },
];

// ===== MOCK PAYMENTS =====
export const mockPayments = [
  {
    id: 1,
    contractId: 1,
    projectName: 'โครงการพัฒนาชุมชนยั่งยืน',
    installment: 1,
    installmentNumber: 1,
    amount: 150000,
    description: 'เบิกจ่ายงวดที่ 1 - ค่าดำเนินการเริ่มต้น',
    dueDate: '2024-02-15',
    requestedAt: '2024-02-10T10:00:00Z',
    approvedAt: '2024-02-14T14:00:00Z',
    status: 'paid',
    paidDate: '2024-02-14',
  },
  {
    id: 2,
    contractId: 1,
    projectName: 'โครงการพัฒนาชุมชนยั่งยืน',
    installment: 2,
    installmentNumber: 2,
    amount: 200000,
    description: 'เบิกจ่ายงวดที่ 2 - ค่าดำเนินการ',
    dueDate: '2024-05-15',
    requestedAt: '2024-05-01T09:00:00Z',
    status: 'pending',
    paidDate: null,
  },
  {
    id: 3,
    contractId: 2,
    projectName: 'โครงการส่งเสริมสุขภาพผู้สูงอายุ',
    installment: 1,
    installmentNumber: 1,
    amount: 100000,
    description: 'เบิกจ่ายงวดที่ 1 - ค่าอุปกรณ์',
    dueDate: '2024-03-01',
    requestedAt: '2024-02-20T11:00:00Z',
    status: 'pending',
    paidDate: null,
  },
];

// ===== MOCK PROJECTS FOR CLOSURE (ปิดโครงการ) =====
export const mockProjectsForClosure = [
  {
    id: 1,
    projectName: 'โครงการพัฒนาชุมชนยั่งยืน ตำบลบ้านนา',
    contractNumber: 'CTR-2024-001',
    budget: 500000,
    status: 'pending_report', // รอรายงานสรุป
    endDate: '2025-01-31',
    paymentsCompleted: true,
    finalReportSubmitted: false,
    equipmentChecked: false,
  },
  {
    id: 2,
    projectName: 'โครงการส่งเสริมสุขภาพผู้สูงอายุ',
    contractNumber: 'CTR-2024-002',
    budget: 280000,
    status: 'pending_check', // รอตรวจครุภัณฑ์
    endDate: '2025-02-14',
    paymentsCompleted: true,
    finalReportSubmitted: true,
    equipmentChecked: false,
  },
  {
    id: 3,
    projectName: 'โครงการอบรมทักษะอาชีพ',
    contractNumber: 'CTR-2023-015',
    budget: 350000,
    status: 'pending_approval', // รออนุมัติปิด
    endDate: '2024-12-31',
    paymentsCompleted: true,
    finalReportSubmitted: true,
    equipmentChecked: true,
  },
  {
    id: 4,
    projectName: 'โครงการส่งเสริมการออม',
    contractNumber: 'CTR-2023-010',
    budget: 200000,
    status: 'closed', // ปิดแล้ว
    endDate: '2024-06-30',
    paymentsCompleted: true,
    finalReportSubmitted: true,
    equipmentChecked: true,
  },
];

// ===== HELPER: Generate Token =====
export const generateMockToken = (email: string): string => {
  return btoa(JSON.stringify({ email, exp: Date.now() + 8 * 60 * 60 * 1000 }));
};

// ===== HELPER: Get Next ID =====
let nextProposalId = 7;
export const getNextProposalId = () => nextProposalId++;
