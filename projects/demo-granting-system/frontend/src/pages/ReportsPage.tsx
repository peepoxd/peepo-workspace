import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/api';
import { FileSpreadsheet, FileText, Download, BarChart3 } from 'lucide-react';
import { clsx } from 'clsx';

interface Report {
  id: string;
  name: string;
  format: string[];
}

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>('xlsx');

  const { data, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const { data } = await api.get('/reports');
      return data;
    },
  });

  const handleExport = async () => {
    if (!selectedReport) return;

    try {
      const { data } = await api.get(`/reports/${selectedReport.id}/export?format=${selectedFormat}`);
      alert(`รายงาน "${selectedReport.name}" กำลังถูกสร้าง\nDownload URL: ${data.downloadUrl}`);
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการสร้างรายงาน');
    }
  };

  const reportIcons: Record<string, React.ElementType> = {
    'proposals-summary': FileText,
    'budget-utilization': BarChart3,
    'project-status': FileSpreadsheet,
    'payment-history': FileSpreadsheet,
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">รายงาน</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports List */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">รายงานที่มี</h2>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data?.reports?.map((report: Report) => {
                  const Icon = reportIcons[report.id] || FileText;
                  return (
                    <button
                      key={report.id}
                      onClick={() => {
                        setSelectedReport(report);
                        setSelectedFormat(report.format[0]);
                      }}
                      className={clsx(
                        'text-left p-4 rounded-lg border transition-colors',
                        selectedReport?.id === report.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Icon size={24} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{report.name}</p>
                          <p className="text-xs text-gray-500">
                            รูปแบบ: {report.format.join(', ').toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Export Panel */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">ดาวน์โหลดรายงาน</h2>
          {selectedReport ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">{selectedReport.name}</p>
              </div>

              <div>
                <label className="label">เลือกรูปแบบ</label>
                <div className="flex gap-2">
                  {selectedReport.format.map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setSelectedFormat(fmt)}
                      className={clsx(
                        'px-4 py-2 rounded-lg border transition-colors',
                        selectedFormat === fmt
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      {fmt.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleExport}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                <Download size={20} />
                <span>ดาวน์โหลด {selectedFormat.toUpperCase()}</span>
              </button>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">เลือกรายงานเพื่อดาวน์โหลด</p>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="card mt-6">
        <h2 className="text-lg font-semibold mb-4">สถิติภาพรวม</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'โครงการทั้งหมด', value: '45', color: 'bg-blue-100 text-blue-600' },
            { label: 'งบประมาณรวม', value: '25 ล้าน', color: 'bg-green-100 text-green-600' },
            { label: 'เบิกจ่ายแล้ว', value: '12 ล้าน', color: 'bg-yellow-100 text-yellow-600' },
            { label: 'รอดำเนินการ', value: '15', color: 'bg-purple-100 text-purple-600' },
          ].map((stat) => (
            <div key={stat.label} className={clsx('p-4 rounded-lg text-center', stat.color)}>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
