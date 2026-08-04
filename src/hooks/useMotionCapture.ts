"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Point, PlayerId, RecognitionResult } from "@/engine/types";
import { recognizeDigit } from "@/engine/recognition";
import { distance } from "@/engine/geometry";
import { assignPlayer, isIndexWritingPose, isOpenPalm, mirroredPoint, smoothPoint } from "@/vision/hand-utils";
import { createHandTracker, type HandTracker } from "@/vision/mediapipe";

interface PlayerCapture {
  points: Point[];
  visible: boolean;
  writing: boolean;
  message: string;
}

interface MotionCaptureOptions {
  enabled: boolean;
  singlePlayer: boolean;
  onDigit: (player: PlayerId, result: RecognitionResult<number>) => void;
  onTrace: (player: PlayerId, points: Point[]) => void;
  onClear: (player: PlayerId) => void;
}

const EMPTY_CAPTURE: Record<PlayerId, PlayerCapture> = {
  A: { points: [], visible: false, writing: false, message: "Tangan belum terlihat" },
  B: { points: [], visible: false, writing: false, message: "Tangan belum terlihat" }
};

export function useMotionCapture({ enabled, singlePlayer, onDigit, onTrace, onClear }: MotionCaptureOptions) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const trackerRef = useRef<HandTracker | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  const playerRef = useRef<Record<PlayerId, PlayerCapture>>(structuredClone(EMPTY_CAPTURE));
  const lastPointRef = useRef<Record<PlayerId, Point | null>>({ A: null, B: null });
  const lastMoveRef = useRef<Record<PlayerId, number>>({ A: 0, B: 0 });
  const palmStartRef = useRef<Record<PlayerId, number | null>>({ A: null, B: null });
  const lastVideoTimeRef = useRef(-1);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [players, setPlayers] = useState<Record<PlayerId, PlayerCapture>>(structuredClone(EMPTY_CAPTURE));

  const publish = useCallback(() => {
    setPlayers({
      A: { ...playerRef.current.A, points: [...playerRef.current.A.points] },
      B: { ...playerRef.current.B, points: [...playerRef.current.B.points] }
    });
  }, []);

  const finishPath = useCallback((player: PlayerId) => {
    const capture = playerRef.current[player];
    if (capture.points.length < 8) {
      capture.points = [];
      capture.writing = false;
      capture.message = "Tulis lebih besar";
      publish();
      return;
    }
    const completed = [...capture.points];
    const result = recognizeDigit(completed);
    capture.points = [];
    capture.writing = false;
    capture.message = result.accepted && result.value !== null
      ? `Terbaca ${result.value}`
      : result.reason ?? "Coba lagi";
    onTrace(player, completed);
    onDigit(player, result);
    publish();
  }, [onDigit, onTrace, publish]);

  const clearPlayer = useCallback((player: PlayerId) => {
    playerRef.current[player].points = [];
    playerRef.current[player].writing = false;
    playerRef.current[player].message = "Digit dihapus";
    onClear(player);
    publish();
  }, [onClear, publish]);

  const stop = useCallback(() => {
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
    trackerRef.current?.close();
    trackerRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setStatus("idle");
  }, []);

  const start = useCallback(async () => {
    if (!enabled || status === "loading" || status === "ready") return;
    setStatus("loading");
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        audio: false
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) throw new Error("Video element belum siap.");
      video.srcObject = stream;
      await video.play();
      trackerRef.current = await createHandTracker(singlePlayer ? 2 : 4);
      setStatus("ready");

      const loop = () => {
        const activeVideo = videoRef.current;
        const tracker = trackerRef.current;
        if (!activeVideo || !tracker || activeVideo.readyState < 2) {
          animationRef.current = requestAnimationFrame(loop);
          return;
        }
        if (activeVideo.currentTime === lastVideoTimeRef.current) {
          animationRef.current = requestAnimationFrame(loop);
          return;
        }
        lastVideoTimeRef.current = activeVideo.currentTime;
        const now = performance.now();
        const detected = tracker.detect(activeVideo, now);
        const seen: Record<PlayerId, boolean> = { A: false, B: false };

        for (const hand of [...detected].sort((left, right) => right.confidence - left.confidence)) {
          const rawTip = hand.landmarks[8];
          if (!rawTip) continue;
          const tip = mirroredPoint(rawTip);
          const player = assignPlayer(tip, singlePlayer);
          if (!player || seen[player]) continue;
          seen[player] = true;
          const capture = playerRef.current[player];
          capture.visible = true;
          const point = smoothPoint(lastPointRef.current[player], tip);
          const previous = lastPointRef.current[player];
          lastPointRef.current[player] = point;
          const writingPose = isIndexWritingPose(hand.landmarks);
          const palm = isOpenPalm(hand.landmarks);

          if (palm) {
            palmStartRef.current[player] ??= now;
            if (now - (palmStartRef.current[player] ?? now) > 850) {
              clearPlayer(player);
              palmStartRef.current[player] = now + 1_000;
            }
          } else {
            palmStartRef.current[player] = null;
          }

          if (writingPose && enabled) {
            capture.writing = true;
            capture.message = "Sedang menulis…";
            if (!previous || distance(previous, point) > 0.0035) {
              capture.points.push(point);
              if (capture.points.length > 240) capture.points.shift();
              lastMoveRef.current[player] = now;
            }
          }

          if (capture.writing && capture.points.length >= 8 && now - lastMoveRef.current[player] > 650) {
            finishPath(player);
          }
        }

        for (const player of ["A", "B"] as PlayerId[]) {
          const capture = playerRef.current[player];
          capture.visible = seen[player];
          if (!seen[player] && capture.writing && now - lastMoveRef.current[player] > 450) finishPath(player);
          if (!seen[player] && !capture.writing) capture.message = "Tangan belum terlihat";
        }
        publish();
        animationRef.current = requestAnimationFrame(loop);
      };
      animationRef.current = requestAnimationFrame(loop);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Kamera gagal dimulai.";
      setError(message);
      setStatus("error");
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, [clearPlayer, enabled, finishPath, publish, singlePlayer, status]);

  useEffect(() => stop, [stop]);

  const submitPointerPath = useCallback((player: PlayerId, points: Point[]) => {
    if (points.length < 4) return;
    playerRef.current[player].points = points;
    playerRef.current[player].message = "Membaca tulisan…";
    publish();
    window.setTimeout(() => finishPath(player), 100);
  }, [finishPath, publish]);

  return { videoRef, players, status, error, start, stop, clearPlayer, submitPointerPath };
}
