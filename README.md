# HedgeSPA Trial Dashboard

Bloomberg-style mini dashboard built for the HedgeSPA trial using mock data.

## Tech Stack

- React 18 + TypeScript
- Vite
- Zustand (global state for user type, selected portfolio, and layout persistence)
- TanStack Query (mock data fetching + polling updates every 5s)
- Electron (desktop shell loading the Vite renderer; compile-ready for packaging)
- React Grid Layout (drag/resize widgets)
- Recharts (summary and allocation charts)

## Features Implemented

- Portfolio selector for two mock portfolios
- Three widgets:
  - Summary (total value, daily P/L, mini performance chart)
  - News (3 headlines per portfolio)
  - Allocation (stocks/bonds/cash pie chart)
- Drag and resize widgets in dashboard mode
- Tear-out windows per widget using `window.open`
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
- Drag and resize in browser: **Compliant**
- Mock real-time updates every 5-10 seconds: **Compliant** (5s simulation)
- Tear-out widget windows: **Compliant** (browser-based PoC)
- Layout persistence (positions, sizes, selected portfolio): **Compliant**
- Desktop/laptop usability: **Compliant**
- User-specific persistence simulation: **Compliant** (front/back office profiles)

## Known Trial Limits

- Tear-out is web-level (`window.open`) today; native `BrowserWindow` per widget is the natural Electron follow-up.
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
