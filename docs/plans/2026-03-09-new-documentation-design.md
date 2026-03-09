# Documentation Restructure Design

## Overview

Rebuilding the project documentation into a comprehensive, multi-file structure located at `document_new/`. The new documentation will merge existing instructions with newly added custom features (`Row Drag Sorting`, `Run Block Preview`, `Cut Block`, and the split `Timeline Engine`).

## Goals

- Serve as a full learning path from basic setup to advanced, custom features.
- Provide a dedicated section for custom features and engine APIs.
- Replace all LESS styling in code examples with pure CSS for broader compatibility.
- Fully credit the original author (`@xzdarcy`) while clearly displaying fork additions by `@keplar-404`.

## Architecture & Folder Structure

The structural approach will be `Option A (Learning-Path Based)`:

### 1. Root / Introduction Level

- **`document_new/README.md`**: The entry index and overview. Credits, feature summary, and Table of Contents.
- **`document_new/1-Introduction/`**
  - `01-Getting-Started.md`: Installation instructions (npm, bun) and "Hello World" boilerplate.
  - `02-Editor-Props-and-Data.md`: `TimelineRow`, `TimelineAction`, `TimelineEffect`, and React props.

### 2. Basic Features (Ported from existing docs)

- **`document_new/2-Basic-Features/`**
  - `01-Basic-Usage.md`: Action dragging, disabling editing, hiding cursors.
  - `02-Scale-Customization.md`: Changing the zoom/scale of the timeline.
  - `03-Action-Config.md`: Configuring the blocks.
  - `04-Custom-Style.md`: Styling the editor (using standard CSS, not LESS).
  - `05-Grid-Snap.md`: Moving blocks along a grid.
  - `06-Auxiliary-Line-Snap.md`: Snapping to other blocks using auxiliary lines.
  - `07-Basic-Event.md`: Callbacks and events.
  - `08-Scroll-Sync.md`: Syncing scroll position.
  - `09-Auto-Scroll.md`: Auto-scrolling the timeline during drag.

### 3. Custom Features (New features added in this fork)

- **`document_new/3-Custom-Features/`**
  - `01-Row-Drag-Sorting.md`: Enabling drag-and-drop handles for full timeline rows.
  - `02-Cut-Block.md`: Using the new functionality to slice action blocks.
  - `03-Custom-Block-Preview.md`: Building custom run block previews dynamically.

### 4. Engine Extraction (New)

- **`document_new/4-Timeline-Engine/`**
  - `01-Engine-Intro.md`: Why the engine was moved to `@keplar-404/timeline-engine`.
  - `02-Engine-API.md`: API reference for standalone engine usage.

## Data Flow & Code Samples

- **Style Constraint:** All code samples must use standard plain CSS. No `.less` imports or syntax.
- **Component Imports:** Imports must reflect the new package structure:
  - UI Components: `@keplar-404/react-timeline-editor`
  - Engine logic: `@keplar-404/timeline-engine`

## Implementation Steps

1. Create directory `document_new`.
2. Generate all the skeleton files according to the structure.
3. Port existing content from `packages/document/docs/en/...`.
4. Translate any LESS styles in ported files into plain CSS.
5. Author the brand new documents for Row Drag, Cut Block, Block Preview, and Engine.
6. Verify all links and images work correctly.
