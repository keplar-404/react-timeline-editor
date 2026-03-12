# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.9] - 2026-03-13

### Fixed

- **Critical: broken npm installation in consumer projects** — Both `@keplar-404/react-timeline-editor`
  and `@keplar-404/timeline-engine` previously declared `"main"`, `"module"`, and `"types"` pointing
  at raw TypeScript source files (`src/index.tsx` / `src/index.ts`). This caused bundlers such as
  Next.js Turbopack, Vite consumer builds, and webpack to fail with `Module not found: Can't resolve
  './core/emitter'` and similar errors because they do not compile TypeScript inside `node_modules/`.
  Entry points now correctly reference pre-compiled `dist/` artefacts.

### Changed

- **`@keplar-404/react-timeline-editor` `package.json`**
  - `"main"` → `"dist/index.cjs.js"` (was `"src/index.tsx"`)
  - `"module"` → `"dist/index.es.js"` (was `"src/index.tsx"`)
  - `"typings"` → `"dist/index.d.ts"` (was `"src/index.tsx"`)
  - Added `"exports"` map with `types` / `import` / `require` conditions for Node.js ESM/CJS
    dual-package support and TypeScript path resolution
  - Added `"sideEffects": ["dist/react-timeline-editor.css"]` so bundlers do not tree-shake the
    required stylesheet
  - Removed `"src"` from the `"files"` array — only compiled `dist/` is published to npm
  - Removed unused `"conditions"` block

- **`@keplar-404/timeline-engine` `package.json`**
  - `"main"` → `"dist/index.cjs.js"` (was `"src/index.ts"`)
  - `"module"` → `"dist/index.esm.js"` (was `"src/index.ts"`)
  - `"types"` → `"dist/index.d.ts"` (was `"src/index.ts"`)
  - Added `"exports"` map with `types` / `import` / `require` conditions
  - Removed unused `"conditions"` block

---

## [1.0.8] - 2026-03-12

### Fixed

- Changed workspace-local dependency specifiers (`workspace:*`) to explicit version ranges
  (`^1.0.8`) so that consumers installing from the npm registry receive a resolvable dependency
  instead of an unresolvable Bun/pnpm workspace protocol.

---

## [1.0.6] - 2026-03-11

### Changed

- CI: switched publish step from `bun publish` to `npm publish` to fix `NODE_AUTH_TOKEN` injection
  in GitHub Actions.

---

## [1.0.5] - 2026-03-11

### Fixed

- Added missing `@rsbuild/plugin-less` dev-dependency to the `docs` package, which caused the
  documentation build to fail in CI.

---

## [1.0.4] - 2026-03-10

### Changed

- Bumped version to trigger GitHub Actions publish workflow.

---

## [1.0.2] - 2026-03-10

### Changed

- Bumped version to trigger GitHub Actions publish workflow after CI fixes.

---

## [1.0.1] - 2026-03-09

### Added

- GitHub Actions workflow for automated npm publishing on `v*` tag push.

---

## [1.0.0] - 2026-03-09

### Added

- Initial public release of `@keplar-404/react-timeline-editor` and `@keplar-404/timeline-engine`.
- Core timeline editor component (`Timeline`) with support for:
  - Scalable timeline zooming and scale customisation
  - CSS grid snapping and auxiliary drag-line snapping
  - Action block drag, resize, and cross-row drag with ghost preview
  - Row drag-and-drop reordering
  - Cut/split action block mechanism
  - `TransportBar` pre-built playback controls
  - `LoopZoneOverlay` draggable repeat region
  - `CutOverlay` scissors tool
- Standalone `@keplar-404/timeline-engine` playback engine decoupled from React DOM.
- Rspress-based documentation site.

[1.0.9]: https://github.com/keplar-404/react-timeline-editor/compare/v1.0.8...v1.0.9
[1.0.8]: https://github.com/keplar-404/react-timeline-editor/compare/v1.0.6...v1.0.8
[1.0.6]: https://github.com/keplar-404/react-timeline-editor/compare/v1.0.5...v1.0.6
[1.0.5]: https://github.com/keplar-404/react-timeline-editor/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/keplar-404/react-timeline-editor/compare/v1.0.2...v1.0.4
[1.0.2]: https://github.com/keplar-404/react-timeline-editor/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/keplar-404/react-timeline-editor/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/keplar-404/react-timeline-editor/releases/tag/v1.0.0
