import { TimelineRow } from '@keplar-404/timeline-engine';

/**
 * Calculate the accumulated height of rows
 * @param editorData Editor data
 * @param rowIndex Target row index
 * @param defaultRowHeight Default row height
 * @returns Accumulated height
 */
export const calculateRowAccumulatedHeight = (
  editorData: TimelineRow[],
  rowIndex: number,
  defaultRowHeight: number
): number => {
  let accumulatedHeight = 0;
  for (let i = 0; i < rowIndex; i++) {
    accumulatedHeight += editorData[i]?.rowHeight || defaultRowHeight;
  }
  return accumulatedHeight;
};

/**
 * Calculate total height of all rows
 * @param editorData Editor data
 * @param defaultRowHeight Default row height
 * @returns Total height
 */
export const calculateTotalHeight = (
  editorData: TimelineRow[],
  defaultRowHeight: number
): number => {
  return editorData.reduce((total, row) => total + (row?.rowHeight || defaultRowHeight), 0);
};

/**
 * Get an array of actual heights for each row
 * @param editorData Editor data
 * @param defaultRowHeight Default row height
 * @returns Height array
 */
export const getRowHeights = (
  editorData: TimelineRow[],
  defaultRowHeight: number
): number[] => {
  return editorData.map(row => row?.rowHeight || defaultRowHeight);
};

/**
 * Calculate the position of the insertion line
 * @param editorData Editor data
 * @param targetIndex Target index
 * @param defaultRowHeight Default row height
 * @returns Insertion line top position
 */
export const calculateInsertionLineTop = (
  editorData: TimelineRow[],
  targetIndex: number,
  defaultRowHeight: number
): number => {
  return calculateRowAccumulatedHeight(editorData, targetIndex, defaultRowHeight);
};

/**
 * Validate whether the drag target index is valid
 * @param targetIndex Target index
 * @param draggedIndex Index of the row being dragged
 * @param totalRows Total number of rows
 * @returns Whether it is valid
 */
export const isValidDragTarget = (
  targetIndex: number,
  draggedIndex: number,
  totalRows: number
): boolean => {
  // Allow dragging to the last row (targetIndex = totalRows)
  return targetIndex >= 0 && targetIndex <= totalRows && targetIndex !== draggedIndex;
};