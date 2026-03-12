---
title: Custom Style
---

# Custom Styles

Customize the appearance of action blocks using `getActionRender` and plain CSS overrides.

> `@keplar-404/react-timeline-editor` uses standard CSS — no preprocessor required.

## Using `getActionRender` with CSS

Return custom React nodes from `getActionRender` and style them with a plain `.css` file.

```tsx
import React, { useState } from 'react';
import { Timeline, TimelineRow, TimelineEffect } from '@keplar-404/react-timeline-editor';

const mockEffect: Record<string, TimelineEffect> = {
  effect0: { id: 'effect0', name: 'Audio Effect' },
  effect1: { id: 'effect1', name: 'Video Effect' },
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
        getActionRender={(action) => {
          if (action.effectId === 'effect0') {
            return (
              <div className="custom-effect-audio">
                <span className="effect-text">{action.id}</span>
              </div>
            );
          } else if (action.effectId === 'effect1') {
            return <div className="custom-effect-video" />;
          }
        }}
      />

      <style>{`
        .custom-editor-wrapper .timeline-editor {
          width: 100%;
          height: 300px;
        }

        /* Override action wrapper height and centering */
        .custom-editor-wrapper .timeline-editor-action {
          height: 28px !important;
          top: 50%;
          transform: translateY(-50%);
        }

        .custom-effect-audio {
          width: 100%;
          height: 100%;
          background-color: #cd9541;
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

        .custom-effect-video {
          width: 100%;
          height: 100%;
          background-color: #7846a7;
          border-radius: 4px;
        }

        /* Override the built-in drag handle arrows */
        .custom-editor-wrapper .timeline-editor-action-left-stretch::after {
          border-left: 7px solid rgba(255, 255, 255, 0.4);
        }

        .custom-editor-wrapper .timeline-editor-action-right-stretch::after {
          border-right: 7px solid rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
};
```

## Available CSS Class Hooks

The timeline generates predictable CSS classes you can target:

| Class | Description |
|---|---|
| `.timeline-editor` | The root timeline wrapper |
| `.timeline-editor-action` | Individual action block wrapper |
| `.timeline-editor-action-effect-{effectId}` | Action wrapper scoped to a specific effect ID |
| `.timeline-editor-action-left-stretch` | The left resize handle |
| `.timeline-editor-action-right-stretch` | The right resize handle |

## Setting Inline Styles on Individual Actions

For simple per-action overrides, use the `style` property directly on the action data:

```typescript
const myAction: TimelineAction = {
  id: 'action-1',
  start: 0,
  end: 2,
  effectId: 'effect0',
  style: {
    background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
    borderRadius: '4px',
  },
};
```
