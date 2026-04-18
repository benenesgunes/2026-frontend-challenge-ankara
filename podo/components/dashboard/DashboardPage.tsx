'use client';

import { useMemo } from 'react';
import { allRecords } from '@/lib/placeholderData';
import { linkRecordsToPeople } from '@/lib/recordLinker';
import { useInvestigationStore } from '@/store/useInvestigationStore';
import { StatsBar } from './StatsBar';
import { SuspectBoard } from './SuspectBoard';
import { RecordFeed } from './RecordFeed';
import { TimelinePanel } from './TimelinePanel';
import { FilterBar } from '../filters/FilterBar';
import { Drawer } from '../ui/Drawer';
import { PersonDetail } from '../people/PersonDetail';
import { RecordDetail } from '../records/RecordDetail';

export function DashboardPage() {
  const {
    activeSidebarTab,
    isDetailDrawerOpen,
    detailDrawerTarget,
    selectedPersonId,
    selectedRecordId,
    closeDrawer,
  } = useInvestigationStore();

  // Compute people from records
  const people = useMemo(() => linkRecordsToPeople(allRecords), []);

  // Find selected person/record
  const selectedPerson = people.find((p) => p.id === selectedPersonId);
  const selectedRecord = allRecords.find((r) => r.id === selectedRecordId);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Stats Bar */}
      <div className="p-4 border-b-2 border-ink">
        <StatsBar
          totalRecords={allRecords.length}
          people={people}
          allRecords={allRecords}
        />
      </div>

      {/* Filter Bar */}
      <div className="p-4 border-b-2 border-ink bg-surface/50">
        <FilterBar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Left Panel — switches between Timeline, People list, Records list */}
          {activeSidebarTab === 'timeline' ? (
            // Timeline + Suspect Board layout
            <div className="flex-1 flex overflow-hidden">
              {/* Suspect Board */}
              <div className="flex-1 flex flex-col p-4 border-r-2 border-ink overflow-hidden">
                <SuspectBoard people={people} />
              </div>

              {/* Record Feed */}
              <div className="flex-1 flex flex-col p-4 hidden md:block overflow-hidden">
                <RecordFeed records={allRecords} />
              </div>
            </div>
          ) : activeSidebarTab === 'people' ? (
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
              <SuspectBoard people={people} />
            </div>
          ) : activeSidebarTab === 'records' ? (
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 flex flex-col p-4 border-r-2 border-ink overflow-hidden">
                <TimelinePanel records={allRecords} />
              </div>
              <div className="flex-1 flex flex-col p-4 hidden md:block overflow-hidden">
                <RecordFeed records={allRecords} />
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
