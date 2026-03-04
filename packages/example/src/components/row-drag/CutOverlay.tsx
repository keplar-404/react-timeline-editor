import React, { useCallback, useRef, useState } from 'react';
import { TimelineAction, TimelineRow } from '@xzdarcy/timeline-engine';
import './CutOverlay.less';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function pixelToTime(px: number, startLeft: number, scale: number, scaleWidth: number): number {
  return ((px - startLeft) / scaleWidth) * scale;
}

function timeToPixel(time: number, startLeft: number, scale: number, scaleWidth: number, scrollLeft: number): number {
  return startLeft + (time / scale) * scaleWidth - scrollLeft;
}

function snapToGrid(time: number, scale: number, scaleSplitCount: number): number {
  const unit = scale / scaleSplitCount;
  return Math.round(time / unit) * unit;
}

// ─────────────────────────────────────────────
// Public Types
// ─────────────────────────────────────────────

/**
 * Visual and behavioral configuration for the {@link CutOverlay} component.
 * All properties are optional — defaults produce a red-themed blade.
 *
 * @example
 * ```tsx
 * const cutConfig: CutOverlayConfig = {
 *   bladeColor: '#3b82f6',
 *   showPill: true,
 *   formatPillLabel: (t) => `Split at ${t.toFixed(3)}s`,
 *   showBlockHighlight: true,
 *   blockHighlightColor: 'rgba(59,130,246,0.12)',
 * };
 * <CutOverlay config={cutConfig} ... />
 * ```
 */
export interface CutOverlayConfig {
  // ── Blade ──────────────────────────────────────────────────────────────────

  /**
   * CSS color of the vertical blade line.
   * @default '#ef4444'
   */
  bladeColor?: string;

  // ── Pill ───────────────────────────────────────────────────────────────────

  /**
   * Whether to display the floating time-label pill above the blade.
   * Set to `false` to completely hide the pill.
   * @default true
   */
  showPill?: boolean;

  /**
   * Custom formatter for the time label displayed inside the pill.
   * Receives the cut time in **seconds** and should return a string.
   *
   * @param time - Cut time value in seconds.
   * @returns The string to render inside the pill.
   * @default (t) => `✂ ${t.toFixed(2)}s`
   *
   * @example
   * ```tsx
   * formatPillLabel={(t) => `Cut @ ${(t * 1000).toFixed(0)} ms`}
   * ```
   */
  formatPillLabel?: (time: number) => string;

  /**
   * Background color of the pill label.
   * @default '#ef4444'
   */
  pillColor?: string;

  /**
   * Text color of the pill label.
   * @default '#ffffff'
   */
  pillTextColor?: string;

  // ── Block highlight ────────────────────────────────────────────────────────

  /**
   * Whether to show the translucent highlight on the hovered action block.
   * Set to `false` to remove all background and border from the clip container.
   * @default true
   */
  showBlockHighlight?: boolean;

  /**
   * Background fill color for the block highlight.
   * Accepts any valid CSS color value (e.g. `'rgba(99,102,241,0.15)'` or `'transparent'`).
   * Only takes effect when `showBlockHighlight` is `true`.
   * @default 'rgba(239,68,68,0.08)'
   */
  blockHighlightColor?: string;

  /**
   * Border color for the block highlight container.
   * Only takes effect when `showBlockHighlight` is `true`.
   * @default 'rgba(239,68,68,0.3)'
   */
  blockHighlightBorderColor?: string;
}

/**
 * Props for the {@link CutOverlay} component.
 *
 * Mount this absolutely inside the same container as your `<Timeline>` to
 * overlay a blade-cut interaction on top of the timeline's edit area.
 */
export interface CutOverlayProps {
  // ── Data ───────────────────────────────────────────────────────────────────

  /**
   * The current timeline row data — same array you pass to `<Timeline editorData>`.
   * Used to hit-test which action block the cursor is over.
   */
  data: TimelineRow[];

  // ── Timeline geometry (must match <Timeline> props) ────────────────────────

  /**
   * Duration represented by one scale unit (seconds).
   * Must match the `scale` prop on `<Timeline>`.
   * @default 1
   */
  scale: number;

  /**
   * Number of sub-divisions per scale unit used for grid snapping.
   * Must match the `scaleSplitCount` prop on `<Timeline>`.
   * @default 10
   */
  scaleSplitCount: number;

  /**
   * Width in pixels of one scale unit.
   * Must match the `scaleWidth` prop on `<Timeline>`.
   * @default 160
   */
  scaleWidth: number;

  /**
   * Left inset in pixels before the first scale mark begins.
   * Must match the `startLeft` prop on `<Timeline>`.
   * @default 20
   */
  startLeft: number;

  /**
   * Height in pixels of each row in the edit area.
   * Must match the `rowHeight` prop on `<Timeline>`.
   * @default 32
   */
  rowHeight: number;

  /**
   * Height in pixels of the time-ruler strip that sits above the edit rows.
   * This is subtracted from the mouse Y coordinate to find the correct row index.
   * The default timeline ruler is **32 px** tall, but adjust if your layout differs.
   * @default 32
   */
  editAreaTopOffset: number;

  // ── Behaviour ──────────────────────────────────────────────────────────────

  /**
   * When `true` (and `<Timeline gridSnap>` is also enabled), the cut point
   * snaps to the nearest grid boundary as the cursor moves.
   * @default false
   */
  gridSnap: boolean;

  // ── Visual configuration ───────────────────────────────────────────────────

  /**
   * Fine-grained control over the blade, pill, and block-highlight visuals.
   * All properties are optional and fall back to red-themed defaults.
   * @see {@link CutOverlayConfig}
   */
  config?: CutOverlayConfig;

  // ── Callbacks ──────────────────────────────────────────────────────────────

  /**
   * Called when the user clicks while the blade is positioned over an action block.
   *
   * @param rowId    - `id` of the row that contains the cut action.
   * @param actionId - `id` of the action block being cut.
   * @param cutTime  - The time value (in seconds) at the cut point.
   */
  onCut: (rowId: string, actionId: string, cutTime: number) => void;
}

// ─────────────────────────────────────────────
// Internal state
// ─────────────────────────────────────────────

interface BladeState {
  time: number;
  bladeX: number;
  blockLeft: number;
  blockWidth: number;
  rowTop: number;
  row: TimelineRow;
  action: TimelineAction;
}

// ─────────────────────────────────────────────
// Defaults
// ─────────────────────────────────────────────

const DEFAULT_CONFIG: Required<CutOverlayConfig> = {
  bladeColor: '#ef4444',
  showPill: true,
  formatPillLabel: (t) => `✂ ${t.toFixed(2)}s`,
  pillColor: '#ef4444',
  pillTextColor: '#ffffff',
  showBlockHighlight: true,
  blockHighlightColor: 'rgba(239,68,68,0.08)',
  blockHighlightBorderColor: 'rgba(239,68,68,0.3)',
};

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

/**
 * `CutOverlay` adds a blade-cut interaction on top of a `<Timeline>` edit area.
 *
 * When enabled, hovering over an action block shows a vertical blade line and
 * an optional floating time pill. Clicking splits the block at the cut point.
 *
 * @example
 * ```tsx
 * {cutModeActive && (
 *   <CutOverlay
 *     data={editorData}
 *     scale={1}
 *     scaleSplitCount={10}
 *     scaleWidth={160}
 *     startLeft={20}
 *     rowHeight={40}
 *     editAreaTopOffset={42}
 *     gridSnap={snapEnabled}
 *     config={{ bladeColor: '#3b82f6', formatPillLabel: (t) => `${t.toFixed(2)}s` }}
 *     onCut={(rowId, actionId, cutTime) => handleCut(rowId, actionId, cutTime)}
 *   />
 * )}
 * ```
 */
const CutOverlay: React.FC<CutOverlayProps> = ({
  data,
  scale,
  scaleSplitCount,
  scaleWidth,
  startLeft,
  rowHeight,
  gridSnap,
  editAreaTopOffset,
  config,
  onCut,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [blade, setBlade] = useState<BladeState | null>(null);

  // Merge user config with defaults
  const cfg: Required<CutOverlayConfig> = { ...DEFAULT_CONFIG, ...config };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = overlayRef.current?.getBoundingClientRect();
      if (!rect) return;

      // Read actual horizontal scroll from the ReactVirtualized grid DOM element.
      // Timeline's onScroll prop only fires for vertical scroll, so we query the DOM.
      const editGrid = overlayRef.current
        ?.closest('.timeline-wrapper')
        ?.querySelector('.timeline-editor-edit-area .ReactVirtualized__Grid') as HTMLElement | null;
      const actualScrollLeft = editGrid?.scrollLeft ?? 0;

      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;

      const editY = relativeY - editAreaTopOffset;
      if (editY < 0) { setBlade(null); return; }

      let time = pixelToTime(relativeX + actualScrollLeft, startLeft, scale, scaleWidth);
      if (gridSnap) {
        time = snapToGrid(time, scale, scaleSplitCount);
      }

      const rowIndex = Math.floor(editY / rowHeight);
      const row = data[rowIndex];
      if (!row) { setBlade(null); return; }

      const action = row.actions.find((a) => time > a.start && time < a.end) ?? null;
      if (!action) { setBlade(null); return; }

      const blockLeft = timeToPixel(action.start, startLeft, scale, scaleWidth, actualScrollLeft);
      const blockRight = timeToPixel(action.end, startLeft, scale, scaleWidth, actualScrollLeft);
      const blockWidth = blockRight - blockLeft;
      const bladeX = timeToPixel(time, startLeft, scale, scaleWidth, actualScrollLeft);

      setBlade({ time, bladeX, blockLeft, blockWidth, rowTop: editAreaTopOffset + rowIndex * rowHeight, row, action });
    },
    [data, scale, scaleSplitCount, scaleWidth, startLeft, rowHeight, gridSnap, editAreaTopOffset],
  );

  const handleMouseLeave = useCallback(() => setBlade(null), []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!blade) return;
      e.stopPropagation();
      onCut(blade.row.id, blade.action.id, blade.time);
    },
    [blade, onCut],
  );

  return (
    <div
      ref={overlayRef}
      className={`cut-overlay${blade ? ' cut-overlay--active' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {blade && (
        <div
          className="cut-block-clip"
          style={{
            left: blade.blockLeft,
            top: blade.rowTop,
            width: blade.blockWidth,
            height: rowHeight,
            // Highlight: fully controllable via config
            background: cfg.showBlockHighlight ? cfg.blockHighlightColor : 'transparent',
            border: cfg.showBlockHighlight
              ? `1px solid ${cfg.blockHighlightBorderColor}`
              : 'none',
          }}
        >
          {/* Vertical blade line */}
          <div
            className="cut-blade"
            style={{
              left: blade.bladeX - blade.blockLeft,
              background: cfg.bladeColor,
              boxShadow: `0 0 8px ${cfg.bladeColor}cc, 0 0 2px ${cfg.bladeColor}`,
            }}
          />

          {/* Time pill — optional */}
          {cfg.showPill && (
            <div
              className="cut-pill"
              style={{
                left: blade.bladeX - blade.blockLeft,
                background: cfg.pillColor,
                color: cfg.pillTextColor,
              }}
            >
              {cfg.formatPillLabel(blade.time)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CutOverlay;
