import { Emitter, EventTypes, ITimelineEngine } from '@keplar-404/timeline-engine';
import React, { ReactNode } from 'react';
import { OnScrollParams } from 'react-virtualized';
import { TimelineAction, TimelineRow } from '@keplar-404/timeline-engine';
import { TimelineEffect } from '@keplar-404/timeline-engine';

export interface EditData {
  /**
   * @description Timeline editing data
   */
  editorData: TimelineRow[];
  /**
   * @description Timeline action effect map
   */
  effects: Record<string, TimelineEffect>;
  /**
   * @description Scaling factor for individual scale marks (>0)
   * @default 1
   */
  scale?: number;
  /**
   * @description Minimum number of scale marks (>=1)
   * @default 20
   */
  minScaleCount?: number;
  /**
   * @description Maximum number of scale marks (>=minScaleCount)
   * @default Infinity
   */
  maxScaleCount?: number;
  /**
   * @description Number of subdivision units for a single scale mark (integer >0)
   * @default 10
   */
  scaleSplitCount?: number;
  /**
   * @description Display width of a single scale mark (>0, unit: px)
   * @default 160
   */
  scaleWidth?: number;
  /**
   * @description Distance from the start of the scale to the left edge (>=0, unit: px)
   * @default 20
   */
  startLeft?: number;
  /**
   * @description Default height for each editing row (>0, unit: px)
   * @default 32
   */
  rowHeight?: number;
  /**
   * @description Whether to enable grid movement snapping
   * @default false
   */
  gridSnap?: boolean;
  /**
   * @description Enable snapping to drag auxiliary lines
   * @default false
   */
  dragLine?: boolean;
  /**
   * @description Whether to hide the cursor
   * @default false
   */
  hideCursor?: boolean;
  /**
   * @description Prevent dragging in all action areas
   * @default false
   */
  disableDrag?: boolean;
  /**
   * @description Prevent dragging of all rows
   * @default false
   */
  enableRowDrag?: boolean;
  /**
   * @description Enable dragging action blocks between different rows
   * @default false
   */
  enableCrossRowDrag?: boolean;
  /**
   * @description Show a ghost/preview element following the cursor during cross-row block drag.
   * Set to `false` to disable the ghost entirely, or use `getGhostPreview` for a custom component.
   * @default true
   */
  enableGhostPreview?: boolean;
  /**
   * @description Custom render function for the drag ghost/preview element shown while
   * dragging a block across rows. When provided, replaces the default blue glowing box.
   *
   * The function receives the action being dragged and its source row, so you can
   * render a fully custom preview that matches your block's actual appearance.
   *
   * @param params - The action being dragged and the row it originated from
   * @returns A React node to render inside the ghost container
   *
   * @example
   * ```tsx
   * <Timeline
   *   enableCrossRowDrag
   *   getGhostPreview={({ action, row }) => (
   *     <div style={{ background: '#1a3a5c', border: '2px solid #3b82f6', height: '100%', borderRadius: 4, padding: '0 8px', display: 'flex', alignItems: 'center' }}>
   *       <span style={{ color: '#3b82f6', fontSize: 12 }}>{action.id}</span>
   *     </div>
   *   )}
   * />
   * ```
   */
  getGhostPreview?: (params: { action: TimelineAction; row: TimelineRow }) => ReactNode;
  /**
   * @description Timeline engine; uses the built-in engine if not provided
   */
  engine?: ITimelineEngine;
  /**
   * @description Custom action area rendering
   */
  getActionRender?: (action: TimelineAction, row: TimelineRow) => ReactNode;
  /**
   * @description Custom scale rendering
   */
  getScaleRender?: (scale: number) => ReactNode;
  /**
   * @description Callback when movement starts
   */
  onActionMoveStart?: (params: { action: TimelineAction; row: TimelineRow }) => void;
  /**
   * @description Movement callback (return false to prevent movement)
   */
  onActionMoving?: (params: { action: TimelineAction; row: TimelineRow; start: number; end: number }) => void | boolean;
  /**
   * @description Movement end callback (return false to prevent onChange from triggering)
   */
  onActionMoveEnd?: (params: { action: TimelineAction; row: TimelineRow; start: number; end: number }) => void;
  /**
   * @description Callback when resizing starts
   */
  onActionResizeStart?: (params: { action: TimelineAction; row: TimelineRow; dir: 'right' | 'left' }) => void;
  /**
   * @description Resizing callback (return false to prevent change)
   */
  onActionResizing?: (params: { action: TimelineAction; row: TimelineRow; start: number; end: number; dir: 'right' | 'left' }) => void | boolean;
  /**
   * @description Callback when resizing ends (return false to prevent onChange from triggering)
   */
  onActionResizeEnd?: (params: { action: TimelineAction; row: TimelineRow; start: number; end: number; dir: 'right' | 'left' }) => void;
  /**
   * @description Callback when a row is clicked
   */
  onClickRow?: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    param: {
      row: TimelineRow;
      time: number;
    },
  ) => void;
  /**
   * @description Callback when an action is clicked
   */
  onClickAction?: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    param: {
      action: TimelineAction;
      row: TimelineRow;
      time: number;
    },
  ) => void;
  /**
   * @description Callback when an action is clicked (not executed when drag is triggered)
   */
  onClickActionOnly?: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    param: {
      action: TimelineAction;
      row: TimelineRow;
      time: number;
    },
  ) => void;
  /**
   * @description Callback when a row is double-clicked
   */
  onDoubleClickRow?: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    param: {
      row: TimelineRow;
      time: number;
    },
  ) => void;
  /**
   * @description Callback when an action is double-clicked
   */
  onDoubleClickAction?: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    param: {
      action: TimelineAction;
      row: TimelineRow;
      time: number;
    },
  ) => void;
  /**
   * @description Callback when a row is right-clicked
   */
  onContextMenuRow?: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    param: {
      row: TimelineRow;
      time: number;
    },
  ) => void;
  /**
   * @description Callback when an action is right-clicked
   */
  onContextMenuAction?: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    param: {
      action: TimelineAction;
      row: TimelineRow;
      time: number;
    },
  ) => void;
  /**
   * @description Get a list of action IDs for auxiliary lines, calculated at move/resize start; defaults to all except the current moving action
   */
  getAssistDragLineActionIds?: (params: { action: TimelineAction; editorData: TimelineRow[]; row: TimelineRow }) => string[];
  /**
   * @description Cursor start drag event
   */
  onCursorDragStart?: (time: number) => void;
  /**
   * @description Cursor end drag event
   */
  onCursorDragEnd?: (time: number) => void;
  /**
   * @description Cursor drag event
   */
  onCursorDrag?: (time: number) => void;
  /**
   * @description Click on time area event; return false to prevent setting time
   */
  onClickTimeArea?: (time: number, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => boolean | undefined;
  /**
   * @description Row drag start callback
   * @param params row is the data of the row being dragged
   */
  onRowDragStart?: (params: { row: TimelineRow }) => void;
  /**
   * @description Row drag end callback
   * @param params row is the data of the row being dragged; editorData is the new data arrangement after the row is dragged
   * @returns
   */
  onRowDragEnd?: (params: { row: TimelineRow; editorData: TimelineRow[] }) => void;
}

export interface TimelineState {
  /** DOM node */
  target: HTMLElement | null;
  /** Execution listener */
  listener: Emitter<EventTypes>;
  /** Whether it is playing */
  isPlaying: boolean;
  /** Whether it is paused */
  isPaused: boolean;
  /** Set current playback time */
  setTime: (time: number) => void;
  /** Get current playback time */
  getTime: () => number;
  /** Set playback rate */
  setPlayRate: (rate: number) => void;
  /** Get playback rate */
  getPlayRate: () => number;
  /** Re-render current time */
  reRender: () => void;
  /** Play */
  play: (param: {
    /** Default run from start to end, priority greater than autoEnd */
    toTime?: number;
    /** Whether it is automatically end after playback */
    autoEnd?: boolean;
    /** List of actionIds to run; runs all by default if not provided */
    runActionIds?: string[];
  }) => boolean;
  /** Pause */
  pause: () => void;
  /** Set scroll left */
  setScrollLeft: (val: number) => void;
  /** Set scroll top */
  setScrollTop: (val: number) => void;
}

/**
 * Animation editor parameters
 * @export
 * @interface TimelineProp
 */
export interface TimelineEditor extends EditData {
  /**
   * @description Scroll distance of the editing area from the top (please use ref.setScrollTop instead)
   * @deprecated
   */
  scrollTop?: number;
  /**
   * @description Scroll callback for the editing area (used to control synchronization with scroll of editing rows)
   */
  onScroll?: (params: OnScrollParams) => void;
  /**
   * @description Whether to enable automatic scrolling during dragging
   * @default false
   */
  autoScroll?: boolean;
  /**
   * @description Custom timeline style
   */
  style?: React.CSSProperties;
  /**
   * @description Whether to re-render automatically (update tick when data changes or cursor time changes)
   * @default true
   */
  autoReRender?: boolean;
  /**
   * @description Data change callback, triggered after the end of an action operation changes data (returning false will prevent automatic engine synchronization, used to reduce performance overhead)
   */
  onChange?: (editorData: TimelineRow[]) => void | boolean;
}

// Define a utility type to make specified properties required
export type RequiredPick<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type RequiredEditData = RequiredPick<EditData, 'editorData' | 'effects' | 'scale' | 'scaleSplitCount' | 'scaleWidth' | 'startLeft' | 'minScaleCount' | 'maxScaleCount' | 'rowHeight'>;

export type RequiredTimelineEditor = RequiredPick<TimelineEditor, 'scrollTop'> & RequiredEditData;
