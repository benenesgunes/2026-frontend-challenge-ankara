import type { AnyRecord } from '@/store/types';
import { SourceBadge } from './SourceBadge';
import { MapPin, Clock, X, User, AlertTriangle } from 'lucide-react';
import { useInvestigationStore } from '@/store/useInvestigationStore';

interface RecordDetailProps {
  record: AnyRecord;
  onClose: () => void;
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

function formatFullDate(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function RecordDetail({ record, onClose }: RecordDetailProps) {
  const { selectPerson } = useInvestigationStore();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b-2 border-ink">
        <div className="flex items-center gap-3">
          <SourceBadge sourceType={record.sourceType} />
          <span className="neo-label">Record #{record.id}</span>
        </div>
        <button onClick={onClose} className="neo-btn neo-btn-ghost p-2">
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Timestamp */}
        <div className="neo-card-static p-3">
          <span className="neo-label block mb-1">Timestamp</span>
          <div className="flex items-center gap-2">
            <Clock size={14} />
            <span className="text-sm font-bold">{formatFullDate(record.timestamp)}</span>
          </div>
        </div>

        {/* Location */}
        {record.location && (
          <div className="neo-card-static p-3">
            <span className="neo-label block mb-1">Location</span>
            <div className="flex items-center gap-2">
              <MapPin size={14} />
              <span className="text-sm font-bold">{record.location}</span>
            </div>
            {record.coordinates && (
              <span className="text-[10px] opacity-50 mt-1 block">
                {record.coordinates}
              </span>
            )}
          </div>
        )}

        {/* People involved */}
        {record.sourceType === 'message' && (
          <div className="neo-card-static p-3">
            <span className="neo-label block mb-1">Conversation</span>
            <div className="flex items-center gap-2 text-sm">
              <User size={14} />
              <span className="font-bold">{record.senderName}</span>
              <span className="opacity-40">→</span>
              <span className="font-bold">{record.recipientName}</span>
            </div>
            {record.urgency && (
              <div className="mt-2">
                <span
                  className={`neo-badge ${
                    record.urgency === 'high'
                      ? 'bg-accent-red text-white'
                      : record.urgency === 'medium'
                      ? 'bg-accent-yellow text-ink'
                      : 'bg-surface'
                  }`}
                >
                  {record.urgency} urgency
                </span>
              </div>
            )}
          </div>
        )}

        {record.sourceType === 'sighting' && (
          <div className="neo-card-static p-3">
            <span className="neo-label block mb-1">Witness</span>
            <div className="flex items-center gap-2 text-sm">
              <User size={14} />
              <span className="font-bold">{record.witnessName}</span>
            </div>
          </div>
        )}

        {record.sourceType === 'tip' && record.reliability && (
          <div className="neo-card-static p-3">
            <span className="neo-label block mb-1">Reliability</span>
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle size={14} />
              <span
                className={`neo-badge ${
                  record.reliability === 'high'
                    ? 'bg-accent-red text-white'
                    : record.reliability === 'medium'
                    ? 'bg-accent-yellow text-ink'
                    : 'bg-surface'
                }`}
              >
                {record.reliability}
              </span>
            </div>
          </div>
        )}

        {/* Full content */}
        <div className="neo-card-static p-4">
          <span className="neo-label block mb-2">Content</span>
          <p className="text-sm leading-relaxed">{record.content}</p>
        </div>

        {/* Related persons */}
        {record.relatedPersons && record.relatedPersons.length > 0 && (
          <div className="neo-card-static p-3">
            <span className="neo-label block mb-2">Related Persons</span>
            <div className="flex flex-wrap gap-1">
              {record.relatedPersons.map((name) => (
                <button 
                  key={name}
                  onClick={() => selectPerson(name.toLowerCase().trim())}
                  className="neo-badge bg-surface hover:bg-bg hover:shadow-neo transition-all cursor-pointer"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
