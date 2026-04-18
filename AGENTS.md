# Agent Instructions for lsimons-$project

> This file (`AGENTS.md`) is the canonical agent configuration. `CLAUDE.md` is a symlink to this file.

Brief project description.

## Quick Reference

- **Setup**: `pnpm install`
- **Run**: `pnpm start` (or `node src/cli.ts`)
- **Dev (watch)**: `pnpm dev`
- **Test**: `pnpm test`
- **Typecheck**: `pnpm typecheck`
- **Lint**: `pnpm lint`
- **Format**: `pnpm format`

## Structure

## Guidelines

**Code quality:**
- Strict TypeScript: 0 errors from `tsc --noEmit`
- `erasableSyntaxOnly` — no enums, namespaces, or parameter properties
  (so the code runs under Node's native type stripping)
- Use `.ts` import extensions in source (required by `NodeNext` + native
  stripping); `rewriteRelativeImportExtensions` handles the emit
- Biome for lint and format: 0 warnings, 0 errors
- Vitest for tests; target 80% coverage
- No implicit `any`; prefer `unknown` at boundaries

## Commit Message Convention

Follow [Conventional Commits](https://conventionalcommits.org/):

**Format:** `type(scope): description`

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `build`, `ci`, `perf`, `revert`, `improvement`, `chore`

## Session Completion

Work is NOT complete until `git push` succeeds.

1. **Quality gates** (if code changed):
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm test
   ```

2. **Push**:
   ```bash
   git pull --rebase && git push
   git status  # must show "up to date with origin"
   ```

Never stop before pushing. If push fails, resolve and retry.
