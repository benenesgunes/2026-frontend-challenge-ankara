import type { AnyRecord, Person } from '@/store/types';
import { computeSuspicionScore } from './suspicionScorer';

/**
 * Normalize person name for grouping (lowercase, trimmed).
 */
function normalizeName(name: string): string {
  return name.toLowerCase().trim();
}

/**
 * Extract all person names referenced by a record.
 */
function extractPersonNames(record: AnyRecord): string[] {
  const names: string[] = [];

  if (record.personName) {
    names.push(record.personName);
  }

  if (record.relatedPersons) {
    names.push(...record.relatedPersons);
  }

  if (record.sourceType === 'message') {
    names.push(record.senderName, record.recipientName);
  }

  // Deduplicate
  const seen = new Set<string>();
  return names.filter((n) => {
    const normalized = normalizeName(n);
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

/**
 * Group all records by person, compute suspicion scores,
 * and return an array of Person objects sorted by suspicion desc.
 */
export function linkRecordsToPeople(records: AnyRecord[]): Person[] {
  const personMap = new Map<string, { displayName: string; records: AnyRecord[] }>();

  for (const record of records) {
    const names = extractPersonNames(record);
    for (const name of names) {
      const key = normalizeName(name);
      if (!personMap.has(key)) {
        personMap.set(key, { displayName: name, records: [] });
      }
      personMap.get(key)!.records.push(record);
    }
  }

  const people: Person[] = [];

  for (const [key, { displayName, records: linkedRecords }] of personMap) {
    // Deduplicate records by id
    const uniqueRecords = Array.from(
      new Map(linkedRecords.map((r) => [r.id, r])).values()
    );

    // Find last seen info
    const sortedByTime = [...uniqueRecords].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const lastRecord = sortedByTime[0];

    people.push({
      id: key,
      name: displayName,
      linkedRecords: uniqueRecords,
      suspicionScore: computeSuspicionScore(displayName, uniqueRecords),
      lastSeenLocation: lastRecord?.location,
      lastSeenAt: lastRecord?.timestamp,
    });
  }

  // Sort by suspicion score descending
  return people.sort((a, b) => b.suspicionScore - a.suspicionScore);
}
