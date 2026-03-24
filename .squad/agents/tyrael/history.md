# Tyrael — History

## Core Context

- **Project:** A multi-game OBS streaming overlay platform supporting Fallout 4 and Diablo 2 with live web-based overlay sources.
- **Role:** Lead
- **Joined:** 2026-03-23T21:56:14.978Z

## Learnings

<!-- Append learnings below -->
- Docker Compose now requires a repo-local `.env.docker` with real Clerk keys; the stack should fail before container startup if that file is missing.
- Clerk config is validated through `src/env.js` and forced at startup from `src/app/layout.tsx` and `src/middleware.ts` so auth misconfiguration surfaces as env validation, not a later runtime crash.
- Docker entrypoints for this repo are `Dockerfile`, `Dockerfile.postgres`, `docker-compose.yml`, and `.env.docker.example`; the app Dockerfile also needs the BuildKit syntax directive on line 1.
- `src/server/db/index.ts` is the DB client switchpoint: standard TCP URLs such as Docker `db` should use `drizzle-orm/postgres-js`, while `@vercel/postgres` should be reserved for `-pooler` hosts.
- The Docker Compose `POSTGRES_URL=postgresql://postgres:password@db:5432/f4-startmeup-random` was already correct; the fix was runtime client selection, not another connection string.
- `/overlay/diablo2/[uuid]` is a public runtime path that exercises a DB-backed query in Docker after `docker compose --profile migrate run --rm migrate`.
- When `SKIP_ENV_VALIDATION=1` is used for Next or Docker builds, `POSTGRES_URL` may be absent during module evaluation; DB client selection must be deferred until request or script execution instead of parsing the URL at import time.
- Current Fallout 4 overlay is intentionally minimal: header, SPECIAL row, and three badges, while Diablo 2 already uses a richer sectioned card pattern that Fallout 4 can borrow from.
- Fallout 4's existing data already supports richer overlay copy through `trait.description` and `location.description`; jobs currently only provide names, so background flavor is thinner unless that dataset is expanded.
- Cross-game "in-game integration" is not currently a real platform capability here; the codebase is a web app with public `/overlay/...` OBS routes and no game plugin, memory reader, or telemetry bridge.
- Diablo 2 reference data should be lazily bootstrapped from `d2GameData` reads with an idempotent helper; fresh schemas can exist before `db:seed`, while the new `data/f4sr_*.json` files are still snapshots and not the Fallout 4 runtime source.

## Team Coordination (2026-03-24)

**Orchestration Log:** `.squad/orchestration-log/2026-03-24T20:01:05Z-tyrael.md`

### Pending Work: Fallout 4 Overlay Scene Expansion
- **Status:** Overlay scope decision finalized and documented
- **Next Phase:** Implementation pending assignment
- **Key Interface:** Baal's layout reference (`layout-fallout`, `layout-diablo`) provides composition pattern
- **Data Surface:** `trait.description` and `location.description` ready for display; S.P.E.C.I.A.L., background/job already available
- **OBS Integration:** Preserve transparent background from `(overlay)/layout.tsx`; add clear camera frame region (not literal webcam capture)

### Decision Summary
FO4 overlay should expand from single compact card to full scene composition with:
- Primary panel: name, role, run summary, S.P.E.C.I.A.L.
- Detail panel: trait effect and location flavor
- Webcam-safe frame: transparent reserved region for OBS overlay stacking
- Footer strip: trait, background, location, class signals

### Cross-Agent Dependencies
- **Baal** provides layout composition pattern and styling reference
- **Mephisto** maintains data models with descriptions and trait/location detail
- **Diablo** validates Docker/DB infrastructure for both games
