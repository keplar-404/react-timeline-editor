---
title: Data Interface
---

# Data Interface

The React Timeline Editor interacts primarily with three core types from the engine: `TimelineRow`, `TimelineAction`, and `TimelineEffect`.

---

## TimelineRow

A track or row in the timeline.

```typescript
export interface TimelineRow {
  /** Row unique ID */
  id: string;
  /** List of actions contained in this row */
  actions: TimelineAction[];
  /** Custom class for styling the row */
  classNames?: string[];
  /** Whether the row is selected */
  selected?: boolean;
  /** Flexible height mode */
  flexy?: boolean;
}
```

---

## TimelineAction

A specific block of time/action within a Row.

```typescript
export interface TimelineAction {
  /** Action unique ID */
  id: string;
  /** Start time of the action (in seconds) */
  start: number;
  /** End time of the action (in seconds) */
  end: number;
  /** ID of the effect defining this action */
  effectId: string;
  /** Whether dragging is enabled */
  movable?: boolean;
  /** Whether resizing is enabled */
  flexible?: boolean;
  /** Custom style for the action block */
  style?: React.CSSProperties;
  /** Custom CSS class name */
  className?: string;
  /** Custom data attached to the action */
  data?: any;
}
```

---

## TimelineEffect

The definition of what an Action does or represents during playback.

```typescript
export interface TimelineEffect {
  /** Effect ID */
  id: string;
  /** Effect Name */
  name: string;
  /** Engine Effect source handler (for playback/callbacks) */
  source?: TimeLineEffectSource;
}
```

---

## TimeLineEffectSource

The effect source defines callbacks that fire at different moments during engine playback.

```typescript
export interface TimeLineEffectSource {
  /**
   * Triggered when the runner starts playing,
   * if the time is already within the current action's time range.
   */
  start?: (params: EffectSourceParam) => void;

  /**
   * Triggered when the playhead enters this action's time range from outside.
   */
  enter?: (params: EffectSourceParam) => void;

  /**
   * Triggered every frame while inside the action's time range (including reRender).
   */
  update?: (params: EffectSourceParam) => void;

  /**
   * Triggered when the playhead leaves this action's time range.
   */
  leave?: (params: EffectSourceParam) => void;

  /**
   * Triggered when the runner pauses, if within this action's time range.
   */
  stop?: (params: EffectSourceParam) => void;
}
```

### EffectSourceParam

```typescript
export interface EffectSourceParam {
  action: TimelineAction;
  row: TimelineRow;
  engine: ITimelineEngine;
  isPlaying: boolean;
  time: number;
}
```

### Effect Source Trigger Summary

| Source Method | When it fires | Typical Use |
|---|---|---|
| `start` | Engine begins playing while inside the action's time range | Resume audio from the correct offset |
| `enter` | Playhead crosses into the action from outside | Start audio / show lottie |
| `update` | Every tick while inside the action | Advance lottie frame |
| `leave` | Playhead crosses out of the action | Pause/stop audio, hide lottie |
| `stop` | Engine is paused while inside the action | Pause audio |

---

## TimelineState

The imperative handle returned by `ref` on the `<Timeline />` component.

```typescript
export interface TimelineState {
  /** DOM node */
  target: HTMLElement | null;
  /** Execution listener */
  listener: Emitter<EventTypes>;
  /** Whether it is playing */
  isPlaying: boolean;
  /** Whether it is paused */
  isPaused: boolean;
  /** Set current playback time */
  setTime: (time: number) => void;
  /** Get current playback time */
  getTime: () => number;
  /** Set playback rate */
  setPlayRate: (rate: number) => void;
  /** Get playback rate */
  getPlayRate: () => number;
  /** Re-render current time */
  reRender: () => void;
  /** Play */
  play: (param: {
    toTime?: number;
    autoEnd?: boolean;
    runActionIds?: string[];
  }) => boolean;
  /** Pause */
  pause: () => void;
  /** Set scroll left */
  setScrollLeft: (val: number) => void;
  /** Set scroll top */
  setScrollTop: (val: number) => void;
}
```
