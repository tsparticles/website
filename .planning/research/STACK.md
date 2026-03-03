# Research — Stack

Scope

- Recommended and observed technology choices for the tsParticles website and docs pipeline.

Observed stack (from repository)

- Runtime: Node.js — used by `docs-gen.js`, `deploy.js`, and CI scripts. Check `package.json` for engine hints.
- Package manager: pnpm — `pnpm-workspace.yaml` and `pnpm-lock.yaml` present.
- Frontend: Vanilla JavaScript for site interactivity in `js/` and SCSS for styles in `css/`.
- Docs: TypeScript + TypeDoc in `docs-gen/` (typedoc config at `docs-gen/typedoc.json`).
- CI / Deploy: GitHub Actions workflows in `.github/workflows/` and deploy orchestrated by `deploy.js`.

Recommended additions (practical)

- Pin Node.js version: add `engines.node` to `package.json` and a `.nvmrc` for developer alignment. Recommendation: LTS (e.g., 18.x or 20.x depending on CI image).
- Standardize package manager: keep pnpm and add `pnpm` commands to README and contributor docs.
- Docs dev experience: add `docs:dev` script to `package.json` that runs typedoc in watch or local preview (e.g., `typedoc --out docs src --watch`).
- Local preview: add a simple static server script (e.g., `serve` or `vite` for local preview of built docs) if contributors need live reload.

Libraries & versions (practical choices)

- TypeDoc (latest compatible with project's TypeScript) — used for API reference generation.
- Prettier (already present) — ensure config is applied via pre-commit or CI.
- Test runner: prefer `vitest` for fast unit tests (works well with modern JS + TypeScript). Alternative: `jest` if broader ecosystem requirements.

What NOT to use

- Avoid bundlers like heavy Webpack setups if site remains simple static HTML+vanilla JS — prefer simple build scripts or esbuild for occasional bundling.

Confidence

- High for Node/pnpm/typedoc observations (direct repo evidence). Medium for recommendations (aligned with modern best practices).
