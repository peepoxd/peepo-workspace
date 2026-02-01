import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { proposalsApi } from '../../utils/api';
import { Save, Send, ArrowLeft } from 'lucide-react';

export default function ProposalFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [form, setForm] = useState({
    projectName: '',
    description: '',
    budget: '',
    duration: '',
    objectives: [''],
    targetGroup: '',
  });

  const createMutation = useMutation({
    mutationFn: proposalsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      navigate('/proposals');
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (formData: typeof form) => {
      // สร้างข้อเสนอก่อน แล้วยื่นเลย
      const created = await proposalsApi.create({
        ...formData,
        budget: parseFloat(formData.budget),
        duration: parseInt(formData.duration),
        objectives: formData.objectives.filter(Boolean),
      });
      // ยื่นข้อเสนอ
      return proposalsApi.submit(created.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      navigate('/proposals');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...form.objectives];
    newObjectives[index] = value;
    setForm({ ...form, objectives: newObjectives });
  };

  const addObjective = () => {
    setForm({ ...form, objectives: [...form.objectives, ''] });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...form,
      budget: parseFloat(form.budget),
      duration: parseInt(form.duration),
      objectives: form.objectives.filter(Boolean),
    });
  };

  return (
    <div>
      <button
        onClick={() => navigate('/proposals')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={20} />
        <span>กลับ</span>
      </button>

      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? 'แก้ไขข้อเสนอโครงการ' : 'สร้างข้อเสนอโครงการใหม่'}
      </h1>

      <form onSubmit={handleSubmit} className="card max-w-3xl">
        <div className="space-y-6">
          <div>
            <label className="label">ชื่อโครงการ *</label>
            <input
              type="text"
              name="projectName"
              className="input"
              value={form.projectName}
              onChange={handleChange}
              required
              minLength={5}
            />
          </div>

          <div>
            <label className="label">รายละเอียดโครงการ *</label>
            <textarea
              name="description"
              className="input min-h-32"
              value={form.description}
              onChange={handleChange}
              required
              minLength={20}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">งบประมาณ (บาท) *</label>
              <input
                type="number"
                name="budget"
                className="input"
                value={form.budget}
                onChange={handleChange}
                required
                min={1}
              />
            </div>
            <div>
              <label className="label">ระยะเวลา (เดือน) *</label>
              <input
                type="number"
                name="duration"
                className="input"
                value={form.duration}
                onChange={handleChange}
                required
                min={1}
                max={36}
              />
            </div>
          </div>

          <div>
            <label className="label">วัตถุประสงค์ *</label>
            {form.objectives.map((obj, index) => (
              <input
                key={index}
                type="text"
                className="input mb-2"
                value={obj}
                onChange={(e) => handleObjectiveChange(index, e.target.value)}
                placeholder={`วัตถุประสงค์ที่ ${index + 1}`}
              />
            ))}
            <button type="button" onClick={addObjective} className="text-blue-600 text-sm hover:underline">
              + เพิ่มวัตถุประสงค์
            </button>
          </div>

          <div>
            <label className="label">กลุ่มเป้าหมาย *</label>
            <input
              type="text"
              name="targetGroup"
              className="input"
              value={form.targetGroup}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button type="submit" className="btn btn-primary flex items-center gap-2">
              <Save size={20} />
              <span>บันทึกร่าง</span>
            </button>
            <button
              type="button"
              onClick={() => submitMutation.mutate(form)}
              disabled={submitMutation.isPending}
              className="btn btn-secondary flex items-center gap-2"
            >
              <Send size={20} />
              <span>{submitMutation.isPending ? 'กำลังยื่น...' : 'ยื่นข้อเสนอ'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
