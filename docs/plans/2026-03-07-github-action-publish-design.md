# GitHub Actions NPM Publish Design

## Objective

Create a continuous deployment (CD) workflow using GitHub Actions to automatically publish `@keplar-404/react-timeline-editor` and `@keplar-404/timeline-engine` to the npm registry whenever a release tag is pushed.

## Architecture & Flow

1. **Trigger Engine**: The workflow triggers exactly when a tag matching `v*` is pushed.
2. **Checkout Base**: Uses `actions/checkout@v4` to pull down the repository code.
3. **Setup Engine**: Uses `oven-sh/setup-bun@v1` to install `bun` which aligns with our package manager transition.
4. **Environment Initialization**: Fetches dependencies via `bun install`.
5. **Quality Gates**:
   - Executes `bun run lint` (to be added)
   - Executes `bun run build` across all workspaces to prevent publishing broken code.
6. **Publish Engine**:
   - Navigates into each workspace and runs `bun publish --access public`.
   - Uses `NPM_TOKEN` provided from GitHub Secrets instead of an interactive login.

## Error Handling

If any quality gate step fails, the action halts and skips publishing, marking the pipeline as failed to notify developers.

## Future Proofing

Tokens mapped inside the workflow utilize `NODE_AUTH_TOKEN` which sets up the local `.npmrc` cleanly via standard GitHub actions environment injection.
