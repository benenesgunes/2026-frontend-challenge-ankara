import type { Person, AnyRecord } from '@/store/types';
import { FileText, MapPin, Clock, AlertTriangle, Eye } from 'lucide-react';

interface StatsBarProps {
  totalRecords: number;
  people: Person[];
  allRecords: AnyRecord[];
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

export function StatsBar({ totalRecords, people, allRecords }: StatsBarProps) {
  // Find Podo's last seen record
  const podoRecords = allRecords
    .filter(
      (r) =>
        r.personName?.toLowerCase() === 'podo' ||
        r.relatedPersons?.some((p) => p.toLowerCase() === 'podo')
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const lastSeenRecord = podoRecords[0];

  // Top suspect (exclude Podo)
  const topSuspect = people.find((p) => p.name.toLowerCase() !== 'podo' && p.suspicionScore > 0);

  // Unique locations
  const locations = new Set(allRecords.filter((r) => r.location).map((r) => r.location));

  const stats = [
    {
      icon: FileText,
      label: 'Total Records',
      value: totalRecords.toString(),
      accent: false,
    },
    {
      icon: Eye,
      label: 'Last Seen',
      value: lastSeenRecord
        ? `${lastSeenRecord.location} · ${formatTime(lastSeenRecord.timestamp)}`
        : 'Unknown',
      accent: false,
    },
    {
      icon: MapPin,
      label: 'Locations',
      value: locations.size.toString(),
      accent: false,
    },
    {
      icon: AlertTriangle,
      label: 'Top Suspect',
      value: topSuspect ? topSuspect.name : 'N/A',
      accent: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`neo-card-static p-3 flex items-start gap-3 ${
              stat.accent ? 'bg-accent-red/5' : ''
            }`}
          >
            <div
              className={`w-8 h-8 border-2 border-ink flex items-center justify-center shrink-0 ${
                stat.accent ? 'bg-accent-red text-white' : 'bg-accent-yellow'
              }`}
            >
              <Icon size={14} />
            </div>
            <div className="min-w-0">
              <span className="neo-label block">{stat.label}</span>
              <span className="text-sm font-bold font-[family-name:var(--font-space-grotesk)] block truncate">
                {stat.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
