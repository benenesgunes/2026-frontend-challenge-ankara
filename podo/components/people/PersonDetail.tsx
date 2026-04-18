import type { Person } from '@/store/types';
import { SuspicionMeter } from './SuspicionMeter';
import { SourceBadge } from '../records/SourceBadge';
import { MapPin, Clock, X } from 'lucide-react';

interface PersonDetailProps {
  person: Person;
  onClose: () => void;
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' });
}

export function PersonDetail({ person, onClose }: PersonDetailProps) {
  const sortedRecords = [...person.linkedRecords].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b-2 border-ink">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-ink flex items-center justify-center font-black text-lg font-[family-name:var(--font-space-grotesk)] bg-surface">
            {person.name[0]}
          </div>
          <div>
            <h3 className="text-lg">{person.name}</h3>
            <span className="neo-label">{person.linkedRecords.length} records linked</span>
          </div>
        </div>
        <button onClick={onClose} className="neo-btn neo-btn-ghost p-2">
          <X size={16} />
        </button>
      </div>

      {/* Suspicion Score */}
      {person.name.toLowerCase() !== 'podo' && (
        <div className="p-4 border-b-2 border-ink">
          <SuspicionMeter score={person.suspicionScore} />
        </div>
      )}

      {/* Last Seen */}
      {person.lastSeenLocation && (
        <div className="p-4 border-b-2 border-ink bg-surface">
          <span className="neo-label block mb-1">Last Seen</span>
          <div className="flex items-center gap-2">
            <MapPin size={14} />
            <span className="text-sm font-bold">{person.lastSeenLocation}</span>
            {person.lastSeenAt && (
              <>
                <span className="opacity-30">•</span>
                <Clock size={14} />
                <span className="text-sm">{formatTime(person.lastSeenAt)}</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Record Timeline */}
      <div className="flex-1 overflow-y-auto p-4">
        <span className="neo-label block mb-3">Record Timeline</span>
        <div className="space-y-3">
          {sortedRecords.map((record) => (
            <div
              key={record.id}
              className="neo-card-static p-3 text-xs"
            >
              <div className="flex items-center justify-between mb-1">
                <SourceBadge sourceType={record.sourceType} />
                <span className="neo-label">
                  {formatDate(record.timestamp)} {formatTime(record.timestamp)}
                </span>
              </div>
              <p className="mt-2 leading-relaxed">{record.content}</p>
              {record.location && (
                <div className="flex items-center gap-1 mt-2 opacity-50">
                  <MapPin size={10} />
                  <span className="text-[10px] uppercase tracking-widest">
                    {record.location}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
