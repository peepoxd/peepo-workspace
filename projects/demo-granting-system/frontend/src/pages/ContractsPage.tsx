import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';
import { FileSignature, CheckCircle, Clock, PenTool } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuthStore } from '../hooks/useAuthStore';

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

const statusConfig: Record<string, { label: string; color: string }> = {
  draft: { label: 'ร่าง', color: 'bg-gray-100 text-gray-600' },
  pending_signature: { label: 'รอลงนาม', color: 'bg-yellow-100 text-yellow-600' },
  signed: { label: 'ลงนามแล้ว', color: 'bg-green-100 text-green-600' },
  active: { label: 'ดำเนินการ', color: 'bg-blue-100 text-blue-600' },
  completed: { label: 'เสร็จสิ้น', color: 'bg-purple-100 text-purple-600' },
};

export default function ContractsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

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
    },
  });

  const canSign = user?.role === 'contract_center' || user?.role === 'partner';

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">สัญญา</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contracts List */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">รายการสัญญา</h2>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : data?.contracts?.length === 0 ? (
              <p className="text-gray-500 text-center py-8">ไม่มีสัญญา</p>
            ) : (
              <div className="space-y-3">
                {data?.contracts?.map((contract: Contract) => {
                  const status = statusConfig[contract.status] || statusConfig.draft;
                  return (
                    <button
                      key={contract.id}
                      onClick={() => setSelectedContract(contract)}
                      className={clsx(
                        'w-full text-left p-4 rounded-lg border transition-colors',
                        selectedContract?.id === contract.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{contract.contractNumber}</p>
                          <p className="text-sm text-gray-500">
                            {new Intl.NumberFormat('th-TH').format(contract.totalBudget)} บาท
                          </p>
                        </div>
                        <span className={clsx('px-2 py-1 rounded-full text-xs', status.color)}>
                          {status.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Contract Detail */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">รายละเอียดสัญญา</h2>
          {selectedContract ? (
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">เลขที่สัญญา</p>
                <p className="font-semibold">{selectedContract.contractNumber}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">วันเริ่ม</p>
                  <p className="font-medium text-sm">{selectedContract.startDate}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">วันสิ้นสุด</p>
                  <p className="font-medium text-sm">{selectedContract.endDate}</p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">งบประมาณ</p>
                <p className="font-semibold text-lg text-blue-600">
                  {new Intl.NumberFormat('th-TH').format(selectedContract.totalBudget)} บาท
                </p>
              </div>

              {/* Signatures */}
              <div>
                <p className="text-sm font-medium mb-2">ลายเซ็น</p>
                <div className="space-y-2">
                  {selectedContract.signatures?.length > 0 ? (
                    selectedContract.signatures.map((sig, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle size={16} className="text-green-500" />
                        <span>{sig.signedBy}</span>
                        <span className="text-gray-400">({sig.role})</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">ยังไม่มีลายเซ็น</p>
                  )}
                </div>
              </div>

              {canSign && selectedContract.status !== 'signed' && (
                <button
                  onClick={() => signMutation.mutate(selectedContract.id)}
                  disabled={signMutation.isPending}
                  className="btn btn-primary w-full flex items-center justify-center gap-2"
                >
                  <PenTool size={20} />
                  <span>{signMutation.isPending ? 'กำลังลงนาม...' : 'ลงนามอิเล็กทรอนิกส์'}</span>
                </button>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">เลือกสัญญาเพื่อดูรายละเอียด</p>
          )}
        </div>
      </div>
    </div>
  );
}
