# Getting Started

`@keplar-404/react-timeline-editor` is a robust React component for quickly assembling timeline interfaces. It depends on `@keplar-404/timeline-engine` to run actions.

> Special thanks to [@xzdarcy](https://github.com/xzdarcy) for the original [@xzdarcy/react-timeline-editor](https://github.com/xzdarcy/react-timeline-editor).

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

To render a simple, interactive empty timeline:

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
