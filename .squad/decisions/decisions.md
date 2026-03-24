# Squad Decisions Archive

**Last Updated:** 2026-03-24T20:01:05Z  
**Total Decisions:** 21

---

## Table of Contents
1. [Architecture & Multi-Game](#architecture--multi-game)
2. [Overlay & Layout](#overlay--layout)
3. [Diablo 2 Implementation](#diablo-2-implementation)
4. [Docker & Infrastructure](#docker--infrastructure)
5. [Data & Schema](#data--schema)
6. [Directives & Coordination](#directives--coordination)

---

## Architecture & Multi-Game

### Tyrael: Multi-Game Hub Expansion
**Date:** 2025-01-31 | **Status:** Accepted | **Scope:** Route structure, DB schema, OBS overlay system

Root `/` becomes the multi-game hub. FO4 routes move from `/characters/*` to `/fallout4/*`. Diablo 2 lives at `/diablo2/*`. Existing FO4 routes preserved as redirect stubs during migration.

**Key Decisions:**
- Route structure: `/fallout4/*`, `/diablo2/*`, `/overlay/[game]/[uuid]`
- Database: Keep `f4sr_` prefix unchanged; D2 uses `d2_` prefix via separate schema
- OBS overlay: Public `/overlay/[game]/[uuid]` routes under `(overlay)` layout group
- DB strategy: Single PostgreSQL instance with two prefixes; no separate schemas; static games, not dynamic

**Rationale:** Self-documenting URL space, zero migration cost, clean separation prevents collision, proven pattern via pgTableCreator.

---

### Tyrael: Game Data Revision
**Date:** 2026-03-24 | **Status:** Implemented

Keep Diablo 2 on DB-backed reference data instead of switching to JSON runtime source. Issue was bootstrap timing, not schema/router wiring.

**Key Decisions:**
- `src/server/db/seed-d2.ts` exports `ensureD2ReferenceData()` for lazy initialization
- `d2GameData` router calls helper before returning classes/mercenaries/skill focuses
- Preserves `pnpm db:seed` and auto-recovers fresh DBs on first D2 access

---

## Overlay & Layout

### Tyrael: Overlay Scope for Fallout 4
**Date:** 2026-03-24 | **Status:** Proposed | **Scope:** Fallout 4 overlay UX, cross-game integration ceiling

Current single-card overlay too thin for dedicated FO4 scene. Expand from single info card to full scene composition with explicit OBS layout zones.

**Key Decisions:**
1. **Treat OBS/browser as shared product ceiling** — practical common denominator across games
   - No in-game integration planned as cross-game feature
   - Game-specific add-ons later if needed, not baseline
2. **FO4 Scene Composition:**
   - Primary info panel: name, role, run summary, S.P.E.C.I.A.L.
   - Detail panel: trait effect text, start location flavor
   - Webcam-safe frame: optional transparent reserved region
   - Footer/status strip: trait, background, location, class signals
3. **Prioritize existing data:** trait description, location description, S.P.E.C.I.A.L., background/job
4. **Configuration approach:** `layout=full|stats|minimal` variants over hard-coded screens

**Rationale:** Gives FO4 stronger visual identity, uses existing data, keeps both games aligned to OBS/browser model, avoids overcommitting to impossible cross-game in-game integration.

---

### Baal: D2 OBS Overlay Decision
**Date:** 2025-01 | **Status:** Implemented

Diablo 2 OBS overlay implemented at `src/app/(overlay)/overlay/diablo2/[uuid]/page.tsx`.

**Key Decisions:**
- **Visual Theme:** Gothic Gold, not Pip-Boy green
  - Background: `rgba(10, 5, 0, 0.85)`
  - Primary accent: `#d4a017` / `#c8962c` (Diablo gold)
  - Secondary: `#8b0000` (blood red)
  - Text: `#e8d5a3` (parchment)
  - Font: system serif (Georgia first), no monospace for headings
- **Inline D2Badge:** Custom component instead of reusing OverlayBadge (avoids hardcoded pip-boy green)
- **CSS Keyframes:** `d2-ember-glow` (pulsing red/gold), `d2-fade-in` (no scanlines or translateY)
- **Difficulty Color Coding:** Normal #4ade80 (green), Nightmare #fb923c (orange), Hell #ef4444 (red)
- **Generic Router Updated:** `/overlay/[game]/[uuid]` maps `d2` → `diablo2`
- **Skill Focuses:** Rendered as badge row, not list (supports multiple per class)

---

### Baal: Layout Reference Decision
**Date:** 2025-01 | **Status:** Completed | **Scope:** Fallout 4 and Diablo 2 layout composition

For next richer FO4 overlay pass, keep Pip-Boy card language but adopt anchored composition pattern instead of single panel.

**Key Decisions:**
- **Composition Principle:** Top-left character identity, bottom-center SPECIAL strip, bottom status strip, reserved webcam area
- **Why:** Separated information zones read faster on stream; leaves center of gameplay open
- **Apply to D2:** Same anchored composition but no decorative metaphor copying; avoid fake health/mana orbs without data

**Rationale:** Local `layout-fallout` and `layout-diablo` references read faster; separating by zone outperforms single packed card.

---

### Baal: OBS Overlay System Implementation
**Date:** 2025-01-31 | **Status:** Accepted | **Scope:** OBS overlay routing, layout, FO4 overlay component, shared overlay utilities

**Key Decisions:**
1. **Game Slug:** `fallout4` (not `fo4`) for task spec compliance and human readability
   - `[game]/[uuid]` fallback dispatcher handles `fo4` alias via redirect map
   - `/overlay/fo4/[uuid]` → server-side redirect → `/overlay/fallout4/[uuid]`
2. **Transparent Background via Inline Style:**
   - `(overlay)/layout.tsx` injects `<style>body { background: transparent !important }`
   - Avoids cascade override by Tailwind and `:root --background` variable
3. **Pointer Events:** Overlay wrapper has `pointer-events: none` to prevent interaction with OBS

---

## Diablo 2 Implementation

### Mephisto: D2 Schema and API Implementation
**Date:** 2025-01-01 | **Status:** Implemented | **Scope:** Schema, seed data, tRPC routers, types

**Key Decisions:**
- **Schema:** Separate `createD2Table = pgTableCreator((name) => 'd2_${name}')` mirrors `f4sr_` pattern
- **Tables:** `d2_classes`, `d2_mercenaries`, `d2_skill_focuses`, `d2_characters`
- **FK Pattern:** UUID columns (not id); `mercenaryUUID` nullable
- **Difficulty:** Stored as varchar (avoids migration complexity for 'Normal'|'Nightmare'|'Hell')
- **DB Index:** Both schemas spread into drizzle: `{ ...schema, ...schemaD2 }`
- **tRPC Routers:**
  - `d2Characters.*`: create, getByUUID, getAll, getStats
  - `d2GameData.*`: getClasses, getMercenaries (filterable by act), getSkillFocuses (by classUUID)
- **Types:** `D2Character`, `D2Class`, `D2Mercenary`, `D2SkillFocus`, `FullD2Character`, `CreateD2CharacterInput`

**Note:** Drizzle migrations and seed execution not run per task spec.

---

### Diablo: D2 Data Review (Approved)
**Date:** 2026-03-24 | **Status:** Approved | **Notes:** Schema design and reference data structure sound; ready for lazy bootstrap implementation

---

### Mephisto: D2 Data Fix Decision
**Date:** 2026-03-24 | **Status:** Approved | **Scope:** Lazy seeding of reference data on first access

Resolves empty dropdowns by ensuring D2 reference data is initialized before router returns results.

---

---

## Docker & Infrastructure

### Diablo: Docker Postgres Connection String Review
**Date:** 2026-03-24 | **Status:** REJECTION — Critical library mismatch | **Severity:** High

**Problem:** `@vercel/postgres` (v0.8.0) cannot accept standard PostgreSQL connection strings for local/Docker environments.

**Root Cause:**
- Library designed exclusively for Vercel/Neon managed Postgres and serverless runtimes
- Uses `@neondatabase/serverless` under the hood (WebSocket client, not TCP)
- Validates connection strings at runtime and rejects standard `postgresql://` URLs
- Expects `-pooler` suffix in hostname (only in Vercel/Neon managed services)
- Throws `VercelPostgresError: invalid_connection_string` for local postgres

**What's Correct:**
- docker-compose.yml: correctly sets POSTGRES_URL as environment variable
- Dockerfile: syntax directive and multi-stage build sound
- .env.docker: good pattern for Clerk secrets
- src/env.js: validates POSTGRES_URL appropriately

**What's Missing:**
- src/server/db/index.ts: uses `@vercel/postgres` and will crash with invalid_connection_string
- No conditional logic for local vs. production environments

**Failure Mode:** Runtime crash on first API call or during build with `invalid_connection_string` error.

**Required Fix Path (Choose One):**
1. **Option 1 (Recommended):** Environment-aware client
   - Keep `@vercel/postgres` for production on Vercel
   - Use `pg` or `drizzle-orm/node-postgres` for local Docker
   - Conditionally import based on NODE_ENV or process.env.VERCEL
2. **Option 2:** Unified serverless client
   - Replace with `@neondatabase/serverless`
   - Works everywhere if using Neon
3. **Option 3:** Remove @vercel/postgres
   - Use standard `pg` library everywhere
   - Lose edge runtime compatibility on Vercel

**Assign to:** Database/ORM Specialist (not original author)

**Rationale:** Requires understanding of Drizzle ORM database drivers, decision on local vs. production strategy, may impact seeding/migrations, needs testing in both Docker and production.

**Approval Checklist:**
- [ ] Database client supports standard PostgreSQL over TCP (local Docker)
- [ ] App starts without invalid_connection_string error
- [ ] Connection pool/migrations work in Docker
- [ ] Code works in local Docker and production (Vercel) environments
- [ ] Documentation guides users on which connection string to use where

---

### Tyrael: Docker Improvements Decision
**Date:** 2025-01-31 | **Status:** Approved | **Scope:** Docker build, local dev experience

**Key Approvals:**
- Dockerfile syntax directive and multi-stage build structure
- start-database.sh script for local PostgreSQL orchestration
- docker-compose.yml coordination of Next.js and Postgres services
- Environment variable passing and health checks

---

### Tyrael: Docker Followup Decision
**Date:** 2026-03-24 | **Status:** Resolved | **Scope:** Docker build and runtime reliability

---

### Diablo: Docker Followup Review
**Date:** 2026-03-24 | **Status:** Approved | **Scope:** Build regression test coverage

---

### Deckard Cain: Docker Build Fix
**Date:** 2026-03-24 | **Status:** Approved | **Scope:** Fix build failures in containerized environment

---

### Mephisto: Docker DB Fix Decision
**Date:** 2026-03-24 | **Status:** Approved | **Scope:** Ensure D2 reference data bootstrap in Docker

---

---

## Data & Schema

### Mephisto: D2 Schema Decision
**Date:** 2025-01-01 | **Status:** Implemented | (See Diablo 2 Implementation section)

---

### Diablo: Build Regression Approved
**Date:** 2026-03-24 | **Status:** Approved | **Scope:** Regression test coverage for D2 schema and build stability

---

### Tyrael: Build Regression Decision
**Date:** 2026-03-24 | **Status:** Approved | **Scope:** Architecture integrity and migration path validation

---

### Tyrael: DB Client Revision Decision
**Date:** 2026-03-24 | **Status:** Approved | **Scope:** Database client consistency and lazy bootstrap patterns

---

---

## Directives & Coordination

### Coordinator Directive: Layout Reference Points
**Date:** 2026-03-24T18:33:30Z | **By:** Jason Scherer (via Copilot) | **Status:** Active

Use `localhost:3000/layout-fallout` and `localhost:3000/layout-diablo` as positive reference points for overlay direction. User semi-likes those layouts.

**Impact:** Guides Tyrael's Fallout 4 overlay expansion and Baal's layout composition work.

---

### Deckard Cain: D2 Pages Decision
**Date:** 2025-01-31 | **Status:** Approved | **Scope:** Diablo 2 character and data pages scaffolding

---

---

## Summary Statistics

| Category | Count | Status |
|----------|-------|--------|
| Architecture | 2 | Accepted / Implemented |
| Overlay & Layout | 4 | Accepted / Implemented / Proposed |
| Diablo 2 | 4 | Implemented / Approved |
| Docker | 6 | Approved / Rejected |
| Data & Schema | 3 | Implemented / Approved |
| Directives | 2 | Active |
| **Total** | **21** | Mostly Accepted/Implemented; 1 Rejection |

---

## Decision Status Breakdown

- **Accepted:** 8
- **Implemented:** 6
- **Proposed:** 1
- **Approved:** 5
- **Rejection:** 1 (Docker Postgres — critical library mismatch requiring specialist fix)
- **Resolved:** Several ongoing items with followup work

---

## Cross-Agent Dependencies

- **Tyrael** → Baal: Overlay scope feeds layout composition
- **Baal** → Tyrael: Layout reference guides FO4 expansion
- **Tyrael** → Mephisto: Multi-game schema strategy
- **Mephisto** → Tyrael: D2 implementation enablement
- **Diablo** → Tyrael: Build regression and Docker followup
- **Deckard Cain** → Tyrael: D2 pages scaffolding
- **Coordinator** → All: Layout reference directive

---

## Action Items for Next Phase

1. **Assign FO4 Scene Expansion** (Tyrael overlay scope): Implement primary/detail/webcam/footer panels
2. **Assign D2 Bootstrap Fix** (Tyrael game data revision): Implement lazy seed initialization
3. **Assign Docker Client Fix** (Diablo rejection): Environment-aware DB client (specialist)
4. **Migrate FO4 Routes** (Tyrael multi-game): Move logic to `/fallout4/*` with redirect stubs
5. **Implement D2 Routes** (Tyrael multi-game): Full `/diablo2/*` implementation
6. **Update TopNav** (Tyrael multi-game): Reflect multi-game hub structure
7. **Overlay Composition** (Baal): Apply layout reference to FO4 full scene
