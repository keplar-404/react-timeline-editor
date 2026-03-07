import React, { FC } from 'react';
import { prefix } from '../../utils/deal_class_prefix';

interface DragPreviewProps {
  /** Top position of the preview element */
  top: number;
  /** Height of the preview element */
  height: number;
  /** Whether the preview element is visible */
  visible: boolean;
}

/**
 * Drag preview component - displays a preview of the row being dragged
 */
export const DragPreview: FC<DragPreviewProps> = ({ top, height, visible }) => {
  if (!visible) {
    return null;
  }

  return (
    <div
      className={prefix('edit-area-drag-preview')}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top,
        height,
        background: 'rgba(74, 144, 226, 0.3)',
        border: '2px dashed #4a90e2',
        borderRadius: '4px',
        zIndex: 1001,
        pointerEvents: 'none',
        opacity: 0.8,
      }}
    >
      <div
        style={{
          padding: '8px 16px',
          color: '#4a90e2',
          fontSize: '12px',
          fontWeight: 'bold',
        }}
      >
        Dragging...
      </div>
    </div>
  );
};
