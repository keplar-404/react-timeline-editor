---
title: Auto Scroll
---

# Auto Scroll

When dragging an action block near or beyond the visible edge of the timeline, the editor can automatically pan/scroll to reveal hidden time.

## Enabling Auto Scroll

Simply set `autoScroll={true}` on the `<Timeline>` component.

```tsx
import { Timeline, TimelineRow, TimelineEffect } from '@keplar-404/react-timeline-editor';
import React, { useState } from 'react';

const mockData: TimelineRow[] = [
  {
    id: '0',
    actions: [
      { id: 'action00', start: 0, end: 2, effectId: 'effect0' },
    ],
  },
];

const mockEffect: Record<string, TimelineEffect> = {
  effect0: { id: 'effect0', name: 'Effect 0' },
};

export const EditorAutoScroll = () => {
  const [data, setData] = useState(mockData);

  return (
    <div className="timeline-container">
      <Timeline
        editorData={data}
        effects={mockEffect}
        onChange={setData}
        autoScroll={true}
      />
      <style>{`
        .timeline-container {
          width: 500px; /* Constrain width to see auto-scroll in action */
          border: 1px solid #333;
        }
      `}</style>
    </div>
  );
};
```

## Auto Scroll During Playback

You can also auto-scroll during playback by listening to `setTimeByTick` events from the engine and calling `setScrollLeft` on the ref:

```tsx
import React, { useRef, useEffect } from 'react';
import { Timeline, TimelineState } from '@keplar-404/react-timeline-editor';

export const EditorAutoScrollPlayback = () => {
  const timelineRef = useRef<TimelineState>(null);
  const scale = 1;
  const scaleWidth = 160;
  const startLeft = 20;

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    timeline.listener.on('setTimeByTick', ({ time }) => {
      // Keep the cursor centered in the visible area
      const left = time * (scaleWidth / scale) + startLeft - 500;
      timeline.setScrollLeft(Math.max(0, left));
    });
  }, []);

  return (
    <>
      <button onClick={() => timelineRef.current?.play({ autoEnd: true })}>▶ Play</button>
      <Timeline
        ref={timelineRef}
        editorData={[]}
        effects={{}}
        scale={scale}
        scaleWidth={scaleWidth}
        startLeft={startLeft}
      />
    </>
  );
};
```
