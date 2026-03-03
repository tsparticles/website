# ARCHITECTURE

Scope

- High-level architecture: responsibilities, layers, data flow, and where important logic lives.

Overview

- This repository is a static website with build-time documentation generation. There is no server-side application _within_ the repo besides deployment scripts (`deploy.js`).
- Primary responsibilities:
  - Static content: `index.html`, `*.html`, `css/`, `js/` — client-facing site assets
  - Documentation generation: `docs-gen/` — TypeScript/typedoc tooling to create API docs
  - Deployment automation: `.github/workflows/*` and `deploy.js`

Entry points

- `index.html` — main page entry for site
- `js/index.js`, `js/demo.js` — client JS for interactive features
- `docs-gen/` scripts — entry for docs building (TypeScript sources and typedoc config)

Data flow

- No dynamic backend; data flow occurs at build-time:
  - source assets (SCSS, JS) are compiled to `css/*.css`, `js/*.min.js`
  - `docs-gen` reads TypeScript code and produces documentation artifacts
  - GitHub Actions triggers `deploy.yml` to push built site to hosting

Abstractions & patterns

- No complex application patterns (no MVC, no services layer) — repo follows a simple static site organization.
- Use of `configs/` directory for reusable particle configurations (`configs/*.json`) indicates modular content consumption by client JS.

Where to change behavior

- Client behavior — modify `js/*.js` and associated `configs/*.json`.
- Styling — change `css/*.scss` and recompile.
- Docs pipeline — `docs-gen/` TypeScript and typedoc configuration.

Known limitations

- Single-repo static site can mix build code and generated artifacts; consider separating `docs-gen` output into `docs/` or `dist/`.
