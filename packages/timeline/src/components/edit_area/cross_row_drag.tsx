import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { TimelineAction, TimelineRow } from '@xzdarcy/timeline-engine';

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
}

export const CrossRowGhost: React.FC<GhostProps> = ({ state, enableGhostPreview }) => {
  if (!state.isDragging || !enableGhostPreview) return null;

  const left = state.cursorX - state.grabOffsetX;
  const top = state.cursorY - state.ghostHeight / 2;

  return (
    <div
      style={{
        position: 'fixed',
        left,
        top,
        width: state.ghostWidth,
        height: state.ghostHeight,
        background: 'rgba(99, 179, 237, 0.55)',
        border: '2px solid rgba(99, 179, 237, 0.9)',
        borderRadius: 4,
        boxShadow: '0 0 16px rgba(99,179,237,0.7), 0 0 4px rgba(99,179,237,0.9)',
        pointerEvents: 'none',
        zIndex: 9999,
        backdropFilter: 'blur(2px)',
        transition: 'none',
      }}
    />
  );
};
