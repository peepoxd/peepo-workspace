import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';
import { CheckCircle, XCircle, History, DollarSign, FileCheck } from 'lucide-react';
import { clsx } from 'clsx';
import { PageHeader } from '../components/Breadcrumbs';
import { Button, Badge, Tabs, TabPanel, SkeletonList, EmptyState } from '../components/ui';
import { useToast } from '../components/ui/Toast';
import ApprovalHistory from '../components/approval/ApprovalHistory';

interface Proposal {
  id: number;
  projectName: string;
  description: string;
  budget: number;
  duration: number;
  objectives: string[];
  status: string;
}

const tabs = [
  { id: 'approval', label: 'อนุมัติใหม่', icon: <FileCheck size={16} /> },
  { id: 'history', label: 'ประวัติ', icon: <History size={16} /> },
];

export default function ApprovalPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [decision, setDecision] = useState<'approved' | 'conditionally_approved' | 'rejected'>('approved');
  const [budgetApproved, setBudgetApproved] = useState('');
  const [conditions, setConditions] = useState('');
  const [comments, setComments] = useState('');

  const { data: proposals, isLoading } = useQuery({
    queryKey: ['proposals-for-approval'],
    queryFn: async () => {
      const { data } = await api.get('/proposals');
      return data.proposals?.filter((p: Proposal) => p.status === 'screening') || [];
    },
  });

  const approvalMutation = useMutation({
    mutationFn: async (data: any) => {
      const { data: result } = await api.post('/approval', data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals-for-approval'] });
      queryClient.invalidateQueries({ queryKey: ['approval-history'] });
      toast.success('บันทึกสำเร็จ', 'ผลการอนุมัติถูกบันทึกแล้ว');
      setSelectedProposal(null);
      resetForm();
    },
    onError: () => {
      toast.error('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกผลอนุมัติได้');
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
      <PageHeader
        title="อนุมัติโครงการ"
        subtitle="พิจารณาและอนุมัติข้อเสนอโครงการ"
      />

      <Tabs tabs={tabs} defaultTab="approval" variant="pills">
        {/* Approval Tab */}
        <TabPanel id="approval">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Proposals List */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">รอพิจารณา</h2>
                <Badge variant="info">{proposals?.length || 0} รายการ</Badge>
              </div>

              {isLoading ? (
                <SkeletonList items={4} />
              ) : proposals?.length === 0 ? (
                <EmptyState
                  type="inbox"
                  title="ไม่มีข้อเสนอรอพิจารณา"
                  description="ข้อเสนอที่ผ่านการคัดกรองจะปรากฏที่นี่"
                />
              ) : (
                <div className="space-y-2">
                  {proposals?.map((proposal: Proposal) => (
                    <button
                      key={proposal.id}
                      onClick={() => {
                        setSelectedProposal(proposal);
                        setBudgetApproved(proposal.budget.toString());
                        setConditions('');
                        setComments('');
                      }}
                      className={clsx(
                        'w-full text-left p-3 rounded-xl border-2 transition-all',
                        selectedProposal?.id === proposal.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                      )}
                    >
                      <p className="font-medium text-sm text-gray-900">{proposal.projectName}</p>
                      <p className="text-xs text-gray-500 mt-1">
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
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <h3 className="font-semibold text-gray-900">{selectedProposal.projectName}</h3>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">{selectedProposal.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">งบประมาณ</p>
                      <p className="font-semibold text-blue-600">
                        {new Intl.NumberFormat('th-TH').format(selectedProposal.budget)} บาท
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">ระยะเวลา</p>
                      <p className="font-semibold">{selectedProposal.duration} เดือน</p>
                    </div>
                  </div>

                  {selectedProposal.objectives?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">วัตถุประสงค์</p>
                      <ul className="space-y-1">
                        {selectedProposal.objectives.map((obj, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="text-blue-500 mt-1">•</span>
                            {obj}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <FileCheck size={48} className="mx-auto text-gray-200 mb-3" />
                  <p className="text-gray-500">เลือกข้อเสนอเพื่อดูรายละเอียด</p>
                </div>
              )}
            </div>

            {/* Approval Form */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">พิจารณาอนุมัติ</h2>

              {selectedProposal ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Decision */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ผลการพิจารณา</label>
                    <div className="space-y-2">
                      {[
                        { value: 'approved', label: 'อนุมัติ', icon: CheckCircle, color: 'green' },
                        { value: 'conditionally_approved', label: 'อนุมัติแบบมีเงื่อนไข', icon: CheckCircle, color: 'yellow' },
                        { value: 'rejected', label: 'ไม่อนุมัติ', icon: XCircle, color: 'red' },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={clsx(
                            'flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all',
                            decision === option.value
                              ? option.color === 'green' ? 'border-green-500 bg-green-50'
                              : option.color === 'yellow' ? 'border-yellow-500 bg-yellow-50'
                              : 'border-red-500 bg-red-50'
                              : 'border-gray-100 hover:border-gray-200'
                          )}
                        >
                          <input
                            type="radio"
                            name="decision"
                            value={option.value}
                            checked={decision === option.value}
                            onChange={(e) => setDecision(e.target.value as any)}
                            className="sr-only"
                          />
                          <option.icon
                            size={20}
                            className={clsx(
                              option.color === 'green' && 'text-green-500',
                              option.color === 'yellow' && 'text-yellow-500',
                              option.color === 'red' && 'text-red-500'
                            )}
                          />
                          <span className="font-medium text-sm">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Budget Approved */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">งบประมาณที่อนุมัติ</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="number"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        value={budgetApproved}
                        onChange={(e) => setBudgetApproved(e.target.value)}
                        placeholder="จำนวนเงิน"
                      />
                    </div>
                  </div>

                  {/* Conditions */}
                  {decision === 'conditionally_approved' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">เงื่อนไข (บรรทัดละข้อ)</label>
                      <textarea
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 min-h-24"
                        value={conditions}
                        onChange={(e) => setConditions(e.target.value)}
                        placeholder="เงื่อนไขที่ 1&#10;เงื่อนไขที่ 2"
                      />
                    </div>
                  )}

                  {/* Comments */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ความเห็นเพิ่มเติม</label>
                    <textarea
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 min-h-20"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                    />
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    variant={decision === 'rejected' ? 'danger' : 'primary'}
                    loading={approvalMutation.isPending}
                    icon={decision === 'rejected' ? <XCircle size={20} /> : <CheckCircle size={20} />}
                    className="w-full"
                  >
                    บันทึกผลพิจารณา
                  </Button>
                </form>
              ) : (
                <div className="py-12 text-center">
                  <FileCheck size={48} className="mx-auto text-gray-200 mb-3" />
                  <p className="text-gray-500">เลือกข้อเสนอเพื่อพิจารณา</p>
                </div>
              )}
            </div>
          </div>
        </TabPanel>

        {/* History Tab */}
        <TabPanel id="history">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">ประวัติการอนุมัติ</h2>
            <ApprovalHistory />
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
}
