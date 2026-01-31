import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';
import { ClipboardCheck, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface Proposal {
  id: number;
  projectName: string;
  budget: number;
  status: string;
  createdAt: string;
}

interface ScreeningForm {
  proposalId: number;
  eligibilityCheck: boolean;
  documentComplete: boolean;
  budgetReasonable: boolean;
  comments: string;
  recommendation: 'pass' | 'revise' | 'reject';
}

export default function ScreeningPage() {
  const queryClient = useQueryClient();
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
      return data.proposals.filter((p: Proposal) => p.status === 'submitted');
    },
  });

  const screeningMutation = useMutation({
    mutationFn: async (data: ScreeningForm) => {
      const { data: result } = await api.post('/screening', data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals-for-screening'] });
      setSelectedProposal(null);
      setForm({
        proposalId: 0,
        eligibilityCheck: false,
        documentComplete: false,
        budgetReasonable: false,
        comments: '',
        recommendation: 'pass',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProposal) {
      screeningMutation.mutate({ ...form, proposalId: selectedProposal.id });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">คัดกรองข้อเสนอ</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Proposals List */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">ข้อเสนอรอคัดกรอง</h2>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : proposals?.length === 0 ? (
            <p className="text-gray-500 text-center py-8">ไม่มีข้อเสนอรอคัดกรอง</p>
          ) : (
            <div className="space-y-3">
              {proposals?.map((proposal: Proposal) => (
                <button
                  key={proposal.id}
                  onClick={() => setSelectedProposal(proposal)}
                  className={clsx(
                    'w-full text-left p-4 rounded-lg border transition-colors',
                    selectedProposal?.id === proposal.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <p className="font-medium">{proposal.projectName}</p>
                  <p className="text-sm text-gray-500">
                    งบประมาณ: {new Intl.NumberFormat('th-TH').format(proposal.budget)} บาท
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Screening Form */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">แบบฟอร์มคัดกรอง</h2>
          {selectedProposal ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{selectedProposal.projectName}</p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.eligibilityCheck}
                    onChange={(e) => setForm({ ...form, eligibilityCheck: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                  <span>ผ่านเกณฑ์คุณสมบัติ</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.documentComplete}
                    onChange={(e) => setForm({ ...form, documentComplete: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                  <span>เอกสารครบถ้วน</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.budgetReasonable}
                    onChange={(e) => setForm({ ...form, budgetReasonable: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                  <span>งบประมาณเหมาะสม</span>
                </label>
              </div>

              <div>
                <label className="label">ความเห็น</label>
                <textarea
                  className="input min-h-24"
                  value={form.comments}
                  onChange={(e) => setForm({ ...form, comments: e.target.value })}
                  placeholder="ระบุความเห็นเพิ่มเติม..."
                />
              </div>

              <div>
                <label className="label">ผลการคัดกรอง</label>
                <div className="flex gap-3">
                  {[
                    { value: 'pass', label: 'ผ่าน', icon: CheckCircle, color: 'text-green-600' },
                    { value: 'revise', label: 'แก้ไข', icon: AlertCircle, color: 'text-yellow-600' },
                    { value: 'reject', label: 'ไม่ผ่าน', icon: XCircle, color: 'text-red-600' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={clsx(
                        'flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer',
                        form.recommendation === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
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
                      <option.icon size={18} className={option.color} />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={screeningMutation.isPending}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                <ClipboardCheck size={20} />
                <span>{screeningMutation.isPending ? 'กำลังบันทึก...' : 'บันทึกผลคัดกรอง'}</span>
              </button>
            </form>
          ) : (
            <p className="text-gray-500 text-center py-8">เลือกข้อเสนอเพื่อเริ่มคัดกรอง</p>
          )}
        </div>
      </div>
    </div>
  );
}
