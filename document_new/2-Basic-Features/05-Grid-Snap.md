# Grid Snap

After enabling Grid Snap, the blocks will snap and move according to the subdivided units (`scaleSplitCount`) of the timeline ruler.

## Example

Enable this behavior by passing `gridSnap={true}` to the Timeline component.

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
      },
    ],
  },
];

const mockEffect: Record<string, TimelineEffect> = {
  effect0: { id: 'effect0', name: 'Effect 0' },
};

export const EditorGridSnap = () => {
  const [data, setData] = useState(mockData);

  return (
    <div className="timeline-container">
      <Timeline
        editorData={data}
        effects={mockEffect}
        onChange={setData}
        gridSnap={true}
        scaleSplitCount={10} // Will snap in increments based on this split
      />
      <style>{`
        .timeline-container { width: 100%; border: 1px solid #333; }
      `}</style>
    </div>
  );
};
```
