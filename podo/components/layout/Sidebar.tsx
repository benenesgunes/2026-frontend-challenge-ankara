'use client';

import { Clock, Users, FileText } from 'lucide-react';
import { useInvestigationStore } from '@/store/useInvestigationStore';

const TABS = [
  { id: 'timeline' as const, label: 'Timeline', icon: Clock },
  { id: 'people' as const, label: 'People', icon: Users },
  { id: 'records' as const, label: 'Records', icon: FileText },
];

export function Sidebar() {
  const { activeSidebarTab, setSidebarTab } = useInvestigationStore();

  return (
    <aside className="w-16 sm:w-48 border-r-2 border-ink bg-surface shrink-0 flex flex-col">
      <nav className="flex flex-col py-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSidebarTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setSidebarTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                isActive
                  ? 'bg-accent-yellow border-r-4 border-ink font-bold'
                  : 'hover:bg-bg'
              }`}
              id={`sidebar-${tab.id}`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline text-xs uppercase tracking-widest font-[family-name:var(--font-space-grotesk)]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Case Status */}
      <div className="mt-auto p-3 border-t-2 border-ink hidden sm:block">
        <div className="neo-card-static p-2">
          <span className="neo-label block mb-1">Status</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-accent-red border border-ink animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent-red">
              Active Case
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
