# Runner API

Complete API reference for the standalone `TimelineEngine` class from `@keplar-404/timeline-engine`.

```typescript
import { TimelineEngine } from '@keplar-404/timeline-engine';
const engine = new TimelineEngine();
```

---

## Properties

### `isPlaying`

Whether the engine is currently playing.

```typescript
isPlaying: boolean
```

---

### `isPaused`

Whether the engine is currently paused (stopped).

```typescript
isPaused: boolean
```

---

### `effects` *(setter)*

Set the running effects map. Assigning a new value updates the effects used during playback.

```typescript
set effects(effects: Record<string, TimelineEffect>)
```

---

### `data` *(setter)*

Set the running row/action data. Assigning a new value updates the data used during playback.

```typescript
set data(data: TimelineRow[])
```

---

## Methods

### `setPlayRate`

Set the playback speed multiplier.

```typescript
setPlayRate(rate: number): void
```

---

### `getPlayRate`

Get the current playback rate.

```typescript
getPlayRate(): number
```

---

### `setTime`

Manually seek to a specific time position.

```typescript
setTime(time: number): void
```

---

### `getTime`

Get the current playback time position.

```typescript
getTime(): number
```

---

### `reRender`

Re-trigger the `update` callbacks on all active actions at the current time without advancing playback. Useful for refreshing the view after data changes.

```typescript
reRender(): void
```

---

### `play`

Start playing from the current time position (set via `setTime`). Returns `true` if playback started successfully.

```typescript
play(param?: {
  toTime?:  number;   // Stop at this time (optional)
  autoEnd?: boolean;  // Automatically stop when all actions finish (optional)
}): boolean
```

**Example:**
```typescript
const engine = new TimelineEngine();
engine.play({ autoEnd: true });
```

---

### `pause`

Pause playback.

```typescript
pause(): void
```

---

## Events (Listener)

Subscribe to engine events via `engine.listener.on(event, handler)` or the shorthand `engine.on(event, handler)`.

```typescript
import { TimelineEngine } from '@keplar-404/timeline-engine';
const engine = new TimelineEngine();
```

---

### `setTimeByTick`

Fired every animation frame tick during playback. Use this to update UI time displays.

```typescript
engine.listener.on('setTimeByTick', ({ time, engine }) => {
  console.log('Tick time:', time);
});
```

---

### `beforeSetTime`

Fired **before** a manual `setTime` call. Return `false` from the handler to **prevent** the time from being set.

```typescript
engine.listener.on('beforeSetTime', ({ time, engine }) => {
  if (time < 0) return false; // block negative seek
});
```

---

### `afterSetTime`

Fired **after** a manual `setTime` call completes.

```typescript
engine.listener.on('afterSetTime', ({ time, engine }) => {
  console.log('Time set to:', time);
});
```

---

### `beforeSetPlayRate`

Fired **before** `setPlayRate` is called. Return `false` to **prevent** the rate from changing.

```typescript
engine.listener.on('beforeSetPlayRate', ({ rate, engine }) => {
  if (rate > 2) return false; // cap at 2x
});
```

---

### `afterSetPlayRate`

Fired **after** `setPlayRate` completes.

```typescript
engine.listener.on('afterSetPlayRate', ({ rate, engine }) => {
  console.log('Rate changed to:', rate);
});
```

---

### `play`

Fired when playback starts.

```typescript
engine.listener.on('play', ({ engine }) => {
  console.log('Playback started');
});
```

---

### `paused`

Fired when playback is paused.

```typescript
engine.listener.on('paused', ({ engine }) => {
  console.log('Playback paused');
});
```

---

### `ended`

Fired when playback finishes (reaches `toTime` or all actions complete when `autoEnd: true`).

```typescript
engine.listener.on('ended', ({ engine }) => {
  console.log('Playback ended');
});
```

---

## Events at a Glance

| Event | When it fires | Can return `false` to cancel? |
|---|---|---|
| `setTimeByTick` | Every tick frame during playback | No |
| `beforeSetTime` | Before a manual `setTime` | ✅ Yes |
| `afterSetTime` | After a manual `setTime` | No |
| `beforeSetPlayRate` | Before `setPlayRate` | ✅ Yes |
| `afterSetPlayRate` | After `setPlayRate` | No |
| `play` | When playback starts | No |
| `paused` | When playback pauses | No |
| `ended` | When playback finishes | No |
