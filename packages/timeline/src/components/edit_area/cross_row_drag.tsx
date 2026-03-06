import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { TimelineAction, TimelineRow } from '@keplar-404/timeline-engine';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface CrossRowDragState {
  isDragging: boolean;
  /** The action currently being dragged across rows */
  action: TimelineAction | null;
  /** The source row (where the action came from) */
  sourceRow: TimelineRow | null;
  /** Visual width of the ghost (px) */
  ghostWidth: number;
  /** Visual height of the ghost (px) */
  ghostHeight: number;
  /** Current cursor X (client) */
  cursorX: number;
  /** Current cursor Y (client) */
  cursorY: number;
  /** Offset from the left edge of the block where the user grabbed it */
  grabOffsetX: number;
}

export interface CrossRowDragAPI {
  state: CrossRowDragState;
  startCrossRowDrag: (params: {
    action: TimelineAction;
    sourceRow: TimelineRow;
    ghostWidth: number;
    ghostHeight: number;
    grabOffsetX: number;
    initialX: number;
    initialY: number;
  }) => void;
  endCrossRowDrag: () => void;
  /** Called by the EditArea when mouse is released to commit the move */
  onCommit: (
    action: TimelineAction,
    sourceRow: TimelineRow,
    targetRow: TimelineRow,
    newStart: number,
    newEnd: number,
  ) => void;
  setOnCommit: (fn: CrossRowDragAPI['onCommit']) => void;
}

const initialState: CrossRowDragState = {
  isDragging: false,
  action: null,
  sourceRow: null,
  ghostWidth: 0,
  ghostHeight: 0,
  cursorX: 0,
  cursorY: 0,
  grabOffsetX: 0,
};

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────

const CrossRowDragContext = createContext<CrossRowDragAPI | null>(null);

export const useCrossRowDrag = (): CrossRowDragAPI => {
  const ctx = useContext(CrossRowDragContext);
  if (!ctx) throw new Error('useCrossRowDrag must be used inside CrossRowDragProvider');
  return ctx;
};

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────

export const CrossRowDragProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CrossRowDragState>(initialState);
  const onCommitRef = useRef<CrossRowDragAPI['onCommit']>(() => {});

  const startCrossRowDrag: CrossRowDragAPI['startCrossRowDrag'] = useCallback((params) => {
    setState({
      isDragging: true,
      action: params.action,
      sourceRow: params.sourceRow,
      ghostWidth: params.ghostWidth,
      ghostHeight: params.ghostHeight,
      cursorX: params.initialX,
      cursorY: params.initialY,
      grabOffsetX: params.grabOffsetX,
    });
  }, []);

  const endCrossRowDrag: CrossRowDragAPI['endCrossRowDrag'] = useCallback(() => {
    setState(initialState);
  }, []);

  const setOnCommit: CrossRowDragAPI['setOnCommit'] = useCallback((fn) => {
    onCommitRef.current = fn;
  }, []);

  const onCommit: CrossRowDragAPI['onCommit'] = useCallback(
    (action, sourceRow, targetRow, newStart, newEnd) => {
      onCommitRef.current(action, sourceRow, targetRow, newStart, newEnd);
    },
    [],
  );

  return (
    <CrossRowDragContext.Provider
      value={{ state, startCrossRowDrag, endCrossRowDrag, onCommit, setOnCommit }}
    >
      {children}
    </CrossRowDragContext.Provider>
  );
};

// ─────────────────────────────────────────────
// Ghost Element
// ─────────────────────────────────────────────

interface GhostProps {
  state: CrossRowDragState;
  enableGhostPreview: boolean;
  /** Optional custom render function; receives the dragged action + source row */
  getGhostPreview?: (params: { action: TimelineAction; row: TimelineRow }) => React.ReactNode;
}

export const CrossRowGhost: React.FC<GhostProps> = ({
  state,
  enableGhostPreview,
  getGhostPreview,
}) => {
  if (!state.isDragging || !enableGhostPreview) return null;
  if (!state.action || !state.sourceRow) return null;

  const left = state.cursorX - state.grabOffsetX;
  const top = state.cursorY - state.ghostHeight / 2;

  // Render custom preview if provided, otherwise use default glowing box
  const customContent = getGhostPreview
    ? getGhostPreview({ action: state.action, row: state.sourceRow })
    : null;

  return (
    <div
      style={{
        position: 'fixed',
        left,
        top,
        width: state.ghostWidth,
        height: state.ghostHeight,
        pointerEvents: 'none',
        zIndex: 9999,
        transition: 'none',
        // Default appearance only when no custom content provided
        ...(customContent == null && {
          background: 'rgba(99, 179, 237, 0.55)',
          border: '2px solid rgba(99, 179, 237, 0.9)',
          borderRadius: 4,
          boxShadow: '0 0 16px rgba(99,179,237,0.7), 0 0 4px rgba(99,179,237,0.9)',
          backdropFilter: 'blur(2px)',
        }),
        // When custom: just a transparent, sized container
        ...(customContent != null && {
          overflow: 'hidden',
          opacity: 0.85,
        }),
      }}
    >
      {customContent}
    </div>
  );
};

