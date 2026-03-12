# Timeline Engine Intro

The `@keplar-404/timeline-engine` is extracted as a standalone package to provide complete parsing and playback logic for timeline data.

Currently, `@keplar-404/react-timeline-editor` heavily connects to this engine library, relying on it for action splitting, timeline data interpretation, and runtime player execution.

## Motivation

In heavy front-end applications, your player (Canvas, WebGL, Video) and your editor (React GUI) might live in completely separate parts of your architecture.

By extracting the `TimelineEngine` into its own vanilla JavaScript package, you can run the exact same parsing and playback logic in a Web Worker, a Node.js server, or a completely non-React rendering pipeline.
