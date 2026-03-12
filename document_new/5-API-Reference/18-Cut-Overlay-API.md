# Cut Overlay API

Complete API reference for the `CutOverlay` component and `splitActionInRow` utility from `@keplar-404/react-timeline-editor`.

---

## Overview

`CutOverlay` provides an interactive "blade" that lets users split action blocks at any point in time. It must be:

1. Mounted as a **sibling** to `<Timeline>` inside a `position: relative` wrapper.
2. Given the **same geometry props** as the `<Timeline>`.

---

## `<CutOverlay />` Props Reference

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `data` | `TimelineRow[]` | ✅ | — | Current timeline data |
| `scale` | `number` | ✅ | — | Must match `<Timeline>` `scale` prop |
| `scaleWidth` | `number` | ✅ | — | Must match `<Timeline>` `scaleWidth` prop |
| `scaleSplitCount` | `number` | ✅ | — | Must match `<Timeline>` `scaleSplitCount` prop |
| `startLeft` | `number` | ✅ | — | Must match `<Timeline>` `startLeft` prop |
| `rowHeight` | `number` | ✅ | — | Must match `<Timeline>` `rowHeight` prop |
| `editAreaTopOffset` | `number` | ✅ | — | Height of the time ruler area (usually `32`) |
| `gridSnap` | `boolean` | — | `false` | Snap the cut position to grid intervals |
| `config` | `CutOverlayConfig` | — | `{}` | Visual and behavior configuration |
| `onModifierChange` | `(isActive: boolean) => void` | — | — | Called when keyboard modifier toggles cut mode |
| `onCut` | `(rowId: string, actionId: string, cutTime: number) => void` | ✅ | — | Called when user clicks to cut an action |

---

## `CutOverlayConfig`

| Option | Type | Default | Description |
|---|---|---|---|
| `bladeColor` | `string` | `'#3b82f6'` | Color of the vertical blade line |
| `showPill` | `boolean` | `true` | Show a floating label with the cut time |
| `formatPillLabel` | `(time: number) => string` | `"${time.toFixed(2)}s"` | Custom time label formatter |
| `pillColor` | `string` | `'#1e3a8a'` | Background color of the time label pill |
| `pillTextColor` | `string` | `'#ffffff'` | Text color of the time label pill |
| `showBlockHighlight` | `boolean` | `true` | Highlight the action being hovered |
| `blockHighlightColor` | `string` | `'rgba(59,130,246,0.15)'` | Fill color of the block highlight |
| `blockHighlightBorderColor` | `string` | `'rgba(59,130,246,0.4)'` | Border color of the block highlight |
| `cursor` | `string` | `'crosshair'` | CSS cursor style |
| `keyboardModifier` | `string` | `--` | Key to hold to activate cut mode (e.g. `'c'`, `'Shift'`) |

---

## `splitActionInRow` Utility

Immutably splits a single action in a row at a given time. Returns a new `TimelineRow[]` array.

```typescript
function splitActionInRow(
  data: TimelineRow[],
  rowId: string,
  actionId: string,
  cutTime: number,
): TimelineRow[]
```

### Parameters

| Parameter | Type | Description |
|---|---|---|
| `data` | `TimelineRow[]` | The current timeline data array |
| `rowId` | `string` | ID of the row containing the action to split |
| `actionId` | `string` | ID of the action to split |
| `cutTime` | `number` | The time (in seconds) at which to cut |

### Return Value

A new `TimelineRow[]` array with the target action replaced by two new actions. The first action spans `[original.start, cutTime)` and the second spans `[cutTime, original.end)`. Both inherit the same `effectId` and `data` from the original.

### Example

```typescript
import { splitActionInRow } from '@keplar-404/react-timeline-editor';

const data: TimelineRow[] = [
  {
    id: 'row-1',
    actions: [{ id: 'action-1', start: 0, end: 10, effectId: 'effect0' }],
  },
];

const newData = splitActionInRow(data, 'row-1', 'action-1', 5);
// Result: two actions → [0, 5] and [5, 10]
```
