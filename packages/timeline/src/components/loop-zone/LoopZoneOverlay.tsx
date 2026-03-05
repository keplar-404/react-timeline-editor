import React, { useCallback } from 'react';
import './LoopZoneOverlay.less';

// ─────────────────────────────────────────────
// Public Types
// ─────────────────────────────────────────────

/**
 * Visual and behavioral configuration for the {@link LoopZoneOverlay} component.
 * All properties are optional — defaults produce a green-themed loop zone.
 *
 * @example
 * ```tsx
 * const loopConfig: LoopZoneConfig = {
 *   bandColor: '#a855f7',
 *   bandOpacity: 0.1,
 *   handleColor: '#c084fc',
 *   showBoundaryLines: true,
 * };
 * <LoopZoneOverlay config={loopConfig} ... />
 * ```
 */
export interface LoopZoneConfig {
  /**
   * CSS color of the loop region shaded band.
   * @default '#10b981'
   */
  bandColor?: string;

  /**
   * Opacity of the loop region band (0–1).
   * Keep this low (< 0.15) so underlying blocks remain visible.
   * @default 0.07
   */
  bandOpacity?: number;

  /**
   * Border/stripe color used on the band's edges and stripe pattern.
   * Falls back to `bandColor` when not set.
   */
  bandBorderColor?: string;

  /**
   * CSS color of the default drag handle grip pills.
   * Falls back to `bandColor` when not set.
   * Has no effect when `renderHandle` is provided.
   */
  handleColor?: string;

  /**
   * Whether to render the dashed vertical boundary lines
   * extending through the edit rows below the time ruler.
   * @default true
   */
  showBoundaryLines?: boolean;

  /**
   * CSS color of the dashed boundary lines.
   * @default 'rgba(16, 185, 129, 0.4)'
   */
  boundaryLineColor?: string;
}

/**
 * Props passed into a custom handle renderer supplied via `LoopZoneOverlayProps.renderHandle`.
 *
 * Attach `onMouseDown` to your draggable element to enable the drag interaction.
 * The overlay provides all pixel math — your renderer only needs to call `onMouseDown`.
 *
 * @example
 * ```tsx
 * renderHandle={({ type, time, onMouseDown }) => (
 *   <div
 *     onMouseDown={onMouseDown}
 *     style={{ cursor: 'ew-resize', background: 'purple' }}
 *     title={`${type === 'start' ? 'Loop start' : 'Loop end'}: ${time.toFixed(2)}s`}
 *   >
 *     {type === 'start' ? '⟨' : '⟩'}
 *   </div>
 * )}
 * ```
 */
export interface LoopHandleRenderProps {
  /**
   * Which boundary this handle controls.
   * Use to differentiate styling between the two handles.
   */
  type: 'start' | 'end';

  /**
   * The current time value (in seconds) for this boundary.
   * Useful for displaying a tooltip or label.
   */
  time: number;

  /**
   * Attach this to your draggable element's `onMouseDown` to activate dragging.
   * The LoopZoneOverlay hooks into document `mousemove`/`mouseup` internally —
   * you do not need to manage drag events yourself.
   */
  onMouseDown: (e: React.MouseEvent) => void;
}

/**
 * Props for the {@link LoopZoneOverlay} component.
 *
 * Mount this absolutely inside the same container as your `<Timeline>` to render
 * a draggable loop region on top of the timeline ruler and edit area.
 *
 * @example
 * ```tsx
 * const [loopStart, setLoopStart] = useState(1);
 * const [loopEnd, setLoopEnd]     = useState(3);
 * const [scrollLeft, setScrollLeft] = useState(0);
 *
 * // Inside your container:
 * <div style={{ position: 'relative' }}>
 *   <Timeline
 *     ref={timelineRef}
 *     scale={1}
 *     scaleWidth={160}
 *     startLeft={20}
 *     onScroll={(p) => setScrollLeft(p.scrollLeft)}
 *     ...
 *   />
 *   {loopEnabled && (
 *     <LoopZoneOverlay
 *       scale={1}
 *       scaleWidth={160}
 *       startLeft={20}
 *       scrollLeft={scrollLeft}
 *       loopStart={loopStart}
 *       loopEnd={loopEnd}
 *       onLoopStartChange={setLoopStart}
 *       onLoopEndChange={setLoopEnd}
 *     />
 *   )}
 * </div>
 * ```
 */
export interface LoopZoneOverlayProps {
  // ── Timeline geometry (must match <Timeline> props) ────────────────────────

  /**
   * Duration represented by one scale unit (seconds).
   * Must match the `scale` prop on `<Timeline>`.
   * @default 1
   */
  scale: number;

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
   * Current horizontal scroll offset of the timeline.
   * Track this via the `onScroll` callback on `<Timeline>`:
   * ```tsx
   * onScroll={(params) => setScrollLeft(params.scrollLeft)}
   * ```
   */
  scrollLeft: number;

  // ── Controlled loop state ──────────────────────────────────────────────────

  /**
   * Loop region start time in seconds.
   * This is a **controlled** prop — manage it in parent state.
   */
  loopStart: number;

  /**
   * Loop region end time in seconds.
   * Must be greater than `loopStart`.
   * This is a **controlled** prop — manage it in parent state.
   */
  loopEnd: number;

  /**
   * Called when the user drags the start handle to a new time value.
   * Update your `loopStart` state here.
   *
   * @param time - New loop start time in seconds.
   */
  onLoopStartChange: (time: number) => void;

  /**
   * Called when the user drags the end handle to a new time value.
   * Update your `loopEnd` state here.
   *
   * @param time - New loop end time in seconds.
   */
  onLoopEndChange: (time: number) => void;

  // ── Customization ──────────────────────────────────────────────────────────

  /**
   * Fine-grained control over the band color, opacity, handle color, and
   * boundary line appearance. All properties are optional and fall back
   * to green-themed defaults.
   *
   * @see {@link LoopZoneConfig}
   */
  config?: LoopZoneConfig;

  /**
   * Custom render function for the drag handles.
   *
   * When provided, the default SVG grip pill is replaced by whatever
   * your function returns. The function is called once for each handle
   * (`'start'` and `'end'`).
   *
   * You **must** attach the provided `onMouseDown` to your draggable
   * element to preserve the drag interaction.
   *
   * @see {@link LoopHandleRenderProps}
   *
   * @example
   * ```tsx
   * renderHandle={({ type, time, onMouseDown }) => (
   *   <MyHandle side={type} label={`${time.toFixed(2)}s`} onMouseDown={onMouseDown} />
   * )}
   * ```
   */
  renderHandle?: (props: LoopHandleRenderProps) => React.ReactNode;

  /**
   * Additional CSS class name appended to the overlay root element.
   * Use to apply custom styles alongside or instead of `config`.
   */
  className?: string;

  /**
   * Inline styles applied to the overlay root element.
   */
  style?: React.CSSProperties;
}

// ─────────────────────────────────────────────
// Defaults
// ─────────────────────────────────────────────

const DEFAULT_CONFIG: Required<LoopZoneConfig> = {
  bandColor: '#10b981',
  bandOpacity: 0.07,
  bandBorderColor: '#10b981',
  handleColor: '#10b981',
  showBoundaryLines: true,
  boundaryLineColor: 'rgba(16, 185, 129, 0.4)',
};

// ─────────────────────────────────────────────
// Default handle
// ─────────────────────────────────────────────

/** Three-bar SVG grip icon — the default handle rendering. */
const GripIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="8" height="12" viewBox="0 0 8 12" fill={color} aria-hidden>
    <rect x="0" y="1"    width="8" height="1.5" rx="0.75" />
    <rect x="0" y="5.25" width="8" height="1.5" rx="0.75" />
    <rect x="0" y="9.5"  width="8" height="1.5" rx="0.75" />
  </svg>
);

interface DefaultHandleProps {
  color: string;
  onMouseDown: (e: React.MouseEvent) => void;
  title: string;
}

const DefaultHandle: React.FC<DefaultHandleProps> = ({ color, onMouseDown, title }) => (
  <div
    className="loop-zone-handle__grip"
    onMouseDown={onMouseDown}
    title={title}
    style={{
      background: color,
      boxShadow: `0 2px 10px ${color}8c, 0 0 0 1px ${color}4d`,
    }}
  >
    <GripIcon color="rgba(255,255,255,0.9)" />
  </div>
);

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

/**
 * `LoopZoneOverlay` renders a draggable loop/repeat region on top of a `<Timeline>`.
 *
 * When mounted inside the same positioned container as `<Timeline>`, it draws:
 * - A **semi-transparent band** spanning the ruler and edit rows between `loopStart` and `loopEnd`
 * - Two **draggable handles** at the boundaries (or custom handles via `renderHandle`)
 * - Optional **dashed boundary lines** extending through the edit rows
 *
 * The component is **fully controlled** — it calls `onLoopStartChange` /
 * `onLoopEndChange` as the user drags and does not hold its own loop state.
 *
 * @example
 * ```tsx
 * <LoopZoneOverlay
 *   scale={1}
 *   scaleWidth={160}
 *   startLeft={20}
 *   scrollLeft={scrollLeft}
 *   loopStart={loopStart}
 *   loopEnd={loopEnd}
 *   onLoopStartChange={setLoopStart}
 *   onLoopEndChange={setLoopEnd}
 *   config={{ bandColor: '#6366f1', bandOpacity: 0.1 }}
 * />
 * ```
 */
const LoopZoneOverlay: React.FC<LoopZoneOverlayProps> = ({
  scale,
  scaleWidth,
  startLeft,
  scrollLeft,
  loopStart,
  loopEnd,
  onLoopStartChange,
  onLoopEndChange,
  config,
  renderHandle,
  className,
  style,
}) => {
  // Merge user config with defaults
  const cfg: Required<LoopZoneConfig> = {
    ...DEFAULT_CONFIG,
    ...config,
    handleColor: config?.handleColor ?? config?.bandColor ?? DEFAULT_CONFIG.handleColor,
    bandBorderColor: config?.bandBorderColor ?? config?.bandColor ?? DEFAULT_CONFIG.bandBorderColor,
    boundaryLineColor: config?.boundaryLineColor ?? `${config?.bandColor ?? DEFAULT_CONFIG.bandColor}66`,
  };

  /** Convert a time (seconds) to a pixel x-position relative to the overlay. */
  const t2px = useCallback(
    (t: number) => startLeft + (t / scale) * scaleWidth - scrollLeft,
    [startLeft, scale, scaleWidth, scrollLeft],
  );

  const leftPx  = t2px(loopStart);
  const rightPx = t2px(loopEnd);
  const bandWidth = Math.max(0, rightPx - leftPx);

  /**
   * Returns a mousedown handler that wires up document-level drag tracking
   * for the given handle type.
   */
  const makeDragHandler = useCallback(
    (which: 'start' | 'end') => (e: React.MouseEvent) => {
      e.preventDefault();
      const startClientX = e.clientX;
      const initTime = which === 'start' ? loopStart : loopEnd;

      const onMove = (me: MouseEvent) => {
        const dt = ((me.clientX - startClientX) / scaleWidth) * scale;
        const newTime = Math.max(0, parseFloat((initTime + dt).toFixed(3)));
        if (which === 'start') {
          const clamped = Math.min(newTime, loopEnd - 0.05);
          onLoopStartChange(clamped);
        } else {
          const clamped = Math.max(newTime, loopStart + 0.05);
          onLoopEndChange(clamped);
        }
      };

      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    },
    [loopStart, loopEnd, scale, scaleWidth, onLoopStartChange, onLoopEndChange],
  );

  const startDrag = makeDragHandler('start');
  const endDrag   = makeDragHandler('end');

  const renderHandleNode = (type: 'start' | 'end') => {
    const time = type === 'start' ? loopStart : loopEnd;
    const onMouseDown = type === 'start' ? startDrag : endDrag;

    if (renderHandle) {
      return renderHandle({ type, time, onMouseDown });
    }

    return (
      <DefaultHandle
        color={cfg.handleColor}
        onMouseDown={onMouseDown}
        title={`Drag to move loop ${type} (${time.toFixed(2)}s)`}
      />
    );
  };

  return (
    <div
      className={`loop-zone-overlay${className ? ` ${className}` : ''}`}
      style={{ pointerEvents: 'none', ...style }}
    >
      {/* Shaded band */}
      {bandWidth > 0 && (
        <div
          className="loop-zone-band"
          style={{
            left: leftPx,
            width: bandWidth,
            background: cfg.bandColor,
            opacity: cfg.bandOpacity,
            borderColor: cfg.bandBorderColor,
          }}
        />
      )}

      {/* Start handle */}
      <div
        className="loop-zone-handle"
        style={{ left: leftPx }}
      >
        {cfg.showBoundaryLines && (
          <div
            className="loop-zone-handle__line"
            style={{ borderColor: cfg.boundaryLineColor }}
          />
        )}
        {renderHandleNode('start')}
      </div>

      {/* End handle */}
      <div
        className="loop-zone-handle"
        style={{ left: rightPx }}
      >
        {cfg.showBoundaryLines && (
          <div
            className="loop-zone-handle__line"
            style={{ borderColor: cfg.boundaryLineColor }}
          />
        )}
        {renderHandleNode('end')}
      </div>
    </div>
  );
};

export default LoopZoneOverlay;
