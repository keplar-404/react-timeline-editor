# Fix: Grid Snap Not Applied During Cross-Row Block Drag

**Date:** 2026-03-06  
**Package:** `@xzdarcy/react-timeline-editor` (`packages/timeline`)

## Problem

When `enableCrossRowDrag` is `true`, grid snap stops working even if `gridSnap` is also `true`.

## Root Cause

Grid snap is enforced by the `grid` prop on `RowDnd`. When `enableCrossRowDrag` is on, `RowDnd`'s native drag is **disabled** (`enableDragging={… && !enableCrossRowDrag}`). The cross-row system instead tracks raw mouse coordinates and commits the block position via `resolveNewTimes` in `EditAreaInner` — which previously performed no snap rounding at all.

## Fix

**File:** `packages/timeline/src/components/edit_area/edit_area.tsx`

1. Destructure `gridSnap: boolean` and `scaleSplitCount: number` from `props` in `EditAreaInner`. Both are already present on `CommonProp` → `RequiredEditData` (fully typed, no new props needed).

2. In `resolveNewTimes`, round the computed start time to the nearest grid unit when snap is active:

```ts
const gridUnit: number = scale / scaleSplitCount;
const snappedStart: number = gridSnap ? Math.round(rawStart / gridUnit) * gridUnit : rawStart;
```

This is the exact same math `RowDnd` uses internally. Duration is preserved: `newEnd = newStart + duration`.

3. Add explicit return type annotation `{ newStart: number; newEnd: number }` to `resolveNewTimes`.

4. Update the `useCallback` dependency array: `[startLeft, scale, scaleWidth, gridSnap, scaleSplitCount]`.

## Type Safety

- Zero TypeScript errors (`npx tsc --noEmit` passes clean).
- No new props, types, or interfaces required — all values come from `RequiredEditData`.

## Behaviour After Fix

| Scenario                    | Before     | After                  |
| --------------------------- | ---------- | ---------------------- |
| Same-row drag + gridSnap    | ✅ Snaps   | ✅ Snaps               |
| Cross-row drag + gridSnap   | ❌ No snap | ✅ Snaps               |
| Cross-row drag, no gridSnap | ✅ No snap | ✅ No snap (unchanged) |
