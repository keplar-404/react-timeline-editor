# Editor Props and Data Interfaces

## The Data Interface

The React Timeline Editor interacts primarily with three Core types from the engine: `TimelineRow`, `TimelineAction`, and `TimelineEffect`.

### TimelineRow

A Track or Row in the timeline.

```typescript
export interface TimelineRow {
  /** Row unique ID */
  id: string;
  /** List of actions contained in this row */
  actions: TimelineAction[];
  /** Custom class for styling the row */
  classNames?: string[];
  /** Optional custom data */
  selected?: boolean;
  flexy?: boolean;
}
```

### TimelineAction

A specific block of time/action within a Row.

```typescript
export interface TimelineAction {
  /** Action unique ID */
  id: string;
  /** Start time of the action (in seconds) */
  start: number;
  /** End time of the action (in seconds) */
  end: number;
  /** ID of the effect defining this action */
  effectId: string;
  /** Whether dragging is prevented */
  movable?: boolean;
  flexible?: boolean;
  /** Custom style or class for the action block */
  style?: React.CSSProperties;
  className?: string;
  /** Custom data */
  data?: any;
}
```

### TimelineEffect

The definition of what an Action does or represents.

```typescript
export interface TimelineEffect {
  /** Effect ID */
  id: string;
  /** Effect Name */
  name: string;
  /** Engine Effect source handler (for playback/callbacks) */
  source?: TimeLineEffectSource;
}
```

---

## Editor Component Props (`<Timeline />`)

The `<Timeline />` component accepts numerous props for configuration:

### Core Data & Configuration

| Property                | Type                                  | Default  | Description                                           |
| ----------------------- | ------------------------------------- | -------- | ----------------------------------------------------- |
| `editorData` (Required) | `TimelineRow[]`                       | -        | Timeline editing data (track rows)                    |
| `effects` (Required)    | `Record<string, TimelineEffect>`      | -        | Map of all possible effect instances                  |
| `onChange`              | `(editorData: TimelineRow[]) => void` | -        | Callback triggered whenever timeline data is modified |
| `engine`                | `ITimelineEngine`                     | internal | Provide your own constructed timeline engine instance |

### Display & Scale

| Property          | Type      | Default    | Description                                       |
| ----------------- | --------- | ---------- | ------------------------------------------------- |
| `scale`           | `number`  | `1`        | Scaling factor for each scale mark (> 0)          |
| `scaleWidth`      | `number`  | `160`      | Display width of a single scale mark (px)         |
| `scaleSplitCount` | `number`  | `10`       | Number of subdivision units for a single mark     |
| `minScaleCount`   | `number`  | `20`       | Minimum number of scale marks shown               |
| `maxScaleCount`   | `number`  | `Infinity` | Maximum number of scale marks                     |
| `startLeft`       | `number`  | `20`       | Padding distance from the start of the scale (px) |
| `rowHeight`       | `number`  | `32`       | Height of each row element (px)                   |
| `hideCursor`      | `boolean` | `false`    | Disable or hide the playback cursor               |

### Snapping & Features

| Property     | Type      | Default | Description                                            |
| ------------ | --------- | ------- | ------------------------------------------------------ |
| `gridSnap`   | `boolean` | `false` | Enable snapping actions to grid intervals              |
| `dragLine`   | `boolean` | `false` | Enable snapping to drag auxiliary lines                |
| `autoScroll` | `boolean` | `false` | Automatically scroll timeline when dragging near edges |

### Interaction Restrictions (Disabling)

| Property             | Type      | Default | Description                                          |
| -------------------- | --------- | ------- | ---------------------------------------------------- |
| `disableDrag`        | `boolean` | `false` | Prevent dragging action blocks                       |
| `enableRowDrag`      | `boolean` | `false` | **(NEW)** Enable dragging to sort entire track rows  |
| `enableCrossRowDrag` | `boolean` | `false` | Enable dragging action blocks between different rows |

### Custom Renderers

| Property          | Type                                                      | Description                                                              |
| ----------------- | --------------------------------------------------------- | ------------------------------------------------------------------------ |
| `getActionRender` | `(action: TimelineAction, row: TimelineRow) => ReactNode` | Custom rendering of the action/block area                                |
| `getScaleRender`  | `(scale: number) => ReactNode`                            | Customize rendering of scale marks                                       |
| `getGhostPreview` | `({ action, row }) => ReactNode`                          | **(NEW)** Custom rendering for the ghost preview when dragging cross-row |

### Event Callbacks

| Property              | Type                                                    | Description                                        |
| --------------------- | ------------------------------------------------------- | -------------------------------------------------- |
| `onActionMoveStart`   | `({ action, row }) => void`                             | Triggered when moving block starts                 |
| `onActionMoving`      | `({ action, row, start, end }) => void \| boolean`      | Triggered during movement (Return false to cancel) |
| `onActionMoveEnd`     | `({ action, row, start, end }) => void`                 | Triggered when movement finishes                   |
| `onActionResizeStart` | `({ action, row, dir }) => void`                        | Triggered when resizing start/end handles          |
| `onActionResizing`    | `({ action, row, start, end, dir }) => void \| boolean` | Triggered during block resize                      |
| `onActionResizeEnd`   | `({ action, row, start, end, dir }) => void`            | Triggered when resize finishes                     |
| `onClickRow`          | `(e, { row, time }) => void`                            | Triggered when row is clicked                      |
| `onClickAction`       | `(e, { action, row, time }) => void`                    | Triggered when action block is clicked             |
| `onClickTimeArea`     | `(time, e) => boolean`                                  | Triggered clicking top time bar                    |
| `onRowDragStart`      | `({ row }) => void`                                     | Triggered when row order drag starts               |
| `onRowDragEnd`        | `({ row, editorData }) => void`                         | Triggered when row order drag drops                |
