---
title: Scale Customization
---

# Scale Customization

Control how the timeline's time ruler is displayed and subdivided.

## Scale Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `scale` | `number` | `1` | Duration (in seconds) each scale mark represents |
| `scaleWidth` | `number` | `160` | Display width of a single scale mark (px) |
| `scaleSplitCount` | `number` | `10` | Number of subdivision units for a single scale mark |
| `startLeft` | `number` | `20` | Left padding before the scale starts (px) |
| `minScaleCount` | `number` | `20` | Minimum number of scale marks rendered |
| `maxScaleCount` | `number` | `Infinity` | Maximum number of scale marks rendered |

## Basic Scale Configuration

Set `scale`, `scaleWidth`, and `scaleSplitCount` to control zoom level and ruler appearance.

```tsx
import { Timeline, TimelineRow, TimelineEffect } from '@keplar-404/react-timeline-editor';
import React, { useState } from 'react';

const mockData: TimelineRow[] = [
  {
    id: '0',
    actions: [{ id: 'action00', start: 0, end: 5, effectId: 'effect0' }],
  },
];

const mockEffect: Record<string, TimelineEffect> = {
  effect0: { id: 'effect0', name: 'Effect 0' },
};

export const EditorScaleCustomization = () => {
  const [data, setData] = useState(mockData);
  return (
    <Timeline
      editorData={data}
      effects={mockEffect}
      onChange={(d) => setData(d)}
      scale={5}              // each mark = 5 seconds
      scaleWidth={160}       // each mark is 160px wide
      scaleSplitCount={10}   // 10 subdivisions per mark
      startLeft={20}
    />
  );
};
```

## Custom Scale Renderer

Use `getScaleRender` to replace the default label with any custom React node.

```tsx
export const EditorCustomScale = () => {
  const [data, setData] = useState(mockData);
  return (
    <Timeline
      editorData={data}
      effects={mockEffect}
      onChange={(d) => setData(d)}
      scale={1}
      scaleWidth={160}
      getScaleRender={(scale) => (
        <span style={{ color: '#6366f1', fontWeight: 'bold' }}>
          {`${scale}s`}
        </span>
      )}
    />
  );
};
```

## Dynamic Zoom

You can also let users zoom dynamically by updating `scale` from state:

```tsx
export const EditorDynamicZoom = () => {
  const [data, setData] = useState(mockData);
  const [scale, setScale] = useState(1);

  return (
    <div>
      <label>
        Zoom:{' '}
        <input
          type="range"
          min={0.5}
          max={10}
          step={0.5}
          value={scale}
          onChange={(e) => setScale(Number(e.target.value))}
        />
        {scale}s per mark
      </label>
      <Timeline
        editorData={data}
        effects={mockEffect}
        onChange={(d) => setData(d)}
        scale={scale}
        scaleWidth={160}
      />
    </div>
  );
};
```
