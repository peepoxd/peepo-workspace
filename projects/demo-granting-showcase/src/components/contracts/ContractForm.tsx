import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { X, Plus, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';

interface Installment {
  number: number;
  percentage: number;
  description: string;
}

interface ContractFormData {
  proposalId: number;
  startDate: string;
  endDate: string;
  installments: Installment[];
}

interface ContractFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ContractForm({ isOpen, onClose, onSuccess }: ContractFormProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ContractFormData>({
    proposalId: 0,
    startDate: '',
    endDate: '',
    installments: [
      { number: 1, percentage: 30, description: 'งวดแรก - เริ่มโครงการ' },
      { number: 2, percentage: 40, description: 'งวดที่ 2 - กลางโครงการ' },
      { number: 3, percentage: 30, description: 'งวดสุดท้าย - ปิดโครงการ' },
    ],
  });

  // Fetch approved proposals
  const { data: proposals } = useQuery({
    queryKey: ['approved-proposals'],
    queryFn: async () => {
      const { data } = await api.get('/proposals');
      return data.proposals?.filter((p: any) => p.status === 'approved') || [];
    },
    enabled: isOpen,
  });

  const createMutation = useMutation({
    mutationFn: async (data: ContractFormData) => {
      const { data: result } = await api.post('/contracts', data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      onSuccess?.();
      onClose();
      resetForm();
    },
  });

  const resetForm = () => {
    setForm({
      proposalId: 0,
      startDate: '',
      endDate: '',
      installments: [
        { number: 1, percentage: 30, description: 'งวดแรก - เริ่มโครงการ' },
        { number: 2, percentage: 40, description: 'งวดที่ 2 - กลางโครงการ' },
        { number: 3, percentage: 30, description: 'งวดสุดท้าย - ปิดโครงการ' },
      ],
    });
  };

  const addInstallment = () => {
    const newNumber = form.installments.length + 1;
    setForm({
      ...form,
      installments: [
        ...form.installments,
        { number: newNumber, percentage: 0, description: `งวดที่ ${newNumber}` },
      ],
    });
  };

  const removeInstallment = (index: number) => {
    const updated = form.installments.filter((_, i) => i !== index);
    // Re-number installments
    updated.forEach((inst, i) => {
      inst.number = i + 1;
    });
    setForm({ ...form, installments: updated });
  };

  const updateInstallment = (index: number, field: keyof Installment, value: any) => {
    const updated = [...form.installments];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, installments: updated });
  };

  const totalPercentage = form.installments.reduce((sum, i) => sum + i.percentage, 0);
  const isValidPercentage = totalPercentage === 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPercentage) return;
    createMutation.mutate(form);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl z-50 animate-slideIn">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">สร้างสัญญาใหม่</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Proposal Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                เลือกโครงการที่อนุมัติแล้ว <span className="text-red-500">*</span>
              </label>
              <select
                value={form.proposalId}
                onChange={(e) => setForm({ ...form, proposalId: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value={0}>-- เลือกโครงการ --</option>
                {proposals?.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.projectName} ({new Intl.NumberFormat('th-TH').format(p.budget)} บาท)
                  </option>
                ))}
              </select>
              {proposals?.length === 0 && (
                <p className="mt-1 text-sm text-yellow-600">ไม่มีโครงการที่อนุมัติแล้วพร้อมสร้างสัญญา</p>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  วันเริ่มสัญญา <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  วันสิ้นสุดสัญญา <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  min={form.startDate}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Installments */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  งวดการเบิกจ่าย
                </label>
                <div className="flex items-center gap-2">
                  <span
                    className={clsx(
                      'text-sm font-medium',
                      isValidPercentage ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    รวม: {totalPercentage}%
                  </span>
                  <button
                    type="button"
                    onClick={addInstallment}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {form.installments.map((installment, index) => (
                  <div
                    key={index}
                    className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-16 text-center">
                      <span className="text-xs text-gray-500">งวดที่</span>
                      <p className="font-semibold">{installment.number}</p>
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        placeholder="รายละเอียด"
                        value={installment.description}
                        onChange={(e) => updateInstallment(index, 'description', e.target.value)}
                        className="w-full px-3 py-1.5 rounded border border-gray-300 text-sm"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={installment.percentage}
                          onChange={(e) =>
                            updateInstallment(index, 'percentage', parseInt(e.target.value) || 0)
                          }
                          className="w-20 px-3 py-1.5 rounded border border-gray-300 text-sm"
                        />
                        <span className="text-sm text-gray-500">%</span>
                      </div>
                    </div>
                    {form.installments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInstallment(index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {!isValidPercentage && (
                <p className="mt-2 text-sm text-red-600">
                  ผลรวมเปอร์เซ็นต์ต้องเท่ากับ 100% (ปัจจุบัน: {totalPercentage}%)
                </p>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="flex gap-3 px-6 py-4 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 font-medium hover:bg-gray-100"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSubmit}
              disabled={createMutation.isPending || !isValidPercentage || form.proposalId === 0}
              className={clsx(
                'flex-1 px-4 py-2.5 rounded-lg font-medium text-white',
                'bg-blue-600 hover:bg-blue-700',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {createMutation.isPending ? 'กำลังสร้าง...' : 'สร้างสัญญา'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
