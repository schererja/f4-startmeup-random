# Squad Decisions

## Active Decisions

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
