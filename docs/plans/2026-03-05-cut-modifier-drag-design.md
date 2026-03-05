# Design: Modifier-Aware Drag Restoration in Blade Cut Mode

## Problem

When Blade Cut Mode is enabled with a keyboard modifier (e.g. Alt), the Timeline is
permanently set to `disableDrag={true}`, so drag-and-drop never works — even when the
modifier key is released (and the CutOverlay becomes pointer-transparent). The user must
toggle Blade Cut off entirely to regain drag.

## Expected Behavior

| Cut Mode | Modifier set?   | Modifier held? | Expected                        |
| -------- | --------------- | -------------- | ------------------------------- |
| OFF      | —               | —              | Drag works normally             |
| ON       | No (always cut) | N/A            | Drag always disabled            |
| ON       | Yes (e.g. Alt)  | No             | Drag works normally             |
| ON       | Yes (e.g. Alt)  | Yes            | Cut blade active; drag disabled |

## Design Decision

Add an optional `onModifierChange?: (held: boolean) => void` callback to `CutOverlayProps`.

The component already tracks modifier-held state internally. This callback simply surfaces that state to the parent on each change. The parent can use it to dynamically control `disableDrag` (and related props like `enableCrossRowDrag`) on the `<Timeline>`.

## Files Changed

### `packages/timeline/src/components/cut-overlay/CutOverlay.tsx`

- Add `onModifierChange?: (held: boolean) => void` to `CutOverlayProps` interface
- Call `onModifierChange(true/false)` wherever `setIsModifierHeld` is called

### `packages/example/src/components/row-drag/index.tsx`

- Add `disableDragOverride` state (boolean), defaulting to `true` when cut enabled
- Wire `onModifierChange` on `<CutOverlay>` → update `disableDragOverride`
- Change `disableDrag` on `<Timeline>` to use this dynamic state
- Change `enableCrossRowDrag` and `enableGhostPreview` similarly

## Verification

Manual test steps:

1. Enable Blade Cut Mode, set Hold Key to "Alt"
2. Without holding Alt: drag blocks freely ✅
3. Hold Alt: blade activates, clicking cuts ✅
4. Release Alt: drag works again ✅
5. Set Hold Key to "None (Always Active)": drag always disabled ✅
