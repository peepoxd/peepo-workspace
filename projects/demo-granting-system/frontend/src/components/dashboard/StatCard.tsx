import { ReactNode } from 'react';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: number;
  changeLabel?: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  loading?: boolean;
}

export default function StatCard({
  title,
  value,
  icon,
  change,
  changeLabel,
  variant = 'default',
  loading = false,
}: StatCardProps) {
  const variants = {
    default: 'bg-white',
    success: 'bg-gradient-to-br from-green-50 to-emerald-50',
    warning: 'bg-gradient-to-br from-yellow-50 to-amber-50',
    error: 'bg-gradient-to-br from-red-50 to-rose-50',
    info: 'bg-gradient-to-br from-blue-50 to-indigo-50',
  };

  const iconBgs = {
    default: 'bg-gray-100 text-gray-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-yellow-100 text-yellow-600',
    error: 'bg-red-100 text-red-600',
    info: 'bg-blue-100 text-blue-600',
  };

  if (loading) {
    return (
      <div className="p-6 rounded-xl border border-gray-200 bg-white">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="h-8 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx('p-6 rounded-xl border border-gray-200', variants[variant])}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className={clsx('p-2.5 rounded-lg', iconBgs[variant])}>{icon}</div>
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      {change !== undefined && (
        <div className="flex items-center gap-1 text-sm">
          {change > 0 ? (
            <TrendingUp size={16} className="text-green-500" />
          ) : change < 0 ? (
            <TrendingDown size={16} className="text-red-500" />
          ) : (
            <Minus size={16} className="text-gray-400" />
          )}
          <span
            className={clsx(
              'font-medium',
              change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'
            )}
          >
            {change > 0 ? '+' : ''}
            {change}%
          </span>
          {changeLabel && <span className="text-gray-400">{changeLabel}</span>}
        </div>
      )}
    </div>
  );
}
