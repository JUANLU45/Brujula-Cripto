'use client';

interface TabType {
  id: 'account' | 'usage' | 'subscription';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardTabsProps {
  tabs: TabType[];
  activeTab: 'account' | 'usage' | 'subscription';
  onTabChange: (tabId: 'account' | 'usage' | 'subscription') => void;
}

export function DashboardTabs({ tabs, activeTab, onTabChange }: DashboardTabsProps): JSX.Element {
  return (
    <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-4 overflow-x-auto sm:space-x-8">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center whitespace-nowrap border-b-2 px-1 py-2 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <IconComponent className="mr-2 h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
