---
title: Move & Resize Callbacks
---

# Move & Resize Callbacks

Listen to action block move and resize events to validate, constrain, or log changes.

## Move Callbacks

```tsx
import { Timeline, TimelineRow, TimelineAction, TimelineEffect } from '@keplar-404/react-timeline-editor';
import React, { useState } from 'react';

const mockData: TimelineRow[] = [
  {
    id: 'row-1',
    actions: [{ id: 'action-1', start: 0, end: 2, effectId: 'effect0' }],
  },
];

const mockEffect: Record<string, TimelineEffect> = {
  effect0: { id: 'effect0', name: 'Effect 0' },
};

export const EditorMoveCallbacks = () => {
  const [data, setData] = useState(mockData);

  return (
    <Timeline
      editorData={data}
      effects={mockEffect}
      onChange={setData}
      onActionMoveStart={({ action, row }) => {
        console.log(`Move started: ${action.id}`);
      }}
      onActionMoving={({ action, row, start, end }) => {
        // Return false to prevent this specific movement
        if (start < 0) return false;
      }}
      onActionMoveEnd={({ action, row, start, end }) => {
        console.log(`Move ended: ${action.id} → [${start}, ${end}]`);
        // Return false to skip triggering onChange
      }}
    />
  );
};
```

## Resize Callbacks

```tsx
<Timeline
  editorData={data}
  effects={mockEffect}
  onChange={setData}
  onActionResizeStart={({ action, row, dir }) => {
    console.log(`Resize started on ${dir} side: ${action.id}`);
  }}
  onActionResizing={({ action, row, start, end, dir }) => {
    // Prevent resizing below a minimum duration of 0.5s
    if (end - start < 0.5) return false;
  }}
  onActionResizeEnd={({ action, row, start, end, dir }) => {
    console.log(`Resize ended: ${action.id} → [${start}, ${end}]`);
  }}
/>
```

## Callback Reference

### Move Callbacks

| Callback | Parameters | Return Value | Description |
|---|---|---|---|
| `onActionMoveStart` | `{ action, row }` | `void` | Called when a move starts |
| `onActionMoving` | `{ action, row, start, end }` | `void \| false` | Called during move; return `false` to block |
| `onActionMoveEnd` | `{ action, row, start, end }` | `void \| false` | Called when move ends; return `false` to skip `onChange` |

### Resize Callbacks

| Callback | Parameters | Return Value | Description |
|---|---|---|---|
| `onActionResizeStart` | `{ action, row, dir }` | `void` | Called when a resize starts |
| `onActionResizing` | `{ action, row, start, end, dir }` | `void \| false` | Called during resize; return `false` to block |
| `onActionResizeEnd` | `{ action, row, start, end, dir }` | `void \| false` | Called when resize ends; return `false` to skip `onChange` |

> **`dir`** is `"left"` or `"right"` — indicating which resize handle was used.
