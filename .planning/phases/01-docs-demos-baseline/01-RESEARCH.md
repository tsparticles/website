# Phase 1 Research — Interactive Demo UX

**Objective:** Produce actionable recommendations that let the planner and implementers build the editable playground UX described in `01-CONTEXT.md`. Focus areas: live-edit rendering strategy (debounce/throttle), client-side shareable URL encoding, preset preview generation, and UI control patterns driven by `configs/`.

Relevant files & starting points

- Presets source: `configs/` (repo root) — canonical preset JSON files.
- Demo initializer: `js/demo.js` — current demo boot and configuration patterns.
- Context: `.planning/phases/01-docs-demos-baseline/01-CONTEXT.md` (decisions to honor).

Summary of recommended choices (short)

- Rendering: Live edits with a 200ms debounce by default; use requestAnimationFrame batching for DOM/Canvas updates and a fallback "Run" button for extremely heavy configs (size/complexity threshold).
- URL sharing: Use LZ-String `compressToEncodedURIComponent` to compress preset JSON into the hash fragment. Provide a copyable JSON fallback and detect exceeding typical URL length limits (~2000 chars) to fall back to download.
- Preset previews: Generate lightweight client-side previews at runtime (rendered into tiny canvases lazily) and optionally precompute thumbnails during docs build if performance becomes an issue.
- Controls: Derive control UIs from preset JSON types with a small metadata mapping (recommended schema). Map numbers→slider/number input, booleans→toggle, colors→color picker, enums→select, arrays→repeatable lists.

1. Live rendering strategy (debounce, batching, heavy-config fallback)

Findings

- Live editing is the preferred UX for fast iteration. However, full re-initialization on every keystroke can be expensive for complex particle configurations (many emitters, heavy physics).
- The repo's demos initialize from `configs/` and call update functions in `js/demo.js` — extend these functions to support incremental updates.

Recommendations (detailed)

- Default debounce: 200ms (±50ms tuning allowed). Apply debounce to control inputs before calling the update pipeline.
- Use requestAnimationFrame for DOM/canvas draws to avoid layout thrashing: queue the render via `requestAnimationFrame()` after debounced input triggers.
- For numeric/sliders where rapid changes occur, use `input` events with debounce; for color pickers, apply immediate previews but keep heavier updates debounced.
- Heavy-config detection: compute a simple heuristic score (e.g., number of keys + total particle count if present). If score > threshold (suggested: 1000) switch the editor UI to show a prominent "Run" button and explain "Complex configuration — click Run to render." Planner should add a task to define the heuristic and threshold.

Implementation notes

- Expose two public functions in demo init module: `applyPartialConfig(patch)` and `applyFullConfig(config)`; use partial when possible to update only changed values.
- Where partial updates aren't possible, `applyFullConfig` should gracefully tear down and reinitialize the particle instance (keep teardown lightweight).

2. URL encoding & shareable permalinks

Findings

- Preset JSON can be large; storing the whole JSON directly in a fragment can exceed practical URL lengths. Compression is necessary for good UX.

Options considered

- plain JSON in fragment — simple but long; fails for big configs.
- base64(JSON) — shorter than raw but still verbose.
- compressed (LZ-String) + encodedURIComponent — compact and client-friendly, common pattern for client-side permalinks.
- server-backed permalink (POST) — avoids URL length but requires server storage and auth considerations (deferred).

Recommendation (concrete)

- Use LZ-String's `compressToEncodedURIComponent` on the JSON string and put the result in `location.hash` (e.g., `#preset=<data>`). Use `LZString.decompressFromEncodedURIComponent` to restore. This works in pure client-side apps and is straightforward to implement.
- Implement a fallback: if compressed length > 1900 characters (conservative limit for most browsers and social previews), don't write the fragment; instead show a UI that allows the user to download the JSON or copy the raw JSON to clipboard. Offer an informational tooltip: "Preset too large for shareable URL — download or copy instead."

Libraries & references

- LZ-String: https://pieroxy.net/blog/pages/lz-string/index.html — small, widely used for URL-safe compression.
- Alternative (more compression): pako (zlib/gzip) + base64 — smaller payloads but larger library footprint and slightly more complex encoding/decoding. Use only if URL sizes remain problematic after LZ-String.

3. Preset previews (thumbnails & library UX)

Findings

- Two practical preview paths: (A) client-rendered tiny canvases on demand, (B) precomputed thumbnails during docs/build. The repo currently serves static assets and build tooling (`docs-gen/`) — adding precomputed thumbnails is feasible but adds build complexity.

Recommendations

- Start with client-side lazy preview rendering: when preset appears in library, render a tiny offscreen canvas (e.g., 120×80) with simplified config (cap particle counts, limit duration) to generate a thumbnail. Cache the thumbnail in memory for the session.
- If performance issues observed (e.g., many presets cause high initial CPU), add a queued renderer with concurrency limit (render at most 2 previews simultaneously).
- Optional improvement later: during CI/docs build, run a small Node script that loads preset, renders a snapshot using headless Canvas (via headless browser or node-canvas) and writes a PNG thumbnail into `docs-assets/presets/`. Planner can add this as Phase 3 / follow-up.

4. UI control mapping & metadata

Findings

- Preset JSON files vary in structure; generic controls are possible but richer UX requires metadata (min/max/step/labels) per key. There is no dedicated schema in `configs/` today.

Recommendations (practical)

- Add optional metadata fields to presets, e.g.,

```json
{
  "name": "Confetti",
  "description": "Colorful confetti burst",
  "controls": {
    "particles.count": { "type": "number", "min": 0, "max": 5000, "step": 1 },
    "particles.color": { "type": "color" },
    "emitters.auto": { "type": "boolean" }
  }
}
```

- Planner task: define a small metadata extension that stays optional; if absent, the playground derives reasonable defaults (numbers→range slider with heuristic min/max, booleans→toggle, strings→text input).
- Mapping rules:
  - number → slider + numeric input (show both)
  - boolean → toggle switch
  - color string (`#rrggbb`) → color input
  - enum (finite set) → select dropdown
  - array of numbers/objects → repeatable list with add/remove

5. Performance thresholds & heuristics

Suggested heuristic for "heavy config":

- Score = (sum of numeric values of keys that indicate particle counts) + (number of emitters _ 100) + (depth of config _ 10).
- Suggested threshold: Score > 1000 → consider heavy. Planner may tune after measurements.

6. Accessibility & UX considerations

- Ensure controls are keyboard-accessible and labeled for screen readers.
- Provide visible status when rendering (loading spinner or small overlay) for operations >250ms.
- Copy/share action should be one-click and indicate success.

7. Concrete deliverables for planner & researcher

- Researcher tasks:
  1. Prototype and measure debounce defaults: test 100, 200, 300ms across a representative set of `configs/` (choose 5 presets: small → large) and report CPU/latency metrics. Write results to `.planning/phases/01-docs-demos-baseline/DEBOUNCE_RESULTS.md`.
  2. Evaluate URL size distributions after LZ-String compression for all presets in `configs/`. Report percent that fit under 1900 chars and suggest fallback behavior. Write `.planning/phases/01-docs-demos-baseline/URL_STATS.md`.
  3. Prototype client-side thumbnail rendering strategy and measure time-per-preview for 20 presets; recommend concurrency limits. Write `.planning/phases/01-docs-demos-baseline/PREVIEW_PROOF.md`.

- Planner tasks (next phase):
  1. Implement playground shell and integrate `js/demo.js` with `applyPartialConfig`/`applyFullConfig` APIs.
  2. Implement preset library UI, lazy preview rendering with concurrency queue, one-click load.
  3. Add URL sharing using LZ-String with size detection and fallback.
  4. Add metadata schema for presets (optional) and UI mapping.

8. Risks & notes

- Encoding in URL fragments may still fail for extremely detailed configs; server-backed permalinks are a long-term solution.
- Any library added (LZ-String/pako) increases bundle size — prefer small libs; measure the cost and consider delivering the compressor as a separate lazy-loaded module.

---

_Research produced: 2026-03-03_
