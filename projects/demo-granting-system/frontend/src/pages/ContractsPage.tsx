import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';
import { Plus, CheckCircle, PenTool, FileSignature, Calendar, Banknote } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuthStore } from '../hooks/useAuthStore';
import { PageHeader } from '../components/Breadcrumbs';
import { Badge, Button, SkeletonList, EmptyState, SearchInput, ConfirmDialog } from '../components/ui';
import { useToast } from '../components/ui/Toast';
import ContractForm from '../components/contracts/ContractForm';

interface Contract {
  id: number;
  contractNumber: string;
  proposalId: number;
  projectName?: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  status: string;
  signatures: { signedBy: string; signedAt: string; role: string }[];
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'warning' | 'success' | 'info' | 'purple' }> = {
  draft: { label: 'ร่าง', variant: 'default' },
  pending_signature: { label: 'รอลงนาม', variant: 'warning' },
  signed: { label: 'ลงนามแล้ว', variant: 'success' },
  active: { label: 'ดำเนินการ', variant: 'info' },
  completed: { label: 'เสร็จสิ้น', variant: 'purple' },
};

export default function ContractsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const toast = useToast();

  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSignConfirm, setShowSignConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['contracts'],
    queryFn: async () => {
      const { data } = await api.get('/contracts');
      return data;
    },
  });

  const signMutation = useMutation({
    mutationFn: async (contractId: number) => {
      const { data } = await api.post(`/contracts/${contractId}/sign`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast.success('ลงนามสำเร็จ', 'ลายเซ็นของคุณถูกบันทึกแล้ว');
      setShowSignConfirm(false);
    },
    onError: () => {
      toast.error('เกิดข้อผิดพลาด', 'ไม่สามารถลงนามได้ กรุณาลองใหม่');
    },
  });

  const canSign = user?.role === 'contract_center' || user?.role === 'partner';
  const canCreate = user?.role === 'contract_center';

  // Filter contracts by search
  const filteredContracts = data?.contracts?.filter((contract: Contract) =>
    contract.contractNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.projectName?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div>
      <PageHeader
        title="สัญญา"
        subtitle="จัดการสัญญาและการลงนาม"
        action={
          canCreate && (
            <Button
              icon={<Plus size={20} />}
              onClick={() => setShowCreateForm(true)}
            >
              สร้างสัญญาใหม่
            </Button>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contracts List */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">รายการสัญญา</h2>
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="ค้นหาเลขสัญญา..."
                className="w-64"
                size="sm"
              />
            </div>

            {isLoading ? (
              <SkeletonList items={4} />
            ) : filteredContracts.length === 0 ? (
              <EmptyState
                type="inbox"
                title="ไม่มีสัญญา"
                description={searchQuery ? 'ไม่พบสัญญาที่ตรงกับการค้นหา' : 'ยังไม่มีสัญญาในระบบ'}
                action={canCreate && !searchQuery ? {
                  label: 'สร้างสัญญาใหม่',
                  onClick: () => setShowCreateForm(true),
                } : undefined}
              />
            ) : (
              <div className="space-y-3">
                {filteredContracts.map((contract: Contract) => {
                  const status = statusConfig[contract.status] || statusConfig.draft;
                  const isSelected = selectedContract?.id === contract.id;

                  return (
                    <button
                      key={contract.id}
                      onClick={() => setSelectedContract(contract)}
                      className={clsx(
                        'w-full text-left p-4 rounded-xl border-2 transition-all',
                        isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-sm'
                          : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={clsx(
                            'p-2 rounded-lg',
                            isSelected ? 'bg-blue-100' : 'bg-gray-100'
                          )}>
                            <FileSignature size={20} className={isSelected ? 'text-blue-600' : 'text-gray-500'} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{contract.contractNumber}</p>
                            {contract.projectName && (
                              <p className="text-sm text-gray-500 mt-0.5">{contract.projectName}</p>
                            )}
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <Calendar size={12} />
                                {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Banknote size={12} />
                                {new Intl.NumberFormat('th-TH').format(contract.totalBudget)} บาท
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Contract Detail */}
        <div className="card h-fit sticky top-6">
          <h2 className="text-lg font-semibold mb-4">รายละเอียดสัญญา</h2>

          {selectedContract ? (
            <div className="space-y-4">
              {/* Contract Number */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <p className="text-xs text-blue-600 font-medium">เลขที่สัญญา</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{selectedContract.contractNumber}</p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">วันเริ่มต้น</p>
                  <p className="font-medium text-sm mt-1">{formatDate(selectedContract.startDate)}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">วันสิ้นสุด</p>
                  <p className="font-medium text-sm mt-1">{formatDate(selectedContract.endDate)}</p>
                </div>
              </div>

              {/* Budget */}
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <p className="text-xs text-green-600 font-medium">งบประมาณ</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {new Intl.NumberFormat('th-TH').format(selectedContract.totalBudget)}
                  <span className="text-sm font-normal text-gray-500 ml-1">บาท</span>
                </p>
              </div>

              {/* Signatures */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">ลายเซ็น</p>
                <div className="space-y-2">
                  {selectedContract.signatures?.length > 0 ? (
                    selectedContract.signatures.map((sig, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                        <CheckCircle size={18} className="text-green-500" />
                        <div>
                          <p className="font-medium text-sm text-gray-900">{sig.signedBy}</p>
                          <p className="text-xs text-gray-500">{sig.role}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <p className="text-sm text-gray-500">ยังไม่มีลายเซ็น</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sign Button */}
              {canSign && selectedContract.status !== 'signed' && selectedContract.status !== 'completed' && (
                <Button
                  variant="primary"
                  icon={<PenTool size={20} />}
                  onClick={() => setShowSignConfirm(true)}
                  className="w-full"
                >
                  ลงนามอิเล็กทรอนิกส์
                </Button>
              )}
            </div>
          ) : (
            <div className="py-12 text-center">
              <FileSignature size={48} className="mx-auto text-gray-200 mb-3" />
              <p className="text-gray-500">เลือกสัญญาเพื่อดูรายละเอียด</p>
            </div>
          )}
        </div>
      </div>

      {/* Contract Creation Form */}
      <ContractForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSuccess={() => {
          toast.success('สร้างสัญญาสำเร็จ', 'สัญญาใหม่ถูกสร้างเรียบร้อยแล้ว');
        }}
      />

      {/* Sign Confirmation */}
      <ConfirmDialog
        isOpen={showSignConfirm}
        onClose={() => setShowSignConfirm(false)}
        onConfirm={() => selectedContract && signMutation.mutate(selectedContract.id)}
        type="success"
        title="ยืนยันการลงนาม"
        message={`คุณต้องการลงนามในสัญญา ${selectedContract?.contractNumber} ใช่หรือไม่?`}
        confirmText="ลงนาม"
        loading={signMutation.isPending}
      />
    </div>
  );
}
