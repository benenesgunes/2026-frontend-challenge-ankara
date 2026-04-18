import type { SourceType } from '@/store/types';
import { SOURCE_CONFIG } from '@/lib/constants';
import { useInvestigationStore } from '@/store/useInvestigationStore';
import { Search } from 'lucide-react';

const ALL_SOURCES: SourceType[] = ['checkin', 'message', 'sighting', 'note', 'tip'];

export function FilterBar() {
  const { searchQuery, setSearchQuery, activeSourceFilters, toggleSourceFilter } =
    useInvestigationStore();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search records..."
          className="neo-input pr-9"
          id="global-search"
        />
      </div>

      {/* Source filter pills */}
      <div className="flex flex-wrap gap-1">
        {ALL_SOURCES.map((source) => {
          const config = SOURCE_CONFIG[source];
          const isActive = activeSourceFilters.includes(source);

          return (
            <button
              key={source}
              onClick={() => toggleSourceFilter(source)}
              className={`neo-btn text-[10px] py-1 px-2 ${
                isActive
                  ? `${config.badgeClass} border-ink`
                  : 'bg-surface border-ink opacity-60 hover:opacity-100'
              }`}
              id={`filter-${source}`}
            >
              {config.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
