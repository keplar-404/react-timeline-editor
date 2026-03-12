# Loop Zone Overlay

The `LoopZoneOverlay` is a visual indicator and interation layer that renders a draggable repeat region on top of your timeline.

## Usage

Like the `CutOverlay`, this component is mounted as a sibling to the `<Timeline>` and requires geometry props to match.

```tsx
import React, { useState } from 'react';
import { Timeline, LoopZoneOverlay } from '@keplar-404/react-timeline-editor';

export const EditorLoopZone = () => {
  const [loopOn, setLoopOn] = useState(true);
  const [loopStart, setLoopStart] = useState(2);
  const [loopEnd, setLoopEnd] = useState(8);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Geometry must match between components
  const scale = 1;
  const scaleWidth = 160;
  const startLeft = 20;

  return (
    <div style={{ position: 'relative' }}>
      <Timeline
        scale={scale}
        scaleWidth={scaleWidth}
        startLeft={startLeft}
        onScroll={(p) => setScrollLeft(p.scrollLeft)}
        // ... rest of props
      />

      {loopOn && (
        <LoopZoneOverlay
          scale={scale}
          scaleWidth={scaleWidth}
          startLeft={startLeft}
          scrollLeft={scrollLeft}
          loopStart={loopStart}
          loopEnd={loopEnd}
          onLoopStartChange={setLoopStart}
          onLoopEndChange={setLoopEnd}
          config={{
            bandColor: '#10b981',
            bandOpacity: 0.1,
            showBoundaryLines: true,
          }}
        />
      )}
    </div>
  );
};
```

## Features

- **Draggable Handles**: Users can drag the edges of the loop zone to resize it.
- **Custom Shading**: Highlight the repeat region with any CSS color.
- **Boundary Lines**: Dashed vertical lines help align action blocks within the loop content.
- **Custom Handles**: Use the `renderHandle` prop to return your own React nodes for the drag handles.
