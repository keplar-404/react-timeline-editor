---
title: Custom Block Preview
---

# Custom Block Preview (Ghost Preview)

When a user drags a block across different rows (using `enableCrossRowDrag`), the editor displays a "Ghost Preview" that follows the mouse cursor.

By default, this preview is a generic blue glowing box. You can use the `getGhostPreview` prop to render a fully custom React node that matches your block's actual appearance.

## Basic Example

Return a custom JSX structure from `getGhostPreview`. You receive the `action` and `row` being dragged.

```tsx
import { Timeline, TimelineRow } from '@keplar-404/react-timeline-editor';
import React, { useState } from 'react';

const mockData: TimelineRow[] = [
  {
    id: 'track-1',
    actions: [{ id: 'action-1', start: 0, end: 2, effectId: 'effect0' }],
  },
  {
    id: 'track-2',
    actions: [],
  },
];

export const EditorCustomGhost = () => {
  const [data, setData] = useState(mockData);

  const renderBlockContent = (actionId: string) => (
    <div className="custom-block">
      <span>Dragging: {actionId}</span>
    </div>
  );

  return (
    <div className="timeline-container">
      <Timeline
        editorData={data}
        effects={{}}
        onChange={setData}
        enableCrossRowDrag={true}
        // Render the real block AND the ghost from the same function
        getActionRender={(action) => renderBlockContent(action.id)}
        getGhostPreview={({ action }) => renderBlockContent(action.id)}
      />

      <style>{`
        .timeline-container { width: 100%; border: 1px solid #333; }

        .custom-block {
          background-color: #cd9541;
          border-radius: 4px;
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          padding-left: 8px;
          color: white;
          font-size: 12px;
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};
```

## How It Works

The ghost preview is a `<div>` wrapper maintained internally by the editor:

- When `getGhostPreview` is **not provided**, the wrapper gets a blue glassmorphism glow style.
- When `getGhostPreview` **is provided**, the wrapper strips its generic styling (applies `overflow: hidden; opacity: 0.85;`) and lets your custom JSX dictate the appearance.

## Disabling the Ghost Entirely

Pass `enableGhostPreview={false}` to suppress the ghost preview entirely:

```tsx
<Timeline
  enableCrossRowDrag={true}
  enableGhostPreview={false}
  // ...
/>
```

## Props Reference

| Prop | Type | Default | Description |
|---|---|---|---|
| `enableCrossRowDrag` | `boolean` | `false` | Required: enables cross-row drag functionality |
| `enableGhostPreview` | `boolean` | `true` | Whether to show the ghost preview |
| `getGhostPreview` | `({ action, row }) => ReactNode` | blue glow box | Custom ghost renderer |
