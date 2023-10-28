// @ts-check
import fs from "fs-extra";
import path from "path";
import { simpleGit } from "simple-git";
import pnpmExec from "@pnpm/exec";
import docsGenData from "./docs-gen/data.json" assert { type: "json" };

const pnpm = pnpmExec;

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
})();
