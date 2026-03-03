# Research — Pitfalls

Scope

- Common mistakes and pitfalls for projects like tsParticles (docs + demo static site).

Pitfalls

- Committing generated artifacts (minified CSS/JS) leading to merge conflicts and bloated history.
  - Warning signs: frequent large binary-looking diffs in `css/` or `js/`.
  - Prevention: add `dist/` to .gitignore and generate artifacts in CI; or adopt a clear policy when committing build outputs.

- No tests or CI checks leading to regressions.
  - Warning signs: PRs with changes to `js/` or `css/` without lint or tests.
  - Prevention: add lint & lightweight tests; run them in CI on PRs.

- Docs drift from code (docs-gen out of date).
  - Warning signs: API changes without docs updates; docs version mismatches.
  - Prevention: add a docs-generation step in CI and fail on mismatches.

- Inconsistent developer environment (node/pnpm versions differ).
  - Warning signs: different `pnpm install` results across dev machines/CI.
  - Prevention: pin node version, document dev setup, use pnpm lockfile.

Confidence

- High — these are common, observed in many projects and relevant to this repo's state.
