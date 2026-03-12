# Action Configuration

You can strictly control how an action behaves in the editor by modifying its direct properties.

## Movable & Flexible

You can control whether the action can be dragged (`movable`) or scaled (`flexible`) by passing these boolean properties on the action.

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
        movable: false, // Cannot drag to a new time
      },
      {
        id: 'action01',
        start: 3,
        end: 5,
        effectId: 'effect0',
        flexible: false, // Cannot resize start/end handles
      },
      {
        id: 'action02',
        start: 6,
        end: 8,
        effectId: 'effect0',
        flexible: false,
        movable: false, // Completely locked
      },
    ],
  },
];
```

## MinStart & MaxEnd Limits

You can control and clamp the movement range of actions through `maxEnd` and `minStart`. If a user attempts to drag an action beyond these bounds, the editor will prevent it.

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
        minStart: 1, // Cannot be moved left of 1s
        maxEnd: 6, // Cannot be moved right of 6s
      },
    ],
  },
];
```
