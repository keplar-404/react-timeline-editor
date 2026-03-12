# Move and Scale Callbacks

You can customize behavior **before**, **during**, and **after** dragging or resizing action blocks by defining move and scale callbacks.

Returning `false` from any `onActionMoving` or `onActionResizing` callback **cancels** the current operation for that frame, giving you fine-grained control over what the user can do.

---

## Available Callbacks

| Callback | When it fires | Return `false` to… |
|---|---|---|
| `onActionMoveStart` | When a drag begins | — (informational only) |
| `onActionMoving` | Every frame during drag | Cancel the move for that frame |
| `onActionMoveEnd` | When drag finishes | Prevent `onChange` from triggering |
| `onActionResizeStart` | When a resize begins | — (informational only) |
| `onActionResizing` | Every frame during resize | Cancel the resize for that frame |
| `onActionResizeEnd` | When resize finishes | Prevent `onChange` from triggering |

---

## Example: Prevent Right-side Resize

The demo below prevents dragging the **right** resize handle on `action10`. The block can only be resized from the left side.

### Component

```tsx
import { Timeline } from '@keplar-404/react-timeline-editor';
import { cloneDeep } from 'lodash';
import React, { useState } from 'react';
import './index.css';
import { mockData, mockEffect } from './mock';

const defaultEditorData = cloneDeep(mockData);

const TimelineEditor = () => {
  const [data, setData] = useState(defaultEditorData);

  return (
    <div className="timeline-editor-example5">
      <Timeline
        onChange={setData}
        editorData={data}
        effects={mockEffect}
        hideCursor={false}
        getActionRender={(action) => {
          if (action.id === 'action10') {
            return <div className="prompt">Can only resize from the left</div>;
          }
        }}
        onActionResizing={({ action, dir }) => {
          // Return false to block resizing from the right handle
          if (action.id === 'action10' && dir !== 'left') return false;
        }}
      />
    </div>
  );
};

export default TimelineEditor;
```

### Styles (`index.css`)

```css
.timeline-editor-example5 .timeline-editor {
  width: 100%;
  max-width: 800px;
  height: 300px;
}

.timeline-editor-example5 .timeline-editor-action {
  height: 28px !important;
  top: 50%;
  transform: translateY(-50%);
}

.timeline-editor-example5 .timeline-editor-action .prompt {
  font-size: 12px;
  color: #fff;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Mock Data (`mock.ts`)

```typescript
import { TimelineEffect, TimelineRow } from '@keplar-404/timeline-engine';

export const mockEffect: Record<string, TimelineEffect> = {
  effect0: { id: 'effect0', name: 'Effect 0' },
  effect1: { id: 'effect1', name: 'Effect 1' },
};

export const mockData: TimelineRow[] = [
  {
    id: '0',
    actions: [
      { id: 'action00', start: 0,   end: 2, effectId: 'effect0' },
    ],
  },
  {
    id: '1',
    actions: [
      // This action can only be resized from the left handle
      { id: 'action10', start: 1.5, end: 4, effectId: 'effect1' },
    ],
  },
];
```

---

## Callback Signatures

### Move Callbacks

```typescript
onActionMoveStart?: (params: {
  action: TimelineAction;
  row: TimelineRow;
}) => void;

onActionMoving?: (params: {
  action: TimelineAction;
  row: TimelineRow;
  start: number;
  end: number;
}) => boolean | void;  // return false to cancel

onActionMoveEnd?: (params: {
  action: TimelineAction;
  row: TimelineRow;
  start: number;
  end: number;
}) => void;  // return false to skip onChange
```

### Resize Callbacks

```typescript
onActionResizeStart?: (params: {
  action: TimelineAction;
  row: TimelineRow;
  dir: 'left' | 'right';
}) => void;

onActionResizing?: (params: {
  action: TimelineAction;
  row: TimelineRow;
  start: number;
  end: number;
  dir: 'left' | 'right';
}) => boolean | void;  // return false to cancel

onActionResizeEnd?: (params: {
  action: TimelineAction;
  row: TimelineRow;
  start: number;
  end: number;
  dir: 'left' | 'right';
}) => void;  // return false to skip onChange
```

---

## Common Patterns

### Prevent moving a specific action

```tsx
onActionMoving={({ action }) => {
  if (action.id === 'locked-action') return false;
}}
```

### Restrict movement to a time range

```tsx
onActionMoving={({ action, start, end }) => {
  if (start < 2 || end > 10) return false;
}}
```

### Log move events without blocking

```tsx
onActionMoveStart={({ action, row }) => {
  console.log(`Started moving "${action.id}" in row "${row.id}"`);
}}
onActionMoveEnd={({ action, start, end }) => {
  console.log(`Moved to ${start}s – ${end}s`);
}}
```

> **Tip:** `onActionResizing` receives `dir: 'left' | 'right'` so you can restrict resize behaviour per-handle — e.g. lock the right handle while still allowing the left one, as shown in the example above.
