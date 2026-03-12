<div align="center">

<img src="https://github.com/keplar-404/react-timeline-editor/blob/main/public/assets/timeline.gif?raw=true" alt="React Timeline Editor Demo" width="100%" />

<h1>React Timeline Editor</h1>

<p>
  <strong>A powerful, extensible React component library for building professional timeline animation and video editors.</strong>
</p>

<p>
  <a href="https://www.npmjs.com/package/@keplar-404/react-timeline-editor">
    <img src="https://img.shields.io/npm/v/@keplar-404/react-timeline-editor.svg?style=for-the-badge&logo=npm&color=CB3837" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/@keplar-404/react-timeline-editor">
    <img src="https://img.shields.io/npm/dm/@keplar-404/react-timeline-editor.svg?style=for-the-badge&logo=npm&color=CB3837" alt="npm downloads" />
  </a>
  <a href="https://www.npmjs.com/package/@keplar-404/timeline-engine">
    <img src="https://img.shields.io/npm/v/@keplar-404/timeline-engine.svg?style=for-the-badge&logo=npm&label=engine&color=3178C6" alt="engine version" />
  </a>
  <a href="https://github.com/keplar-404/react-timeline-editor/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/keplar-404/react-timeline-editor?style=for-the-badge&color=22c55e" alt="License: MIT" />
  </a>
  <a href="https://github.com/keplar-404/react-timeline-editor/actions/workflows/npm-publish.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/keplar-404/react-timeline-editor/npm-publish.yml?style=for-the-badge&logo=github-actions&label=publish" alt="Publish Status" />
  </a>
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-18%2B-61DAFB?style=for-the-badge&logo=react" alt="React 18+" />
</p>

<p>
  <a href="#-quick-start">Quick Start</a> ·
  <a href="#-features">Features</a> ·
  <a href="#-documentation">Docs</a> ·
  <a href="#-packages">Packages</a> ·
  <a href="./CHANGELOG.md">Changelog</a> ·
  <a href="#-contributing">Contributing</a>
</p>

> **Beta Release** — Core API is stable and used in production. Some advanced features are still being refined. Feedback and contributions are very welcome.

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎛 **Timeline Editor** | Drag, resize, and reorder action blocks across multiple tracks |
| 🔍 **Scalable Zoom** | Configurable scale width, split counts, and snap-to-grid |
| 🧲 **Smart Snapping** | Both CSS grid snapping and auxiliary drag-line snapping |
| ↕️ **Row Reordering** | Drag entire tracks up and down to reorder |
| 🔀 **Cross-Row Drag** | Move action blocks between rows with a live ghost preview |
| ✂️ **Cut & Split** | Built-in scissors tool to slice action blocks at the cursor |
| 🔁 **Loop Zone** | Draggable loop region overlay rendered on the timeline |
| 🎮 **Transport Bar** | Production-ready playback controls (play/pause/seek/rate) |
| ⚙️ **Standalone Engine** | `@keplar-404/timeline-engine` runs headlessly — no React required |
| 🎨 **Fully Customisable** | Custom block renderers, scale renderers, and CSS theming |
| 📦 **TypeScript First** | Complete type definitions for all props, hooks, and engine APIs |

---

## 📦 Packages

This monorepo publishes two independent packages:

| Package | Version | Description |
|---|---|---|
| [`@keplar-404/react-timeline-editor`](https://www.npmjs.com/package/@keplar-404/react-timeline-editor) | [![npm](https://img.shields.io/npm/v/@keplar-404/react-timeline-editor?style=flat-square)](https://www.npmjs.com/package/@keplar-404/react-timeline-editor) | React UI component with all visual editor features |
| [`@keplar-404/timeline-engine`](https://www.npmjs.com/package/@keplar-404/timeline-engine) | [![npm](https://img.shields.io/npm/v/@keplar-404/timeline-engine?style=flat-square)](https://www.npmjs.com/package/@keplar-404/timeline-engine) | Framework-agnostic playback engine (no React dependency) |

---

## 🚀 Quick Start

### Installation

```bash
# npm
npm install @keplar-404/react-timeline-editor @keplar-404/timeline-engine

# yarn
yarn add @keplar-404/react-timeline-editor @keplar-404/timeline-engine

# bun (recommended for speed)
bun add @keplar-404/react-timeline-editor @keplar-404/timeline-engine
```

### Import the CSS

```css
/* In your global stylesheet or entry file */
@import '@keplar-404/react-timeline-editor/dist/react-timeline-editor.css';
```

### Basic Usage

```tsx
import React, { useState } from 'react';
import { Timeline, TimelineRow, TimelineEffect } from '@keplar-404/react-timeline-editor';
import '@keplar-404/react-timeline-editor/dist/react-timeline-editor.css';

const effects: Record<string, TimelineEffect> = {
  'clip': { id: 'clip', name: 'Video Clip' },
  'audio': { id: 'audio', name: 'Audio Track' },
};

const initialData: TimelineRow[] = [
  {
    id: 'video-track',
    actions: [
      { id: 'clip-1', start: 0, end: 3, effectId: 'clip' },
      { id: 'clip-2', start: 4, end: 7, effectId: 'clip' },
    ],
  },
  {
    id: 'audio-track',
    actions: [
      { id: 'audio-1', start: 0, end: 7, effectId: 'audio' },
    ],
  },
];

export default function MyEditor() {
  const [data, setData] = useState<TimelineRow[]>(initialData);

  return (
    <Timeline
      editorData={data}
      effects={effects}
      onChange={(newData) => setData(newData)}
      autoScroll
      gridSnap
    />
  );
}
```

---

## 🎮 Playback Control with `useTimelinePlayer`

The built-in `useTimelinePlayer` hook wires up the engine to a `ref` and gives you a clean playback API:

```tsx
import React, { useRef } from 'react';
import { Timeline, TimelineState, useTimelinePlayer, formatTime } from '@keplar-404/react-timeline-editor';

export default function EditorWithPlayer() {
  const timelineRef = useRef<TimelineState>(null);
  const { play, pause, toggle, seek, state } = useTimelinePlayer(timelineRef, {
    loop: { enabled: true, start: 0, end: 10 },
  });

  return (
    <div>
      {/* Custom controls */}
      <div style={{ display: 'flex', gap: 8, padding: 8 }}>
        <button onClick={toggle}>{state.isPlaying ? '⏸ Pause' : '▶ Play'}</button>
        <button onClick={() => seek(0)}>⏮ Reset</button>
        <span>{formatTime(state.currentTime)} / {formatTime(state.duration)}</span>
      </div>

      <Timeline
        ref={timelineRef}
        editorData={[]}
        effects={{}}
        autoScroll
      />
    </div>
  );
}
```

Or use the pre-built `TransportBar` component directly:

```tsx
import { Timeline, TransportBar, TimelineState } from '@keplar-404/react-timeline-editor';
import { useRef } from 'react';

export default function EditorWithTransportBar() {
  const timelineRef = useRef<TimelineState>(null);

  return (
    <div>
      <TransportBar timelineRef={timelineRef} />
      <Timeline ref={timelineRef} editorData={[]} effects={{}} />
    </div>
  );
}
```

---

## ⚙️ Standalone Engine (No React)

`@keplar-404/timeline-engine` can drive any output — audio, animations, video — completely independently of React:

```typescript
import { TimelineEngine } from '@keplar-404/timeline-engine';

const engine = new TimelineEngine();

engine.effects = {
  highlight: {
    id: 'highlight',
    source: {
      enter: ({ action, time }) => console.log(`▶ ${action.id} at ${time}s`),
      update: ({ time }) => { /* update DOM / canvas every frame */ },
      leave: ({ action }) => console.log(`⏹ ${action.id} left`),
    },
  },
};

engine.data = [
  {
    id: 'track-1',
    actions: [{ id: 'a1', start: 0, end: 5, effectId: 'highlight' }],
  },
];

// Listen to events
engine.on('setTimeByTick', ({ time }) => {
  document.getElementById('clock')!.textContent = `${time.toFixed(2)}s`;
});

engine.play({ autoEnd: true });
```

**Effect lifecycle hooks:**

| Hook | When it fires |
|---|---|
| `start` | Engine starts playing while already inside the action range |
| `enter` | Playhead crosses into the action |
| `update` | Every animation frame while inside the action |
| `leave` | Playhead crosses out of the action |
| `stop` | Engine pauses while inside the action range |

---

## 📐 Key Props Reference

### `<Timeline />` — Core Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `editorData` | `TimelineRow[]` | required | The track/action data |
| `effects` | `Record<string, TimelineEffect>` | required | Effect definitions |
| `onChange` | `(data: TimelineRow[]) => void` | — | Called when data changes |
| `scale` | `number` | `1` | Seconds per scale mark |
| `scaleWidth` | `number` | `160` | Pixel width of each scale mark |
| `rowHeight` | `number` | `32` | Default row height in px |
| `autoScroll` | `boolean` | `false` | Auto-scroll during drag near edges |
| `gridSnap` | `boolean` | `false` | Snap actions to the grid |
| `dragLine` | `boolean` | `false` | Show auxiliary snapping lines |
| `disableDrag` | `boolean` | `false` | Lock all action movement |
| `hideCursor` | `boolean` | `false` | Hide the playhead cursor |
| `enableRowDrag` | `boolean` | `false` | Allow row reordering |
| `enableCrossRowDrag` | `boolean` | `false` | Allow dragging blocks between rows |

> 📖 See the [full API reference in the docs](https://github.com/keplar-404/react-timeline-editor/tree/main/packages/document/docs/en/guide) for all props, events, and TypeScript types.

---

## 🏗 Architecture

```
react-timeline-editor/              # Monorepo root
├── packages/
│   ├── timeline/                   # @keplar-404/react-timeline-editor
│   │   └── src/
│   │       ├── components/
│   │       │   ├── timeline.tsx    # Core <Timeline /> component
│   │       │   ├── transport/      # TransportBar + useTimelinePlayer
│   │       │   ├── cut-overlay/    # CutOverlay scissors tool
│   │       │   └── loop-zone/      # LoopZoneOverlay
│   │       └── interface/
│   │           └── timeline.ts     # All TypeScript interfaces
│   ├── engine/                     # @keplar-404/timeline-engine
│   │   └── src/
│   │       ├── core/               # Engine, Emitter, Events
│   │       └── interface/          # TimelineAction, TimelineEffect
│   ├── document/                   # Rspress documentation site
│   └── example/                    # Interactive demo app
└── CHANGELOG.md
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. **Fork** this repository
2. **Create** a feature branch: `git checkout -b feat/my-feature`
3. **Commit** your changes using [Conventional Commits](https://www.conventionalcommits.org/): `git commit -m "feat: add my feature"`
4. **Push** and open a **Pull Request**

Please check the [open issues](https://github.com/keplar-404/react-timeline-editor/issues) before starting work on something new.

### Development Setup

```bash
# Clone the repo
git clone https://github.com/keplar-404/react-timeline-editor.git
cd react-timeline-editor

# Install all workspace dependencies
bun install

# Run the docs site locally
bun --filter docs dev

# Run the example app
bun --filter example dev

# Build all packages
bun run build
```

---

## 📜 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a full history of releases and changes.

---

## 🙏 Acknowledgements

This package is built on top of and derived from [@xzdarcy/react-timeline-editor](https://github.com/xzdarcy/react-timeline-editor).  
All credit for the original architecture and engine goes to [@xzdarcy](https://github.com/xzdarcy).  
This repository is a heavily extended fork with major new capabilities introduced by [@keplar-404](https://github.com/keplar-404).

---

## 📄 License

[MIT](./LICENSE) © [keplar-404](https://github.com/keplar-404)
