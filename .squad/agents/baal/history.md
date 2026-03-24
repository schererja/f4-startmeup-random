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
- FO4 layout strength: zone-based (top-left char, center-bottom stats, bottom-left webcam, status strip). Weakness: stat cards can blur at scale; character box needs border to separate from gameplay; webcam label can detach if OBS crops.
- D2 layout strength: explicit corner panels with gold borders (instantly scannable); aesthetic thematic ornaments; centered webcam. Weakness: hardcoded orbs distract without live HP/Mana data; top-right panel may clip in cramped scenes; small font sizes risky at broadcast scale.
- Core principle: Use zone-based layout + explicit borders/spacing (not color alone) to survive dark/light game scene collisions. Make webcam areas unmistakable with frames and labels, positioned away from typical game UI corners.
- **Zone-Based OBS Composition Pattern:** Explicit zone assignment (top-left, bottom-center, etc.) prevents layout surprise; borders + spacing + position (not color alone) survive gameplay collision; reserved areas unambiguous; typography hierarchy <1 second scanning time.

## Team Coordination (2026-03-24T20:25:54Z)

**Orchestration Log:** `.squad/orchestration-log/2026-03-24T20:25:54Z-baal.md`

### Completed Work: Layout Reference Review
- **Status:** Design pattern finalized and comprehensive risk mitigation documented
- **FO4 Guidance:** Keep Pip-Boy atoms, zone anchoring, single accent color; add borders and scaling guards; avoid color-only separation
- **D2 Guidance:** Keep corner panels and gold borders; replace hardcoded orbs with real HP/Mana stats; add difficulty color; avoid decorative elements without data
- **Implementation Guidance:** Zone-based pattern generalizes across games; explicit zone assignment prevents surprise; borders + position survive gameplay collision

### Completed Work: Layout Reference Decision (Updated)
- **Status:** Design validation and approval finalized
- **Pattern Established:** Anchored zone-based layout is generalizable design principle
- **FO4 Zones:** Top-left character, bottom-center SPECIAL, bottom-left webcam, footer strip
- **D2 Zones:** Top-left character, top-right status, bottom-left/right orbs (data-bound), bottom-center webcam, footer strip
- **Query Params:** Keep `minimal|stats|full` but reinterpret for zone visibility control

### Key Deliverables
- Comprehensive strengths/risks analysis of both reference layouts
- Design pattern (zone-based OBS composition) extracted as generalizable principle
- Implementation guidance for each game with specific controls (borders, fonts, data binding)
- Risk mitigations documented (stat card scaling, label stability, decorative element data binding)

### Cross-Agent Dependencies
- **Deckard Cain** completed structural analysis using zone-based pattern
- **Tyrael** will execute FO4 overlay expansion using this design pattern
- **Implementation teams** have pattern, risks, and game-specific guidance ready to proceed

## Design Principles Documented
1. **Zone-Based Layout:** Explicit positioning prevents overlap surprise
2. **Multi-Layer Separation:** Borders, spacing, position (not color alone)
3. **Game-Specific Styling:** Apply composition principle but vary aesthetic per game
4. **Webcam Reservation:** Explicit frames + labels; positioned away from typical game UI
5. **Shared Components:** Status strip pattern reusable across games; game-specific panels separate

## Reference Points Approved by User
- `localhost:3000/layout-fallout` → positive example of anchored composition
- `localhost:3000/layout-diablo` → reference for sectioned structure and stronger hierarchy

## Ongoing Support
- Ready to guide implementation teams on visual composition and styling reuse
- D2 color palette and keyframes already established in `/overlay/diablo2/[uuid]`
- FO4 next pass should apply zone anchoring principle with existing atoms, not redesign components from scratch
