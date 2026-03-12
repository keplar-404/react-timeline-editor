# Cut Block Feature

The timeline provides a visual, interactive blade `CutOverlay` to split action blocks at a specific time cursor.

This operates as a standalone overlay component that sits on top of your `<Timeline>` editor area.

## Basic Usage

To implement a cutting feature, you mount the `<CutOverlay>` as a sibling to the `<Timeline>` inside a `position: relative` wrapper.

When the user hovers over an action block, a precision blade appears. When they click, the `onCut` callback provides the exact time to split the data.

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

  // Geometry configuration
  const scale = 5;
  const scaleSplitCount = 10;
  const scaleWidth = 160;
  const startLeft = 20;
  const rowHeight = 32;
  const editAreaTopOffset = 32;

  const handleCut = (rowId: string, actionId: string, cutTime: number) => {
    // We use the built-in splitActionInRow utility for immutable data updates
    const newData = splitActionInRow(data, rowId, actionId, cutTime);
    setData(newData);
  };

  return (
    <div className="timeline-wrapper" style={{ position: 'relative' }}>
      <button onClick={() => setIsCutMode(!isCutMode)}>{isCutMode ? 'Disable Cut Blade' : 'Enable Cut Blade (Hold C)'}</button>

      <Timeline editorData={data} effects={{}} onChange={setData} scale={scale} scaleWidth={scaleWidth} startLeft={startLeft} rowHeight={rowHeight} disableDrag={isCutMode} />

      <CutOverlay
        data={data}
        scale={scale}
        scaleSplitCount={scaleSplitCount}
        scaleWidth={scaleWidth}
        startLeft={startLeft}
        rowHeight={rowHeight}
        editAreaTopOffset={editAreaTopOffset}
        gridSnap={false}
        config={{ keyboardModifier: 'c' }}
        onModifierChange={setIsCutMode}
        onCut={handleCut}
      />
    </div>
  );
};
```

## Styling & Configuration

The `CutOverlay` accepts a `config` object for fine-grained, pure CSS, visual control.

```tsx
<CutOverlay
  data={data}
  // ... geometry props ...
  config={{
    bladeColor: '#3b82f6',
    showPill: true,
    formatPillLabel: (time) => `Split @ ${time.toFixed(1)}s`,
    pillColor: '#1e3a8a',
    pillTextColor: '#ffffff',
    showBlockHighlight: true,
    blockHighlightColor: 'rgba(59,130,246,0.15)',
    blockHighlightBorderColor: 'rgba(59,130,246,0.4)',
    cursor: 'crosshair',
    keyboardModifier: 'Shift',
  }}
  onCut={handleCut}
/>
```
