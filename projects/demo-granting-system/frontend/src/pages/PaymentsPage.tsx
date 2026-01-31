import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';
import { Wallet, CheckCircle, Clock, Send } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuthStore } from '../hooks/useAuthStore';

interface Payment {
  id: number;
  contractId: number;
  installmentNumber: number;
  amount: number;
  description: string;
  status: string;
  requestedAt: string;
  approvedAt?: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'รออนุมัติ', color: 'bg-yellow-100 text-yellow-600' },
  reviewing: { label: 'กำลังตรวจสอบ', color: 'bg-blue-100 text-blue-600' },
  approved: { label: 'อนุมัติแล้ว', color: 'bg-green-100 text-green-600' },
  paid: { label: 'จ่ายแล้ว', color: 'bg-purple-100 text-purple-600' },
  rejected: { label: 'ไม่อนุมัติ', color: 'bg-red-100 text-red-600' },
};

export default function PaymentsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    contractId: '',
    installmentNumber: '1',
    amount: '',
    description: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data } = await api.get('/payments');
      return data;
    },
  });

  const requestMutation = useMutation({
    mutationFn: async (data: any) => {
      const { data: result } = await api.post('/payments/request', data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      setShowForm(false);
      setForm({ contractId: '', installmentNumber: '1', amount: '', description: '' });
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (paymentId: number) => {
      const { data } = await api.post(`/payments/${paymentId}/approve`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });

  const canRequest = user?.role === 'partner';
  const canApprove = user?.role === 'approver';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestMutation.mutate({
      contractId: parseInt(form.contractId),
      installmentNumber: parseInt(form.installmentNumber),
      amount: parseFloat(form.amount),
      description: form.description,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">เบิกจ่าย</h1>
        {canRequest && (
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary flex items-center gap-2">
            <Send size={20} />
            <span>ขอเบิกเงิน</span>
          </button>
        )}
      </div>

      {/* Request Form */}
      {showForm && (
        <div className="card mb-6">
          <h2 className="text-lg font-semibold mb-4">แบบฟอร์มขอเบิกเงิน</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">เลขที่สัญญา (Contract ID)</label>
              <input
                type="number"
                className="input"
                value={form.contractId}
                onChange={(e) => setForm({ ...form, contractId: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">งวดที่</label>
              <input
                type="number"
                className="input"
                value={form.installmentNumber}
                onChange={(e) => setForm({ ...form, installmentNumber: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">จำนวนเงิน (บาท)</label>
              <input
                type="number"
                className="input"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">รายละเอียด</label>
              <input
                type="text"
                className="input"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="col-span-2 flex gap-3">
              <button type="submit" disabled={requestMutation.isPending} className="btn btn-primary">
                {requestMutation.isPending ? 'กำลังส่ง...' : 'ส่งคำขอ'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payments List */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">รายการเบิกจ่าย</h2>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : data?.payments?.length === 0 ? (
          <p className="text-gray-500 text-center py-8">ไม่มีรายการเบิกจ่าย</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">งวดที่</th>
                <th className="text-left py-3 px-4">จำนวนเงิน</th>
                <th className="text-left py-3 px-4">รายละเอียด</th>
                <th className="text-left py-3 px-4">สถานะ</th>
                <th className="text-left py-3 px-4">วันที่ขอ</th>
                {canApprove && <th className="text-left py-3 px-4">การดำเนินการ</th>}
              </tr>
            </thead>
            <tbody>
              {data?.payments?.map((payment: Payment) => {
                const status = statusConfig[payment.status] || statusConfig.pending;
                return (
                  <tr key={payment.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">{payment.installmentNumber}</td>
                    <td className="py-3 px-4">
                      {new Intl.NumberFormat('th-TH').format(payment.amount)} บาท
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{payment.description}</td>
                    <td className="py-3 px-4">
                      <span className={clsx('px-2 py-1 rounded-full text-xs', status.color)}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(payment.requestedAt).toLocaleDateString('th-TH')}
                    </td>
                    {canApprove && (
                      <td className="py-3 px-4">
                        {payment.status === 'pending' && (
                          <button
                            onClick={() => approveMutation.mutate(payment.id)}
                            disabled={approveMutation.isPending}
                            className="btn btn-primary text-xs py-1 px-3"
                          >
                            อนุมัติ
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
