import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { clsx } from 'clsx';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

// Route to Thai label mapping
const routeLabels: Record<string, string> = {
  dashboard: 'แดชบอร์ด',
  proposals: 'ข้อเสนอโครงการ',
  new: 'สร้างใหม่',
  edit: 'แก้ไข',
  screening: 'คัดกรอง',
  approval: 'อนุมัติ',
  contracts: 'สัญญา',
  payments: 'เบิกจ่าย',
  reports: 'รายงาน',
};

export default function Breadcrumbs({
  items,
  showHome = true,
  className,
}: BreadcrumbsProps) {
  const location = useLocation();

  // Auto-generate breadcrumbs from current path if items not provided
  const breadcrumbs: BreadcrumbItem[] = items || generateBreadcrumbs(location.pathname);

  if (breadcrumbs.length === 0 && !showHome) return null;

  return (
    <nav className={clsx('flex items-center gap-1 text-sm', className)}>
      {showHome && (
        <>
          <Link
            to="/"
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Home size={16} />
            <span className="sr-only">หน้าหลัก</span>
          </Link>
          {breadcrumbs.length > 0 && (
            <ChevronRight size={16} className="text-gray-300" />
          )}
        </>
      )}

      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <div key={index} className="flex items-center gap-1">
            {item.path && !isLast ? (
              <Link
                to={item.path}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={clsx(isLast ? 'text-gray-900 font-medium' : 'text-gray-500')}>
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRight size={16} className="text-gray-300" />}
          </div>
        );
      })}
    </nav>
  );
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];
  let currentPath = '';

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;

    // Skip numeric IDs in breadcrumb labels
    if (/^\d+$/.test(segment)) {
      // For IDs, we might want to show something like "รายละเอียด" instead
      breadcrumbs.push({
        label: 'รายละเอียด',
        path: currentPath,
      });
    } else {
      breadcrumbs.push({
        label: routeLabels[segment] || segment,
        path: currentPath,
      });
    }
  }

  return breadcrumbs;
}

// Page header with breadcrumbs
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export function PageHeader({ title, subtitle, action, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <Breadcrumbs items={breadcrumbs} className="mb-3" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}
