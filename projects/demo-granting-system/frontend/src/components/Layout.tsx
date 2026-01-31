import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore, ROLE_LABELS, canAccessRoute } from '../hooks/useAuthStore';
import {
  LayoutDashboard,
  FileText,
  ClipboardCheck,
  CheckCircle,
  FileSignature,
  Wallet,
  BarChart3,
  LogOut,
  User,
} from 'lucide-react';
import { clsx } from 'clsx';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/proposals', label: 'ข้อเสนอโครงการ', icon: FileText },
  { path: '/screening', label: 'คัดกรอง', icon: ClipboardCheck },
  { path: '/approval', label: 'อนุมัติ', icon: CheckCircle },
  { path: '/contracts', label: 'สัญญา', icon: FileSignature },
  { path: '/payments', label: 'เบิกจ่าย', icon: Wallet },
  { path: '/reports', label: 'รายงาน', icon: BarChart3 },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const visibleNavItems = navItems.filter((item) =>
    canAccessRoute(user?.role, item.path)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-blue-600">Demo Granting</h1>
            <p className="text-sm text-gray-500">ระบบบริหารโครงการ</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm">{user?.name || user?.email}</p>
                <p className="text-xs text-gray-500">
                  {user?.role && ROLE_LABELS[user.role]}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}
