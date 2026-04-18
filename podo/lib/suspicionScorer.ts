import type { AnyRecord } from '@/store/types';

const PODO_DISAPPEARANCE = new Date('2026-04-18T21:10:00');

/**
 * Score a person 0–100 based on:
 * - Number of records linked to them (+5 per record, capped at 40)
 * - Presence in sightings with Podo specifically (+20)
 * - Anonymous tip mentions (+15 each, up to 30)
 * - Recency: last record within 1h of Podo's disappearance (+10)
 * - Multiple locations in short time (+5)
 */
export function computeSuspicionScore(
  personName: string,
  records: AnyRecord[]
): number {
  if (personName.toLowerCase() === 'podo') return 0;

  let score = 0;

  // +5 per record, capped at 40
  const recordCount = Math.min(records.length * 5, 40);
  score += recordCount;

  // +20 if they appear in a sighting alongside Podo
  const sightingsWithPodo = records.filter(
    (r) =>
      r.sourceType === 'sighting' &&
      r.relatedPersons?.some((p) => p.toLowerCase() === 'podo')
  );
  if (sightingsWithPodo.length > 0) {
    score += 20;
  }

  // +15 per anonymous tip mention, up to 30
  const tipMentions = records.filter((r) => r.sourceType === 'tip');
  score += Math.min(tipMentions.length * 15, 30);

  // +10 if last record is within 1h of disappearance
  const timestamps = records
    .map((r) => new Date(r.timestamp).getTime())
    .sort((a, b) => b - a);
  if (timestamps.length > 0) {
    const lastRecordTime = timestamps[0];
    const timeDiff = Math.abs(PODO_DISAPPEARANCE.getTime() - lastRecordTime);
    if (timeDiff <= 60 * 60 * 1000) {
      score += 10;
    }
  }

  // +5 if person appeared in multiple locations within 30 min
  const locTimeMap: { location: string; time: number }[] = records
    .filter((r) => r.location)
    .map((r) => ({ location: r.location!, time: new Date(r.timestamp).getTime() }))
    .sort((a, b) => a.time - b.time);

  for (let i = 1; i < locTimeMap.length; i++) {
    if (
      locTimeMap[i].location !== locTimeMap[i - 1].location &&
      locTimeMap[i].time - locTimeMap[i - 1].time <= 30 * 60 * 1000
    ) {
      score += 5;
      break;
    }
  }

  return Math.min(score, 100);
}
