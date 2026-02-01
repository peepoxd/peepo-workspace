import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuthStore';
import { authApi } from '../utils/api';
import { LogIn, AlertCircle, FileText, ClipboardCheck, CheckCircle, FileSignature, Wallet, FolderCheck, Eye } from 'lucide-react';
import { clsx } from 'clsx';

// RBAC ตาม presentation-scripts.txt
const demoUsers = [
  {
    email: 'partner@demo.com',
    password: 'partner123',
    label: 'ภาคีเครือข่าย',
    color: 'bg-blue-500',
    permissions: [
      { icon: FileText, label: 'สร้างข้อเสนอ', action: 'create' },
      { icon: Eye, label: 'ดูคัดกรอง/อนุมัติ', action: 'view' },
      { icon: FileSignature, label: 'ดำเนินการสัญญา', action: 'action' },
      { icon: Wallet, label: 'ขอเบิกจ่าย', action: 'action' },
      { icon: FolderCheck, label: 'ส่งรายงานปิดโครงการ', action: 'action' },
    ],
  },
  {
    email: 'academic@demo.com',
    password: 'academic123',
    label: 'นักวิชาการ',
    color: 'bg-green-500',
    permissions: [
      { icon: FileText, label: 'ดูข้อเสนอ', action: 'view' },
      { icon: ClipboardCheck, label: 'คัดกรอง/กลั่นกรอง', action: 'action' },
      { icon: Eye, label: 'ดูอนุมัติ', action: 'view' },
      { icon: Wallet, label: 'ตรวจสอบเบิกจ่าย', action: 'check' },
      { icon: FolderCheck, label: 'ตรวจครุภัณฑ์ปิดโครงการ', action: 'check' },
    ],
  },
  {
    email: 'approver@demo.com',
    password: 'approver123',
    label: 'ผู้อนุมัติ',
    color: 'bg-purple-500',
    permissions: [
      { icon: FileText, label: 'ดูข้อเสนอ', action: 'view' },
      { icon: ClipboardCheck, label: 'ดูคัดกรอง', action: 'view' },
      { icon: CheckCircle, label: 'อนุมัติโครงการ', action: 'approve' },
      { icon: FileSignature, label: 'อนุมัติสัญญา', action: 'approve' },
      { icon: Wallet, label: 'อนุมัติเบิกจ่าย', action: 'approve' },
    ],
  },
  {
    email: 'contract@demo.com',
    password: 'contract123',
    label: 'ศูนย์สัญญา',
    color: 'bg-orange-500',
    permissions: [
      { icon: Eye, label: 'ดูข้อเสนอ/คัดกรอง', action: 'view' },
      { icon: FileSignature, label: 'จัดทำสัญญา', action: 'create' },
      { icon: FileSignature, label: 'ลงนามสัญญา', action: 'action' },
      { icon: FolderCheck, label: 'อนุมัติปิดโครงการ', action: 'approve' },
    ],
  },
  {
    email: 'legal@demo.com',
    password: 'legal123',
    label: 'ฝ่ายกฎหมาย',
    color: 'bg-red-500',
    permissions: [
      { icon: Eye, label: 'ดูได้ทุกส่วน', action: 'view' },
      { icon: FolderCheck, label: 'พิจารณาปิดโครงการ', action: 'approve' },
      { icon: FileSignature, label: 'พิจารณายกเลิกสัญญา', action: 'action' },
    ],
  },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof demoUsers[0] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authApi.login(email, password);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'เข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const selectUser = (user: typeof demoUsers[0]) => {
    setEmail(user.email);
    setPassword(user.password);
    setSelectedUser(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Login Form */}
        <div className="card">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Demo Granting System</h1>
            <p className="text-gray-500 mt-2">ระบบบริหารโครงการ สสส. (Demo)</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="label">อีเมล</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
              />
            </div>

            <div>
              <label className="label">รหัสผ่าน</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>กำลังเข้าสู่ระบบ...</span>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>เข้าสู่ระบบ</span>
                </>
              )}
            </button>
          </form>

          {/* Selected User Permissions */}
          {selectedUser && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <div className={clsx('w-3 h-3 rounded-full', selectedUser.color)} />
                <span className="font-medium text-sm">{selectedUser.label}</span>
                <span className="text-xs text-gray-400">- สิทธิ์การใช้งาน</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {selectedUser.permissions.map((perm, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <perm.icon size={14} className={clsx(
                      perm.action === 'approve' && 'text-green-500',
                      perm.action === 'create' && 'text-blue-500',
                      perm.action === 'action' && 'text-orange-500',
                      perm.action === 'check' && 'text-purple-500',
                      perm.action === 'view' && 'text-gray-400',
                    )} />
                    <span className={clsx(
                      perm.action === 'view' ? 'text-gray-500' : 'text-gray-700'
                    )}>{perm.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Demo Users */}
        <div className="card bg-white/80 backdrop-blur">
          <h2 className="text-lg font-semibold mb-4">เลือกผู้ใช้ทดสอบ (5 บทบาท)</h2>
          <p className="text-sm text-gray-500 mb-4">
            คลิกเพื่อเลือกบทบาทและดูสิทธิ์การใช้งานตาม RBAC
          </p>

          <div className="space-y-3">
            {demoUsers.map((user) => (
              <button
                key={user.email}
                onClick={() => selectUser(user)}
                className={clsx(
                  'w-full text-left p-4 rounded-xl border-2 transition-all',
                  selectedUser?.email === user.email
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center text-white', user.color)}>
                    {user.label.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.label}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>

                {/* Quick permissions preview */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {user.permissions.slice(0, 3).map((perm, i) => (
                    <span
                      key={i}
                      className={clsx(
                        'text-xs px-2 py-0.5 rounded-full',
                        perm.action === 'approve' && 'bg-green-100 text-green-700',
                        perm.action === 'create' && 'bg-blue-100 text-blue-700',
                        perm.action === 'action' && 'bg-orange-100 text-orange-700',
                        perm.action === 'check' && 'bg-purple-100 text-purple-700',
                        perm.action === 'view' && 'bg-gray-100 text-gray-600',
                      )}
                    >
                      {perm.label}
                    </span>
                  ))}
                  {user.permissions.length > 3 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                      +{user.permissions.length - 3}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Workflow Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Workflow ระบบ</h3>
            <div className="text-xs text-gray-500 space-y-1">
              <p>1. ยื่นข้อเสนอ → 2. คัดกรอง → 3. อนุมัติ → 4. ทำสัญญา</p>
              <p>5. เบิกจ่าย/ส่งงาน → 6. ปิดโครงการ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
