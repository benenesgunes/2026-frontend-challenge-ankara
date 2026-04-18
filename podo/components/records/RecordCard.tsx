import type { AnyRecord } from '@/store/types';
import { SourceBadge } from './SourceBadge';
import { MapPin, Clock } from 'lucide-react';

interface RecordCardProps {
  record: AnyRecord;
  onClick?: () => void;
  isSelected?: boolean;
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

function getRecordTitle(record: AnyRecord): string {
  switch (record.sourceType) {
    case 'checkin':
      return `${record.personName} checked in`;
    case 'message':
      return `${record.senderName} → ${record.recipientName}`;
    case 'sighting':
      return `Spotted: ${record.personName}`;
    case 'note':
      return `Note by ${record.author}`;
    case 'tip':
      return 'Anonymous Tip';
  }
}

export function RecordCard({ record, onClick, isSelected }: RecordCardProps) {
  return (
    <button
      onClick={onClick}
      className={`neo-card neo-card-interactive w-full text-left p-3 neo-animate-in ${
        isSelected ? 'bg-accent-yellow' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <SourceBadge sourceType={record.sourceType} />
        {record.sourceType === 'message' && (record as any).urgency === 'high' && (
          <span className="neo-badge bg-accent-red text-white">URGENT</span>
        )}
      </div>

      <h4 className="text-xs font-bold uppercase tracking-wider mb-1 font-[family-name:var(--font-space-grotesk)]">
        {getRecordTitle(record)}
      </h4>

      <p className="text-xs leading-relaxed opacity-80 mb-2 line-clamp-2">
        {record.content}
      </p>

      <div className="flex items-center gap-3 text-[10px] opacity-60 uppercase tracking-widest">
        {record.location && (
          <span className="flex items-center gap-1">
            <MapPin size={10} />
            {record.location}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Clock size={10} />
          {formatTime(record.timestamp)}
        </span>
      </div>
    </button>
  );
}
