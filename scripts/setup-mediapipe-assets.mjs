import { access, cp, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const wasmSource = path.join(root, "node_modules", "@mediapipe", "tasks-vision", "wasm");
const wasmTarget = path.join(root, "public", "mediapipe", "wasm");
await mkdir(wasmTarget, { recursive: true });
try { await access(wasmSource); await cp(wasmSource, wasmTarget, { recursive: true, force: true }); console.log("[setup] MediaPipe WASM copied."); } catch { console.warn("[setup] Local WASM not copied; runtime will try the official CDN."); }
const models = [
  ["hand_landmarker.task", "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"],
  ["pose_landmarker_lite.task", "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task"],
  // Face mesh powers the mouth-open submit shortcut, camera-distance guidance
  // and player identity. The runtime treats it as optional, so a failed
  // download degrades to hand and pose tracking only.
  ["face_landmarker.task", "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"]
];
await mkdir(path.join(root,"public","models"),{recursive:true});
const available = [];
for (const [name,url] of models) {
  const target=path.join(root,"public","models",name);
  try { await access(target); console.log(`[setup] ${name} already present.`); available.push(name); continue; } catch { /* download */ }
  try { const response=await fetch(url); if(!response.ok)throw new Error(String(response.status)); await writeFile(target,Buffer.from(await response.arrayBuffer())); console.log(`[setup] downloaded ${name}`); available.push(name); } catch(error) { console.warn(`[setup] ${name} download skipped (${String(error)}); runtime retains official remote fallback.`); }
}

/*
 * A manifest of what is actually on disk.
 *
 * The runtime used to discover a missing model by requesting it and getting a
 * 404, which put a scary red line in the browser console every time the app
 * started without a full `npm install`. One tiny manifest fetch answers the
 * same question without a failed request.
 */
await writeFile(
  path.join(root, "public", "models", "manifest.json"),
  `${JSON.stringify({ models: available }, null, 2)}\n`
);
console.log(`[setup] manifest lists ${available.length} local model(s).`);
