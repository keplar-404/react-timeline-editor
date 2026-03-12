# Custom Style

You can customize the rendering of specific action blocks through the `getActionRender` prop. At the same time, you can override default styles by rewriting CSS, defining class names, etc.

---

## Example

### Component

```tsx
import { Timeline } from '@keplar-404/react-timeline-editor';
import { cloneDeep } from 'lodash';
import React, { useState } from 'react';
import { CustomRender0, CustomRender1 } from './custom';
import './index.css';
import { mockData, mockEffect } from './mock';

const defaultEditorData = cloneDeep(mockData);

const TimelineEditor = () => {
  const [data, setData] = useState(defaultEditorData);

  return (
    <div className="timeline-editor-example2">
      <Timeline
        onChange={setData}
        editorData={data}
        effects={mockEffect}
        hideCursor={false}
        getActionRender={(action, row) => {
          if (action.effectId === 'effect0') {
            return <CustomRender0 action={action} row={row} />;
          } else if (action.effectId === 'effect1') {
            return <CustomRender1 action={action} row={row} />;
          }
        }}
      />
    </div>
  );
};

export default TimelineEditor;
```

### Custom Renderers (`custom.tsx`)

```tsx
import React, { FC } from 'react';
import { TimelineAction, TimelineRow } from '@keplar-404/timeline-engine';

export const CustomRender0: FC<{ action: TimelineAction; row: TimelineRow }> = ({ action }) => {
  return (
    <div className="effect0">
      <div className="effect0-text">
        {`Play Audio: ${(action.end - action.start).toFixed(2)}s`}
      </div>
    </div>
  );
};

export const CustomRender1: FC<{ action: TimelineAction; row: TimelineRow }> = () => {
  return (
    <div className="effect1">
      <img src="/assets/flag.png" alt="flag" />
    </div>
  );
};
```

### Styles (`index.css`)

```css
/* ── Timeline wrapper ─────────────────────────────────────────── */
.timeline-editor-example2 .timeline-editor {
  width: 100%;
  max-width: 800px;
  height: 300px;
}

.timeline-editor-example2 .timeline-editor-action {
  height: 28px !important;
  top: 50%;
  transform: translateY(-50%);
}

/* ── Effect 0 — audio block ───────────────────────────────────── */
.timeline-editor-example2 .timeline-editor-action-effect-effect0 {
  cursor: pointer;
  background-color: #cd9541;
  background-image: url('./soundWave.png');
  background-position: bottom;
  background-repeat: repeat-x;
}

.timeline-editor-example2 .timeline-editor-action-effect-effect0 .effect0 {
  width: 100%;
  height: 100%;
  font-size: 10px;
  color: #fff;
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.timeline-editor-example2 .timeline-editor-action-effect-effect0 .effect0-text {
  margin-left: 4px;
  flex: 1 1 auto;
  text-align: center;
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-direction: column;
  justify-content: center;
}

/* ── Custom stretch handles for effect0 ───────────────────────── */
.timeline-editor-example2
  .timeline-editor-action-effect-effect0
  .timeline-editor-action-left-stretch,
.timeline-editor-example2
  .timeline-editor-action-effect-effect0
  .timeline-editor-action-right-stretch {
  overflow: visible;
}

.timeline-editor-example2
  .timeline-editor-action-effect-effect0
  .timeline-editor-action-left-stretch::after,
.timeline-editor-example2
  .timeline-editor-action-effect-effect0
  .timeline-editor-action-right-stretch::after {
  width: 18px;
  height: 18px;
  transform: rotate(45deg) scale(0.8);
  background: #aabbcc;
  border: none;
}

.timeline-editor-example2
  .timeline-editor-action-effect-effect0
  .timeline-editor-action-left-stretch::after {
  left: -9px;
}

.timeline-editor-example2
  .timeline-editor-action-effect-effect0
  .timeline-editor-action-right-stretch::after {
  right: -9px;
}

/* ── Effect 1 — flag icon ─────────────────────────────────────── */
.timeline-editor-example2 .effect1 {
  width: 25px;
  height: 28px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.timeline-editor-example2 .effect1 img {
  width: 100%;
  height: 100%;
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
      { id: 'action00', start: 0,   end: 2,   effectId: 'effect0' },
    ],
  },
  {
    id: '1',
    actions: [
      { id: 'action10', start: 3,   end: 3,   effectId: 'effect1', flexible: false },
    ],
  },
  {
    id: '2',
    actions: [
      { id: 'action20', start: 2.3, end: 4.6, effectId: 'effect0' },
    ],
  },
  {
    id: '3',
    actions: [
      { id: 'action30', start: 1.5, end: 1.5, effectId: 'effect0' },
    ],
  },
  {
    id: '4',
    actions: [
      { id: 'action40', start: 1,   end: 1,   effectId: 'effect1', flexible: false },
    ],
  },
  {
    id: '5',
    actions: [
      { id: 'action50', start: 1,   end: 3,   effectId: 'effect0' },
    ],
  },
];
```

---

## How It Works

| Technique | How |
|---|---|
| **Custom block content** | Pass `getActionRender` — receives `(action, row)` and returns a `ReactNode` rendered inside the block |
| **Per-effect styling** | The timeline adds a CSS class `timeline-editor-action-effect-{effectId}` to each action element — target it in CSS |
| **Stretch handle appearance** | Override `::after` on `.timeline-editor-action-left-stretch` / `.timeline-editor-action-right-stretch` |
| **Action dimensions** | Override `.timeline-editor-action` height/position to reposition blocks within the row |

> **Tip:** The class `.timeline-editor-action-effect-{effectId}` is automatically applied by the timeline for each action. For `effect0` that becomes `.timeline-editor-action-effect-effect0`, making it straightforward to style each effect type independently.
