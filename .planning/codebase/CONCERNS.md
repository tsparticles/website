# CONCERNS

Scope

- Technical debt, security, maintenance risks, and fragile areas identified in the repository.

Key concerns

- No automated tests — risk of regressions when changing JS/SCSS or docs generation.
- Compiled artifacts tracked in repo (CSS minified files present) — may cause merge conflicts and unclear source of truth.
- No ESLint configuration detected — inconsistent JS/TS style could accumulate.

Security & secrets

- Check `.github/workflows/deploy.yml` and `deploy.js` for secrets usage. Ensure secrets are only in GitHub Actions secrets.
- Search repo for accidental tokens (run repository-wide secret scan before committing generated docs).

Performance & maintainability

- Large number of `configs/*.json` files used at runtime. Consider validating them and centralizing shared keys.
- Adding build outputs (minified CSS/JS) to Git may increase repo size.

Operational concerns

- CI/deploy may rely on environment assumptions (Node version, pnpm). Add `engines` in `package.json` and CI matrix to pin versions.

Priority fixes

1. Add basic unit tests and CI test step.
2. Introduce ESLint and add a lint step to CI.
3. Move compiled assets to a `dist/` folder or add build step in CI to avoid committing generated files.
