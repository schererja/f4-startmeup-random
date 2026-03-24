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
- Docker compose builds here depend on Docker Desktop's `docker-credential-desktop` helper being reachable on PATH; the binary already exists at `/Applications/Docker.app/Contents/Resources/bin/docker-credential-desktop` and a user-level symlink in `~/.local/bin/` restores public image pulls.
- The project Dockerfile only uses standard syntax, so dropping the `# syntax=docker/dockerfile:1` directive avoids an extra frontend image lookup during builds.
- Key Docker paths for local setup are `Dockerfile`, `docker-compose.yml`, and `.env.docker.example`; compose verification succeeded with `docker compose up --build --no-start app db`.
- **Layout Reference Analysis:** Zone-based composition pattern (anchored zones instead of single centered card) is the generalizable design principle for both FO4 and D2 overlays. Reference pages use explicit zone assignment (top-left, bottom-center, etc.) to prevent layout surprise and ensure borders + spacing + position (not color alone) survive gameplay collision.

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

