---
name: "overlay-zone-layout"
description: "Designing OBS overlays with anchored zones and clear reserved areas"
domain: "overlay-design"
confidence: "high"
source: "earned"
---

## Context
Use this when building OBS/browser-source overlays that must preserve gameplay visibility while still delivering readable character info.

## Patterns
- Anchor panels to explicit zones (top-left identity, top-right status, bottom edge details) with absolute positioning inside a full-viewport container.
- Reserve webcam areas with labeled frames and explicit dimensions so OBS crops remain stable.
- Map layout modes to zone visibility (`minimal` = identity only, `stats` = identity + key stats, `full` = all zones + footer).
- Only surface real data from APIs; avoid decorative HUD elements without live values.
- Structural parity with a reference layout should preserve zone intent and crop behavior, not force fake HUD metaphors when the app lacks live telemetry for them.
- Treat broadcast text sizing as a quality gate: D2 overlay labels should stay at or above roughly 13px so OBS downscaling does not erase hierarchy.
- Prefer shared typography tokens for overlay labels so readability fixes raise the minimum text size without thickening borders, padding, or panel density.
- When optional content gates a zone, use null-safe conditions that satisfy repo lint/build rules; overlay layout code must still pass `SKIP_ENV_VALIDATION=1 pnpm lint` and build.

## Examples
- `src/app/(overlay)/overlay/fallout4/[uuid]/page.tsx`
- `src/app/(overlay)/overlay/diablo2/[uuid]/page.tsx`

## Anti-Patterns
- Centered single cards that cover the gameplay area.
- Fake HUD elements (health/mana orbs, bars) without live game telemetry.
- Sub-13px labels for stream-facing status text.
- Optional-zone conditionals that introduce lint/build regressions during layout refactors.
