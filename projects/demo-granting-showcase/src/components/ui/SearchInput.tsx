import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  loading?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function SearchInput({
  value,
  onChange,
  placeholder = 'ค้นหา...',
  debounceMs = 300,
  loading = false,
  className,
  size = 'md',
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onChange(newValue);
    }, debounceMs);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  const sizes = {
    sm: 'h-8 text-sm pl-8 pr-8',
    md: 'h-10 text-base pl-10 pr-10',
    lg: 'h-12 text-lg pl-12 pr-12',
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  return (
    <div className={clsx('relative', className)}>
      <Search
        size={iconSizes[size]}
        className={clsx(
          'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400',
          size === 'sm' && 'left-2.5'
        )}
      />
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={clsx(
          'w-full rounded-lg border border-gray-300 bg-white',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'placeholder:text-gray-400',
          'transition-colors duration-200',
          sizes[size]
        )}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
        {loading ? (
          <Loader2 size={iconSizes[size]} className="animate-spin text-gray-400" />
        ) : localValue ? (
          <button
            onClick={handleClear}
            className="p-0.5 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={iconSizes[size]} className="text-gray-400" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

// Search with filters
interface FilterOption {
  value: string;
  label: string;
}

interface SearchWithFiltersProps extends SearchInputProps {
  filters: FilterOption[];
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export function SearchWithFilters({
  filters,
  selectedFilter,
  onFilterChange,
  ...searchProps
}: SearchWithFiltersProps) {
  return (
    <div className="flex gap-2">
      <SearchInput {...searchProps} className="flex-1" />
      <select
        value={selectedFilter}
        onChange={(e) => onFilterChange(e.target.value)}
        className={clsx(
          'px-4 py-2 rounded-lg border border-gray-300 bg-white',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'text-sm'
        )}
      >
        {filters.map((filter) => (
          <option key={filter.value} value={filter.value}>
            {filter.label}
          </option>
        ))}
      </select>
    </div>
  );
}
