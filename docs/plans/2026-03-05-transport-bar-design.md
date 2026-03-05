# Design: Playback Transport Bar

## Summary

Add an inline transport bar between the demo header and the `<Timeline>` component in the example demo app. The bar lets users control playback from the timeline cursor position without using the sidebar.

## Layout

```
┌────────────────────────────────────────────────────────┐
│  Header (React Timeline Editor Enhanced)               │
├────────────────────────────────────────────────────────┤
│  ⏮  ⏪  ▶  ⏩  ⏹   │  0:00.00  │  Speed: 1×  ▾  │  ← NEW
├────────────────────────────────────────────────────────┤
│  ░░░░░░░░░ <Timeline /> ░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
└────────────────────────────────────────────────────────┘
```

## Controls

| Button             | Action                                        |
| ------------------ | --------------------------------------------- |
| ⏮ Return to start  | `ref.setTime(0)`                              |
| ⏪ Rewind 5s       | `ref.setTime(current - 5)`                    |
| ▶ / ⏸ Play / Pause | `ref.play({ autoEnd: true })` / `ref.pause()` |
| ⏩ Forward 5s      | `ref.setTime(current + 5)`                    |
| ⏹ Stop             | `ref.pause()` then `ref.setTime(0)`           |
| Speed selector     | `ref.setPlayRate()` — 0.25×, 0.5×, 1×, 2×, 4× |

Time display updates live via the engine's `setTimeByTick` event.

## Files Changed

### MODIFY `packages/example/src/components/row-drag/index.tsx`

- Add `useRef<TimelineState>(null)` for the `<Timeline>` ref
- Add `<TransportBar>` component (inline in same file) with play/pause/stop/rewind/forward/rate controls
- Listen to `play`, `paused`, `setTimeByTick` engine events via `ref.current.listener`
- Place `<TransportBar>` above `<Timeline>` inside `demo-main`

### MODIFY `packages/example/src/components/row-drag/index.less`

- Add `.transport-bar` styles matching the dark premium theme
