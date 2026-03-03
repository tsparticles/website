# Phase 1: Docs & Demos Baseline - Context

**Gathered:** 2026-03-03
**Status:** Ready for planning

## Phase Boundary

Deliver a reliable documentation site and interactive demos: API docs generated from TypeScript (`docs-gen/`) and in-browser demos that load `configs/` presets and let users experiment with particle configurations. This phase does not add user accounts, server-side storage, or new backend services.

## Implementation Decisions

### Interactive demo UX

- Editable playground: demos are interactive in-browser editors (users can tweak parameters and see immediate results). This is a locked decision.
- Preset library: provide a browsable library of presets loaded from the repo's `configs/` directory with one-click load into the playground.
- Live edits & immediate render: parameter changes apply as-they-type for fast feedback. Implement sensible safeguards (debounce/throttle) for expensive configs — planner/researcher should recommend specifics.
- Export & sharing: offer "Copy JSON" and client-side shareable URLs (encode preset in URL fragment) so demos are shareable without a backend.

### Playground behavior

- One-click preset load: each preset in the library shows a small preview and a "Load" action that populates the playground editor.
- URL-permalinks are client-side only: encode the configuration in the fragment/hash (e.g., base64 or compact JSON) to avoid server changes. This is the chosen approach; server-backed permalink storage is deferred.
- Editor controls: a compact, form-based control panel (sliders, toggles, inputs) that maps to `configs/` keys. Exact control selection and layout are left to planner/Claude discretion.

### Performance guardrails (high-level)

- Live rendering is required, but heavy configs must not freeze the UI. Researcher should propose debounce defaults and recommend whether to do incremental updates or full reinitialization on change.
- Avoid heavy bundlers or frameworks for the playground UI — keep implementation lightweight consistent with the repo's vanilla JS approach.

### Claude's Discretion

- Exact UI layout, spacing, and visual styling of the control panel (follow existing site styles).
- Debounce/throttle parameters and strategy (e.g., 150–300ms debounce or requestAnimationFrame batching).
- URL encoding format (base64 vs compressed JSON) and encoding libraries to use.
- Whether preset previews are generated client-side (render at load) or precomputed as thumbnails (deferred if not trivial).

## Specific Ideas

- Reuse `configs/` JSON files as the canonical preset source; display presets with a small live preview (rendered in a tiny canvas) and name/description from the JSON (add description field if missing).
- Reuse `js/demo.js` (and `js/index.js` patterns) to integrate the playground — prefer adding modular functions rather than introducing a framework.
- Place the playground on existing demo pages and a central `/playground` page that exposes the full preset library.

## Existing Code Insights

### Reusable Assets

- `configs/` — existing preset JSON files; use as preset library source.
- `js/demo.js` — existing demo code for initializing particle demos; extend or extract modular init/update functions from it.
- `js/index.js`, `js/demo.js` patterns — site uses vanilla JS; prefer small, dependency-free modules.
- `css/` / SCSS — follow existing styling tokens and patterns for control panel styles to keep look-and-feel consistent.

### Established Patterns

- Static, client-side behavior: site is a static site (no server runtime). Implement playground as client-only feature.
- Config-driven demos: demos read JSON configs from `configs/` — continue this pattern rather than embedding data in HTML.

### Integration Points

- Demo pages (`index.html`, `video.html`, and per-demo pages in repo root) — playground can be embedded into existing demo pages and/or exposed as a standalone `/playground` page.
- Asset loading: presets can be fetched via static fetch/ import; ensure CI/Docs build copies `configs/` into served assets if needed.

## Deferred Ideas

- Server-side permalink storage or share links that survive config size limits — deferred to a later phase.
- User accounts, saved presets tied to users, or preset versioning — backlog for future phases.
- Advanced preset gallery features (ratings, comments, featured collections) — deferred.

---

_Phase: 01-docs-demos-baseline_
_Context gathered: 2026-03-03_
