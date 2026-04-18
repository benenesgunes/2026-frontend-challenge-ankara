'use client';

import { useInvestigationStore } from '@/store/useInvestigationStore';

interface DrawerProps {
  children: React.ReactNode;
}

export function Drawer({ children }: DrawerProps) {
  const { isDetailDrawerOpen, closeDrawer } = useInvestigationStore();

  if (!isDetailDrawerOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 z-40 neo-overlay-enter"
        onClick={closeDrawer}
      />

      {/* Drawer Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-surface border-l-3 border-ink z-50 neo-drawer-enter shadow-brutal-lg"
        style={{ borderLeftWidth: '3px' }}
      >
        {children}
      </div>
    </>
  );
}
