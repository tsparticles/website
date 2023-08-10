import fs from "fs-extra";
import path from "path";
import ghpages from "gh-pages";
import { simpleGit } from "simple-git";
import pnpmExec from "@pnpm/exec";
import typedoc from "typedoc";
import docsGenData from "./docs-gen/data.json" assert { type: "json" };
import pkgInfo from "./package.json" assert { type: "json" };

const pnpm = pnpmExec.default, ghToken = process.env.GITHUB_TOKEN, gitUser = ghToken ? {
    name: "github-actions-bot", email: "support+actions@github.com"
} : {
    name: "Matteo Bruni", email: "176620+matteobruni@users.noreply.github.com"
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

    const docsGenPath = path.resolve(path.join(".", "docs-gen")),
        tmpDocsGenPath = path.resolve(path.join(docsGenPath, "tmp"));

    await fs.mkdir(tmpDocsGenPath);

    for (const remote of docsGenData) {
        console.log(`Cloning and building ${remote.package}`);

        const branch = "main"; //remote.package && pkgInfo.devDependencies[remote.package] ? `${remote.package}@${pkgInfo.devDependencies[remote.package].replace("^", "")}` : "main";

        // TODO: remove comments when the new tsParticles version will be released
        await simpleGit().clone(remote.url, path.join(tmpDocsGenPath, remote.folder), [
            "--depth",
            "1",
            "-b",
            branch
        ]);

        await pnpm(["install"], {
            cwd: path.resolve(path.join(tmpDocsGenPath, remote.folder))
        });

        await pnpm(["run", remote.buildCommand], {
            cwd: path.resolve(path.join(tmpDocsGenPath, remote.folder))
        });

        //await pnpm(["run", "build:docs"], {
        //    cwd: path.resolve(path.join(tmpDocsGenPath, remote.folder))
        //});

        //await fs.copy(path.join(tmpDocsGenPath, remote.folder, "docs"), path.join(".", "dist", "docs"));
    }

    const typedocApp = new typedoc.Application();

    typedocApp.options.addReader(new typedoc.TSConfigReader());
    typedocApp.options.addReader(new typedoc.TypeDocReader());

    await typedocApp.bootstrapWithPlugins({
        options: path.join(docsGenPath, "typedoc.json"),
        tsconfig: path.join(docsGenPath, "tsconfig.json")
    });

    const project = typedocApp.convert();

    if (project) {
        // Project may not have converted correctly
        const outputDir = path.join(".", "dist", "docs");
        // Rendered docs
        await typedocApp.generateDocs(project, outputDir);
    }

    await fs.remove(tmpDocsGenPath);

    ghpages.publish(path.join(".", "dist"), {
        repo: ghToken ? `https://git:${ghToken}@github.com/tsparticles/website.git` : `https://github.com/tsparticles/website.git`,
        dotfiles: true,
        history: false,
        message: "build: gh pages updated",
        user: gitUser
    }, function(publishErr) {
        if (!publishErr) {
            console.log("Website published successfully");
        } else {
            console.log(`Error publishing website: ${publishErr}`);
        }

        fs.rmSync(path.join(".", "dist"), { recursive: true });
    });
})();
