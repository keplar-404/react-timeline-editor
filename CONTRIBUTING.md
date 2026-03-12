# Contributing to React Timeline Editor

Thank you for your interest in contributing! This guide will help you get started.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Development Setup](#development-setup)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Release Process](#release-process)

---

## Code of Conduct

This project follows a simple rule: **be kind and respectful**. Harassment of any kind is not tolerated.

---

## Ways to Contribute

- 🐛 **Report bugs** — Open a [Bug Report](https://github.com/keplar-404/react-timeline-editor/issues/new?template=bug_report.md)
- ✨ **Request features** — Open a [Feature Request](https://github.com/keplar-404/react-timeline-editor/issues/new?template=feature_request.md)
- 📝 **Improve docs** — Edit files in `packages/document/docs/` or `document_new/`
- 🔧 **Fix bugs or implement features** — Open a Pull Request

---

## Development Setup

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0 (recommended) or Node.js >= 20
- Git

### Steps

```bash
# 1. Fork and clone
git clone https://github.com/<your-username>/react-timeline-editor.git
cd react-timeline-editor

# 2. Install all workspace dependencies
bun install

# 3. Start the docs site (hot-reload)
bun --filter docs dev

# 4. Start the example app (hot-reload)
bun --filter example dev

# 5. Build all packages
bun run build
```

### Project Structure

```
packages/
├── timeline/   → @keplar-404/react-timeline-editor  (main React component)
├── engine/     → @keplar-404/timeline-engine         (standalone engine)
├── document/   → Documentation site (Rspress)
└── example/    → Interactive demo (Vite)
```

---

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <short description>

[optional body]
```

### Types

| Type | When to use |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes only |
| `style` | Formatting, missing semicolons, etc. (no logic change) |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `test` | Adding or fixing tests |
| `chore` | Build process, tooling, dependencies |
| `ci` | CI/CD configuration changes |

### Examples

```bash
git commit -m "feat(timeline): add enableCrossRowDrag prop"
git commit -m "fix(engine): prevent duplicate enter callbacks on setTime"
git commit -m "docs: update TransportBar API reference"
git commit -m "chore: bump dependencies"
```

---

## Pull Request Process

1. **Branch** from `main`: `git checkout -b feat/my-feature`
2. **Make your changes** and ensure the build passes: `bun run build`
3. **Update CHANGELOG.md** under `[Unreleased]` for user-facing changes
4. **Open a Pull Request** — fill in the PR template completely
5. Wait for review. All checks must pass before merge.

---

## Release Process

Releases are automated via GitHub Actions. Maintainers follow this process:

1. Bump version in both `packages/engine/package.json` and `packages/timeline/package.json`
2. Update `CHANGELOG.md` — move `[Unreleased]` items into a dated version section
3. Commit: `git commit -m "chore(release): v1.x.y"`
4. Tag: `git tag -a v1.x.y -m "v1.x.y — summary"`
5. Push: `git push origin main && git push origin v1.x.y`

The `npm-publish.yml` workflow automatically builds and publishes both packages to npm on every `v*` tag push.

---

Thank you for helping make this library better! 🙏
