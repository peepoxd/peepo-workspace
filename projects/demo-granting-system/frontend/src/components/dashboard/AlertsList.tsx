import { AlertCircle, Clock, CheckCircle, Info, X } from 'lucide-react';
import { clsx } from 'clsx';
import { useState } from 'react';

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  timestamp?: string;
  dismissible?: boolean;
}

interface AlertsListProps {
  alerts: Alert[];
  onDismiss?: (id: string) => void;
  maxItems?: number;
}

export default function AlertsList({ alerts, onDismiss, maxItems = 5 }: AlertsListProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visibleAlerts = alerts
    .filter((a) => !dismissed.has(a.id))
    .slice(0, maxItems);

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
    onDismiss?.(id);
  };

  const getAlertConfig = (type: Alert['type']) => {
    const configs = {
      warning: {
        icon: AlertCircle,
        iconColor: 'text-yellow-500',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
      },
      error: {
        icon: AlertCircle,
        iconColor: 'text-red-500',
        bg: 'bg-red-50',
        border: 'border-red-200',
      },
      info: {
        icon: Info,
        iconColor: 'text-blue-500',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
      },
      success: {
        icon: CheckCircle,
        iconColor: 'text-green-500',
        bg: 'bg-green-50',
        border: 'border-green-200',
      },
    };
    return configs[type];
  };

  if (visibleAlerts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <CheckCircle size={32} className="mx-auto mb-2 text-green-300" />
        <p className="text-sm">ไม่มีการแจ้งเตือน</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {visibleAlerts.map((alert) => {
        const config = getAlertConfig(alert.type);
        const Icon = config.icon;

        return (
          <div
            key={alert.id}
            className={clsx(
              'flex gap-3 p-4 rounded-xl border',
              config.bg,
              config.border
            )}
          >
            <Icon size={20} className={clsx('flex-shrink-0 mt-0.5', config.iconColor)} />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">{alert.title}</p>
              <p className="text-sm text-gray-600 mt-0.5">{alert.message}</p>
              {alert.timestamp && (
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <Clock size={12} />
                  {alert.timestamp}
                </p>
              )}
            </div>
            {alert.dismissible !== false && (
              <button
                onClick={() => handleDismiss(alert.id)}
                className="p-1 hover:bg-white/50 rounded-lg transition-colors"
              >
                <X size={16} className="text-gray-400" />
              </button>
            )}
          </div>
        );
      })}

      {alerts.length > maxItems && (
        <p className="text-center text-sm text-gray-500">
          และอีก {alerts.length - maxItems} รายการ
        </p>
      )}
    </div>
  );
}
