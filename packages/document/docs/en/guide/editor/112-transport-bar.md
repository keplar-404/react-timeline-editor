---
title: Transport Bar
---

# Transport Bar

The `TransportBar` is a pre-built professional playback controls UI.

It includes:
- **Transport controls**: Return to start, Rewind, Play/Pause, Forward, Stop
- **Time display**: Formatted time readout (`M:SS.ms`)
- **Playback rate**: Speed selector (0.25×, 0.5×, 1×, 2×, 4×)
- **Loop controls**: Toggle and input fields for refining a loop region

## Basic Usage

Pair `TransportBar` with the `useTimelinePlayer` hook and a `ref` of your `<Timeline>` component.

```tsx
import React, { useState, useRef } from 'react';
import {
  Timeline,
  TimelineState,
  TransportBar,
  useTimelinePlayer,
} from '@keplar-404/react-timeline-editor';

const mockData = [
  {
    id: 'row-1',
    actions: [{ id: 'action-1', start: 0, end: 5, effectId: 'effect0' }],
  },
];

const mockEffect = {
  effect0: { id: 'effect0', name: 'Effect 0' },
};

export const EditorWithTransport = () => {
  const timelineRef = useRef<TimelineState>(null);
  const [data, setData] = useState(mockData);

  // 1. Initialize the player hook
  const player = useTimelinePlayer(timelineRef);

  return (
    <div className="editor-container">
      {/* 2. Render the TransportBar and pass the player object */}
      <TransportBar player={player} />

      <Timeline ref={timelineRef} editorData={data} effects={mockEffect} onChange={setData} />

      <style>{`
        .editor-container {
          background: #1a1a1a;
          padding: 8px;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};
```

## With Loop Controls

Integrate a loop region by providing `loop` to both `useTimelinePlayer` and `TransportBar`:

```tsx
export const EditorWithLoopTransport = () => {
  const timelineRef = useRef<TimelineState>(null);
  const [data, setData] = useState(mockData);
  const [loopOn, setLoopOn] = useState(false);
  const [loopStart, setLoopStart] = useState(1);
  const [loopEnd, setLoopEnd] = useState(5);

  const player = useTimelinePlayer(timelineRef, {
    loop: { enabled: loopOn, start: loopStart, end: loopEnd },
  });

  return (
    <div className="editor-container">
      <TransportBar
        player={player}
        loop={{
          enabled: loopOn,
          start: loopStart,
          end: loopEnd,
          onToggle: () => setLoopOn(!loopOn),
          onStartChange: setLoopStart,
          onEndChange: setLoopEnd,
        }}
      />
      <Timeline ref={timelineRef} editorData={data} effects={mockEffect} onChange={setData} />
    </div>
  );
};
```

## `useTimelinePlayer` Hook

The `useTimelinePlayer` hook manages all playback state and attaches engine event listeners automatically.

```typescript
const player = useTimelinePlayer(ref, options);
```

### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `seekStep` | `number` | `5` | Seconds to jump on rewind/forward |
| `loop` | `UseTimelinePlayerLoop` | `--` | Loop configuration |

### Returned State (`TimelinePlayerState`)

| Member | Type | Description |
|---|---|---|
| `isPlaying` | `boolean` | Whether the timeline is playing |
| `currentTime` | `number` | Current playback position (seconds) |
| `playRate` | `number` | Current playback rate multiplier |
| `play()` | `() => void` | Start playback |
| `pause()` | `() => void` | Pause playback |
| `stop()` | `() => void` | Stop and reset to time 0 |
| `toStart()` | `() => void` | Jump cursor to time 0 |
| `rewind()` | `() => void` | Jump back by `seekStep` seconds |
| `forward()` | `() => void` | Jump forward by `seekStep` seconds |
| `setTime(time)` | `(time: number) => void` | Jump to a specific time |
| `setPlayRate(rate)` | `(rate: number) => void` | Change playback speed |

## Building a Custom Player UI

You can use `useTimelinePlayer` independently without `TransportBar` to wire up your own controls:

```tsx
import { useTimelinePlayer, formatTime } from '@keplar-404/react-timeline-editor';

const player = useTimelinePlayer(timelineRef);

<div className="my-controls">
  <button onClick={player.toStart}>⏮</button>
  <button onClick={player.rewind}>⏪</button>
  <button onClick={player.isPlaying ? player.pause : player.play}>
    {player.isPlaying ? '⏸' : '▶'}
  </button>
  <button onClick={player.forward}>⏩</button>
  <button onClick={player.stop}>⏹</button>
  <span>{formatTime(player.currentTime)}</span>
</div>
```
