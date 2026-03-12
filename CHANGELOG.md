# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.11] - 2026-03-13

### Fixed

- **CI: duplicate-version publish no longer fails the entire workflow** — The GitHub Actions
  publish workflow previously used a bare `npm publish` call. If a version had already been
  published (e.g. from a prior tag) the command exited with code 1, which halted all subsequent
  steps and prevented the sibling package from publishing. The workflow now checks whether the
  current `package.json` version already exists on the npm registry before running `npm publish`,
  and gracefully skips with a warning message instead of failing.

- **Version skew between engine and timeline** — `v1.0.9` was released with both packages at
  `1.0.9`. The `v1.0.10` release only bumped the timeline package; the engine remained at `1.0.9`,
  causing a `403 You cannot publish over previously published versions` error in CI. Both packages
  are now kept in lockstep at the same version (`1.0.11`) to prevent this class of error.

### Changed

- **GitHub Actions workflow** (`npm-publish.yml`) — replaced bare `npm publish` with a
  version-existence check before publishing each package. Future retries and re-triggered
  workflows will skip already-published versions cleanly without failing.
- **`@keplar-404/timeline-engine`** bumped to `1.0.11`.
- **`@keplar-404/react-timeline-editor`** bumped to `1.0.11`; engine peer dependency updated
  to `^1.0.11`.

---

## [1.0.10] - 2026-03-13


### Fixed

- **CSS import broken in Tailwind v4 (PostCSS) and other CSS-resolving tools** —
  `@keplar-404/react-timeline-editor` ships a stylesheet at
  `dist/react-timeline-editor.css`. Tools that resolve CSS via the package `exports`
  field (notably Tailwind v4's PostCSS plugin using the `"style"` condition) failed to
  find the file because no CSS subpath export was defined.

  Added a dedicated subpath export entry:

  ```json
  "./dist/react-timeline-editor.css": {
    "style":   "./dist/react-timeline-editor.css",
    "default": "./dist/react-timeline-editor.css"
  }
  ```

  - The `"style"` condition is consumed by **Tailwind v4 PostCSS**, **Lightning CSS**,
    and any other CSS-aware bundler plugin.
  - The `"default"` condition is consumed by **Vite**, **webpack**, **Rollup**, and any
    other general-purpose bundler.
  - **Direct path imports** (`../node_modules/...`) continue to work as before,
    requiring no change on the consumer side.

  All three of the following now work without any workaround:

  ```css
  /* Tailwind v4 / PostCSS — uses "style" condition */
  @import '@keplar-404/react-timeline-editor/dist/react-timeline-editor.css';

  /* Vite / webpack / Rollup — uses "default" condition */
  @import '@keplar-404/react-timeline-editor/dist/react-timeline-editor.css';

  /* Direct path — bypasses exports entirely (always worked) */
  @import '../node_modules/@keplar-404/react-timeline-editor/dist/react-timeline-editor.css';
  ```

- Corrected `sideEffects` path to use relative `./` prefix (`"./dist/react-timeline-editor.css"`)
  so webpack resolves it correctly against the package root.

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

[1.0.11]: https://github.com/keplar-404/react-timeline-editor/compare/v1.0.10...v1.0.11
[1.0.10]: https://github.com/keplar-404/react-timeline-editor/compare/v1.0.9...v1.0.10
[1.0.9]: https://github.com/keplar-404/react-timeline-editor/compare/v1.0.8...v1.0.9
[1.0.8]: https://github.com/keplar-404/react-timeline-editor/compare/v1.0.6...v1.0.8
[1.0.6]: https://github.com/keplar-404/react-timeline-editor/compare/v1.0.5...v1.0.6
[1.0.5]: https://github.com/keplar-404/react-timeline-editor/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/keplar-404/react-timeline-editor/compare/v1.0.2...v1.0.4
[1.0.2]: https://github.com/keplar-404/react-timeline-editor/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/keplar-404/react-timeline-editor/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/keplar-404/react-timeline-editor/releases/tag/v1.0.0
