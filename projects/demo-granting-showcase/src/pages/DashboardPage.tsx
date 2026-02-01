import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../utils/api';
import { FileText, CheckCircle, TrendingUp, Wallet } from 'lucide-react';
import { StatCard, ProgressBar, BudgetChart, AlertsList } from '../components/dashboard';
import { SkeletonCard } from '../components/ui';
import { PageHeader } from '../components/Breadcrumbs';

export default function DashboardPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getKPIs,
  });

  const kpi = data || {
    proposals: { total: 0, draft: 0, submitted: 0, approved: 0, rejected: 0 },
    budget: { total: 25000000, allocated: 15000000, disbursed: 8000000, remaining: 10000000 },
    timeline: { onTrack: 12, delayed: 3, completed: 8 },
    alerts: [],
  };

  const formatBudget = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)} ล้าน`;
    }
    return new Intl.NumberFormat('th-TH').format(value);
  };

  // Demo alerts if none from API
  const alerts = kpi.alerts.length > 0 ? kpi.alerts : [
    {
      id: '1',
      type: 'warning' as const,
      title: 'สัญญาใกล้หมดอายุ',
      message: 'มี 3 สัญญาที่จะหมดอายุภายใน 30 วัน',
      timestamp: '2 ชั่วโมงที่แล้ว',
    },
    {
      id: '2',
      type: 'info' as const,
      title: 'รอการอนุมัติ',
      message: 'มี 5 ข้อเสนอรอพิจารณาอนุมัติ',
      timestamp: '5 ชั่วโมงที่แล้ว',
    },
    {
      id: '3',
      type: 'success' as const,
      title: 'โครงการเสร็จสิ้น',
      message: 'โครงการพัฒนาชุมชนเสร็จสิ้นตามกำหนด',
      timestamp: 'เมื่อวาน',
    },
  ];

  // Budget chart data
  const budgetItems = [
    { label: 'เบิกจ่ายแล้ว', amount: kpi.budget.disbursed, color: '#22c55e' },
    { label: 'จัดสรรแล้ว (รอเบิก)', amount: kpi.budget.allocated - kpi.budget.disbursed, color: '#3b82f6' },
    { label: 'คงเหลือ', amount: kpi.budget.remaining, color: '#e5e7eb' },
  ];

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Dashboard" subtitle="ภาพรวมระบบบริหารโครงการ" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="ภาพรวมระบบบริหารโครงการ"
      />

      {/* Stats Grid - Using new StatCard component */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="ข้อเสนอทั้งหมด"
          value={kpi.proposals.total || 45}
          icon={<FileText size={24} />}
          variant="info"
          change={12}
          changeLabel="จากเดือนที่แล้ว"
        />
        <StatCard
          title="อนุมัติแล้ว"
          value={kpi.proposals.approved || 28}
          icon={<CheckCircle size={24} />}
          variant="success"
          change={8}
          changeLabel="จากเดือนที่แล้ว"
        />
        <StatCard
          title="โครงการตามแผน"
          value={kpi.timeline.onTrack}
          icon={<TrendingUp size={24} />}
          variant="info"
          change={-2}
          changeLabel="ล่าช้า"
        />
        <StatCard
          title="งบคงเหลือ"
          value={`฿${formatBudget(kpi.budget.remaining)}`}
          icon={<Wallet size={24} />}
          variant="warning"
        />
      </div>

      {/* Budget & Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Budget Chart */}
        <BudgetChart
          title="ภาพรวมงบประมาณ"
          items={budgetItems}
          total={kpi.budget.total}
        />

        {/* Alerts */}
        <div className="p-6 bg-white rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">การแจ้งเตือน</h3>
          <AlertsList alerts={alerts} maxItems={4} />
        </div>
      </div>

      {/* Budget Progress Bars */}
      <div className="card mb-8">
        <h2 className="text-lg font-semibold mb-6">สถานะการใช้งบประมาณ</h2>
        <div className="space-y-6">
          <ProgressBar
            label="งบประมาณทั้งหมด"
            value={kpi.budget.total}
            max={kpi.budget.total}
            variant="default"
          />
          <ProgressBar
            label="จัดสรรแล้ว"
            value={kpi.budget.allocated}
            max={kpi.budget.total}
            variant="success"
          />
          <ProgressBar
            label="เบิกจ่ายแล้ว"
            value={kpi.budget.disbursed}
            max={kpi.budget.total}
            variant="warning"
          />
        </div>
      </div>

      {/* Status Breakdown with improved design */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-6">สถานะข้อเสนอโครงการ</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'ฉบับร่าง', value: kpi.proposals.draft || 5, color: 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 border border-gray-200' },
            { label: 'ยื่นแล้ว', value: kpi.proposals.submitted || 7, color: 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 border border-blue-200' },
            { label: 'อนุมัติ', value: kpi.proposals.approved || 28, color: 'bg-gradient-to-br from-green-50 to-green-100 text-green-600 border border-green-200' },
            { label: 'ปฏิเสธ', value: kpi.proposals.rejected || 5, color: 'bg-gradient-to-br from-red-50 to-red-100 text-red-600 border border-red-200' },
            { label: 'รวมทั้งหมด', value: kpi.proposals.total || 45, color: 'bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 border border-purple-200' },
          ].map((item) => (
            <div key={item.label} className={`p-5 rounded-xl text-center ${item.color} transition-transform hover:scale-105`}>
              <p className="text-3xl font-bold">{item.value}</p>
              <p className="text-sm mt-1 font-medium">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
