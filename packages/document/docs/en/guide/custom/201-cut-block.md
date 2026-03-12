---
title: Cut Block
---

# Cut Block Feature

The `CutOverlay` provides an interactive "blade" to split action blocks at any cursor position.

It operates as a standalone overlay component mounted as a sibling to the `<Timeline>` inside a `position: relative` wrapper.

## Basic Usage

```tsx
import React, { useState } from 'react';
import { Timeline, TimelineRow, CutOverlay, splitActionInRow } from '@keplar-404/react-timeline-editor';

const mockData: TimelineRow[] = [
  {
    id: '0',
    actions: [{ id: 'action00', start: 0, end: 10, effectId: 'effect0' }],
  },
];

export const EditorCutBlock = () => {
  const [data, setData] = useState(mockData);
  const [isCutMode, setIsCutMode] = useState(false);

  // Geometry configuration — must match between Timeline and CutOverlay
  const scale = 5;
  const scaleSplitCount = 10;
  const scaleWidth = 160;
  const startLeft = 20;
  const rowHeight = 32;
  const editAreaTopOffset = 32; // Height of the time ruler

  const handleCut = (rowId: string, actionId: string, cutTime: number) => {
    // Use the built-in utility for immutable data splitting
    const newData = splitActionInRow(data, rowId, actionId, cutTime);
    setData(newData);
  };

  return (
    <div className="timeline-wrapper" style={{ position: 'relative' }}>
      <button onClick={() => setIsCutMode(!isCutMode)}>
        {isCutMode ? 'Disable Cut Mode' : 'Enable Cut Mode'}
      </button>

      <Timeline
        editorData={data}
        effects={{}}
        onChange={setData}
        scale={scale}
        scaleWidth={scaleWidth}
        startLeft={startLeft}
        rowHeight={rowHeight}
        disableDrag={isCutMode} // Disable normal drag during cut mode
      />

      <CutOverlay
        data={data}
        scale={scale}
        scaleSplitCount={scaleSplitCount}
        scaleWidth={scaleWidth}
        startLeft={startLeft}
        rowHeight={rowHeight}
        editAreaTopOffset={editAreaTopOffset}
        gridSnap={false}
        config={{ keyboardModifier: 'c' }} // Hold 'c' key to activate
        onModifierChange={setIsCutMode}
        onCut={handleCut}
      />
    </div>
  );
};
```

## `splitActionInRow` Utility

The built-in `splitActionInRow` utility handles immutable data splitting:

```typescript
import { splitActionInRow } from '@keplar-404/react-timeline-editor';

const newData = splitActionInRow(
  data,        // TimelineRow[]
  rowId,       // string — ID of the row containing the action
  actionId,    // string — ID of the action to split
  cutTime,     // number — the time (in seconds) to cut at
);
```

## Visual Configuration (`config` prop)

```tsx
<CutOverlay
  data={data}
  // ... geometry props ...
  config={{
    bladeColor: '#3b82f6',          // Color of the blade line
    showPill: true,                  // Show time label pill
    formatPillLabel: (t) => `${t.toFixed(2)}s`,
    pillColor: '#1e3a8a',
    pillTextColor: '#ffffff',
    showBlockHighlight: true,        // Highlight the action being hovered
    blockHighlightColor: 'rgba(59,130,246,0.15)',
    blockHighlightBorderColor: 'rgba(59,130,246,0.4)',
    cursor: 'crosshair',             // CSS cursor style
    keyboardModifier: 'Shift',       // Hold this key to activate cut mode
  }}
  onCut={handleCut}
/>
```

## Props Reference

| Prop | Type | Description |
|---|---|---|
| `data` | `TimelineRow[]` | The current timeline data |
| `scale` | `number` | Must match `<Timeline>` scale |
| `scaleWidth` | `number` | Must match `<Timeline>` scaleWidth |
| `scaleSplitCount` | `number` | Must match `<Timeline>` scaleSplitCount |
| `startLeft` | `number` | Must match `<Timeline>` startLeft |
| `rowHeight` | `number` | Must match `<Timeline>` rowHeight |
| `editAreaTopOffset` | `number` | Height of the time ruler (usually `32`) |
| `gridSnap` | `boolean` | Snap cut position to grid |
| `config` | `CutOverlayConfig` | Visual and behavior configuration |
| `onModifierChange` | `(isActive: boolean) => void` | Called when keyboard modifier toggles cut mode |
| `onCut` | `(rowId, actionId, cutTime) => void` | Called when the user clicks to cut |
