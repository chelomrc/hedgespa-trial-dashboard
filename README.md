# HedgeSPA Trial Dashboard

Bloomberg-style mini dashboard built for the HedgeSPA trial using mock data.

## Live demo

**URL:** [hedgespa-trial-dashboard (Vercel)](https://hedgespa-trial-dashboard-gb3ouoxul-chelomrcs-projects.vercel.app/)

Production build of the SPA in the browser. **Native tear-out** (`BrowserWindow` per widget) runs with Electron locally (`npm run electron:dev` or `npm run electron:preview`), not in the hosted URL.

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS v4 (with shared component classes via `@layer components`)
- Zustand (global state for user type, selected portfolio, and layout persistence)
- TanStack Query (mock data fetching + polling updates every 5s)
- Electron (desktop shell loading the Vite renderer; compile-ready for packaging)
- React Grid Layout (drag/resize widgets)
- Recharts (summary and allocation charts)

## UI Engineering Conventions

- **Design tokens first:** store reusable UI values in `src/index.css` under `:root` (`--ui-*` variables).
- **Reusable variants:** define semantic component classes inside `@layer components` (example: `ui-btn`, `widget-shell`, `summary-*`, `news-*`).
- **Conditional classes:** use `cn()` from `src/lib/utils.ts` for all conditional/merge-heavy class composition.
  - `cn()` combines `clsx` + `tailwind-merge`, so it removes conflicting Tailwind utilities safely (example: `p-2` + `p-4` resolves predictably).
  - This keeps JSX readable, reduces styling regressions in state-heavy components, and makes `className` extension safer across reusable widgets.
- **No hardcoded color drift:** avoid one-off hex values in TSX unless strictly chart-driven and tokenized.
- **Consistent naming:** use feature-scoped class prefixes (`select-*`, `widget-*`, `summary-*`, `news-*`) instead of random utility clusters.
- **Extensibility by default:** widget components should accept optional `className` when they may be composed in different containers.

## Features Implemented

- Portfolio selector for two mock portfolios
- Three widgets:
  - Summary (total value, daily P/L, mini performance chart)
  - News (3–5 headlines per portfolio per RFP; mock: 3 for portfolio 1, 5 for portfolio 2)
  - Allocation (stocks/bonds/cash pie chart)
- Drag and resize widgets in dashboard mode
- Tear-out: **native `BrowserWindow`** per widget in Electron (IPC `open-widget-window`, `electron/main.cjs`) — this is the trial / client path. If you open the Vite app in a normal browser **without** Electron, the same action uses `window.open` only so you can approximate URLs locally; it is not the desktop delivery mode.
- Layout and selected portfolio persistence in `localStorage`
- User type profile switch (`front-office`, `back-office`) with separate saved layouts
- Live mock updates every 5 seconds
- Client sample data in TypeScript (`src/data/clientMock.ts`) mapped into dashboard view models (`src/data/mapClientMockToDashboard.ts`)

## Run Locally (browser)

```bash
npm install
npm run dev
```

Open the app at `http://localhost:5173`.

## Run in Electron (trial / client expectation)

Development (Vite + Electron):

```bash
npm run electron:dev
```

Production build inside Electron (after Vite build):

```bash
npm run build
npm run electron:preview
```

The main process loads `dist/index.html` with `base: './'` so assets resolve under `file://`.

## Validation Commands

```bash
npm run lint
npm run build
```

## Trial Compliance Matrix (RFP Core)

- Portfolio selector (2 mock portfolios): **Compliant**
- 3 working widgets (Summary, News, Allocation): **Compliant**
- News headlines (3–5 per portfolio): **Compliant**
- Drag and resize in browser: **Compliant**
- Mock real-time updates every 5-10 seconds: **Compliant** (5s simulation)
- Tear-out widget windows: **Compliant** (native `BrowserWindow` in Electron; optional `window.open` only when running the SPA outside Electron for dev smoke tests)
- Layout persistence (positions, sizes, selected portfolio): **Compliant**
- Desktop/laptop usability: **Compliant**
- User-specific persistence simulation: **Compliant** (front/back office profiles)

## Known Trial Limits

- **Electron (default for trial):** each torn-out widget is a real **`BrowserWindow`**; reopening the same widget refocuses the existing window.
- **Browser-only dev:** `npm run dev` in Chrome/Firefox has no Electron shell, so tear-out degrades to `window.open` — use `npm run electron:dev` or `electron:preview` to exercise the native behavior.
- Data source is mocked for trial scope (`clientMock.ts`).

## Mock data

HedgeSPA-supplied structures live in `src/data/clientMock.ts` (`portfolios`, `portfolioHoldings`, `portfolioNews`, `portfolioPerformance`). The dashboard maps them to widget-ready models via `src/data/mapClientMockToDashboard.ts`. Portfolio IDs in UI are `"1"` and `"2"` (stringified `portfolioId`).

## Suggested 15-Minute Demo Flow

1. Show dashboard and switch between two portfolios.
2. Explain Summary, News, Allocation widgets.
3. Drag and resize widgets.
4. Tear out each widget into separate windows.
5. Switch user type and show different persisted layout.
6. Refresh page to demonstrate persistence.
7. Explain architecture and next-step scale plan.
