import fs from "fs-extra";
import path from "path";
import { simpleGit } from "simple-git";
import pnpmExec from "@pnpm/exec";
import typedoc, { Application } from "typedoc";
import docsGenData from "./docs-gen/data.json" with { type: "json" };

const pnpm = pnpmExec.default;

(async () => {
    const docsGenPath = path.resolve(path.join(".", "docs-gen")),
        tmpDocsGenPath = path.resolve(path.join(docsGenPath, "tmp"));

    await fs.mkdir(tmpDocsGenPath);

    for (const remote of docsGenData) {
        console.log(`Cloning and building ${remote.package ?? remote.folder}`);

        const branch = "main"; //remote.package && pkgInfo.devDependencies[remote.package] ? `${remote.package}@${pkgInfo.devDependencies[remote.package].replace("^", "")}` : "main";

        // TODO: remove comments when the new tsParticles version will be released
        await simpleGit().clone(remote.url, path.join(tmpDocsGenPath, remote.folder), ["--depth", "1", "-b", branch]);

        console.log(`Installing packages on folder ${remote.folder}`);

        await pnpm(["install"], {
            cwd: path.resolve(path.join(tmpDocsGenPath, remote.folder)),
        });

        console.log(`Running command ${remote.buildCommand} packages on folder ${remote.folder}`);

        await pnpm(["run", remote.buildCommand], {
            cwd: path.resolve(path.join(tmpDocsGenPath, remote.folder)),
        });

        //await pnpm(["run", "build:docs"], {
        //    cwd: path.resolve(path.join(tmpDocsGenPath, remote.folder))
        //});

        //await fs.copy(path.join(tmpDocsGenPath, remote.folder, "docs"), path.join(".", "dist", "docs"));
    }

    try {
        const typedocApp = await Application.bootstrapWithPlugins(
            {
                options: path.join(docsGenPath, "typedoc.json"),
                tsconfig: path.join(docsGenPath, "tsconfig.json"),
            },
            [new typedoc.TSConfigReader(), new typedoc.TypeDocReader()],
        );

        const project = await typedocApp.convert();

        if (project) {
            if (!(await fs.pathExists("./dist"))) {
                await fs.mkdir("./dist");
            }

            // Project may not have converted correctly
            const outputDir = path.join(".", "dist", "docs");
            // Rendered docs
            await typedocApp.generateDocs(project, outputDir);
        }
    } catch (e) {
        console.log("Error during docs generation", e);
    }

    await fs.remove(tmpDocsGenPath);
})();
