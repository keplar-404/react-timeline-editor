import { TimelineAction, TimelineRow } from "@keplar-404/timeline-engine";
import { ADD_SCALE_COUNT } from "../interface/const";

/** Time to pixel */
export function parserTimeToPixel(
  data: number,
  param: {
    startLeft: number;
    scale: number;
    scaleWidth: number;
  }
) {
  const { startLeft, scale, scaleWidth } = param;
  return startLeft + (data / scale) * scaleWidth;
}

/** Pixel to time */
export function parserPixelToTime(
  data: number,
  param: {
    startLeft: number;
    scale: number;
    scaleWidth: number;
  }
) {
  const { startLeft, scale, scaleWidth } = param;
  return ((data - startLeft) / scaleWidth) * scale;
}

/** Position + Width to Start + End */
export function parserTransformToTime(
  data: {
    left: number;
    width: number;
  },
  param: {
    startLeft: number;
    scale: number;
    scaleWidth: number;
  }
) {
  const { left, width } = data;
  const start = parserPixelToTime(left, param);
  const end = parserPixelToTime(left + width, param);
  return {
    start,
    end,
  };
}

/** Start + End to Position + Width */
export function parserTimeToTransform(
  data: {
    start: number;
    end: number;
  },
  param: {
    startLeft: number;
    scale: number;
    scaleWidth: number;
  }
) {
  const { start, end } = data;
  const left = parserTimeToPixel(start, param);
  const width = parserTimeToPixel(end, param) - left;
  return {
    left,
    width,
  };
}

/** Get number of scale marks based on data */
export function getScaleCountByRows(data: TimelineRow[], param: { scale: number }) {
  let max = 0;
  data.forEach((row) => {
    row.actions.forEach((action: TimelineAction) => {
      max = Math.max(max, action.end);
    });
  });
  const count = Math.ceil(max / param.scale);
  return count + ADD_SCALE_COUNT;
}

/** Get current number of scale marks based on time */
export function getScaleCountByPixel(
  data: number,
  param: {
    startLeft: number;
    scaleWidth: number;
    scaleCount: number;
  }
) {
  const { startLeft, scaleWidth } = param;
  const count = Math.ceil((data - startLeft) / scaleWidth);
  return Math.max(count + ADD_SCALE_COUNT, param.scaleCount);
}

/** Get collection of positions for all action times */
export function parserActionsToPositions(
  actions: TimelineAction[],
  param: {
    startLeft: number;
    scale: number;
    scaleWidth: number;
  }
) {
  const positions: number[] = [];
  actions.forEach((item) => {
    positions.push(parserTimeToPixel(item.start, param));
    positions.push(parserTimeToPixel(item.end, param));
  });
  return positions;
}

/**
 * Split an action in a row at a given time.
 * Automatically updates start/end times and creates a new adjacent action.
 */
export function splitActionInRow(
  data: TimelineRow[],
  rowId: string,
  actionId: string,
  cutTime: number
): TimelineRow[] {
  const rowIdx = data.findIndex((r) => r.id === rowId);
  if (rowIdx === -1) return data;

  const row = data[rowIdx];
  const actIdx = row.actions.findIndex((a) => a.id === actionId);
  if (actIdx === -1) return data;

  const action = row.actions[actIdx];

  // Validate the cut time is within the block boundaries
  if (cutTime <= action.start || cutTime >= action.end) {
    return data;
  }

  // Clone immutably
  const newData = [...data];
  const targetRow = { ...row, actions: [...row.actions] };
  newData[rowIdx] = targetRow;

  const targetAction = { ...action };
  const originalEnd = targetAction.end;
  targetAction.end = cutTime;
  targetRow.actions[actIdx] = targetAction;

  const newAction = {
    ...targetAction,
    id: `${targetAction.id}_split_${Date.now()}`,
    start: cutTime,
    end: originalEnd,
  };

  targetRow.actions.splice(actIdx + 1, 0, newAction);

  return newData;
}
