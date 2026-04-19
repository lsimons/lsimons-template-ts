# Agent Instructions for lsimons-template-ts

> This file (`AGENTS.md`) is the canonical agent configuration. `CLAUDE.md` is a symlink to this file.

> **If this repo still says "template" everywhere:** run
> `mise run init` once to rename the placeholder package to your
> project name. See `scripts/init.py` for details.

Brief project description.

## Quick Reference

- **One-time**: `mise install`
- **Setup**: `mise run install` (or `pnpm install`)
- **Run**: `pnpm start` (or `node src/cli.ts`)
- **Dev (watch)**: `pnpm dev`
- **Test**: `mise run test` (or `pnpm test`)
- **Typecheck**: `mise run typecheck` (or `pnpm typecheck`)
- **Lint**: `mise run lint` (or `pnpm lint`)
- **Format**: `mise run format` (or `pnpm format`)
- **Full CI gate**: `mise run ci`

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

Work is NOT complete until CI passes on the pushed commit.

1. **Quality gates** (if code changed):
   ```bash
   mise run ci
   ```

2. **Push**:
   ```bash
   git pull --rebase && git push
   git status  # must show "up to date with origin"
   ```

3. **Verify CI**:
   ```bash
   mise run ci-watch
   ```
   On failure, inspect with `gh run view --log-failed`, fix, push, and re-watch.

Never stop before CI is green. If push or CI fails, resolve and retry.
