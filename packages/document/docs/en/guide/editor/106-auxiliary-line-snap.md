---
title: Auxiliary Line Snap
---

# Auxiliary Line Snap

After enabling Auxiliary Line Snap, moving an action block near the edges of other actions automatically snaps it perfectly aligned to those edges.

## Enabling Auxiliary Snap

Set `dragLine={true}` on the Timeline component.

```tsx
import { Timeline, TimelineRow, TimelineEffect } from '@keplar-404/react-timeline-editor';
import React, { useState } from 'react';

const mockData: TimelineRow[] = [
  {
    id: '0',
    actions: [
      { id: 'action01', start: 0, end: 2, effectId: 'effect0' },
    ],
  },
  {
    id: '1',
    actions: [
      { id: 'action10', start: 2, end: 4, effectId: 'effect0' },
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

## Custom Assist Lines

By default, all action edges (except the one being dragged) are used as snap targets. Use `getAssistDragLineActionIds` to customize which actions are used as snap guides:

```tsx
<Timeline
  editorData={data}
  effects={mockEffect}
  onChange={setData}
  dragLine={true}
  getAssistDragLineActionIds={({ action, editorData, row }) => {
    // Only snap to actions in the same row
    return row.actions
      .filter((a) => a.id !== action.id)
      .map((a) => a.id);
  }}
/>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `dragLine` | `boolean` | `false` | Enable auxiliary line snap |
| `getAssistDragLineActionIds` | `({ action, editorData, row }) => string[]` | All other actions | Custom snap targets |
