# Transport Bar & Player API

API reference for `TransportBar`, `useTimelinePlayer`, and `formatTime` from `@keplar-404/react-timeline-editor`.

---

## `useTimelinePlayer` Hook

Manages playback state and controls for a `<Timeline>` component. Attaches engine event listeners on mount.

```typescript
function useTimelinePlayer(
  ref: React.RefObject<TimelineState>,
  options?: UseTimelinePlayerOptions,
): TimelinePlayerState
```

### `UseTimelinePlayerOptions`

| Option | Type | Default | Description |
|---|---|---|---|
| `seekStep` | `number` | `5` | Seconds to jump when calling `rewind()` or `forward()` |
| `loop` | `UseTimelinePlayerLoop` | `--` | Optional loop configuration |

### `UseTimelinePlayerLoop`

| Property | Type | Description |
|---|---|---|
| `enabled` | `boolean` | Whether the loop is active |
| `start` | `number` | Loop region start time in seconds |
| `end` | `number` | Loop region end time in seconds |

### `TimelinePlayerState` (Returned Value)

| Member | Type | Description |
|---|---|---|
| `isPlaying` | `boolean` | Whether the timeline is currently playing |
| `currentTime` | `number` | Current playback position in seconds |
| `playRate` | `number` | Current playback rate multiplier |
| `play()` | `() => void` | Start playback from the current position |
| `pause()` | `() => void` | Pause playback |
| `stop()` | `() => void` | Stop and reset cursor to time `0` |
| `toStart()` | `() => void` | Jump cursor to time `0` (pauses if playing) |
| `rewind()` | `() => void` | Jump back by `seekStep` seconds |
| `forward()` | `() => void` | Jump forward by `seekStep` seconds |
| `setTime(time)` | `(time: number) => void` | Jump to a specific time |
| `setPlayRate(rate)` | `(rate: number) => void` | Change playback speed |

---

## `<TransportBar />` Component

A pre-built professional playback controls UI that consumes a `TimelinePlayerState` object.

### Props

| Prop | Type | Description |
|---|---|---|
| `player` | `TimelinePlayerState` | **(Required)** — provided by `useTimelinePlayer` |
| `loop` | `TransportBarLoopProps` | Optional — render loop controls |

### `TransportBarLoopProps`

| Property | Type | Description |
|---|---|---|
| `enabled` | `boolean` | Whether loop is active |
| `start` | `number` | Loop start time |
| `end` | `number` | Loop end time |
| `onToggle` | `() => void` | Called when user toggles loop on/off |
| `onStartChange` | `(time: number) => void` | Called when user changes loop start |
| `onEndChange` | `(time: number) => void` | Called when user changes loop end |

### Basic Usage

```tsx
import React, { useRef } from 'react';
import { Timeline, TimelineState, TransportBar, useTimelinePlayer } from '@keplar-404/react-timeline-editor';

export const App = () => {
  const timelineRef = useRef<TimelineState>(null);
  const player = useTimelinePlayer(timelineRef);

  return (
    <div>
      <TransportBar player={player} />
      <Timeline ref={timelineRef} editorData={[]} effects={{}} />
    </div>
  );
};
```

---

## `formatTime` Utility

Formats a time value in seconds to a `M:SS.ms` display string.

```typescript
function formatTime(seconds: number): string
```

**Examples:**
```typescript
formatTime(0);      // '0:00.00'
formatTime(75.4);   // '1:15.40'
formatTime(3661.1); // '61:01.10'
```
