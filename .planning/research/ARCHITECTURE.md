# Research — Architecture

Scope

- Typical architecture and recommended component boundaries for a documentation + demo static site.

Observed architecture

- Static site (HTML/CSS/JS) served from GitHub Pages or similar static hosting.
- Docs pipeline: `docs-gen/` reads TypeScript and outputs generated docs during build.

Recommended component boundaries

- Content: Markdown/HTML pages and demo pages (client-side rendering).
- Docs generation: TypeScript sources → TypeDoc → HTML/markdown output (build-time responsibility).
- Assets: `images/`, `fonts/`, `configs/` — treated as static assets served as-is.

Build order suggestions

1. Run docs generation (`docs-gen`) to update API docs.
2. Build/compile SCSS to CSS.
3. Minify/prepare JS if needed.
4. Produce `dist/` and deploy.

Data flow

- Input: source TypeScript + configs + SCSS/JS
- Processing: docs-gen, SCSS compiler, optional JS bundler
- Output: static site files in `dist/` (or committed files if preferred)

Confidence

- High for observed parts; recommendations are standard static-site practices.
