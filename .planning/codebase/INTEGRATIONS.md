# INTEGRATIONS

Scope

- External services, APIs, hosting, analytics, and authentication integrations referenced in the repo.

Detected integrations (where to look)

- GitHub Pages / GitHub Actions — deployment workflows: `.github/workflows/deploy.yml` and `deploy.js`.
- Third-party analytics / badges — images and badges in `images/` may reference external services (inspect `README.md` and HTML files).
- No explicit backend or database code detected — this is a static website repository.

Where to search in repo

- `deploy.js` and `.github/workflows/deploy.yml` — hosting deployment targets and secrets location.
- `index.html`, `privacy.html`, other HTML files — may reference analytics scripts or third-party widgets.
- `cookie-banner` and `consent-manager` scripts under `js/` — check for third-party consent integrations.

Secrets & tokens

- Search for usage of `process.env` in `deploy.js` or GitHub Actions secrets in workflow files.
- Ensure secrets are stored in GitHub Actions secrets and not committed in code.

Recommendations

- If the site uses analytics (e.g., Google Analytics, Plausible), document where the tracking ID is configured (HTML or env).
- Audit `.github/workflows/deploy.yml` for any references to cloud provider secrets; ensure they use GitHub Secrets.
- Document any external widgets and their privacy implications in `INTEGRATIONS.md` with file references.
