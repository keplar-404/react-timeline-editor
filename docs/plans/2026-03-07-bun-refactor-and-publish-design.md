# Bun Refactor and Publishing Design

## Objective

Convert all `npm` usages within the React Timeline Editor monorepo to `bun` equivalents, and prepare the project for publishing using the `npm-publisher` workflow, specifically tailored to use `bun publish`.

## Current State Analysis

1. **Dependency linkage**: You have correctly set up `@keplar-404/timeline-engine` as a regular dependency (using `workspace:*`) in `@keplar-404/react-timeline-editor/package.json`. This ensures that when someone installs the main React timeline editor package, the engine package will also be installed automatically.
2. **Current `npm` usages**:
   - `packages/timeline/package.json`: `npm run clean && vite build`
   - `packages/engine/package.json`: `npm run clean && npm run build:rollup`
   - `README.md` & `packages/document/README.md`: Reference `npm install` and `npm run`
   - `scripts/publish-alpha.sh` / `scripts/publish-release.sh`: Use `bunx npm version` and `bunx npm publish`

## Proposed Approach (The "Bun" Way)

### 1. Script Refactoring

- Replace `npm run <script>` calls in `package.json` scripts with `bun run <script>`.
- Update documentation (`README.md`, `packages/document/README.md`, `packages/engine/BUILD.md`, etc.) to guide users to use `bun install` and `bun run` instead of `npm`.

### 2. Publishing Scripts Refactoring

- Modify `scripts/publish-alpha.sh` and `scripts/publish-release.sh` to use `bun publish` instead of `bunx npm publish`.
- Ensure everything correctly passes access tags (`--access public`).

### 3. Execution of the NPM Publisher Workflow

- Follow the `npm-publisher` workflow step-by-step to actually publish the two packages `timeline` and `engine`:
  - Run linting/builds to ensure readiness.
  - Stage and commit the bun refactoring changes.
  - Run the version bump (we will publish a new version, e.g., minor or patch).
  - Push the tags and trigger the publish.

## Trade-offs

Using `bun publish` is much faster but sometimes has edge cases resolving `workspace:*` automatically inside the published `package.json` compared to `npm publish`. However, since Bun is the primary toolchain here as requested, we will proceed with `bun publish` and verify the package resolves correctly.

## Conclusion

This approach covers the transition away from npm commands, verifies the linkage between the timeline and engine packages, and correctly uses `bun` for publishing as requested.
