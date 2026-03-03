setTimeout(async () => {
    hljs.highlightAll();

    await loadAll(tsParticles);

    const configsUrl = "/configs",
        configs = [
            {
                id: "amongUs",
                text: "Among Us",
            },
            {
                id: "colors",
                text: "Colors",
            },
            {
                id: "confetti",
                text: "Confetti",
            },
            {
                id: "confettiExplosions",
                text: "Confetti Explosions",
            },
            {
                id: "fireworks",
                text: "Fireworks",
            },
            {
                id: "hexagonPath",
                text: "Hexagons",
            },
            {
                id: "light",
                text: "Light",
            },
            {
                id: "sideConfetti",
                text: "Side Confetti",
            },
            {
                id: "starry",
                text: "Starry",
            },
            {
                id: "tunnel",
                text: "Tunnel",
            },
        ];

    console.log(Math.floor(configs.length * Math.random()));

    const randomIdx = Math.floor(Math.random() * configs.length),
        randomEl = configs[randomIdx],
        randomUrl = `${configsUrl}/${randomEl.id}.json`,
        container = await tsParticles.load({ id: "tsparticles", url: randomUrl }),
        editor = showEditor(container);

    // After the editor is created, request the demo to sync controls from it
    // so the sidebar inputs reflect the current options.
    try {
        if (window && window.syncControlsFromEditor) {
            window.syncControlsFromEditor();
        }
    } catch (e) {}

    // Wire simple control inputs to the new applyPartialConfig API with debounce
    // Prefer demo's debounce helper if available
    const debounce =
        window.debounce ||
        function (fn, wait) {
            let t = null;
            return function (...args) {
                if (t) clearTimeout(t);
                t = setTimeout(() => {
                    t = null;
                    try {
                        fn.apply(this, args);
                    } catch (e) {
                        console.error("debounced function error", e);
                    }
                }, wait);
            };
        };

    const presetInput = document.getElementById("input_m_Symbol(tsparticles)_editor_preset");
    if (presetInput) {
        const applyPresetUrl = debounce(async function (value) {
            if (!value) return;

            try {
                // If the value looks like a configs URL, fetch and apply full config
                if (value.indexOf("/configs/") !== -1 || value.trim().endsWith(".json")) {
                    const res = await fetch(value);
                    if (!res.ok) return;
                    const cfg = await res.json();
                    // If config is large, applyFullConfig to avoid partial-load issues
                    const str = JSON.stringify(cfg);
                    // Use global threshold if available
                    const threshold = window.HEAVY_CONFIG_CHAR_THRESHOLD || HEAVY_CONFIG_CHAR_THRESHOLD;
                    if (str.length > threshold) {
                        // Defer full application — mark pending and show badge so user hits Run
                        // Prefer the demo-provided helper; fall back to setting the window var
                        if (window.markPendingHeavyConfig) {
                            try {
                                window.markPendingHeavyConfig(cfg);
                            } catch (e) {
                                console.warn("markPendingHeavyConfig failed", e);
                                window.__pendingHeavyConfig = cfg;
                            }
                        } else {
                            window.__pendingHeavyConfig = cfg;
                            try {
                                showPendingRunBadge(true);
                            } catch (e) {}
                        }
                    } else {
                        window.applyPartialConfig(cfg);
                    }
                } else {
                    // otherwise assume it's a small inline JSON fragment
                    try {
                        const patch = JSON.parse(value);
                        window.applyPartialConfig(patch);
                    } catch (e) {
                        // ignore parse errors
                    }
                }
            } catch (e) {
                console.error("applyPresetUrl", e);
            }
        }, 200);

        presetInput.addEventListener("input", function (e) {
            applyPresetUrl(e.target.value);
        });
    }

    // Wire additional simple controls (example sliders/inputs) to call applyPartialConfig.
    // We'll look for elements with data-patch attributes that contain a JSON Pointer
    // path and a value type. Example: <input data-patch='{"path":"particles.number.value","type":"number"}'>
    const patchControls = document.querySelectorAll("[data-patch]");
    for (const el of patchControls) {
        try {
            const meta = JSON.parse(el.getAttribute("data-patch"));
            const applyControl = debounce(function (ev) {
                let raw = el.value;
                let value;
                switch (meta.type) {
                    case "number":
                        value = Number(raw);
                        break;
                    case "boolean":
                        value = el.checked || raw === "true";
                        break;
                    case "json":
                        try {
                            value = JSON.parse(raw);
                        } catch (e) {
                            return;
                        }
                        break;
                    default:
                        value = raw;
                }

                // build a simple nested patch object from dot notation path
                const pathParts = meta.path.split(".");
                let patch = {};
                let cur = patch;
                for (let i = 0; i < pathParts.length; i++) {
                    const p = pathParts[i];
                    if (i === pathParts.length - 1) {
                        cur[p] = value;
                    } else {
                        cur[p] = {};
                        cur = cur[p];
                    }
                }

                window.applyPartialConfig(patch);
            }, 200);

            el.addEventListener("input", applyControl);
            // if checkbox
            if (el.type === "checkbox") el.addEventListener("change", applyControl);
        } catch (e) {
            // ignore malformed metadata
        }
    }

    for (const config of configs) {
        editor.addPreset(config.text, `${configsUrl}/${config.id}.json`);
    }

    document.getElementById("input_m_Symbol(tsparticles)_editor_preset").value = randomUrl;

    editor.top().right().theme("neu-dark");

    const editorEl = document.getElementById("m_Symbol(tsparticles)_editor");

    editorEl.classList.add("d-md-block");
    editorEl.classList.add("d-none");

    // Add share/export controls: look for buttons with data-share="lz" to
    // produce a compressed URL fragment using LZ-String. If the compressed
    // payload exceeds ~1900 chars, offer a JSON download fallback.
    const shareButtons = document.querySelectorAll('[data-share="lz"]');
    if (shareButtons && shareButtons.length) {
        // lazy-load lz-string from node_modules (available in dev); in the
        // browser we'll expect a global LZString if bundled; provide a simple
        // dynamic import fallback that tries to load from /node_modules path.
        async function getLZ() {
            if (window.LZString) return window.LZString;

            // Try dynamic import from node_modules (may work in dev/bundled env)
            try {
                const mod = await import("/node_modules/lz-string/libs/lz-string.min.js");
                return window.LZString || mod;
            } catch (e) {
                console.warn("LZ-String not available via dynamic import", e);
            }

            // Try injecting CDN script as a fallback (works in production without bundling)
            const cdn = "https://cdn.jsdelivr.net/npm/lz-string/libs/lz-string.min.js";
            if (!document.querySelector(`script[src=\"${cdn}\"]`)) {
                await new Promise((resolve, reject) => {
                    const s = document.createElement("script");
                    s.src = cdn;
                    s.onload = () => resolve();
                    s.onerror = (err) => reject(err);
                    document.head.appendChild(s);
                }).catch((err) => {
                    console.warn("Failed to load LZ-String from CDN", err);
                });
            }

            return window.LZString || null;
        }

        // Hook share buttons to show a modal with the compressed link and copy action
        for (const btn of shareButtons) {
            btn.addEventListener("click", async function () {
                const container = tsParticles.domItem(0);
                if (!container) return;

                const blob = await container.export("json");
                const json = await blob.text();

                const lz = await getLZ();
                if (!lz) {
                    // fallback: download JSON
                    const b = new Blob([json], { type: "application/json" });
                    const url = URL.createObjectURL(b);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "particles.json";
                    a.click();
                    URL.revokeObjectURL(url);
                    return;
                }

                const compressed = lz.compressToEncodedURIComponent(json);

                if (compressed.length > 1900) {
                    const b = new Blob([json], { type: "application/json" });
                    const url = URL.createObjectURL(b);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "particles.json";
                    a.click();
                    URL.revokeObjectURL(url);
                    return;
                }

                const shareUrl = window.location.origin + window.location.pathname + "#preset=" + compressed;

                // Fill modal and show
                try {
                    const shareModalEl = document.getElementById("shareModal");
                    const shareInput = document.getElementById("shareLinkInput");
                    const copyBtn = document.getElementById("shareCopyBtn");

                    if (shareInput) shareInput.value = shareUrl;

                    if (copyBtn) {
                        copyBtn.onclick = async function () {
                            if (navigator.clipboard) {
                                try {
                                    await navigator.clipboard.writeText(shareUrl);
                                    copyBtn.innerText = "Copied";
                                    setTimeout(() => (copyBtn.innerText = "Copy"), 1500);
                                    return;
                                } catch (e) {}
                            }

                            // fallback: select & execCopy
                            try {
                                shareInput.select();
                                document.execCommand("copy");
                                copyBtn.innerText = "Copied";
                                setTimeout(() => (copyBtn.innerText = "Copy"), 1500);
                            } catch (e) {}
                        };
                    }

                    const bsModal = new bootstrap.Modal(shareModalEl);
                    bsModal.show();
                } catch (e) {
                    // fallback to prompt
                    if (navigator.clipboard) {
                        try {
                            await navigator.clipboard.writeText(shareUrl);
                            alert("Shareable URL copied to clipboard");
                            return;
                        } catch (e) {}
                    }

                    prompt("Shareable URL:", shareUrl);
                }
            });
        }
    }
}, 100);
