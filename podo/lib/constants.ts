import type { SourceType } from '@/store/types';

export const API_BASE_URL = 'https://api.jotform.com';

export const SOURCE_CONFIG: Record<SourceType, {
  label: string;
  color: string;
  bgClass: string;
  textClass: string;
  badgeClass: string;
}> = {
  checkin: {
    label: 'Check-in',
    color: '#FFE500',
    bgClass: 'bg-source-checkin',
    textClass: 'text-ink',
    badgeClass: 'neo-badge-checkin',
  },
  message: {
    label: 'Message',
    color: '#0057FF',
    bgClass: 'bg-source-message',
    textClass: 'text-white',
    badgeClass: 'neo-badge-message',
  },
  sighting: {
    label: 'Sighting',
    color: '#FF3B30',
    bgClass: 'bg-source-sighting',
    textClass: 'text-white',
    badgeClass: 'neo-badge-sighting',
  },
  note: {
    label: 'Note',
    color: '#00C853',
    bgClass: 'bg-source-note',
    textClass: 'text-ink',
    badgeClass: 'neo-badge-note',
  },
  tip: {
    label: 'Tip',
    color: '#8B5CF6',
    bgClass: 'bg-source-tip',
    textClass: 'text-white',
    badgeClass: 'neo-badge-tip',
  },
};
