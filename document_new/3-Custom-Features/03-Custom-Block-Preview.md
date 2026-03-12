# Custom Block Preview (Ghost Preview)

When a user drags a block across different rows (using `enableCrossRowDrag`), the editor displays a "Ghost Preview" that follows the mouse cursor.

By default, this preview is a generic blue glowing box. However, you can use the `getGhostPreview` prop to render a React node that completely matches the exact appearance of your block.

## Custom Ghost Preview Concept

Return a custom JSX structure from `getGhostPreview`. The `<Timeline>` provides you with the `action` and the source `row` being dragged.

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

  // Render the exact same content for the Ghost as the actual block
  const renderBlockContent = (actionId: string) => {
    return (
      <div className="custom-block">
        <span>Dragging: {actionId}</span>
      </div>
    );
  };

  return (
    <div className="timeline-container">
      <Timeline
        editorData={data}
        effects={{}}
        onChange={setData}
        enableCrossRowDrag={true}
        // 1. Render the real block
        getActionRender={(action, row) => renderBlockContent(action.id)}
        // 2. Render the ghost block
        getGhostPreview={({ action, row }) => renderBlockContent(action.id)}
      />

      <style>{`
        .timeline-container { width: 100%; border: 1px solid #333; }
        
        .custom-block {
          background-color: #cd9541;
          border-radius: 4px;
          height: 100%;  /* Must fill the wrapper */
          width: 100%;   /* Must fill the wrapper */
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

## How It Works Under The Hood

The Ghost preview wrapper `div` is maintained by the `@keplar-404/react-timeline-editor`.

- When `getGhostPreview` is omitted, the wrapper falls back to a `<div />` with inline styles for a blue glassmorphism effect.
- When `getGhostPreview` is provided, the wrapper strips its generic styling (giving it `overflow: hidden; opacity: 0.85;`) and lets your custom JSX dictate the background, borders, and content.
