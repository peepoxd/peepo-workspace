import { clsx } from 'clsx';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  animated?: boolean;
}

export default function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  size = 'md',
  variant = 'default',
  animated = false,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variants = {
    default: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  const bgVariants = {
    default: 'bg-blue-100',
    success: 'bg-green-100',
    warning: 'bg-yellow-100',
    error: 'bg-red-100',
  };

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between mb-1.5">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showValue && (
            <span className="text-sm text-gray-500">
              {new Intl.NumberFormat('th-TH').format(value)}
              {max !== 100 && ` / ${new Intl.NumberFormat('th-TH').format(max)}`}
            </span>
          )}
        </div>
      )}
      <div className={clsx('rounded-full overflow-hidden', bgVariants[variant], sizes[size])}>
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-500',
            variants[variant],
            animated && 'animate-pulse'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Multi-segment progress bar
interface ProgressSegment {
  value: number;
  color: string;
  label: string;
}

interface MultiProgressBarProps {
  segments: ProgressSegment[];
  max: number;
  showLegend?: boolean;
}

export function MultiProgressBar({ segments, max, showLegend = true }: MultiProgressBarProps) {
  return (
    <div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
        {segments.map((segment, i) => {
          const percentage = (segment.value / max) * 100;
          return (
            <div
              key={i}
              className={clsx('h-full transition-all duration-500', segment.color)}
              style={{ width: `${percentage}%` }}
            />
          );
        })}
      </div>
      {showLegend && (
        <div className="flex gap-4 mt-3 flex-wrap">
          {segments.map((segment, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <div className={clsx('w-3 h-3 rounded', segment.color)} />
              <span className="text-gray-600">{segment.label}</span>
              <span className="font-medium text-gray-900">
                {new Intl.NumberFormat('th-TH').format(segment.value)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
