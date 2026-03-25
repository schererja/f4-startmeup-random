---
name: "streamer-scene-shell"
description: "Building practical OBS/browser-source streamer scenes with shared chrome and reserved frames"
domain: "overlay-design"
confidence: "high"
source: "earned"
---

## Context
Use this when adding non-game-specific streamer scenes such as BRB, starting soon, full-cam, transition, or coding layouts. The goal is to make browser sources that feel production-ready in OBS without pretending the browser source is the real camera, game, or editor capture.

## Patterns
- Put generic streamer scenes under `src/app/(overlay)/{scene}/page.tsx` so they get root URLs (`/brb`, `/coding`) while inheriting the transparent `(overlay)` layout.
- Reuse `OverlayCard`, `OverlayBadge`, and `StatBox` through a thin shared scene shell (`stream-scenes.tsx`) instead of rebuilding a second visual system.
- Keep streamer scene chrome stable by default: whole-scene flicker and mount-time fade-ins should be opt-in only, because OBS reloads and hydration make them read like a bad flash.
- Push broadcast-safe typography into shared tokens (for example `stream-scene-tokens.ts`) so eyebrow labels, footer notes, badges, and timer labels cannot drift below the 13px floor.
- Keep major content in anchored support zones and reserve the primary viewing area with explicit framed boxes for webcam, editor, terminal, or chat sources.
- For dense mixed-use scenes like `/coding`, reserve the footer once at the outer shell and use a nested grid (`workspace column` + `support column`) instead of individually absolutely positioning each panel. Let the left column own intro → editor → terminal while the right column owns narration → webcam.
- Use client-only timer helpers (`scene-clocks.tsx`) for countdowns or clocks in otherwise static scenes, but keep decorative clocks visually hidden until client formatting is ready so OBS never shows a `00:00` hydration placeholder.
- For transition scenes, drive motion with lightweight CSS sweeps so OBS can hard-cut the underlying sources while the browser source carries the visual wipe.
- Model transition scenes with explicit `from` and `to` params. A transition page should describe the handoff, not just say "switching scenes."
- Allow small search-param customizations (minutes, labels, project name, stream title) instead of duplicating nearly identical pages.

## Examples
- `src/app/(overlay)/brb/page.tsx`
- `src/app/(overlay)/starting-soon/page.tsx`
- `src/app/(overlay)/full-cam/page.tsx`
- `src/app/(overlay)/transition/page.tsx`
- `src/app/(overlay)/coding/page.tsx`
- `src/app/(overlay)/_components/stream-scenes.tsx`
- `src/app/(overlay)/_components/scene-clocks.tsx`
- `src/app/(overlay)/_components/stream-scene-tokens.ts`

## Anti-Patterns
- Creating placeholder pages with centered text and no reserved source areas.
- Treating the browser scene as fake gameplay or fake camera footage instead of framing real OBS sources underneath.
- Spreading one-off scene styles across multiple pages when shared chrome can enforce consistent borders, spacing, and footer treatment.
- Using heavy data fetching for intermission scenes that only need local countdown or label changes.
- Leaving `obs-flicker` or `obs-fadein` on by default for shared scene chrome; browser-source refreshes replay them and flash the entire composition.
- Leaving decorative clocks to render a visible placeholder before hydration finishes.
- Encoding transition intent in a single vague label when the scene actually needs to communicate a real source swap.
