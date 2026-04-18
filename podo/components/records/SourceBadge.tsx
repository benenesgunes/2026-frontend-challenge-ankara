import type { SourceType } from '@/store/types';
import { SOURCE_CONFIG } from '@/lib/constants';

interface SourceBadgeProps {
  sourceType: SourceType;
  className?: string;
}

export function SourceBadge({ sourceType, className = '' }: SourceBadgeProps) {
  const config = SOURCE_CONFIG[sourceType];

  return (
    <span className={`neo-badge ${config.badgeClass} ${className}`}>
      {config.label}
    </span>
  );
}
