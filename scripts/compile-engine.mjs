import { access, rm } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

export async function compileEngine() {
  await rm(path.join(process.cwd(), ".qa-dist"), { recursive: true, force: true });
  const local = path.join(process.cwd(), "node_modules", ".bin", process.platform === "win32" ? "tsc.cmd" : "tsc");
  let command = "tsc";
  try { await access(local); command = local; } catch { /* use global tsc in controlled QA environments */ }
  const result = spawnSync(command, ["-p", "tsconfig.engine.json"], { stdio: "inherit", shell: false });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Engine compilation failed with status ${result.status}`);
}
