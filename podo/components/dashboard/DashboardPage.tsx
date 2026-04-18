'use client';

import { useRecords } from '@/hooks/useRecords';
import { useInvestigationStore } from '@/store/useInvestigationStore';
import { StatsBar } from './StatsBar';
import { SuspectBoard } from './SuspectBoard';
import { RecordFeed } from './RecordFeed';
import { TimelinePanel } from './TimelinePanel';
import { FilterBar } from '../filters/FilterBar';
import { Drawer } from '../ui/Drawer';
import { MapView } from '../map/MapView';
import { PersonDetail } from '../people/PersonDetail';
import { RecordDetail } from '../records/RecordDetail';
import { ErrorBanner } from '../ui/ErrorBanner';
import {
  SkeletonStatsBar,
  SkeletonSuspectBoard,
  SkeletonRecordFeed,
} from '../ui/Skeletons';

export function DashboardPage() {
  const {
    activeSidebarTab,
    detailDrawerTarget,
    selectedPersonId,
    selectedRecordId,
    closeDrawer,
  } = useInvestigationStore();

  // Fetch real data from Jotform API
  const { records, people, isLoading, error, refetch } = useRecords();

  // Find selected person/record
  const selectedPerson = people.find((p) => p.id === selectedPersonId);
  const selectedRecord = records.find((r) => r.id === selectedRecordId);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Stats Bar */}
      <div className="p-4 border-b-2 border-ink">
        {isLoading ? (
          <SkeletonStatsBar />
        ) : (
          <StatsBar
            totalRecords={records.length}
            people={people}
            allRecords={records}
          />
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 border-b-2 border-ink">
          <ErrorBanner message={error} onRetry={refetch} />
        </div>
      )}

      {/* Filter Bar */}
      <div className="p-4 border-b-2 border-ink bg-surface/50">
        <FilterBar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {activeSidebarTab === 'suspects' ? (
            <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
              <div className="flex-1 flex flex-col px-4 pb-4 border-b-2 md:border-b-0 md:border-r-2 border-ink md:overflow-hidden min-h-[350px] md:min-h-0 shrink-0 md:shrink">
                {isLoading ? (
                  <SkeletonSuspectBoard />
                ) : (
                  <SuspectBoard people={people} />
                )}
              </div>
              <div className="flex-1 flex flex-col px-4 pb-4 md:overflow-hidden min-h-[350px] md:min-h-0 shrink-0 md:shrink">
                {isLoading ? (
                  <SkeletonRecordFeed />
                ) : (
                  <RecordFeed records={records} />
                )}
              </div>
            </div>
          ) : activeSidebarTab === 'timeline' ? (
            <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
              <div className="flex-1 flex flex-col px-4 pb-4 border-b-2 md:border-b-0 md:border-r-2 border-ink md:overflow-hidden min-h-[350px] md:min-h-0 shrink-0 md:shrink">
                {isLoading ? (
                  <SkeletonRecordFeed />
                ) : (
                  <TimelinePanel records={records} />
                )}
              </div>
              <div className="flex-1 flex flex-col px-4 pb-4 md:overflow-hidden min-h-[350px] md:min-h-0 shrink-0 md:shrink">
                {isLoading ? (
                  <SkeletonRecordFeed />
                ) : (
                  <RecordFeed records={records} />
                )}
              </div>
            </div>
          ) : activeSidebarTab === 'map' ? (
            <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
              <div className="flex-[3] flex flex-col p-0 border-b-2 md:border-b-0 md:border-r-2 border-ink md:overflow-hidden min-h-[350px] md:min-h-0 shrink-0 md:shrink bg-surface relative">
                {isLoading ? (
                  <div className="w-full h-full animate-pulse opacity-50" />
                ) : (
                  <MapView records={records} />
                )}
              </div>
              <div className="flex-1 flex flex-col px-4 pb-4 md:overflow-hidden shrink-0 md:shrink">
                {isLoading ? (
                  <SkeletonRecordFeed />
                ) : (
                  <RecordFeed records={records} />
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Detail Drawer */}
      <Drawer>
        {detailDrawerTarget === 'person' && selectedPerson && (
          <PersonDetail person={selectedPerson} onClose={closeDrawer} />
        )}
        {detailDrawerTarget === 'record' && selectedRecord && (
          <RecordDetail record={selectedRecord} onClose={closeDrawer} />
        )}
      </Drawer>
    </div>
  );
}
