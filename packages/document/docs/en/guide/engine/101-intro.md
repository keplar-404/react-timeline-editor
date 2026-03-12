---
title: Engine Introduction
---

# Timeline Engine Introduction

## What is the Runner?

The `@keplar-404/timeline-engine` package provides a **runner** (playback engine) that is fully decoupled from the React editor.

You can use it to drive any custom output — audio playback, animation, video, DOM effects — by defining the execution logic in each `TimelineEffect.source`.

**Key capabilities:**
- 🛠 Set time, play rate, play/pause/stop
- ⚙️ Can be used completely independently of the React editor
- 📡 Event-based — subscribe to `play`, `paused`, `setTimeByTick`, etc. via the `Emitter`

## Effect Source Lifecycle

When the engine runs, it calls lifecycle methods on each effect's `source` object:

| Method | When it fires | Typical use |
|---|---|---|
| `start` | Engine begins playing while already inside the action's range | Resume audio from offset |
| `enter` | Playhead crosses into the action from outside | Start audio / show animation |
| `update` | Every tick while inside the action range | Advance animation frame |
| `leave` | Playhead crosses out of the action | Stop audio, hide animation |
| `stop` | Engine pauses while inside the action range | Pause audio |

## Running During Editing

The `<Timeline />` component has a built-in engine and exposes a `TimelineState` ref handle for control. You build your own player UI using the `listener` events.

```tsx
import { Timeline, TimelineState } from '@keplar-404/react-timeline-editor';
import React, { useRef, useEffect, useState } from 'react';

const TimelineEditor = () => {
  const timelineState = useRef<TimelineState>(null);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const engine = timelineState.current;
    if (!engine) return;

    engine.listener.on('play', () => setIsPlaying(true));
    engine.listener.on('paused', () => setIsPlaying(false));
    engine.listener.on('setTimeByTick', ({ time }) => setTime(time));

    return () => engine.listener.offAll();
  }, []);

  return (
    <div>
      <div className="player-bar">
        <button onClick={() => isPlaying ? timelineState.current?.pause() : timelineState.current?.play({ autoEnd: true })}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <span>{time.toFixed(2)}s</span>
      </div>

      <Timeline
        ref={timelineState}
        editorData={[]}
        effects={{}}
        autoScroll={true}
      />
    </div>
  );
};
```

## Using the Engine Independently

You can use `TimelineEngine` in complete isolation — without any React:

```typescript
import { TimelineEngine, TimelineEffect, TimelineRow } from '@keplar-404/timeline-engine';

const engine = new TimelineEngine();

// Define effects
const effects: Record<string, TimelineEffect> = {
  myEffect: {
    id: 'myEffect',
    name: 'My Effect',
    source: {
      enter: ({ action, time }) => {
        console.log(`Action ${action.id} entered at ${time}s`);
      },
      update: ({ action, time }) => {
        // Called every frame while inside the action range
      },
      leave: ({ action }) => {
        console.log(`Action ${action.id} left`);
      },
    },
  },
};

// Define data
const data: TimelineRow[] = [
  {
    id: 'row-1',
    actions: [{ id: 'action-1', start: 0, end: 5, effectId: 'myEffect' }],
  },
];

engine.effects = effects;
engine.data = data;

// Listen to events
engine.on('setTimeByTick', ({ time }) => {
  document.getElementById('time-display')!.textContent = `${time.toFixed(2)}s`;
});

// Start playing
engine.play({ autoEnd: true });
```

## Full Example: Audio + Lottie Animations

For a complete production example integrating `howler.js` audio and `lottie-web` animations with the engine, see the [Engine Runner API](./102-api) page.
