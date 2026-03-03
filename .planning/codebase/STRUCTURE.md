# STRUCTURE

Scope

- Directory layout, important files, and where to find implementation for common concerns.

Top-level layout (files & folders)

- `index.html`, `404.html`, `privacy.html`, `cookies.html`, `video.html` — site pages (root HTML files)
- `js/` — JavaScript source files
  - `js/index.js` — main client script
  - `js/demo.js` — demos and interactive examples
  - `js/cookie-banner.js`, `js/consent-manager.js` — consent logic
- `css/` — compiled CSS and source SCSS
  - `css/*.scss` — SCSS sources
- `configs/` — particle configuration JSON files used by client code
- `images/`, `fonts/` — static assets
- `docs-gen/` — documentation generation tooling (TypeScript + typedoc configs)
- `.github/workflows/` — CI and deploy pipelines
- `deploy.js`, `docs-gen.js` — build/deploy helper scripts
- `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml` — package manager and dependencies

Key files to inspect

- `package.json` — scripts and dev/build commands
- `.github/workflows/deploy.yml` — deployment behavior and secrets usage
- `docs-gen/typedoc.json` and `docs-gen/tsconfig.json` — how docs are generated
- `js/index.js` and `js/demo.js` — client-side behavior and usage of `configs/`

Conventions

- Static assets served from root — update paths in HTML accordingly.
- `configs/` JSON files are treated as input for runtime particle behavior; keep them validated if new configs are added.

Suggestions

- Consider adding a `dist/` or `build/` folder to contain compiled site artifacts instead of mixing them with sources.
- Add `CONTRIBUTING.md` or `DEVELOPER.md` with local dev steps (installing pnpm, build commands, run dev server).
