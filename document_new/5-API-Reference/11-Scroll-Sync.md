# Scroll Sync

You can build lists, track panels, or any other structure alongside the timeline and synchronize vertical scrolling between them using the `ref` handle and the `onScroll` callback.

---

## How It Works

Two things are wired together:
1. **External list → Timeline:** When the external list scrolls, call `timelineRef.current.setScrollTop(scrollTop)` to push the scroll position into the timeline.
2. **Timeline → External list:** When the timeline scrolls (via `onScroll`), set `externalRef.current.scrollTop = scrollTop` to mirror it back.

---

## Example

### Component

```tsx
import { Timeline, TimelineState } from '@keplar-404/react-timeline-editor';
import { cloneDeep } from 'lodash';
import React, { useRef, useState } from 'react';
import './index.css';
import { mockData, mockEffect } from './mock';

const defaultEditorData = cloneDeep(mockData);

const TimelineEditor = () => {
  const [data, setData] = useState(defaultEditorData);
  const domRef = useRef<HTMLDivElement>(null);
  const timelineState = useRef<TimelineState>(null);

  return (
    <div className="timeline-editor-example7">
      {/* External scrollable row list */}
      <div
        ref={domRef}
        className="timeline-list"
        onScroll={(e) => {
          const target = e.target as HTMLDivElement;
          timelineState.current?.setScrollTop(target.scrollTop);
        }}
      >
        {data.map((item) => (
          <div className="timeline-list-item" key={item.id}>
            <div className="text">{`row ${item.id}`}</div>
          </div>
        ))}
      </div>

      {/* Timeline — mirrors scroll back to the list */}
      <Timeline
        ref={timelineState}
        onChange={setData}
        editorData={data}
        effects={mockEffect}
        onScroll={({ scrollTop }) => {
          if (domRef.current) domRef.current.scrollTop = scrollTop;
        }}
      />
    </div>
  );
};

export default TimelineEditor;
```

### Styles (`index.css`)

```css
/* ── Outer wrapper ─────────────────────────────────────────────── */
.timeline-editor-example7 {
  display: flex;
  width: 800px;
  background-color: #191b1d;
}

/* ── External row list ─────────────────────────────────────────── */
.timeline-editor-example7 .timeline-list {
  width: 150px;
  margin-top: 42px;   /* aligns with the timeline rows, below the time ruler */
  height: 258px;
  flex: 0 1 auto;
  overflow-y: auto;
  padding: 0 10px;
}

.timeline-editor-example7 .timeline-list-item {
  height: 32px;
  padding: 2px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.timeline-editor-example7 .timeline-list-item .text {
  color: #fff;
  height: 28px;
  width: 100%;
  padding-left: 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  background-color: #333;
}

/* ── Timeline ──────────────────────────────────────────────────── */
.timeline-editor-example7 .timeline-editor {
  height: 300px;
  flex: 1 1 auto;
}

.timeline-editor-example7 .timeline-editor-action {
  height: 28px !important;
  top: 50%;
  transform: translateY(-50%);
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
  { id: '0',  actions: [{ id: 'action00',  start: 0,   end: 2,  effectId: 'effect0' }] },
  { id: '1',  actions: [{ id: 'action10',  start: 1.5, end: 5,  effectId: 'effect1' }] },
  { id: '2',  actions: [{ id: 'action20',  start: 1,   end: 4,  effectId: 'effect0' }] },
  { id: '3',  actions: [
    { id: 'action30',  start: 0.5, end: 7,  effectId: 'effect1' },
    { id: 'action31',  start: 10,  end: 12, effectId: 'effect1' },
  ]},
  { id: '4',  actions: [{ id: 'action40',  start: 1,   end: 2,  effectId: 'effect0' }] },
  { id: '5',  actions: [{ id: 'action50',  start: 2.5, end: 6,  effectId: 'effect1' }] },
  { id: '6',  actions: [{ id: 'action60',  start: 3,   end: 4,  effectId: 'effect0' }] },
  { id: '7',  actions: [{ id: 'action70',  start: 2,   end: 4,  effectId: 'effect1' }] },
  { id: '8',  actions: [{ id: 'action80',  start: 0,   end: 2,  effectId: 'effect0' }] },
  { id: '9',  actions: [{ id: 'action90',  start: 1.5, end: 2,  effectId: 'effect1' }] },
  { id: '10', actions: [{ id: 'action100', start: 3,   end: 4,  effectId: 'effect0' }] },
  { id: '11', actions: [{ id: 'action110', start: 1,   end: 3,  effectId: 'effect1' }] },
  { id: '12', actions: [{ id: 'action120', start: 0,   end: 2,  effectId: 'effect0' }] },
  { id: '13', actions: [{ id: 'action130', start: 1.5, end: 3,  effectId: 'effect1' }] },
  { id: '14', actions: [{ id: 'action140', start: 0,   end: 1,  effectId: 'effect0' }] },
  { id: '15', actions: [{ id: 'action150', start: 1,   end: 2,  effectId: 'effect1' }] },
];
```

---

## Key API Used

| API | Type | Description |
|---|---|---|
| `ref` on `<Timeline>` | `Ref<TimelineState>` | Gives imperative access to `setScrollTop`, `setScrollLeft`, etc. |
| `timelineState.current.setScrollTop(val)` | `(val: number) => void` | Programmatically set the timeline's vertical scroll offset |
| `onScroll` prop | `(params: { scrollTop: number }) => void` | Called whenever the timeline's edit area is scrolled |

> **Tip:** The `margin-top: 42px` on `.timeline-list` offsets the list to align with the first data row — below the time ruler header rendered by the `<Timeline>` component. Adjust this value if you change the timeline's time ruler height.
