---
title: Row Drag Sorting
---

# Row Drag-and-Drop Sorting

The editor supports two powerful drag-and-drop features:

1. **Row Reordering** (`enableRowDrag`) — drag and drop entire track rows to reorder them.
2. **Cross-Row Block Dragging** (`enableCrossRowDrag`) — drag an action block from one row to another.

## Feature 1: Row Reordering

Enable row reordering with `enableRowDrag={true}`. A drag handle appears on the left of each row. Implement `onRowDragEnd` to persist the new order.

```tsx
import { Timeline, TimelineRow, TimelineEffect } from '@keplar-404/react-timeline-editor';
import React, { useState } from 'react';

const mockData: TimelineRow[] = [
  { id: 'Track A', actions: [{ id: 'a1', start: 0, end: 3, effectId: 'effect0' }] },
  { id: 'Track B', actions: [{ id: 'b1', start: 1, end: 4, effectId: 'effect0' }] },
  { id: 'Track C', actions: [{ id: 'c1', start: 2, end: 5, effectId: 'effect0' }] },
];

const mockEffect: Record<string, TimelineEffect> = {
  effect0: { id: 'effect0', name: 'Effect 0' },
};

export const EditorRowDrag = () => {
  const [data, setData] = useState(mockData);

  return (
    <div className="timeline-container">
      <Timeline
        editorData={data}
        effects={mockEffect}
        onChange={setData}
        enableRowDrag={true}
        onRowDragStart={({ row }) => {
          console.log('Started dragging row:', row.id);
        }}
        onRowDragEnd={({ row, editorData }) => {
          // editorData already contains the new sorted array
          setData(editorData);
        }}
      />
      <style>{`
        .timeline-container { width: 100%; border: 1px solid #333; }
      `}</style>
    </div>
  );
};
```

## Feature 2: Cross-Row Block Dragging

Allow users to grab an action block from one row and drag it vertically into another row.

```tsx
export const EditorCrossRowDrag = () => {
  const [data, setData] = useState(mockData);

  return (
    <Timeline
      editorData={data}
      effects={mockEffect}
      onChange={setData}
      enableCrossRowDrag={true}
      enableGhostPreview={true} // Enabled by default
    />
  );
};
```

### Custom Ghost Previews

By default, the ghost is a blue glowing box. Use `getGhostPreview` to render a custom preview:

```tsx
<Timeline
  editorData={data}
  effects={mockEffect}
  onChange={setData}
  enableCrossRowDrag={true}
  getGhostPreview={({ action, row }) => (
    <div className="custom-ghost-preview">
      <span>Moving: {action.id}</span>
    </div>
  )}
/>
```

```css
.custom-ghost-preview {
  background: #1a3a5c;
  border: 2px solid #3b82f6;
  height: 100%;
  border-radius: 4px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  color: #3b82f6;
  font-size: 12px;
}
```

## Drag-Related API

| Prop | Type | Default | Description |
|---|---|---|---|
| `enableRowDrag` | `boolean` | `false` | Enable row reordering via drag handle |
| `onRowDragStart` | `({ row }) => void` | `--` | Called when row drag begins |
| `onRowDragEnd` | `({ row, editorData }) => void` | `--` | Called when row is dropped; `editorData` has the new order |
| `enableCrossRowDrag` | `boolean` | `false` | Enable moving blocks between rows |
| `enableGhostPreview` | `boolean` | `true` | Show a ghost/preview while dragging cross-row |
| `getGhostPreview` | `({ action, row }) => ReactNode` | blue glow | Custom rendering for the ghost preview |

> **Tip:** The `editorData` passed to `onRowDragEnd` already reflects the new row order. Use it directly to update state.
