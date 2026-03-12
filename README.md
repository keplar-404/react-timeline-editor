<![CDATA[<div align="center">

<img src="https://github.com/keplar-404/react-timeline-editor/blob/f79d85eee8a723e5210c04232daf2c51888418c0/public/assets/timeline.gif" alt="React Timeline Editor Demo" width="100%" />

<h1>React Timeline Editor</h1>

<p>A high-performance, feature-rich timeline editor for React — built for animation editors, video production tools, and any time-based UI.</p>

[![npm version](https://img.shields.io/npm/v/@keplar-404/react-timeline-editor?style=flat-square&color=6366f1&label=react-timeline-editor)](https://www.npmjs.com/package/@keplar-404/react-timeline-editor)
[![npm version](https://img.shields.io/npm/v/@keplar-404/timeline-engine?style=flat-square&color=8b5cf6&label=timeline-engine)](https://www.npmjs.com/package/@keplar-404/timeline-engine)
[![npm downloads](https://img.shields.io/npm/dm/@keplar-404/react-timeline-editor?style=flat-square&color=06b6d4)](https://www.npmjs.com/package/@keplar-404/react-timeline-editor)
[![License: MIT](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)](https://github.com/keplar-404/react-timeline-editor/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

**[📖 Documentation](https://github.com/keplar-404/react-timeline-editor)** · **[📦 npm](https://www.npmjs.com/package/@keplar-404/react-timeline-editor)** · **[🐛 Report a Bug](https://github.com/keplar-404/react-timeline-editor/issues)** · **[💡 Request a Feature](https://github.com/keplar-404/react-timeline-editor/issues)**

> ⚠️ **Beta Software** — This package is actively developed. APIs are stabilizing but may have minor changes before `v2.0`. Please pin your version and check the [CHANGELOG](./CHANGELOG.md) when upgrading.

</div>

---

## ✨ What's Included

This is a **monorepo** containing two packages:

| Package | Version | Description |
|---|---|---|
| [`@keplar-404/react-timeline-editor`](./packages/timeline) | ![npm](https://img.shields.io/npm/v/@keplar-404/react-timeline-editor?style=flat-square) | The React `<Timeline />` UI component |
| [`@keplar-404/timeline-engine`](./packages/engine) | ![npm](https://img.shields.io/npm/v/@keplar-404/timeline-engine?style=flat-square) | The standalone, headless playback engine |

---

## 🚀 Features

- **⚡ High Performance** — Virtualized rows handle thousands of action blocks without lag
- **🎯 Precision Snapping** — Grid snap and auxiliary drag-line snap for frame-accurate editing
- **↕️ Row Drag Sorting** — Drag and reorder entire tracks vertically with smooth ghost previews
- **↔️ Cross-Row Dragging** — Move action blocks between different tracks seamlessly
- **✂️ Blade / Cut Tool** — Slice and split timeline actions dynamically at any point
- **🎛️ Transport Controls** — Pre-built `<TransportBar />` with Play, Pause, Seek, and Loop controls
- **🔁 Loop Zones** — `<LoopZoneOverlay />` for draggable repeat regions
- **🎨 Custom Renderers** — Full control over how action blocks look with `getActionRender`
- **📐 Scale Customization** — Configurable zoom level, scale width, and split count
- **🔗 Engine Decoupled** — Use `@keplar-404/timeline-engine` headlessly with any rendering layer
- **📦 TypeScript First** — Full type definitions included

> **Attribution:** This package is built on top of and derived from the excellent work by [@xzdarcy/react-timeline-editor](https://github.com/xzdarcy/react-timeline-editor). Full credit for the fundamental engine and architecture goes to [@xzdarcy](https://github.com/xzdarcy). This fork by [@keplar-404](https://github.com/keplar-404) introduces major new capabilities.

---

## 📦 Installation

Both packages are required. The engine powers the playback logic shared by the React component.

```bash
# npm
npm install @keplar-404/react-timeline-editor @keplar-404/timeline-engine

# bun
bun add @keplar-404/react-timeline-editor @keplar-404/timeline-engine

# pnpm
pnpm add @keplar-404/react-timeline-editor @keplar-404/timeline-engine

# yarn
yarn add @keplar-404/react-timeline-editor @keplar-404/timeline-engine
```

---

## 🎨 Import the Stylesheet

The component requires its stylesheet. Import it **once** in your app — either in your global CSS or directly in a component:

```css
/* global.css / app.css */
@import '@keplar-404/react-timeline-editor/dist/react-timeline-editor.css';
```

or in a TypeScript/JavaScript file:

```ts
import '@keplar-404/react-timeline-editor/dist/react-timeline-editor.css';
```

> **Note:** Skipping this will result in an unstyled, broken-looking timeline.

---

## ⚡ Quick Start

```tsx
import React, { useState } from 'react';
import { Timeline } from '@keplar-404/react-timeline-editor';
import type { TimelineRow, TimelineEffect } from '@keplar-404/react-timeline-editor';
import '@keplar-404/react-timeline-editor/dist/react-timeline-editor.css';

const rows: TimelineRow[] = [
  {
    id: 'track-1',
    actions: [
      { id: 'clip-1', start: 0, end: 3, effectId: 'video' },
      { id: 'clip-2', start: 4, end: 7, effectId: 'audio' },
    ],
  },
  {
    id: 'track-2',
    actions: [
      { id: 'clip-3', start: 1, end: 5, effectId: 'video' },
    ],
  },
];

const effects: Record<string, TimelineEffect> = {
  video: { id: 'video', name: 'Video' },
  audio: { id: 'audio', name: 'Audio' },
};

export function MyEditor() {
  const [data, setData] = useState(rows);

  return (
    <Timeline
      editorData={data}
      effects={effects}
      onChange={(newData) => setData(newData)}
      autoScroll={true}
    />
  );
}
```

---

## 🎮 Playback Controls (via Ref)

For programmatic play/pause/seek, use the `ref` prop:

```tsx
import React, { useRef, useState } from 'react';
import { Timeline } from '@keplar-404/react-timeline-editor';
import type { TimelineState, TimelineRow, TimelineEffect } from '@keplar-404/react-timeline-editor';
import '@keplar-404/react-timeline-editor/dist/react-timeline-editor.css';

export function PlayerExample() {
  const timelineRef = useRef<TimelineState>(null);
  const [data] = useState<TimelineRow[]>([ /* your rows */ ]);
  const effects: Record<string, TimelineEffect> = { /* your effects */ };

  return (
    <div>
      <button onClick={() => timelineRef.current?.play({ autoEnd: true })}>▶ Play</button>
      <button onClick={() => timelineRef.current?.pause()}>⏸ Pause</button>
      <button onClick={() => timelineRef.current?.setTime(0)}>⏮ Rewind</button>

      <Timeline
        ref={timelineRef}
        editorData={data}
        effects={effects}
        onChange={() => {}}
      />
    </div>
  );
}
```

---

## 🔑 Key Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `editorData` | `TimelineRow[]` | **required** | The array of track rows and their action blocks |
| `effects` | `Record<string, TimelineEffect>` | **required** | Map of effect definitions keyed by ID |
| `onChange` | `(rows: TimelineRow[]) => void` | — | Called whenever actions are dragged or resized |
| `autoScroll` | `boolean` | `false` | Pan the timeline when dragging near the edges |
| `gridSnap` | `boolean` | `false` | Snap actions to the time grid |
| `dragLine` | `boolean` | `false` | Show auxiliary snap lines between actions |
| `scale` | `number` | `1` | Number of seconds per scale unit |
| `scaleWidth` | `number` | `160` | Pixel width of each scale unit |
| `scaleSplitCount` | `number` | `10` | Number of subdivisions within each scale unit |
| `disableDrag` | `boolean` | `false` | Lock the timeline — no user interaction |
| `hideCursor` | `boolean` | `false` | Hide the playback cursor line |
| `enableRowDrag` | `boolean` | `false` | Enable drag-to-reorder of rows |
| `getActionRender` | `(action) => ReactNode` | — | Custom renderer for action block content |
| `ref` | `RefObject<TimelineState>` | — | Imperative handle for play/pause/seek |

---

## 📐 Data Interfaces

```ts
interface TimelineRow {
  id: string;
  actions: TimelineAction[];
  /** Optional: lock all actions in this row */
  rowLock?: boolean;
}

interface TimelineAction {
  id: string;
  start: number;        // Start time in seconds
  end: number;          // End time in seconds
  effectId: string;     // References a key in your effects map
  movable?: boolean;    // Can the user drag this action? (default: true)
  flexible?: boolean;   // Can the user resize this action? (default: true)
}

interface TimelineEffect {
  id: string;
  name: string;
}
```

---

## 🔄 Releases & Changelog

See the full [CHANGELOG.md](./CHANGELOG.md) for a detailed history of every release.

| Version | Date | Highlights |
|---|---|---|
| **[1.0.11](./CHANGELOG.md#10111---2026-03-13)** | 2026-03-13 | Idempotent CI publish; lockstep engine+timeline versioning |
| **[1.0.10](./CHANGELOG.md#10101---2026-03-13)** | 2026-03-13 | Fixed CSS `@import` via `"style"` export condition (Tailwind v4, webpack) |
| **[1.0.9](./CHANGELOG.md#109---2026-03-13)** | 2026-03-13 | Fixed broken npm install (entry points now point to compiled `dist/`) |
| **[1.0.8](./CHANGELOG.md#108---2026-03-12)** | 2026-03-12 | Fixed `workspace:*` to resolvable version ranges for npm consumers |
| **[1.0.0](./CHANGELOG.md#100---2026-03-09)** | 2026-03-09 | Initial public release |

---

## 🏗️ Monorepo Structure

```
react-timeline-editor/
├── packages/
│   ├── timeline/       # @keplar-404/react-timeline-editor (React component)
│   ├── engine/         # @keplar-404/timeline-engine (headless playback engine)
│   ├── document/       # Documentation site source
│   └── example/        # Example app
├── scripts/            # Release automation scripts
├── CHANGELOG.md
└── package.json        # Workspace root
```

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are welcome!

1. **Fork** this repository
2. **Create** a feature branch: `git checkout -b feat/my-feature`
3. **Commit** your changes with a descriptive message
4. **Open a Pull Request** against `main`

Please check the [open issues](https://github.com/keplar-404/react-timeline-editor/issues) before submitting a duplicate.

---

## 📄 License

MIT © [keplar-404](https://github.com/keplar-404)

Original work by [@xzdarcy](https://github.com/xzdarcy) — [MIT License](https://github.com/xzdarcy/react-timeline-editor/blob/main/LICENSE)
]]>