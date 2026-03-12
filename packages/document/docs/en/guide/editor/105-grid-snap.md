---
title: Grid Snap
---

# Grid Snap

After enabling Grid Snap, action blocks snap to the subdivided units (`scaleSplitCount`) of the timeline ruler during drag and resize operations.

## Enabling Grid Snap

Pass `gridSnap={true}` to the Timeline component.

```tsx
import { Timeline, TimelineRow, TimelineEffect } from '@keplar-404/react-timeline-editor';
import React, { useState } from 'react';

const mockData: TimelineRow[] = [
  {
    id: '0',
    actions: [
      { id: 'action00', start: 0, end: 2, effectId: 'effect0' },
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
        scale={1}
        scaleWidth={160}
        scaleSplitCount={10} // Snaps in 0.1s increments (1s / 10)
      />
      <style>{`
        .timeline-container { width: 100%; border: 1px solid #333; }
      `}</style>
    </div>
  );
};
```

## How Grid Snap Works

The snap interval is calculated as:

```
snapInterval = scale / scaleSplitCount
```

For example:
- `scale=1`, `scaleSplitCount=10` → snaps every **0.1 seconds**
- `scale=5`, `scaleSplitCount=10` → snaps every **0.5 seconds**
- `scale=1`, `scaleSplitCount=4`  → snaps every **0.25 seconds**

| Prop | Type | Default | Description |
|---|---|---|---|
| `gridSnap` | `boolean` | `false` | Enable grid snapping |
| `scaleSplitCount` | `number` | `10` | Number of snap intervals per scale mark |
