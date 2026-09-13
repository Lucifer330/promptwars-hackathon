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

To run TypeScript compilation & production build verification:
```bash
npm run build
```

---

## Tested Functional Areas

### 1. Interactive Venue Navigation & Pathfinding (`src/tests/pathfinding.test.ts`, `src/tests/navigation.test.ts`)
- **Dijkstra Shortest Path**: Verifies that `findShortestRoute` accurately computes the shortest physical distance (e.g. 40 meters from Central Helpdesk to Main Stage Auditorium).
- **Same Node Navigation**: Verifies that selecting identical start and destination nodes returns 0 distance and 0 estimated walking minutes.
- **Accessibility Route Filtering**: Verifies that enabling `accessibleOnly = true` filters out route segments requiring stairs (e.g., upper level Workshop Lab B access) when step-free routes are requested.
- **Invalid Location Error Handling**: Verifies that passing non-existent node IDs returns `null` safely without unhandled exceptions.
- **Step Count & ETA Calculation**: Verifies that walking step instructions and estimated minutes are correctly calculated.

### 2. Personalization & Recommendation Engine (`src/tests/recommendations.test.ts`, `src/tests/discovery.test.ts`)
- **Rule-Based Affinity Scoring**: Verifies that sessions matching user-selected interest tags (e.g., `AI & Data`, `LLMs`) receive higher recommendation scores and explainable reason tags.
- **Saved Session Exclusion**: Verifies that sessions already added to the user's agenda are automatically excluded from the recommendation stream to prevent duplicates.
- **No Interest Selection Fallback**: Verifies that featured summit sessions serve as default recommendations when no interest tags are chosen.
- **All Saved Exclusion Edge Case**: Verifies that saving all available sessions gracefully returns an empty recommendation list.

### 3. Crowd Density & SOS Incident Workflows (`src/tests/crowdAndSOS.test.tsx`)
- **Incident Creation**: Verifies that submitting an emergency SOS ticket creates a `PENDING` incident and updates active ticket counters.
- **Incident Dispatch Status Transition**: Verifies reactive status updates (`PENDING` → `IN_PROGRESS` → `RESOLVED`).
- **Zone Density Overrides**: Verifies live updates to zone crowd levels (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`).

### 4. Organizer Dashboard & Broadcast Actions (`src/tests/organizerActions.test.tsx`, `src/tests/eventContext.test.tsx`)
- **Broadcast Announcements**: Verifies organizer capability to publish prioritized announcements (`URGENT`, `CROWD`, `SCHEDULE`, `GENERAL`).
- **Session Capacity Editing**: Verifies session capacity updates across the state tree.
- **Demo Simulation Trigger**: Verifies the alert simulator correctly broadcasts updates and updates crowd parameters.

---

## Actual Empirical Test Results

```text
 RUN  v1.6.1 C:/Users/ry384/Desktop/promptwar/promptwars-hackathon

 ✓ src/tests/eventContext.test.tsx  (2 tests)
 ✓ src/tests/crowdAndSOS.test.tsx  (2 tests)
 ✓ src/tests/organizerActions.test.tsx  (3 tests)
 ✓ src/tests/navigation.test.ts  (4 tests)
 ✓ src/tests/pathfinding.test.ts  (3 tests)
 ✓ src/tests/discovery.test.ts  (4 tests)
 ✓ src/tests/recommendations.test.ts  (2 tests)

 Test Files  7 passed (7)
      Tests  20 passed (20)
   Start at  11:30:19
   Duration  5.32s
```

- **Build Verification**: `npm run build` completed with zero errors, generating static production bundle artifacts in `dist/`.
