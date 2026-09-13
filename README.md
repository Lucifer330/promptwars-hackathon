# Smart Event Experience Platform

A production-quality web platform designed to streamline large-scale event navigation, session discovery, real-time crowd coordination, emergency SOS dispatch, accessibility compliance, and organizer operational control.

---

## Problem Statement

Large events (conferences, expos, summits, festivals) often face severe operational challenges:
- Confusing venue layouts causing attendee disorientation
- Overcrowded stages, restrooms, and dining halls
- Lack of step-free accessible navigation for attendees with mobility needs
- Delayed schedule announcements or location changes
- Fragmented emergency support and slow incident response times

Build a web-based **Smart Event Experience** platform that makes events organized, accessible, safe, and engaging for both attendees and organizers.

---

## Problem

Event attendees waste significant time wandering crowded halls, missing priority sessions, and struggling to locate essentials like accessible restrooms, food courts, or first-aid stations. Simultaneously, organizers lack centralized visibility into crowd surges, emergency incidents, and broadcast communication.

---

## Solution

**Smart Event Experience** provides an all-in-one responsive web platform uniting attendees and organizers into a single interactive ecosystem:
- **Attendees** gain an interactive vector map with Dijkstra shortest pathfinding using a Min-Priority Queue (including step-free wheelchair routes), an explainable rule-based session recommendation engine, live crowd density telemetry, one-tap emergency SOS dispatching, and broadcast notifications.
- **Organizers** gain a dedicated Command Desk to monitor venue telemetry, manage session schedules, dispatch emergency responders to active SOS alerts, override crowd advisories, and publish instant venue announcements.

---

## Key Features

1. **Interactive Vector Venue Map & Pathfinding**: Interactive floor plan with live location pins for stages, workshops, booths, food courts, restrooms, first-aid, security, and helpdesks. Implements Dijkstra pathfinding via a Binary Min-Heap (`MinPriorityQueue`) with step-by-step route directions, distance, estimated walking time, and step-free wheelchair options.
2. **Explainable Recommendation Engine**: Transparent rule-based session scoring based on user-selected technical interests (`AI & Data`, `Web & Cloud`, `UX & Product`, `Security & DevOps`) with precomputed $O(1)$ `Set` lookups and rationale tags.
3. **Live Crowd Coordination**: Real-time zone density tracking (LOW, MODERATE, HIGH, CRITICAL) with automated alternate route suggestions for high-congestion areas and queue time estimates for food courts and restrooms.
4. **Emergency & SOS Dispatch Unit**: Rapid incident reporting (Medical, Security, Lost Item, Mobility Help) with mock dispatch status tracking and direct event hotline links. Includes strict input boundary sanitization (500 char description cap, enum verification).
5. **Accessibility Suite**: Built-in High Contrast mode, text font scaling (1x, 1.25x, 1.5x), step-free route filter, reduced motion support, semantic HTML5, and ARIA live regions.
6. **Real-Time Announcement Engine**: Toast notifications and broadcast drawer for urgent alerts, schedule shifts, and crowd notices.
7. **Organizer Command Desk**: Operations KPI dashboard, live SOS incident triage desk, session schedule editor, and broadcast publisher.

---

## User Roles

### A. Attendee
- Discover upcoming sessions, keynotes, and workshops.
- Receive explainable personalized session recommendations based on technical interests.
- Calculate shortest walking routes across the venue with optional step-free accessibility filters.
- Monitor zone crowd density and amenity queue wait times.
- Trigger emergency SOS dispatch requests.
- Receive live organizer broadcast updates.

### B. Organizer
- Access the operational Command Desk.
- Monitor venue occupancy, high-density zones, and active incidents.
- Respond to emergency SOS tickets and update dispatch status (Pending → In Progress → Resolved).
- Adjust or override zone crowd advisories.
- Edit session timings, stage locations, and room capacities.
- Broadcast announcements to all connected attendees.

---

## End-to-End Workflow

```text
OPEN EVENT PLATFORM
        │
        ├──► DISCOVER & SEARCH SESSIONS (Filter by category, time, speaker)
        │         │
        │         └──► TAILOR INTERESTS ──► RECEIVE EXPLAINABLE RECOMMENDATIONS
        │
        ├──► NAVIGATE VENUE MAP (Select start & destination)
        │         │
        │         └──► TOGGLE ACCESSIBLE ROUTE ──► GET STEP-BY-STEP PATH & ETA
        │
        ├──► MONITOR CROWD DENSITY (Check LOW/MODERATE/HIGH status & alternate zones)
        │
        ├──► RECEIVE REAL-TIME BROADCASTS (Urgent alerts, schedule shifts)
        │
        ├──► EMERGENCY SOS SUPPORT (One-tap incident dispatch request)
        │
        └──► ORGANIZER COMMAND DESK (Manage sessions, resolve SOS, broadcast updates)
```

---

## Architecture

Built with a modular React + TypeScript architecture utilizing a single reactive state store (`EventContext`) with memoized provider values for optimal render performance.

```text
src/
├── types/                # TypeScript Interfaces (Session, Zone, Location, SOSIncident, Route)
├── data/                 # Realistic Initial Summit Data (mockData.ts)
├── utils/                # Core Algorithms (pathfinding.ts, priorityQueue.ts, recommendations.ts)
├── context/              # Central State Store (EventContext.tsx)
├── components/
│   ├── layout/           # Navbar, AccessibilityBar
│   ├── attendee/         # InteractiveMap, EventDiscovery, CrowdMonitor, EmergencySOS
│   ├── organizer/        # OrganizerDashboard
│   └── common/           # Toast, Modals, Badges
└── tests/                # Vitest Test Suite (pathfinding, priorityQueue, recommendations, context, discovery, navigation, crowd, organizer)
```

---

## Tech Stack

- **Frontend Framework**: React 18 (TypeScript) + Vite 5
- **Styling & UI**: Vanilla Tailwind CSS v3 + Lucide Icons
- **Testing**: Vitest + React Testing Library + JSDOM
- **Code Quality**: TypeScript 5.3 (Strict Mode)

---

## Problem Statement Alignment

| Problem Statement Requirement | Project Feature | File / Module | User Value | Verified Result |
| :--- | :--- | :--- | :--- | :--- |
| **Interactive Navigation** | Dijkstra Pathfinding ($O((V+E)\log V)$ Binary Heap) & Vector Map | [`src/components/attendee/InteractiveMap.tsx`](file:///c:/Users/ry384/Desktop/promptwar/promptwars-hackathon/src/components/attendee/InteractiveMap.tsx), [`src/utils/pathfinding.ts`](file:///c:/Users/ry384/Desktop/promptwar/promptwars-hackathon/src/utils/pathfinding.ts) | Helps attendees locate stages, booths, restrooms, food courts, and helpdesks | Step-by-step walking directions with ETA and distance |
| **Event Discovery** | Multi-filter Agenda & Explorer | [`src/components/attendee/EventDiscovery.tsx`](file:///c:/Users/ry384/Desktop/promptwar/promptwars-hackathon/src/components/attendee/EventDiscovery.tsx) | Allows browsing upcoming sessions, keynotes, speakers, and room capacities | Searchable, filterable agenda with bookmarking |
| **Personalized Recommendations** | Rule-Based Explainable Affinity Engine | [`src/utils/recommendations.ts`](file:///c:/Users/ry384/Desktop/promptwar/promptwars-hackathon/src/utils/recommendations.ts) | Suggests relevant sessions based on attendee technical interests | Ranked session list with clear match rationale tags |
| **Crowd Coordination** | Live Zone Density Telemetry & Alternate Routes | [`src/components/attendee/CrowdMonitor.tsx`](file:///c:/Users/ry384/Desktop/promptwar/promptwars-hackathon/src/components/attendee/CrowdMonitor.tsx) | Identifies busy zones (LOW/MODERATE/HIGH/CRITICAL) and queue times | Reroutes attendees away from congested zones |
| **Emergency & SOS Support** | Instant SOS Dispatch Desk & Hotlines | [`src/components/attendee/EmergencySOS.tsx`](file:///c:/Users/ry384/Desktop/promptwar/promptwars-hackathon/src/components/attendee/EmergencySOS.tsx) | Provides fast access to medical, security, and lost item assistance | One-tap dispatch ticket creation with status tracking |
| **Accessibility Features** | Step-Free Route Filtering, High Contrast & ARIA | [`src/components/layout/AccessibilityBar.tsx`](file:///c:/Users/ry384/Desktop/promptwar/promptwars-hackathon/src/components/layout/AccessibilityBar.tsx) | Ensures accessibility for attendees with different needs | Wheelchair route toggle, high contrast mode, font scaling |
| **Real-Time Updates** | Announcement Broadcast Engine & Toasts | [`src/components/common/Toast.tsx`](file:///c:/Users/ry384/Desktop/promptwar/promptwars-hackathon/src/components/common/Toast.tsx) | Keeps attendees informed of urgent alerts and schedule shifts | Real-time broadcast drawer and toast alerts |
| **Organizer Dashboard** | Operations Command Desk & Incident Triage | [`src/components/organizer/OrganizerDashboard.tsx`](file:///c:/Users/ry384/Desktop/promptwar/promptwars-hackathon/src/components/organizer/OrganizerDashboard.tsx) | Enables event managers to oversee crowds, resolve SOS incidents, and publish alerts | Operational control center with live overrides |

---

## Navigation & Pathfinding Optimization

Venue navigation utilizes Dijkstra graph pathfinding implemented with a custom Binary Min-Heap ([`src/utils/priorityQueue.ts`](file:///c:/Users/ry384/Desktop/promptwar/promptwars-hackathon/src/utils/priorityQueue.ts)).
- **Time Complexity**: $O((V + E) \log V)$ node exploration instead of linear scanning.
- **Step-Free Accessibility Filter**: Toggling Step-Free mode excludes edges with stairs, ensuring wheelchair users are directed through accessible elevators and ramps.

---

## Personalization

The recommendation engine scores sessions using transparent rule-based scoring:
- +40 points for matching selected interest tags
- +30 points for matching preferred category tracks
- +15 points for featured summit keynotes
- +10 points for sessions with open seating

Every recommended session displays explicit rationale tags explaining *why* it was suggested. Interest tag checks are precomputed into a `Set` for $O(1)$ membership tests.

---

## Crowd Coordination

Zones are categorized into four states:
- **LOW** (&lt; 40% occupancy)
- **MODERATE** (40% - 75% occupancy)
- **HIGH** (75% - 90% occupancy)
- **CRITICAL** (&gt; 90% occupancy)

When a zone reaches HIGH or CRITICAL, the platform displays prominent advisories directing attendees to less congested alternate zones.

---

## Emergency & SOS

The SOS desk supports four incident classifications: Medical First Aid, Security Incident, Lost Belonging, and Mobility Assistance. Submitting an SOS dispatches a ticket to the Organizer Command Desk where staff can track and update status from `PENDING` to `IN_PROGRESS` and `RESOLVED`. Inputs are sanitized and length-capped for safety. Direct telephone hotlines for medical and security are also provided.

---

## Accessibility

Designed to adhere to key WCAG 2.2 accessibility principles:
- Contrast ratios and High Contrast Mode theme
- Full keyboard navigation focus rings
- Font scaling options (1x, 1.25x, 1.5x)
- Reduced motion setting for animations
- ARIA live region status announcements (`aria-live="polite"`)
- Step-free wheelchair navigation routes

---

## Real-Time Updates

Announcements are categorized by priority: `URGENT`, `SCHEDULE`, `CROWD`, and `GENERAL`. Organizers can publish broadcasts instantly, which trigger toast alerts and update attendee announcement drawers.

---

## Organizer Dashboard

The Organizer Command Desk provides four primary operational modules:
1. **Event Overview KPIs**: Track total attendees, high-density zones, active SOS alerts, and broadcast metrics.
2. **SOS Incident Desk**: Review incoming emergency calls and update dispatch status.
3. **Broadcast Dispatcher**: Draft and publish instant announcements.
4. **Crowd & Session Controls**: Override zone crowd levels and edit session room capacities or timings.

---

## Security

- **Zero Hardcoded Secrets**: No credentials, API keys, or private tokens embedded.
- **Environment Configuration**: Controlled via [`.env.example`](file:///c:/Users/ry384/Desktop/promptwar/promptwars-hackathon/.env.example).
- **Clean Repository**: [`.gitignore`](file:///c:/Users/ry384/Desktop/promptwar/promptwars-hackathon/.gitignore) ignores build outputs, node_modules, logs, and sensitive files.
- **Input Sanitization & Boundary Validation**: Cap string lengths and validate enum types. React JSX auto-escaping prevents XSS.

---

## Testing

The project includes an extensive Vitest test suite (`22/22 tests passing` across 8 test files):
- MinPriorityQueue binary min-heap data structure and priority ordering
- Pathfinding graph algorithms, invalid node handling, and accessibility filters
- Recommendation engine scoring, fallback modes, and rationale calculation
- Context provider state updates and reactive broadcasting
- Event discovery search and category filtering
- Emergency SOS ticket dispatching and status transitions
- Organizer Dashboard actions and zone crowd level overrides

Run tests via:
```bash
npm run test
```

See [`TESTING.md`](file:///c:/Users/ry384/Desktop/promptwar/promptwars-hackathon/TESTING.md) for full execution logs.

---

## Performance / Efficiency

- **Algorithm Complexity**: $O((V+E)\log V)$ pathfinding and $O(1)$ recommendation lookups.
- **Fast Build**: Vite 5 produces a production bundle of 238 kB (67 kB gzipped).
- **Strict Size Budget**: Entire repository size remains strictly under 10 MB (source files ~0.36 MB).
- **Minimal Dependencies**: Lightweight footprint relying solely on React, Lucide Icons, and Tailwind CSS.

---

## Setup

Ensure Node.js `v18+` and `npm` are installed.

```bash
git clone <repo-url>
cd promptwars-hackathon
npm install
```

---

## Environment Variables

Copy `.env.example` to `.env` if custom configuration is needed:
```env
VITE_APP_TITLE="Smart Event Experience"
VITE_EVENT_NAME="Global Tech Summit 2026"
VITE_DEMO_MODE="true"
```

---

## Running Locally

Start the Vite development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## Demo

1. **Attendee Flow**:
   - Open home view → Browse sessions → Toggle interest tags (e.g. `AI & Data`) → View recommendations.
   - Click "Venue Navigation" → Select Start & Destination → Toggle "Step-Free Wheelchair Mode" → View turn-by-turn route.
   - Click "Crowd Coordination" → View zone densities & queue times.
   - Click "Emergency & SOS" → Dispatch an SOS signal.
2. **Organizer Flow**:
   - Switch role to "Organizer" in the top navbar.
   - View KPI Overview → Triage the SOS incident created above (change status to `IN_PROGRESS`).
   - Use Broadcast Dispatcher to publish an urgent announcement → Observe toast alert on attendee view.

---

## Known Limitations

- Pathfinding operates on standard graph nodes; floor plan overlay uses 2D vector positioning.
- Emergency dispatch features operate as a realistic on-site demo simulation.

---

## Future Scope

- **Bluetooth Low Energy (BLE) Beacons**: Integration with indoor positioning sensors for live auto-geolocated positioning.
- **Multi-language i18n**: Localization into Spanish, French, German, and Japanese.
- **Push Notifications**: Progressive Web App (PWA) push notification registration.
