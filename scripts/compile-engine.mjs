import { access, rm } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

export async function compileEngine() {
  await rm(path.join(process.cwd(), ".qa-dist"), { recursive: true, force: true });
  const local = path.join(process.cwd(), "node_modules", "typescript", "bin", "tsc");
  let compiler = "/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript/bin/tsc";
  try { await access(local); compiler = local; } catch { try { await access(compiler); } catch { compiler = "tsc"; } }
  const args = compiler === "tsc" ? ["-p", "tsconfig.engine.json"] : [compiler, "-p", "tsconfig.engine.json"];
  const command = compiler === "tsc" ? "tsc" : process.execPath;
  const result = spawnSync(command, args, { stdio: "inherit", shell: false });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Engine compile failed (${result.status})`);
}
