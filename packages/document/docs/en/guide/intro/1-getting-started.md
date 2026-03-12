---
title: Getting Started
---

# Getting Started

`@keplar-404/react-timeline-editor` is a powerful React-based component library for quickly building comprehensive timeline animation and video editors.

> **Note:** This package is built on top of and derived from [@xzdarcy/react-timeline-editor](https://github.com/xzdarcy/react-timeline-editor). This repository is a heavily extended fork introducing major custom capabilities by [@keplar-404](https://github.com/keplar-404).

![timeline](/assets/timeline.gif)

## Key Features

- **Scalable Timeline Zooming** — grid snapping, auxiliary snapping lines, action block dragging and rendering.
- **Independent Engine** — `@keplar-404/timeline-engine` is cleanly separated from React DOM for headless or alternative environments.
- **Row Drag-and-Drop Sorting** — drag and reorder entire track rows.
- **Cross-Row Block Dragging** — drag action blocks between rows with a ghost preview.
- **Cut Block Mechanism** — built-in feature to slice and split timeline action blocks dynamically.
- **Transport Bar** — pre-built professional playback controls UI.
- **Loop Zone Overlay** — draggable repeat region rendered on top of the timeline.

## Installation

Using `bun` (recommended):

```bash
bun add @keplar-404/react-timeline-editor @keplar-404/timeline-engine
```

Using `npm`:

```bash
npm install @keplar-404/react-timeline-editor @keplar-404/timeline-engine
```

## Basic Initialization

To render a simple, interactive timeline:

```tsx
import React, { useState } from 'react';
import { Timeline, TimelineRow, TimelineEffect } from '@keplar-404/react-timeline-editor';

export const TimelineEditor = () => {
  const [data, setData] = useState<TimelineRow[]>([
    {
      id: 'track-1',
      actions: [
        {
          id: 'action-1',
          start: 0,
          end: 2,
          effectId: 'effect-0',
        },
      ],
    },
  ]);

  const mockEffect: Record<string, TimelineEffect> = {
    'effect-0': {
      id: 'effect-0',
      name: 'Example Effect',
    },
  };

  return <Timeline editorData={data} effects={mockEffect} onChange={(newData) => setData(newData)} />;
};
```
