import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';
import { ClipboardCheck, CheckCircle, XCircle, AlertCircle, History } from 'lucide-react';
import { clsx } from 'clsx';
import { PageHeader } from '../components/Breadcrumbs';
import { Button, Badge, Tabs, TabPanel, SkeletonList, EmptyState } from '../components/ui';
import { useToast } from '../components/ui/Toast';
import ScreeningHistory from '../components/screening/ScreeningHistory';

interface Proposal {
  id: number;
  projectName: string;
  budget: number;
  status: string;
  createdAt: string;
  description?: string;
  duration?: number;
}

interface ScreeningForm {
  proposalId: number;
  eligibilityCheck: boolean;
  documentComplete: boolean;
  budgetReasonable: boolean;
  comments: string;
  recommendation: 'pass' | 'revise' | 'reject';
}

const tabs = [
  { id: 'screening', label: 'คัดกรองใหม่', icon: <ClipboardCheck size={16} /> },
  { id: 'history', label: 'ประวัติ', icon: <History size={16} /> },
];

export default function ScreeningPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [form, setForm] = useState<ScreeningForm>({
    proposalId: 0,
    eligibilityCheck: false,
    documentComplete: false,
    budgetReasonable: false,
    comments: '',
    recommendation: 'pass',
  });

  const { data: proposals, isLoading } = useQuery({
    queryKey: ['proposals-for-screening'],
    queryFn: async () => {
      const { data } = await api.get('/proposals');
      return data.proposals?.filter((p: Proposal) => p.status === 'submitted') || [];
    },
  });

  const screeningMutation = useMutation({
    mutationFn: async (data: ScreeningForm) => {
      const { data: result } = await api.post('/screening', data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals-for-screening'] });
      queryClient.invalidateQueries({ queryKey: ['screening-history'] });
      toast.success('บันทึกสำเร็จ', 'ผลการคัดกรองถูกบันทึกแล้ว');
      setSelectedProposal(null);
      resetForm();
    },
    onError: () => {
      toast.error('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกผลคัดกรองได้');
    },
  });

  const resetForm = () => {
    setForm({
      proposalId: 0,
      eligibilityCheck: false,
      documentComplete: false,
      budgetReasonable: false,
      comments: '',
      recommendation: 'pass',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProposal) {
      screeningMutation.mutate({ ...form, proposalId: selectedProposal.id });
    }
  };

  const allChecked = form.eligibilityCheck && form.documentComplete && form.budgetReasonable;

  return (
    <div>
      <PageHeader
        title="คัดกรองข้อเสนอ"
        subtitle="ตรวจสอบคุณสมบัติและเอกสารข้อเสนอโครงการ"
      />

      <Tabs tabs={tabs} defaultTab="screening" variant="pills">
        {/* Screening Tab */}
        <TabPanel id="screening">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Proposals List */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">ข้อเสนอรอคัดกรอง</h2>
                <Badge variant="warning">{proposals?.length || 0} รายการ</Badge>
              </div>

              {isLoading ? (
                <SkeletonList items={4} />
              ) : proposals?.length === 0 ? (
                <EmptyState
                  type="inbox"
                  title="ไม่มีข้อเสนอรอคัดกรอง"
                  description="ข้อเสนอใหม่จะปรากฏที่นี่เมื่อมีการยื่นเข้ามา"
                />
              ) : (
                <div className="space-y-3">
                  {proposals?.map((proposal: Proposal) => (
                    <button
                      key={proposal.id}
                      onClick={() => {
                        setSelectedProposal(proposal);
                        resetForm();
                      }}
                      className={clsx(
                        'w-full text-left p-4 rounded-xl border-2 transition-all',
                        selectedProposal?.id === proposal.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                      )}
                    >
                      <p className="font-semibold text-gray-900">{proposal.projectName}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>
                          งบประมาณ: {new Intl.NumberFormat('th-TH').format(proposal.budget)} บาท
                        </span>
                        {proposal.duration && <span>{proposal.duration} เดือน</span>}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Screening Form */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">แบบฟอร์มคัดกรอง</h2>

              {selectedProposal ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Selected Proposal Info */}
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <p className="font-semibold text-gray-900">{selectedProposal.projectName}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      งบประมาณ: {new Intl.NumberFormat('th-TH').format(selectedProposal.budget)} บาท
                    </p>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">รายการตรวจสอบ</p>

                    {[
                      { key: 'eligibilityCheck', label: 'ผ่านเกณฑ์คุณสมบัติ', desc: 'ตรงตามเงื่อนไขการยื่นขอทุน' },
                      { key: 'documentComplete', label: 'เอกสารครบถ้วน', desc: 'เอกสารประกอบครบตามที่กำหนด' },
                      { key: 'budgetReasonable', label: 'งบประมาณเหมาะสม', desc: 'รายละเอียดงบประมาณสมเหตุสมผล' },
                    ].map((item) => (
                      <label
                        key={item.key}
                        className={clsx(
                          'flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all',
                          form[item.key as keyof typeof form]
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-100 hover:border-gray-200'
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={form[item.key as keyof typeof form] as boolean}
                          onChange={(e) => setForm({ ...form, [item.key]: e.target.checked })}
                          className="w-5 h-5 mt-0.5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <div>
                          <span className="font-medium text-gray-900">{item.label}</span>
                          <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Comments */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ความเห็น</label>
                    <textarea
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-24"
                      value={form.comments}
                      onChange={(e) => setForm({ ...form, comments: e.target.value })}
                      placeholder="ระบุความเห็นเพิ่มเติม..."
                    />
                  </div>

                  {/* Recommendation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ผลการคัดกรอง</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'pass', label: 'ผ่าน', icon: CheckCircle, color: 'green', disabled: !allChecked },
                        { value: 'revise', label: 'แก้ไข', icon: AlertCircle, color: 'yellow', disabled: false },
                        { value: 'reject', label: 'ไม่ผ่าน', icon: XCircle, color: 'red', disabled: false },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={clsx(
                            'flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all',
                            form.recommendation === option.value
                              ? `border-${option.color}-500 bg-${option.color}-50`
                              : 'border-gray-100 hover:border-gray-200',
                            option.disabled && form.recommendation === 'pass' && 'opacity-50'
                          )}
                        >
                          <input
                            type="radio"
                            name="recommendation"
                            value={option.value}
                            checked={form.recommendation === option.value}
                            onChange={(e) => setForm({ ...form, recommendation: e.target.value as any })}
                            className="sr-only"
                          />
                          <option.icon
                            size={24}
                            className={clsx(
                              option.color === 'green' && 'text-green-500',
                              option.color === 'yellow' && 'text-yellow-500',
                              option.color === 'red' && 'text-red-500'
                            )}
                          />
                          <span className="font-medium">{option.label}</span>
                        </label>
                      ))}
                    </div>
                    {form.recommendation === 'pass' && !allChecked && (
                      <p className="text-sm text-yellow-600 mt-2">
                        * ต้องผ่านการตรวจสอบทุกรายการก่อนจึงจะเลือก "ผ่าน" ได้
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    loading={screeningMutation.isPending}
                    disabled={form.recommendation === 'pass' && !allChecked}
                    icon={<ClipboardCheck size={20} />}
                    className="w-full"
                  >
                    บันทึกผลคัดกรอง
                  </Button>
                </form>
              ) : (
                <div className="py-12 text-center">
                  <ClipboardCheck size={48} className="mx-auto text-gray-200 mb-3" />
                  <p className="text-gray-500">เลือกข้อเสนอเพื่อเริ่มคัดกรอง</p>
                </div>
              )}
            </div>
          </div>
        </TabPanel>

        {/* History Tab */}
        <TabPanel id="history">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">ประวัติการคัดกรอง</h2>
            <ScreeningHistory />
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
}
