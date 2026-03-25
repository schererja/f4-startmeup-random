---
name: "overlay-polling-patterns"
description: "Keeping OBS overlays visually stable while live data refreshes in Next.js"
domain: "overlay-streaming"
confidence: "high"
source: "earned"
---

## Context
Use this when an OBS/browser-source overlay needs fresh data but a full page refresh would replay fade/glow animations or redraw every zone at once. The goal is live updates without the stream-visible flash that happens when the whole overlay remounts.

## Patterns
- Render the first overlay frame on the server, then hand it to a client scene component that owns ongoing refreshes.
- Keep the route page thin: fetch initial payload plus layout params server-side, then delegate the entire live scene to one mounted client component per overlay.
- Poll the existing public tRPC query from the client with `refetchInterval` and `refetchIntervalInBackground` so the browser source stays mounted.
- Seed the client query with `initialData` from the server page so the overlay paints immediately and then refreshes in place.
- Use `placeholderData: (previousData) => previousData`, disable mount/focus refetches when appropriate, and avoid `isLoading`-driven branches during steady-state polling.
- Keep the last good payload on screen during transient refresh failures; swap to a small status indicator instead of replacing the whole overlay with an error state.
- Put any “live / syncing / signal lost” affordance in a fixed panel region so refresh state changes do not move layout zones.

## Examples
- `src/app/(overlay)/overlay/fallout4/[uuid]/page.tsx` seeds `src/app/(overlay)/overlay/fallout4/[uuid]/OverlayClient.tsx`
- `src/app/(overlay)/overlay/diablo2/[uuid]/page.tsx` seeds `src/app/(overlay)/overlay/diablo2/[uuid]/OverlayClient.tsx`
- `src/app/(overlay)/_components/LiveOverlayStatusBadge.tsx` shares the refresh interval and status affordance across overlay themes

## Anti-Patterns
- Relying on OBS/browser-source reloads as the normal update path.
- Letting refresh logic live only in server components, which forces full-scene remounts for every data update.
- Replacing the full overlay with a loading or error card during background refetches.
- Tying status UI to a zone that appears/disappears across layout modes.
