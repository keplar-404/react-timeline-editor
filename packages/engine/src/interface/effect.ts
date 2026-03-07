import type { TimelineEngine } from "../core/engine";
import type { TimelineAction } from "./action";

export interface TimelineEffect {
  /** Effect ID */
  id: string;
  /** Effect name */
  name?: string;
  /** Effect execution code */
  source?: TimeLineEffectSource;
}

export interface EffectSourceParam {
  /** Current time */
  time: number;
  /** Whether it is playing */
  isPlaying: boolean;
  /** Action */
  action: TimelineAction;
  /** Action effect */
  effect: TimelineEffect;
  /** Execution engine */
  engine: TimelineEngine;
}

/**
 * Effect execution callback
 * @export
 * @interface TimeLineEffectSource
 */
export interface TimeLineEffectSource {
  /** Callback when playback starts within the current action time range */
  start?: (param: EffectSourceParam) => void;
  /** Callback executed when time enters the action */
  enter?: (param: EffectSourceParam) => void;
  /** Callback on action update */
  update?: (param: EffectSourceParam) => void;
  /** Callback executed when time leaves the action */
  leave?: (param: EffectSourceParam) => void;
  /** Callback when playback stops within the current action time range */
  stop?: (param: EffectSourceParam) => void;
}
