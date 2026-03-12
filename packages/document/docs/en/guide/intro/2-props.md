---
title: Timeline Props
---

# `<Timeline />` Props Reference

Complete API reference for all props accepted by the `<Timeline />` component.

---

## Required Props

| Property | Description | Type | Default |
|---|---|---|---|
| `editorData` | Timeline editing data | `TimelineRow[]` | **(Required)** |
| `effects` | Timeline action effect map | `Record<string, TimelineEffect>` | **(Required)** |

---

## Scroll & Layout

| Property | Description | Type | Default |
|---|---|---|---|
| `scrollTop` | Scroll distance from the top of the editing area. **@deprecated** — use `ref.setScrollTop` instead | `number` | `--` |
| `onScroll` | Editing area scroll callback (used to synchronize with editing line scrolling) | `(params: OnScrollParams) => void` | `--` |
| `autoScroll` | Whether to enable auto-scroll during dragging | `boolean` | `false` |
| `style` | Custom inline style for the timeline wrapper | `CSSProperties` | `--` |

---

## Scale & Display

| Property | Description | Type | Default |
|---|---|---|---|
| `scale` | Single scale mark duration in seconds (`>0`) | `number` | `1` |
| `minScaleCount` | Minimum number of scale marks (`>=1`) | `number` | `20` |
| `maxScaleCount` | Maximum number of scale marks (`>=minScaleCount`) | `number` | `Infinity` |
| `scaleSplitCount` | Number of subdivisions per scale mark (integer `>0`) | `number` | `10` |
| `scaleWidth` | Display width of a single scale mark (`>0`, unit: px) | `number` | `160` |
| `startLeft` | Distance from the left edge to where the scale starts (`>=0`, unit: px) | `number` | `20` |
| `rowHeight` | Default height of each editing row (`>0`, unit: px) | `number` | `32` |

---

## Behavior & Interaction

| Property | Description | Type | Default |
|---|---|---|---|
| `autoReRender` | Whether to automatically re-render (update tick when data or cursor time changes) | `boolean` | `true` |
| `gridSnap` | Whether to enable grid movement snapping | `boolean` | `false` |
| `dragLine` | Enable drag auxiliary line snapping | `boolean` | `false` |
| `hideCursor` | Whether to hide the playback cursor | `boolean` | `false` |
| `disableDrag` | Disable dragging in all action areas | `boolean` | `false` |

---

## Cross-Row & Row Drag

| Property | Description | Type | Default |
|---|---|---|---|
| `enableRowDrag` | Enable drag handle for reordering rows | `boolean` | `false` |
| `enableCrossRowDrag` | Enable dragging action blocks between different rows | `boolean` | `false` |
| `enableGhostPreview` | Show a ghost/preview element following the cursor during cross-row block drag | `boolean` | `true` |
| `getGhostPreview` | Custom render function for the drag ghost/preview element | `({ action, row }) => ReactNode` | `--` |

---

## Engine

| Property | Description | Type | Default |
|---|---|---|---|
| `engine` | Custom timeline playback engine; uses the built-in `TimelineEngine` if not provided | `ITimelineEngine` | `--` |

---

## Data Change

| Property | Description | Type | Default |
|---|---|---|---|
| `onChange` | Data change callback. Return `false` to prevent automatic engine synchronization | `(editorData: TimelineRow[]) => boolean \| void` | `--` |

---

## Custom Renderers

| Property | Description | Type | Default |
|---|---|---|---|
| `getActionRender` | Custom render function for action blocks | `(action: TimelineAction, row: TimelineRow) => ReactNode` | `--` |
| `getScaleRender` | Custom render function for scale marks | `(scale: number) => ReactNode` | `--` |

---

## Action Move Callbacks

| Property | Description | Type | Default |
|---|---|---|---|
| `onActionMoveStart` | Called when an action block starts moving | `(params: { action: TimelineAction; row: TimelineRow; }) => void` | `--` |
| `onActionMoving` | Called during action movement. Return `false` to prevent the movement | `(params: { action: TimelineAction; row: TimelineRow; start: number; end: number; }) => boolean \| void` | `--` |
| `onActionMoveEnd` | Called when action movement ends. Return `false` to prevent `onChange` from triggering | `(params: { action: TimelineAction; row: TimelineRow; start: number; end: number; }) => void` | `--` |

---

## Action Resize Callbacks

| Property | Description | Type | Default |
|---|---|---|---|
| `onActionResizeStart` | Called when an action block starts resizing | `(params: { action: TimelineAction; row: TimelineRow; dir: "right" \| "left"; }) => void` | `--` |
| `onActionResizing` | Called during action resizing. Return `false` to prevent the change | `(params: { action: TimelineAction; row: TimelineRow; start: number; end: number; dir: "right" \| "left"; }) => boolean \| void` | `--` |
| `onActionResizeEnd` | Called when action resizing ends. Return `false` to prevent `onChange` from triggering | `(params: { action: TimelineAction; row: TimelineRow; start: number; end: number; dir: "right" \| "left"; }) => void` | `--` |

---

## Click & Context Callbacks

| Property | Description | Type | Default |
|---|---|---|---|
| `onClickRow` | Called when a row is clicked | `(e: MouseEvent, param: { row: TimelineRow; time: number; }) => void` | `--` |
| `onClickAction` | Called when an action block is clicked | `(e: MouseEvent, param: { action: TimelineAction; row: TimelineRow; time: number; }) => void` | `--` |
| `onClickActionOnly` | Called when an action block is clicked but **not** when a drag was triggered | `(e: MouseEvent, param: { action: TimelineAction; row: TimelineRow; time: number; }) => void` | `--` |
| `onDoubleClickRow` | Called when a row is double-clicked | `(e: MouseEvent, param: { row: TimelineRow; time: number; }) => void` | `--` |
| `onDoubleClickAction` | Called when an action block is double-clicked | `(e: MouseEvent, param: { action: TimelineAction; row: TimelineRow; time: number; }) => void` | `--` |
| `onContextMenuRow` | Called when a row is right-clicked | `(e: MouseEvent, param: { row: TimelineRow; time: number; }) => void` | `--` |
| `onContextMenuAction` | Called when an action block is right-clicked | `(e: MouseEvent, param: { action: TimelineAction; row: TimelineRow; time: number; }) => void` | `--` |

---

## Drag Assist Lines

| Property | Description | Type | Default |
|---|---|---|---|
| `getAssistDragLineActionIds` | Returns the list of action IDs used to draw auxiliary snap lines during move/resize | `(params: { action: TimelineAction; editorData: TimelineRow[]; row: TimelineRow; }) => string[]` | `--` |

---

## Cursor Callbacks

| Property | Description | Type | Default |
|---|---|---|---|
| `onCursorDragStart` | Called when the cursor starts being dragged | `(time: number) => void` | `--` |
| `onCursorDragEnd` | Called when the cursor drag ends | `(time: number) => void` | `--` |
| `onCursorDrag` | Called continuously while the cursor is being dragged | `(time: number) => void` | `--` |

---

## Time Area

| Property | Description | Type | Default |
|---|---|---|---|
| `onClickTimeArea` | Called when the time ruler area is clicked. Return `false` to prevent the cursor from moving | `(time: number, e: MouseEvent) => boolean` | `--` |

---

## Row Drag Callbacks

| Property | Description | Type | Default |
|---|---|---|---|
| `onRowDragStart` | Called when the user begins dragging a row | `(params: { row: TimelineRow }) => void` | `--` |
| `onRowDragEnd` | Called when the user drops a row. Receives updated `editorData` with new row order | `(params: { row: TimelineRow; editorData: TimelineRow[] }) => void` | `--` |

---

## `TimelineState` (Ref Handle)

When using `ref` on `<Timeline />`, you get access to the following imperative API:

| Member | Description | Type |
|---|---|---|
| `target` | The underlying DOM node | `HTMLElement \| null` |
| `listener` | The engine event emitter (use `.on(...)` to subscribe) | `Emitter<EventTypes>` |
| `isPlaying` | Whether the timeline is currently playing | `boolean` |
| `isPaused` | Whether the timeline is currently paused | `boolean` |
| `setTime(time)` | Move the cursor to a specific time | `(time: number) => void` |
| `getTime()` | Get the current cursor time | `() => number` |
| `setPlayRate(rate)` | Set the playback speed multiplier | `(rate: number) => void` |
| `getPlayRate()` | Get the current playback rate | `() => number` |
| `reRender()` | Re-render at the current time without playing | `() => void` |
| `play(param)` | Start playback from the current time | `(param: { toTime?: number; autoEnd?: boolean; runActionIds?: string[]; }) => boolean` |
| `pause()` | Pause playback | `() => void` |
| `setScrollLeft(val)` | Programmatically set the horizontal scroll position | `(val: number) => void` |
| `setScrollTop(val)` | Programmatically set the vertical scroll position | `(val: number) => void` |
