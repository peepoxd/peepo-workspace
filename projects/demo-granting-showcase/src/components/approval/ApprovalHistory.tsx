import { useQuery } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { CheckCircle, XCircle, AlertCircle, User, DollarSign } from 'lucide-react';
import { clsx } from 'clsx';

interface ApprovalRecord {
  id: number;
  proposalId: number;
  proposalName: string;
  decision: 'approved' | 'conditionally_approved' | 'rejected';
  budgetApproved: number;
  budgetRequested: number;
  conditions: string[];
  comments: string;
  approvedBy: string;
  approvedAt: string;
}

interface ApprovalHistoryProps {
  proposalId?: number;
  limit?: number;
}

export default function ApprovalHistory({ proposalId, limit }: ApprovalHistoryProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['approval-history', proposalId],
    queryFn: async () => {
      const url = proposalId ? `/approval?proposalId=${proposalId}` : '/approval';
      const { data } = await api.get(url);
      return data.approvals || [];
    },
  });

  const getDecisionConfig = (decision: string) => {
    const configs = {
      approved: {
        icon: CheckCircle,
        label: 'อนุมัติ',
        color: 'text-green-600',
        bg: 'bg-green-100',
      },
      conditionally_approved: {
        icon: AlertCircle,
        label: 'อนุมัติแบบมีเงื่อนไข',
        color: 'text-yellow-600',
        bg: 'bg-yellow-100',
      },
      rejected: {
        icon: XCircle,
        label: 'ไม่อนุมัติ',
        color: 'text-red-600',
        bg: 'bg-red-100',
      },
    };
    return configs[decision as keyof typeof configs] || configs.approved;
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-gray-100 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  const approvals = limit ? data?.slice(0, limit) : data;

  if (!approvals?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        <CheckCircle size={32} className="mx-auto mb-2 text-gray-300" />
        <p>ยังไม่มีประวัติการอนุมัติ</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {approvals.map((approval: ApprovalRecord) => {
        const config = getDecisionConfig(approval.decision);
        const Icon = config.icon;
        const budgetDiff = approval.budgetApproved - approval.budgetRequested;

        return (
          <div
            key={approval.id}
            className="p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {!proposalId && (
                  <p className="font-medium text-gray-900 mb-1">{approval.proposalName}</p>
                )}
                <div className="flex items-center gap-4 text-sm flex-wrap">
                  <span className={clsx('flex items-center gap-1.5 px-2 py-1 rounded-full', config.bg)}>
                    <Icon size={14} className={config.color} />
                    <span className={clsx('font-medium', config.color)}>{config.label}</span>
                  </span>
                  <span className="text-gray-500 flex items-center gap-1">
                    <User size={14} />
                    {approval.approvedBy}
                  </span>
                  <span className="text-gray-400">
                    {new Date(approval.approvedAt).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Budget Info */}
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign size={16} className="text-gray-400" />
                  <span className="text-gray-600">งบประมาณที่อนุมัติ:</span>
                  <span className="font-semibold text-gray-900">
                    {new Intl.NumberFormat('th-TH').format(approval.budgetApproved)} บาท
                  </span>
                </div>
                {budgetDiff !== 0 && (
                  <span
                    className={clsx(
                      'text-sm font-medium',
                      budgetDiff < 0 ? 'text-red-600' : 'text-green-600'
                    )}
                  >
                    {budgetDiff > 0 ? '+' : ''}
                    {new Intl.NumberFormat('th-TH').format(budgetDiff)} บาท
                  </span>
                )}
              </div>
            </div>

            {/* Conditions */}
            {approval.conditions?.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">เงื่อนไข:</p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {approval.conditions.map((condition, i) => (
                    <li key={i}>{condition}</li>
                  ))}
                </ul>
              </div>
            )}

            {approval.comments && (
              <p className="mt-3 text-sm text-gray-600 italic">"{approval.comments}"</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
