# lsimons-template-ts

Project template for TypeScript (and JavaScript) CLI tools with standardized
tooling. The layout is single-package — add `pnpm-workspace.yaml` later when
you need a monorepo.

## Using This Template

1. Copy this repository to create a new project
2. Replace placeholders throughout:
   - `$project` - project name (e.g., `myproject`)
   - `$shortDescription` - one-line description

3. Update `package.json`:
   - Change `name` and `description`
   - Update the `bin` entry if creating a CLI (or remove it)

4. Replace `src/cli.ts` / `src/greet.ts` with your entrypoint and modules.
   Keep `.ts` extensions in import specifiers — required by Node's native
   TypeScript support and `NodeNext` module resolution.

5. Update `AGENTS.md` (and `CLAUDE.md` symlink) with project-specific
   instructions.

## Included Configuration

- **Node.js 22.18+** required — uses native TypeScript type stripping,
  so no `tsx`/`ts-node` needed for development
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

> **Note:** CI is red on this template repo itself — the `$project`
> placeholder in `package.json` makes the package name malformed on
> purpose. Once you fork and do the search/replace described above, CI
> turns green.

## Project Structure

```
lsimons-$project/
├── .github/workflows/ci.yml  # CI pipeline
├── docs/spec/                # Feature specifications
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
# Setup
pnpm install

# Run (no build step — native TS on Node 22.18+)
pnpm start
pnpm dev        # watch mode

# Run tests
pnpm test
pnpm test:watch

# Typecheck
pnpm typecheck

# Lint + format
pnpm lint
pnpm format

# Build (emit to dist/ when publishing or shipping compiled JS)
pnpm build
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
