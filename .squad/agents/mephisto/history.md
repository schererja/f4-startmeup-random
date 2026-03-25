# Mephisto — History

## Core Context

- **Project:** A multi-game OBS streaming overlay platform supporting Fallout 4 and Diablo 2 with live web-based overlay sources.
- **Role:** Backend Dev
- **Joined:** 2026-03-23T21:56:14.980Z

## Learnings

<!-- Append learnings below -->
- The shared DB entrypoint is `src/server/db/index.ts`; it now uses `drizzle-orm/postgres-js` plus the `postgres` client so `POSTGRES_URL` can point at standard PostgreSQL hosts, including Docker service names.
- `src/server/db/seed-d2.ts` should reuse the shared `~/server/db` client instead of creating its own driver-specific client, keeping seeding aligned with app runtime behavior.
- Docker/local validation for this repo can use `docker compose up -d db`, `pnpm db:push`, and a small `db.execute(sql\`select 1\`)` smoke test against `postgresql://postgres:password@localhost:5432/f4-startmeup-random`.
- Diablo 2 reference data must be wired into the shared `pnpm db:seed` path and the Docker migrator; leaving it only in `db:seed:d2` makes classes and mercenaries disappear in fresh environments.

## Session 2026-03-25 — Scene Data Flow & Hydration Fixes

### Issue Resolution
**Problem 1: Countdown Flash on Load**
- The `CountdownClock` component rendered immediately with initial state, causing hydration mismatch between server (full countdown) and client (calculated remaining time).
- Solution: Added `mounted` state flag and `suppressHydrationWarning` to hide the countdown until client hydration completes, matching the pattern already used by `LiveClock`.

**Problem 2: Unclear Scene Customization Parameters**
- Users had no way to discover that scenes accept URL parameters like `?minutes=5` or `?reason=Custom message` without reading source code.
- Solution: Added `SceneParamDocs` component that displays available parameters in a small, styled panel on each scene. Parameters are documented with descriptions and examples.

### Implementation
- Modified `scene-clocks.tsx`: Added mounted state and visibility hidden to CountdownClock to prevent hydration flicker.
- Enhanced `stream-scenes.tsx`: Created `SceneParam` type and `SceneParamDocs` component to show parameter documentation.
- Updated all scene pages (brb, starting-soon, full-cam, transition, coding) to export param lists and render the documentation component.

### Data Flow Contract Clarified
Each scene now explicitly documents:
- Parameter name and type
- What it controls
- Example values
- This is displayed as a small panel during development/setup, giving streamers immediate visibility into customization options.

### Files Modified
- `src/app/(overlay)/_components/scene-clocks.tsx`
- `src/app/(overlay)/_components/stream-scenes.tsx`
- `src/app/(overlay)/brb/page.tsx`
- `src/app/(overlay)/starting-soon/page.tsx`
- `src/app/(overlay)/full-cam/page.tsx`
- `src/app/(overlay)/transition/page.tsx`
- `src/app/(overlay)/coding/page.tsx`

## Team Coordination (2026-03-25T19:59:33Z)

**Session:** Scene fixes — scene param documentation, countdown hydration flash fix, data-flow clarity
**Orchestration Log:** `.squad/orchestration-log/2026-03-25T19:59:33Z-mephisto.md`

### Completed Work: Scene Data-Flow Clarity Pass
- **Status:** ✅ DELIVERED & APPROVED
- **Scope:** Scene parameter documentation, countdown hydration flash elimination
- **Results:**
  - `SceneParamDocs` component added: discoverable parameter list in bottom-right corner
  - Each scene exports parameter definitions (name, description, example)
  - Streamers can now discover and use URL query params directly from scene pages
  - Countdown hydration flash fixed via pre-render value stabilization (`mounted` state)
  - Parameter format documented: URL-encoded, `+` for spaces
  - Examples: BRB `?minutes=5&reason=Stretch`, Starting Soon `?focus=Fallout4+Diablo2`
- **Validation:** ✅ Tests passed

### Cross-Team Coordination
- **Baal** completed stream scene no-flash defaults (stable OBS rendering)
- **Deckard Cain** completed coding scene grid shell (collision-free layout)
- **Scribe** consolidated team decisions into decisions.md

### Data Flow Contract Now Transparent
URL parameter contracts are no longer hidden in source code. Streamers have immediate visibility into customization options during scene setup in OBS.
