import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../utils/api';
import { FileText, CheckCircle, Clock, AlertTriangle, TrendingUp, Wallet } from 'lucide-react';
import { clsx } from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'yellow' | 'red';
  subtitle?: string;
}

function StatCard({ title, value, icon: Icon, color, subtitle }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={clsx('p-3 rounded-lg', colorClasses[color])}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getKPIs,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const kpi = data || {
    proposals: { total: 0, draft: 0, submitted: 0, approved: 0, rejected: 0 },
    budget: { total: 0, allocated: 0, disbursed: 0, remaining: 0 },
    timeline: { onTrack: 0, delayed: 0, completed: 0 },
    alerts: [],
  };

  const formatBudget = (value: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="ข้อเสนอทั้งหมด"
          value={kpi.proposals.total}
          icon={FileText}
          color="blue"
          subtitle={`รอพิจารณา ${kpi.proposals.submitted} รายการ`}
        />
        <StatCard
          title="อนุมัติแล้ว"
          value={kpi.proposals.approved}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="โครงการตามแผน"
          value={kpi.timeline.onTrack}
          icon={TrendingUp}
          color="blue"
          subtitle={`ล่าช้า ${kpi.timeline.delayed} โครงการ`}
        />
        <StatCard
          title="งบคงเหลือ"
          value={formatBudget(kpi.budget.remaining)}
          icon={Wallet}
          color="yellow"
        />
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">ภาพรวมงบประมาณ</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>งบประมาณทั้งหมด</span>
                <span className="font-medium">{formatBudget(kpi.budget.total)}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>จัดสรรแล้ว</span>
                <span className="font-medium">{formatBudget(kpi.budget.allocated)}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${(kpi.budget.allocated / kpi.budget.total) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>เบิกจ่ายแล้ว</span>
                <span className="font-medium">{formatBudget(kpi.budget.disbursed)}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-yellow-500 rounded-full"
                  style={{ width: `${(kpi.budget.disbursed / kpi.budget.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">การแจ้งเตือน</h2>
          <div className="space-y-3">
            {kpi.alerts.length === 0 ? (
              <p className="text-gray-500 text-sm">ไม่มีการแจ้งเตือน</p>
            ) : (
              kpi.alerts.map((alert: any, index: number) => (
                <div
                  key={index}
                  className={clsx(
                    'flex items-center gap-3 p-3 rounded-lg',
                    alert.type === 'warning' ? 'bg-yellow-50' : 'bg-blue-50'
                  )}
                >
                  {alert.type === 'warning' ? (
                    <AlertTriangle className="text-yellow-600" size={20} />
                  ) : (
                    <Clock className="text-blue-600" size={20} />
                  )}
                  <span className="text-sm">{alert.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">สถานะข้อเสนอโครงการ</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'ฉบับร่าง', value: kpi.proposals.draft, color: 'bg-gray-100 text-gray-600' },
            { label: 'ยื่นแล้ว', value: kpi.proposals.submitted, color: 'bg-blue-100 text-blue-600' },
            { label: 'อนุมัติ', value: kpi.proposals.approved, color: 'bg-green-100 text-green-600' },
            { label: 'ปฏิเสธ', value: kpi.proposals.rejected, color: 'bg-red-100 text-red-600' },
            { label: 'รวม', value: kpi.proposals.total, color: 'bg-purple-100 text-purple-600' },
          ].map((item) => (
            <div key={item.label} className={clsx('p-4 rounded-lg text-center', item.color)}>
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-sm">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
