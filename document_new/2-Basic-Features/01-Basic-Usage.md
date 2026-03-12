# Basic Usage

> Note: All code examples are simplified and use standard `<style>` CSS to make integration framework-agnostic.

## Standard Timeline Editor

Try dragging the action block to the right; it automatically recognizes infinite scrolling extensions when dragged near the edge.

```tsx
import { Timeline, TimelineRow, TimelineEffect } from '@keplar-404/react-timeline-editor';
import React, { useState } from 'react';

const mockData: TimelineRow[] = [
  {
    id: '0',
    actions: [
      {
        id: 'action00',
        start: 0,
        end: 2,
        effectId: 'effect0',
      },
    ],
  },
];

const mockEffect: Record<string, TimelineEffect> = {
  effect0: { id: 'effect0', name: 'Effect 0' },
};

export const EditorBasic = () => {
  const [data, setData] = useState(mockData);
  return (
    <div className="timeline-container">
      <Timeline editorData={data} effects={mockEffect} onChange={(newData) => setData(newData)} autoScroll={true} />
      <style>{`
        .timeline-container {
          width: 100%;
          border: 1px solid #333;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};
```

## Disable Editing

You can easily disable all dragging and interaction by setting `disableDrag` to `true`.

```tsx
<Timeline disableDrag={true} editorData={data} effects={mockEffect} />
```

## Hide Cursor

Hide the timeline cursor line during playback or standard view by setting `hideCursor` to `true`.

```tsx
<Timeline hideCursor={true} editorData={data} effects={mockEffect} />
```
