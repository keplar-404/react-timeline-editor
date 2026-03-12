# Engine Runtime APIs

The `TimelineEngine` maintains its own internal event listener schedule, independent of React renders.

## Instantiation

```ts
import { TimelineEngine } from '@keplar-404/timeline-engine';

const engine = new TimelineEngine();
```

## Basic Methods

### `setPlayRate(rate: number): void`

Sets the playback speed multiplier.

### `getPlayRate(): number`

Gets the current playback speed multiplier.

### `setTime(time: number): void`

Instantly seeks the engine to a specific time (in seconds). Triggers listeners if the time enters/leaves an action's range.

### `getTime(): number`

Gets the engine's current playback time.

### `play(param: { toTime?: number; autoEnd?: boolean }): boolean`

Start playing from current time. Returns whether playing is successful.

- `toTime` _(optional)_: Playback end time.
- `autoEnd` _(optional)_: Whether to automatically pause after playing all actions.

### `pause(): void`

Pauses playback.

---

## Event Listeners

You can hook into internal engine events to synchronize your external application (e.g. updating a React state or a Canvas overlay).

```ts
import { TimelineEngine } from '@keplar-404/timeline-engine';

const engine = new TimelineEngine();

// Runs every single requestAnimationFrame tick during playback
engine.on('setTimeByTick', ({ time, engine }) => {
  console.log('Tick time: ', time);
});

engine.on('play', () => {
  console.log('Playback started');
});

engine.on('paused', () => {
  console.log('Playback paused');
});

engine.on('ended', () => {
  console.log('Playback reached the end');
});

// Intercept manual time setting
engine.on('beforeSetTime', ({ time }) => {
  if (time < 0) return false; // prevent seeking before 0
});
```
