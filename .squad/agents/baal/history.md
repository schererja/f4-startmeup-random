# Baal — History

## Core Context

- **Project:** A multi-game OBS streaming overlay platform supporting Fallout 4 and Diablo 2 with live web-based overlay sources.
- **Role:** Frontend Dev
- **Joined:** 2026-03-23T21:56:14.980Z

## Learnings

<!-- Append learnings below -->
- The `layout-fallout` reference works because it treats the overlay as full-scene composition, not a single floating card: anchored top-left identity, bottom-center SPECIAL strip, a persistent bottom status bar, and a reserved webcam frame all read cleanly in OBS at a glance.
- The current Fallout 4 overlay already has the right visual language (`OverlayCard`, `StatBox`, `OverlayBadge`, scanlines, CRT glow), but it compresses everything into one card. The next richer pass should spread those same atoms into screen anchors so gameplay stays visible while key info remains legible.
- The `layout-diablo` reference is worth borrowing more selectively: strong corner anchoring, separated status surfaces, and a bottom strip fit the stream use case, while diegetic HUD pieces like health/mana orbs only make sense if real game-state data exists.

## Team Coordination (2026-03-24)

**Orchestration Log:** `.squad/orchestration-log/2026-03-24T20:01:05Z-baal.md`

### Completed Work: Layout Reference Decision
- **Status:** Design patterns finalized and documented
- **Layout Principle:** Anchored composition (top-left identity, bottom center/status strips, reserved webcam area) read faster than packed single panels
- **FO4 Guidance:** Keep Pip-Boy card styling primitives but spread atoms into screen anchors; preserve existing `OverlayCard`, `StatBox`, `OverlayBadge` components
- **D2 Guidance:** Adopt sectioned blocks and hierarchy; avoid copying decorative metaphors (health/mana orbs) without real data

### Reference Points Approved by User
- `localhost:3000/layout-fallout` → positive example of anchored composition
- `localhost:3000/layout-diablo` → reference for sectioned structure and stronger hierarchy

### Ongoing Support
- Ready to guide implementation teams on visual composition and styling reuse
- D2 color palette and keyframes (`d2-ember-glow`, `d2-fade-in`) already established in `/overlay/diablo2/[uuid]`
- FO4 next pass should apply same anchoring principle with existing atoms, not redesign components from scratch

### Cross-Agent Dependencies
- **Tyrael** uses layout reference for FO4 scene expansion scope
- **Mephisto** ensures D2 reference data flows to overlay routers
- **Diablo** validates Docker infrastructure for both game overlay routes
