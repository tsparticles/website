# Requirements: tsParticles Website

**Defined:** 2026-03-03
**Core Value:** Make it effortless for developers to discover, evaluate, and integrate tsParticles

## v1 Requirements

### Documentation

- [ ] **DOC-01**: Documentation site pages render with up-to-date API docs generated from TypeScript sources (`docs-gen/`).
- [ ] **DOC-02**: Demos load configuration samples from `configs/` and run in browsers without console errors.

### CI & Quality

- [ ] **CI-01**: GitHub Actions runs lint and unit tests on pull requests.
- [ ] **CI-02**: Pre-commit formatting enforced via Prettier config.

### Build & Deploy

- [ ] **BUILD-01**: Build pipeline produces deterministic `dist/` and CI deploys that output (avoid committing compiled artifacts where possible).

## v2 Requirements

- **DOC-03**: Improved developer experience for docs generation (one-command docs build + local preview).
- **CI-03**: Add coverage reporting and fail CI on decreased coverage.

## Out of Scope

| Feature          | Reason                                               |
| ---------------- | ---------------------------------------------------- |
| Server-side APIs | Repository is a static site; backend is out of scope |
| Mobile app       | Web-first focus for now                              |

## Traceability

| Requirement | Phase   | Status  |
| ----------- | ------- | ------- |
| DOC-01      | Phase 1 | Pending |
| DOC-02      | Phase 1 | Pending |
| CI-01       | Phase 1 | Pending |
| CI-02       | Phase 1 | Pending |
| BUILD-01    | Phase 1 | Pending |

**Coverage:**

- v1 requirements: 5 total
- Mapped to phases: 5
- Unmapped: 0 ✓

---

_Requirements defined: 2026-03-03_
