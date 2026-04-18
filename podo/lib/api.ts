import type {
  AnyRecord,
  Checkin,
  Message,
  Sighting,
  PersonalNote,
  AnonymousTip,
  SourceType,
} from '@/store/types';

// ── Form IDs (moved from .env as requested) ──────────────────────────
export const FORM_IDS = {
  checkins: '261065067494966',
  messages: '261065765723966',
  sightings: '261065244786967',
  personalNotes: '261065509008958',
  anonymousTips: '261065875889981',
} as const;

// ── Jotform response types ───────────────────────────────────────────
interface JotformAnswer {
  name: string;
  order: string;
  text: string;
  type: string;
  answer?: string;
}

interface JotformSubmission {
  id: string;
  form_id: string;
  created_at: string;
  status: string;
  answers: Record<string, JotformAnswer>;
}

interface JotformResponse {
  responseCode: number;
  message: string;
  content: JotformSubmission[];
  resultSet: {
    offset: number;
    limit: number;
    count: number;
  };
}

// ── Helpers ──────────────────────────────────────────────────────────

/** Extract an answer value by its `name` field from the answers object */
function getAnswer(answers: Record<string, JotformAnswer>, name: string): string {
  const entry = Object.values(answers).find((a) => a.name === name);
  return entry?.answer?.trim() ?? '';
}

/** Parse DD-MM-YYYY HH:mm → ISO-ish string that Date() can parse */
function parseTimestamp(raw: string): string {
  // Format: "18-04-2026 20:31"
  const match = raw.match(/^(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2})$/);
  if (match) {
    const [, day, month, year, hour, minute] = match;
    return `${year}-${month}-${day}T${hour}:${minute}:00`;
  }
  return raw; // fallback
}

// ── Parsers per source type ──────────────────────────────────────────

function parseCheckin(sub: JotformSubmission): Checkin {
  const personName = getAnswer(sub.answers, 'personName');
  const timestamp = parseTimestamp(getAnswer(sub.answers, 'timestamp'));
  const location = getAnswer(sub.answers, 'location');
  const coordinates = getAnswer(sub.answers, 'coordinates');
  const note = getAnswer(sub.answers, 'note');

  return {
    id: sub.id,
    sourceType: 'checkin',
    timestamp,
    personName,
    location,
    coordinates,
    content: note || `${personName} checked in at ${location}`,
    note,
  };
}

function parseMessage(sub: JotformSubmission): Message {
  const senderName = getAnswer(sub.answers, 'senderName');
  const recipientName = getAnswer(sub.answers, 'recipientName');
  const timestamp = parseTimestamp(getAnswer(sub.answers, 'timestamp'));
  const location = getAnswer(sub.answers, 'location');
  const coordinates = getAnswer(sub.answers, 'coordinates');
  const text = getAnswer(sub.answers, 'text');
  const urgency = getAnswer(sub.answers, 'urgency') as 'low' | 'medium' | 'high';

  return {
    id: sub.id,
    sourceType: 'message',
    timestamp,
    personName: senderName,
    location,
    coordinates,
    content: text,
    senderName,
    recipientName,
    text,
    urgency: urgency || 'low',
    relatedPersons: [senderName, recipientName].filter(Boolean),
  };
}

function parseSighting(sub: JotformSubmission): Sighting {
  const personName = getAnswer(sub.answers, 'personName');
  const seenWith = getAnswer(sub.answers, 'seenWith');
  const timestamp = parseTimestamp(getAnswer(sub.answers, 'timestamp'));
  const location = getAnswer(sub.answers, 'location');
  const coordinates = getAnswer(sub.answers, 'coordinates');
  const note = getAnswer(sub.answers, 'note');

  return {
    id: sub.id,
    sourceType: 'sighting',
    timestamp,
    personName,
    location,
    coordinates,
    content: note || `${personName} spotted${seenWith ? ` with ${seenWith}` : ''}`,
    witnessName: seenWith || 'Unknown',
    description: note,
    relatedPersons: [personName, seenWith].filter(Boolean),
  };
}

function parsePersonalNote(sub: JotformSubmission): PersonalNote {
  const authorName = getAnswer(sub.answers, 'authorName');
  const timestamp = parseTimestamp(getAnswer(sub.answers, 'timestamp'));
  const location = getAnswer(sub.answers, 'location');
  const coordinates = getAnswer(sub.answers, 'coordinates');
  const note = getAnswer(sub.answers, 'note');
  const mentionedPeople = getAnswer(sub.answers, 'mentionedPeople');

  const mentioned = mentionedPeople
    ? mentionedPeople.split(',').map((n) => n.trim()).filter(Boolean)
    : [];

  return {
    id: sub.id,
    sourceType: 'note',
    timestamp,
    personName: authorName,
    location,
    coordinates,
    content: note,
    author: authorName,
    text: note,
    relatedPersons: [authorName, ...mentioned].filter(Boolean),
  };
}

function parseAnonymousTip(sub: JotformSubmission): AnonymousTip {
  const timestamp = parseTimestamp(getAnswer(sub.answers, 'timestamp'));
  const location = getAnswer(sub.answers, 'location');
  const coordinates = getAnswer(sub.answers, 'coordinates');
  const suspectName = getAnswer(sub.answers, 'suspectName');
  const tip = getAnswer(sub.answers, 'tip');
  const confidence = getAnswer(sub.answers, 'confidence') as 'high' | 'medium' | 'low';

  return {
    id: sub.id,
    sourceType: 'tip',
    timestamp,
    personName: suspectName || undefined,
    location,
    coordinates,
    content: tip,
    text: tip,
    reliability: confidence || 'low',
    relatedPersons: suspectName ? [suspectName] : [],
  };
}

// ── Main fetch function ──────────────────────────────────────────────

const PARSER_MAP: Record<string, (sub: JotformSubmission) => AnyRecord> = {
  [FORM_IDS.checkins]: parseCheckin,
  [FORM_IDS.messages]: parseMessage,
  [FORM_IDS.sightings]: parseSighting,
  [FORM_IDS.personalNotes]: parsePersonalNote,
  [FORM_IDS.anonymousTips]: parseAnonymousTip,
};

const SOURCE_TYPE_MAP: Record<string, SourceType> = {
  [FORM_IDS.checkins]: 'checkin',
  [FORM_IDS.messages]: 'message',
  [FORM_IDS.sightings]: 'sighting',
  [FORM_IDS.personalNotes]: 'note',
  [FORM_IDS.anonymousTips]: 'tip',
};

/**
 * Fetch all submissions from a single Jotform form via the Next.js API route.
 */
async function fetchFormSubmissions(formId: string): Promise<AnyRecord[]> {
  const res = await fetch(`/api/records?formId=${formId}`);

  if (!res.ok) {
    const errText = await res.text().catch(() => 'Unknown error');
    throw new Error(`Failed to fetch form ${formId}: ${res.status} ${errText}`);
  }

  const data: JotformResponse = await res.json();

  if (data.responseCode !== 200) {
    throw new Error(`Jotform API error for ${formId}: ${data.message}`);
  }

  const parser = PARSER_MAP[formId];
  if (!parser) {
    throw new Error(`No parser found for form ID ${formId}`);
  }

  return data.content.map(parser);
}

/**
 * Fetch all records from all 5 Jotform forms in parallel.
 * Returns a flat array of all records sorted by timestamp.
 */
export async function fetchAllRecords(): Promise<AnyRecord[]> {
  const formIds = Object.values(FORM_IDS);

  const results = await Promise.allSettled(
    formIds.map((id) => fetchFormSubmissions(id))
  );

  const allRecords: AnyRecord[] = [];
  const errors: string[] = [];

  results.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      allRecords.push(...result.value);
    } else {
      const sourceType = SOURCE_TYPE_MAP[formIds[i]] ?? formIds[i];
      errors.push(`${sourceType}: ${result.reason?.message ?? 'Unknown error'}`);
      console.error(`[API] Failed to fetch ${sourceType}:`, result.reason);
    }
  });

  if (errors.length > 0 && allRecords.length === 0) {
    throw new Error(`All form fetches failed:\n${errors.join('\n')}`);
  }

  // Sort by timestamp descending
  return allRecords.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}
