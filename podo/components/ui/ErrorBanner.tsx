import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className="neo-card-static border-accent-red p-4 flex items-start gap-3 bg-accent-red/5"
      style={{ borderColor: 'var(--color-accent-red)' }}
    >
      <div className="w-8 h-8 bg-accent-red border-2 border-ink flex items-center justify-center shrink-0">
        <AlertTriangle size={14} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-xs font-bold uppercase tracking-widest text-accent-red mb-1">
          Error Loading Data
        </h3>
        <p className="text-xs opacity-70 font-[family-name:var(--font-ibm-plex-mono)] break-words">
          {message}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="neo-btn text-[10px] py-1 px-2 flex items-center gap-1 shrink-0"
          id="error-retry-btn"
        >
          <RefreshCw size={10} />
          Retry
        </button>
      )}
    </div>
  );
}
