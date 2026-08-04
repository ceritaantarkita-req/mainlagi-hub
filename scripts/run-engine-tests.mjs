import { readdir } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { compileEngine } from "./compile-engine.mjs";

await compileEngine();
const files = (await readdir(path.join(process.cwd(), "tests")))
  .filter((name) => name.endsWith(".test.mjs"))
  .map((name) => path.join("tests", name));
const result = spawnSync(process.execPath, ["--test", ...files], { stdio: "inherit" });
if (result.error) throw result.error;
if (result.status !== 0) process.exitCode = result.status ?? 1;
