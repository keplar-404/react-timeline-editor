import React from 'react';
import { TimelinePlayerState, formatTime } from './useTimelinePlayer';
import './TransportBar.css';

// ─────────────────────────────────────────────
// Public Types
// ─────────────────────────────────────────────

/**
 * Loop control props for the {@link TransportBar} component.
 * Supply this to enable the loop toggle button and start/end inputs.
 */
export interface TransportBarLoopProps {
  /**
   * Whether the loop is currently active.
   * Controls the visual state of the loop button (lit vs. dim).
   */
  enabled: boolean;

  /**
   * Loop region start time in seconds.
   */
  start: number;

  /**
   * Loop region end time in seconds.
   */
  end: number;

  /**
   * Called when the user clicks the loop toggle button.
   */
  onToggle: () => void;

  /**
   * Called when the user edits the loop start input.
   * @param time - New start time in seconds.
   */
  onStartChange: (time: number) => void;

  /**
   * Called when the user edits the loop end input.
   * @param time - New end time in seconds.
   */
  onEndChange: (time: number) => void;
}

/**
 * Props for the {@link TransportBar} component.
 *
 * @example
 * ```tsx
 * const player = useTimelinePlayer(timelineRef, { loop: { enabled, start, end } });
 *
 * <TransportBar
 *   player={player}
 *   loop={{ enabled, start, end, onToggle, onStartChange, onEndChange }}
 * />
 * ```
 */
export interface TransportBarProps {
  /**
   * The return value of `useTimelinePlayer()`.
   * Provides all reactive state and control functions.
   *
   * @see {@link TimelinePlayerState}
   */
  player: TimelinePlayerState;

  /**
   * Optional loop controls.
   * When provided, a loop toggle button (🔁) appears after the stop button,
   * and start/end time inputs appear when the loop is active.
   *
   * @see {@link TransportBarLoopProps}
   */
  loop?: TransportBarLoopProps;

  /**
   * Playback rate options displayed as speed buttons.
   * @default [0.25, 0.5, 1, 2, 4]
   */
  playRates?: number[];

  /**
   * Custom time format function.
   * Receives the current time in seconds, should return a display string.
   *
   * @default Built-in `formatTime` (produces `'M:SS.mm'` format)
   *
   * @example
   * ```tsx
   * formatDisplayTime={(t) => `${(t * 1000).toFixed(0)} ms`}
   * ```
   */
  formatDisplayTime?: (seconds: number) => string;

  /**
   * Additional CSS class name for the transport bar root element.
   */
  className?: string;

  /**
   * Inline styles for the transport bar root element.
   */
  style?: React.CSSProperties;
}

// ─────────────────────────────────────────────
// Default values
// ─────────────────────────────────────────────

const DEFAULT_PLAY_RATES = [0.25, 0.5, 1, 2, 4];

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

/**
 * `TransportBar` is a pre-built playback control bar for use with `<Timeline>`.
 *
 * It renders transport controls (to-start, rewind, play/pause, forward, stop),
 * a time display, playback rate buttons, and optionally a loop toggle with
 * start/end inputs.
 *
 * Pair it with {@link useTimelinePlayer} to wire it to a `<Timeline>` ref:
 *
 * @example
 * ```tsx
 * const timelineRef = useRef<TimelineState>(null);
 * const [loopOn, setLoopOn] = useState(false);
 * const [loopStart, setLoopStart] = useState(1);
 * const [loopEnd, setLoopEnd] = useState(3);
 *
 * const player = useTimelinePlayer(timelineRef, {
 *   loop: { enabled: loopOn, start: loopStart, end: loopEnd },
 * });
 *
 * return (
 *   <>
 *     <TransportBar
 *       player={player}
 *       loop={{
 *         enabled: loopOn, start: loopStart, end: loopEnd,
 *         onToggle: () => setLoopOn((v) => !v),
 *         onStartChange: setLoopStart,
 *         onEndChange: setLoopEnd,
 *       }}
 *     />
 *     <Timeline ref={timelineRef} ... />
 *   </>
 * );
 * ```
 *
 * **Building your own UI?**
 * Skip this component entirely and use just `useTimelinePlayer()` to get the state
 * and handlers, then wire them to your own custom controls.
 */
const TransportBar: React.FC<TransportBarProps> = ({
  player,
  loop,
  playRates = DEFAULT_PLAY_RATES,
  formatDisplayTime = formatTime,
  className,
  style,
}) => {
  const {
    isPlaying, currentTime, playRate,
    play, pause, stop, toStart, rewind, forward, setPlayRate,
  } = player;

  return (
    <div
      className={`timeline-transport-bar${className ? ` ${className}` : ''}`}
      style={style}
    >
      {/* ── Left: transport controls ── */}
      <div className="timeline-transport-controls">
        {/* To start */}
        <button
          className="timeline-transport-btn"
          title="Return to start"
          onClick={toStart}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <rect x="1" y="1" width="2" height="12" rx="1" />
            <path d="M13 2.27L5.5 7 13 11.73V2.27z" />
          </svg>
        </button>

        {/* Rewind */}
        <button
          className="timeline-transport-btn"
          title="Rewind"
          onClick={rewind}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <path d="M7.5 2.27L0 7l7.5 4.73V8.96L2.92 7l4.58-5zM14 2.27L6.5 7 14 11.73V2.27z" />
          </svg>
        </button>

        {/* Play / Pause */}
        {isPlaying ? (
          <button
            className="timeline-transport-btn timeline-transport-btn--primary"
            title="Pause"
            onClick={pause}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <rect x="2" y="1" width="4" height="12" rx="1" />
              <rect x="8" y="1" width="4" height="12" rx="1" />
            </svg>
          </button>
        ) : (
          <button
            className="timeline-transport-btn timeline-transport-btn--primary"
            title="Play"
            onClick={play}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <path d="M2 1.5l11 5.5-11 5.5z" />
            </svg>
          </button>
        )}

        {/* Forward */}
        <button
          className="timeline-transport-btn"
          title="Forward"
          onClick={forward}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <path d="M6.5 2.27V5.04L11.08 7 6.5 8.96v2.77L14 7 6.5 2.27zM0 2.27L7.5 7 0 11.73V2.27z" />
          </svg>
        </button>

        {/* Stop */}
        <button
          className="timeline-transport-btn timeline-transport-btn--stop"
          title="Stop"
          onClick={stop}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <rect x="1" y="1" width="12" height="12" rx="2" />
          </svg>
        </button>

        {/* ── Loop controls (optional) ── */}
        {loop && (
          <>
            <div className="timeline-transport-divider" />

            <button
              className={`timeline-transport-btn timeline-transport-btn--loop${loop.enabled ? ' timeline-transport-btn--loop-active' : ''}`}
              title={loop.enabled ? 'Disable loop' : 'Enable loop'}
              onClick={loop.onToggle}
            >
              🔁
            </button>

            {loop.enabled && (
              <div className="timeline-transport-loop-inputs">
                <input
                  className="timeline-transport-loop-input"
                  type="number"
                  step="0.1"
                  min="0"
                  value={loop.start}
                  title="Loop start (seconds)"
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    if (!isNaN(v) && v >= 0 && v < loop.end) loop.onStartChange(v);
                  }}
                />
                <span className="timeline-transport-loop-arrow">→</span>
                <input
                  className="timeline-transport-loop-input"
                  type="number"
                  step="0.1"
                  min="0"
                  value={loop.end}
                  title="Loop end (seconds)"
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    if (!isNaN(v) && v > loop.start) loop.onEndChange(v);
                  }}
                />
                <span className="timeline-transport-loop-unit">s</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Centre: time display ── */}
      <div className="timeline-transport-time">
        <span className="timeline-transport-time-value">
          {formatDisplayTime(currentTime)}
        </span>
        <span className="timeline-transport-time-label">TIME</span>
      </div>

      {/* ── Right: playback rate ── */}
      <div className="timeline-transport-rate">
        <span className="timeline-transport-rate-label">SPEED</span>
        <div className="timeline-transport-rate-buttons">
          {playRates.map((r) => (
            <button
              key={r}
              className={`timeline-transport-rate-btn${playRate === r ? ' timeline-transport-rate-btn--active' : ''}`}
              onClick={() => setPlayRate(r)}
            >
              {r}×
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransportBar;
