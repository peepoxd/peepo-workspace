import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';
import { CheckCircle, XCircle, FileText, DollarSign } from 'lucide-react';
import { clsx } from 'clsx';

interface Proposal {
  id: number;
  projectName: string;
  description: string;
  budget: number;
  duration: number;
  objectives: string[];
  status: string;
}

export default function ApprovalPage() {
  const queryClient = useQueryClient();
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [decision, setDecision] = useState<'approved' | 'conditionally_approved' | 'rejected'>('approved');
  const [budgetApproved, setBudgetApproved] = useState('');
  const [conditions, setConditions] = useState('');
  const [comments, setComments] = useState('');

  const { data: proposals, isLoading } = useQuery({
    queryKey: ['proposals-for-approval'],
    queryFn: async () => {
      const { data } = await api.get('/proposals');
      return data.proposals.filter((p: Proposal) => p.status === 'screening');
    },
  });

  const approvalMutation = useMutation({
    mutationFn: async (data: any) => {
      const { data: result } = await api.post('/approval', data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals-for-approval'] });
      setSelectedProposal(null);
      resetForm();
    },
  });

  const resetForm = () => {
    setDecision('approved');
    setBudgetApproved('');
    setConditions('');
    setComments('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProposal) {
      approvalMutation.mutate({
        proposalId: selectedProposal.id,
        decision,
        budgetApproved: budgetApproved ? parseFloat(budgetApproved) : selectedProposal.budget,
        conditions: conditions ? conditions.split('\n').filter(Boolean) : [],
        comments,
      });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">อนุมัติโครงการ</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Proposals List */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">รอพิจารณา</h2>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : proposals?.length === 0 ? (
            <p className="text-gray-500 text-center py-8">ไม่มีข้อเสนอรอพิจารณา</p>
          ) : (
            <div className="space-y-2">
              {proposals?.map((proposal: Proposal) => (
                <button
                  key={proposal.id}
                  onClick={() => {
                    setSelectedProposal(proposal);
                    setBudgetApproved(proposal.budget.toString());
                  }}
                  className={clsx(
                    'w-full text-left p-3 rounded-lg border transition-colors',
                    selectedProposal?.id === proposal.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <p className="font-medium text-sm">{proposal.projectName}</p>
                  <p className="text-xs text-gray-500">
                    {new Intl.NumberFormat('th-TH').format(proposal.budget)} บาท
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Proposal Detail */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">รายละเอียด</h2>
          {selectedProposal ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg">{selectedProposal.projectName}</h3>
                <p className="text-gray-600 text-sm mt-2">{selectedProposal.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">งบประมาณ</p>
                  <p className="font-semibold">
                    {new Intl.NumberFormat('th-TH').format(selectedProposal.budget)} บาท
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">ระยะเวลา</p>
                  <p className="font-semibold">{selectedProposal.duration} เดือน</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">วัตถุประสงค์</p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {selectedProposal.objectives?.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">เลือกข้อเสนอเพื่อดูรายละเอียด</p>
          )}
        </div>

        {/* Approval Form */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">พิจารณาอนุมัติ</h2>
          {selectedProposal ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">ผลการพิจารณา</label>
                <select
                  className="input"
                  value={decision}
                  onChange={(e) => setDecision(e.target.value as any)}
                >
                  <option value="approved">อนุมัติ</option>
                  <option value="conditionally_approved">อนุมัติแบบมีเงื่อนไข</option>
                  <option value="rejected">ไม่อนุมัติ</option>
                </select>
              </div>

              <div>
                <label className="label">งบประมาณที่อนุมัติ</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="number"
                    className="input pl-10"
                    value={budgetApproved}
                    onChange={(e) => setBudgetApproved(e.target.value)}
                  />
                </div>
              </div>

              {decision === 'conditionally_approved' && (
                <div>
                  <label className="label">เงื่อนไข (บรรทัดละข้อ)</label>
                  <textarea
                    className="input min-h-24"
                    value={conditions}
                    onChange={(e) => setConditions(e.target.value)}
                    placeholder="เงื่อนไขที่ 1&#10;เงื่อนไขที่ 2"
                  />
                </div>
              )}

              <div>
                <label className="label">ความเห็นเพิ่มเติม</label>
                <textarea
                  className="input min-h-20"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={approvalMutation.isPending}
                className={clsx(
                  'btn w-full flex items-center justify-center gap-2',
                  decision === 'rejected' ? 'btn-danger' : 'btn-primary'
                )}
              >
                {decision === 'rejected' ? <XCircle size={20} /> : <CheckCircle size={20} />}
                <span>{approvalMutation.isPending ? 'กำลังบันทึก...' : 'บันทึกผลพิจารณา'}</span>
              </button>
            </form>
          ) : (
            <p className="text-gray-500 text-center py-8">เลือกข้อเสนอเพื่อพิจารณา</p>
          )}
        </div>
      </div>
    </div>
  );
}
