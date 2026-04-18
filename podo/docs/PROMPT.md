# Missing Podo: The Ankara Case — Frontend Build Prompt

## Project Overview

Build a **neobrutalist investigation dashboard** called **"Missing Podo: The Ankara Case"** using **Next.js (App Router)**, **Tailwind CSS**, **TanStack Query**, **Zustand**, and **Lucide Icons**. This is a 3-hour frontend challenge by Jotform. The goal: fetch records from multiple API endpoints and display them as a coherent investigation UI that surfaces Podo's last-known sightings and highlights suspicious actors.

---

## Tech Stack

| Tool | Role |
|---|---|
| Next.js 14+ (App Router) | Routing, SSR, layout |
| Tailwind CSS | Styling (neobrutalism utility classes) |
| TanStack Query v5 | Server state, fetching, caching |
| Zustand | Client state (filters, selected person, UI state) |
| Lucide React | All icons |

---

## Neobrutalism Design System

Define these as Tailwind config extensions and CSS variables:

**Colors:**
- `--color-bg: #F5F0E8` — off-white parchment background
- `--color-surface: #FFFDF7` — card background
- `--color-black: #0A0A0A` — near-black for borders/text
- `--color-accent-yellow: #FFE500` — primary highlight
- `--color-accent-red: #FF3B30` — danger / most suspicious
- `--color-accent-blue: #0057FF` — links, active states
- `--color-accent-green: #00C853` — confirmed/safe states

**Typography:**
- Display font: `Space Grotesk` or `Bebas Neue` for headers
- Body font: `IBM Plex Mono` for data/records (monospace reinforces "case file" feel)
- All headings: `font-black`, `uppercase`, `tracking-tight`

**Borders & Shadows (neobrutalism core):**
- All cards/buttons: `border-2 border-black` (or `border-[3px]`)
- Shadows: `shadow-[4px_4px_0px_#0A0A0A]` — hard offset, no blur
- Hover state: `hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#0A0A0A]`
- Active/pressed: `translate-x-[2px] translate-y-[2px] shadow-none`
- Inputs: `border-2 border-black bg-[#FFFDF7] focus:outline-none focus:ring-2 focus:ring-[#FFE500]`

---

## Project File Structure

Place all of this at the **project root**:

```
/
├── app/
│   ├── layout.tsx              # Root layout: fonts, global styles, QueryProvider + ZustandProvider
│   ├── page.tsx                # Home → redirects or renders MainDashboard
│   ├── globals.css             # Tailwind directives + CSS variables
│   └── providers.tsx           # TanStack QueryClientProvider wrapper
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # "MISSING PODO" title bar, case status badge, global search
│   │   └── Sidebar.tsx         # Navigation: Timeline, People, Records, Map (bonus)
│   │
│   ├── dashboard/
│   │   ├── DashboardPage.tsx   # Main layout grid orchestrator
│   │   ├── SuspectBoard.tsx    # Grid of person cards with suspicion score
│   │   ├── TimelinePanel.tsx   # Chronological event list (all sources merged)
│   │   ├── RecordFeed.tsx      # Scrollable feed of raw records with source badges
│   │   └── StatsBar.tsx        # Summary: total sightings, last seen location, top suspect
│   │
│   ├── records/
│   │   ├── RecordCard.tsx      # Individual record card (polymorphic: checkin/message/sighting/etc.)
│   │   ├── SourceBadge.tsx     # Color-coded badge per source type
│   │   └── RecordDetail.tsx    # Expanded detail drawer/modal for a selected record
│   │
│   ├── people/
│   │   ├── PersonCard.tsx      # Person tile with last seen, suspicion level, linked records count
│   │   ├── PersonDetail.tsx    # Full profile panel: all records linked to this person
│   │   └── SuspicionMeter.tsx  # Visual bar showing suspicion score (neobrutalist progress bar)
│   │
│   ├── filters/
│   │   ├── FilterBar.tsx       # Search input + filter pills (by source, by location, by person)
│   │   └── FilterPill.tsx      # Individual toggleable pill component
│   │
│   ├── ui/
│   │   ├── Button.tsx          # Neobrutalist button (variants: primary/danger/ghost)
│   │   ├── Card.tsx            # Base card with hard shadow
│   │   ├── Badge.tsx           # Status badges
│   │   ├── Drawer.tsx          # Side drawer for detail views
│   │   ├── EmptyState.tsx      # "No records found" neobrutalist empty state
│   │   ├── ErrorState.tsx      # Error UI with retry button
│   │   └── Spinner.tsx         # Loading state (brutalist animated block, not a circle)
│   │
│   └── map/ (bonus)
│       └── PodoMap.tsx         # Leaflet or react-simple-maps with pinned sightings
│
├── hooks/
│   ├── useCheckins.ts          # TanStack Query hook → GET /api/checkins
│   ├── useMessages.ts          # TanStack Query hook → GET /api/messages
│   ├── useSightings.ts         # TanStack Query hook → GET /api/sightings
│   ├── usePersonalNotes.ts     # TanStack Query hook → GET /api/personal-notes
│   ├── useAnonymousTips.ts     # TanStack Query hook → GET /api/anonymous-tips
│   └── useAllRecords.ts        # Aggregator hook: merges all 5 sources, attaches sourceType tag
│
├── store/
│   ├── useInvestigationStore.ts  # Zustand store (see below)
│   └── types.ts                  # All shared TypeScript types
│
├── lib/
│   ├── api.ts                  # Fetch functions (raw fetchers called by hooks)
│   ├── recordLinker.ts         # Logic to match records across sources by person name/fuzzy match
│   ├── suspicionScorer.ts      # Pure function: scores a person based on frequency, recency, anomalies
│   └── constants.ts            # API base URL, source type colors/labels/icons map
│
└── public/
    └── podo.png                # Podo mascot image (optional, for flavor)
```

---

## Zustand Store (`store/useInvestigationStore.ts`)

```ts
interface InvestigationState {
  // Selection
  selectedPersonId: string | null;
  selectedRecordId: string | null;
  
  // Filters
  searchQuery: string;
  activeSourceFilters: SourceType[]; // 'checkin' | 'message' | 'sighting' | 'note' | 'tip'
  activeLocationFilter: string | null;
  
  // UI
  isDetailDrawerOpen: boolean;
  detailDrawerTarget: 'person' | 'record' | null;
  
  // Actions
  selectPerson: (id: string | null) => void;
  selectRecord: (id: string | null) => void;
  setSearchQuery: (q: string) => void;
  toggleSourceFilter: (source: SourceType) => void;
  setLocationFilter: (loc: string | null) => void;
  openDrawer: (target: 'person' | 'record') => void;
  closeDrawer: () => void;
}
```

---

## Data Model (`store/types.ts`)

```ts
export type SourceType = 'checkin' | 'message' | 'sighting' | 'note' | 'tip';

export interface BaseRecord {
  id: string;
  sourceType: SourceType;
  timestamp: string;        // ISO string
  personName?: string;
  location?: string;
  content?: string;
  relatedPersons?: string[];
}

export interface Checkin extends BaseRecord { sourceType: 'checkin'; location: string; }
export interface Message extends BaseRecord { sourceType: 'message'; recipient?: string; }
export interface Sighting extends BaseRecord { sourceType: 'sighting'; witnessName?: string; }
export interface PersonalNote extends BaseRecord { sourceType: 'note'; author?: string; }
export interface AnonymousTip extends BaseRecord { sourceType: 'tip'; reliability?: 'high' | 'medium' | 'low'; }

export type AnyRecord = Checkin | Message | Sighting | PersonalNote | AnonymousTip;

export interface Person {
  id: string;
  name: string;
  linkedRecords: AnyRecord[];
  suspicionScore: number;   // 0–100, computed by suspicionScorer.ts
  lastSeenLocation?: string;
  lastSeenAt?: string;
}
```

---

## TanStack Query Setup

- Wrap `app/layout.tsx` with `<QueryClientProvider>` via `app/providers.tsx`
- `staleTime: 1000 * 60 * 2` (2 min)
- `retry: 2`
- Each hook returns `{ data, isLoading, isError, refetch }`
- `useAllRecords.ts` uses `useQueries` to fetch all 5 in parallel, then merges and sorts by timestamp descending

---

## Core Features to Implement (in priority order)

**1. Data Fetching** — All 5 endpoints fetched via TanStack Query hooks, results merged in `useAllRecords`

**2. Record Feed** — Scrollable list with `RecordCard` per item, `SourceBadge` showing the source type with neobrutalist color coding:
- Checkin → yellow
- Message → blue
- Sighting → red
- Note → green
- Tip → purple

**3. Suspect Board** — Grid of `PersonCard` components, each showing name, record count, last seen, and a `SuspicionMeter`. Sorted by suspicion score descending. The top suspect gets a red `MOST SUSPICIOUS` stamp badge.

**4. Record Linking** — `recordLinker.ts` groups records by normalized person name (lowercase trim, fuzzy match optional). Each `Person` object aggregates all records mentioning them.

**5. Search & Filter** — `FilterBar` with a text input (filters by person name, location, content) and source type pills. All filtering is done client-side from Zustand + derived selectors.

**6. Detail View** — Clicking a `PersonCard` or `RecordCard` opens `Drawer` with `PersonDetail` or `RecordDetail` respectively. Shows all linked records, timeline within that person/record context.

**7. State Handling** — `Spinner` during loading, `ErrorState` with retry on error, `EmptyState` when filters return nothing.

---

## Suspicion Scoring Logic (`lib/suspicionScorer.ts`)

Score a person 0–100 based on:
- Number of records linked to them (+5 per record, capped at 40)
- Presence in sightings with Podo specifically (+20)
- Anonymous tip mentions (+15 each, up to 30)
- Recency: last record within 24h of Podo's disappearance (+10)
- Multiple locations in short time (+5)

---

## Layout Structure (`components/dashboard/DashboardPage.tsx`)

```
┌─────────────────────────────────────────┐
│              HEADER                     │
│  "MISSING PODO: THE ANKARA CASE"        │
│  [search input]          [Case #00421]  │
├──────────┬──────────────────────────────┤
│          │   STATS BAR                  │
│ SIDEBAR  │   (total records, last seen, │
│          │    top suspect)              │
│ Timeline │──────────────────────────────│
│ People   │  SUSPECT BOARD  │ RECORD     │
│ Records  │  (person cards) │ FEED       │
│ Map(+)   │                 │ (timeline) │
│          │                 │            │
└──────────┴─────────────────┴────────────┘
         [DETAIL DRAWER slides from right]
```

---

## Neobrutalism UI Rules (apply everywhere)

- **No border-radius** on cards/buttons (use `rounded-none`)
- **Hard box shadows** only: `shadow-[4px_4px_0px_0px_#0A0A0A]`
- **Bold borders**: `border-2 border-black` or `border-[3px] border-black`
- **Hover = shift**: `hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#0A0A0A]`
- **Active = sink**: `active:translate-x-0.5 active:translate-y-0.5 active:shadow-none`
- **Accent fills** for selected/active states (yellow bg, black text)
- **Uppercase labels** everywhere with `tracking-widest text-xs`
- **Monospace** for all data values (timestamps, IDs, record counts)
- **Noise/grain texture** on the background via a CSS `::before` pseudo-element with SVG noise

---

## Bonus Features (implement after core)

1. **`PodoMap.tsx`** — Use `react-leaflet` with custom marker pins (black border, colored fill per source type). Clicking a pin filters the record feed to that location.
2. **Timeline View** — A vertical timeline sorted by timestamp with connector lines, grouping events into "phases" of Podo's journey.
3. **"Most Suspicious" panel** — Always-visible sidebar card highlighting the top-scored person with a red stamp and all their flags listed.
4. **Fuzzy matching** in `recordLinker.ts` — Use a simple Levenshtein distance or `fuse.js` to match slightly different spellings of the same name across sources.

---

## README.md (required for submission)

```md
## Setup
npm install && npm run dev

## Architecture
- Fetching: TanStack Query hooks in /hooks, all merged via useAllRecords
- State: Zustand store in /store/useInvestigationStore.ts
- Linking: /lib/recordLinker.ts groups records by person name
- Scoring: /lib/suspicionScorer.ts computes 0-100 suspicion per person

## Design
Neobrutalism: hard shadows, bold borders, monospace data font, yellow/red accent system
```
