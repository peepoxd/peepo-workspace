import { AlertTriangle, Trash2, LogOut, CheckCircle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

type ConfirmType = 'danger' | 'warning' | 'success' | 'info';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmType;
  loading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'ยืนยัน',
  cancelText = 'ยกเลิก',
  type = 'warning',
  loading = false,
}: ConfirmDialogProps) {
  const icons = {
    danger: <Trash2 size={24} className="text-red-500" />,
    warning: <AlertTriangle size={24} className="text-yellow-500" />,
    success: <CheckCircle size={24} className="text-green-500" />,
    info: <LogOut size={24} className="text-blue-500" />,
  };

  const iconBgs = {
    danger: 'bg-red-100',
    warning: 'bg-yellow-100',
    success: 'bg-green-100',
    info: 'bg-blue-100',
  };

  const buttonVariants: Record<ConfirmType, 'danger' | 'primary'> = {
    danger: 'danger',
    warning: 'primary',
    success: 'primary',
    info: 'primary',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showClose={false}>
      <div className="text-center py-4">
        <div
          className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${iconBgs[type]}`}
        >
          {icons[type]}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mt-4">{title}</h3>
        <p className="text-gray-500 mt-2">{message}</p>
        <div className="flex gap-3 mt-6">
          <Button variant="secondary" onClick={onClose} className="flex-1" disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={buttonVariants[type]}
            onClick={onConfirm}
            className="flex-1"
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
