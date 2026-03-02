import React, {
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { AutoSizer, Grid, GridCellRenderer, OnScrollParams, ScrollParams } from 'react-virtualized';
import { TimelineAction, TimelineRow } from '@xzdarcy/timeline-engine';
import { CommonProp } from '../../interface/common_prop';
import { EditData } from '../../interface/timeline';
import { prefix } from '../../utils/deal_class_prefix';
import { parserPixelToTime, parserTimeToPixel } from '../../utils/deal_data';
import { DragLines } from './drag_lines';
import './edit_area.less';
import { EditRow } from './edit_row';
import { useDragLine } from './hooks/use_drag_line';
import { calculateTotalHeight, getRowHeights, isValidDragTarget } from './drag_utils';
import { InsertionLine } from './insertion_line';
import { DragPreview } from './drag_preview';
import {
  CrossRowDragProvider,
  CrossRowGhost,
  CrossRowDragState,
  useCrossRowDrag,
} from './cross_row_drag';

export type EditAreaProps = CommonProp & {
  /** Horizontal scroll offset */
  scrollLeft: number;
  /** Vertical scroll offset */
  scrollTop: number;
  /** Scroll callback for sync */
  onScroll: (params: OnScrollParams) => void;
  /** Update the editor data */
  setEditorData: (params: TimelineRow[]) => void;
  /** Horizontal auto-scroll delta */
  deltaScrollLeft: (scrollLeft: number) => void;
  /** Enable cross-row block drag */
  enableCrossRowDrag?: boolean;
  /** Show ghost preview while block dragging across rows */
  enableGhostPreview?: boolean;
  /**
   * Custom render function for the drag ghost element.
   * Replaces the default blue glowing box with your own component.
   */
  getGhostPreview?: (params: { action: TimelineAction; row: TimelineRow }) => React.ReactNode;
};

/** Edit area ref data */
export interface EditAreaState {
  domRef: React.MutableRefObject<HTMLDivElement | null>;
}

// ─────────────────────────────────────────────
// Row-reorder drag state (existing feature)
// ─────────────────────────────────────────────

interface RowDragState {
  isDragging: boolean;
  draggedRow: TimelineRow | null;
  draggedIndex: number;
  targetIndex: number;
  placeholderIndex: number;
  originalData: TimelineRow[];
  insertionLine: { visible: boolean; position: 'top' | 'bottom'; index: number };
  dragPreview: { visible: boolean; top: number; left: number; width: number; height: number };
}

const initialRowDragState: RowDragState = {
  isDragging: false,
  draggedRow: null,
  draggedIndex: -1,
  targetIndex: -1,
  placeholderIndex: -1,
  originalData: [],
  insertionLine: { visible: false, position: 'top', index: -1 },
  dragPreview: { visible: false, top: 0, left: 0, width: 0, height: 0 },
};

// ─────────────────────────────────────────────
// Inner component (has access to CrossRowDragProvider context)
// ─────────────────────────────────────────────

const EditAreaInner = React.forwardRef<EditAreaState, EditAreaProps>((props, ref) => {
  const {
    editorData,
    rowHeight,
    scaleWidth,
    scaleCount,
    startLeft,
    scrollLeft,
    scrollTop,
    scale,
    hideCursor = false,
    cursorTime,
    onScroll,
    dragLine,
    getAssistDragLineActionIds,
    onActionMoveEnd,
    onActionMoveStart,
    onActionMoving,
    onActionResizeEnd,
    onActionResizeStart,
    onActionResizing,
    enableRowDrag = false,
    onRowDragStart,
    onRowDragEnd,
    setEditorData,
    enableCrossRowDrag = false,
    enableGhostPreview = true,
    getGhostPreview,
  } = props;

  const { dragLineData, initDragLine, updateDragLine, disposeDragLine, defaultGetAssistPosition, defaultGetMovePosition } =
    useDragLine();

  const editAreaRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<Grid>(null);
  const heightRef = useRef(-1);
  const scrollToPositionRef = useRef({ scrollLeft, scrollTop });
  const onScrollParamsRef = useRef<ScrollParams>({
    clientHeight: 0,
    clientWidth: 0,
    scrollHeight: 0,
    scrollLeft: 0,
    scrollTop: 0,
    scrollWidth: 0,
  });

  // Row reorder drag state
  const [dragState, setDragState] = useState<RowDragState>(initialRowDragState);

  // Cross-row drag context
  const crossRowDrag = useCrossRowDrag();

  // Ghost state (mirrors context state so we can render without extra subscription)
  const [ghostState, setGhostState] = useState<CrossRowDragState>(crossRowDrag.state);

  useEffect(() => {
    setGhostState(crossRowDrag.state);
  }, [crossRowDrag.state]);

  // ─── ref ───
  useImperativeHandle(ref, () => ({ get domRef() { return editAreaRef; } }));

  // ─────────────────────────────────────────────
  // Cross-row drag: resolve commit
  // ─────────────────────────────────────────────

  /**
   * Given a clientX position, compute new start/end times for the action placed
   * into the target row.
   */
  const resolveNewTimes = useCallback(
    (clientX: number, action: TimelineAction, grabOffsetX: number) => {
      if (!editAreaRef.current) return { newStart: action.start, newEnd: action.end };

      const rect = editAreaRef.current.getBoundingClientRect();
      // x relative to the edit area (accounting for current horizontal scroll)
      const x = clientX - rect.left + scrollToPositionRef.current.scrollLeft - grabOffsetX;
      const newStart = parserPixelToTime(x, { startLeft, scale, scaleWidth });
      const duration = action.end - action.start;
      const newEnd = newStart + duration;
      return { newStart: Math.max(0, newStart), newEnd: Math.max(duration, newEnd) };
    },
    [startLeft, scale, scaleWidth],
  );

  /**
   * Given a clientY, determine which row index the cursor is over.
   */
  const resolveTargetRow = useCallback(
    (clientY: number): number => {
      if (!editAreaRef.current) return -1;

      const rect = editAreaRef.current.getBoundingClientRect();
      const viewportY = clientY - rect.top + scrollToPositionRef.current.scrollTop;

      let currentTop = 0;
      for (let i = 0; i < editorData.length; i++) {
        const rh = editorData[i]?.rowHeight || rowHeight;
        if (viewportY >= currentTop && viewportY < currentTop + rh) return i;
        currentTop += rh;
      }
      return editorData.length - 1;
    },
    [editorData, rowHeight],
  );

  // Register the commit handler into the cross-row context
  useEffect(() => {
    crossRowDrag.setOnCommit((action, sourceRow, _placeholder, clientX, clientY) => {
      const targetRowIndex = resolveTargetRow(clientY as unknown as number);
      if (targetRowIndex < 0) return;

      const targetRow = editorData[targetRowIndex];
      if (!targetRow) return;

      // Don't move if dropped on the same row
      if (targetRow.id === sourceRow.id) {
        // Still update position within the same row from cursor X
        const { newStart, newEnd } = resolveNewTimes(clientX as unknown as number, action, crossRowDrag.state.grabOffsetX);
        const newData = editorData.map((r) => {
          if (r.id !== sourceRow.id) return r;
          return {
            ...r,
            actions: r.actions.map((a) => (a.id !== action.id ? a : { ...a, start: newStart, end: newEnd })),
          };
        });
        setEditorData(newData);
        return;
      }

      // Cross-row: remove from source, add to target
      const { newStart, newEnd } = resolveNewTimes(clientX as unknown as number, action, crossRowDrag.state.grabOffsetX);
      const updatedAction: TimelineAction = { ...action, start: newStart, end: newEnd };

      const newData = editorData.map((r) => {
        if (r.id === sourceRow.id) {
          return { ...r, actions: r.actions.filter((a) => a.id !== action.id) };
        }
        if (r.id === targetRow.id) {
          return { ...r, actions: [...r.actions, updatedAction] };
        }
        return r;
      });

      setEditorData(newData);
    });
  }, [crossRowDrag, editorData, resolveTargetRow, resolveNewTimes, setEditorData]);

  // ─────────────────────────────────────────────
  // Row reorder drag (existing feature)
  // ─────────────────────────────────────────────

  const reorderRows = useCallback((data: TimelineRow[], fromIndex: number, toIndex: number): TimelineRow[] => {
    const result = [...data];
    if (toIndex > fromIndex && toIndex < data.length) toIndex = toIndex - 1;
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    return result;
  }, []);

  const calculateTargetIndex = useCallback(
    (clientY: number): { index: number; position: 'top' | 'bottom' } => {
      if (!editAreaRef.current) return { index: -1, position: 'top' };
      const rect = editAreaRef.current.getBoundingClientRect();
      const viewportTop = clientY - rect.top + scrollToPositionRef.current.scrollTop;
      const rowCount = editorData.length;
      let currentTop = 0;
      if (rowCount > 0 && viewportTop < 0) return { index: 0, position: 'top' };
      for (let i = 0; i < rowCount; i++) {
        const rh = editorData[i]?.rowHeight || rowHeight;
        const bottom = currentTop + rh;
        if (viewportTop >= currentTop && viewportTop <= bottom) {
          return Math.abs(viewportTop - currentTop) < Math.abs(viewportTop - bottom)
            ? { index: i, position: 'top' }
            : { index: i + 1, position: 'top' };
        }
        currentTop = bottom;
      }
      return { index: rowCount, position: 'top' };
    },
    [editorData, rowHeight],
  );

  const calculateDragPreviewPosition = useCallback(
    (clientY: number, previewHeight: number) => {
      if (!editAreaRef.current) return 0;
      const rect = editAreaRef.current.getBoundingClientRect();
      let top = clientY - rect.top - previewHeight / 2;
      top = Math.max(0, Math.min(top, rect.height - previewHeight));
      return top;
    },
    [scrollTop],
  );

  const calculateRowAccumulatedHeight = useCallback(
    (rowIndex: number): number => {
      let h = 0;
      for (let i = 0; i < rowIndex; i++) h += editorData[i]?.rowHeight || rowHeight;
      return Math.max(0, h - scrollTop);
    },
    [editorData, scrollTop, rowHeight],
  );

  const initializeDragState = useCallback(
    (row: TimelineRow, rowIndex: number) => {
      const originalData = [...editorData];
      const ph = row.rowHeight || rowHeight;
      return {
        isDragging: true,
        draggedRow: row,
        draggedIndex: rowIndex,
        targetIndex: -1,
        placeholderIndex: rowIndex,
        originalData,
        insertionLine: { visible: false, position: 'top' as const, index: -1 },
        dragPreview: { visible: true, top: calculateRowAccumulatedHeight(rowIndex), left: 0, width: 0, height: ph },
      };
    },
    [editorData, rowHeight, calculateRowAccumulatedHeight],
  );

  const updateRowDragState = useCallback(
    (currentState: RowDragState, targetIndex: number, previewTop: number, rowIndex: number) => {
      if (currentState.targetIndex === targetIndex && currentState.dragPreview.top === previewTop)
        return currentState;
      return {
        ...currentState,
        targetIndex,
        placeholderIndex: targetIndex > rowIndex ? targetIndex - 1 : targetIndex,
        insertionLine: {
          visible: targetIndex !== -1 && targetIndex !== rowIndex,
          position: 'top' as const,
          index: targetIndex,
        },
        dragPreview: { ...currentState.dragPreview, top: previewTop },
      };
    },
    [],
  );

  const handleRowDragEnd = useCallback(
    (draggedIndex: number, targetIndex: number, draggedRow: TimelineRow | null, originalData: TimelineRow[]) => {
      if (isValidDragTarget(targetIndex, draggedIndex, editorData.length)) {
        const newData = reorderRows(editorData, draggedIndex, targetIndex);
        setEditorData(newData);
        onRowDragEnd?.({ row: draggedRow!, editorData: newData });
      } else {
        setEditorData(originalData);
      }
    },
    [editorData, reorderRows, setEditorData, onRowDragEnd],
  );

  const handleRowDragStart = useCallback(
    (row: TimelineRow, rowIndex: number) => {
      if (!enableRowDrag) return;
      const initState = initializeDragState(row, rowIndex);
      setDragState(initState);
      onRowDragStart?.({ row });

      let animationFrameId: number | null = null;
      let autoScrollAnimationFrameId: number | null = null;
      let lastUpdateTime = 0;
      const UPDATE_INTERVAL = 16;
      let currentMouseY = 0;
      let isDraggingLocal = false;

      const updateDragPosition = (mouseY: number) => {
        const now = Date.now();
        if (now - lastUpdateTime >= UPDATE_INTERVAL) {
          const targetInfo = calculateTargetIndex(mouseY);
          const previewTop = calculateDragPreviewPosition(mouseY, initState.dragPreview.height);
          setDragState((prev) => updateRowDragState(prev, targetInfo.index, previewTop, rowIndex));
          lastUpdateTime = now;
        }
      };

      const checkAndScroll = () => {
        if (!isDraggingLocal) return (autoScrollAnimationFrameId = requestAnimationFrame(checkAndScroll)) as unknown as void;

        if (editAreaRef.current && gridRef.current) {
          const gridEl = editAreaRef.current.querySelector('.ReactVirtualized__Grid') as HTMLElement | null;
          if (gridEl) {
            const gr = gridEl.getBoundingClientRect();
            const mouseY = currentMouseY - gr.top;
            const threshold = 50;
            const speed = 10;
            if (mouseY < threshold) {
              onScroll({ ...onScrollParamsRef.current, scrollTop: Math.max(0, gridEl.scrollTop - speed) });
              updateDragPosition(currentMouseY);
            } else if (mouseY > gr.height - threshold) {
              onScroll({
                ...onScrollParamsRef.current,
                scrollTop: Math.min(gridEl.scrollTop + speed, gridEl.scrollHeight - gr.height),
              });
              updateDragPosition(currentMouseY);
            }
          }
        }
        autoScrollAnimationFrameId = requestAnimationFrame(checkAndScroll);
      };

      autoScrollAnimationFrameId = requestAnimationFrame(checkAndScroll);

      const handleMouseMove = (me: MouseEvent) => {
        isDraggingLocal = true;
        currentMouseY = me.clientY;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(() => {
          updateDragPosition(currentMouseY);
          animationFrameId = null;
        });
      };

      const handleMouseUp = () => {
        isDraggingLocal = false;
        if (animationFrameId) { cancelAnimationFrame(animationFrameId); animationFrameId = null; }
        if (autoScrollAnimationFrameId) { cancelAnimationFrame(autoScrollAnimationFrameId); autoScrollAnimationFrameId = null; }

        setDragState((prevState) => {
          const { draggedIndex, targetIndex, originalData, draggedRow } = prevState;
          setTimeout(() => handleRowDragEnd(draggedIndex, targetIndex, draggedRow, originalData), 0);
          return {
            ...initialRowDragState,
            dragPreview: { ...initialRowDragState.dragPreview, visible: false },
            insertionLine: { ...initialRowDragState.insertionLine, visible: false },
          };
        });

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [enableRowDrag, onRowDragStart, initializeDragState, calculateTargetIndex, calculateDragPreviewPosition, updateRowDragState, handleRowDragEnd, scrollTop],
  );

  // ─────────────────────────────────────────────
  // Drag line (same-row assist lines)
  // ─────────────────────────────────────────────

  const handleInitDragLine: EditData['onActionMoveStart'] = (data) => {
    if (dragLine) {
      const assistActionIds =
        getAssistDragLineActionIds &&
        getAssistDragLineActionIds({ action: data.action, row: data.row, editorData });
      const cursorLeft = parserTimeToPixel(cursorTime, { scaleWidth, scale, startLeft });
      const assistPositions = defaultGetAssistPosition({
        editorData,
        assistActionIds,
        action: data.action,
        row: data.row,
        scale,
        scaleWidth,
        startLeft,
        hideCursor,
        cursorLeft,
      });
      initDragLine({ assistPositions });
    }
  };

  const handleUpdateDragLine: EditData['onActionMoving'] = (data) => {
    if (dragLine) {
      const movePositions = defaultGetMovePosition({ ...data, startLeft, scaleWidth, scale });
      updateDragLine({ movePositions });
    }
  };

  // ─────────────────────────────────────────────
  // Cell renderer
  // ─────────────────────────────────────────────

  const cellRenderer: GridCellRenderer = ({ rowIndex, key, style }) => {
    const row = editorData[rowIndex];
    return (
      <EditRow
        {...props}
        style={{
          ...style,
          backgroundPositionX: `0, ${startLeft}px`,
          backgroundSize: `${startLeft}px, ${scaleWidth}px`,
        }}
        areaRef={editAreaRef}
        key={key}
        rowHeight={row?.rowHeight || rowHeight}
        rowData={row}
        dragLineData={dragLineData}
        rowIndex={rowIndex}
        dragState={{ isDragging: dragState.draggedIndex !== -1, draggedIndex: dragState.draggedIndex }}
        enableCrossRowDrag={enableCrossRowDrag}
        enableGhostPreview={enableGhostPreview}
        onRowDragStart={(params) => handleRowDragStart(params.row, rowIndex)}
        onActionMoveStart={(data) => {
          handleInitDragLine(data);
          return onActionMoveStart && onActionMoveStart(data);
        }}
        onActionResizeStart={(data) => {
          handleInitDragLine(data);
          return onActionResizeStart && onActionResizeStart(data);
        }}
        onActionMoving={(data) => {
          handleUpdateDragLine(data);
          return onActionMoving && onActionMoving(data);
        }}
        onActionResizing={(data) => {
          handleUpdateDragLine(data);
          return onActionResizing && onActionResizing(data);
        }}
        onActionResizeEnd={(data) => {
          disposeDragLine();
          return onActionResizeEnd && onActionResizeEnd(data);
        }}
        onActionMoveEnd={(data) => {
          disposeDragLine();
          return onActionMoveEnd && onActionMoveEnd(data);
        }}
      />
    );
  };

  // ─────────────────────────────────────────────
  // Scroll sync
  // ─────────────────────────────────────────────

  useLayoutEffect(() => {
    gridRef.current?.scrollToPosition({ scrollTop, scrollLeft });
    scrollToPositionRef.current = { scrollTop, scrollLeft };
  }, [scrollTop, scrollLeft]);

  useEffect(() => {
    gridRef.current?.recomputeGridSize();
  }, [editorData]);

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────

  return (
    <div ref={editAreaRef} className={prefix('edit-area')}>
      <AutoSizer>
        {({ width, height }) => {
          const totalHeight = calculateTotalHeight(editorData, rowHeight);
          const heights = getRowHeights(editorData, rowHeight);
          if (totalHeight < height) {
            heights.push(height - totalHeight);
            if (heightRef.current !== height && heightRef.current >= 0) {
              setTimeout(() =>
                gridRef.current?.recomputeGridSize({ rowIndex: heights.length - 1 }),
              );
            }
          }
          heightRef.current = height;

          return (
            <>
              <Grid
                columnCount={1}
                rowCount={heights.length}
                ref={gridRef}
                cellRenderer={cellRenderer}
                columnWidth={Math.max(scaleCount * scaleWidth + startLeft, width)}
                width={width}
                height={height}
                rowHeight={({ index }) => heights[index] || rowHeight}
                overscanRowCount={10}
                overscanColumnCount={0}
                onScroll={(param) => {
                  onScrollParamsRef.current = param;
                  onScroll(param);
                }}
              />
              {/* Row insertion line (row reorder) */}
              <InsertionLine top={calculateRowAccumulatedHeight(dragState.insertionLine.index)} visible={dragState.insertionLine.visible} />
              {/* Row drag preview (row reorder) */}
              <DragPreview top={dragState.dragPreview.top} height={dragState.dragPreview.height} visible={dragState.dragPreview.visible} />
              {/* Block ghost preview (cross-row block drag) */}
              <CrossRowGhost
                state={ghostState}
                enableGhostPreview={enableGhostPreview}
                getGhostPreview={getGhostPreview}
              />
            </>
          );
        }}
      </AutoSizer>
      {dragLine && <DragLines scrollLeft={scrollLeft} {...dragLineData} />}
    </div>
  );
});

EditAreaInner.displayName = 'EditAreaInner';

// ─────────────────────────────────────────────
// Public export — wraps inner with provider
// ─────────────────────────────────────────────

export const EditArea = React.forwardRef<EditAreaState, EditAreaProps>((props, ref) => (
  <CrossRowDragProvider>
    <EditAreaInner {...props} ref={ref} />
  </CrossRowDragProvider>
));

EditArea.displayName = 'EditArea';
