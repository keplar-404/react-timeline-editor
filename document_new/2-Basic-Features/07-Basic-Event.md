# Basic Event Handling

You can extend the editor's capabilities by hooking into standard React mouse event callbacks for Actions, Rows, and the Time Ruler.

These include click, double click, and right-click callbacks.

## Example: Double Click to Add Action

This example demonstrates how to listen for `onDoubleClickRow` to insert a new action block wherever the user double clicks on an empty track.

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

export const EditorEventHandling = () => {
  const [data, setData] = useState(mockData);
  let actionCounter = 0;

  const handleDoubleClickRow = (e: React.MouseEvent, { row, time }: { row: TimelineRow; time: number }) => {
    // Prevent adding if we clicked on an existing action
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
          end: time + 2, // default 2 second block
          effectId: 'effect0',
        });
      }
      return nextData;
    });
  };

  const handleActionClick = (e: React.MouseEvent, { action, row, time }: any) => {
    console.log(`Clicked action: ${action.id} at time ${time}`);
  };

  return (
    <div className="timeline-container">
      <Timeline editorData={data} effects={mockEffect} onChange={setData} onDoubleClickRow={handleDoubleClickRow} onClickAction={handleActionClick} />
      <style>{`
        .timeline-container { width: 100%; border: 1px solid #333; }
      `}</style>
    </div>
  );
};
```
