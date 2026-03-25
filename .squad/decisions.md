# Squad Decisions

## Active Decisions

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
