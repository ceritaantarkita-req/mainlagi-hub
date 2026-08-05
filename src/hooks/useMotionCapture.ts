"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Point, PlayerId, RecognitionResult } from "@/engine/types";
import { recognizeDigit } from "@/engine/recognition";
import { distance } from "@/engine/geometry";
import {
  assignPlayer,
  isIndexWritingPose,
  isOpenPalm,
  mirroredPoint,
  smoothPoint,
  toPlayerLocalPoint
} from "@/vision/hand-utils";
import { createHandTracker, type DetectedHand, type HandTracker } from "@/vision/mediapipe";
import { ReadinessGate, type ReadinessSnapshot } from "@/lib/vision-core/readiness";

interface PlayerCapture {
  points: Point[];
  visible: boolean;
  writing: boolean;
  message: string;
}

interface MotionCaptureOptions {
  cameraEnabled: boolean;
  captureEnabled: boolean;
  singlePlayer: boolean;
  onDigit: (player: PlayerId, result: RecognitionResult<number>) => void;
  onTrace: (player: PlayerId, points: Point[]) => void;
  onClear: (player: PlayerId) => void;
  /**
   * Raw pointer position each frame, in full-stage normalised coordinates.
   *
   * Games that select rather than write (the AR quiz) need where the hand *is*,
   * not the stroke it has drawn. Reported before the player-local remap, so the
   * coordinates line up with buttons positioned against the whole stage.
   */
  onPointer?: (player: PlayerId, point: Point | null) => void;
}

type CaptureStatus = "idle" | "loading" | "ready" | "error";

function emptyCapture(): Record<PlayerId, PlayerCapture> {
  return {
    A: { points: [], visible: false, writing: false, message: "Tangan belum terlihat" },
    B: { points: [], visible: false, writing: false, message: "Tangan belum terlihat" }
  };
}

export function useMotionCapture({
  cameraEnabled,
  captureEnabled,
  singlePlayer,
  onDigit,
  onTrace,
  onClear,
  onPointer
}: MotionCaptureOptions) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // Held in a ref so a caller passing an inline arrow does not restart the
  // camera on every render.
  const onPointerRef = useRef(onPointer);
  useEffect(() => { onPointerRef.current = onPointer; }, [onPointer]);
  const trackerRef = useRef<HandTracker | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const startingRef = useRef(false);
  const lifecycleRef = useRef(0);
  const statusRef = useRef<CaptureStatus>("idle");
  const cameraEnabledRef = useRef(cameraEnabled);
  const captureEnabledRef = useRef(captureEnabled);
  const callbacksRef = useRef({ onDigit, onTrace, onClear });
  const playerRef = useRef<Record<PlayerId, PlayerCapture>>(emptyCapture());
  const lastPointRef = useRef<Record<PlayerId, Point | null>>({ A: null, B: null });
  const lastMoveRef = useRef<Record<PlayerId, number>>({ A: 0, B: 0 });
  const palmStartRef = useRef<Record<PlayerId, number | null>>({ A: null, B: null });
  const pointerTimerRef = useRef<Record<PlayerId, number | null>>({ A: null, B: null });
  const lastVideoTimeRef = useRef(-1);
  const lastPublishRef = useRef(0);
  const [status, setStatus] = useState<CaptureStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [players, setPlayers] = useState<Record<PlayerId, PlayerCapture>>(emptyCapture);
  // Pre-flight gate: play must not begin before the camera, the model and the
  // required hands are all confirmed. Starting early was the main reason the
  // games felt like they "did not work".
  const gateRef = useRef(new ReadinessGate(1100));
  const [readiness, setReadiness] = useState<ReadinessSnapshot>({
    stage: "camera", progress: 0, message: "Menunggu kamera aktif...", handsSeen: 0, canStart: false
  });

  useEffect(() => {
    cameraEnabledRef.current = cameraEnabled;
    captureEnabledRef.current = captureEnabled;
    callbacksRef.current = { onDigit, onTrace, onClear };
  }, [cameraEnabled, captureEnabled, onClear, onDigit, onTrace]);

  const updateStatus = useCallback((nextStatus: CaptureStatus) => {
    statusRef.current = nextStatus;
    setStatus(nextStatus);
  }, []);

  const publish = useCallback((force = false) => {
    const now = performance.now();
    if (!force && now - lastPublishRef.current < 32) return;
    lastPublishRef.current = now;
    setPlayers({
      A: { ...playerRef.current.A, points: [...playerRef.current.A.points] },
      B: { ...playerRef.current.B, points: [...playerRef.current.B.points] }
    });
  }, []);

  const resetTransientPlayer = useCallback((player: PlayerId, message?: string) => {
    const capture = playerRef.current[player];
    capture.points = [];
    capture.writing = false;
    if (message) capture.message = message;
    lastPointRef.current[player] = null;
    lastMoveRef.current[player] = 0;
    palmStartRef.current[player] = null;
  }, []);

  const finishPath = useCallback((player: PlayerId) => {
    const capture = playerRef.current[player];
    if (!captureEnabledRef.current) {
      resetTransientPlayer(player, "Game belum dimulai");
      publish(true);
      return;
    }
    if (capture.points.length < 8) {
      resetTransientPlayer(player, "Tulis lebih besar");
      publish(true);
      return;
    }

    const completed = [...capture.points];
    const result = recognizeDigit(completed);
    resetTransientPlayer(
      player,
      result.accepted && result.value !== null
        ? `Terbaca ${result.value}`
        : result.reason ?? "Coba lagi"
    );
    callbacksRef.current.onTrace(player, completed);
    callbacksRef.current.onDigit(player, result);
    publish(true);
  }, [publish, resetTransientPlayer]);

  const clearPlayer = useCallback((player: PlayerId) => {
    if (pointerTimerRef.current[player] !== null) {
      window.clearTimeout(pointerTimerRef.current[player] ?? undefined);
      pointerTimerRef.current[player] = null;
    }
    resetTransientPlayer(player, "Digit dihapus");
    callbacksRef.current.onClear(player);
    publish(true);
  }, [publish, resetTransientPlayer]);

  const disposeResources = useCallback((updateReactState: boolean) => {
    lifecycleRef.current += 1;
    runningRef.current = false;
    startingRef.current = false;
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
    for (const player of ["A", "B"] as const) {
      if (pointerTimerRef.current[player] !== null) {
        window.clearTimeout(pointerTimerRef.current[player] ?? undefined);
        pointerTimerRef.current[player] = null;
      }
      resetTransientPlayer(player);
      playerRef.current[player].visible = false;
      playerRef.current[player].message = "Tangan belum terlihat";
    }
    try {
      trackerRef.current?.close();
    } catch {
      // MediaPipe may already be closed during a concurrent teardown.
    }
    trackerRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    lastVideoTimeRef.current = -1;
    gateRef.current.reset();
    const video = videoRef.current;
    if (video) {
      try {
        video.pause();
      } catch {
        // The element may already be detached during unmount.
      }
      video.srcObject = null;
    }
    if (updateReactState) {
      setError(null);
      updateStatus("idle");
      publish(true);
    }
  }, [publish, resetTransientPlayer, updateStatus]);

  const stop = useCallback(() => {
    disposeResources(true);
  }, [disposeResources]);

  const failRuntime = useCallback((cause: unknown) => {
    const message = cause instanceof Error ? cause.message : "Kamera berhenti karena terjadi kesalahan.";
    disposeResources(false);
    setError(message);
    updateStatus("error");
  }, [disposeResources, updateStatus]);

  const start = useCallback(async () => {
    if (
      !cameraEnabledRef.current ||
      startingRef.current ||
      statusRef.current === "loading" ||
      statusRef.current === "ready"
    ) return;

    startingRef.current = true;
    const lifecycle = lifecycleRef.current + 1;
    lifecycleRef.current = lifecycle;
    updateStatus("loading");
    setError(null);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Browser ini tidak mendukung akses kamera. Gunakan Chrome atau Edge terbaru melalui HTTPS atau localhost.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        audio: false
      });
      if (!cameraEnabledRef.current || lifecycleRef.current !== lifecycle) {
        stream.getTracks().forEach((track) => track.stop());
        if (lifecycleRef.current === lifecycle) updateStatus("idle");
        return;
      }

      streamRef.current = stream;
      for (const track of stream.getVideoTracks()) {
        track.addEventListener("ended", () => {
          if (lifecycleRef.current === lifecycle && runningRef.current) {
            failRuntime(new Error("Kamera berhenti atau terputus. Aktifkan kamera kembali."));
          }
        }, { once: true });
      }
      const video = videoRef.current;
      if (!video) throw new Error("Video element belum siap. Coba aktifkan kamera lagi.");
      video.srcObject = stream;
      await video.play();
      if (lifecycleRef.current !== lifecycle || !cameraEnabledRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        video.srcObject = null;
        return;
      }

      const tracker = await createHandTracker(singlePlayer ? 2 : 4);
      if (lifecycleRef.current !== lifecycle || !cameraEnabledRef.current) {
        try {
          tracker.close();
        } catch {
          // Ignore close races during an aborted startup.
        }
        stream.getTracks().forEach((track) => track.stop());
        video.srcObject = null;
        return;
      }
      trackerRef.current = tracker;
      runningRef.current = true;
      updateStatus("ready");

      const loop = () => {
        if (!runningRef.current) return;
        const activeVideo = videoRef.current;
        const tracker = trackerRef.current;
        if (!activeVideo || !tracker || activeVideo.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
          animationRef.current = requestAnimationFrame(loop);
          return;
        }
        if (activeVideo.currentTime === lastVideoTimeRef.current) {
          animationRef.current = requestAnimationFrame(loop);
          return;
        }
        lastVideoTimeRef.current = activeVideo.currentTime;

        const now = performance.now();
        let detected: DetectedHand[];
        try {
          detected = tracker.detect(activeVideo, now);
        } catch (cause) {
          failRuntime(cause);
          return;
        }

        const seen: Record<PlayerId, boolean> = { A: false, B: false };
        let pointingHands = 0;
        for (const hand of [...detected].sort((left, right) => right.confidence - left.confidence)) {
          const rawTip = hand.landmarks[8];
          if (!rawTip) continue;
          const mirroredTip = mirroredPoint(rawTip);
          const player = assignPlayer(mirroredTip, singlePlayer);
          if (!player || seen[player]) continue;

          seen[player] = true;
          const capture = playerRef.current[player];
          capture.visible = true;
          // Full-stage position, before the player-local remap, for AR buttons.
          onPointerRef.current?.(player, mirroredTip);
          const localTip = toPlayerLocalPoint(mirroredTip, player, singlePlayer);
          const writingPose = isIndexWritingPose(hand.landmarks);
          const palm = isOpenPalm(hand.landmarks);
          if (writingPose) pointingHands += 1;

          if (palm && captureEnabledRef.current) {
            palmStartRef.current[player] ??= now;
            if (now - (palmStartRef.current[player] ?? now) > 850) {
              clearPlayer(player);
              palmStartRef.current[player] = now + 1_000;
            }
          } else {
            palmStartRef.current[player] = null;
          }

          if (!captureEnabledRef.current) {
            if (capture.writing || capture.points.length > 0) resetTransientPlayer(player, "Game belum dimulai");
            continue;
          }

          if (writingPose) {
            const previous = capture.writing ? lastPointRef.current[player] : null;
            const point = smoothPoint(previous, localTip);
            if (!capture.writing) {
              capture.points = [];
              capture.writing = true;
            }
            capture.message = "Sedang menulis…";
            if (!previous || distance(previous, point) > 0.0035) {
              capture.points.push(point);
              if (capture.points.length > 240) capture.points.shift();
              lastPointRef.current[player] = point;
              lastMoveRef.current[player] = now;
            }
          }

          if (capture.writing && capture.points.length >= 8 && now - lastMoveRef.current[player] > 650) {
            finishPath(player);
          }
        }

        const requiredHands = singlePlayer ? 1 : 2;
        setReadiness(
          gateRef.current.update(
            {
              cameraActive: true,
              modelReady: true,
              handsSeen: (seen.A ? 1 : 0) + (seen.B ? 1 : 0),
              pointingHands,
              requiredHands
            },
            now
          )
        );

        for (const player of ["A", "B"] as const) {
          const capture = playerRef.current[player];
          capture.visible = seen[player];
          // Tell pointer consumers the hand is gone, so a dwell in progress is
          // cancelled rather than left frozen at whatever it last reached.
          if (!seen[player]) onPointerRef.current?.(player, null);
          if (!seen[player] && capture.writing && now - lastMoveRef.current[player] > 450) {
            finishPath(player);
          }
          if (!seen[player] && !capture.writing) capture.message = "Tangan belum terlihat";
        }
        publish();
        if (runningRef.current) animationRef.current = requestAnimationFrame(loop);
      };

      animationRef.current = requestAnimationFrame(loop);
    } catch (cause) {
      if (lifecycleRef.current === lifecycle) failRuntime(cause);
    } finally {
      if (lifecycleRef.current === lifecycle) startingRef.current = false;
    }
  }, [clearPlayer, failRuntime, finishPath, publish, resetTransientPlayer, singlePlayer, updateStatus]);

  useEffect(() => () => {
    disposeResources(false);
  }, [disposeResources]);

  const submitPointerPath = useCallback((player: PlayerId, points: Point[]) => {
    if (!captureEnabledRef.current || points.length < 4) return;
    if (pointerTimerRef.current[player] !== null) {
      window.clearTimeout(pointerTimerRef.current[player] ?? undefined);
    }
    playerRef.current[player].points = [...points];
    playerRef.current[player].writing = true;
    playerRef.current[player].message = "Membaca tulisan…";
    publish(true);
    pointerTimerRef.current[player] = window.setTimeout(() => {
      pointerTimerRef.current[player] = null;
      finishPath(player);
    }, 100);
  }, [finishPath, publish]);

  return {
    videoRef,
    players,
    status,
    error,
    readiness,
    start,
    stop,
    clearPlayer,
    submitPointerPath
  };
}
