# tsParticles Website

## What This Is

The public website and documentation hub for the tsParticles project. It serves interactive demos, configuration samples, documentation generated from TypeScript sources, and deploys a static site via GitHub Actions.

## Core Value

Make it effortless for developers to discover, evaluate, and integrate tsParticles by providing accurate docs, compelling demos, and reliable deployment.

## Requirements

### Validated

- ✓ Serve static site pages (HTML, CSS, JS) for demos and docs — existing
- ✓ Documentation generation pipeline (`docs-gen/` using TypeScript/typedoc) — existing
- ✓ CI / deployment automation via GitHub Actions and `deploy.js` — existing

### Active

- [ ] Improve documentation developer experience (clear docs generation and scripts)
- [ ] Add CI linting and testing steps to prevent regressions
- [ ] Consolidate build outputs and clarify distribution (`dist/` vs committed artifacts)

### Out of Scope

- Major backend services or databases — this repository is a static site
- Full app/mobile rewrite — out of scope for current work

## Context

- Repository contains a static website with source SCSS, client JS, configuration JSONs for demos, and a `docs-gen/` TypeScript/docs toolchain. Build and deploy are automated via GitHub Actions.
- Existing artifacts: compiled CSS/JS are committed in `css/` and `js/` directories; `dist/` exists as a build output.

## Constraints

- **Hosting**: Static site deployment via GitHub Actions (preconfigured) — must remain compatible with current workflows.
- **Tech**: Node.js + pnpm used in tooling (see `package.json`, `pnpm-workspace.yaml`).
- **Scope**: Focus on docs, demos, and site reliability — no server-side features.

## Key Decisions

| Decision           | Rationale                                 | Outcome |
| ------------------ | ----------------------------------------- | ------- |
| Keep site static   | Simpler hosting, matches project goals    | ✓ Good  |
| Use pnpm workspace | Reproducible installs and typedoc tooling | ✓ Good  |

---

_Last updated: 2026-03-03 after initialization_
