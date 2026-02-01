import { useState, ReactNode, createContext, useContext } from 'react';
import { clsx } from 'clsx';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  children?: ReactNode;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

export default function Tabs({
  tabs,
  defaultTab,
  onChange,
  children,
  variant = 'default',
  className,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const tabStyles = {
    default: {
      container: 'border-b border-gray-200',
      tab: (active: boolean) =>
        clsx(
          'px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors',
          active
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        ),
    },
    pills: {
      container: 'bg-gray-100 p-1 rounded-lg',
      tab: (active: boolean) =>
        clsx(
          'px-4 py-2 text-sm font-medium rounded-md transition-colors',
          active ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
        ),
    },
    underline: {
      container: '',
      tab: (active: boolean) =>
        clsx(
          'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
          active
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        ),
    },
  };

  const styles = tabStyles[variant];

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={className}>
        <div className={clsx('flex', styles.container)}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && handleTabChange(tab.id)}
              disabled={tab.disabled}
              className={clsx(
                styles.tab(activeTab === tab.id),
                'flex items-center gap-2',
                tab.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {tab.icon}
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  className={clsx(
                    'px-2 py-0.5 text-xs rounded-full',
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-200 text-gray-600'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

interface TabPanelProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function TabPanel({ id, children, className }: TabPanelProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabPanel must be used within Tabs');

  if (context.activeTab !== id) return null;

  return <div className={clsx('mt-4', className)}>{children}</div>;
}
