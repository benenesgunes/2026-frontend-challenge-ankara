'use client';

import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardPage } from '@/components/dashboard/DashboardPage';

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <DashboardPage />
        </main>
      </div>
    </div>
  );
}
