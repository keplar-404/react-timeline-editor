# Cut Overlay Feature

The `CutOverlay` is a powerful, fully-configurable visual component for `@keplar-404/react-timeline-editor` that enables a "blade cut" interaction. When integrated, users can hover over timeline action blocks to preview a precise cut point (snapped to the grid) and click to split the block into two.

## Try it out

Run the example project locally to see the Cut Overlay in action and experiment with its visual configuration options:

```bash
cd packages/example
bun run dev
```

Enable the **"Blade Cut Mode"** toggle in the sidebar.

## Usage

The `CutOverlay` should be mounted absolutely as a sibling to your `<Timeline>` component, wrapping the editor area. It relies on the same dimensional properties as your `<Timeline>` to perfectly synchronize the blade cursor with the timeline rows.

### 1. The Component

Import the `CutOverlay` and render it conditionally when your "cut mode" is active.

```tsx
import { Timeline } from '@keplar-404/react-timeline-editor';
import CutOverlay, { CutOverlayConfig } from './path-to-your/CutOverlay';

// ... inside your component
const [cutMode, setCutMode] = useState(false);

// Example configuration: change the blade to blue and customize the pill text
const cutConfig: CutOverlayConfig = {
  bladeColor: '#3b82f6',
  showPill: true,
  formatPillLabel: (t) => `Split at ${t.toFixed(3)}s`,
  pillColor: '#3b82f6',
  showBlockHighlight: true,
  blockHighlightColor: 'rgba(59, 130, 246, 0.1)',
  blockHighlightBorderColor: 'rgba(59, 130, 246, 0.4)',
};

return (
  <div className="timeline-container" style={{ position: 'relative' }}>
    <Timeline
      editorData={data}
      scale={scale}
      scaleWidth={scaleWidth}
      startLeft={startLeft}
      rowHeight={rowHeight}
      gridSnap={gridSnapEnabled}
      /* Ensure other timeline props are identical */
    />

    {cutMode && (
      <CutOverlay
        data={data}
        scale={scale}
        scaleSplitCount={10}
        scaleWidth={scaleWidth}
        startLeft={startLeft}
        rowHeight={rowHeight}
        gridSnap={gridSnapEnabled} // Mirrors Timeline grid snapping
        editAreaTopOffset={32} // Adjust to match your Time Ruler height (default is 32)
        config={cutConfig}
        onCut={(rowId, actionId, cutTime) => {
          // Your custom logic to split the block in your state goes here
          console.log(`Cut action ${actionId} at ${cutTime}s`);
        }}
      />
    )}
  </div>
);
```

### 2. Splitting Logic (`splitActionInRow`)

When the user clicks the blade, the `onCut` callback is fired with the `rowId`, `actionId`, and `cutTime`. You must handle the actual data mutation in your application state.

Here is a standard utility function to split a block accurately:

```typescript
import { TimelineRow } from '@keplar-404/timeline-engine';
import { cloneDeep } from 'lodash';

export function splitActionInRow(data: TimelineRow[], rowId: string, actionId: string, cutTime: number): TimelineRow[] {
  const rowIdx = data.findIndex((r) => r.id === rowId);
  if (rowIdx === -1) return data;

  const row = data[rowIdx];
  const actIdx = row.actions.findIndex((a) => a.id === actionId);
  if (actIdx === -1) return data;

  const action = row.actions[actIdx];

  // Validate the cut time is within the block boundaries
  if (cutTime <= action.start || cutTime >= action.end) {
    return data;
  }

  // Clone to avoid mutating original state directly (requires lodash/cloneDeep)
  const newData = cloneDeep(data);
  const targetRow = newData[rowIdx];
  const targetAction = targetRow.actions[actIdx];

  // 1. Shrink the original action to end at the cut point
  const originalEnd = targetAction.end;
  targetAction.end = cutTime;

  // 2. Create the new adjacent action starting at the cut point
  const newAction = {
    ...targetAction,
    id: `${targetAction.id}_split_${Date.now()}`,
    start: cutTime,
    end: originalEnd,
  };

  // 3. Insert the new action directly after the original one
  targetRow.actions.splice(actIdx + 1, 0, newAction);

  return newData;
}
```

## `CutOverlayConfig` Reference

The visual presentation of the blade, pill, and block highlight is fully customizable without touching the CSS. Pass an object fulfilling `CutOverlayConfig` to the `config` prop.

All options are optional.

| Option                          | Type                    | Default                            | Description                                                            |
| :------------------------------ | :---------------------- | :--------------------------------- | :--------------------------------------------------------------------- |
| **`bladeColor`**                | `string`                | `'#ef4444'`                        | CSS color of the vertical blade line.                                  |
| **`showPill`**                  | `boolean`               | `true`                             | Show/hide the floating time pill above the blade.                      |
| **`formatPillLabel`**           | `(t: number) => string` | `(t) => "✂ " + t.toFixed(2) + "s"` | Formatter function for the pill text.                                  |
| **`pillColor`**                 | `string`                | `'#ef4444'`                        | Background color of the time pill.                                     |
| **`pillTextColor`**             | `string`                | `'#ffffff'`                        | Text color inside the time pill.                                       |
| **`showBlockHighlight`**        | `boolean`               | `true`                             | Show/hide the highlight tint and border over the hovered action block. |
| **`blockHighlightColor`**       | `string`                | `'rgba(239, 68, 68, 0.08)'`        | CSS color for the highlight fill.                                      |
| **`blockHighlightBorderColor`** | `string`                | `'rgba(239, 68, 68, 0.3)'`         | CSS color for the highlight border.                                    |

## Important Considerations

- **Scrolling:** The `CutOverlay` natively interrogates the `ReactVirtualized__Grid` DOM element to extract horizontal layout offsets (`scrollLeft`). It does not rely on React state scroll tracking, which maintains optimal performance and absolute precision.
- **Ruler Offset:** The `editAreaTopOffset` prop is critical for accurately mapping mouse coordinates to the active row. The default `@keplar-404/react-timeline-editor` design reserves `32px` at the top for the time axis ruler. Ensure you adjust this prop if your CSS adds borders, padding, or modifies the ruler height (for example, in the demo project, it is set to `42`).
