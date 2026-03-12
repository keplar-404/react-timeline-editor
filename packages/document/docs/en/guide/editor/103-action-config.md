---
title: Action Configuration
---

# Action Configuration

Control how individual action blocks behave in the editor using per-action properties.

## Movable & Flexible

Control whether an action can be **dragged** (`movable`) or **resized** (`flexible`) independently:

```tsx
import { Timeline, TimelineRow, TimelineEffect } from '@keplar-404/react-timeline-editor';
import React, { useState } from 'react';

const mockData: TimelineRow[] = [
  {
    id: '0',
    actions: [
      {
        id: 'action00',
        start: 0,
        end: 2,
        effectId: 'effect0',
        movable: false,   // Cannot drag to a new time
      },
      {
        id: 'action01',
        start: 3,
        end: 5,
        effectId: 'effect0',
        flexible: false,  // Cannot resize start/end handles
      },
      {
        id: 'action02',
        start: 6,
        end: 8,
        effectId: 'effect0',
        flexible: false,
        movable: false,   // Completely locked
      },
    ],
  },
];

const mockEffect: Record<string, TimelineEffect> = {
  effect0: { id: 'effect0', name: 'Effect 0' },
};

export const EditorActionConfig = () => {
  const [data, setData] = useState(mockData);
  return <Timeline editorData={data} effects={mockEffect} onChange={setData} />;
};
```

## MinStart & MaxEnd Limits

Clamp the movement range using `minStart` and `maxEnd`. If a user drags beyond these bounds, the editor prevents it:

```tsx
const mockDataWithLimits: TimelineRow[] = [
  {
    id: '1',
    actions: [
      {
        id: 'action10',
        start: 2,
        end: 4,
        effectId: 'effect0',
        minStart: 1,   // Cannot be moved left of 1s
        maxEnd: 6,     // Cannot be moved right of 6s
      },
    ],
  },
];
```

## Action Property Reference

| Property | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | **(Required)** | Unique action identifier |
| `start` | `number` | **(Required)** | Start time in seconds |
| `end` | `number` | **(Required)** | End time in seconds |
| `effectId` | `string` | **(Required)** | ID of the associated `TimelineEffect` |
| `movable` | `boolean` | `true` | Allow horizontal dragging |
| `flexible` | `boolean` | `true` | Allow resizing via handles |
| `minStart` | `number` | `--` | Minimum allowed start time |
| `maxEnd` | `number` | `--` | Maximum allowed end time |
| `style` | `CSSProperties` | `--` | Inline style for the action block |
| `className` | `string` | `--` | Custom CSS class |
| `data` | `any` | `--` | Custom data payload |
