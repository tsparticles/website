# STACK

Scope

- Languages, runtimes, frameworks, package managers, major dependencies and devtools present in the repository.

Detected from repository files (examples):

- `package.json` — Node.js/npm (package manager). See `package.json` at project root.
- `pnpm-workspace.yaml` & `pnpm-lock.yaml` — pnpm workspace layout / lockfile.
- `js/` and `css/` directories — frontend assets (vanilla JS + SCSS).
- `docs-gen/` — TypeScript/typedoc tooling (`docs-gen/tsconfig.json`, `typedoc.json`).

Languages & runtimes

- Primary: JavaScript (ES) and TypeScript used in `docs-gen/`.
- Runtime: Node.js (scripts such as `deploy.js`, `docs-gen.js`).

Package managers & CI

- pnpm is used (workspace manifest `pnpm-workspace.yaml` + `pnpm-lock.yaml`).
- GitHub Actions workflows at `.github/workflows/*.yml` for CI and deploy.

Build & tooling

- `docs-gen/` contains typedoc config and scripts — typedoc used to generate docs.
- `deploy.js` and `deploy` workflows used for site deployment.
- SCSS pipeline: `.scss` source files in `css/`, compiled to `css/*.css` and `css/*.min.css`.

Dependencies and notable libs

- The repo is primarily a static website; dependencies are in `package.json` (check `dependencies` and `devDependencies`).
- Fonts and images stored under `fonts/` and `images/`.

Configuration files to inspect

- `package.json` — scripts, dependencies
- `pnpm-workspace.yaml` — workspace packages
- `.github/workflows/nodejs.yml`, `.github/workflows/deploy.yml` — CI and deploy
- `docs-gen/typedoc.json` and `docs-gen/tsconfig.json` — docs build

How to verify locally

1. Inspect `package.json` for Node version and scripts: `cat package.json`.
2. Run `pnpm -v` and `node -v` to match runtime used by CI.
3. Check `docs-gen/` to see how TypeScript/typedoc are invoked.

Notes / Recommendations

- Add an explicit `engines.node` in `package.json` if reproducible Node version is desired.
- Consolidate build commands into npm scripts (if not already) so CI and local dev use same commands.
