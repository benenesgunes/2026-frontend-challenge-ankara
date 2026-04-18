'use client';

import dynamic from 'next/dynamic';
import type { AnyRecord } from '@/store/types';

// Load map purely client side to avoid leaflet window object issues
const ClientMap = dynamic(() => import('./ClientMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-surface animate-pulse flex items-center justify-center border-2 border-ink">
      <span className="text-xs uppercase tracking-widest font-bold">Loading Map Data...</span>
    </div>
  )
});

export function MapView({ records }: { records: AnyRecord[] }) {
  return <ClientMap records={records} />;
}
