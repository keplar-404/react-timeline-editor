# Row Drag-and-Drop Sorting

The `@keplar-404/react-timeline-editor` introduces two powerful custom drag-and-drop features:

1. Reordering entire track rows (`enableRowDrag`).
2. Moving action blocks between _different_ rows (`enableCrossRowDrag`).

## Feature 1: Row Reordering

You can allow users to vertically drag the row headers to reorder the entire timeline data structure.

### Enabling Row Drag

Enable this feature by setting `enableRowDrag={true}`. You must also handle the `onRowDragEnd` event to update your data's order.

```tsx
import { Timeline, TimelineRow, TimelineEffect } from '@keplar-404/react-timeline-editor';
import React, { useState } from 'react';

const mockData: TimelineRow[] = [
  { id: 'Track A', actions: [] },
  { id: 'Track B', actions: [] },
  { id: 'Track C', actions: [] },
];

export const EditorRowDrag = () => {
  const [data, setData] = useState(mockData);

  return (
    <div className="timeline-container">
      <Timeline
        editorData={data}
        effects={{}}
        onChange={setData}
        enableRowDrag={true}
        onRowDragStart={({ row }) => {
          console.log('Started dragging row:', row.id);
        }}
        onRowDragEnd={({ row, editorData }) => {
          console.log('Finished dragging row:', row.id);
          // The engine calculates the new sorted array for you!
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

You can allow users to grab an action block from one row and drag it vertically into another row.

### Enabling Cross-Row Drag

Set `enableCrossRowDrag={true}`. During the drag, a "Ghost Preview" of the block will follow the cursor.

```tsx
export const EditorCrossRowDrag = () => {
  const [data, setData] = useState(mockData);

  return (
    <Timeline
      editorData={data}
      effects={{}}
      onChange={setData}
      enableCrossRowDrag={true}
      enableGhostPreview={true} // Enabled by default
    />
  );
};
```

### Custom Ghost Previews

By default, the ghost preview is a blue glowing box. You can render a fully custom preview that matches your block's actual appearance using `getGhostPreview`.

```tsx
<Timeline
  editorData={data}
  effects={{}}
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
/* Ensure the ghost preview has the exact styling you want */
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
