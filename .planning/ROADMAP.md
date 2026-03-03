# ROADMAP: tsParticles Website

**Created:** 2026-03-03

**Summary:** 3 phases | 5 requirements mapped | All v1 requirements covered ✓

| #   | Phase                       | Goal                                                                                              | Requirements   | Success Criteria |
| --- | --------------------------- | ------------------------------------------------------------------------------------------------- | -------------- | ---------------- |
| 1   | Docs & Demos Baseline       | Provide accurate, discoverable API docs and interactive demos that work across supported browsers | DOC-01, DOC-02 | 3                |
| 2   | CI & Quality                | Prevent regressions by adding linting and basic tests to CI                                       | CI-01, CI-02   | 3                |
| 3   | Build & Deploy Improvements | Produce deterministic build output and deploy clean artifacts from CI                             | BUILD-01       | 2                |

## Phase Details

### Phase 1: Docs & Demos Baseline

Goal: Ensure the documentation site reliably generates API docs and demos run without errors.

Requirements:

- **DOC-01**: Documentation site pages render with up-to-date API docs generated from TypeScript sources (`docs-gen/`).
- **DOC-02**: Demos load configuration samples from `configs/` and run in browsers without console errors.

Success criteria:

1. `docs-gen` produces the latest API docs; a scripted docs build succeeds in CI with exit code 0.
2. At least 5 representative demo pages load and run without console errors in Chrome/Firefox.
3. Documentation navigation and a basic search/index link to API pages (manual smoke test passes).

Estimated effort: 3-5 days (small team / single maintainer).

---

### Phase 2: CI & Quality

Goal: Add automated quality gates to catch regressions early in PRs.

Requirements:

- **CI-01**: GitHub Actions runs lint and unit tests on pull requests.
- **CI-02**: Pre-commit formatting enforced via Prettier config.

Success criteria:

1. PRs trigger a CI job that runs linting and unit tests; failing jobs block merges.
2. Pre-commit hooks run Prettier on staged files and prevent commits with unformatted code.
3. A minimal test suite (unit + smoke) is present and executed in CI.

Estimated effort: 2-4 days.

---

### Phase 3: Build & Deploy Improvements

Goal: Produce deterministic build artifacts and simplify deployment by avoiding committed compiled outputs.

Requirements:

- **BUILD-01**: Build pipeline produces deterministic `dist/` and CI deploys that output (avoid committing compiled artifacts where possible).

Success criteria:

1. CI produces `dist/` artifacts and deploys them; compiled assets are no longer committed to source (or committed via a clear policy).
2. Local `npm run build` reproduces CI artifacts; developer documentation updated for build & deploy steps.

Estimated effort: 1-3 days.

---

## Traceability

All v1 requirements are mapped to a single phase. See `.planning/REQUIREMENTS.md` for requirement details and status.

## Next Steps

1. Discuss Phase 1 details: `/gsd-discuss-phase 1` (recommended) — gathers implementation context and acceptance tests.
2. Or start planning directly: `/gsd-plan-phase 1` — will create the phase plan and tasks.

---

_Roadmap generated: 2026-03-03_
