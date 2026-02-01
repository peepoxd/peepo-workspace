import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { closureApi } from '../utils/api';
import { CheckCircle, FileText, Package, ClipboardList, Send, History } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuthStore } from '../hooks/useAuthStore';

interface Project {
  id: number;
  projectName: string;
  contractNumber: string;
  budget: number;
  status: string;
  endDate: string;
  paymentsCompleted: boolean;
  finalReportSubmitted: boolean;
  equipmentChecked: boolean;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: 'ดำเนินการ', color: 'bg-blue-100 text-blue-600' },
  pending_report: { label: 'รอรายงานสรุป', color: 'bg-yellow-100 text-yellow-600' },
  pending_check: { label: 'รอตรวจครุภัณฑ์', color: 'bg-orange-100 text-orange-600' },
  pending_approval: { label: 'รออนุมัติปิด', color: 'bg-purple-100 text-purple-600' },
  closed: { label: 'ปิดโครงการแล้ว', color: 'bg-green-100 text-green-600' },
};

export default function ClosurePage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [finalReport, setFinalReport] = useState('');
  const [equipmentNotes, setEquipmentNotes] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['projects-for-closure'],
    queryFn: closureApi.list,
  });

  // ภาคี - ส่งรายงานสรุป
  const submitReportMutation = useMutation({
    mutationFn: (projectId: number) => closureApi.submitFinalReport(projectId, { report: finalReport }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects-for-closure'] });
      setSelectedProject(null);
      setFinalReport('');
      alert('ส่งรายงานสรุปสำเร็จ');
    },
  });

  // นักวิชาการ - ตรวจครุภัณฑ์
  const checkEquipmentMutation = useMutation({
    mutationFn: (projectId: number) => closureApi.checkEquipment(projectId, { notes: equipmentNotes, passed: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects-for-closure'] });
      setSelectedProject(null);
      setEquipmentNotes('');
      alert('บันทึกผลตรวจครุภัณฑ์สำเร็จ');
    },
  });

  // ศูนย์สัญญา/กฎหมาย - อนุมัติปิด
  const approveClosureMutation = useMutation({
    mutationFn: (projectId: number) => closureApi.approveClosure(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects-for-closure'] });
      setSelectedProject(null);
      alert('อนุมัติปิดโครงการสำเร็จ');
    },
  });

  // RBAC Checks
  const canSubmitReport = user?.role === 'partner';
  const canCheckEquipment = user?.role === 'academic';
  const canApproveClosure = user?.role === 'contract_center' || user?.role === 'legal';

  const projects = data?.projects || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">ปิดโครงการ</h1>
          <p className="text-gray-500 text-sm mt-1">รายงานสรุป ตรวจครุภัณฑ์ และอนุมัติปิดโครงการ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">โครงการรอปิด</h2>
              <span className="text-sm text-gray-500">{projects.length} โครงการ</span>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : projects.length === 0 ? (
              <p className="text-gray-500 text-center py-8">ไม่มีโครงการรอปิด</p>
            ) : (
              <div className="space-y-3">
                {projects.map((project: Project) => {
                  const status = statusConfig[project.status] || statusConfig.active;
                  return (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className={clsx(
                        'w-full text-left p-4 rounded-xl border-2 transition-all',
                        selectedProject?.id === project.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{project.projectName}</p>
                          <p className="text-sm text-gray-500 mt-1">สัญญา: {project.contractNumber}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                            <span>งบประมาณ: {new Intl.NumberFormat('th-TH').format(project.budget)} บาท</span>
                            <span>สิ้นสุด: {new Date(project.endDate).toLocaleDateString('th-TH')}</span>
                          </div>
                        </div>
                        <span className={clsx('px-2 py-1 rounded-full text-xs', status.color)}>
                          {status.label}
                        </span>
                      </div>

                      {/* Checklist Progress */}
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                        <div className={clsx('flex items-center gap-1 text-xs', project.paymentsCompleted ? 'text-green-600' : 'text-gray-400')}>
                          <CheckCircle size={14} />
                          <span>เบิกจ่ายครบ</span>
                        </div>
                        <div className={clsx('flex items-center gap-1 text-xs', project.finalReportSubmitted ? 'text-green-600' : 'text-gray-400')}>
                          <FileText size={14} />
                          <span>รายงานสรุป</span>
                        </div>
                        <div className={clsx('flex items-center gap-1 text-xs', project.equipmentChecked ? 'text-green-600' : 'text-gray-400')}>
                          <Package size={14} />
                          <span>ตรวจครุภัณฑ์</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Action Panel */}
        <div className="card h-fit sticky top-6">
          <h2 className="text-lg font-semibold mb-4">ดำเนินการ</h2>

          {selectedProject ? (
            <div className="space-y-4">
              {/* Project Info */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <p className="font-semibold text-gray-900">{selectedProject.projectName}</p>
                <p className="text-sm text-gray-500 mt-1">{selectedProject.contractNumber}</p>
              </div>

              {/* Partner: Submit Final Report */}
              {canSubmitReport && !selectedProject.finalReportSubmitted && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <ClipboardList size={18} />
                    <span>ส่งรายงานสรุปโครงการ</span>
                  </div>
                  <textarea
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 min-h-32"
                    value={finalReport}
                    onChange={(e) => setFinalReport(e.target.value)}
                    placeholder="สรุปผลการดำเนินงาน ปัญหาอุปสรรค ข้อเสนอแนะ..."
                  />
                  <button
                    onClick={() => submitReportMutation.mutate(selectedProject.id)}
                    disabled={!finalReport || submitReportMutation.isPending}
                    className="btn btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <Send size={18} />
                    <span>{submitReportMutation.isPending ? 'กำลังส่ง...' : 'ส่งรายงานสรุป'}</span>
                  </button>
                </div>
              )}

              {/* Academic: Check Equipment */}
              {canCheckEquipment && selectedProject.finalReportSubmitted && !selectedProject.equipmentChecked && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Package size={18} />
                    <span>ตรวจสอบครุภัณฑ์</span>
                  </div>
                  <textarea
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 min-h-24"
                    value={equipmentNotes}
                    onChange={(e) => setEquipmentNotes(e.target.value)}
                    placeholder="บันทึกผลการตรวจสอบครุภัณฑ์..."
                  />
                  <button
                    onClick={() => checkEquipmentMutation.mutate(selectedProject.id)}
                    disabled={checkEquipmentMutation.isPending}
                    className="btn btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} />
                    <span>{checkEquipmentMutation.isPending ? 'กำลังบันทึก...' : 'ยืนยันผ่านการตรวจ'}</span>
                  </button>
                </div>
              )}

              {/* Contract Center / Legal: Approve Closure */}
              {canApproveClosure && selectedProject.equipmentChecked && selectedProject.status !== 'closed' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <CheckCircle size={18} />
                    <span>อนุมัติปิดโครงการ</span>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700">
                      โครงการนี้ผ่านการตรวจสอบครบแล้ว พร้อมปิดโครงการ
                    </p>
                  </div>
                  <button
                    onClick={() => approveClosureMutation.mutate(selectedProject.id)}
                    disabled={approveClosureMutation.isPending}
                    className="btn btn-primary w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle size={18} />
                    <span>{approveClosureMutation.isPending ? 'กำลังอนุมัติ...' : 'อนุมัติปิดโครงการ'}</span>
                  </button>
                </div>
              )}

              {/* Already Closed */}
              {selectedProject.status === 'closed' && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                  <CheckCircle size={32} className="mx-auto text-green-500 mb-2" />
                  <p className="font-semibold text-green-700">ปิดโครงการแล้ว</p>
                </div>
              )}

              {/* Waiting Status */}
              {canSubmitReport && selectedProject.finalReportSubmitted && (
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-700">รอนักวิชาการตรวจสอบครุภัณฑ์</p>
                </div>
              )}
              {canCheckEquipment && !selectedProject.finalReportSubmitted && (
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-700">รอภาคีส่งรายงานสรุป</p>
                </div>
              )}
              {canApproveClosure && !selectedProject.equipmentChecked && (
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-700">รอตรวจสอบครุภัณฑ์ก่อนอนุมัติปิด</p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center">
              <History size={48} className="mx-auto text-gray-200 mb-3" />
              <p className="text-gray-500">เลือกโครงการเพื่อดำเนินการ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
