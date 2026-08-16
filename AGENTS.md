# Agent Instructions for lsimons-template-ts

> This file (`AGENTS.md`) is the canonical agent configuration. `CLAUDE.md` is a symlink to this file.

> **If this repo still says "template" everywhere:** run
> `mise run init` once to rename the placeholder package to your
> project name. See `scripts/init.py` for details.

Project template for TypeScript CLI tools with standardized tooling.
See [README.md](README.md) for the user-facing description.

## Quick Reference

Every repo task lives in `.mise.toml`; `mise tasks` lists them. The
`pnpm` script behind each one is in `package.json`.

| Task                 | What it does                                          |
| -------------------- | ----------------------------------------------------- |
| `mise install`       | Install the pinned toolchain                          |
| `mise run init`      | Rename the `template` placeholder to the project name |
| `mise run install`   | `pnpm install`; may update the lock                   |
| `mise run install-frozen` | `pnpm install --frozen-lockfile`; what CI runs   |
| `mise run lint`      | `biome check .` + `actionlint`                        |
| `mise run format`    | `biome format --write .`                              |
| `mise run typecheck` | `tsc --noEmit`                                        |
| `mise run test`      | `vitest run --coverage`                               |
| `mise run build`     | `tsc -p tsconfig.build.json` (emit `dist/`)           |
| `mise run ci`        | Full gate: lint + typecheck + test + build            |
| `mise run audit`     | `zizmor` over workflows + dependabot config           |
| `mise run vuln`      | `pnpm audit` over the dependency tree (no token)      |
| `mise run ci-watch`  | Watch GitHub Actions for the current branch           |

Running directly, without mise: `pnpm start` (or `node src/cli.ts`),
`pnpm dev` for watch mode.

## Structure

```
.github/workflows/ci.yml  CI: lint/typecheck/test/build + pnpm audit + zizmor
.github/dependabot.yml    Weekly npm + github-actions updates, 7-day cooldown
.mise.toml                Pinned toolchain + every repo task
package.json              Manifest, pnpm scripts, devDependencies
pnpm-lock.yaml            Committed; never gitignore this
pnpm-workspace.yaml       pnpm settings (minimumReleaseAge), not a monorepo
biome.json                Lint + format config
tsconfig.json             TypeScript config for dev / typecheck
tsconfig.build.json       TypeScript config for emitting dist/
vitest.config.ts          Test + coverage config (80% floor)
scripts/init.py           Rename-to-your-project helper (`mise run init`)
src/                      Source; cli.ts is the entrypoint
tests/                    vitest suite
docs/spec/                Feature specifications
```

## Guidelines

**Code quality:**

- Strict TypeScript: 0 errors from `mise run typecheck`. `strict` is on
  along with `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`,
  `noImplicitOverride`, `noPropertyAccessFromIndexSignature`,
  `noFallthroughCasesInSwitch`, `noUnusedLocals` and `noUnusedParameters`.
- `erasableSyntaxOnly` — no enums, namespaces, or parameter properties
  (so the code runs under Node's native type stripping).
- Use `.ts` import extensions in source (required by `NodeNext` + native
  stripping); `rewriteRelativeImportExtensions` handles the emit.
- Biome does both lint and format: 0 warnings, 0 errors. Do not hand-format
  around it, and do not add a second formatter.
- Vitest for tests; the coverage floor is 80% for lines, functions,
  branches and statements (`thresholds` in `vitest.config.ts`, enforced by
  `mise run test`).
- No implicit `any`; prefer `unknown` at boundaries.
- No bare `// biome-ignore` or `// @ts-expect-error`. Narrow it and name
  the reason on the same line. Prefer fixing the cause.
- Never weaken a control to make a check pass: no lowered coverage
  thresholds, no unpinned actions or tools, no deleted tests.

**Supply chain:**

- `pnpm-lock.yaml` is committed and must stay in the tree. CI installs
  with `install-frozen`; use plain `mise run install` when deliberately
  changing dependencies.
- Versions in `package.json` stay as ranges — the lockfile is the pin.
- Watch for dependencies that arrive as *optional peers*: pnpm
  auto-installs them, so they are in no manifest, `pnpm update` and
  `pnpm dedupe` are no-ops on them, and dependabot cannot see them.
  Declare them explicitly, as `package.json` does for `vite`.
- Pin GitHub Actions to full-length commit SHAs; `zizmor` enforces it.
- Every `.mise.toml` tool is exact-pinned and invisible to dependabot;
  refresh with `mise up` and read the diff.
- `mise run audit` (zizmor) refuses to run without a GitHub token rather
  than falling back to weaker offline checks.
- `mise run vuln` (`pnpm audit`) must be clean. It has its own CI job; if
  you want it non-blocking, drop it from the required checks rather than
  removing the check.

## Commit Message Convention

Follow [Conventional Commits](https://conventionalcommits.org/):

**Format:** `type(scope): description`

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `build`, `ci`, `perf`, `revert`, `improvement`, `chore`

## Session Completion

Work is not complete until every change is committed, pushed, and CI passes.

1. `mise run ci` (or the tasks that changed)
2. Commit everything — do not leave the working tree dirty
3. `git pull --rebase && git push`
4. `mise run ci-watch`; on failure `gh run view --log-failed`, fix, repeat

Never stop before CI is green.
