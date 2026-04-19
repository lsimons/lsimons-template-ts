# lsimons-template-ts

Project template for TypeScript (and JavaScript) CLI tools with standardized
tooling. The layout is single-package — add `pnpm-workspace.yaml` later when
you need a monorepo.

## Using This Template

1. Click **Use this template** on GitHub (or clone this repo).
2. Clone your new repo locally and run:

   ```bash
   mise install          # pin + install node + pnpm
   mise run init         # rename `template` → your project name
   mise run install      # pnpm install
   ```

   `mise run init` auto-detects your project name from the git remote
   (or directory name), stripping `lsimons-` / `-ts` suffixes. Pass
   `--name foo` to override. See `scripts/init.py` for details.

3. Update `AGENTS.md` (and `CLAUDE.md` symlink) with project-specific
   instructions.
4. Replace `src/cli.ts` / `src/greet.ts` with your entrypoint and
   modules. Keep `.ts` extensions in import specifiers — required by
   Node's native TypeScript support and `NodeNext` module resolution.

## Included Configuration

- **Node.js 24 LTS** (current Active LTS as of 2026) — uses native
  TypeScript type stripping, so no `tsx`/`ts-node` needed for development
- **pnpm** for package management (version pinned via `packageManager`)
- **TypeScript 5.8+** with strict mode plus `noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`, `noImplicitOverride`,
  `noPropertyAccessFromIndexSignature`, and `erasableSyntaxOnly` so source
  code runs unmodified under Node's stripping
- **Biome v2** for linting and formatting (replaces ESLint + Prettier; one
  Rust-based tool, ~10-25x faster)
- **Vitest 3** for tests with v8 coverage (80% threshold)
- **GitHub Actions CI** on push/PR to main, with actions pinned to
  full-length commit SHAs (the repo setting *Require actions to be
  pinned to a full-length commit SHA* is enabled)
- **`.mise.toml`** pins toolchain + defines every repo task

## Project Structure

```
lsimons-template-ts/
├── .github/workflows/ci.yml  # CI pipeline (mise-action)
├── .mise.toml                # Toolchain pin + task runner
├── docs/spec/                # Feature specifications
├── scripts/init.py           # Rename-to-your-project helper
├── src/                      # Source code
│   ├── cli.ts                # CLI entrypoint (example)
│   └── greet.ts              # Example module
├── tests/                    # Test files
├── .nvmrc                    # Node version pin
├── AGENTS.md                 # AI agent instructions
├── biome.json                # Lint + format config
├── CLAUDE.md -> AGENTS.md    # Claude Code compatibility
├── package.json              # Project manifest
├── tsconfig.json             # TypeScript config (dev / typecheck)
├── tsconfig.build.json       # TypeScript config (emit dist/)
├── vitest.config.ts          # Test + coverage config
└── README.md
```

## Development Commands

```bash
mise install          # one-time: pin + install toolchain
mise run install      # pnpm install

# Run (no build step — native TS on Node 22.18+)
pnpm start
pnpm dev              # watch mode

mise run test         # vitest run --coverage
mise run typecheck    # tsc --noEmit
mise run lint         # biome check .
mise run format       # biome format --write .
mise run build        # tsc -p tsconfig.build.json (emit dist/)
mise run ci           # full CI gate
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

See [LICENSE.md](./LICENSE.md).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).
