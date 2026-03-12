# `<Timeline />` Props Reference

Complete API reference for all props accepted by the `<Timeline />` component from `@keplar-404/react-timeline-editor`.

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

## Engine

| Property | Description | Type | Default |
|---|---|---|---|
| `engine` | Custom timeline playback engine; uses the built-in `TimelineEngine` if not provided | `TimelineEngine` | `--` |

---

## Data Change

| Property | Description | Type | Default |
|---|---|---|---|
| `onChange` | Data change callback, triggered after an action operation ends. Return `false` to prevent automatic engine synchronization (useful for reducing performance overhead) | `(editorData: TimelineRow[]) => boolean \| void` | `--` |

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
| `onClickRow` | Called when a row is clicked | `(e: MouseEvent<HTMLElement, MouseEvent>, param: { row: TimelineRow; time: number; }) => void` | `--` |
| `onClickAction` | Called when an action block is clicked | `(e: MouseEvent<HTMLElement, MouseEvent>, param: { action: TimelineAction; row: TimelineRow; time: number; }) => void` | `--` |
| `onClickActionOnly` | Called when an action block is clicked but **not** when a drag was triggered | `(e: MouseEvent<HTMLElement, MouseEvent>, param: { action: TimelineAction; row: TimelineRow; time: number; }) => void` | `--` |
| `onDoubleClickRow` | Called when a row is double-clicked | `(e: MouseEvent<HTMLElement, MouseEvent>, param: { row: TimelineRow; time: number; }) => void` | `--` |
| `onDoubleClickAction` | Called when an action block is double-clicked | `(e: MouseEvent<HTMLElement, MouseEvent>, param: { action: TimelineAction; row: TimelineRow; time: number; }) => void` | `--` |
| `onContextMenuRow` | Called when a row is right-clicked | `(e: MouseEvent<HTMLElement, MouseEvent>, param: { row: TimelineRow; time: number; }) => void` | `--` |
| `onContextMenuAction` | Called when an action block is right-clicked | `(e: MouseEvent<HTMLElement, MouseEvent>, param: { action: TimelineAction; row: TimelineRow; time: number; }) => void` | `--` |

---

## Drag Assist Lines

| Property | Description | Type | Default |
|---|---|---|---|
| `getAssistDragLineActionIds` | Returns the list of action IDs used to draw auxiliary snap lines during move/resize. Defaults to all actions except the one currently being moved | `(params: { action: TimelineAction; editorData: TimelineRow[]; row: TimelineRow; }) => string[]` | `--` |

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
| `onClickTimeArea` | Called when the time ruler area is clicked. Return `false` to prevent the cursor from moving to that time | `(time: number, e: MouseEvent<HTMLDivElement, MouseEvent>) => boolean` | `--` |

---

## Ref & Key

| Property | Description | Type | Default |
|---|---|---|---|
| `ref` | Imperative handle ref for controlling playback, cursor, and scroll programmatically | `Ref<TimelineState>` | `--` |
| `key` | Standard React key | `Key` | `--` |

---

## `TimelineState` (Ref Handle)

When using `ref` on `<Timeline />`, you get access to the following imperative API:

| Member | Description | Type |
|---|---|---|
| `target` | The underlying DOM node | `HTMLElement \| null` |
| `listener` | The engine event emitter (use `.on(...)` to subscribe to events) | `Emitter<EventTypes>` |
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

---

## Complete Props at a Glance

| Property | Description | Type | Default |
|---|---|---|---|
| `scrollTop` | Scroll distance from top of editing area (@deprecated — use `ref.setScrollTop`) | `number` | `--` |
| `onScroll` | Editing area scroll callback | `(params: OnScrollParams) => void` | `--` |
| `autoScroll` | Enable auto-scroll during dragging | `boolean` | `false` |
| `style` | Custom timeline style | `CSSProperties` | `--` |
| `autoReRender` | Auto re-render on data/cursor time change | `boolean` | `true` |
| `onChange` | Data change callback (return `false` to prevent engine sync) | `(editorData: TimelineRow[]) => boolean \| void` | `--` |
| `editorData` | Timeline editing data | `TimelineRow[]` | **(Required)** |
| `effects` | Timeline action effect map | `Record<string, TimelineEffect>` | **(Required)** |
| `scale` | Single scale mark duration (`>0`) | `number` | `1` |
| `minScaleCount` | Minimum number of scale marks (`>=1`) | `number` | `20` |
| `maxScaleCount` | Maximum number of scale marks (`>=minScaleCount`) | `number` | `Infinity` |
| `scaleSplitCount` | Subdivisions per scale mark (integer `>0`) | `number` | `10` |
| `scaleWidth` | Width of a single scale mark (`>0`, px) | `number` | `160` |
| `startLeft` | Left inset before the scale starts (`>=0`, px) | `number` | `20` |
| `rowHeight` | Default row height (`>0`, px) | `number` | `32` |
| `gridSnap` | Enable grid movement snapping | `boolean` | `false` |
| `dragLine` | Enable drag auxiliary line snapping | `boolean` | `false` |
| `hideCursor` | Hide the playback cursor | `boolean` | `false` |
| `disableDrag` | Disable all action area dragging | `boolean` | `false` |
| `engine` | Custom timeline engine instance | `TimelineEngine` | `--` |
| `getActionRender` | Custom action block renderer | `(action, row) => ReactNode` | `--` |
| `getScaleRender` | Custom scale mark renderer | `(scale) => ReactNode` | `--` |
| `onActionMoveStart` | Move start callback | `({ action, row }) => void` | `--` |
| `onActionMoving` | Moving callback (return `false` to cancel) | `({ action, row, start, end }) => boolean \| void` | `--` |
| `onActionMoveEnd` | Move end callback (return `false` to skip `onChange`) | `({ action, row, start, end }) => void` | `--` |
| `onActionResizeStart` | Resize start callback | `({ action, row, dir }) => void` | `--` |
| `onActionResizing` | Resizing callback (return `false` to cancel) | `({ action, row, start, end, dir }) => boolean \| void` | `--` |
| `onActionResizeEnd` | Resize end callback (return `false` to skip `onChange`) | `({ action, row, start, end, dir }) => void` | `--` |
| `onClickRow` | Row click callback | `(e, { row, time }) => void` | `--` |
| `onClickAction` | Action click callback | `(e, { action, row, time }) => void` | `--` |
| `onClickActionOnly` | Action click callback (skipped when drag triggered) | `(e, { action, row, time }) => void` | `--` |
| `onDoubleClickRow` | Row double-click callback | `(e, { row, time }) => void` | `--` |
| `onDoubleClickAction` | Action double-click callback | `(e, { action, row, time }) => void` | `--` |
| `onContextMenuRow` | Row right-click callback | `(e, { row, time }) => void` | `--` |
| `onContextMenuAction` | Action right-click callback | `(e, { action, row, time }) => void` | `--` |
| `getAssistDragLineActionIds` | Get assist drag line action IDs | `({ action, editorData, row }) => string[]` | `--` |
| `onCursorDragStart` | Cursor drag start event | `(time: number) => void` | `--` |
| `onCursorDragEnd` | Cursor drag end event | `(time: number) => void` | `--` |
| `onCursorDrag` | Cursor dragging event | `(time: number) => void` | `--` |
| `onClickTimeArea` | Time area click event (return `false` to block cursor set) | `(time, e) => boolean` | `--` |
| `ref` | Imperative handle ref | `Ref<TimelineState>` | `--` |
| `key` | React key | `Key` | `--` |
