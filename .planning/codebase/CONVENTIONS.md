# CONVENTIONS

Scope

- Coding style, naming, error handling, and repository conventions observed in the codebase.

Observed conventions

- JavaScript for client code with ES modules (check `js/` for exact style). Some build-time TypeScript in `docs-gen/`.
- SCSS sources in `css/` compiled to CSS files (minified outputs included in repo).
- Scripts and tooling centralized in `package.json` and top-level JS scripts (`deploy.js`, `docs-gen.js`).

Naming & structure

- Files use kebab-case (e.g., `cookie-banner.js`, `main.css`).
- Config JSONs use `camelCase` keys for some files — open individual config files in `configs/` to confirm.

Error handling and logging

- Client-side scripts keep behavior lightweight — error handling likely minimal; inspect `js/*.js` for patterns.

Linter & formatting

- Repo contains `.prettierrc` — Prettier formatting configured.
- No top-level ESLint config found — consider adding `.eslintrc` to enforce JS/TS conventions.

Recommendations

- Add an ESLint configuration (or TypeScript linting) for consistent style in `js/` and `docs-gen/`.
- Document code ownership and preferred patterns in `CONTRIBUTIONS.md` or `DEVELOPER.md`.
