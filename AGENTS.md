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
| `mise run install`   | `pnpm install --frozen-lockfile`                      |
| `mise run lint`      | `biome check .` + `actionlint`                        |
| `mise run format`    | `biome format --write .`                              |
| `mise run typecheck` | `tsc --noEmit`                                        |
| `mise run test`      | `vitest run --coverage`                               |
| `mise run build`     | `tsc -p tsconfig.build.json` (emit `dist/`)           |
| `mise run ci`        | Full gate: lint + typecheck + test + build            |
| `mise run audit`     | `zizmor` over workflows + `pnpm audit` over deps      |
| `mise run ci-watch`  | Watch GitHub Actions for the current branch           |

Running directly, without mise: `pnpm start` (or `node src/cli.ts`),
`pnpm dev` for watch mode.

## Structure

```
.github/workflows/ci.yml  CI: mise run lint/typecheck/test/build + zizmor audit
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
- Do not silence a check without a written justification on the same
  line — a bare `// biome-ignore` or `// @ts-expect-error` is not
  acceptable, a narrow one with a reason is. Prefer fixing the cause;
  suppress when the cause is outside this repo.
- Never weaken a control to make a check pass: do not lower the coverage
  thresholds, unpin an action, or delete a failing test.

**Supply chain:**

- `pnpm-lock.yaml` is committed and must stay in the tree. Install with
  `--frozen-lockfile` (what `mise run install` does) so CI cannot
  silently resolve something different from what was reviewed.
- Package versions in `package.json` stay as ranges. The lockfile is the
  pin; hard-pinning the ranges would add nothing and would fight
  dependabot.
- GitHub Actions are pinned to full-length commit SHAs with a `# vX.Y.Z`
  comment, and `zizmor` enforces that in CI.
- Every tool in `.mise.toml` is pinned to an exact version, node and pnpm
  included. Nothing there is covered by dependabot, so refresh it
  deliberately with `mise up` and read the diff.
- `mise run audit` refuses to run without a GitHub token rather than
  quietly falling back to zizmor's weaker offline checks.
- **`mise run audit` is not enforced by CI.** Its zizmor half has a CI
  counterpart; its `pnpm audit` half has none, because auditing on every
  PR lets a newly-published advisory in an unrelated package block
  unrelated work. So run it deliberately: before a release, and whenever
  touching dependencies.

## Commit Message Convention

Follow [Conventional Commits](https://conventionalcommits.org/):

**Format:** `type(scope): description`

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `build`, `ci`, `perf`, `revert`, `improvement`, `chore`

## Session Completion

Work is NOT complete until every change is committed, pushed, and CI passes.

1. **Quality gates** (if code changed):
   ```bash
   mise run ci
   ```

2. **Commit**: stage and commit every change from this session. Do not leave the working tree dirty.
   ```bash
   git status              # review untracked and unstaged files
   git add <files>
   git commit -m "<type>(<scope>): <description>"
   ```

3. **Push**:
   ```bash
   git pull --rebase && git push
   git status  # must show "up to date with origin"
   ```

4. **Verify CI**:
   ```bash
   mise run ci-watch
   ```
   On failure, inspect with `gh run view --log-failed`, fix, commit, push, and re-watch.

Never stop before CI is green. If anything fails, resolve and retry.
