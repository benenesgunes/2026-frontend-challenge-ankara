'use client';

import type { Person } from '@/store/types';
import { PersonCard } from '../people/PersonCard';
import { useInvestigationStore } from '@/store/useInvestigationStore';

interface SuspectBoardProps {
  people: Person[];
}

export function SuspectBoard({ people }: SuspectBoardProps) {
  const { selectedPersonId, selectPerson } = useInvestigationStore();

  // Filter out Podo and sort by suspicion
  const suspects = people.filter((p) => p.name.toLowerCase() !== 'podo');
  const podo = people.find((p) => p.name.toLowerCase() === 'podo');

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Sticky header */}
      <div className="flex items-center justify-between pb-3 sticky top-0 bg-bg z-10">
        <h2 className="text-sm">Suspect Board</h2>
        <span className="neo-label">{suspects.length} persons</span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pr-1">
        {/* Podo - victim card */}
        {podo && (
          <div className="mb-3">
            <span className="neo-label block mb-1 text-accent-red">● Missing Person</span>
            <PersonCard
              person={podo}
              rank={0}
              onClick={() => selectPerson(podo.id)}
              isSelected={selectedPersonId === podo.id}
            />
          </div>
        )}

        {/* Suspects grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          {suspects.map((person, i) => (
            <PersonCard
              key={person.id}
              person={person}
              rank={i + 1}
              onClick={() => selectPerson(person.id)}
              isSelected={selectedPersonId === person.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
