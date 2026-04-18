'use client';

import type { AnyRecord } from '@/store/types';
import { SourceBadge } from '../records/SourceBadge';
import { useInvestigationStore } from '@/store/useInvestigationStore';
import { MapPin } from 'lucide-react';

interface TimelinePanelProps {
  records: AnyRecord[];
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

export function TimelinePanel({ records }: TimelinePanelProps) {
  const { selectRecord, searchQuery, activeSourceFilters } = useInvestigationStore();

  // Apply same filters
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
        r.location?.toLowerCase().includes(q)
    );
  }

  // Sort chronologically
  const sorted = [...filtered].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Group by location for phases
  let currentLocation = '';

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between pt-4 pb-3 sticky top-0 bg-bg z-20">
        <h2 className="text-sm">Timeline</h2>
        <span className="neo-label">{sorted.length} events</span>
      </div>

      <div className="relative flex-1 overflow-y-auto pr-1 pb-4">
        {/* Vertical connector line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-ink/20" />

        <div className="space-y-1">
          {sorted.map((record, idx) => {
            // Show location phase header when location changes
            const showLocationHeader =
              record.location && record.location !== currentLocation;
            if (record.location) currentLocation = record.location;

            return (
              <div key={record.id}>
                {showLocationHeader && (
                  <div className="flex items-center gap-2 py-2 pl-8 mb-1">
                    <MapPin size={12} className="text-accent-red" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent-red font-[family-name:var(--font-space-grotesk)]">
                      {record.location}
                    </span>
                  </div>
                )}

                <button
                  onClick={() => selectRecord(record.id)}
                  className="flex items-start gap-3 w-full text-left py-2 px-1 hover:bg-accent-yellow/20 transition-colors rounded-none group"
                >
                  {/* Timeline dot */}
                  <div className="relative z-10 mt-1 shrink-0">
                    <div
                      className="w-4 h-4 border-2 border-ink group-hover:scale-125 transition-transform"
                      style={{
                        backgroundColor:
                          record.sourceType === 'sighting'
                            ? '#FF3B30'
                            : record.sourceType === 'message'
                              ? '#0057FF'
                              : record.sourceType === 'checkin'
                                ? '#FFE500'
                                : record.sourceType === 'tip'
                                  ? '#8B5CF6'
                                  : '#00C853',
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold opacity-50 font-[family-name:var(--font-ibm-plex-mono)]">
                        {formatTime(record.timestamp)}
                      </span>
                      <SourceBadge sourceType={record.sourceType} />
                    </div>
                    <p className="text-xs leading-relaxed truncate">
                      {record.personName && (
                        <span className="font-bold">{record.personName}: </span>
                      )}
                      {record.content}
                    </p>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
