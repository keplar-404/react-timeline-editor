import React, { FC, useRef, useCallback } from 'react';
import { TimelineAction, TimelineRow } from '@xzdarcy/timeline-engine';
import { CommonProp } from '../../interface/common_prop';
import { prefix } from '../../utils/deal_class_prefix';
import { parserPixelToTime } from '../../utils/deal_data';
import { DragLineData } from './drag_lines';
import { EditAction } from './edit_action';
import './edit_row.less';

export type EditRowProps = CommonProp & {
  areaRef: React.RefObject<HTMLDivElement>;
  rowData?: TimelineRow;
  style?: React.CSSProperties;
  dragLineData: DragLineData;
  setEditorData: (params: TimelineRow[]) => void;
  /** Horizontal scroll offset */
  scrollLeft: number;
  /** Horizontal scroll delta */
  deltaScrollLeft: (scrollLeft: number) => void;
  /** Row index in the editor data array */
  rowIndex?: number;
  /** Current row-reorder drag state */
  dragState?: {
    isDragging: boolean;
    draggedIndex: number;
  };
  /** Enable cross-row block drag */
  enableCrossRowDrag?: boolean;
  /** Show ghost preview while block dragging across rows */
  enableGhostPreview?: boolean;
  /** Enable cut mode — Alt+Click splits block at cursor point */
  enableCut?: boolean;
  /** Fired after a successful cut */
  onActionCut?: (params: { action: import('@xzdarcy/timeline-engine').TimelineAction; row: import('@xzdarcy/timeline-engine').TimelineRow; leftAction: import('@xzdarcy/timeline-engine').TimelineAction; rightAction: import('@xzdarcy/timeline-engine').TimelineAction }) => void;
};

export const EditRow: FC<EditRowProps> = (props) => {
  const {
    rowData,
    style = {},
    onClickRow,
    onDoubleClickRow,
    onContextMenuRow,
    areaRef,
    scrollLeft,
    startLeft,
    scale,
    scaleWidth,
    enableRowDrag,
    onRowDragStart,
    rowIndex = -1,
    dragState,
    enableCrossRowDrag,
    enableGhostPreview,
  } = props;

  const classNames = ['edit-row'];
  if (rowData?.selected) classNames.push('edit-row-selected');
  if (dragState?.isDragging && dragState.draggedIndex === rowIndex) {
    classNames.push('edit-row-dragging');
  }

  const dragHandleRef = useRef<HTMLDivElement>(null);

  const handleTime = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!areaRef.current) return 0;
    const rect = areaRef.current.getBoundingClientRect();
    const position = e.clientX - rect.x;
    const left = position + scrollLeft;
    return parserPixelToTime(left, { startLeft, scale, scaleWidth });
  };

  // Row-reorder drag handle
  const handleDragHandleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!enableRowDrag || !rowData || rowIndex === -1) return;
      e.preventDefault();
      e.stopPropagation();
      onRowDragStart?.({ row: rowData });
    },
    [enableRowDrag, rowData, rowIndex, onRowDragStart],
  );

  return (
    <div
      className={`${prefix(...classNames)} ${(rowData?.classNames || []).join(' ')}`}
      style={style}
      onClick={(e) => {
        if (rowData && onClickRow) {
          const time = handleTime(e);
          onClickRow(e, { row: rowData, time });
        }
      }}
      onDoubleClick={(e) => {
        if (rowData && onDoubleClickRow) {
          const time = handleTime(e);
          onDoubleClickRow(e, { row: rowData, time });
        }
      }}
      onContextMenu={(e) => {
        if (rowData && onContextMenuRow) {
          const time = handleTime(e);
          onContextMenuRow(e, { row: rowData, time });
        }
      }}
    >
      {/* Row-reorder drag handle */}
      {enableRowDrag && rowData && (
        <div
          ref={dragHandleRef}
          className={prefix('edit-row-drag-handle')}
          onMouseDown={handleDragHandleMouseDown}
          title="Drag to reorder row"
        >
          ⋮⋮
        </div>
      )}

      {(rowData?.actions || []).map((action: TimelineAction) => (
        <EditAction
          key={action.id}
          {...props}
          handleTime={handleTime}
          row={rowData!}
          action={action}
          enableCrossRowDrag={enableCrossRowDrag}
          enableGhostPreview={enableGhostPreview}
        />
      ))}
    </div>
  );
};
