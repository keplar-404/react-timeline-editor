# Auxiliary Line Snap

After enabling Auxiliary Line Snap, moving an action block near other actions or near the playback cursor will automatically snap it in place.

## Example

Enable this behavior by setting `dragLine={true}`.

```tsx
import { Timeline, TimelineRow, TimelineEffect } from '@keplar-404/react-timeline-editor';
import React, { useState } from 'react';

const mockData: TimelineRow[] = [
  {
    id: '0',
    actions: [
      {
        id: 'action01',
        start: 0,
        end: 2,
        effectId: 'effect0',
      },
    ],
  },
  {
    id: '1',
    actions: [
      {
        id: 'action10',
        start: 2, // Dragging an action near 2s will snap perfectly to this block
        end: 4,
        effectId: 'effect0',
      },
    ],
  },
];

const mockEffect: Record<string, TimelineEffect> = {
  effect0: { id: 'effect0', name: 'Effect 0' },
};

export const EditorAuxiliarySnap = () => {
  const [data, setData] = useState(mockData);

  return (
    <div className="timeline-container">
      <Timeline editorData={data} effects={mockEffect} onChange={setData} dragLine={true} />
      <style>{`
        .timeline-container { width: 100%; border: 1px solid #333; }
      `}</style>
    </div>
  );
};
```
