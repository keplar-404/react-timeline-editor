# Basic Event Handling

You can extend timeline capabilities by handling **click**, **double-click**, and **right-click** callbacks on actions and rows.

| Callback | Trigger |
|---|---|
| `onClickRow` | Single click on a row |
| `onDoubleClickRow` | Double click on a row |
| `onContextMenuRow` | Right-click on a row |
| `onClickAction` | Single click on an action block |
| `onClickActionOnly` | Click on an action block (skipped if a drag was triggered) |
| `onDoubleClickAction` | Double click on an action block |
| `onContextMenuAction` | Right-click on an action block |

---

## Double Click to Add New Action

Double-clicking on any row creates a new 0.5s action block starting at the clicked time position.

### Component

```tsx
import { Timeline } from '@keplar-404/react-timeline-editor';
import { TimelineAction } from '@keplar-404/timeline-engine';
import { cloneDeep } from 'lodash';
import React, { useRef, useState } from 'react';
import './index.css';
import { mockData, mockEffect } from './mock';

const defaultEditorData = cloneDeep(mockData);

const TimelineEditor = () => {
  const [data, setData] = useState(defaultEditorData);
  const idRef = useRef(0);

  return (
    <div className="timeline-editor-example0">
      <Timeline
        onChange={setData}
        editorData={data}
        effects={mockEffect}
        hideCursor={false}
        onDoubleClickRow={(e, { row, time }) => {
          setData((prev) => {
            const rowIndex = prev.findIndex((item) => item.id === row.id);
            const newAction: TimelineAction = {
              id: `action${idRef.current++}`,
              start: time,
              end: time + 0.5,
              effectId: 'effect0',
            };
            prev[rowIndex] = { ...row, actions: [...row.actions, newAction] };
            return [...prev];
          });
        }}
      />
    </div>
  );
};

export default TimelineEditor;
```

### Styles (`index.css`)

```css
.timeline-editor-example0 .timeline-editor {
  width: 100%;
  max-width: 800px;
  height: 300px;
}

.timeline-editor-example0 .timeline-editor-action {
  height: 28px !important;
  top: 50%;
  transform: translateY(-50%);
}
```

### Mock Data (`mock.ts`)

```typescript
import { TimelineEffect, TimelineRow } from '@keplar-404/timeline-engine';

export const mockEffect: Record<string, TimelineEffect> = {
  effect0: { id: 'effect0', name: 'Effect 0' },
  effect1: { id: 'effect1', name: 'Effect 1' },
};

// All rows start empty — blocks are added by double-clicking
export const mockData: TimelineRow[] = [
  { id: '0', actions: [] },
  { id: '1', actions: [] },
  { id: '2', actions: [] },
  { id: '3', actions: [] },
  { id: '4', actions: [] },
  { id: '5', actions: [] },
  { id: '6', actions: [] },
  { id: '7', actions: [] },
];
```

---

## How It Works

`onDoubleClickRow` receives:
- `e` — the native `MouseEvent`
- `{ row, time }` — the `TimelineRow` that was clicked and the timeline time at the click position (in seconds)

The handler uses a `useRef` counter (`idRef`) to generate unique IDs for each new action without causing re-renders on the counter itself.

> **Tip:** The `time` value passed to row and action event callbacks is calculated from the pixel position of the click relative to the timeline's `startLeft`, `scaleWidth`, and `scale` settings — so it correctly reflects the visual position even when the timeline is zoomed or offset.
