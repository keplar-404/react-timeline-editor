# Custom Styles

You can customize the appearance of actions entirely by overriding CSS classes or by passing a custom React node to the `getActionRender` prop.

> Note: `@keplar-404/react-timeline-editor` embraces standard CSS.

## Overriding with `getActionRender` and CSS

In this example, we check the `effectId` and return completely custom blocks, styling them using an external plain `.css` file.

```tsx
import React, { useState } from 'react';
import { Timeline, TimelineRow, TimelineEffect } from '@keplar-404/react-timeline-editor';
import './custom-timeline.css';

const mockEffect: Record<string, TimelineEffect> = {
  effect0: { id: 'effect0', name: 'Audio Effect' },
  effect1: { id: 'effect1', name: 'Marker Effect' },
};

const mockData: TimelineRow[] = [
  {
    id: 'track-1',
    actions: [
      { id: 'action-0', start: 0, end: 2, effectId: 'effect0' },
      { id: 'action-1', start: 3, end: 4, effectId: 'effect1' },
    ],
  },
];

export const EditorCustomStyle = () => {
  const [data, setData] = useState(mockData);

  return (
    <div className="custom-editor-wrapper">
      <Timeline
        editorData={data}
        effects={mockEffect}
        onChange={setData}
        getActionRender={(action, row) => {
          if (action.effectId === 'effect0') {
            return (
              <div className="custom-effect-audio">
                <span className="effect-text">{action.id}</span>
              </div>
            );
          } else if (action.effectId === 'effect1') {
            return (
              <div className="custom-effect-marker">
                <img src="/assets/flag.png" alt="marker" />
              </div>
            );
          }
        }}
      />
    </div>
  );
};
```

### The Equivalent Pure CSS

Instead of LESS, you simply use standard CSS selectors to override the internal classes (`timeline-editor-action-left-stretch` etc.).

```css
/* custom-timeline.css */

.custom-editor-wrapper .timeline-editor {
  width: 100%;
  max-width: 800px;
  height: 300px;
}

/* Override the default action wrapper height */
.custom-editor-wrapper .timeline-editor-action {
  height: 28px !important;
  top: 50%;
  transform: translateY(-50%);
}

/* Custom Audio Effect background */
.custom-effect-audio {
  width: 100%;
  height: 100%;
  background-color: #cd9541;
  background-image: url('/assets/soundWave.png');
  background-position: bottom;
  background-repeat: repeat-x;
  border-radius: 4px;
  display: flex;
  align-items: center;
  color: white;
  font-size: 10px;
}

.custom-effect-audio .effect-text {
  margin-left: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Targeting the specific left/right stretch handles built-into the Timeline */
.custom-editor-wrapper .timeline-editor-action-left-stretch::after,
.custom-editor-wrapper .timeline-editor-action-right-stretch::after {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  transform: rotate(45deg) scale(0.8);
  background: #aabbcc;
  border: none;
}

.custom-editor-wrapper .timeline-editor-action-left-stretch::after {
  left: -9px;
}

.custom-editor-wrapper .timeline-editor-action-right-stretch::after {
  right: -9px;
}

/* Custom Marker Effect */
.custom-effect-marker {
  width: 25px;
  height: 28px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.custom-effect-marker img {
  width: 100%;
  height: 100%;
}
```
