import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { clsx } from 'clsx';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  siblingCount?: number;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  siblingCount = 1,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const range = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const getPageNumbers = () => {
    const totalNumbers = siblingCount * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages <= totalBlocks) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      return [...range(1, leftItemCount), '...', totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      return [1, '...', ...range(totalPages - rightItemCount + 1, totalPages)];
    }

    return [1, '...', ...range(leftSiblingIndex, rightSiblingIndex), '...', totalPages];
  };

  const pages = getPageNumbers();

  return (
    <nav className={clsx('flex items-center justify-center gap-1', className)}>
      {showFirstLast && (
        <PageButton
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="First page"
        >
          <ChevronsLeft size={18} />
        </PageButton>
      )}
      <PageButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </PageButton>

      {pages.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`dots-${index}`} className="px-2 py-1 text-gray-400">
              ...
            </span>
          );
        }

        return (
          <PageButton
            key={page}
            onClick={() => onPageChange(page as number)}
            active={currentPage === page}
          >
            {page}
          </PageButton>
        );
      })}

      <PageButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </PageButton>
      {showFirstLast && (
        <PageButton
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Last page"
        >
          <ChevronsRight size={18} />
        </PageButton>
      )}
    </nav>
  );
}

interface PageButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  'aria-label'?: string;
}

function PageButton({ children, onClick, active, disabled, ...props }: PageButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'min-w-[36px] h-9 px-3 rounded-lg font-medium text-sm',
        'transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
        active
          ? 'bg-blue-600 text-white'
          : 'text-gray-700 hover:bg-gray-100',
        disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent'
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// Pagination with info
interface PaginationWithInfoProps extends PaginationProps {
  totalItems: number;
  itemsPerPage: number;
}

export function PaginationWithInfo({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  ...props
}: PaginationWithInfoProps) {
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between py-4">
      <p className="text-sm text-gray-500">
        แสดง {start}-{end} จาก {totalItems} รายการ
      </p>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        {...props}
      />
    </div>
  );
}
