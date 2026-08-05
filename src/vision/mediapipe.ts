import type { Landmark } from "./hand-utils";

export interface DetectedHand {
  landmarks: Landmark[];
  handedness: string;
  confidence: number;
}

export interface HandTracker {
  detect(video: HTMLVideoElement, timestamp: number): DetectedHand[];
  close(): void;
}

const LOCAL_WASM = "/mediapipe/wasm";
const REMOTE_WASM = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
const LOCAL_MODEL = "/models/hand_landmarker.task";
const REMOTE_MODEL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

export async function createHandTracker(maxHands = 4): Promise<HandTracker> {
  const vision = await import("@mediapipe/tasks-vision");
  const wasmCandidates = process.env.NEXT_PUBLIC_MEDIAPIPE_WASM_URL
    ? [process.env.NEXT_PUBLIC_MEDIAPIPE_WASM_URL]
    : [LOCAL_WASM, REMOTE_WASM];
  const modelCandidates = process.env.NEXT_PUBLIC_HAND_LANDMARKER_MODEL_URL
    ? [process.env.NEXT_PUBLIC_HAND_LANDMARKER_MODEL_URL]
    : [LOCAL_MODEL, REMOTE_MODEL];

  let lastError: unknown = null;
  for (const wasmPath of wasmCandidates) {
    let fileset;
    try {
      fileset = await vision.FilesetResolver.forVisionTasks(wasmPath);
    } catch (error) {
      lastError = error;
      continue;
    }

    for (const modelPath of modelCandidates) {
      for (const delegate of ["GPU", "CPU"] as const) {
        try {
          const landmarker = await vision.HandLandmarker.createFromOptions(fileset, {
            baseOptions: { modelAssetPath: modelPath, delegate },
            runningMode: "VIDEO",
            numHands: maxHands,
            minHandDetectionConfidence: 0.45,
            minHandPresenceConfidence: 0.45,
            minTrackingConfidence: 0.45
          });
          return {
            detect(video, timestamp) {
              const result = landmarker.detectForVideo(video, timestamp);
              return result.landmarks.map((landmarks, index) => ({
                landmarks,
                handedness: result.handednesses[index]?.[0]?.categoryName ?? "Unknown",
                confidence: result.handednesses[index]?.[0]?.score ?? 0
              }));
            },
            close() {
              landmarker.close();
            }
          };
        } catch (error) {
          lastError = error;
        }
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Hand tracker gagal dimuat.");
}
