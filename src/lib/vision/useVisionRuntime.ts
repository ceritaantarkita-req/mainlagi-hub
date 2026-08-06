"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { HandLandmarker, PoseLandmarker } from "@mediapipe/tasks-vision";
import {
  calibrateBody,
  classifyBodyAction,
  type BodyCalibration,
  type BodySample
} from "@/lib/engine/body";
import type { PlayerId } from "@/lib/engine/types";
import type { VisionMode } from "@/lib/data/games";
import { bodySample } from "./body-analysis";
import { analyzeGesture, GestureLatch } from "./gesture";
import { assignHandToPlayer, BodySlotTracker } from "./player-assignment";
import { LandmarkSmoother, PointSmoother } from "./smoothing";
import { attachCameraStream } from "./video-startup";
import type {
  Landmark,
  TrackedBody,
  TrackedHand,
  VisionSnapshot,
  VisionStatus
} from "./types";

interface VisionOptions {
  mode: VisionMode;
  playerCount: 1 | 2;
}

interface RuntimeHandles {
  hand?: HandLandmarker;
  pose?: PoseLandmarker;
}

const EMPTY: VisionSnapshot = { hands: [], bodies: [], fps: 0, timestamp: 0 };
const REMOTE_WASM =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
const REMOTE_HAND =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";
const REMOTE_POSE =
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";
const CALIBRATION_FRAMES = 24;
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

function confidenceOf(landmarks: readonly Landmark[]): number {
  const keys = [11, 12, 23, 24, 25, 26]
    .map((index) => landmarks[index]?.visibility)
    .filter((value): value is number => typeof value === "number");
  if (!keys.length) return 0.75;
  return keys.reduce((sum, value) => sum + value, 0) / keys.length;
}

export function useVisionRuntime({ mode, playerCount }: VisionOptions) {
  const [status, setStatus] = useState<VisionStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<VisionSnapshot>(EMPTY);

  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const runtimeRef = useRef<RuntimeHandles>({});
  const frameRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const startingRef = useRef(false);
  const lastVideoTimeRef = useRef(-1);
  const lastPublishRef = useRef(0);
  const framesRef = useRef<number[]>([]);
  const lifecycleRef = useRef(0);
  const bodyTrackerRef = useRef(new BodySlotTracker());
  const calibrationsRef = useRef<
    Partial<Record<PlayerId, BodyCalibration>>
  >({});
  const calibrationSamplesRef = useRef<Record<PlayerId, BodySample[]>>({
    A: [],
    B: []
  });
  const latchesRef = useRef<Record<PlayerId, GestureLatch>>({
    A: new GestureLatch(),
    B: new GestureLatch()
  });
  const handPointSmoothersRef = useRef<Record<PlayerId, PointSmoother>>({
    A: new PointSmoother(HAND_FILTER_OPTIONS),
    B: new PointSmoother(HAND_FILTER_OPTIONS)
  });
  const handLandmarkSmoothersRef = useRef<
    Record<PlayerId, LandmarkSmoother>
  >({
    A: new LandmarkSmoother(HAND_FILTER_OPTIONS),
    B: new LandmarkSmoother(HAND_FILTER_OPTIONS)
  });
  const bodyCenterSmoothersRef = useRef<Record<PlayerId, PointSmoother>>({
    A: new PointSmoother(BODY_FILTER_OPTIONS),
    B: new PointSmoother(BODY_FILTER_OPTIONS)
  });
  const bodyLandmarkSmoothersRef = useRef<
    Record<PlayerId, LandmarkSmoother>
  >({
    A: new LandmarkSmoother(BODY_FILTER_OPTIONS),
    B: new LandmarkSmoother(BODY_FILTER_OPTIONS)
  });

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
    framesRef.current = [];
    calibrationsRef.current = {};
    calibrationSamplesRef.current = { A: [], B: [] };
    bodyTrackerRef.current.reset();

    for (const player of ["A", "B"] as const) {
      latchesRef.current[player].reset();
      handPointSmoothersRef.current[player].reset();
      handLandmarkSmoothersRef.current[player].reset();
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

      try {
        runtimeRef.current.hand?.close();
      } catch {
        // MediaPipe may already be closed during a concurrent teardown.
      }
      try {
        runtimeRef.current.pose?.close();
      } catch {
        // MediaPipe may already be closed during a concurrent teardown.
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
        setSnapshot(EMPTY);
      }
    },
    [resetTransient]
  );

  const start = useCallback(async () => {
    if (runningRef.current || startingRef.current) return;

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

      const handles: RuntimeHandles = {};
      if (mode === "hand" || mode === "hybrid") {
        const configuredModel =
          process.env.NEXT_PUBLIC_HAND_LANDMARKER_MODEL_URL ||
          "/models/hand_landmarker.task";
        const createHand = (modelAssetPath: string, delegate: "GPU" | "CPU") =>
          vision.HandLandmarker.createFromOptions(fileset, {
            baseOptions: { modelAssetPath, delegate },
            runningMode: "VIDEO",
            numHands: playerCount === 2 ? 4 : 2,
            minHandDetectionConfidence: 0.45,
            minHandPresenceConfidence: 0.45,
            minTrackingConfidence: 0.45
          });

        try {
          handles.hand = await createHand(configuredModel, "GPU");
        } catch {
          try {
            handles.hand = await createHand(configuredModel, "CPU");
          } catch {
            handles.hand = await createHand(REMOTE_HAND, "CPU");
          }
        }
      }

      if (mode === "pose" || mode === "hybrid") {
        const configuredModel =
          process.env.NEXT_PUBLIC_POSE_LANDMARKER_MODEL_URL ||
          "/models/pose_landmarker_lite.task";
        const createPose = (modelAssetPath: string, delegate: "GPU" | "CPU") =>
          vision.PoseLandmarker.createFromOptions(fileset, {
            baseOptions: { modelAssetPath, delegate },
            runningMode: "VIDEO",
            numPoses: playerCount,
            minPoseDetectionConfidence: 0.45,
            minPosePresenceConfidence: 0.45,
            minTrackingConfidence: 0.45
          });

        try {
          handles.pose = await createPose(configuredModel, "GPU");
        } catch {
          try {
            handles.pose = await createPose(configuredModel, "CPU");
          } catch {
            handles.pose = await createPose(REMOTE_POSE, "CPU");
          }
        }
      }

      if (lifecycleRef.current !== lifecycle) {
        handles.hand?.close();
        handles.pose?.close();
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

          const handResult = runtimeRef.current.hand?.detectForVideo(
            activeVideo,
            now
          );
          const handSets = (handResult?.landmarks ?? []) as Landmark[][];
          const hands: TrackedHand[] = [];

          for (let index = 0; index < handSets.length; index += 1) {
            const rawLandmarks = handSets[index]!;
            const tip = rawLandmarks[8];
            if (!tip) continue;
            const rawPoint = { x: 1 - tip.x, y: tip.y, t: now };
            const player = assignHandToPlayer(
              { id: `hand-${index}`, landmarks: rawLandmarks, point: rawPoint },
              bodyCandidates,
              playerCount
            );
            if (!player || hands.some((hand) => hand.player === player)) {
              continue;
            }

            const analyzed = analyzeGesture(rawLandmarks);
            const gesture = latchesRef.current[player].update(analyzed.gesture);
            const point = handPointSmoothersRef.current[player].update(
              rawPoint,
              now
            );
            const landmarks = handLandmarkSmoothersRef.current[player].update(
              rawLandmarks,
              now
            );
            const handedness =
              handResult?.handedness[index]?.[0]?.categoryName ?? "Unknown";
            const confidence =
              handResult?.handedness[index]?.[0]?.score ?? analyzed.confidence;
            hands.push({
              id: `hand-${index}`,
              player,
              landmarks,
              point,
              gesture,
              confidence,
              handedness
            });
          }

          framesRef.current.push(now);
          while (
            framesRef.current.length &&
            now - framesRef.current[0]! > 1000
          ) {
            framesRef.current.shift();
          }

          if (now - lastPublishRef.current >= 50) {
            lastPublishRef.current = now;
            setSnapshot({
              hands,
              bodies,
              fps: framesRef.current.length,
              timestamp: now
            });
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
  }, [dispose, mode, playerCount]);

  useEffect(() => () => dispose(false), [dispose]);

  return {
    bindVideo,
    start,
    stop: dispose,
    status,
    error,
    snapshot
  };
}
