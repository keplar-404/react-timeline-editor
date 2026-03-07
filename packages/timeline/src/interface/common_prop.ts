import { EditData, RequiredEditData } from "./timeline";

/** Common component parameters */
export interface CommonProp extends RequiredEditData {
  /** Scale count */
  scaleCount: number;
  /** Set scale count */
  setScaleCount: (scaleCount: number) => void;
  /** Cursor time */
  cursorTime: number;
  /** Current timeline width */
  timelineWidth: number;
}
