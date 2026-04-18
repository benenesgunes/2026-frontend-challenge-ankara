const SKELETON_WIDTHS = ['w-[85%]', 'w-[70%]', 'w-[78%]', 'w-[65%]', 'w-[90%]'];

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="neo-card-static p-4 animate-pulse">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-16 h-5 bg-ink/10 border border-ink/10" />
      </div>
      <div className="h-5 bg-ink/10 border border-ink/10 w-3/4 mb-2" />
      {Array.from({ length: lines - 1 }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-ink/10 border border-ink/10 mb-1 ${SKELETON_WIDTHS[i % SKELETON_WIDTHS.length]}`}
        />
      ))}
      <div className="flex items-center gap-3 mt-3">
        <div className="h-3 w-20 bg-ink/10 border border-ink/10" />
        <div className="h-3 w-16 bg-ink/10 border border-ink/10" />
      </div>
    </div>
  );
}

export function SkeletonPersonCard() {
  return (
    <div className="neo-card-static p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-ink/10 border-2 border-ink/10" />
        <div className="flex-1">
          <div className="h-5 bg-ink/10 border border-ink/10 w-24 mb-1" />
          <div className="h-3 bg-ink/10 border border-ink/10 w-16" />
        </div>
        <div className="w-10 h-6 bg-ink/10 border border-ink/10" />
      </div>
      <div className="flex items-center gap-2 mb-2">
        <div className="h-3 w-16 bg-ink/10 border border-ink/10" />
        <div className="h-3 w-12 bg-ink/10 border border-ink/10" />
      </div>
      <div className="h-3 bg-ink/15 w-full" />
    </div>
  );
}

export function SkeletonStatsBar() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="neo-card-static p-3 flex items-start gap-3 animate-pulse">
          <div className="w-8 h-8 bg-ink/10 border-2 border-ink/10 shrink-0" />
          <div className="flex-1">
            <div className="h-3 w-16 bg-ink/10 border border-ink/10 mb-1" />
            <div className="h-5 w-24 bg-ink/10 border border-ink/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonRecordFeed() {
  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between pb-3">
        <div className="h-5 w-28 bg-ink/10 border border-ink/10 animate-pulse" />
        <div className="h-3 w-16 bg-ink/10 border border-ink/10 animate-pulse" />
      </div>
      <div className="space-y-2 flex-1 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCard key={i} lines={2 + (i % 2)} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonSuspectBoard() {
  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between pb-3">
        <div className="h-5 w-32 bg-ink/10 border border-ink/10 animate-pulse" />
        <div className="h-3 w-16 bg-ink/10 border border-ink/10 animate-pulse" />
      </div>
      <div className="flex-1 overflow-hidden">
        {/* Victim card */}
        <div className="mb-3">
          <div className="h-3 w-24 bg-ink/10 border border-ink/10 mb-1 animate-pulse" />
          <SkeletonPersonCard />
        </div>
        {/* Suspect grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonPersonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
