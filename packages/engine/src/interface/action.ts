/**
 * Basic parameters for an action
 * @export
 * @interface TimelineAction
 */
export interface TimelineAction {
  /** Action ID */
  id: string;
  /** Action start time */
  start: number;
  /** Action end time */
  end: number;
  /** effectId corresponding to the action */
  effectId: string;
  /** Custom data */
  data?: any;
  /** Whether the action is selected */
  selected?: boolean;
  /** Whether the action is stretchable */
  flexible?: boolean;
  /** Whether the action is movable */
  movable?: boolean;
  /** Whether the action is disabled */
  disabled?: boolean;
  /** Minimum start time limit for the action */
  minStart?: number;
  /** Maximum end time limit for the action */
  maxEnd?: number;
}

/**
 * Basic parameters for an action row
 * @export
 * @interface TimelineRow
 */
export interface TimelineRow {
  /** Action row ID */
  id: string;
  /** List of actions in the row */
  actions: TimelineAction[];
  /** Custom row height */
  rowHeight?: number;
  /** Whether the row is selected */
  selected?: boolean;
  /** Extended class name for the row */
  classNames?: string[];
}