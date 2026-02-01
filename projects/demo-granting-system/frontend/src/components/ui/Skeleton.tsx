import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export default function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  lines = 1,
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200';

  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  if (lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={clsx(baseClasses, variants[variant], className)}
            style={{
              ...style,
              width: i === lines - 1 ? '75%' : style.width,
              height: style.height || '1rem',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={clsx(baseClasses, variants[variant], className)} style={style} />
  );
}

// Pre-built skeleton patterns
export function SkeletonCard() {
  return (
    <div className="p-6 border border-gray-200 rounded-xl">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1">
          <Skeleton height={20} width="60%" className="mb-2" />
          <Skeleton height={14} width="40%" />
        </div>
      </div>
      <Skeleton lines={3} height={14} />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex gap-4">
          <Skeleton height={16} width="20%" />
          <Skeleton height={16} width="25%" />
          <Skeleton height={16} width="15%" />
          <Skeleton height={16} width="20%" />
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-4 py-4 border-b border-gray-100 last:border-0">
          <div className="flex gap-4">
            <Skeleton height={16} width="20%" />
            <Skeleton height={16} width="25%" />
            <Skeleton height={16} width="15%" />
            <Skeleton height={16} width="20%" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonList({ items = 4 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1">
            <Skeleton height={16} width="50%" className="mb-2" />
            <Skeleton height={12} width="30%" />
          </div>
          <Skeleton height={28} width={80} />
        </div>
      ))}
    </div>
  );
}
