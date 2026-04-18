'use client';

import type { AnyRecord } from '@/store/types';
import { RecordCard } from '../records/RecordCard';
import { useInvestigationStore } from '@/store/useInvestigationStore';

interface RecordFeedProps {
  records: AnyRecord[];
}

export function RecordFeed({ records }: RecordFeedProps) {
  const { selectedRecordId, selectRecord, searchQuery, activeSourceFilters } =
    useInvestigationStore();

  // Apply filters
  let filtered = records;

  if (activeSourceFilters.length > 0) {
    filtered = filtered.filter((r) => activeSourceFilters.includes(r.sourceType));
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.content?.toLowerCase().includes(q) ||
        r.personName?.toLowerCase().includes(q) ||
        r.location?.toLowerCase().includes(q) ||
        r.relatedPersons?.some((p) => p.toLowerCase().includes(q))
    );
  }

  // Sort by timestamp descending (most recent first)
  const sorted = [...filtered].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Sticky header */}
      <div className="flex items-center justify-between pt-4 pb-3 sticky top-0 bg-bg z-10">
        <h2 className="text-sm">Record Feed</h2>
        <span className="neo-label">{sorted.length} records</span>
      </div>

      {/* Scrollable list */}
      {sorted.length === 0 ? (
        <div className="neo-card-static p-8 text-center">
          <div className="neo-loading-block mx-auto mb-3 opacity-20" style={{ animation: 'none' }} />
          <p className="text-xs uppercase tracking-widest opacity-50">
            No records match your filters
          </p>
        </div>
      ) : (
        <div className="space-y-2 flex-1 overflow-y-auto pr-1">
          {sorted.map((record) => (
            <RecordCard
              key={record.id}
              record={record}
              onClick={() => selectRecord(record.id)}
              isSelected={selectedRecordId === record.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
