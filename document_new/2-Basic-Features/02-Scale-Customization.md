# Scale Customization

The timeline scale (the ruler at the top) is highly customizable, allowing you to build zoom controls.

## Basic Scale Example

```tsx
import { Timeline, TimelineRow, TimelineEffect } from '@keplar-404/react-timeline-editor';
import React, { useState } from 'react';

const mockData: TimelineRow[] = [{ id: '0', actions: [] }];
const mockEffect: Record<string, TimelineEffect> = {};

export const EditorScale = () => {
  const [scale, setScale] = useState(5);
  const [scaleWidth, setScaleWidth] = useState(160);
  const [scaleSplitCount, setScaleSplitCount] = useState(10);

  return (
    <div className="timeline-container">
      <div className="controls">
        <label>
          Scale (Zoom): {scale}
          <input type="range" min="1" max="10" step="1" value={scale} onChange={(e) => setScale(Number(e.target.value))} />
        </label>
        <label>
          Scale Width (px): {scaleWidth}
          <input type="range" min="50" max="300" step="10" value={scaleWidth} onChange={(e) => setScaleWidth(Number(e.target.value))} />
        </label>
      </div>

      <Timeline scale={scale} scaleWidth={scaleWidth} scaleSplitCount={scaleSplitCount} editorData={mockData} effects={mockEffect} />

      <style>{`
        .timeline-container { border: 1px solid #333; }
        .controls { display: flex; gap: 20px; padding: 10px; background: #fafafa; border-bottom: 1px solid #333;}
        .controls label { display: flex; flex-direction: column; font-size: 14px;}
      `}</style>
    </div>
  );
};
```

This controls how wide each tick mark is and how much "time" (in seconds) that width represents.
