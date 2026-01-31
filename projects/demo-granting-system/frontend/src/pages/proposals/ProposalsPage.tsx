import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { proposalsApi } from '../../utils/api';
import { Plus, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuthStore } from '../../hooks/useAuthStore';

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  draft: { label: 'ฉบับร่าง', color: 'bg-gray-100 text-gray-600', icon: FileText },
  submitted: { label: 'ยื่นแล้ว', color: 'bg-blue-100 text-blue-600', icon: Clock },
  screening: { label: 'กำลังคัดกรอง', color: 'bg-yellow-100 text-yellow-600', icon: Clock },
  approved: { label: 'อนุมัติ', color: 'bg-green-100 text-green-600', icon: CheckCircle },
  rejected: { label: 'ไม่อนุมัติ', color: 'bg-red-100 text-red-600', icon: XCircle },
};

export default function ProposalsPage() {
  const { user } = useAuthStore();
  const { data, isLoading } = useQuery({
    queryKey: ['proposals'],
    queryFn: proposalsApi.list,
  });

  const canCreate = user?.role === 'partner';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">ข้อเสนอโครงการ</h1>
        {canCreate && (
          <Link to="/proposals/new" className="btn btn-primary flex items-center gap-2">
            <Plus size={20} />
            <span>สร้างข้อเสนอใหม่</span>
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">ชื่อโครงการ</th>
                <th className="text-left py-3 px-4">งบประมาณ</th>
                <th className="text-left py-3 px-4">ระยะเวลา</th>
                <th className="text-left py-3 px-4">สถานะ</th>
                <th className="text-left py-3 px-4">วันที่สร้าง</th>
              </tr>
            </thead>
            <tbody>
              {data?.proposals?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    ยังไม่มีข้อเสนอโครงการ
                  </td>
                </tr>
              ) : (
                data?.proposals?.map((proposal: any) => {
                  const status = statusConfig[proposal.status] || statusConfig.draft;
                  const StatusIcon = status.icon;
                  return (
                    <tr key={proposal.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Link to={`/proposals/${proposal.id}`} className="text-blue-600 hover:underline">
                          {proposal.projectName}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        {new Intl.NumberFormat('th-TH').format(proposal.budget)} บาท
                      </td>
                      <td className="py-3 px-4">{proposal.duration} เดือน</td>
                      <td className="py-3 px-4">
                        <span className={clsx('inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs', status.color)}>
                          <StatusIcon size={14} />
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-sm">
                        {new Date(proposal.createdAt).toLocaleDateString('th-TH')}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
