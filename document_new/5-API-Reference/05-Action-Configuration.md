# Action Configuration

## `movable` & `flexible`

Control whether individual action blocks can be **moved** or **resized** via the `movable` and `flexible` properties on each `TimelineAction`.

| Property | Description | Type | Default |
|---|---|---|---|
| `movable` | Whether the action block can be dragged horizontally | `boolean` | `true` |
| `flexible` | Whether the action block can be resized (stretched) | `boolean` | `true` |

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
    <div className="timeline-editor-example8">
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
        {action.movable  === false && ' (Cannot Move)'}
        {action.flexible === false && ' (Cannot Scale)'}
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
.timeline-editor-example8 .timeline-editor {
  width: 100%;
  max-width: 800px;
  height: 300px;
}

.timeline-editor-example8 .timeline-editor-action {
  height: 28px !important;
  top: 50%;
  transform: translateY(-50%);
}

/* ── Effect 0 — audio block ───────────────────────────────────── */
.timeline-editor-example8 .timeline-editor-action-effect-effect0 {
  cursor: pointer;
  background-color: #cd9541;
  background-image: url('./soundWave.png');
  background-position: bottom;
  background-repeat: repeat-x;
}

.timeline-editor-example8 .timeline-editor-action-effect-effect0 .effect0 {
  width: 100%;
  height: 100%;
  font-size: 10px;
  color: #fff;
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.timeline-editor-example8 .timeline-editor-action-effect-effect0 .effect0-text {
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

/* ── Stretch handles for effect0 ──────────────────────────────── */
.timeline-editor-example8
  .timeline-editor-action-effect-effect0
  .timeline-editor-action-left-stretch,
.timeline-editor-example8
  .timeline-editor-action-effect-effect0
  .timeline-editor-action-right-stretch {
  overflow: visible;
}

.timeline-editor-example8
  .timeline-editor-action-effect-effect0
  .timeline-editor-action-left-stretch::after,
.timeline-editor-example8
  .timeline-editor-action-effect-effect0
  .timeline-editor-action-right-stretch::after {
  width: 18px;
  height: 18px;
  transform: rotate(45deg) scale(0.8);
  background: #aabbcc;
  border: none;
}

.timeline-editor-example8
  .timeline-editor-action-effect-effect0
  .timeline-editor-action-left-stretch::after {
  left: -9px;
}

.timeline-editor-example8
  .timeline-editor-action-effect-effect0
  .timeline-editor-action-right-stretch::after {
  right: -9px;
}

/* ── Effect 1 — flag icon ─────────────────────────────────────── */
.timeline-editor-example8 .effect1 {
  width: 25px;
  height: 28px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.timeline-editor-example8 .effect1 img {
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
      { id: 'action00', start: 0, end: 2, effectId: 'effect0' },
    ],
  },
  {
    id: '1',
    actions: [
      // flexible: false — cannot be resized
      { id: 'action10', start: 3, end: 3, flexible: false, effectId: 'effect1' },
    ],
  },
  {
    id: '2',
    actions: [
      // flexible: false — cannot be resized
      { id: 'action20', start: 2.3, end: 4.6, flexible: false, effectId: 'effect0' },
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
      { id: 'action40', start: 1, end: 1, flexible: false, effectId: 'effect1' },
    ],
  },
  {
    id: '5',
    actions: [
      // movable: false — cannot be moved
      { id: 'action50', start: 1, end: 3, movable: false, effectId: 'effect0' },
    ],
  },
];
```

---

## How It Works

| Action | `movable` | `flexible` | Behaviour |
|---|---|---|---|
| `action00` | `true` (default) | `true` (default) | Fully draggable and resizable |
| `action10` | `true` | `false` | Can be moved, **cannot** be resized |
| `action20` | `true` | `false` | Can be moved, **cannot** be resized |
| `action50` | `false` | `true` | **Cannot** be moved, can be resized |

> **Tip:** Both flags default to `true`. You only need to set them explicitly when you want to restrict interaction on specific blocks. The `CustomRender0` component reads these flags at render-time to display a label like `(Cannot Move)` or `(Cannot Scale)`.

---

## `minStart` & `maxEnd`

Control the **movement range** of action blocks by setting hard time boundaries with `minStart` and `maxEnd` on each `TimelineAction`.

| Property | Description | Type | Default |
|---|---|---|---|
| `minStart` | The earliest time the action's start can be dragged to | `number` | `0` |
| `maxEnd` | The latest time the action's end can be dragged to | `number` | `Number.MAX_VALUE` |

When a user drags or resizes an action block the timeline clamps the position so that:
- `action.start` never goes below `minStart`
- `action.end` never goes above `maxEnd`

### Component

```tsx
import { Timeline } from '@keplar-404/react-timeline-editor';
import { cloneDeep } from 'lodash';
import React, { useState } from 'react';
import { CustomRender0 } from './custom2';
import './index.css';
import { mockData, mockEffect } from './mock2';

const defaultEditorData = cloneDeep(mockData);

const TimelineEditor = () => {
  const [data, setData] = useState(defaultEditorData);

  return (
    <div className="timeline-editor-example8">
      <Timeline
        onChange={setData}
        editorData={data}
        effects={mockEffect}
        hideCursor={false}
        getActionRender={(action, row) => <CustomRender0 action={action} row={row} />}
      />
    </div>
  );
};

export default TimelineEditor;
```

### Custom Renderer (`custom2.tsx`)

The renderer reads `minStart` and `maxEnd` directly off the action and displays them as labels inside the block.

```tsx
import React, { FC } from 'react';
import { TimelineAction, TimelineRow } from '@keplar-404/timeline-engine';

export const CustomRender0: FC<{ action: TimelineAction; row: TimelineRow }> = ({ action }) => {
  return (
    <div className="effect0">
      <div className="effect0-text">
        {typeof action.minStart === 'number' ? `minStart: ${action.minStart}` : ''}
        {' '}
        {typeof action.maxEnd === 'number' ? `maxEnd: ${action.maxEnd}` : ''}
      </div>
    </div>
  );
};
```

### Styles (`index.css`)

```css
.timeline-editor-example8 .timeline-editor {
  width: 100%;
  max-width: 800px;
  height: 300px;
}

.timeline-editor-example8 .timeline-editor-action {
  height: 28px !important;
  top: 50%;
  transform: translateY(-50%);
}

.timeline-editor-example8 .timeline-editor-action-effect-effect0 {
  cursor: pointer;
  background-color: #cd9541;
  background-image: url('./soundWave.png');
  background-position: bottom;
  background-repeat: repeat-x;
}

.timeline-editor-example8 .timeline-editor-action-effect-effect0 .effect0 {
  width: 100%;
  height: 100%;
  font-size: 10px;
  color: #fff;
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.timeline-editor-example8 .timeline-editor-action-effect-effect0 .effect0-text {
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

.timeline-editor-example8
  .timeline-editor-action-effect-effect0
  .timeline-editor-action-left-stretch,
.timeline-editor-example8
  .timeline-editor-action-effect-effect0
  .timeline-editor-action-right-stretch {
  overflow: visible;
}

.timeline-editor-example8
  .timeline-editor-action-effect-effect0
  .timeline-editor-action-left-stretch::after,
.timeline-editor-example8
  .timeline-editor-action-effect-effect0
  .timeline-editor-action-right-stretch::after {
  width: 18px;
  height: 18px;
  transform: rotate(45deg) scale(0.8);
  background: #aabbcc;
  border: none;
}

.timeline-editor-example8
  .timeline-editor-action-effect-effect0
  .timeline-editor-action-left-stretch::after {
  left: -9px;
}

.timeline-editor-example8
  .timeline-editor-action-effect-effect0
  .timeline-editor-action-right-stretch::after {
  right: -9px;
}
```

### Mock Data (`mock2.ts`)

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
      {
        id: 'action00',
        start: 0,
        end: 1,
        effectId: 'effect0',
        maxEnd: 3,             // cannot stretch or drag past 3s
      },
    ],
  },
  {
    id: '2',
    actions: [
      {
        id: 'action20',
        start: 2.3,
        end: 3.2,
        effectId: 'effect0',
        minStart: 1,           // cannot move/resize earlier than 1s
        maxEnd: 4,             // cannot move/resize past 4s
      },
    ],
  },
  {
    id: '5',
    actions: [
      {
        id: 'action50',
        start: 3,
        end: 5,
        effectId: 'effect0',
        minStart: 2,           // cannot move/resize earlier than 2s
      },
    ],
  },
];
```

### Behaviour Summary

| Action | `minStart` | `maxEnd` | Constraint |
|---|---|---|---|
| `action00` | `0` (default) | `3` | Free to move left, but cannot go past `3s` |
| `action20` | `1` | `4` | Locked within the `1s – 4s` window |
| `action50` | `2` | `∞` (default) | Cannot be moved or resized before `2s` |

> **Tip:** `minStart` and `maxEnd` apply to both **drag** and **resize**. The `CustomRender0` renderer displays these values directly inside each block so you can clearly see the constraints in action.
