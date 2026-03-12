# Auto Scroll

When `autoScroll` is enabled and the user drags an action block beyond the visible edge of the timeline, the timeline will automatically scroll to follow the cursor.

| Prop | Description | Type | Default |
|---|---|---|---|
| `autoScroll` | Enable auto-scroll during drag operations | `boolean` | `false` |

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
  const [autoScroll, setAutoScroll] = useState(true);

  return (
    <div className="timeline-editor-example9">
      <label className="toggle" style={{ marginBottom: 20 }}>
        <input
          type="checkbox"
          checked={autoScroll}
          onChange={(e) => setAutoScroll(e.target.checked)}
        />
        <span className="toggle-slider" />
        <span className="toggle-label">
          {autoScroll ? 'Enable Auto Scroll' : 'Disable Auto Scroll'}
        </span>
      </label>
      <Timeline
        onChange={setData}
        editorData={data}
        effects={mockEffect}
        autoScroll={autoScroll}
      />
    </div>
  );
};

export default TimelineEditor;
```

### Styles (`index.css`)

```css
.timeline-editor-example9 .timeline-editor {
  width: 100%;
  max-width: 800px;
  height: 300px;
}

.timeline-editor-example9 .timeline-editor-action {
  height: 28px !important;
  top: 50%;
  transform: translateY(-50%);
}

/* ── Toggle switch ────────────────────────────────────────────── */
.timeline-editor-example9 .toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.timeline-editor-example9 .toggle input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.timeline-editor-example9 .toggle-slider {
  position: relative;
  width: 36px;
  height: 20px;
  background: #d9d9d9;
  border-radius: 20px;
  flex-shrink: 0;
  transition: background 0.2s;
}

.timeline-editor-example9 .toggle-slider::after {
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

.timeline-editor-example9 .toggle input:checked + .toggle-slider {
  background: #4096ff;
}

.timeline-editor-example9 .toggle input:checked + .toggle-slider::after {
  transform: translateX(16px);
}

.timeline-editor-example9 .toggle-label {
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
      { id: 'action00', start: 0, end: 2, effectId: 'effect0' },
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
      { id: 'action30', start: 4,   end: 4.5, effectId: 'effect1' },
      { id: 'action31', start: 6,   end: 8,   effectId: 'effect1' },
    ],
  },
];
```

---

> **Tip:** `autoScroll` pairs well with `gridSnap` and `dragLine` — enabling all three gives users a smooth drag experience where blocks snap cleanly while the view follows them automatically.
