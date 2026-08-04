import { access, copyFile, mkdir, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourceWasm = path.join(root, "node_modules", "@mediapipe", "tasks-vision", "wasm");
const targetWasm = path.join(root, "public", "mediapipe", "wasm");
const targetModels = path.join(root, "public", "models");
const modelPath = path.join(targetModels, "hand_landmarker.task");
const tempModel = `${modelPath}.part`;
const modelUrl = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";
const wasmFiles = [
  "vision_wasm_internal.js",
  "vision_wasm_internal.wasm",
  "vision_wasm_module_internal.js",
  "vision_wasm_module_internal.wasm",
  "vision_wasm_nosimd_internal.js",
  "vision_wasm_nosimd_internal.wasm"
];

async function validFile(file, minimumSize) {
  try { const info = await stat(file); return info.isFile() && info.size >= minimumSize; } catch { return false; }
}

await mkdir(targetWasm, { recursive: true });
await mkdir(targetModels, { recursive: true });
let copied = 0;
for (const filename of wasmFiles) {
  try {
    await access(path.join(sourceWasm, filename));
    await copyFile(path.join(sourceWasm, filename), path.join(targetWasm, filename));
    copied += 1;
  } catch { /* Runtime retains a pinned official CDN fallback. */ }
}
console.log(`[setup] MediaPipe WASM copied: ${copied}/${wasmFiles.length}`);

if (!(await validFile(modelPath, 1_000_000))) {
  try {
    const response = await fetch(modelUrl, { signal: AbortSignal.timeout(60_000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.byteLength < 1_000_000) throw new Error(`Unexpected model size: ${bytes.byteLength}`);
    await writeFile(tempModel, bytes);
    await rename(tempModel, modelPath);
    console.log(`[setup] Hand model downloaded: ${bytes.byteLength} bytes`);
  } catch (error) {
    await rm(tempModel, { force: true });
    console.warn(`[setup] Local model unavailable; official runtime fallback remains active. ${error instanceof Error ? error.message : String(error)}`);
  }
} else {
  console.log("[setup] Local hand model already present.");
}
