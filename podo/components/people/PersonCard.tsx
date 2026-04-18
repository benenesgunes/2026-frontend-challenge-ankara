import type { Person } from '@/store/types';
import { SuspicionMeter } from './SuspicionMeter';
import { MapPin, Clock, FileText } from 'lucide-react';

interface PersonCardProps {
  person: Person;
  rank: number;
  onClick?: () => void;
  isSelected?: boolean;
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

export function PersonCard({ person, rank, onClick, isSelected }: PersonCardProps) {
  const isTopSuspect = rank === 1 && person.suspicionScore > 0;
  const isPodo = person.name.toLowerCase() === 'podo';

  return (
    <button
      onClick={onClick}
      className={`neo-card neo-card-interactive w-full text-left p-4 relative neo-animate-in ${
        isSelected ? 'bg-accent-yellow' : ''
      } ${isPodo ? 'opacity-50' : ''}`}
      style={{ animationDelay: `${rank * 50}ms` }}
    >
      {isTopSuspect && (
        <div className="absolute -top-2 -right-2 z-10">
          <span className="neo-stamp neo-stamp-danger">
            MOST SUSPICIOUS
          </span>
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 border-2 border-ink flex items-center justify-center font-bold text-xs font-[family-name:var(--font-space-grotesk)] uppercase ${
              isTopSuspect
                ? 'bg-accent-red text-white'
                : isPodo
                ? 'bg-accent-blue text-white'
                : 'bg-surface'
            }`}
          >
            {person.name[0]}
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wide font-[family-name:var(--font-space-grotesk)]">
              {person.name}
            </h4>
            {isPodo && (
              <span className="text-[10px] uppercase tracking-widest text-accent-red font-bold">
                Missing
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 neo-badge bg-surface">
          <FileText size={10} />
          <span>{person.linkedRecords.length}</span>
        </div>
      </div>

      {!isPodo && <SuspicionMeter score={person.suspicionScore} size="sm" />}

      <div className="flex items-center gap-3 mt-2 text-[10px] opacity-60 uppercase tracking-widest">
        {person.lastSeenLocation && (
          <span className="flex items-center gap-1">
            <MapPin size={10} />
            {person.lastSeenLocation}
          </span>
        )}
        {person.lastSeenAt && (
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {formatTime(person.lastSeenAt)}
          </span>
        )}
      </div>
    </button>
  );
}
