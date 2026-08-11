# lsimons-template-ts

Project template for TypeScript (and JavaScript) CLI tools with standardized
tooling. The layout is single-package: `pnpm-workspace.yaml` is present only
because pnpm 10+ reads its settings from there, and declares no `packages:`.
Add that key when you need a monorepo.

## Using This Template

1. Click **Use this template** on GitHub (or clone this repo).
2. Clone your new repo locally and run:

   ```bash
   mise trust            # once per clone: trust this repo's .mise.toml
   mise install          # pin + install node + pnpm + lint/audit tools
   mise run init         # rename `template` → your project name
   mise run install      # pnpm install --frozen-lockfile
   ```

   `mise run init` auto-detects your project name from the git remote
   (or directory name), stripping `lsimons-` / `-ts` suffixes. Pass
   `--name foo` to override. See `scripts/init.py` for details.

3. Update `AGENTS.md` (and its `CLAUDE.md` symlink) with project-specific
   instructions, and `README.md` with what the project actually is.
4. Replace `src/cli.ts` / `src/greet.ts` with your entrypoint and
   modules. Keep `.ts` extensions in import specifiers — required by
   Node's native TypeScript support and `NodeNext` module resolution.
5. Run `/setup` in your agent of choice. Repository settings — issue
   labels, private vulnerability reporting, Dependabot alerts and
   security updates — are GitHub state rather than files, so
   `Use this template` does not copy them and nothing in this repo can
   create them. `/setup` configures them against the new repo directly.

## Included Configuration

- **Node.js 24 LTS** — uses native TypeScript type stripping, so no
  `tsx`/`ts-node` needed for development
- **pnpm** for package management, pinned in both `.mise.toml` and
  `packageManager`; `pnpm-lock.yaml` is committed and installs are
  `--frozen-lockfile`
- **TypeScript 7** with strict mode plus `noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`, `noImplicitOverride`,
  `noPropertyAccessFromIndexSignature`, and `erasableSyntaxOnly` so source
  code runs unmodified under Node's stripping
- **Biome v2** for both linting and formatting (replaces ESLint + Prettier;
  one Rust-based tool, ~10-25x faster)
- **Vitest 4** for tests with v8 coverage (80% threshold on lines,
  functions, branches and statements)
- **GitHub Actions CI** on push/PR to main, with actions pinned to
  full-length commit SHAs, an [actionlint](https://github.com/rhysd/actionlint)
  workflow check and a [zizmor](https://docs.zizmor.sh/) workflow-security
  audit
- **Dependabot** for `npm` (which covers `pnpm-lock.yaml`) and
  `github-actions`, weekly, with a 7-day cooldown; pnpm's own
  `minimumReleaseAge` gives the same cooldown locally
- **`.mise.toml`** pins every tool to an exact version — node included —
  and defines every repo task
- **`.editorconfig`** so editors that are not running Biome still agree
  with it

## Project Structure

```
lsimons-template-ts/
├── .github/workflows/ci.yml  # CI pipeline (mise-action + zizmor)
├── .github/dependabot.yml    # Weekly dependency updates
├── .editorconfig             # Editor defaults
├── .mise.toml                # Toolchain pin + task runner
├── .nvmrc                    # Node version pin (kept in sync with .mise.toml)
├── docs/spec/                # Feature specifications
├── scripts/init.py           # Rename-to-your-project helper
├── src/                      # Source code
│   ├── cli.ts                # CLI entrypoint (example)
│   └── greet.ts              # Example module
├── tests/                    # Test files
├── AGENTS.md                 # AI agent instructions
├── biome.json                # Lint + format config
├── CLAUDE.md -> AGENTS.md    # Claude Code compatibility
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE                   # Apache-2.0
├── SECURITY.md               # Vulnerability reporting route
├── package.json              # Project manifest
├── pnpm-lock.yaml            # Committed; never gitignore this
├── pnpm-workspace.yaml       # pnpm settings (not a monorepo)
├── tsconfig.json             # TypeScript config (dev / typecheck)
├── tsconfig.build.json       # TypeScript config (emit dist/)
├── vitest.config.ts          # Test + coverage config
└── README.md
```

`CLAUDE.md` is a git symlink (mode `120000`). A Windows clone needs
`core.symlinks` enabled to get a real link rather than a text file
containing the target path.

## Development Commands

```bash
mise trust            # once per clone
mise install          # one-time: pin + install toolchain
mise run install      # pnpm install --frozen-lockfile

# Run (no build step — native TS type stripping on Node 24)
pnpm start
pnpm dev              # watch mode

mise run test         # vitest run --coverage
mise run typecheck    # tsc --noEmit
mise run lint         # biome check . + actionlint
mise run format       # biome format --write .
mise run build        # tsc -p tsconfig.build.json (emit dist/)
mise run ci           # full CI gate: lint + typecheck + test + build
mise run audit        # zizmor over workflows + pnpm audit over dependencies
mise run ci-watch     # watch GitHub Actions for the current branch
```

## Adapting to Other Project Types

**Web backend (Express / Fastify / Hono):**
- Drop the `bin` entry from `package.json`; add a server entrypoint
  (e.g., `src/server.ts`).
- Add the web framework as a dependency.

**Web frontend (React / Vue / Svelte):**
- Replace the runtime with Vite: `pnpm add -D vite @vitejs/plugin-<x>`
- Set `tsconfig.json` `"moduleResolution": "Bundler"` and add
  `"jsx": "react-jsx"` (or equivalent).
- Keep Biome, Vitest, and the strict tsconfig settings.

**Library (published to npm):**
- Add `tsdown` (or keep `tsc`) for dual ESM/CJS output.
- Set `"private": false`, fill in `exports`, `main`, `types`, `files`.
- Emit declarations via `tsconfig.build.json`.

## License

See [LICENSE](./LICENSE).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). AI agents see
[AGENTS.md](./AGENTS.md).

## Security

See [SECURITY.md](./SECURITY.md).
