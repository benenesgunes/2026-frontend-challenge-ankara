'use client';

import { Search, AlertTriangle, Menu } from 'lucide-react';
import { useInvestigationStore } from '@/store/useInvestigationStore';

export function Header() {
  const { searchQuery, setSearchQuery, setMobileMenuOpen } = useInvestigationStore();

  return (
    <header className="border-b-3 border-ink bg-surface" style={{ borderBottomWidth: '3px' }}>
      <div className="flex items-center justify-between px-4 py-3 gap-4">
        {/* Title */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            className="sm:hidden w-8 h-8 flex items-center justify-center border-2 border-ink bg-white active:bg-gray-200"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={16} />
          </button>
          {/* <div className="w-8 h-8 bg-accent-red border-2 border-ink flex items-center justify-center hidden sm:flex">
            <AlertTriangle size={16} className="text-white" />
          </div> */}
          <div>
            <h1 className="text-base sm:text-lg leading-none tracking-tight">
              Missing Podo
            </h1>
            <span className="neo-label text-[9px]">The Ankara Case</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-md hidden sm:block">
          <Search
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records, people, locations..."
            className="neo-input pr-9 text-xs"
            id="header-search"
          />
        </div>

        {/* Case badge */}
        {/* <div className="shrink-0">
          <span className="neo-badge bg-accent-yellow text-ink">
            Case #00421
          </span>
        </div> */}
      </div>
    </header>
  );
}
