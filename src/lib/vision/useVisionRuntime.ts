"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  FaceLandmarker,
  HandLandmarker,
  PoseLandmarker
} from "@mediapipe/tasks-vision";
import {
  calibrateBody,
  classifyBodyAction,
  type BodyCalibration,
  type BodySample
} from "@/lib/engine/body";
import type { PlayerId } from "@/lib/engine/types";
import type { VisionMode } from "@/lib/data/games";
import { bodySample } from "./body-analysis";
import { analyzeFace, FaceSlotTracker } from "./face-analysis";
import { analyzeGesture, GestureLatch } from "./gesture";
import {
  assignHandToPlayer,
  BodySlotTracker,
  isHandPlausible,
  PrimaryHandSelector,
  screenSideFor
} from "./player-assignment";
import { LandmarkSmoother, PointSmoother } from "./smoothing";
import { silenceMediapipeLogs } from "./console-noise";
import { attachCameraStream } from "./video-startup";
import {
  EMPTY_SNAPSHOT,
  EMPTY_SUMMARY,
  type Landmark,
  type TrackedBody,
  type TrackedFace,
  type TrackedHand,
  type VisionListener,
  type VisionRuntime,
  type VisionSnapshot,
  type VisionStatus,
  type VisionSummary
} from "./types";

interface VisionOptions {
  mode: VisionMode;
  playerCount: 1 | 2;
  /** Face mesh costs ~8 ms/frame. Games opt in rather than paying it always. */
  face?: boolean;
}

interface RuntimeHandles {
  hand?: HandLandmarker;
  pose?: PoseLandmarker;
  face?: FaceLandmarker;
}

const REMOTE_WASM =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
const REMOTE_HAND =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";
const REMOTE_POSE =
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";
const REMOTE_FACE =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";
const CALIBRATION_FRAMES = 24;
const MAX_HANDS_PER_PLAYER = 2;
/** Face mesh only needs to refresh a few times a second for its signals. */
const FACE_INTERVAL_MS = 90;
const HAND_FILTER_OPTIONS = {
  minCutoff: 1.4,
  beta: 0.12,
  derivativeCutoff: 1,
  maxGapMs: 350
};
const BODY_FILTER_OPTIONS = {
  minCutoff: 0.9,
  beta: 0.06,
  derivativeCutoff: 1,
  maxGapMs: 500
};

type HandSlotKey = `${PlayerId}:${number}`;

function confidenceOf(landmarks: readonly Landmark[]): number {
  const keys = [11, 12, 23, 24, 25, 26]
    .map((index) => landmarks[index]?.visibility)
    .filter((value): value is number => typeof value === "number");
  if (!keys.length) return 0.75;
  return keys.reduce((sum, value) => sum + value, 0) / keys.length;
}

/**
 * Per-hand-slot smoothing state.
 *
 * Filters are keyed by "player + slot index" instead of raw detection order so
 * that the second hand of a player gets its own filter chain. Sharing one
 * filter between two hands made the skeleton snap between them.
 */
class HandSlotState {
  readonly latch = new GestureLatch();
  readonly point = new PointSmoother(HAND_FILTER_OPTIONS);
  readonly landmarks = new LandmarkSmoother(HAND_FILTER_OPTIONS);
  pinching = false;

  reset(): void {
    this.latch.reset();
    this.point.reset();
    this.landmarks.reset();
    this.pinching = false;
  }
}

/** How often the cheap React-facing summary is allowed to update. */
const SUMMARY_INTERVAL_MS = 300;

function summariesDiffer(a: VisionSummary, b: VisionSummary): boolean {
  return (
    a.hands !== b.hands ||
    a.bodies !== b.bodies ||
    a.faces !== b.faces ||
    a.present !== b.present ||
    a.distance !== b.distance ||
    Math.abs(a.fps - b.fps) >= 3
  );
}

export function useVisionRuntime({
  mode,
  playerCount,
  face = false
}: VisionOptions): VisionRuntime {
  const [status, setStatus] = useState<VisionStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  /**
   * The frame stream lives in a ref, not in state. Consumers that need every
   * frame subscribe; consumers that only need counts read `summary`.
   */
  const snapshotRef = useRef<VisionSnapshot>(EMPTY_SNAPSHOT);
  const listenersRef = useRef(new Set<VisionListener>());
  const [summary, setSummary] = useState<VisionSummary>(EMPTY_SUMMARY);
  const summaryRef = useRef<VisionSummary>(EMPTY_SUMMARY);
  const lastSummaryAtRef = useRef(0);
  const lastSeenAtRef = useRef(0);

  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const runtimeRef = useRef<RuntimeHandles>({});
  const frameRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const startingRef = useRef(false);
  const lastVideoTimeRef = useRef(-1);
  const lastPublishRef = useRef(0);
  const lastFaceRunRef = useRef(0);
  const framesRef = useRef<number[]>([]);
  const lifecycleRef = useRef(0);
  const bodyTrackerRef = useRef(new BodySlotTracker());
  const faceTrackerRef = useRef(new FaceSlotTracker());
  const lastFacesRef = useRef<TrackedFace[]>([]);
  const handSlotsRef = useRef(new Map<HandSlotKey, HandSlotState>());
  const primaryHandRef = useRef<Record<PlayerId, PrimaryHandSelector>>({
    A: new PrimaryHandSelector(),
    B: new PrimaryHandSelector()
  });
  const calibrationsRef = useRef<Partial<Record<PlayerId, BodyCalibration>>>({});
  const calibrationSamplesRef = useRef<Record<PlayerId, BodySample[]>>({
    A: [],
    B: []
  });
  const bodyCenterSmoothersRef = useRef<Record<PlayerId, PointSmoother>>({
    A: new PointSmoother(BODY_FILTER_OPTIONS),
    B: new PointSmoother(BODY_FILTER_OPTIONS)
  });
  const bodyLandmarkSmoothersRef = useRef<Record<PlayerId, LandmarkSmoother>>({
    A: new LandmarkSmoother(BODY_FILTER_OPTIONS),
    B: new LandmarkSmoother(BODY_FILTER_OPTIONS)
  });

  const handSlot = useCallback((key: HandSlotKey): HandSlotState => {
    const existing = handSlotsRef.current.get(key);
    if (existing) return existing;
    const created = new HandSlotState();
    handSlotsRef.current.set(key, created);
    return created;
  }, []);

  const getSnapshot = useCallback(() => snapshotRef.current, []);

  const subscribe = useCallback((listener: VisionListener) => {
    listenersRef.current.add(listener);
    // Hand the newest frame over immediately so a late subscriber is not blank
    // until the next publish.
    if (snapshotRef.current.timestamp) listener(snapshotRef.current);
    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  const publishSummary = useCallback(
    (next: VisionSnapshot, now: number) => {
      const visible =
        next.hands.length > 0 || next.bodies.length > 0 || next.faces.length > 0;
      if (visible) lastSeenAtRef.current = now;

      if (now - lastSummaryAtRef.current < SUMMARY_INTERVAL_MS) return;
      lastSummaryAtRef.current = now;

      const candidate: VisionSummary = {
        hands: next.hands.length,
        bodies: next.bodies.length,
        faces: next.faces.length,
        fps: next.fps,
        distance: next.faces[0]?.distance ?? "unknown",
        // Two seconds of grace so one dropped frame never reads as "gone".
        present: visible || now - lastSeenAtRef.current < 2000
      };
      if (!summariesDiffer(summaryRef.current, candidate)) return;
      summaryRef.current = candidate;
      setSummary(candidate);
    },
    []
  );

  const bindVideo = useCallback((element: HTMLVideoElement | null) => {
    videoElementRef.current = element;
    if (element && streamRef.current) {
      element.srcObject = streamRef.current;
      void element.play().catch(() => undefined);
    }
  }, []);

  const resetTransient = useCallback(() => {
    lastVideoTimeRef.current = -1;
    lastPublishRef.current = 0;
    lastFaceRunRef.current = 0;
    lastSummaryAtRef.current = 0;
    lastSeenAtRef.current = 0;
    snapshotRef.current = EMPTY_SNAPSHOT;
    framesRef.current = [];
    calibrationsRef.current = {};
    calibrationSamplesRef.current = { A: [], B: [] };
    bodyTrackerRef.current.reset();
    faceTrackerRef.current.reset();
    lastFacesRef.current = [];

    for (const slot of handSlotsRef.current.values()) slot.reset();
    handSlotsRef.current.clear();

    for (const player of ["A", "B"] as const) {
      primaryHandRef.current[player].reset();
      bodyCenterSmoothersRef.current[player].reset();
      bodyLandmarkSmoothersRef.current[player].reset();
    }
  }, []);

  const dispose = useCallback(
    (updateState = true) => {
      lifecycleRef.current += 1;
      runningRef.current = false;
      startingRef.current = false;
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;

      for (const handle of [
        runtimeRef.current.hand,
        runtimeRef.current.pose,
        runtimeRef.current.face
      ]) {
        try {
          handle?.close();
        } catch {
          // MediaPipe may already be closed during a concurrent teardown.
        }
      }
      runtimeRef.current = {};

      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      const video = videoElementRef.current;
      if (video) {
        try {
          video.pause();
        } catch {
          // The element can already be detached during route navigation.
        }
        video.srcObject = null;
      }
      resetTransient();
      if (updateState) {
        setStatus("idle");
        setError(null);
        summaryRef.current = EMPTY_SUMMARY;
        setSummary(EMPTY_SUMMARY);
      }
    },
    [resetTransient]
  );

  const start = useCallback(async () => {
    if (runningRef.current || startingRef.current) return;

    // MediaPipe logs to stderr the moment it initializes, so the filter has to
    // be in place before the first model is created.
    silenceMediapipeLogs();

    startingRef.current = true;
    const lifecycle = lifecycleRef.current + 1;
    lifecycleRef.current = lifecycle;
    setError(null);
    setStatus("permission");

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Browser tidak mendukung kamera. Gunakan Chrome atau Edge melalui localhost atau HTTPS."
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 960 },
          height: { ideal: 540 },
          facingMode: "user",
          frameRate: { ideal: 30, max: 30 }
        },
        audio: false
      });

      if (lifecycleRef.current !== lifecycle) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      for (const track of stream.getVideoTracks()) {
        track.addEventListener(
          "ended",
          () => {
            if (lifecycleRef.current !== lifecycle || !runningRef.current) return;
            runningRef.current = false;
            setStatus("error");
            setError("Kamera berhenti atau terputus. Jalankan kalibrasi ulang.");
          },
          { once: true }
        );
      }

      const video = videoElementRef.current;
      if (!video) throw new Error("Elemen preview kamera belum siap.");

      setStatus("loading-model");
      await attachCameraStream(video, stream);

      const vision = await import("@mediapipe/tasks-vision");
      const configuredWasm =
        process.env.NEXT_PUBLIC_MEDIAPIPE_WASM_URL || "/mediapipe/wasm";
      const fileset = await vision.FilesetResolver.forVisionTasks(
        configuredWasm
      ).catch(() => vision.FilesetResolver.forVisionTasks(REMOTE_WASM));

      /**
       * Every model is tried on the GPU first, then the CPU, then the official
       * remote copy. Low-end Android devices routinely fail GPU delegate
       * creation, and a silent CPU fallback is far better than a dead camera.
       */
      const withFallback = async <T>(
        create: (path: string, delegate: "GPU" | "CPU") => Promise<T>,
        localPath: string,
        remotePath: string
      ): Promise<T> => {
        try {
          return await create(localPath, "GPU");
        } catch {
          try {
            return await create(localPath, "CPU");
          } catch {
            return await create(remotePath, "CPU");
          }
        }
      };

      /**
       * Which models are bundled locally, according to the manifest written by
       * `scripts/setup-mediapipe-assets.mjs`.
       *
       * Discovering a missing model by requesting it and getting a 404 put a
       * red line in the console on every start when `npm install` had not been
       * re-run since the asset list changed. One small manifest fetch answers
       * the same question without a failed request; if the manifest itself is
       * missing, everything falls back to the official remote copies.
       */
      const localModels = await fetch("/models/manifest.json")
        .then((response) => (response.ok ? response.json() : null))
        .then((data: { models?: string[] } | null) =>
          Array.isArray(data?.models) ? new Set(data.models) : null
        )
        .catch(() => null);

      const resolveModel = (localPath: string, remotePath: string): string => {
        if (!localModels) return remotePath;
        const file = localPath.split("/").pop() ?? "";
        return localModels.has(file) ? localPath : remotePath;
      };

      const handles: RuntimeHandles = {};

      if (mode === "hand" || mode === "hybrid") {
        handles.hand = await withFallback(
          (modelAssetPath, delegate) =>
            vision.HandLandmarker.createFromOptions(fileset, {
              baseOptions: { modelAssetPath, delegate },
              runningMode: "VIDEO",
              // Two hands per player, so both hands are drawn and either can
              // hold the pen.
              numHands: playerCount * MAX_HANDS_PER_PLAYER,
              minHandDetectionConfidence: 0.45,
              minHandPresenceConfidence: 0.45,
              minTrackingConfidence: 0.45
            }),
          resolveModel(
            process.env.NEXT_PUBLIC_HAND_LANDMARKER_MODEL_URL ||
              "/models/hand_landmarker.task",
            REMOTE_HAND
          ),
          REMOTE_HAND
        );
      }

      if (mode === "pose" || mode === "hybrid") {
        handles.pose = await withFallback(
          (modelAssetPath, delegate) =>
            vision.PoseLandmarker.createFromOptions(fileset, {
              baseOptions: { modelAssetPath, delegate },
              runningMode: "VIDEO",
              numPoses: playerCount,
              minPoseDetectionConfidence: 0.45,
              minPosePresenceConfidence: 0.45,
              minTrackingConfidence: 0.45
            }),
          resolveModel(
            process.env.NEXT_PUBLIC_POSE_LANDMARKER_MODEL_URL ||
              "/models/pose_landmarker_lite.task",
            REMOTE_POSE
          ),
          REMOTE_POSE
        );
      }

      if (face) {
        try {
          handles.face = await withFallback(
            (modelAssetPath, delegate) =>
              vision.FaceLandmarker.createFromOptions(fileset, {
                baseOptions: { modelAssetPath, delegate },
                runningMode: "VIDEO",
                numFaces: playerCount,
                minFaceDetectionConfidence: 0.4,
                minFacePresenceConfidence: 0.4,
                minTrackingConfidence: 0.4,
                outputFaceBlendshapes: false,
                outputFacialTransformationMatrixes: false
              }),
            resolveModel(
              process.env.NEXT_PUBLIC_FACE_LANDMARKER_MODEL_URL ||
                "/models/face_landmarker.task",
              REMOTE_FACE
            ),
            REMOTE_FACE
          );
        } catch {
          // Face mesh is an enhancement. If the model cannot load, the rest of
          // the game must still run.
          handles.face = undefined;
        }
      }

      if (lifecycleRef.current !== lifecycle) {
        handles.hand?.close();
        handles.pose?.close();
        handles.face?.close();
        return;
      }

      runtimeRef.current = handles;
      runningRef.current = true;
      startingRef.current = false;
      setStatus("running");

      const loop = () => {
        if (!runningRef.current || lifecycleRef.current !== lifecycle) return;
        const activeVideo = videoElementRef.current;
        if (
          !activeVideo ||
          activeVideo.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
          activeVideo.currentTime === lastVideoTimeRef.current
        ) {
          frameRef.current = requestAnimationFrame(loop);
          return;
        }

        lastVideoTimeRef.current = activeVideo.currentTime;
        const now = performance.now();

        try {
          const poseResult = runtimeRef.current.pose?.detectForVideo(
            activeVideo,
            now
          );
          const rawBodies = (poseResult?.landmarks ?? []) as Landmark[][];
          const bodyCandidates = bodyTrackerRef.current.update(
            rawBodies,
            playerCount
          );
          const bodies: TrackedBody[] = bodyCandidates.map((body) => {
            const player = body.player;
            const landmarks = bodyLandmarkSmoothersRef.current[player].update(
              body.landmarks,
              now
            );
            const center = bodyCenterSmoothersRef.current[player].update(
              { ...body.center, t: now },
              now
            );
            const sample = bodySample(landmarks);
            const samples = calibrationSamplesRef.current[player];
            if (!calibrationsRef.current[player]) {
              samples.push(sample);
              if (samples.length > CALIBRATION_FRAMES) samples.shift();
              if (samples.length >= CALIBRATION_FRAMES) {
                calibrationsRef.current[player] = calibrateBody(samples);
              }
            }
            const baseline =
              calibrationsRef.current[player] ?? calibrateBody(samples);
            return {
              id: body.id,
              player,
              landmarks,
              center,
              action: classifyBodyAction(sample, baseline),
              confidence: confidenceOf(landmarks),
              torsoScale: sample.torsoScale,
              hipY: sample.hipY
            };
          });

          let faces = lastFacesRef.current;
          if (
            runtimeRef.current.face &&
            now - lastFaceRunRef.current >= FACE_INTERVAL_MS
          ) {
            lastFaceRunRef.current = now;
            // Face mesh is an enhancement, so it gets its own guard: a failure
            // here disables the face signals but must never stop hand and pose
            // tracking, which is what the game actually runs on.
            try {
              const faceResult = runtimeRef.current.face.detectForVideo(
                activeVideo,
                now
              );
              const faceSets = (faceResult?.faceLandmarks ?? []) as Landmark[][];
              faces = faceTrackerRef.current
                .update(faceSets, playerCount)
                .map((item) =>
                  analyzeFace(item.landmarks, item.player, `face-${item.index}`)
                )
                .filter((item): item is TrackedFace => item !== null);
              lastFacesRef.current = faces;
            } catch {
              try {
                runtimeRef.current.face?.close();
              } catch {
                // already gone
              }
              runtimeRef.current.face = undefined;
              faces = [];
              lastFacesRef.current = faces;
            }
          }

          const handResult = runtimeRef.current.hand?.detectForVideo(
            activeVideo,
            now
          );
          const handSets = (handResult?.landmarks ?? []) as Landmark[][];

          /**
           * Pass 1: assign every detected hand to a player and keep up to two
           * per player. Nothing is discarded silently any more.
           */
          const grouped: Record<PlayerId, Array<{ index: number }>> = {
            A: [],
            B: []
          };
          for (let index = 0; index < handSets.length; index += 1) {
            const rawLandmarks = handSets[index];
            const tip = rawLandmarks?.[8];
            if (!rawLandmarks || !tip) continue;
            const candidate = {
              id: `hand-${index}`,
              landmarks: rawLandmarks,
              point: { x: 1 - tip.x, y: tip.y, t: now }
            };
            // A hand nowhere near either tracked player is somebody else's -
            // skip it before assignment ever has to force it onto A or B.
            if (!isHandPlausible(candidate, bodyCandidates)) continue;
            const player = assignHandToPlayer(candidate, bodyCandidates, playerCount);
            if (grouped[player].length >= MAX_HANDS_PER_PLAYER) continue;
            grouped[player].push({ index });
          }

          /** Pass 2: smooth, classify and pick the pen hand per player. */
          const hands: TrackedHand[] = [];
          for (const player of ["A", "B"] as const) {
            const entries = grouped[player];
            if (!entries.length) {
              primaryHandRef.current[player].select([], now);
              continue;
            }

            const built = entries.map((entry, slotIndex) => {
              const key: HandSlotKey = `${player}:${slotIndex}`;
              const slot = handSlot(key);
              const rawLandmarks = handSets[entry.index]!;
              const tip = rawLandmarks[8]!;
              const analyzed = analyzeGesture(rawLandmarks, slot.pinching);
              const gesture = slot.latch.update(analyzed.gesture);
              slot.pinching = gesture === "pinch";
              const point = slot.point.update(
                { x: 1 - tip.x, y: tip.y, t: now },
                now
              );
              const landmarks = slot.landmarks.update(rawLandmarks, now);
              const handedness =
                handResult?.handedness[entry.index]?.[0]?.categoryName ??
                "Unknown";
              return {
                id: key,
                player,
                side: screenSideFor(handedness),
                primary: false,
                landmarks,
                point,
                gesture,
                confidence:
                  handResult?.handedness[entry.index]?.[0]?.score ?? 0,
                gestureConfidence: analyzed.confidence,
                pinchRatio: analyzed.pinchRatio,
                handedness
              } satisfies TrackedHand;
            });

            const primaryId = primaryHandRef.current[player].select(
              built.map((hand) => ({
                id: hand.id,
                pinching: hand.gesture === "pinch",
                score: hand.gestureConfidence
              })),
              now
            );

            for (const hand of built) {
              hands.push({ ...hand, primary: hand.id === primaryId });
            }
          }

          framesRef.current.push(now);
          while (
            framesRef.current.length &&
            now - framesRef.current[0]! > 1000
          ) {
            framesRef.current.shift();
          }

          if (now - lastPublishRef.current >= 33) {
            lastPublishRef.current = now;
            const next: VisionSnapshot = {
              hands,
              bodies,
              faces,
              fps: framesRef.current.length,
              timestamp: now,
              sourceWidth: activeVideo.videoWidth || 960,
              sourceHeight: activeVideo.videoHeight || 540
            };
            snapshotRef.current = next;
            for (const listener of listenersRef.current) {
              try {
                listener(next);
              } catch {
                // One misbehaving consumer must not stop the camera loop.
              }
            }
            publishSummary(next, now);
          }
        } catch (cause) {
          runningRef.current = false;
          setError(
            cause instanceof Error ? cause.message : "Vision runtime berhenti."
          );
          setStatus("error");
          return;
        }

        frameRef.current = requestAnimationFrame(loop);
      };

      frameRef.current = requestAnimationFrame(loop);
    } catch (cause) {
      if (lifecycleRef.current === lifecycle) {
        dispose(false);
        setError(
          cause instanceof Error
            ? cause.message
            : "Kamera atau model gagal dimuat."
        );
        setStatus("error");
      }
    } finally {
      if (lifecycleRef.current === lifecycle) startingRef.current = false;
    }
  }, [dispose, face, handSlot, mode, playerCount, publishSummary]);

  useEffect(() => () => dispose(false), [dispose]);

  return {
    bindVideo,
    start,
    stop: dispose,
    status,
    error,
    getSnapshot,
    subscribe,
    summary
  };
}
