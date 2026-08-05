import { access, rm } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

export async function compileEngine() {
  await rm(path.join(process.cwd(), ".qa-dist"), { recursive: true, force: true });

  const localCompiler = path.join(
    process.cwd(),
    "node_modules",
    "typescript",
    "bin",
    "tsc"
  );

  let hasLocalCompiler = false;
  try {
    await access(localCompiler);
    hasLocalCompiler = true;
  } catch {
    // A global compiler is only a fallback for controlled QA environments.
  }

  if (hasLocalCompiler) {
    const result = spawnSync(
      process.execPath,
      [localCompiler, "-p", "tsconfig.engine.json"],
      { stdio: "inherit", shell: false }
    );
    if (result.error) throw result.error;
    if (result.status !== 0) {
      throw new Error(`Engine compilation failed with status ${result.status}`);
    }
    return;
  }

  const fallbackCommand = process.platform === "win32" ? "tsc.cmd" : "tsc";
  const fallback = spawnSync(
    fallbackCommand,
    ["-p", "tsconfig.engine.json"],
    { stdio: "inherit", shell: process.platform === "win32" }
  );
  if (fallback.error) throw fallback.error;
  if (fallback.status !== 0) {
    throw new Error(`Engine compilation failed with status ${fallback.status}`);
  }
}
