import { ReactNode } from 'react';
import { FileQuestion, FolderOpen, Search, Inbox, AlertCircle } from 'lucide-react';
import Button from './Button';

type EmptyType = 'empty' | 'search' | 'error' | 'folder' | 'inbox';

interface EmptyStateProps {
  type?: EmptyType;
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  type = 'empty',
  title,
  description,
  icon,
  action,
  secondaryAction,
}: EmptyStateProps) {
  const defaultIcons = {
    empty: <FileQuestion size={48} className="text-gray-300" />,
    search: <Search size={48} className="text-gray-300" />,
    error: <AlertCircle size={48} className="text-red-300" />,
    folder: <FolderOpen size={48} className="text-gray-300" />,
    inbox: <Inbox size={48} className="text-gray-300" />,
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-4">{icon || defaultIcons[type]}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-500 max-w-md mb-6">{description}</p>}
      {(action || secondaryAction) && (
        <div className="flex gap-3">
          {secondaryAction && (
            <Button variant="secondary" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
          {action && (
            <Button variant="primary" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Pre-built empty states
export function NoProposalsEmpty({ onCreateNew }: { onCreateNew?: () => void }) {
  return (
    <EmptyState
      type="folder"
      title="ยังไม่มีข้อเสนอโครงการ"
      description="เริ่มต้นสร้างข้อเสนอโครงการแรกของคุณเพื่อขอรับทุนสนับสนุน"
      action={onCreateNew ? { label: 'สร้างข้อเสนอใหม่', onClick: onCreateNew } : undefined}
    />
  );
}

export function NoSearchResultsEmpty({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <EmptyState
      type="search"
      title="ไม่พบผลลัพธ์"
      description={`ไม่พบข้อมูลที่ตรงกับ "${query}" ลองค้นหาด้วยคำอื่น`}
      action={{ label: 'ล้างการค้นหา', onClick: onClear }}
    />
  );
}

export function NoContractsEmpty() {
  return (
    <EmptyState
      type="inbox"
      title="ยังไม่มีสัญญา"
      description="สัญญาจะปรากฏที่นี่เมื่อข้อเสนอได้รับการอนุมัติและสร้างสัญญา"
    />
  );
}

export function NoPaymentsEmpty() {
  return (
    <EmptyState
      type="inbox"
      title="ยังไม่มีรายการเบิกจ่าย"
      description="รายการเบิกจ่ายจะปรากฏที่นี่เมื่อมีการส่งคำขอเบิกเงิน"
    />
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      type="error"
      title="เกิดข้อผิดพลาด"
      description="ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง"
      action={onRetry ? { label: 'ลองใหม่', onClick: onRetry } : undefined}
    />
  );
}
