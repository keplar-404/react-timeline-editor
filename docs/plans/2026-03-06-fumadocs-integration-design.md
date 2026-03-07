# Fumadocs Integration Design

## 1. Overview

The goal is to replace the current Rspress-based documentation (`packages/document`) with a modern, Next.js + Fumadocs powered site that provides better flexibility, an updated UI, and MDX support for rendering live React React Timeline Editor components.

## 2. Architecture

- **Framework**: Next.js (App Router) + Fumadocs.
- **Linter/Formatter**: Biome.
- **Monorepo Structure**: We will use "Approach A". We will leave the current `packages/document` untouched for now. We will scaffold the new documentation site into a new package named `packages/fumadocs`.
- **Dependencies**: The `fumadocs` package will rely on Workspace dependencies to import the local `@keplar-404/react-timeline-editor` rather than fetching it from NPM.

## 3. Data Flow & Development Experience

- The local version of the Timeline Editor and Timeline Engine will be linked to the `packages/fumadocs` workspace via standard Bun Workspace resolutions (`workspace:*`).

### 3. Build & Deployment Settings

- The new `packages/fumadocs` package will be deployed to Vercel.
- **Root Directory**: Set to `packages/fumadocs`.
- **Commands**: Build command `bun run build`, Install command `bun install`.
- Given Vercel correctly automatically recognizes standard monorepos, explicitly setting `vercel.json` is not required.
- This allows developers to write MDX documentation that renders interactive demos using unreleased features of the timeline editor.
- The dev command inside `packages/fumadocs` will run the Next.js dev server, live-reloading as changes are made to either the MDX files or the core timeline components.

## 4. Deployment Strategy

- **Hosting**: Vercel.
- **Configuration**: Set the Vercel project's Root Directory to `packages/fumadocs`.
- **Commands**: Build command `bun run build`, Install command `bun install`.
- The Next.js static output or serverless functions will be automatically handled by Vercel's standard Next.js adapter.

## 5. Implementation Steps

1. Create `packages/fumadocs` directory structure.
2. Initialize Fumadocs boilerplate using `create-fumadocs-app` (Non-interactive) or perform manual initialization.
3. Add Biome for linting and formatting.
4. Setup `package.json` inside the new directory to link with the workspace.
5. Create a basic MDX page rendering a mock `react-timeline-editor` component to prove the workspace dependency works.
