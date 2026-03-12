# Basic Usage

---

## Disable Editing

Disable dragging of all action blocks using the `disableDrag` prop.

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
  const [allow, setAllow] = useState(true);

  return (
    <div className="timeline-editor-example0">
      <label className="toggle-label">
        <input
          type="checkbox"
          checked={allow}
          onChange={(e) => setAllow(e.target.checked)}
        />
        {allow ? 'Enable Editing' : 'Disable Editing'}
      </label>
      <Timeline
        onChange={setData}
        editorData={data}
        effects={mockEffect}
        disableDrag={!allow}
      />
    </div>
  );
};

export default TimelineEditor;
```

### Styles (`index.css`)

```css
.timeline-editor-example0 .timeline-editor {
  width: 100%;
  max-width: 800px;
  height: 300px;
}

.timeline-editor-example0 .timeline-editor-action {
  height: 28px !important;
  top: 50%;
  transform: translateY(-50%);
}

.timeline-editor-example0 .toggle-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
}

.timeline-editor-example0 .toggle-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
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
      {
        id: 'action00',
        start: 0,
        end: 2,
        effectId: 'effect0',
      },
    ],
  },
  {
    id: '1',
    actions: [
      {
        id: 'action10',
        start: 1.5,
        end: 5,
        effectId: 'effect1',
      },
    ],
  },
  {
    id: '2',
    actions: [
      {
        id: 'action20',
        flexible: false,
        movable: false,
        start: 3,
        end: 4,
        effectId: 'effect0',
      },
    ],
  },
  {
    id: '3',
    actions: [
      {
        id: 'action30',
        start: 4,
        end: 4.5,
        effectId: 'effect1',
      },
      {
        id: 'action31',
        start: 6,
        end: 8,
        effectId: 'effect1',
      },
    ],
  },
];
```

> **Note:** Row `"2"` has `flexible: false` and `movable: false` set directly on the action, so that specific block cannot be resized or moved even when editing is enabled globally.

---

---

## Key Props Used

| Prop | Description |
|---|---|
| `disableDrag` | When `true`, prevents all action blocks from being dragged or resized |
| `hideCursor` | When `true`, hides the playback cursor line entirely |
| `onChange` | Receives the updated `TimelineRow[]` array whenever data changes |
| `editorData` | The current timeline row/action data |
| `effects` | Map of all timeline effects referenced by action `effectId` |

---

## Hide Cursor

Toggle the visibility of the playback cursor using the `hideCursor` prop.

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
  const [showCursor, setShowCursor] = useState(false);

  return (
    <div className="timeline-editor-example0">
      <label className="toggle-label">
        <input
          type="checkbox"
          checked={showCursor}
          onChange={(e) => setShowCursor(e.target.checked)}
        />
        {showCursor ? 'Show Cursor' : 'Hide Cursor'}
      </label>
      <Timeline
        onChange={setData}
        editorData={data}
        effects={mockEffect}
        hideCursor={!showCursor}
      />
    </div>
  );
};

export default TimelineEditor;
```

### Styles (`index.css`)

The same styles from [Disable Editing](#disable-editing) apply here — no additional CSS needed.

```css
.timeline-editor-example0 .timeline-editor {
  width: 100%;
  max-width: 800px;
  height: 300px;
}

.timeline-editor-example0 .timeline-editor-action {
  height: 28px !important;
  top: 50%;
  transform: translateY(-50%);
}

.timeline-editor-example0 .toggle-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
}

.timeline-editor-example0 .toggle-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}
```

### Mock Data (`mock.ts`)

The same mock data from [Disable Editing](#disable-editing) is reused here. See that section for the full `mockData` and `mockEffect` definitions.

> **Tip:** `hideCursor` is independent of `disableDrag` — you can hide the cursor while still allowing full drag/resize interaction, or combine both props to create a fully locked-down read-only view.
