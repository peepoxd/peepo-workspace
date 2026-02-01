import { useQuery } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { CheckCircle, XCircle, AlertCircle, Clock, User } from 'lucide-react';
import { clsx } from 'clsx';

interface ScreeningRecord {
  id: number;
  proposalId: number;
  proposalName: string;
  eligibilityCheck: boolean;
  documentComplete: boolean;
  budgetReasonable: boolean;
  recommendation: 'pass' | 'revise' | 'reject';
  comments: string;
  reviewedBy: string;
  reviewedAt: string;
}

interface ScreeningHistoryProps {
  proposalId?: number;
  limit?: number;
}

export default function ScreeningHistory({ proposalId, limit }: ScreeningHistoryProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['screening-history', proposalId],
    queryFn: async () => {
      const url = proposalId ? `/screening?proposalId=${proposalId}` : '/screening';
      const { data } = await api.get(url);
      return data.screenings || [];
    },
  });

  const getRecommendationConfig = (rec: string) => {
    const configs = {
      pass: {
        icon: CheckCircle,
        label: 'ผ่าน',
        color: 'text-green-600',
        bg: 'bg-green-100',
      },
      revise: {
        icon: AlertCircle,
        label: 'แก้ไข',
        color: 'text-yellow-600',
        bg: 'bg-yellow-100',
      },
      reject: {
        icon: XCircle,
        label: 'ไม่ผ่าน',
        color: 'text-red-600',
        bg: 'bg-red-100',
      },
    };
    return configs[rec as keyof typeof configs] || configs.revise;
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-gray-100 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  const screenings = limit ? data?.slice(0, limit) : data;

  if (!screenings?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock size={32} className="mx-auto mb-2 text-gray-300" />
        <p>ยังไม่มีประวัติการคัดกรอง</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {screenings.map((screening: ScreeningRecord) => {
        const config = getRecommendationConfig(screening.recommendation);
        const Icon = config.icon;

        return (
          <div
            key={screening.id}
            className="p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {!proposalId && (
                  <p className="font-medium text-gray-900 mb-1">{screening.proposalName}</p>
                )}
                <div className="flex items-center gap-4 text-sm">
                  <span className={clsx('flex items-center gap-1.5 px-2 py-1 rounded-full', config.bg)}>
                    <Icon size={14} className={config.color} />
                    <span className={clsx('font-medium', config.color)}>{config.label}</span>
                  </span>
                  <span className="text-gray-500 flex items-center gap-1">
                    <User size={14} />
                    {screening.reviewedBy}
                  </span>
                  <span className="text-gray-400">
                    {new Date(screening.reviewedAt).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="mt-3 flex gap-4 text-sm">
              <CheckItem checked={screening.eligibilityCheck} label="คุณสมบัติ" />
              <CheckItem checked={screening.documentComplete} label="เอกสาร" />
              <CheckItem checked={screening.budgetReasonable} label="งบประมาณ" />
            </div>

            {screening.comments && (
              <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {screening.comments}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function CheckItem({ checked, label }: { checked: boolean; label: string }) {
  return (
    <span className={clsx('flex items-center gap-1', checked ? 'text-green-600' : 'text-gray-400')}>
      {checked ? <CheckCircle size={14} /> : <XCircle size={14} />}
      {label}
    </span>
  );
}
