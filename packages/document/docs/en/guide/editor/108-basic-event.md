---
title: Basic Events
---

# Basic Event Handling

Hook into mouse event callbacks for actions, rows, and the time ruler.

## Available Event Callbacks

| Callback | Trigger | Parameters |
|---|---|---|
| `onClickRow` | Single click on a row | `(e, { row, time })` |
| `onClickAction` | Single click on an action block | `(e, { action, row, time })` |
| `onClickActionOnly` | Click on action (only when **no** drag was triggered) | `(e, { action, row, time })` |
| `onDoubleClickRow` | Double click on a row | `(e, { row, time })` |
| `onDoubleClickAction` | Double click on an action block | `(e, { action, row, time })` |
| `onContextMenuRow` | Right-click on a row | `(e, { row, time })` |
| `onContextMenuAction` | Right-click on an action block | `(e, { action, row, time })` |
| `onClickTimeArea` | Click on the top time ruler | `(time, e)` — return `false` to prevent cursor move |

## Example: Double Click to Add Action

Listen to `onDoubleClickRow` to insert a new action wherever the user double-clicks on an empty track.

```tsx
import { Timeline, TimelineRow, TimelineEffect } from '@keplar-404/react-timeline-editor';
import React, { useState } from 'react';
import { cloneDeep } from 'lodash';

const mockData: TimelineRow[] = [
  { id: 'row-1', actions: [] },
  { id: 'row-2', actions: [] },
];

const mockEffect: Record<string, TimelineEffect> = {
  effect0: { id: 'effect0', name: 'Added Effect' },
};

let actionCounter = 0;

export const EditorEventHandling = () => {
  const [data, setData] = useState(mockData);

  const handleDoubleClickRow = (
    e: React.MouseEvent,
    { row, time }: { row: TimelineRow; time: number },
  ) => {
    // Don't add if clicking on an existing action
    const target = e.target as HTMLElement;
    if (target.className.includes('timeline-editor-action')) return;

    setData((prev) => {
      const nextData = cloneDeep(prev);
      const targetRow = nextData.find((r) => r.id === row.id);
      if (targetRow) {
        actionCounter += 1;
        targetRow.actions.push({
          id: `new-action-${actionCounter}`,
          start: time,
          end: time + 2,
          effectId: 'effect0',
        });
      }
      return nextData;
    });
  };

  return (
    <div className="timeline-container">
      <Timeline
        editorData={data}
        effects={mockEffect}
        onChange={setData}
        onDoubleClickRow={handleDoubleClickRow}
        onClickAction={(e, { action, row, time }) => {
          console.log(`Clicked: ${action.id} at ${time}s`);
        }}
        onContextMenuAction={(e, { action }) => {
          e.preventDefault();
          console.log(`Right-clicked: ${action.id}`);
        }}
      />
      <style>{`
        .timeline-container { width: 100%; border: 1px solid #333; }
      `}</style>
    </div>
  );
};
```

## Preventing Cursor Set on Time Area Click

Return `false` from `onClickTimeArea` to prevent the cursor from jumping to the clicked time:

```tsx
<Timeline
  editorData={data}
  effects={mockEffect}
  onClickTimeArea={(time, e) => {
    if (time < 0) return false; // Ignore clicks before time 0
    console.log(`Time ruler clicked at ${time}s`);
    // return undefined / void to allow cursor movement
  }}
/>
```
