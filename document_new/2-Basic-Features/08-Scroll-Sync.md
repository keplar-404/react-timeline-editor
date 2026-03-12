# Scroll Sync

The `<Timeline>` component provides an `onScroll` callback that returns `OnScrollParams` (`scrollTop`, `scrollHeight`, `clientHeight`). You can use this to keep custom sidebars (like track headers) perfectly in sync with the vertical scroll position of the timeline tracks.

## Basic Layout Setup

```tsx
import { Timeline, TimelineRow, TimelineEffect } from '@keplar-404/react-timeline-editor';
import React, { useState, useRef } from 'react';

const mockData: TimelineRow[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `track-${i}`,
  actions: [],
}));

export const EditorScrollSync = () => {
  const [data, setData] = useState(mockData);
  const trackHeaderRef = useRef<HTMLDivElement>(null);

  // When the timeline scrolls vertically, pan the sidebar tracks block
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
          overflow-y: hidden; /* Hide scrollbar, handled by sync */
          position: relative;
        }
        
        /* Needs top margin equal to the Timeline Ruler height */
        .track-headers-spacer {
          margin-top: 32px; 
        }

        .track-header-item {
          height: 32px; /* Must perfectly match Timeline rowHeight prop */
          line-height: 32px;
          border-bottom: 1px solid #ccc;
          padding-left: 10px;
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
