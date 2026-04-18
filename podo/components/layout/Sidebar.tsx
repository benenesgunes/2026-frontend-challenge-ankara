'use client';

import { Clock, Users, FileText, X } from 'lucide-react';
import { useInvestigationStore } from '@/store/useInvestigationStore';

const TABS = [
  { id: 'timeline' as const, label: 'Timeline', icon: Clock },
  { id: 'records' as const, label: 'Records', icon: FileText },
];

export function Sidebar() {
  const { activeSidebarTab, setSidebarTab, isMobileMenuOpen, setMobileMenuOpen } = useInvestigationStore();

  const handleTabClick = (tabId: 'timeline' | 'records') => {
    setSidebarTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r-2 border-ink bg-surface flex flex-col shrink-0 transition-transform duration-200 ease-in-out sm:relative sm:translate-x-0 sm:w-48 sm:flex ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 sm:hidden border-b-2 border-ink">
          <span className="font-bold tracking-widest uppercase text-sm">Menu</span>
          <button onClick={() => setMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col py-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSidebarTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  isActive
                    ? 'bg-accent-yellow border-r-4 border-ink font-bold'
                    : 'hover:bg-bg'
                }`}
                id={`sidebar-${tab.id}`}
              >
                <Icon size={16} />
                <span className="inline text-xs uppercase tracking-widest font-[family-name:var(--font-space-grotesk)]">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Case Status */}
        <div className="mt-auto p-3 border-t-2 border-ink">
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
    </>
  );
}
