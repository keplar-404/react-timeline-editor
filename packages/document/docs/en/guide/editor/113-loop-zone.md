---
title: Loop Zone Overlay
---

# Loop Zone Overlay

The `LoopZoneOverlay` is a visual indicator that renders a draggable repeat region on top of your timeline.

## Usage

Mount `LoopZoneOverlay` as a sibling to `<Timeline>` inside a `position: relative` wrapper. Both components must share the same geometry props (`scale`, `scaleWidth`, `startLeft`).

```tsx
import React, { useState } from 'react';
import { Timeline, LoopZoneOverlay } from '@keplar-404/react-timeline-editor';

export const EditorLoopZone = () => {
  const [loopOn, setLoopOn] = useState(true);
  const [loopStart, setLoopStart] = useState(2);
  const [loopEnd, setLoopEnd] = useState(8);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Geometry must match between components
  const scale = 1;
  const scaleWidth = 160;
  const startLeft = 20;

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setLoopOn(!loopOn)}>
        {loopOn ? 'Disable Loop' : 'Enable Loop'}
      </button>

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
            bandOpacity: 0.1,
            showBoundaryLines: true,
          }}
        />
      )}
    </div>
  );
};
```

## Props Reference

| Prop | Type | Default | Description |
|---|---|---|---|
| `scale` | `number` | **(Required)** | Must match the `<Timeline>` `scale` prop |
| `scaleWidth` | `number` | **(Required)** | Must match the `<Timeline>` `scaleWidth` prop |
| `startLeft` | `number` | **(Required)** | Must match the `<Timeline>` `startLeft` prop |
| `scrollLeft` | `number` | **(Required)** | Current horizontal scroll offset (from `onScroll`) |
| `loopStart` | `number` | **(Required)** | Loop region start time in seconds |
| `loopEnd` | `number` | **(Required)** | Loop region end time in seconds |
| `onLoopStartChange` | `(time: number) => void` | **(Required)** | Called when the user drags the start handle |
| `onLoopEndChange` | `(time: number) => void` | **(Required)** | Called when the user drags the end handle |
| `config` | `LoopZoneConfig` | `{}` | Visual configuration |
| `renderHandle` | `(side: 'start' \| 'end') => ReactNode` | `--` | Custom drag handle renderer |

## Config Options (`LoopZoneConfig`)

| Option | Type | Description |
|---|---|---|
| `bandColor` | `string` | CSS color for the loop region highlight |
| `bandOpacity` | `number` | Opacity of the loop region band (0–1) |
| `showBoundaryLines` | `boolean` | Show dashed vertical boundary lines at loop edges |

## Features

- **Draggable Handles** — Drag the start/end edges to resize the loop zone.
- **Custom Shading** — Highlight the repeat region with any CSS color.
- **Boundary Lines** — Dashed vertical lines help align content within the loop.
- **Custom Handles** — Use `renderHandle` to return your own React nodes for the handles.

## Integration with Transport Bar

For a complete loop-playback experience, combine `LoopZoneOverlay` with the `useTimelinePlayer` hook:

```tsx
const player = useTimelinePlayer(timelineRef, {
  loop: { enabled: loopOn, start: loopStart, end: loopEnd },
});

// The player hook automatically resets playback to loopStart
// when currentTime reaches loopEnd
```
