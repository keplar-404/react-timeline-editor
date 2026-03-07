# React Timeline Editor

> **Note:** This package is built on top of `@xzdarcy/react-timeline-editor` so all credit goes to @xzdarcy. This is just an extended version.

[![npm version](https://img.shields.io/npm/v/@keplar-404/react-timeline-editor.svg?style=flat-square)](https://www.npmjs.com/package/@keplar-404/react-timeline-editor)
[![npm downloads](https://img.shields.io/npm/dm/@keplar-404/react-timeline-editor.svg?style=flat-square)](https://www.npmjs.com/package/@keplar-404/react-timeline-editor)

**[React Timeline Editor](https://zdarcy.com/)** is a react component used to quickly build a timeline animation editor.

![example](https://github.com/keplar-404/react-timeline-editor/blob/f79d85eee8a723e5210c04232daf2c51888418c0/public/assets/timeline.gif)

## Getting Started

```bash
bun add @keplar-404/react-timeline-editor
```

```ts
import { Timeline, TimelineEffect, TimelineRow } from '@keplar-404/react-timeline-editor';
import React from 'react';

const mockData: TimelineRow[] = [{
    id: "0",
    actions: [
      {
        id: "action00",
        start: 0,
        end: 2,
        effectId: "effect0",
      },
    ],
  },
  {
    id: "1",
    actions: [
      {
        id: "action10",
        start: 1.5,
        end: 5,
        effectId: "effect1",
      }
    ],
}]

const mockEffect: Record<string, TimelineEffect> = {
  effect0: {
    id: "effect0",
    name: "Effect 0",
  },
  effect1: {
    id: "effect1",
    name: "Effect 1",
  },
};

const TimelineEditor = () => {
  return (
      <Timeline
        editorData={mockData}
        effects={mockEffect}
      />
  );
};
```

## Documention

Checkout the [Docs](https://zdarcy.com/) for a demonstration of some basic and advanced features.
