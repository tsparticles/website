# TESTING

Scope

- Testing frameworks, test locations, and recommendations for adding tests.

Current state

- No `test/` or `__tests__` directories detected in the repository root.
- No explicit test runner configuration (e.g., Jest, Mocha) was found.

What to add

- Developer tests:
  - Unit tests for `docs-gen/` TypeScript code using Jest + ts-jest or vitest.
  - Small integration tests for `deploy.js` using node test runners.
- Client tests:
  - Add unit tests for core utility functions in `js/` with Jest/Playwright depending on DOM usage.

Suggested structure

- `test/` or `__tests__/` for unit tests
- `e2e/` for end-to-end tests (Playwright) if you need to validate the built site in browsers

CI integration

- Add test step to `.github/workflows/nodejs.yml` to run unit tests and report coverage.

Recommendations

- Introduce `vitest` for fast TypeScript-friendly unit tests, or `jest` if the team prefers it.
- Add a `test` script to `package.json` and a coverage reporter (`--coverage`) to keep quality visible in CI.
