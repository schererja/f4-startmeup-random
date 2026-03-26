# Squad Decisions

## Active Decisions

### Docker Compose Bootstrap Gating (2026-03-26)

**Status:** ✅ IMPLEMENTED (2026-03-26)

**Scope:** Docker Compose startup flow  
**Final Verdict:** Implemented by Mephisto; fresh startup now includes schema + seed bootstrap

#### Decision

Docker Compose startup must gate app startup on successful schema and seed bootstrap:
1. **Migrate service:** Runs `pnpm db:push && pnpm db:seed` as part of default compose (no profile opt-in)
2. **App dependency:** App waits for migrate to complete successfully before starting
3. **Database schema + seed:** Both required for usable stack

#### Rationale

- Fresh `docker compose up -d --build` was starting app against empty database (schema + no seed data)
- Fallout 4 queries immediately fail on missing `f4sr_characters`, `f4sr_traits` relations
- D2 tables exist after schema push but require seed data for reference rows
- Explicit bootstrap gate ensures fresh volumes produce working stacks without operator manual steps

#### Validation Path
- ✅ Lint: `SKIP_ENV_VALIDATION=1 pnpm lint` passed
- ✅ Build: `SKIP_ENV_VALIDATION=1 pnpm build` passed
- ✅ Tests: `pnpm test` passed
- ✅ Docker verification: Clean volume + `docker compose up` produces schema + seed data
- ✅ App startup: Queries execute without missing relation errors

#### Files Modified
- `docker-compose.yml` — migrate service removed from profile, app depends_on migrate
- `README.md` — Docker startup documentation updated

#### Next Steps

Ready for deployment. All fresh stacks will include required schema and seed data.

---

### Docker Compose Postgres Port Dynamic Assignment (2026-03-26)

**Status:** ✅ IMPLEMENTED (2026-03-26)

**Scope:** Docker Compose postgres service host port binding  
**Final Verdict:** Implemented by Mephisto

#### Decision

Postgres container port 5432 publishes to `127.0.0.1` with `published: "${POSTGRES_PORT:-0}"`:
- Default (unset `POSTGRES_PORT`): OS assigns dynamic port (`0` means automatic)
- When needed: Set `POSTGRES_PORT` in environment or Compose `.env` for fixed binding
- App internal connection: Unchanged (`db:5432`)

#### Rationale

- Prevents `docker compose up` from failing on machines with existing local Postgres on port 5432
- Keeps common workflow unchanged (no environment variables required)
- Allows operators to set fixed port when needed via `.env` or shell export

#### Operator Notes

Use `docker compose port db 5432` to discover the assigned host port. The container remains reachable via `db:5432` internally (app, migrator unchanged).

#### Files Modified
- `docker-compose.yml` — postgres port binding changed to dynamic assignment

#### Next Steps

Ready for deployment. Reduces Docker startup friction on shared machines.

---

### Browser Source Framing — Transparent Shells (2026-03-25)

**Status:** ✅ APPROVED (2026-03-25)

**Scope:** Full-cam, coding, Fallout 4, Diablo II overlays  
**Final Verdict:** Approved by Baal; transparent framing now team standard

#### Decision

Streamer setup routes should render as transparent framing chrome, not fake embedded content:
- Use transparent canvases with explicit labels: "Editor capture below" or "Camera source below"
- Direct OBS layer-order cues instead of opaque backdrops
- Capture reserves remain in layout but are visually transparent
- Reduces setup confusion about real feed placement in OBS

#### Rationale

Opaque backdrops and placeholder visuals make operators think the browser source contains the real feed. Transparent shells with explicit frame labels match actual OBS composition and eliminate guesswork during scene setup.

#### Affected Paths
- `src/app/(overlay)/full-cam/page.tsx`
- `src/app/(overlay)/coding/page.tsx`
- `src/app/(overlay)/overlay/fallout4/[uuid]/OverlayClient.tsx`
- `src/app/(overlay)/overlay/diablo2/[uuid]/OverlayClient.tsx`
- `src/app/(overlay)/_components/stream-scenes.tsx`

#### Next Steps

All future scenes should adopt transparent frame architecture with explicit source labels.

---

### OBS Source-Map Scenes (2026-03-25)

**Status:** ✅ APPROVED (2026-03-25)

**Scope:** `/coding` and `/full-cam` scene layout  
**Final Verdict:** Approved by Deckard Cain; scenes now read as OBS setup guides

#### Decision

Browser sources should explain real OBS composition instead of pretending to be captures:
- `/coding` labels editor and webcam boxes as explicit OBS targets with source stack order
- `/full-cam` treats browser source as chrome over fullscreen camera/media source; center kept clear
- Scene parameter docs render inline in support rail (not bottom-right panels covering reserved targets)

#### Rationale

Prior layouts looked decorative and left unclear where real editor captures or webcam sources belonged. These changes turn pages into immediate setup guides without guessing source order or placement.

#### Validation Path
- ✅ Explicit real-source target labels
- ✅ Clearer OBS layer ordering
- ✅ Center kept clear in full-cam
- ✅ Param docs moved out of reserved capture zones

#### Next Steps

Grid shell and transparent frame pattern reusable for future scene layouts.

---

### Stream Scene No-Flash Defaults (2026-03-25)

**Status:** ✅ IMPLEMENTED (2026-03-25)

**Scope:** Streamer scene shell component (`stream-scenes.tsx`), overlay card entrance animations  
**Final Verdict:** Approved by Baal; no-flash rendering is now team standard for OBS sources

#### Decision

Streamer scenes must default to stable, flash-free rendering:
- Scene shell sets `withFlicker={false}` by default (no whole-scene reload flash)
- Entrance animations are now opt-in via `animateIn` prop (no mount-time panel fade)
- Shared panels no longer trigger entrance fades on BRB or starting-soon scenes
- URL query params continue to drive current values (countdown, reason, next segment)

#### Rationale

OBS/browser sources treat reload flashes and entrance animations like broadcast glitches. Static scenes (BRB, starting-soon) are most vulnerable. Opt-in animation preserves visual polish for active gameplay scenes while keeping passive scenes stable.

#### Files Modified
- `src/app/(overlay)/_components/stream-scenes.tsx` — `withFlicker={false}` default, `animateIn` prop gating
- `src/app/(overlay)/_components/OverlayCard.tsx` — conditional entrance animation
- `src/app/(overlay)/__tests__/stream-scenes.test.tsx` — regression test

#### Validation Path
- ✅ `pnpm test -- --run src/app/(overlay)/__tests__/stream-scenes.test.tsx` passed
- ✅ `SKIP_ENV_VALIDATION=1 pnpm lint` passed
- ✅ `SKIP_ENV_VALIDATION=1 pnpm build` passed
- ✅ Manual OBS verification: 5+ browser source refreshes, no flicker observed
- ✅ BRB and starting-soon scenes remain stable

#### Next Steps

Ready for merge. All future streamer scenes should follow no-flash defaults.

---

### Coding Scene Grid Shell (2026-03-25)

**Status:** ✅ IMPLEMENTED (2026-03-25)

**Scope:** Coding scene layout (`src/app/(overlay)/coding/page.tsx`)  
**Final Verdict:** Approved by Deckard Cain; grid shell eliminates all layout collisions

#### Decision

The coding scene now reserves layout areas once at the shell level using a two-column grid:
- **Left column:** Intro card, editor frame, terminal strip (stacked rows)
- **Right column:** Narration rail, webcam reserve (stacked rows)
- **Footer:** Reserved at shell level, not interior competing zones
- **Padding:** Interior content padded below frame labels (no chrome collisions)

#### Rationale

Prior layout let intro, narration, editor, terminal, and webcam compete for the same canvas. Grid-based reservation keeps surfaces stable at common OBS/browser-source sizes while preserving existing scene concepts. Gameplay center remains fully readable.

#### Files Modified
- `src/app/(overlay)/coding/page.tsx` — grid shell + nested row/column layout
- `src/app/(overlay)/__tests__/coding-scene-layout.test.tsx` — layout collision regression test

#### Validation Path
- ✅ `pnpm test -- --run src/app/(overlay)/__tests__/coding-scene-layout.test.tsx` passed
- ✅ `SKIP_ENV_VALIDATION=1 pnpm lint` passed
- ✅ `SKIP_ENV_VALIDATION=1 pnpm build` passed
- ✅ Manual browser verification: localhost:3000/coding at OBS source size, no collisions

#### Next Steps

Ready for merge. Grid shell pattern is reusable for future scene layouts.

---

### Scene Parameter Documentation (2026-03-25)

**Status:** ✅ IMPLEMENTED (2026-03-25)

**Scope:** Scene URL parameter discovery, countdown hydration clarity  
**Final Verdict:** Approved by Mephisto; parameter contracts now discoverable without external docs

#### Decision

Added `SceneParamDocs` component that renders a discoverable parameter list for each scene:
- Small styled panel in bottom-right corner of each scene
- Lists all available URL parameters with descriptions and examples
- Uses same aesthetic as overlay system
- Easily accessible during scene setup in OBS without interfering with stream view
- Countdown hydration flash eliminated via pre-render value stabilization

#### Parameter Format & Examples
- **BRB:** `?minutes=5`, `?reason=Stretch`, `?next=Build+Pull`
- **Starting Soon:** `?minutes=10`, `?focus=Fallout4+Diablo2`
- **Transition:** `?from=StartingSoon`, `?to=Gameplay`
- **Coding:** `?project=my-app`, `?stack=React+Node`

Note: URL-encoded; use `+` for spaces.

#### Rationale

Makes the data flow contract transparent without requiring external documentation. Streamers can adjust scenes in OBS by copying and modifying URLs. Reduces friction for new users discovering scene customization.

#### Files Modified
- `src/app/(overlay)/_components/stream-scenes.tsx` — `SceneParam` type + `SceneParamDocs` component
- Scene pages (BRB, Starting Soon, Transition, Coding) — parameter definitions + exports
- Scene hydration logic — countdown flash fix

#### Validation Path
- ✅ Tests passed
- ✅ Each scene page: bottom-right docs panel visible with correct parameters
- ✅ Parameter usage verified: `?minutes=5&reason=Stretch` (BRB), `?focus=Fallout4+Diablo2` (Starting Soon)

#### Next Steps

Component is part of `stream-scenes.tsx` shared exports. Reuse for any new scenes.

---

### User Directive — Streamer Tools (2026-03-25)

**By:** Jason Scherer  
**Status:** ⚡ ACTIVE DIRECTION

Product direction is streamer tools. Continue building in that direction.

---

### Overlay Refresh-Flash Fix — Silent Client Polling (2026-03-25)

**Status:** ✅ APPROVED (2026-03-25)

**Scope:** Fallout 4 and Diablo II OBS overlays  
**Final Verdict:** Approved by Diablo after Baal implementation

#### Architecture Decision
Moved overlay polling from page-level SSR re-renders into client-side state preservation:
- **Server Page Role:** Thin initial-data loader; renders static markup for OBS source initialization
- **Client Component Role:** Owns persistent polling cycle; queries `getByUUID` every 5 seconds via tRPC
- **Data Preservation:** `initialData` + `placeholderData` prevent blank scenes during refetch
- **Error Handling:** `LiveOverlayStatusBadge` shows "Signal Lost" on failure while keeping last good scene visible
- **Result:** Stable OBS overlay; smooth polling without animation re-trigger; real-time data within 1–2 seconds

#### Files Modified
- `src/app/(overlay)/overlay/fallout4/[uuid]/page.tsx` — Server page refactored to initial-data loader
- `src/app/(overlay)/overlay/fallout4/[uuid]/OverlayClient.tsx` — New client polling component
- `src/app/(overlay)/overlay/diablo2/[uuid]/page.tsx` — Server page refactored to initial-data loader
- `src/app/(overlay)/overlay/diablo2/[uuid]/OverlayClient.tsx` — New client polling component
- `src/app/(overlay)/_components/LiveOverlayStatusBadge.tsx` — New shared status indicator

#### Validation Path
- ✅ `pnpm test -- --run src/app/(overlay)/_components/__tests__/LiveOverlayStatusBadge.test.tsx` passed
- ✅ `SKIP_ENV_VALIDATION=1 pnpm lint` passed
- ✅ `SKIP_ENV_VALIDATION=1 pnpm build` passed
- ✅ Manual browser refresh: no flashing (5+ repeats)
- ✅ 30-second polling simulation: zero loading-state flickers
- ✅ Character data updates within 2 seconds

#### Quality Gate Criteria Met
1. ✅ No whole-overlay flash on refresh
2. ✅ No loading-state swaps during polling
3. ✅ Stable component structure (no conditional zone flashing)
4. ✅ Live data updates within 1–2 seconds
5. ✅ Error state stability (Signal Lost badge, prior data preserved)
6. ✅ OBS/browser rendering smooth (no visible jank)

#### Next Steps
Ready for merge and deployment.

#### Reusable Pattern
For future streaming overlays: **Server page = initial snapshot provider; client component = live polling engine.** Use `initialData`/`placeholderData` to avoid loading states that would blank the scene.

---

### Overlay Refactor — Anchored Zone Architecture (2026-03-24 to 2026-03-25)

**Status:** ✅ APPROVED (2026-03-25)

**Scope:** Fallout 4 and Diablo II OBS overlays  
**Final Verdict:** Approved by Diablo after Deckard Cain revision

#### Architecture Decision
Refactored overlays from centered cards to anchored OBS-style zones:
- **Fallout 4:** Top-left identity panel, right-edge detail cards (trait + location), bottom-left webcam reserve (480×270), bottom-center SPECIAL rail, full-width footer/status strip
- **Diablo II:** Top-left identity, top-right status panel, optional bottom-left mercenary and bottom-right skill focus panels, bottom-center webcam reserve (400×225), minimal footer strip
- **Zone Visibility:** `layout=minimal` (identity only) → `layout=stats` (identity + key panels) → `layout=full` (all zones)

#### Rationale
- Anchored zones preserve gameplay center readability while making overlay legible in OBS
- FO4 detail cards surface existing trait/location descriptions (no invented data)
- D2 design keeps Gothic theme while avoiding decorative noise and fake HUD elements
- Explicit webcam reservations and visibility control prevent layout surprise

#### Revision History
1. **Diablo Review (Initial):** REJECTION
   - FO4 detail-panel gate failed `@typescript-eslint/prefer-nullish-coalescing` (used `||` instead of `??`)
   - D2 zone labels below 13px (broadcast-unsafe for OBS downscaling)
   - Assigned to Deckard Cain for revision

2. **Deckard Cain Revision:** 
   - Fixed FO4 gate: replaced `showFull && (traitDescription || locationDescription)` with null-safe `(traitDescription ?? locationDescription) !== undefined`
   - Raised D2 labels to ≥13px via shared size tokens
   - Validation: `SKIP_ENV_VALIDATION=1 pnpm lint` + `SKIP_ENV_VALIDATION=1 pnpm build` both pass

3. **Diablo Final Review:** ✅ APPROVED
   - Both blockers cleared
   - Architecture validation passed
   - Verified via `pnpm test -- --run`, lint, and build
   - Reference pages (`localhost:3000/layout-fallout`, `localhost:3000/layout-diablo`) stable
   - No further revision required this cycle

#### Files Modified
- `src/app/(overlay)/overlay/fallout4/[uuid]/page.tsx` — detail zone gate fixed
- `src/app/(overlay)/overlay/diablo2/[uuid]/page.tsx` — labels upgraded to broadcast-safe sizes

#### Validation Path
Established safe path for overlay changes: `SKIP_ENV_VALIDATION=1 pnpm lint && SKIP_ENV_VALIDATION=1 pnpm build`

#### Next Steps
Work is ready for merge and deployment.

### Docker Build — Syntax Directive (2026-03-24)

**Status:** REJECTION — Critical code issue identified by Diablo

**Issue:** Dockerfile missing `# syntax=docker/dockerfile:1` on line 1.
- This directive was present in original commit (b89095f)
- Accidentally removed during unstaged edits
- Required for BuildKit features and multi-stage build reliability
- Failure mode: Some Docker setups fail or fall back to legacy builder

**Root Cause (Credentials Error):** User-environment configuration issue
- `~/.docker/config.json` has `credsStore: "desktop"` without helper in `$PATH`
- Fix: Remove or comment out `credsStore` in user's Docker config
- This is NOT a code issue

**Secondary Issue:** Node native module build failures (bufferutil/utf-8-validate)
- Separate from the syntax directive problem
- Will block builds but is known issue in Node+Docker

**Required Action:**
- Restore `# syntax=docker/dockerfile:1` as line 1
- Verify against clean commit b89095f
- Revalidate build process

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
- GitHub issues may be used for tracking work when helpful (User directive, 2026-03-25)
