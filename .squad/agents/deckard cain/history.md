# Deckard Cain — History

## Core Context

- **Project:** A multi-game OBS streaming overlay platform supporting Fallout 4 and Diablo 2 with live web-based overlay sources.
- **Role:** Full Stack Dev
- **Joined:** 2026-03-23T21:56:14.979Z

## Recent Work

### Docker Build Failure (2026-03-24)
- **Status:** Attempted fix — stalled, no output returned
- **Task:** Fix Docker build failure
- **Next Step:** Review Diablo's findings — Dockerfile missing `# syntax=docker/dockerfile:1` on line 1 (critical). Original commit b89095f had this line; it was removed in unstaged edits.
- **See:** `.squad/decisions.md` for full decision context

## Learnings

<!-- Append learnings below -->
- 2026-03-25: For OBS-friendly browser scenes that frame external captures, replace decorative mock content with explicit source-target copy like “Real editor source goes here” or “Real camera source goes here,” and spell out the OBS layer order directly in the scene (`src/app/(overlay)/coding/page.tsx`, `src/app/(overlay)/full-cam/page.tsx`).
- 2026-03-25: `SceneParamDocs` in `src/app/(overlay)/_components/stream-scenes.tsx` now supports `layout="static"` so setup docs can live inside a support rail instead of covering webcam/editor targets on dense scenes.
- 2026-03-25: `src/app/(overlay)/coding/page.tsx` reads cleanest when the scene body uses one absolute wrapper with a reserved footer lane plus a two-column grid (`main workspace` + `right rail`) instead of individually positioned panels; nested rows keep the editor, terminal, narration rail, and webcam reserve from colliding.
- Docker compose builds here depend on Docker Desktop's `docker-credential-desktop` helper being reachable on PATH; the binary already exists at `/Applications/Docker.app/Contents/Resources/bin/docker-credential-desktop` and a user-level symlink in `~/.local/bin/` restores public image pulls.
- The project Dockerfile only uses standard syntax, so dropping the `# syntax=docker/dockerfile:1` directive avoids an extra frontend image lookup during builds.
- Key Docker paths for local setup are `Dockerfile`, `docker-compose.yml`, and `.env.docker.example`; compose verification succeeded with `docker compose up --build --no-start app db`.
- **Layout Reference Analysis:** Zone-based composition pattern (anchored zones instead of single centered card) is the generalizable design principle for both FO4 and D2 overlays. Reference pages use explicit zone assignment (top-left, bottom-center, etc.) to prevent layout surprise and ensure borders + spacing + position (not color alone) survive gameplay collision.
- 2026-03-25: The Fallout 4 overlay detail-zone gate in `src/app/(overlay)/overlay/fallout4/[uuid]/page.tsx` needs an explicit null-safe boolean (`(traitDescription ?? locationDescription) !== undefined`) to satisfy `@typescript-eslint/prefer-nullish-coalescing` without changing when the right-side cards render.
- 2026-03-25: Diablo II overlay broadcast labels in `src/app/(overlay)/overlay/diablo2/[uuid]/page.tsx` stay readable after downscaling when section and badge labels are held at roughly 13px via shared size tokens instead of shrinking the whole chrome.
- 2026-03-25: Repo-safe overlay validation is `SKIP_ENV_VALIDATION=1 pnpm lint` and `SKIP_ENV_VALIDATION=1 pnpm build`; after the overlay revision, lint passes with existing baseline warnings and build succeeds.
- 2026-03-25: Streamer-scene chrome now shares a 13px floor through `src/app/(overlay)/_components/stream-scene-tokens.ts`, which is consumed by `stream-scenes.tsx`, `OverlayBadge.tsx`, `StatBox.tsx`, and scene pages that render broadcast meta labels.
- 2026-03-25: Decorative local clocks in `src/app/(overlay)/_components/scene-clocks.tsx` should reserve width with hidden tabular numerals until the client formats local time, preventing the old visible `00:00` hydration pop on `/brb` and `/starting-soon`.
- 2026-03-25: `src/app/(overlay)/transition/page.tsx` now models handoffs with explicit `from` and `to` params (while still honoring legacy `next`), so transition scenes can communicate source swaps instead of generic placeholder copy.

## Team Coordination (2026-03-24T20:25:54Z)

**Orchestration Log:** `.squad/orchestration-log/2026-03-24T20:25:54Z-deckard-cain.md`

### Completed Work: Overlay Layout Reference Mapping
- **Status:** Structural analysis finalized and documented
- **Pages to Refactor:** `src/app/(overlay)/overlay/fallout4/[uuid]/page.tsx`, `src/app/(overlay)/overlay/diablo2/[uuid]/page.tsx`
- **Components Proposed:** CharacterPanel, SpecialBar, FooterStrip, WebcamReserved, D2CharacterPanel, D2StatusPanel, D2OrbSection
- **Utilities:** `zone-layout.ts` with constants and helpers; `overlay-layout-grid.css` for positioning
- **Layout Query Params:** Reinterpreted `minimal|stats|full` to control zone visibility instead of screen variants

### Key Insights
- FO4 reference: 1920×1080 anchored zones (top-left char, bottom-center SPECIAL, bottom-left webcam, status strip) vs. current single ~520px card
- D2 reference: Explicit corner panels with gold borders; separated status surfaces read faster than packed single panel
- Refactoring targets identified; structural roadmap ready for implementation teams

### Cross-Agent Dependencies
- **Baal** completed design pattern validation and implementation risk mitigation
- **Tyrael** will use these findings for Fallout 4 overlay expansion scope
- Output feeds into zone-based refactoring work stream

## Files & Components to Change
- `src/app/(overlay)/overlay/fallout4/[uuid]/page.tsx` — refactor to zones
- `src/app/(overlay)/overlay/diablo2/[uuid]/page.tsx` — refactor to zones
- New components needed: `CharacterPanel.tsx`, `SpecialBar.tsx`, `FooterStrip.tsx`, `WebcamReserved.tsx`, `D2CharacterPanel.tsx`, `D2StatusPanel.tsx`, `D2OrbSection.tsx`
- New utilities: `src/app/(overlay)/_lib/zone-layout.ts` for constants and helpers

## Layout Query Param Strategy
Keep `layout=minimal|stats|full` but reinterpret:
- `minimal`: Character name only (only top-left zone visible)
- `stats`: Character + key stats (reduced zones, no footer)
- `full`: All zones including footer and decorative elements

## Team Coordination (2026-03-25T02:43:59Z)

**Orchestration Log:** `.squad/orchestration-log/2026-03-25T02:43:59Z-deckard-cain.md`

### Completed Work: Overlay Revision (Final Pass)
- **Status:** ✅ APPROVED by Diablo — No further revision needed
- **Fixes Applied:**
  1. Fallout 4 detail-panel gate: Replaced `showFull && (traitDescription || locationDescription)` with null-safe `(traitDescription ?? locationDescription) !== undefined`
  2. Diablo II label typography: Raised section and badge labels to ≥13px via shared size tokens
- **Validation:** Both changes clear prior blockers without altering visual behavior
- **Files:** `src/app/(overlay)/overlay/fallout4/[uuid]/page.tsx`, `src/app/(overlay)/overlay/diablo2/[uuid]/page.tsx`
- **Outcome:** Work ready for merge and deployment

### Session Log
See `.squad/log/2026-03-25T02:43:59Z-overlay-approval.md` for full session summary

## Team Coordination (2026-03-25T18:24:49Z)

**Orchestration Log:** `.squad/orchestration-log/2026-03-25T18:24:49Z-deckard-cain.md`

### Completed Work: Streamer Scenes Revision (Final Delivery)
- **Status:** ✅ APPROVED by Diablo — No further revision needed
- **Task:** Rework shared streamer-scene shell around three concrete guardrails
- **Fixes Applied:**
  1. Broadcast Typography Floor: Created `stream-scene-tokens.ts` with `STREAM_SCENE_MIN_FONT_SIZE_REM` constant; applied ≥13px minimum to all stream-facing text in `OverlayBadge.tsx`, `StatBox.tsx`, scene labels, footer notes
  2. Hydration Clock Pop-in: Modified `scene-clocks.tsx` `LiveClock` to reserve width with hidden tabular numerals until client formats local time; no visible `00:00` swap on `/brb` and `/starting-soon`
  3. Transition Handoff Model: Enhanced `/transition/page.tsx` with explicit `from` and `to` query params for clear scene-switching; maintained backward-compatible `next` fallback
- **Validation:**
  - ✅ `pnpm test -- --run` (all tests pass)
  - ✅ `SKIP_ENV_VALIDATION=1 pnpm lint` (baseline warnings only)
  - ✅ `SKIP_ENV_VALIDATION=1 pnpm build` (build succeeds)
- **Files:** `src/app/(overlay)/_components/stream-scene-tokens.ts` (new), `src/app/(overlay)/_components/stream-scenes.tsx`, `src/app/(overlay)/_components/OverlayBadge.tsx`, `src/app/(overlay)/_components/StatBox.tsx`, `src/app/(overlay)/_components/scene-clocks.tsx`, `src/app/(overlay)/transition/page.tsx`
- **Outcome:** Feature ready for merge and deployment; streamer scenes (brb, starting-soon, full-cam, transition, coding) approved and pass all broadcast-safety gates

### Session Log
See `.squad/log/2026-03-25T18:24:49Z-streamer-scenes-approval.md` for full session summary

## Team Coordination (2026-03-25T19:59:33Z)

**Session:** Scene fixes — coding layout grid shell, streamer scene no-flash defaults, scene param documentation
**Orchestration Log:** `.squad/orchestration-log/2026-03-25T19:59:33Z-deckard-cain.md`

### Completed Work: Coding Scene Grid Shell
- **Status:** ✅ DELIVERED & APPROVED
- **Scope:** `src/app/(overlay)/coding/page.tsx`
- **Results:**
  - Refactored from overlapping absolute zones to reserved two-column grid shell
  - Left column: intro, editor, terminal (stacked rows)
  - Right column: narration, webcam reserve (stacked rows)
  - Footer reserved at shell level; interior padding eliminates chrome collisions
  - Layout collision regression test added
- **Validation:** ✅ Test, lint, build, manual browser verification at OBS source sizes all pass

### Cross-Team Coordination
- **Baal** completed stream scene no-flash defaults (opt-in animations across all scenes)
- **Mephisto** completed scene data-flow pass (param docs, hydration flash fixed)
- **Scribe** consolidated team decisions into decisions.md

### Grid Shell Pattern for Future Scenes
Two-column grid with reserved footer stabilizes layout at common OBS/browser sizes. All team members validated against same baseline: `SKIP_ENV_VALIDATION=1 pnpm test && pnpm lint && pnpm build`.

## Team Coordination (2026-03-25T20:18:27Z)

**Session:** Team coordination — framing fixes orchestration
**Orchestration Log:** `.squad/orchestration-log/2026-03-25T20:18:27Z-deckard-cain.md`
**Session Log:** `.squad/log/2026-03-25T20:18:27Z-framing-fixes.md`

### Team Alignment: OBS Source-Map Scenes
- **Session Focus:** Align Deckard Cain & Baal on shared framing architecture
- **Deckard Cain Work:** Reworked `/coding` and `/full-cam` scenes as OBS setup guides
  - Explicit real-source target labels
  - Clear OBS layer ordering
  - Center kept clear in full-cam
  - Scene param docs moved out of reserved capture zones
- **Baal Work:** Browser-source transparency across full-cam, coding, FO4, D2 overlays
  - Transparent framing chrome, not fake embedded feeds
  - Explicit source-below cues with OBS target language
  - Consistent layering approach across all scenes
- **Decision:** Both decisions merged to `decisions.md` (IDs: `deckard cain-obs-source-map-scenes`, `baal-browser-source-framing`)
- **Validation:** ✅ All team work aligned; patterns documented; ready for integration

### Decisions Merged
1. **OBS Source-Map Scenes:** `/coding` and `/full-cam` now read as real OBS composition guides
2. **Browser Source Framing:** Transparent shells with explicit source labels team standard

### Next Steps
- Grid shell and transparent frame patterns ready for team reuse
- Future scenes should adopt explicit source-target architecture
- Scene composition principle now documented for scaling
