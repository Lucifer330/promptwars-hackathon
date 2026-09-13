# Testing Documentation & Verification Suite

## Overview
This document outlines the testing strategy, frameworks, executed test cases, and empirical results for **Smart Event Experience**.

---

## Test Stack & Environment
- **Test Runner & Assertion Library**: Vitest `v1.6.1`
- **DOM Rendering & Assertion Utility**: `@testing-library/react` + `@testing-library/jest-dom`
- **Environment**: `jsdom` (simulated browser environment)
- **TypeScript Checking**: `tsc --noEmit`

---

## Executing Tests

To run the full unit and integration test suite synchronously:
```bash
npm run test
```

To run TypeScript compilation & build verification:
```bash
npm run build
```

---

## Tested Functional Areas

### 1. Interactive Venue Navigation & Pathfinding (`src/tests/pathfinding.test.ts`)
- **Dijkstra Shortest Path**: Verifies that `findShortestRoute` accurately computes the shortest physical distance (e.g. 40 meters from Central Helpdesk to Main Stage Auditorium).
- **Same Node Navigation**: Verifies that selecting identical start and destination nodes returns 0 distance and 0 estimated walking minutes.
- **Accessibility Filtering**: Verifies that enabling `accessibleOnly = true` filters out route segments requiring stairs (e.g., upper level Workshop Lab B access) when step-free routes are requested.

### 2. Personalization & Recommendation Engine (`src/tests/recommendations.test.ts`)
- **Rule-Based Affinity Scoring**: Verifies that sessions matching user-selected interest tags (e.g., `AI & Data`, `LLMs`) receive higher recommendation scores and explainable reason tags.
- **Saved Session Exclusion**: Verifies that sessions already added to the user's agenda are automatically excluded from the recommendation stream to prevent duplicates.

### 3. State Management & EventProvider Integration (`src/tests/eventContext.test.tsx`)
- **Role Switching**: Verifies transition between Attendee view and Organizer Command Desk.
- **View Navigation**: Verifies tab switching across Discovery, Venue Map, Crowd Coordination, Emergency SOS, and Dashboard.
- **Reactive Announcement Dispatching**: Verifies that organizer broadcast calls dynamically update state and increment notification counters.

---

## Actual Empirical Results

```text
 RUN  v1.6.1 C:/Users/ry384/Desktop/promptwar/promptwars-hackathon

 ✓ src/tests/pathfinding.test.ts  (3 tests)
 ✓ src/tests/recommendations.test.ts  (2 tests)
 ✓ src/tests/eventContext.test.tsx  (2 tests)

 Test Files  3 passed (3)
      Tests  7 passed (7)
   Start at  11:22:02
   Duration  2.19s
```

- **Build Verification**: `npm run build` completed with zero errors, generating static production bundle artifacts in `dist/`.

---

## Known Gaps & Future Scope
- **Web Worker Pathfinding**: For massive venues with 10,000+ nodes, pathfinding can be moved to a Web Worker thread.
- **E2E Browser Automation**: Future expansion can include Playwright end-to-end user journey tests across mobile and desktop viewports.
