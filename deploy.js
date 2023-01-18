import fs from "fs-extra";
import path from "path";
import ghpages from "gh-pages";
import typedoc from "typedoc";
import { simpleGit } from "simple-git";
import pnpm from "@pnpm/exec";
import pkgInfo from "./package.json" assert { type: "json" };

const ghToken = process.env.GITHUB_TOKEN, gitUser = ghToken ? {
    name: "github-actions-bot",
    email: "support+actions@github.com"
} : {
    name: "Matteo Bruni",
    email: "176620+matteobruni@users.noreply.github.com",
};

(async () => {
    if (!(await fs.pathExists("./dist"))) {
        await fs.mkdir("./dist");
    }

    await fs.copy("./audio", "./dist/audio");
    await fs.copy("./configs", "./dist/configs");
    await fs.copy("./css", "./dist/css");
    await fs.copy("./fonts", "./dist/fonts");
    await fs.copy("./images", "./dist/images");
    await fs.copy("./js", "./dist/js");
    await fs.copy("./presets", "./dist/presets");
    await fs.copy("./samples", "./dist/samples");
    await fs.copy("./schema", "./dist/schema");
    await fs.copy("./videos", "./dist/videos");
    await fs.copyFile("./.nojekyll", "./dist/.nojekyll");
    await fs.copyFile("./404.html", "./dist/404.html");
    await fs.copyFile("./ads.txt", "./dist/ads.txt");
    await fs.copyFile("./CNAME", "./dist/CNAME");
    await fs.copyFile("./favicon.ico", "./dist/favicon.ico");
    await fs.copyFile("./index.html", "./dist/index.html");
    await fs.copyFile("./privacy.html", "./dist/privacy.html");
    await fs.copyFile("./sitemap.xml", "./dist/sitemap.xml");
    await fs.copyFile("./tsParticles-64.png", "./dist/tsParticles-64.png");
    await fs.copyFile("./video.html", "./dist/video.html");

    const remote = `https://github.com/matteobruni/tsparticles.git`;

    await simpleGit().clone(remote, "tmp_tsparticles", [
        "--depth",
        "1",
        "-b",
        `tsparticles@${pkgInfo.dependencies["tsparticles"].replace("^", "")}`,
    ]);

    await pnpm.default([ "install" ], {
        cwd: path.resolve("./tmp_tsparticles"),
    });

    const typedocApp = new typedoc.Application();

    typedocApp.options.addReader(new typedoc.TSConfigReader());
    typedocApp.options.addReader(new typedoc.TypeDocReader());

    typedocApp.bootstrap({
        options: "./tmp_tsparticles/engine/typedoc.json",
        tsconfig: "./tmp_tsparticles/engine/tsconfig.json",
    });

    const project = typedocApp.convert();

    if (project) {
        // Project may not have converted correctly
        const outputDir = "./dist/docs";

        // Rendered docs
        await typedocApp.generateDocs(project, outputDir);
    }

    await fs.remove("./tmp_tsparticles");

    ghpages.publish(
        "./dist",
        {
            repo: ghToken ? `https://git:${ghToken}@github.com/tsparticles/website.git` : `https://git:github.com/tsparticles/website.git`,
            dotfiles: true,
            history: false,
            message: "build: gh pages updated",
            user: gitUser,
        },
        function (publishErr) {
            if (!publishErr) {
                console.log("Website published successfully");
            } else {
                console.log(`Error publishing website: ${publishErr}`);
            }

            fs.rmSync("./dist", { recursive: true });
        }
    );
})();
