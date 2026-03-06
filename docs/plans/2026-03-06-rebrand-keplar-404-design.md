# Rebrand: @xzdarcy → @keplar-404

**Date:** 2026-03-06
**GitHub:** https://github.com/keplar-404/react-timeline-editor.git

## New Package Identities

| Old                              | New                                 |
| -------------------------------- | ----------------------------------- |
| `@keplar-404/react-timeline-editor` | `@keplar-404/react-timeline-editor` |
| `@keplar-404/timeline-engine`       | `@keplar-404/timeline-engine`       |

## Scope of Changes

### Source code (bulk sed)

- All `import … from '@keplar-404/timeline-engine'` in `packages/timeline/src/` and `packages/document/src/`
- All `import … from '@keplar-404/react-timeline-editor'` in `packages/document/src/`

### package.json files

- `packages/engine/package.json` — rename package field
- `packages/timeline/package.json` — rename package field, update engine dep
- `packages/document/package.json` — update both workspace deps
- Root `package.json` — update repository URL to keplar-404 GitHub

### Config / docs

- `packages/document/rspress.config.ts` — update Vite alias keys + GitHub URL
- `README.md` — new install command, badges, remove xzdarcy GIF
- `docs/cut-overlay.md` — update package names in code samples
- `docs/plans/*.md` — update prose references

## Implementation Strategy

Bulk `sed` for all source/doc files, then targeted JSON edits for `package.json` name fields.

## What Is Preserved

- Git history (past commits — normal and expected)
- MIT license attribution
