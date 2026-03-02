import React, { FC, useLayoutEffect, useRef, useState, useCallback, useEffect } from 'react';
import { TimelineAction, TimelineRow } from '@xzdarcy/timeline-engine';
import { CommonProp } from '../../interface/common_prop';
import { DEFAULT_ADSORPTION_DISTANCE, DEFAULT_MOVE_GRID } from '../../interface/const';
import { prefix } from '../../utils/deal_class_prefix';
import { getScaleCountByPixel, parserTimeToPixel, parserTimeToTransform, parserTransformToTime } from '../../utils/deal_data';
import { RowDnd } from '../row_rnd/row_rnd';
import {
  RndDragCallback,
  RndDragEndCallback,
  RndDragStartCallback,
  RndResizeCallback,
  RndResizeEndCallback,
  RndResizeStartCallback,
  RowRndApi,
} from '../row_rnd/row_rnd_interface';
import { DragLineData } from './drag_lines';
import { useCrossRowDrag } from './cross_row_drag';
import './edit_action.less';

export type EditActionProps = CommonProp & {
  row: TimelineRow;
  action: TimelineAction;
  dragLineData: DragLineData;
  setEditorData: (params: TimelineRow[]) => void;
  handleTime: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => number;
  areaRef: React.RefObject<HTMLDivElement>;
  /** Scroll delta, used for auto-scroll sync */
  deltaScrollLeft?: (delta: number) => void;
  /** Enable dragging a block to a different row */
  enableCrossRowDrag?: boolean;
  /** Show ghost element while dragging */
  enableGhostPreview?: boolean;
  /** Enable cut mode — Alt+Click splits block at cursor point */
  enableCut?: boolean;
  /** Fired after a successful cut */
  onActionCut?: (params: { action: TimelineAction; row: TimelineRow; leftAction: TimelineAction; rightAction: TimelineAction }) => void;
};

export const EditAction: FC<EditActionProps> = ({
  editorData,
  row,
  action,
  effects,
  rowHeight,
  scale,
  scaleWidth,
  scaleSplitCount,
  startLeft,
  gridSnap,
  disableDrag,

  scaleCount,
  maxScaleCount,
  setScaleCount,
  onActionMoveStart,
  onActionMoving,
  onActionMoveEnd,
  onActionResizeStart,
  onActionResizeEnd,
  onActionResizing,

  dragLineData,
  setEditorData,
  onClickAction,
  onClickActionOnly,
  onDoubleClickAction,
  onContextMenuAction,
  getActionRender,
  handleTime,
  areaRef,
  deltaScrollLeft,
  enableCrossRowDrag = false,
  enableGhostPreview = true,
  enableCut = false,
  onActionCut,
}) => {
  const rowRnd = useRef<RowRndApi>(null);
  const isDragWhenClick = useRef(false);
  // Track if we used the cross-row system (to suppress the native drag commit)
  const isCrossRowDragging = useRef(false);
  // Visual glow while this specific block is being cross-row dragged
  const [isGlowing, setIsGlowing] = useState(false);
  // Track whether Alt is currently pressed (for scissors cursor)
  const [isAltPressed, setIsAltPressed] = useState(false);

  const { id, maxEnd, minStart, end, start, selected, flexible = true, movable = true, effectId } = action;

  // ───── pixel bounds ─────
  const leftLimit = parserTimeToPixel(minStart || 0, { startLeft, scale, scaleWidth });
  const rightLimit = Math.min(
    maxScaleCount * scaleWidth + startLeft,
    parserTimeToPixel(maxEnd || Number.MAX_VALUE, { startLeft, scale, scaleWidth }),
  );

  // ───── transform state ─────
  const [transform, setTransform] = useState(() =>
    parserTimeToTransform({ start, end }, { startLeft, scale, scaleWidth }),
  );

  useLayoutEffect(() => {
    setTransform(parserTimeToTransform({ start, end }, { startLeft, scale, scaleWidth }));
  }, [end, start, startLeft, scaleWidth, scale]);

  const gridSize = scaleWidth / scaleSplitCount;

  // ───── class names ─────
  const classNames = ['action'];
  if (movable) classNames.push('action-movable');
  if (selected) classNames.push('action-selected');
  if (flexible) classNames.push('action-flexible');
  if (effects[effectId]) classNames.push(`action-effect-${effectId}`);
  if (isGlowing) classNames.push('action-cross-row-dragging');

  // ───── cross-row drag context ─────
  let crossRowDrag: ReturnType<typeof useCrossRowDrag> | null = null;
  try {
    crossRowDrag = useCrossRowDrag();
  } catch {
    // not inside provider, cross-row drag is disabled
  }

  // ───── Alt-key tracking for scissors cursor ─────
  useEffect(() => {
    if (!enableCut) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.altKey) setIsAltPressed(true); };
    const onKeyUp = (e: KeyboardEvent) => { if (!e.altKey) setIsAltPressed(false); };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    // Also reset on window blur (user alt-tabs)
    window.addEventListener('blur', () => setIsAltPressed(false));
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [enableCut]);

  // ───── Cut action ─────
  const handleCut = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const cutTime = handleTime(e);

      // Guard: cut point must be strictly inside the block (not at edges)
      if (cutTime <= action.start || cutTime >= action.end) return;

      const leftAction: TimelineAction = {
        ...action,
        end: cutTime,
        // Give the right half a stable unique id
      };
      const rightAction: TimelineAction = {
        ...action,
        id: `${action.id}_cut_${Date.now()}`,
        start: cutTime,
      };

      const newData = editorData.map((r) => {
        if (r.id !== row.id) return r;
        const newActions = r.actions.flatMap((a) =>
          a.id === action.id ? [leftAction, rightAction] : [a],
        );
        return { ...r, actions: newActions };
      });

      setEditorData(newData);
      onActionCut?.({ action, row, leftAction, rightAction });
    },
    [action, row, editorData, setEditorData, handleTime, onActionCut],
  );

  // ───── scale count helper ─────
  const handleScaleCount = (left: number, width: number) => {
    const curScaleCount = getScaleCountByPixel(left + width, { startLeft, scaleCount, scaleWidth });
    if (curScaleCount !== scaleCount) setScaleCount(curScaleCount);
  };

  // ─────────────────────────────────────────────────────────────
  // Native (same-row) drag callbacks
  // ─────────────────────────────────────────────────────────────
  const handleDragStart: RndDragStartCallback = () => {
    if (isCrossRowDragging.current) return;
    onActionMoveStart && onActionMoveStart({ action, row });
  };

  const handleDrag: RndDragCallback = ({ left, width }) => {
    if (isCrossRowDragging.current) return false;
    isDragWhenClick.current = true;

    if (onActionMoving) {
      const { start, end } = parserTransformToTime({ left, width }, { scaleWidth, scale, startLeft });
      const result = onActionMoving({ action, row, start, end });
      if (result === false) return false;
    }
    setTransform({ left, width });
    handleScaleCount(left, width);
  };

  const handleDragEnd: RndDragEndCallback = ({ left, width }) => {
    if (isCrossRowDragging.current) {
      // Cross-row system handles the commit; just reset the interactjs element position
      setTransform(parserTimeToTransform({ start, end }, { startLeft, scale, scaleWidth }));
      return;
    }

    const { start: newStart, end: newEnd } = parserTransformToTime({ left, width }, { scaleWidth, scale, startLeft });

    const rowItem = editorData.find((item: TimelineRow) => item.id === row.id);
    if (!rowItem) return;
    const foundAction = rowItem.actions.find((item: TimelineAction) => item.id === id);
    if (!foundAction) return;
    foundAction.start = newStart;
    foundAction.end = newEnd;
    setEditorData([...editorData]);

    if (onActionMoveEnd) onActionMoveEnd({ action, row, start: newStart, end: newEnd });
  };

  const handleResizeStart: RndResizeStartCallback = (dir) => {
    onActionResizeStart && onActionResizeStart({ action, row, dir });
  };

  const handleResizing: RndResizeCallback = (dir, { left, width }) => {
    isDragWhenClick.current = true;
    if (onActionResizing) {
      const { start, end } = parserTransformToTime({ left, width }, { scaleWidth, scale, startLeft });
      const result = onActionResizing({ action, row, start, end, dir });
      if (result === false) return false;
    }
    setTransform({ left, width });
    handleScaleCount(left, width);
  };

  const handleResizeEnd: RndResizeEndCallback = (dir, { left, width }) => {
    const { start: newStart, end: newEnd } = parserTransformToTime({ left, width }, { scaleWidth, scale, startLeft });

    const rowItem = editorData.find((item: TimelineRow) => item.id === row.id);
    if (!rowItem) return;
    const foundAction = rowItem.actions.find((item: TimelineAction) => item.id === id);
    if (!foundAction) return;
    foundAction.start = newStart;
    foundAction.end = newEnd;
    setEditorData([...editorData]);

    if (onActionResizeEnd) onActionResizeEnd({ action, row, start: newStart, end: newEnd, dir });
  };

  // ─────────────────────────────────────────────────────────────
  // Cross-row block drag — initiated from the whole block body
  // ─────────────────────────────────────────────────────────────
  const handleBlockMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Only fire for cross-row drag when enabled and not from a resize handle
      if (!enableCrossRowDrag || !movable || disableDrag) return;
      if (!crossRowDrag) return;

      // Don't steal right-handle resize clicks (resize handles have their own selector)
      const target = e.target as HTMLElement;
      if (target.classList.contains(prefix('action-left-stretch')) || target.classList.contains(prefix('action-right-stretch'))) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      isDragWhenClick.current = false;
      isCrossRowDragging.current = false;

      // Measure the DOM element that RowDnd wraps
      const actionEl = (e.currentTarget as HTMLDivElement).closest('[data-width]') as HTMLElement | null;
      const ghostW = actionEl ? parseFloat(actionEl.dataset.width || '0') || actionEl.offsetWidth : transform.width;
      const ghostH = rowHeight;

      // Where the user clicked relative to the block
      const blockRect = e.currentTarget.getBoundingClientRect();
      const grabOffsetX = e.clientX - blockRect.left;

      let hasMoved = false;
      let committed = false;
      setIsGlowing(false);

      const onMouseMove = (me: MouseEvent) => {
        if (!hasMoved && Math.abs(me.clientX - e.clientX) < 4 && Math.abs(me.clientY - e.clientY) < 4) return;
        hasMoved = true;
        isDragWhenClick.current = true;

        if (!isCrossRowDragging.current) {
          isCrossRowDragging.current = true;
          setIsGlowing(true);
          crossRowDrag!.startCrossRowDrag({
            action,
            sourceRow: row,
            ghostWidth: ghostW,
            ghostHeight: ghostH,
            grabOffsetX,
            initialX: me.clientX,
            initialY: me.clientY,
          });
        } else {
          // Update cursor position in context by firing a custom event the EditArea listens to
          crossRowDrag!.startCrossRowDrag({
            action,
            sourceRow: row,
            ghostWidth: ghostW,
            ghostHeight: ghostH,
            grabOffsetX,
            initialX: me.clientX,
            initialY: me.clientY,
          });
        }
      };

      const onMouseUp = (me: MouseEvent) => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        setIsGlowing(false);

        if (!isCrossRowDragging.current || !hasMoved) {
          isCrossRowDragging.current = false;
          crossRowDrag!.endCrossRowDrag();
          return;
        }

        committed = true;
        isCrossRowDragging.current = false;

        // Delegate the commit to EditArea via context
        crossRowDrag!.onCommit(action, row, row /* placeholder; EditArea resolves target */, me.clientX, me.clientY);
        crossRowDrag!.endCrossRowDrag();
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [enableCrossRowDrag, movable, disableDrag, crossRowDrag, action, row, transform.width, rowHeight, startLeft, scaleWidth, scale],
  );

  // ───── render ─────
  const nowAction = {
    ...action,
    ...parserTransformToTime({ left: transform.left, width: transform.width }, { startLeft, scaleWidth, scale }),
  };

  const nowRow: TimelineRow = {
    ...row,
    actions: [...row.actions],
  };
  if (row.actions.includes(action)) {
    nowRow.actions[row.actions.indexOf(action)] = nowAction;
  }

  return (
    <RowDnd
      ref={rowRnd}
      parentRef={areaRef}
      start={startLeft}
      left={transform.left}
      width={transform.width}
      grid={(gridSnap && gridSize) || DEFAULT_MOVE_GRID}
      adsorptionDistance={
        gridSnap ? Math.max((gridSize || DEFAULT_MOVE_GRID) / 2, DEFAULT_ADSORPTION_DISTANCE) : DEFAULT_ADSORPTION_DISTANCE
      }
      adsorptionPositions={dragLineData.assistPositions}
      bounds={{ left: leftLimit, right: rightLimit }}
      edges={{
        left: !disableDrag && flexible && `.${prefix('action-left-stretch')}`,
        right: !disableDrag && flexible && `.${prefix('action-right-stretch')}`,
      }}
      enableDragging={!disableDrag && movable && !enableCrossRowDrag}
      enableResizing={!disableDrag && flexible}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onResizeStart={handleResizeStart}
      onResize={handleResizing}
      onResizeEnd={handleResizeEnd}
      deltaScrollLeft={deltaScrollLeft}
    >
      <div
        onMouseDown={(e) => {
          isDragWhenClick.current = false;
          // In cut mode with Alt held, skip drag so the click can cut
          if (enableCut && e.altKey) return;
          // Initiate cross-row drag from the whole block
          if (enableCrossRowDrag && movable && !disableDrag) {
            handleBlockMouseDown(e);
          }
        }}
        onClick={(e) => {
          // ── Cut mode: Alt+Click splits the block ──
          if (enableCut && e.altKey) {
            e.stopPropagation();
            handleCut(e);
            return;
          }
          let time: number | undefined;
          if (onClickAction) {
            time = handleTime(e);
            onClickAction(e, { row, action, time });
          }
          if (!isDragWhenClick.current && onClickActionOnly) {
            if (!time) time = handleTime(e);
            onClickActionOnly(e, { row, action, time });
          }
        }}
        onDoubleClick={(e) => {
          if (onDoubleClickAction) {
            const time = handleTime(e);
            onDoubleClickAction(e, { row, action, time });
          }
        }}
        onContextMenu={(e) => {
          if (onContextMenuAction) {
            const time = handleTime(e);
            onContextMenuAction(e, { row, action, time });
          }
        }}
        className={prefix((classNames || []).join(' '))}
        style={{
          height: rowHeight,
          cursor: (() => {
            if (enableCut && isAltPressed) return 'crosshair';
            if (enableCrossRowDrag && movable && !disableDrag) return 'grab';
            return undefined;
          })(),
        }}
      >
        {getActionRender && getActionRender(nowAction, nowRow)}
        {flexible && <div className={prefix('action-left-stretch')} />}
        {flexible && <div className={prefix('action-right-stretch')} />}
      </div>
    </RowDnd>
  );
};
