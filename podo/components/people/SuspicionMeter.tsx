interface SuspicionMeterProps {
  score: number;
  size?: 'sm' | 'md';
}

function getMeterColor(score: number): string {
  if (score >= 70) return 'bg-accent-red';
  if (score >= 40) return 'bg-accent-yellow';
  return 'bg-accent-green';
}

export function SuspicionMeter({ score, size = 'md' }: SuspicionMeterProps) {
  const height = size === 'sm' ? 'h-2' : 'h-3';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="neo-label">Suspicion</span>
        <span className="font-bold text-xs font-[family-name:var(--font-space-grotesk)]">
          {score}/100
        </span>
      </div>
      <div className={`neo-meter ${height}`}>
        <div
          className={`neo-meter-fill ${getMeterColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
