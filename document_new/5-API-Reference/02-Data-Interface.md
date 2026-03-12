# Data Interface Reference

Complete reference for all data structures used by `@keplar-404/react-timeline-editor`.

---

## `TimelineRow`

**Editor Data: Edit Row Data Structure**

| Property | Description | Type | Default |
|---|---|---|---|
| `id` | Action row ID | `string` | **(Required)** |
| `actions` | Action list of the row | `TimelineAction[]` | **(Required)** |
| `rowHeight` | Custom row height (determined by `rowHeight` in props by default) | `number` | `--` |
| `selected` | Whether the row is selected | `boolean` | `false` |
| `classNames` | Extended class names for the row | `string[]` | `--` |

```typescript
interface TimelineRow {
  id: string;
  actions: TimelineAction[];
  rowHeight?: number;
  selected?: boolean;
  classNames?: string[];
}
```

---

## `TimelineAction`

**Editor Data: Action Data Structure**

| Property | Description | Type | Default |
|---|---|---|---|
| `id` | Action ID | `string` | **(Required)** |
| `start` | Action start time | `number` | **(Required)** |
| `end` | Action end time | `number` | **(Required)** |
| `effectId` | Effect ID index corresponding to the action | `string` | **(Required)** |
| `selected` | Whether the action is selected | `boolean` | `false` |
| `flexible` | Whether the action can be resized | `boolean` | `true` |
| `movable` | Whether the action can be moved | `boolean` | `true` |
| `disable` | Disable action running | `boolean` | `false` |
| `minStart` | Minimum start time limit for the action | `number` | `0` |
| `maxEnd` | Maximum end time limit for the action | `number` | `Number.MAX_VALUE` |

```typescript
interface TimelineAction {
  id: string;
  start: number;
  end: number;
  effectId: string;
  selected?: boolean;
  flexible?: boolean;
  movable?: boolean;
  disable?: boolean;
  minStart?: number;
  maxEnd?: number;
}
```

---

## `TimelineEffect`

**Editor Running Effect Data Structure**

| Property | Description | Type | Default |
|---|---|---|---|
| `id` | Effect ID | `string` | **(Required)** |
| `name` | Effect name | `string` | `--` |
| `source` | Effect running code | `TimeLineEffectSource` | `--` |

```typescript
interface TimelineEffect {
  id: string;
  name?: string;
  source?: TimeLineEffectSource;
}
```

---

## `TimeLineEffectSource`

**Editor Running Effect Source Data Structure**

Each callback is triggered under specific conditions during playback:

| Callback | Trigger Condition |
|---|---|
| `start` | Triggered when the runner **starts playing**, if the current time is within the action's time range |
| `enter` | Triggered when time **enters** the action time range from outside it |
| `update` | Triggered **every frame** while playing within the action range (also triggered during `reRender`) |
| `leave` | Triggered when time **leaves** the action time range |
| `stop` | Triggered when the runner **pauses**, if the current time is within the action's time range |

### Properties

| Property | Description | Type | Default |
|---|---|---|---|
| `start` | Callback when starting to play within the current action time area | `(param: EffectSourceParam) => void` | `--` |
| `enter` | Callback executed when time enters the action | `(param: EffectSourceParam) => void` | `--` |
| `update` | Callback on every action update tick | `(param: EffectSourceParam) => void` | `--` |
| `leave` | Callback executed when time leaves the action | `(param: EffectSourceParam) => void` | `--` |
| `stop` | Callback when stopping play within the current action time area | `(param: EffectSourceParam) => void` | `--` |

```typescript
interface TimeLineEffectSource {
  start?:  (param: EffectSourceParam) => void;
  enter?:  (param: EffectSourceParam) => void;
  update?: (param: EffectSourceParam) => void;
  leave?:  (param: EffectSourceParam) => void;
  stop?:   (param: EffectSourceParam) => void;
}
```

---

## `EffectSourceParam`

**Editor Running Effect Source Parameters**

Passed as the single argument to every `TimeLineEffectSource` callback.

| Property | Description | Type |
|---|---|---|
| `time` | Current playback time | `number` |
| `isPlaying` | Whether the timeline is currently playing | `boolean` |
| `action` | The action being executed | `TimelineAction` |
| `effect` | The effect associated with the action | `TimelineEffect` |
| `engine` | The timeline engine instance | `TimelineEngine` |

```typescript
interface EffectSourceParam {
  time: number;
  isPlaying: boolean;
  action: TimelineAction;
  effect: TimelineEffect;
  engine: TimelineEngine;
}
```

---

## `TimelineState`

**Timeline Component Ref Handle**

Returned when you attach a `ref` to `<Timeline />`. Gives you full programmatic control over the timeline.

| Property | Description | Type |
|---|---|---|
| `target` | The DOM node the timeline is mounted on | `HTMLElement` |
| `listener` | The engine event emitter — use `.on(...)` to subscribe to engine events | `Emitter` |
| `isPlaying` | Whether the timeline is currently playing | `boolean` |
| `isPaused` | Whether the timeline is currently paused | `boolean` |
| `setTime` | Set the current playback cursor time | `(time: number) => void` |
| `getTime` | Get the current playback cursor time | `() => number` |
| `setPlayRate` | Set the playback speed multiplier | `(rate: number) => void` |
| `getPlayRate` | Get the current playback rate | `() => number` |
| `reRender` | Re-render at the current time (without playing) | `() => void` |
| `play` | Start playback from the current cursor position | `(param: { toTime?: number; autoEnd?: boolean; }) => boolean` |
| `pause` | Pause playback | `() => void` |
| `setScrollLeft` | Programmatically set the horizontal scroll offset | `(val: number) => void` |
| `setScrollTop` | Programmatically set the vertical scroll offset | `(val: number) => void` |

```typescript
interface TimelineState {
  target:       HTMLElement;
  listener:     Emitter<EventTypes>;
  isPlaying:    boolean;
  isPaused:     boolean;
  setTime:      (time: number) => void;
  getTime:      () => number;
  setPlayRate:  (rate: number) => void;
  getPlayRate:  () => number;
  reRender:     () => void;
  play:         (param: { toTime?: number; autoEnd?: boolean; }) => boolean;
  pause:        () => void;
  setScrollLeft:(val: number) => void;
  setScrollTop: (val: number) => void;
}
```

### Usage Example

```tsx
import { useRef } from 'react';
import { Timeline, TimelineState } from '@keplar-404/react-timeline-editor';

const App = () => {
  const timelineRef = useRef<TimelineState>(null);

  const handlePlay = () => {
    timelineRef.current?.play({ autoEnd: true });
  };

  const handlePause = () => {
    timelineRef.current?.pause();
  };

  const handleSeek = (time: number) => {
    timelineRef.current?.setTime(time);
  };

  return (
    <Timeline
      ref={timelineRef}
      editorData={rows}
      effects={effects}
    />
  );
};
```
