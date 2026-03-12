# Drag Timeline Row

Use the drag handle on the left side of each row to reorder rows within the timeline. This feature is disabled by default and must be explicitly enabled with `enableRowDrag`.

---

## Example

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
    <div className="timeline-editor-example-drag">
      <Timeline
        onChange={setData}
        editorData={data}
        effects={mockEffect}
        hideCursor={false}
        enableRowDrag={true}
        onRowDragStart={(params) => {
          console.log('Row drag start:', params.row.id);
        }}
        onRowDragEnd={(params) => {
          console.log('Row drag end:', params.row.id, params.editorData);
        }}
      />
    </div>
  );
};

export default TimelineEditor;
```

### Styles (`index.css`)

```css
.timeline-editor-example-drag {
  width: 100%;
  height: 300px;
  overflow: hidden;
  background-color: #f5f5f5;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.timeline-editor-example-drag .timeline-editor {
  width: 100%;
  max-width: 800px;
  height: 300px;
}
```

### Mock Data (`mock.ts`)

```typescript
import { TimelineEffect, TimelineRow } from '@keplar-404/timeline-engine';

export const mockEffect: Record<string, TimelineEffect> = {
  effect0: { id: 'effect0', name: 'Effect 0' },
  effect1: { id: 'effect1', name: 'Effect 1' },
  effect2: { id: 'effect2', name: 'Effect 2' },
};

export const mockData: TimelineRow[] = [
  { id: '0', actions: [{ id: 'action00', start: 0,   end: 2,   effectId: 'effect0' }] },
  { id: '1', actions: [{ id: 'action10', start: 1.5, end: 5,   effectId: 'effect1' }] },
  { id: '2', actions: [{ id: 'action20', start: 3,   end: 4,   effectId: 'effect2' }] },
  { id: '3', actions: [
    { id: 'action30', start: 4,   end: 4.5, effectId: 'effect0' },
    { id: 'action31', start: 6,   end: 8,   effectId: 'effect1' },
  ]},
  { id: '4', actions: [{ id: 'action40', start: 0.5, end: 3,   effectId: 'effect2' }] },
  { id: '5', actions: [
    { id: 'action50', start: 2,   end: 6,   effectId: 'effect0' },
    { id: 'action51', start: 7,   end: 9,   effectId: 'effect1' },
  ]},
  { id: '6', actions: [{ id: 'action60', start: 1,   end: 4,   effectId: 'effect1' }] },
  { id: '7', actions: [
    { id: 'action70', start: 3.5, end: 5.5, effectId: 'effect2' },
    { id: 'action71', start: 8,   end: 10,  effectId: 'effect0' },
  ]},
  { id: '8', actions: [{ id: 'action80', start: 0,   end: 1.5, effectId: 'effect1' }] },
  { id: '9', actions: [{ id: 'action90', start: 5,   end: 8,   effectId: 'effect2' }] },
];
```

---

## Drag-Related Callbacks

A series of callbacks are triggered during the row drag process.

### `onRowDragStart`

Called when the user begins dragging a row.

```typescript
onRowDragStart?: (params: { row: TimelineRow }) => void;
```

### `onRowDragEnd`

Called when the user drops a row into its new position. The updated `editorData` array (with the new row order) is provided — useful for persisting the new order externally.

```typescript
onRowDragEnd?: (params: {
  row: TimelineRow;
  editorData: TimelineRow[];
}) => void;
```

---

## API Reference

| Prop | Description | Type | Default |
|---|---|---|---|
| `enableRowDrag` | Enable drag handle for reordering rows | `boolean` | `false` |
| `onRowDragStart` | Called when a row drag begins | `(params: { row: TimelineRow }) => void` | `--` |
| `onRowDragEnd` | Called when a row is dropped. Receives the updated row order in `editorData` | `(params: { row: TimelineRow; editorData: TimelineRow[] }) => void` | `--` |

> **Tip:** The `editorData` passed to `onRowDragEnd` already reflects the new row order. You can use this directly to update any external state (e.g. a database or parent component) without needing to manually re-sort the array.
