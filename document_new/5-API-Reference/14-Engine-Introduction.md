# Engine Introduction

## What is the Runner?

The `@keplar-404/timeline-engine` package provides a **runner** (playback engine) that is fully decoupled from the React editor. You can use it to drive any custom output — audio playback, animation, video, DOM effects — by defining the execution logic in each `TimelineEffect.source`.

**Key capabilities:**
- 🛠 Set time, play rate, play/pause/stop
- ⚙️ Can be used completely independently of the React editor
- 📡 Event-based — subscribe to `play`, `paused`, `setTimeByTick`, etc. via the `Emitter`

---

## Running During Editing

The `<Timeline />` component has a built-in engine and exposes a `TimelineState` ref handle for convenient control. No default player UI is provided — you build your own using the `listener` events.

This example shows a full setup with:
- **Audio playback** via `howler.js`
- **Lottie animation** via `lottie-web`
- A **custom player bar** with play/pause, time display, and playback rate selector

---

## File Structure

```
├── index.tsx          # Main timeline component
├── player.tsx         # Custom playback controls bar
├── custom.tsx         # Custom action block renderers
├── mock.ts            # Types, effect definitions, and mock data
├── audioControl.ts    # Audio playback controller (Howler)
├── lottieControl.ts   # Lottie animation controller
└── index.css          # Styles
```

---

## Source Files

### `index.tsx` — Main Component

```tsx
import { Timeline, TimelineState } from '@keplar-404/react-timeline-editor';
import { cloneDeep } from 'lodash';
import React, { useRef, useState } from 'react';
import { CustomRender0, CustomRender1 } from './custom';
import './index.css';
import {
  CustomTimelineAction,
  CusTomTimelineRow,
  mockData,
  mockEffect,
  scale,
  scaleWidth,
  startLeft,
} from './mock';
import TimelinePlayer from './player';

const defaultEditorData = cloneDeep(mockData);

const TimelineEditor = () => {
  const [data, setData] = useState(defaultEditorData);
  const timelineState = useRef<TimelineState>(null);
  const playerPanel = useRef<HTMLDivElement>(null);
  const autoScrollWhenPlay = useRef<boolean>(true);

  return (
    <div className="timeline-editor-engine">
      <div className="player-config">
        <label className="toggle">
          <input
            type="checkbox"
            defaultChecked={autoScrollWhenPlay.current}
            onChange={(e) => (autoScrollWhenPlay.current = e.target.checked)}
          />
          <span className="toggle-slider" />
          <span className="toggle-label">Enable Runtime Auto Scroll</span>
        </label>
      </div>

      {/* Lottie animation render target */}
      <div className="player-panel" id="player-ground-1" ref={playerPanel} />

      <TimelinePlayer
        timelineState={timelineState}
        autoScrollWhenPlay={autoScrollWhenPlay}
      />

      <Timeline
        scale={scale}
        scaleWidth={scaleWidth}
        startLeft={startLeft}
        autoScroll={true}
        ref={timelineState}
        editorData={data}
        effects={mockEffect}
        onChange={(data) => setData(data as CusTomTimelineRow[])}
        getActionRender={(action, row) => {
          if (action.effectId === 'effect0') {
            return (
              <CustomRender0
                action={action as CustomTimelineAction}
                row={row as CusTomTimelineRow}
              />
            );
          } else if (action.effectId === 'effect1') {
            return (
              <CustomRender1
                action={action as CustomTimelineAction}
                row={row as CusTomTimelineRow}
              />
            );
          }
        }}
      />
    </div>
  );
};

export default TimelineEditor;
```

---

### `player.tsx` — Custom Playback Controls

```tsx
import { TimelineState } from '@keplar-404/react-timeline-editor';
import React, { FC, useEffect, useState } from 'react';
import lottieControl from './lottieControl';
import { scale, scaleWidth, startLeft } from './mock';

export const Rates = [0.2, 0.5, 1.0, 1.5, 2.0];

/** Format seconds as MM:SS.cs */
const timeRender = (time: number) => {
  const cs     = String(Math.floor((time % 1) * 100)).padStart(2, '0');
  const min    = String(Math.floor(time / 60)).padStart(2, '0');
  const second = String(Math.floor(time % 60)).padStart(2, '0');
  return `${min}:${second}.${cs}`;
};

const TimelinePlayer: FC<{
  timelineState: React.MutableRefObject<TimelineState>;
  autoScrollWhenPlay: React.MutableRefObject<boolean>;
}> = ({ timelineState, autoScrollWhenPlay }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [rate, setRate] = useState(1);

  useEffect(() => {
    if (!timelineState.current) return;
    const engine = timelineState.current;

    engine.listener.on('play',        ()           => setIsPlaying(true));
    engine.listener.on('paused',      ()           => setIsPlaying(false));
    engine.listener.on('afterSetTime',({ time })   => setTime(time));
    engine.listener.on('setTimeByTick', ({ time }) => {
      setTime(time);
      if (autoScrollWhenPlay.current) {
        const left = time * (scaleWidth / scale) + startLeft - 500;
        timelineState.current?.setScrollLeft(left);
      }
    });

    return () => {
      engine.pause();
      engine.listener.offAll();
      lottieControl.destroy();
    };
  }, []);

  const handlePlayOrPause = () => {
    if (!timelineState.current) return;
    if (timelineState.current.isPlaying) {
      timelineState.current.pause();
    } else {
      timelineState.current.play({ autoEnd: true });
    }
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const r = parseFloat(e.target.value);
    setRate(r);
    timelineState.current?.setPlayRate(r);
  };

  return (
    <div className="timeline-player">
      <button className="play-control" onClick={handlePlayOrPause}>
        {isPlaying ? '⏸' : '▶'}
      </button>
      <div className="time">{timeRender(time)}</div>
      <div className="rate-control">
        <select value={rate} onChange={handleRateChange}>
          {Rates.map((r) => (
            <option key={r} value={r}>{r.toFixed(1)}x</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TimelinePlayer;
```

---

### `custom.tsx` — Action Block Renderers

```tsx
import React, { FC } from 'react';
import { CustomTimelineAction, CusTomTimelineRow } from './mock';

export const CustomRender0: FC<{
  action: CustomTimelineAction;
  row: CusTomTimelineRow;
}> = ({ action }) => (
  <div className="effect0">
    <div className="effect0-text">{`Play Audio: ${action.data.name}`}</div>
  </div>
);

export const CustomRender1: FC<{
  action: CustomTimelineAction;
  row: CusTomTimelineRow;
}> = ({ action }) => (
  <div className="effect1">
    <div className="effect1-text">{`Play Animation: ${action.data.name}`}</div>
  </div>
);
```

---

### `mock.ts` — Types, Effects & Data

```typescript
import { TimelineAction, TimelineEffect, TimelineRow } from '@keplar-404/timeline-engine';
import audioControl from './audioControl';
import lottieControl from './lottieControl';

export const scaleWidth = 160;
export const scale      = 5;
export const startLeft  = 20;

// ── Extended types ─────────────────────────────────────────────────
export interface CustomTimelineAction extends TimelineAction {
  data: { src: string; name: string };
}

export interface CusTomTimelineRow extends TimelineRow {
  actions: CustomTimelineAction[];
}

// ── Effects ────────────────────────────────────────────────────────
export const mockEffect: Record<string, TimelineEffect> = {
  effect0: {
    id: 'effect0',
    name: 'Play Audio',
    source: {
      start: ({ action, engine, isPlaying, time }) => {
        if (isPlaying) {
          const src = (action as CustomTimelineAction).data.src;
          audioControl.start({ id: src, src, startTime: action.start, engine, time });
        }
      },
      enter: ({ action, engine, isPlaying, time }) => {
        if (isPlaying) {
          const src = (action as CustomTimelineAction).data.src;
          audioControl.start({ id: src, src, startTime: action.start, engine, time });
        }
      },
      leave: ({ action, engine }) => {
        const src = (action as CustomTimelineAction).data.src;
        audioControl.stop({ id: src, engine });
      },
      stop: ({ action, engine }) => {
        const src = (action as CustomTimelineAction).data.src;
        audioControl.stop({ id: src, engine });
      },
    },
  },
  effect1: {
    id: 'effect1',
    name: 'Play Animation',
    source: {
      enter: ({ action, time }) => {
        const src = (action as CustomTimelineAction).data.src;
        lottieControl.enter({ id: src, src, startTime: action.start, endTime: action.end, time });
      },
      update: ({ action, time }) => {
        const src = (action as CustomTimelineAction).data.src;
        lottieControl.update({ id: src, src, startTime: action.start, endTime: action.end, time });
      },
      leave: ({ action, time }) => {
        const src = (action as CustomTimelineAction).data.src;
        lottieControl.leave({ id: src, startTime: action.start, endTime: action.end, time });
      },
    },
  },
};

// ── Mock data ──────────────────────────────────────────────────────
export const mockData: CusTomTimelineRow[] = [
  {
    id: '0',
    actions: [{
      id: 'action0', start: 9.5, end: 16, effectId: 'effect1',
      data: { src: '/lottie/lottie1/data.json', name: 'Like' },
    }],
  },
  {
    id: '1',
    actions: [{
      id: 'action1', start: 5, end: 9.5, effectId: 'effect1',
      data: { src: '/lottie/lottie2/data.json', name: 'Work' },
    }],
  },
  {
    id: '2',
    actions: [{
      id: 'action2', start: 0, end: 5, effectId: 'effect1',
      data: { src: '/lottie/lottie3/data.json', name: 'Walk' },
    }],
  },
  {
    id: '3',
    actions: [{
      id: 'action3', start: 0, end: 20, effectId: 'effect0',
      data: { src: '/audio/bg.mp3', name: 'Background Music' },
    }],
  },
];
```

---

### `audioControl.ts` — Audio Playback via Howler

```typescript
import { Howl } from 'howler';
import { TimelineEngine } from '@keplar-404/timeline-engine';

class AudioControl {
  cacheMap:   Record<string, Howl> = {};
  listenerMap: Record<string, {
    time?: (data: { time: number }) => void;
    rate?: (data: { rate: number }) => void;
  }> = {};

  start(data: {
    id: string;
    engine: TimelineEngine;
    src: string;
    startTime: number;
    time: number;
  }) {
    const { id, src, startTime, time, engine } = data;
    let item: Howl;

    if (this.cacheMap[id]) {
      item = this.cacheMap[id];
      item.rate(engine.getPlayRate());
      item.seek((time - startTime) % item.duration());
      item.play();
    } else {
      item = new Howl({ src, loop: true, autoplay: true });
      this.cacheMap[id] = item;
      item.on('load', () => {
        item.rate(engine.getPlayRate());
        item.seek((time - startTime) % item.duration());
      });
    }

    const timeListener = ({ time }: { time: number }) => item.seek(time);
    const rateListener = ({ rate }: { rate: number }) => item.rate(rate);

    if (!this.listenerMap[id]) this.listenerMap[id] = {};
    engine.on('afterSetTime',     timeListener);
    engine.on('afterSetPlayRate', rateListener);
    this.listenerMap[id].time = timeListener;
    this.listenerMap[id].rate = rateListener;
  }

  stop(data: { id: string; engine: TimelineEngine }) {
    const { id, engine } = data;
    if (!this.cacheMap[id]) return;
    this.cacheMap[id].stop();
    if (this.listenerMap[id]) {
      if (this.listenerMap[id].time)
        engine.off('afterSetTime',     this.listenerMap[id].time);
      if (this.listenerMap[id].rate)
        engine.off('afterSetPlayRate', this.listenerMap[id].rate);
      delete this.listenerMap[id];
    }
  }
}

export default new AudioControl();
```

---

### `lottieControl.ts` — Lottie Animation Controller

```typescript
import lottie, { AnimationItem } from 'lottie-web';

class LottieControl {
  cacheMap: Record<string, AnimationItem> = {};

  private goToAndStop(item: AnimationItem, time: number) {
    const duration = item.getDuration() * 1000;
    if (!duration) return;
    let ms = (time * 1000) % duration;
    item.goToAndStop(ms);
  }

  enter(data: { id: string; src: string; startTime: number; endTime: number; time: number }) {
    const { id, src, startTime, time } = data;
    if (this.cacheMap[id]) {
      this.cacheMap[id].show();
      this.goToAndStop(this.cacheMap[id], time - startTime);
      return;
    }
    const ground = document.getElementById('player-ground-1');
    const item = lottie.loadAnimation({
      name: id,
      container: ground,
      renderer: 'svg',
      loop: true,
      autoplay: false,
      path: src,
      rendererSettings: { className: 'lottie-ani' },
    });
    item.addEventListener('loaded_images', () => {
      this.goToAndStop(item, time - startTime);
    });
    this.cacheMap[id] = item;
  }

  update(data: { id: string; src: string; startTime: number; endTime: number; time: number }) {
    const { id, startTime, time } = data;
    const item = this.cacheMap[id];
    if (item) this.goToAndStop(item, time - startTime);
  }

  leave(data: { id: string; startTime: number; endTime: number; time: number }) {
    const { id, startTime, endTime, time } = data;
    const item = this.cacheMap[id];
    if (!item) return;
    if (time > endTime || time < startTime) {
      item.hide();
    } else {
      item.show();
      this.goToAndStop(item, time - startTime);
    }
  }

  destroy() {
    lottie.destroy();
    this.cacheMap = {};
  }
}

export default new LottieControl();
```

---

### `index.css` — Styles

```css
/* ── Toggle switch ────────────────────────────────────────────── */
.timeline-editor-engine .player-config {
  margin-bottom: 20px;
}

.timeline-editor-engine .toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.timeline-editor-engine .toggle input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.timeline-editor-engine .toggle-slider {
  position: relative;
  width: 36px;
  height: 20px;
  background: #d9d9d9;
  border-radius: 20px;
  flex-shrink: 0;
  transition: background 0.2s;
}

.timeline-editor-engine .toggle-slider::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.2s;
}

.timeline-editor-engine .toggle input:checked + .toggle-slider {
  background: #4096ff;
}

.timeline-editor-engine .toggle input:checked + .toggle-slider::after {
  transform: translateX(16px);
}

.timeline-editor-engine .toggle-label {
  font-size: 13px;
  user-select: none;
}

/* ── Lottie player panel ──────────────────────────────────────── */
.timeline-editor-engine .player-panel {
  width: 100%;
  max-width: 800px;
  height: 300px;
  position: relative;
}

.timeline-editor-engine .player-panel .lottie-ani {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}

/* ── Timeline ──────────────────────────────────────────────────── */
.timeline-editor-engine .timeline-editor {
  width: 100%;
  max-width: 800px;
  height: 300px;
}

.timeline-editor-engine .timeline-editor-action {
  height: 28px !important;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 4px;
}

/* Effect 0 — audio */
.timeline-editor-engine .timeline-editor-action-effect-effect0 {
  background-color: #cd9541;
  background-image: url('./soundWave.png');
  background-position: bottom;
  background-repeat: repeat-x;
  cursor: pointer;
}

/* Effect 1 — lottie animation */
.timeline-editor-engine .timeline-editor-action-effect-effect1 {
  background-color: #7846a7;
  background-position: bottom;
  background-repeat: repeat-x;
  cursor: pointer;
}

.timeline-editor-engine .timeline-editor-action-effect-effect0 .effect0,
.timeline-editor-engine .timeline-editor-action-effect-effect1 .effect1 {
  width: 100%;
  height: 100%;
  font-size: 10px;
  color: #fff;
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.timeline-editor-engine .timeline-editor-action-effect-effect0 .effect0-text,
.timeline-editor-engine .timeline-editor-action-effect-effect1 .effect1-text {
  margin-left: 4px;
  flex: 1 1 auto;
  text-align: center;
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-direction: column;
  justify-content: center;
}

.timeline-editor-engine .timeline-editor-action-left-stretch::after {
  border-left: 7px solid rgba(255, 255, 255, 0.4);
}

.timeline-editor-engine .timeline-editor-action-right-stretch::after {
  border-right: 7px solid rgba(255, 255, 255, 0.4);
}

/* ── Player bar ───────────────────────────────────────────────── */
.timeline-editor-engine .timeline-player {
  height: 32px;
  width: 100%;
  max-width: 800px;
  padding: 0 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  background-color: #3a3a3a;
  color: #ddd;
  box-sizing: border-box;
}

.timeline-editor-engine .timeline-player .play-control {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  background-color: #666;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: none;
  color: #fff;
  font-size: 13px;
  flex-shrink: 0;
}

.timeline-editor-engine .timeline-player .play-control:hover {
  background-color: #888;
}

.timeline-editor-engine .timeline-player .time {
  font-size: 12px;
  width: 76px;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}

.timeline-editor-engine .timeline-player .rate-control select {
  background: transparent;
  border: none;
  color: #ddd;
  font-size: 12px;
  cursor: pointer;
  outline: none;
  width: 70px;
}

.timeline-editor-engine .timeline-player .rate-control select option {
  background: #3a3a3a;
}
```

---

## How the Engine Callbacks Work

| Effect Source | When it fires | Used for |
|---|---|---|
| `start` | Engine begins playing while inside the action's time range | Resume audio from the correct offset |
| `enter` | Playhead crosses into the action from outside | Start audio / show lottie |
| `update` | Every tick while inside the action | Advance lottie frame |
| `leave` | Playhead crosses out of the action | Pause/stop audio, hide lottie |
| `stop` | Engine is paused while inside the action | Pause audio |

> **Tip:** `audioControl` and `lottieControl` are singleton classes — they cache running instances by source ID (`src`) so the same asset isn't loaded twice even if the engine scrubs back into the same action.
