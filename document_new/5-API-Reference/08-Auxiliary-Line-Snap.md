# Auxiliary Line Snap

After enabling auxiliary line snap, moving an action block near the edges of other actions or the cursor will automatically snap to those positions.

| Prop | Description | Type | Default |
|---|---|---|---|
| `dragLine` | Enable auxiliary line snapping during drag/resize | `boolean` | `false` |

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
  const [dragLine, setDragLine] = useState(true);

  return (
    <div className="timeline-editor-example4">
      <label className="toggle" style={{ marginBottom: 12 }}>
        <input
          type="checkbox"
          checked={dragLine}
          onChange={(e) => setDragLine(e.target.checked)}
        />
        <span className="toggle-slider" />
        <span className="toggle-label">
          {dragLine ? 'Enable Auxiliary Line' : 'Disable Auxiliary Line'}
        </span>
      </label>
      <Timeline
        scale={5}
        onChange={setData}
        editorData={data}
        effects={mockEffect}
        dragLine={dragLine}
      />
    </div>
  );
};

export default TimelineEditor;
```

### Styles (`index.css`)

```css
.timeline-editor-example4 .timeline-editor {
  width: 100%;
  max-width: 800px;
  height: 300px;
}

.timeline-editor-example4 .timeline-editor-action {
  height: 28px !important;
  top: 50%;
  transform: translateY(-50%);
}

/* ── Toggle switch ────────────────────────────────────────────── */
.timeline-editor-example4 .toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-bottom: 12px;
}

.timeline-editor-example4 .toggle input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.timeline-editor-example4 .toggle-slider {
  position: relative;
  width: 36px;
  height: 20px;
  background: #d9d9d9;
  border-radius: 20px;
  flex-shrink: 0;
  transition: background 0.2s;
}

.timeline-editor-example4 .toggle-slider::after {
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

.timeline-editor-example4 .toggle input:checked + .toggle-slider {
  background: #4096ff;
}

.timeline-editor-example4 .toggle input:checked + .toggle-slider::after {
  transform: translateX(16px);
}

.timeline-editor-example4 .toggle-label {
  font-size: 13px;
  user-select: none;
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

## How It Works

When `dragLine` is `true` and you drag an action block, the timeline:

1. Calculates the start and end times of all other visible action blocks as snap targets
2. Also uses the current cursor position as a snap target
3. When the edge of the dragged block gets close to any of those targets, it **snaps** to that position

> **Tip:** `dragLine` and `gridSnap` can be used together. `gridSnap` snaps to fixed grid intervals, while `dragLine` snaps to the edges of other actions — they complement each other for precise editing.
