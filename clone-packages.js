// @ts-check
import { simpleGit } from "simple-git";
import pnpmExec from "@pnpm/exec";
import { fileURLToPath } from "url";
import fs from "fs-extra";
import path from "path";

(async () => {
    const __filename = fileURLToPath(import.meta.url),
        __dirname = path.dirname(__filename),
        rootPkgPath = path.join(__dirname, "docs-gen", "data.json"),
        docsGenData = (await fs.readJson(rootPkgPath)),
        pnpm = pnpmExec,
        docsGenPath = path.resolve(path.join(".", "docs-gen")),
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
