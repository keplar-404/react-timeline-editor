# Grid Snap

After enabling grid snap, action blocks will snap their movement to the subdivided scale units defined by `scaleSplitCount`.

| Prop | Description | Type | Default |
|---|---|---|---|
| `gridSnap` | Enable snapping to grid intervals during drag/resize | `boolean` | `false` |
| `scaleSplitCount` | Number of grid subdivisions per scale mark | `number` | `10` |

> **How it works:** With `scale={5}` and `scaleSplitCount={10}`, each subdivision is `0.5s` wide. Enabling `gridSnap` forces action edges to snap to those `0.5s` boundaries as you drag.

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
  const [scaleSplitCount, setScaleSplitCount] = useState(10);
  const [gridSnap, setGridSnap] = useState(true);

  return (
    <div className="timeline-editor-example3">
      <div className="timeline-editor-controls">
        <div className="timeline-editor-control-item">
          <label>scaleSplitCount</label>
          <input
            type="number"
            min={1}
            value={scaleSplitCount}
            onChange={(e) => {
              const value = e.target.value.replace(/[^\d]/g, '');
              setScaleSplitCount(Number(value));
            }}
          />
        </div>
        <div className="timeline-editor-control-item">
          <label>gridSnap</label>
          <label className="toggle">
            <input
              type="checkbox"
              checked={gridSnap}
              onChange={(e) => setGridSnap(e.target.checked)}
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>
      <Timeline
        scale={5}
        onChange={setData}
        editorData={data}
        effects={mockEffect}
        gridSnap={gridSnap}
        scaleSplitCount={scaleSplitCount}
      />
    </div>
  );
};

export default TimelineEditor;
```

### Styles (`index.css`)

```css
.timeline-editor-example3 .timeline-editor {
  width: 100%;
  max-width: 800px;
  height: 300px;
}

.timeline-editor-example3 .timeline-editor-action {
  height: 28px !important;
  top: 50%;
  transform: translateY(-50%);
}

/* ── Controls row ─────────────────────────────────────────────── */
.timeline-editor-example3 .timeline-editor-controls {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 10px;
  align-items: center;
}

.timeline-editor-example3 .timeline-editor-control-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.timeline-editor-example3 .timeline-editor-control-item label {
  white-space: nowrap;
}

.timeline-editor-example3 .timeline-editor-control-item input[type="number"] {
  width: 60px;
  padding: 3px 6px;
  font-size: 13px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  outline: none;
}

.timeline-editor-example3 .timeline-editor-control-item input[type="number"]:focus {
  border-color: #4096ff;
  box-shadow: 0 0 0 2px rgba(64, 150, 255, 0.2);
}

/* ── Toggle switch (replaces antd Switch) ─────────────────────── */
.timeline-editor-example3 .toggle {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.timeline-editor-example3 .toggle input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.timeline-editor-example3 .toggle-slider {
  width: 36px;
  height: 20px;
  background: #d9d9d9;
  border-radius: 20px;
  transition: background 0.2s;
}

.timeline-editor-example3 .toggle-slider::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.2s;
}

.timeline-editor-example3 .toggle input:checked + .toggle-slider {
  background: #4096ff;
}

.timeline-editor-example3 .toggle input:checked + .toggle-slider::after {
  transform: translateX(16px);
}
```

### Mock Data (`mock.ts`)

```typescript
import { TimelineEffect, TimelineRow } from '@keplar-404/timeline-engine';

export const mockEffect: Record<string, TimelineEffect> = {
  effect0: { id: 'effect0', name: 'Effect 0' },
  effect1: { id: 'effect1', name: 'Effect 1' },
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
      { id: 'action20', start: 3,  end: 4,  effectId: 'effect0' },
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

---

## Snap Interval Formula

The snap interval (in seconds) is calculated as:

```
snapInterval = scale / scaleSplitCount
```

| `scale` | `scaleSplitCount` | Snap every |
|---|---|---|
| `5` | `10` | `0.5s` |
| `5` | `5` | `1.0s` |
| `1` | `10` | `0.1s` |
| `10` | `4` | `2.5s` |

> **Tip:** Lower `scaleSplitCount` values create coarser snapping (fewer, wider grid divisions). Higher values create finer snapping. Toggle `gridSnap` off to allow free-form dragging at any time.
