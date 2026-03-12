# Transport Bar

The `TransportBar` is a pre-built playback control UI that provides a professional interface for controlling your timeline.

It includes:

- **Transport controls**: Return to start, Rewind, Play/Pause, Forward, and Stop.
- **Time display**: Formatted time readout.
- **Playback rate**: Speed selector buttons (e.g. 0.25x, 0.5x, 1x, 2x, 4x).
- **Loop controls**: Toggle and input fields for refining a loop region.

## Basic Usage

To use the `TransportBar`, pair it with the `useTimelinePlayer` hook and a `ref` of your `<Timeline>` component.

```tsx
import React, { useState, useRef } from 'react';
import { Timeline, TimelineState, TransportBar, useTimelinePlayer } from '@keplar-404/react-timeline-editor';

export const EditorWithTransport = () => {
  const timelineRef = useRef<TimelineState>(null);
  const [data, setData] = useState([]);

  // 1. Initialize the player hook
  const player = useTimelinePlayer(timelineRef);

  return (
    <div className="editor-container">
      {/* 2. Render the bar and pass the player object */}
      <TransportBar player={player} />

      <Timeline ref={timelineRef} editorData={data} effects={{}} onChange={setData} />

      <style>{`
        .editor-container {
          background: #1a1a1a;
          padding: 20px;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};
```

## Advanced: Loop Controls

You can integrate a loop region by providing the `loop` configuration to the `TransportBar`.

```tsx
export const EditorWithLoopTransport = () => {
  const timelineRef = useRef<TimelineState>(null);
  const [loopOn, setLoopOn] = useState(false);
  const [loopStart, setLoopStart] = useState(1);
  const [loopEnd, setLoopEnd] = useState(5);

  const player = useTimelinePlayer(timelineRef, {
    loop: { enabled: loopOn, start: loopStart, end: loopEnd },
  });

  return (
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
  );
};
```
