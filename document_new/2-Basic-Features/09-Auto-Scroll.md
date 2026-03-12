# Auto Scroll

When dragging an action block, if the mouse moves close to or beyond the edge of the visible timeline view, the timeline can automatically pan/scroll to reveal hidden time.

## Example

Simply set `autoScroll={true}` on the `<Timeline>` component.

```tsx
import { Timeline, TimelineRow, TimelineEffect } from '@keplar-404/react-timeline-editor';
import React, { useState } from 'react';

const mockData: TimelineRow[] = [
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
];

const mockEffect: Record<string, TimelineEffect> = {
  effect0: { id: 'effect0', name: 'Effect 0' },
};

export const EditorAutoScroll = () => {
  const [data, setData] = useState(mockData);

  return (
    <div className="timeline-container">
      <Timeline editorData={data} effects={mockEffect} onChange={setData} autoScroll={true} />
      <style>{`
        .timeline-container { 
            width: 500px; /* Constrain width to see horizontal scrolling easily */
            border: 1px solid #333; 
        }
      `}</style>
    </div>
  );
};
```
