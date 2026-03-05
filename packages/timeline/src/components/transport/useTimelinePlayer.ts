import { useCallback, useEffect, useRef, useState } from 'react';
import type { TimelineState } from '../../interface/timeline';

// ─────────────────────────────────────────────
// Utility
// ─────────────────────────────────────────────

/**
 * Formats a time value in seconds to a `M:SS.mm` display string.
 *
 * @param seconds - Time in seconds (e.g. `75.4` → `'1:15.40'`).
 * @returns Formatted time string.
 *
 * @example
 * ```ts
 * formatTime(0);      // '0:00.00'
 * formatTime(75.4);   // '1:15.40'
 * formatTime(3661.1); // '61:01.10'
 * ```
 */
export function formatTime(seconds: number): string {
  const m  = Math.floor(seconds / 60);
  const s  = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${m}:${String(s).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
}

// ─────────────────────────────────────────────
// Public Types
// ─────────────────────────────────────────────

/**
 * Loop configuration passed to {@link useTimelinePlayer}.
 *
 * When `enabled` is `true`, the hook automatically resets playback to `start`
 * whenever the current time reaches `end`. The check uses React refs internally,
 * so it never suffers from stale-closure issues even as values change.
 */
export interface UseTimelinePlayerLoop {
  /**
   * Whether the loop is active. Safe to toggle while the timeline is playing.
   */
  enabled: boolean;

  /**
   * Loop region start time in seconds.
   * Must be less than `end`.
   */
  start: number;

  /**
   * Loop region end time in seconds.
   * Must be greater than `start`.
   */
  end: number;
}

/**
 * Options for the {@link useTimelinePlayer} hook.
 */
export interface UseTimelinePlayerOptions {
  /**
   * Number of seconds to jump when calling `rewind()` or `forward()`.
   * @default 5
   */
  seekStep?: number;

  /**
   * Optional loop configuration.
   * When provided, the hook handles the loop clock internally — no extra code needed.
   *
   * @see {@link UseTimelinePlayerLoop}
   *
   * @example
   * ```tsx
   * const player = useTimelinePlayer(ref, {
   *   loop: { enabled: loopOn, start: 1, end: 3 },
   * });
   * ```
   */
  loop?: UseTimelinePlayerLoop;
}

/**
 * State and controls returned by {@link useTimelinePlayer}.
 *
 * Destructure what you need — use it with the built-in `<TransportBar>` component
 * or wire it to your own custom controls.
 *
 * @example
 * ```tsx
 * const { isPlaying, currentTime, play, pause, stop } = useTimelinePlayer(ref);
 *
 * <button onClick={isPlaying ? pause : play}>
 *   {isPlaying ? '⏸' : '▶'}
 * </button>
 * <span>{formatTime(currentTime)}</span>
 * ```
 */
export interface TimelinePlayerState {
  // ── Reactive state ─────────────────────────────────────────────────────────

  /**
   * Whether the timeline is currently playing.
   * Updated automatically from engine events — no polling required.
   */
  isPlaying: boolean;

  /**
   * Current playback position in seconds.
   * Updated on every engine tick — suitable for display.
   */
  currentTime: number;

  /**
   * Current playback rate multiplier (e.g. `1` = 1×, `2` = 2×).
   * Updated when `setPlayRate` is called.
   */
  playRate: number;

  // ── Playback controls ──────────────────────────────────────────────────────

  /**
   * Start playback from the current position.
   * Plays to the end of the timeline and then stops.
   */
  play: () => void;

  /**
   * Pause playback at the current position.
   */
  pause: () => void;

  /**
   * Stop playback and reset the cursor to time `0`.
   */
  stop: () => void;

  /**
   * Pause and jump the cursor back to time `0`.
   * Differs from `stop` only in semantics — both do the same thing currently.
   */
  toStart: () => void;

  /**
   * Jump backwards by `seekStep` seconds (clamped to 0).
   */
  rewind: () => void;

  /**
   * Jump forwards by `seekStep` seconds.
   */
  forward: () => void;

  /**
   * Jump to a specific time value (seconds).
   *
   * @param time - Target time in seconds.
   */
  setTime: (time: number) => void;

  /**
   * Change the playback rate multiplier.
   *
   * @param rate - Multiplier value (e.g. `0.5`, `1`, `2`, `4`).
   */
  setPlayRate: (rate: number) => void;
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

/**
 * `useTimelinePlayer` manages playback state and controls for a `<Timeline>` component.
 *
 * It attaches engine event listeners (`play`, `paused`, `setTimeByTick`) on mount,
 * exposes reactive state (`isPlaying`, `currentTime`, `playRate`) and all control
 * functions. Optionally handles loop playback internally via the `loop` option.
 *
 * @param ref     - A React ref pointing to the `<Timeline>` component's imperative handle.
 * @param options - Optional configuration (`seekStep`, `loop`).
 * @returns {@link TimelinePlayerState} — reactive state + control functions.
 *
 * @example
 * ```tsx
 * const timelineRef = useRef<TimelineState>(null);
 *
 * const player = useTimelinePlayer(timelineRef, {
 *   seekStep: 5,
 *   loop: { enabled: loopOn, start: loopStart, end: loopEnd },
 * });
 *
 * // Option A: use the pre-built TransportBar
 * <TransportBar player={player} />
 *
 * // Option B: build your own UI
 * <button onClick={player.isPlaying ? player.pause : player.play}>
 *   {player.isPlaying ? '⏸' : '▶'}
 * </button>
 * <span>{formatTime(player.currentTime)}</span>
 * ```
 */
export function useTimelinePlayer(
  ref: React.RefObject<TimelineState>,
  options: UseTimelinePlayerOptions = {},
): TimelinePlayerState {
  const { seekStep = 5, loop } = options;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playRate, setPlayRateState] = useState(1);

  // ── Refs for loop values ──
  // Using refs instead of state in the tick callback avoids stale closures;
  // we never need to re-create the listener when loop params change.
  const loopEnabledRef = useRef(false);
  const loopStartRef   = useRef(0);
  const loopEndRef     = useRef(0);

  // Keep refs in sync with options synchronously on every render
  loopEnabledRef.current = loop?.enabled ?? false;
  loopStartRef.current   = loop?.start   ?? 0;
  loopEndRef.current     = loop?.end     ?? 0;

  // ── Engine event listeners ──
  useEffect(() => {
    const timeline = ref.current;
    if (!timeline) return;

    const handlePlay   = () => setIsPlaying(true);
    const handlePaused = () => setIsPlaying(false);

    const handleTick = ({ time }: { time: number }) => {
      setCurrentTime(time);
      // Loop: if loop is enabled and we've passed the end, snap back to start
      if (loopEnabledRef.current && time >= loopEndRef.current) {
        ref.current?.setTime(loopStartRef.current);
      }
    };

    timeline.listener.on('play',          handlePlay);
    timeline.listener.on('paused',        handlePaused);
    timeline.listener.on('setTimeByTick', handleTick);

    return () => {
      timeline.listener.off('play',          handlePlay);
      timeline.listener.off('paused',        handlePaused);
      timeline.listener.off('setTimeByTick', handleTick);
    };
  }, [ref]); // ref object is stable across renders — runs once on mount

  // ── Control callbacks ──
  const play = useCallback(() => {
    ref.current?.play({ autoEnd: true });
  }, [ref]);

  const pause = useCallback(() => {
    ref.current?.pause();
  }, [ref]);

  const stop = useCallback(() => {
    ref.current?.pause();
    ref.current?.setTime(0);
    setCurrentTime(0);
  }, [ref]);

  const toStart = useCallback(() => {
    ref.current?.pause();
    ref.current?.setTime(0);
    setCurrentTime(0);
  }, [ref]);

  const rewind = useCallback(() => {
    const cur  = ref.current?.getTime() ?? 0;
    const next = Math.max(0, cur - seekStep);
    ref.current?.setTime(next);
    setCurrentTime(next);
  }, [ref, seekStep]);

  const forward = useCallback(() => {
    const cur = ref.current?.getTime() ?? 0;
    ref.current?.setTime(cur + seekStep);
  }, [ref, seekStep]);

  const setTime = useCallback((time: number) => {
    ref.current?.setTime(time);
    setCurrentTime(time);
  }, [ref]);

  const setPlayRate = useCallback((rate: number) => {
    ref.current?.setPlayRate(rate);
    setPlayRateState(rate);
  }, [ref]);

  return {
    isPlaying,
    currentTime,
    playRate,
    play,
    pause,
    stop,
    toStart,
    rewind,
    forward,
    setTime,
    setPlayRate,
  };
}
