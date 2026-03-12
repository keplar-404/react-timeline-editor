# Scale Customization

Control the visual scale of the timeline ruler using the four scale-related props.

| Prop | Description | Type | Default |
|---|---|---|---|
| `scale` | Single scale mark duration in seconds (`>0`) | `number` | `1` |
| `scaleSplitCount` | Number of subdivided units per scale mark (integer `>0`) | `number` | `10` |
| `scaleWidth` | Display width of a single scale mark (`>0`, unit: px) | `number` | `160` |
| `startLeft` | Distance from the left edge to where the scale starts (`>=0`, unit: px) | `number` | `20` |

---

## Example

### Component

```tsx
import { Timeline } from '@keplar-404/react-timeline-editor';
import { cloneDeep } from 'lodash';
import { useState } from 'react';
import './index.css';
import { mockData, mockEffect } from './mock';

const defaultEditorData = cloneDeep(mockData);

const TimelineEditor = () => {
  const [data, setData] = useState(defaultEditorData);
  const [scale, setScale] = useState(5);
  const [scaleSplitCount, setScaleSplitCount] = useState(10);
  const [scaleWidth, setScaleWidth] = useState(160);
  const [startLeft, setStartLeft] = useState(20);

  const parsePositiveInt = (val: string) => Math.max(1, parseInt(val.replace(/[^\d]/g, ''), 10) || 0);

  return (
    <div className="timeline-editor-example1">
      <div className="timeline-editor-config">
        <div className="timeline-editor-config-item">
          <label>scale:</label>
          <input
            type="number"
            min={1}
            value={scale}
            onChange={(e) => setScale(parsePositiveInt(e.target.value))}
          />
        </div>
        <div className="timeline-editor-config-item">
          <label>scaleSplitCount:</label>
          <input
            type="number"
            min={1}
            value={scaleSplitCount}
            onChange={(e) => setScaleSplitCount(parsePositiveInt(e.target.value))}
          />
        </div>
        <div className="timeline-editor-config-item">
          <label>scaleWidth:</label>
          <input
            type="number"
            min={1}
            value={scaleWidth}
            onChange={(e) => setScaleWidth(parsePositiveInt(e.target.value))}
          />
        </div>
        <div className="timeline-editor-config-item">
          <label>startLeft:</label>
          <input
            type="number"
            min={0}
            value={startLeft}
            onChange={(e) => setStartLeft(parsePositiveInt(e.target.value))}
          />
        </div>
      </div>
      <Timeline
        onChange={setData}
        autoScroll={true}
        editorData={data}
        effects={mockEffect}
        scale={scale}
        startLeft={startLeft}
        scaleSplitCount={scaleSplitCount}
        scaleWidth={scaleWidth}
      />
    </div>
  );
};

export default TimelineEditor;
```

### Styles (`index.css`)

```css
.timeline-editor-example1 .timeline-editor-config {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 10px;
}

.timeline-editor-example1 .timeline-editor-config-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
}

.timeline-editor-example1 .timeline-editor-config-item label {
  font-size: 13px;
  white-space: nowrap;
}

.timeline-editor-example1 .timeline-editor-config-item input {
  width: 72px;
  padding: 3px 6px;
  font-size: 13px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  outline: none;
}

.timeline-editor-example1 .timeline-editor-config-item input:focus {
  border-color: #4096ff;
  box-shadow: 0 0 0 2px rgba(64, 150, 255, 0.2);
}

.timeline-editor-example1 .timeline-editor {
  width: 100%;
  max-width: 800px;
  height: 300px;
}

.timeline-editor-example1 .timeline-editor-action {
  height: 28px !important;
  top: 50%;
  transform: translateY(-50%);
}
```

### Mock Data (`mock.ts`)

```typescript
import { TimelineEffect, TimelineRow } from '@keplar-404/timeline-engine';

export const mockEffect: Record<string, TimelineEffect> = {
  effect0: {
    id: 'effect0',
    name: 'Effect 0',
  },
  effect1: {
    id: 'effect1',
    name: 'Effect 1',
  },
};

export const mockData: TimelineRow[] = [
  {
    id: '0',
    actions: [
      { id: 'action00', start: 0,  end: 2,  effectId: 'effect0' },
    ],
  },
  {
    id: '1',
    actions: [
      { id: 'action10', start: 1.5, end: 5, effectId: 'effect1' },
    ],
  },
  {
    id: '2',
    actions: [
      { id: 'action20', start: 3, end: 4, effectId: 'effect0' },
    ],
  },
  {
    id: '3',
    actions: [
      { id: 'action30', start: 4,  end: 7,  effectId: 'effect1' },
      { id: 'action31', start: 10, end: 12, effectId: 'effect1' },
    ],
  },
];
```

> **Tip:** `autoScroll={true}` is recommended when using large `scaleWidth` or `scale` values, so the timeline automatically scrolls to keep the playback cursor visible.

---

## Custom Scale Style

Use the `getScaleRender` prop to fully replace the default numeric scale labels with any React element — here a `MM:SS` time formatter.

### Component

```tsx
import { Timeline } from '@keplar-404/react-timeline-editor';
import { cloneDeep } from 'lodash';
import React, { useState } from 'react';
import './index.css';
import { mockData, mockEffect } from './mock';

const defaultEditorData = cloneDeep(mockData);

/** Renders a scale value (in seconds) as a MM:SS string */
const CustomScale = ({ scale }: { scale: number }) => {
  const min    = Math.floor(scale / 60);
  const second = String(scale % 60).padStart(2, '0');
  return <>{`${min}:${second}`}</>;
};

const TimelineEditor = () => {
  const [data, setData] = useState(defaultEditorData);

  return (
    <div className="timeline-editor-example1">
      <Timeline
        onChange={setData}
        editorData={data}
        effects={mockEffect}
        scale={10}
        scaleSplitCount={10}
        getScaleRender={(scale) => <CustomScale scale={scale} />}
      />
    </div>
  );
};

export default TimelineEditor;
```

### Styles (`index.css`)

The same styles from the [Scale Customization example](#example) above apply — no additional CSS is needed.

```css
.timeline-editor-example1 .timeline-editor {
  width: 100%;
  max-width: 800px;
  height: 300px;
}

.timeline-editor-example1 .timeline-editor-action {
  height: 28px !important;
  top: 50%;
  transform: translateY(-50%);
}
```

### Mock Data (`mock.ts`)

The same mock data defined in the [Scale Customization example](#example) above is reused here.

> **Tip:** The `scale` value passed to `getScaleRender` is the **time in seconds** represented by that major mark — not the mark index. Use any formatting logic you like: `MM:SS`, milliseconds, frame numbers, etc.
