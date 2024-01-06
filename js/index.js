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

    for (const config of configs) {
        editor.addPreset(config.text, `${configsUrl}/${config.id}.json`);
    }

    document.getElementById("input_m_Symbol(tsparticles)_editor_preset").value = randomUrl;

    editor.top().right().theme("neu-dark");

    const editorEl = document.getElementById("m_Symbol(tsparticles)_editor");

    editorEl.classList.add("d-md-block");
    editorEl.classList.add("d-none");
}, 100);
