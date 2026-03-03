## Playground QA Checklist

This checklist is intended for manual verification of the playground import/export and heavy-config flows.

Basic smoke tests

1. Load `samples/index.html` in a modern browser (Chrome/Firefox/Edge).
2. Open the sidebar and click a preset. Verify particles render and no console errors appear.
3. Edit a control (e.g., Particle Count slider). Verify particles update (debounced) and no console errors.

Import / Export tests

1. Export controls using `Export Controls` — confirm a JSON download is generated containing keys under `playground.v1.controls.*`.
2. Use `Import Controls` and select the exported file. The Import Preview modal should appear showing pretty-printed JSON.
3. Choose `Merge` mode and click `Import` — verify localStorage keys under `playground.v1.controls.*` are added/updated and controls update accordingly.
4. Repeat with `Replace` mode and confirm previous keys are removed before import.
5. Try an invalid JSON file — ensure a friendly error is shown (alert) and no keys are written.

Heavy config flow

1. Paste a large preset URL (or manually set `window.__pendingHeavyConfig` with a large object) into the preset input.
2. Confirm a `Run Heavy Preset` badge appears next to Reload. Click it and verify controls are disabled while applying and that the badge disappears afterwards.

Accessibility checks

1. Open Import modal, Tab through all focusable elements; confirm visible focus ring and logical tab order.
2. Use a screen reader (NVDA/VoiceOver) and open modal; confirm the title is announced.

Notes

- Tests should be run on desktop and mobile viewport sizes.
- If any test fails, capture console logs and a screenshot and file an issue.
