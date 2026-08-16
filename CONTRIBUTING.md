# Contributing

Thank you for investing your time in contributing to our project!

Any contributions you make are governed by our [License](LICENSE).

Please follow our [Code of Conduct](CODE_OF_CONDUCT.md) to keep our community approachable and respectable.

Please do not report a security problem in a public issue. Use the "Report a vulnerability" button under this repository's Security tab instead.

## Working on a change

```bash
mise trust            # once per clone
mise install          # install the pinned toolchain
mise run install      # pnpm install (unfrozen; CI uses install-frozen)
mise run ci           # lint + typecheck + test + build — must pass before you push
```

Commit messages follow [Conventional Commits](https://conventionalcommits.org/):
`type(scope): description`.

Open a pull request against `main`. CI runs the same `mise run ci` gate
plus a [zizmor](https://docs.zizmor.sh/) audit of the GitHub Actions
workflows; both must be green.

AI agents: see [AGENTS.md](AGENTS.md).

You could read the [GitHub Docs Contributing Guide](https://github.com/github/docs/blob/main/CONTRIBUTING.md) for general advice on how to contribute.

Since this is a small hobby project, your contribution may not be noticed for a while if we are busy elsewhere. Sorry!
