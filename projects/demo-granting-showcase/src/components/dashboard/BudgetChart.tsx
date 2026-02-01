import { clsx } from 'clsx';

interface BudgetItem {
  label: string;
  amount: number;
  color: string;
}

interface BudgetChartProps {
  items: BudgetItem[];
  total: number;
  title?: string;
}

export default function BudgetChart({ items, total, title }: BudgetChartProps) {
  // Simple donut chart using CSS
  const generateGradient = () => {
    let currentAngle = 0;
    const gradientParts: string[] = [];

    items.forEach((item) => {
      const percentage = (item.amount / total) * 100;
      const startAngle = currentAngle;
      const endAngle = currentAngle + (percentage * 3.6); // 3.6 = 360/100

      gradientParts.push(`${item.color} ${startAngle}deg ${endAngle}deg`);
      currentAngle = endAngle;
    });

    // Fill remaining with gray if not 100%
    if (currentAngle < 360) {
      gradientParts.push(`#e5e7eb ${currentAngle}deg 360deg`);
    }

    return `conic-gradient(${gradientParts.join(', ')})`;
  };

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}

      <div className="flex items-center gap-6">
        {/* Donut Chart */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <div
            className="w-full h-full rounded-full"
            style={{ background: generateGradient() }}
          />
          <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-xs text-gray-500">รวม</p>
              <p className="text-sm font-bold">
                {(total / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3">
          {items.map((item, i) => {
            const percentage = ((item.amount / total) * 100).toFixed(1);
            return (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={clsx('w-3 h-3 rounded-full')} style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {new Intl.NumberFormat('th-TH').format(item.amount)} บาท
                  </p>
                  <p className="text-xs text-gray-400">{percentage}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Bar chart component
interface BarChartItem {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  items: BarChartItem[];
  title?: string;
  maxValue?: number;
}

export function BarChart({ items, title, maxValue }: BarChartProps) {
  const max = maxValue || Math.max(...items.map((i) => i.value)) * 1.1;

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}

      <div className="space-y-4">
        {items.map((item, i) => {
          const percentage = (item.value / max) * 100;
          return (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{item.label}</span>
                <span className="font-medium text-gray-900">
                  {new Intl.NumberFormat('th-TH').format(item.value)}
                </span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: item.color || '#3b82f6',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
