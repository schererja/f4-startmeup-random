# Streamer Scene Quality Assurance

## What This Skill Covers
Testing and validating OBS-compatible streamer scene pages (BRB, starting-soon, full-cam, transition, coding layouts). Ensures scenes are broadcast-safe, responsive, and immediately useful on stream.

## When to Use This Skill
- Implementing new streamer scene pages under `(overlay)` layout group
- Adding or modifying scene query parameters
- Refactoring scene layout without changing functionality
- Integrating optional live data into static scenes
- Updating text, sizing, or color scheme on existing scenes

## Key Principles

### 1. Stream Readability is Non-Negotiable
- **Minimum font size:** 13px (measured at typical 1920×1080 OBS viewport)
- **Text contrast:** 4.5:1 WCAG AA minimum against likely game backdrops
- **Font families:** Serif or sans-serif; no decorative or script fonts
- **Rationale:** Streamer viewers may watch at 50% zoom; illegible text breaks immersion
- **Shared-atom rule:** enforce the 13px floor in reusable scene primitives too (`OverlayBadge`, timer labels, eyebrow/meta text), because one undersized helper can fail every scene at once

### 2. Transparent Background is Default
- All streamer scenes inherit `(overlay)/layout.tsx` style: `body { background: transparent !important; }`
- No white/black/colored backgrounds unless explicitly designed for full-screen scenes
- Transparent backgrounds allow OBS compositing over gameplay

### 3. Layouts Must Be Immediately Useful
- **BRB scene:** Clear status message; no empty spaces or confusing UI
- **Starting-soon scene:** Countdown must be readable and functional
- **Full-cam scene:** Streamer's face is the content; minimize UI overlay
- **Transition scene:** Useful talking point bridge between games/segments
- **Coding scene:** Generic workspace layout (not game-specific); IDE + webcam zones clearly separated

### 4. Query Params Enable Customization Without Code
- All params are optional; missing params degrade to sensible defaults
- Invalid param values don't crash or blank the scene
- Common params: `?time=` (seconds), `?message=` (text), `?from=`, `?to=` (scene names), `?ui=off` (hide UI)

### 5. No Hydration Jank (Static Rendering is Stable)
- Initial server render matches final client render (no pop-in, no reflow)
- Avoid client-side date/time operations that differ on server/client
- Refresh multiple times; layout should never shift or flicker
- Use `suppressHydrationWarning` only if unavoidable
- If a local clock is decorative, prefer omitting it over rendering a placeholder like `00:00` that visibly swaps after hydration

### 6. OBS Integration Must Be Seamless
- Pages respond cleanly to browser window resize (no horizontal overflow)
- Text remains readable below ~800px width
- Aspect ratio is flexible (scene doesn't assume 16:9, 4:3, etc.)
- `pointer-events: none` on parent div prevents OBS interaction

## Testing Phases (4)

### Phase 1: Route & Layout Verification (~5 min)
**Goal:** Confirm routes exist, pages load cleanly, and inherit overlay styling

Steps:
1. `curl -I localhost:3000/brb` → expect 200 OK (no 404, no auth redirect)
2. Visit `http://localhost:3000/brb` in browser; confirm no errors, no Clerk login
3. Right-click → Inspect → Body element; confirm `background: transparent` style
4. Repeat for all 5 scenes: `/brb`, `/starting-soon`, `/full-cam`, `/transition`, `/coding`

**Failure Modes:** 404, Clerk redirect, server error, missing transparent background

---

### Phase 2: Stream Safety Checks (~10 min)
**Goal:** Validate typography, contrast, and flashing regression for broadcast readiness

Steps:
1. **Font Sizes:**
   - Open DevTools → Elements tab
   - Select all readable text elements (h1, p, span with content)
   - Check Computed styles; record all font-size values
   - Confirm all readable text ≥13px
   
2. **Text Contrast:**
   - Screenshot the scene (full browser window)
   - Overlay against typical game backdrop (Fallout 4 or Diablo 2 gameplay screenshot)
   - Visually inspect contrast; text should pop against dark/light backgrounds
   - (Alternative: Use a contrast checker tool like WebAIM)
   
3. **No Flashing:**
   - Open each scene in OBS as a browser source (or just browser)
   - Refresh page 5 times (Cmd+R or Ctrl+R)
   - Watch for unintended flashing, layout shift, or pop-in
   - Scenes should remain visually stable across all 5 refreshes
   
4. **Parameter Handling:**
   - Test with valid params: `?time=300`, `?message=Back+soon`, `?from=FO4&to=D2`
   - Test with invalid params: `?time=invalid`, `?time=-5`, `?message=` (empty)
   - Confirm no errors; scenes degrade gracefully with defaults

**Failure Modes:** Text <13px, poor contrast, flashing on refresh, errors with invalid params

---

### Phase 3: Webcam & Scene Layout (~5 min)
**Goal:** Verify that scene layouts are visually distinct and actually useful on stream

**For `/full-cam`:**
- DevTools → Measure reserved region (width, height, positioning)
- Document: "Reserved region is 1920×1080 (fullscreen)" or "400×225 center-bottom"
- Confirm no UI clutter obscuring streamer's face
- Try resizing OBS source; confirm no aspect ratio distortion

**For `/transition` and `/coding`:**
- View on 16:9 monitor (1920×1080 or similar)
- Visually separate zones:
  - Transition: Game names/titles clearly visible, space for streamer commentary
  - Coding: IDE area (top/left), webcam area (corner), notes section (if present)
- Test query params for customization: `?from=Game+A&to=Game+B` (transition), `?section=Modding` (coding)
- Confirm zones are distinct (border, spacing, color, position — not just color alone)

**For `/brb` and `/starting-soon`:**
- Confirm message is readable at scale
- Countdown (if present) is clearly formatted and easy to read
- No unnecessary decoration or clutter

**Failure Modes:** Illegible layouts, zones blend together, query params don't customize visibly, full-cam obscured by UI

---

### Phase 4: Regression Prevention (~5 min)
**Goal:** Ensure pages remain stable under resize and repeated access

Steps:
1. **Hydration Stability:**
   - DevTools → Network tab; disable cache
   - Refresh page 3 times
   - Confirm visual output matches across all refreshes (no pop-in, no reflow)
   - Check browser console for hydration warnings (should be none)

2. **Resize Test:**
   - Open scene in browser
   - Drag window from 1920px width down to 600px width
   - Confirm layout adapts (no horizontal overflow, text remains readable)
   - Confirm no horizontal scroll bar appears

3. **OBS Integration:**
   - Add scene URL as OBS browser source
   - Resize OBS source from fullscreen to 50% scale and back
   - Confirm no layout shift, no text distortion, no clipping

**Failure Modes:** Hydration warnings, pop-in on refresh, overflow at small widths, OBS distortion

---

## Acceptance Criteria

### Must-Have (Required; blocks approval)
- ✅ Route is public (no 404, no Clerk redirect)
- ✅ Page loads without errors
- ✅ All readable text ≥13px
- ✅ Text contrast ≥4.5:1 WCAG AA
- ✅ No unintended flashing on refresh
- ✅ No errors with missing/invalid query params
- ✅ OBS browser source can resize without breaking

### Should-Have (Expected; approved with minor notes if missing)
- ✅ Query params enable customization (scene title, countdown, game names, etc.)
- ✅ Scene layout is visually distinct and useful on stream
- ✅ Hydration is stable (no pop-in or reflow on refresh)
- ✅ Responsive design works below 800px width

### Nice-to-Have (Future enhancement)
- 🔄 Animated countdowns with smooth transitions
- 🔄 Optional live data integration (character name, current run)
- 🔄 Theme customization via query params (colors, fonts)
- 🔄 Keyboard shortcuts for scene switching

---

## Common Patterns & Anti-Patterns

### ✅ Good: Query Params with Sensible Defaults
```tsx
export default function BRBPage({
  searchParams,
}: {
  searchParams: { message?: string; timer?: string };
}) {
  const displayMessage = searchParams.message ?? "Be Right Back";
  const timerSeconds = parseInt(searchParams.timer ?? "0", 10);
  
  return (
    <div>
      <h1>{displayMessage}</h1>
      {timerSeconds > 0 && <CountdownTimer seconds={timerSeconds} />}
    </div>
  );
}
```

### ✅ Good: Stable Rendering (No Hydration Jank)
```tsx
// Server and client match exactly
const scene = "BRB";
return <div>{scene}</div>;

// NOT: new Date().toLocaleString() (differs on server/client)
```

### ❌ Bad: Fixed Aspect Ratio
```tsx
// Scene assumes 16:9; breaks on 4:3 or mobile
<div style={{ aspectRatio: "16/9" }}>...content...</div>
```

### ❌ Bad: Colored Background (Breaks OBS Compositing)
```tsx
// Transparent background required for OBS overlay
<div style={{ background: "#1a1a1a" }}>...content...</div>
```

### ❌ Bad: Small Font Sizes
```tsx
// 13px minimum; 11px is unreadable on stream
<p style={{ fontSize: "11px" }}>Critical message</p>
```

### ❌ Bad: Client-Only Placeholder Clocks
```tsx
// Viewers see "00:00" pop to the real time after hydration
return <span suppressHydrationWarning>{time ?? "00:00"}</span>;
```

---

## Integration Checklist

Before deploying a new streamer scene:

- [ ] All 5 phases of testing completed and documented
- [ ] No must-have acceptance criteria violations
- [ ] Scene added to `.squad/decisions/inbox/diablo-{scene}-gate.md` or similar for team coordination
- [ ] Query params documented in commit message or PR description
- [ ] Team notified of new scene availability (if coordination required)

---

## Related Skills & Patterns

- **Overlay Polling Patterns** (`.squad/skills/overlay-polling-patterns/SKILL.md`): For scenes that pull live data
- **Layout Reference Guidance** (`.squad/decisions/decisions.md`): Zone-based OBS composition pattern for transition/coding layouts
- **Broadcast Typography** (Diablo history): 13px minimum font size rule for all streaming contexts

## Authored By
**Diablo (Tester)** — 2026-03-25  
**Rationale:** Streamer scenes require unique QA perspective (stream readability, OBS integration, static layout usefulness) distinct from game overlay testing. Reusable pattern for future scene implementations.
