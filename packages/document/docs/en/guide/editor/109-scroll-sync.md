---
title: Scroll Sync
---

# Scroll Synchronization

The `<Timeline>` component provides an `onScroll` callback to keep custom sidebars (e.g., track headers) in perfect vertical sync with the timeline tracks.

## Building a Synchronized Layout

```tsx
import { Timeline, TimelineRow } from '@keplar-404/react-timeline-editor';
import React, { useState, useRef } from 'react';

const mockData: TimelineRow[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `track-${i}`,
  actions: [],
}));

export const EditorScrollSync = () => {
  const [data, setData] = useState(mockData);
  const trackHeaderRef = useRef<HTMLDivElement>(null);

  const handleScroll = ({ scrollTop }: { scrollTop: number }) => {
    if (trackHeaderRef.current) {
      trackHeaderRef.current.scrollTop = scrollTop;
    }
  };

  return (
    <div className="editor-layout">
      {/* Side Panel for Track Headers */}
      <div className="track-headers" ref={trackHeaderRef}>
        <div className="track-headers-spacer">
          {data.map((row) => (
            <div key={row.id} className="track-header-item">
              {row.id}
            </div>
          ))}
        </div>
      </div>

      {/* Main Timeline */}
      <div className="timeline-main">
        <Timeline editorData={data} effects={{}} onChange={setData} onScroll={handleScroll} />
      </div>

      <style>{`
        .editor-layout {
          display: flex;
          height: 400px;
          border: 1px solid #333;
        }

        .track-headers {
          width: 150px;
          background: #f0f0f0;
          overflow-y: hidden;
          position: relative;
        }

        /* Offset by the Timeline ruler height */
        .track-headers-spacer {
          margin-top: 32px;
        }

        .track-header-item {
          height: 32px; /* Must match the Timeline rowHeight prop */
          line-height: 32px;
          border-bottom: 1px solid #ccc;
          padding-left: 10px;
          font-size: 12px;
        }

        .timeline-main {
          flex: 1;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};
```

## Using `ref.setScrollTop` (Programmatic)

You can also programmatically scroll the timeline vertically using the `ref` handle:

```tsx
import React, { useRef } from 'react';
import { Timeline, TimelineState } from '@keplar-404/react-timeline-editor';

export const EditorProgrammaticScroll = () => {
  const timelineRef = useRef<TimelineState>(null);

  return (
    <>
      <button onClick={() => timelineRef.current?.setScrollTop(100)}>
        Scroll to 100px
      </button>
      <button onClick={() => timelineRef.current?.setScrollLeft(200)}>
        Scroll right 200px
      </button>
      <Timeline ref={timelineRef} editorData={[]} effects={{}} />
    </>
  );
};
```

> **Note:** The deprecated `scrollTop` prop is still supported but `ref.setScrollTop()` is preferred.
