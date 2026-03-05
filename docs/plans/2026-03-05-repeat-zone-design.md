# Design: Repeat Zone

**Date:** 2026-03-05

## Summary

Add a draggable loop/repeat zone to the timeline ruler in the example demo. When enabled, the engine cursor loops back to `loopStart` when it reaches `loopEnd`.

## Visual Layout

```
┌────────────────────────────────────────────────────────────┐
│  ⏮ ⏪ ▶ ⏩ ⏹  [🔁]  1.00→ 3.00  │  0:00.00  │  SPEED  │
├────────────────────────────────────────────────────────────┤
│  0    [████████████████]  3   4   5   ← Time Ruler        │
│        ↑ loop-start    ↑ loop-end  (draggable handles)    │
├────────────────────────────────────────────────────────────┤
│  ░░░ <Timeline rows / blocks> ░░░░░░░░░░░░░░░░░░░░░░░░░  │
└────────────────────────────────────────────────────────────┘
```

## Components

### `LoopZoneOverlay`

- Positioned absolutely inside `.timeline-wrapper`, `height: 32px` (ruler height), `top: 0`
- Semi-transparent green band from `loopStart → loopEnd`
- Two draggable handle bars with `onMouseDown` + document `mousemove`/`mouseup`
- Pixel positions: `left = startLeft + (time / scale) * scaleWidth - scrollLeft`
- `scrollLeft` tracked via `onScroll` prop on `<Timeline>`

### Transport Bar additions

- 🔁 loop toggle button after Stop — glows green when active
- When active: two numeric inputs showing `loopStart` and `loopEnd` (seconds)

### Loop Playback Logic

- Refs (`loopEnabledRef`, `loopStartRef`, `loopEndRef`) keep values fresh inside the engine tick handler (avoids stale closure)
- `handleTick`: if `loopEnabled && time >= loopEnd` → `setTime(loopStart)`

## Files Changed

### MODIFY `packages/example/src/components/row-drag/index.tsx`

- Add loop state + refs + update functions
- Update tick handler with loop check
- Add onScroll to Timeline to track scrollLeft
- Add `LoopZoneOverlay` component
- Extend `TransportBarProps` and `TransportBar` JSX
- Render `<LoopZoneOverlay>` inside `.timeline-wrapper`

### MODIFY `packages/example/src/components/row-drag/index.less`

- `.loop-zone-overlay`, `.loop-zone-band`, `.loop-zone-handle`, `.loop-zone-input` styles
