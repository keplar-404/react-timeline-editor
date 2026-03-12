# Loop Zone Overlay API

Complete API reference for the `LoopZoneOverlay` component from `@keplar-404/react-timeline-editor`.

---

## Overview

`LoopZoneOverlay` renders a draggable repeat region overlay on top of your `<Timeline>`. It must be:

1. Mounted as a **sibling** to `<Timeline>` inside a `position: relative` wrapper.
2. Given the **same geometry props** (`scale`, `scaleWidth`, `startLeft`) as the `<Timeline>`.
3. Kept in sync with the timeline's `scrollLeft` via the `onScroll` callback.

---

## Props Reference

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `scale` | `number` | ✅ | — | Must match `<Timeline>` `scale` prop |
| `scaleWidth` | `number` | ✅ | — | Must match `<Timeline>` `scaleWidth` prop |
| `startLeft` | `number` | ✅ | — | Must match `<Timeline>` `startLeft` prop |
| `scrollLeft` | `number` | ✅ | — | Current horizontal scroll offset (from `onScroll`) |
| `loopStart` | `number` | ✅ | — | Loop region start time in seconds |
| `loopEnd` | `number` | ✅ | — | Loop region end time in seconds |
| `onLoopStartChange` | `(time: number) => void` | ✅ | — | Called when the user drags the start handle |
| `onLoopEndChange` | `(time: number) => void` | ✅ | — | Called when the user drags the end handle |
| `config` | `LoopZoneConfig` | — | `{}` | Visual configuration |
| `renderHandle` | `(side: 'start' \| 'end') => ReactNode` | — | — | Custom drag handle renderer |

---

## `LoopZoneConfig`

| Option | Type | Default | Description |
|---|---|---|---|
| `bandColor` | `string` | `'#3b82f6'` | CSS color for the loop region highlight band |
| `bandOpacity` | `number` | `0.1` | Opacity of the loop band (0–1) |
| `showBoundaryLines` | `boolean` | `true` | Show dashed vertical boundary lines at loop edges |

---

## Usage Example

```tsx
import React, { useState } from 'react';
import { Timeline, LoopZoneOverlay } from '@keplar-404/react-timeline-editor';

export const App = () => {
  const [loopOn, setLoopOn] = useState(true);
  const [loopStart, setLoopStart] = useState(2);
  const [loopEnd, setLoopEnd] = useState(8);
  const [scrollLeft, setScrollLeft] = useState(0);

  const scale = 1;
  const scaleWidth = 160;
  const startLeft = 20;

  return (
    <div style={{ position: 'relative' }}>
      <Timeline
        scale={scale}
        scaleWidth={scaleWidth}
        startLeft={startLeft}
        editorData={[]}
        effects={{}}
        onScroll={(p) => setScrollLeft(p.scrollLeft)}
      />

      {loopOn && (
        <LoopZoneOverlay
          scale={scale}
          scaleWidth={scaleWidth}
          startLeft={startLeft}
          scrollLeft={scrollLeft}
          loopStart={loopStart}
          loopEnd={loopEnd}
          onLoopStartChange={setLoopStart}
          onLoopEndChange={setLoopEnd}
          config={{
            bandColor: '#10b981',
            bandOpacity: 0.12,
            showBoundaryLines: true,
          }}
        />
      )}
    </div>
  );
};
```

---

## Custom Handle Renderer

Use `renderHandle` to replace the default handle with your own React node:

```tsx
<LoopZoneOverlay
  // ... other props ...
  renderHandle={(side) => (
    <div className={`my-handle my-handle-${side}`}>
      {side === 'start' ? '⟨' : '⟩'}
    </div>
  )}
/>
```

---

## Integration with `useTimelinePlayer`

Combine `LoopZoneOverlay` with `useTimelinePlayer` for automatic loop-playback behavior:

```tsx
const player = useTimelinePlayer(timelineRef, {
  loop: { enabled: loopOn, start: loopStart, end: loopEnd },
});
// The hook automatically resets playback to loopStart when currentTime >= loopEnd
```
