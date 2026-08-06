"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PlayerId } from "@/lib/engine/types";
import type { VisionSnapshot } from "@/lib/vision/types";
import { VisionOverlay } from "@/components/VisionOverlay";

export function useRoundTimer(duration = 60) {
  const [remaining, setRemaining] = useState(duration);
  const [running, setRunning] = useState(true);
  const deadlineRef = useRef(performance.now() + duration * 1000);

  useEffect(() => {
    if (!running) return;

    let frame = 0;
    const loop = () => {
      const next = Math.max(
        0,
        Math.ceil((deadlineRef.current - performance.now()) / 1000)
      );
      setRemaining(next);
      if (next <= 0) {
        setRunning(false);
        return;
      }
      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  const pause = useCallback(() => setRunning(false), []);
  const resume = useCallback(() => {
    if (remaining <= 0) return;
    deadlineRef.current = performance.now() + remaining * 1000;
    setRunning(true);
  }, [remaining]);
  const toggle = useCallback(() => {
    if (running) pause();
    else resume();
  }, [pause, resume, running]);
  const addSeconds = useCallback((seconds: number) => {
    if (seconds <= 0) return;
    deadlineRef.current += seconds * 1000;
    setRemaining((value) => value + seconds);
  }, []);

  return {
    remaining,
    running,
    paused: !running && remaining > 0,
    ended: remaining <= 0,
    pause,
    resume,
    toggle,
    addSeconds
  };
}

export function CameraBackdrop({
  inputMode,
  bindVideo,
  snapshot,
  children,
  showSkeleton = true
}: {
  inputMode: "camera" | "demo";
  bindVideo(element: HTMLVideoElement | null): void;
  snapshot: VisionSnapshot;
  children: React.ReactNode;
  showSkeleton?: boolean;
}) {
  return (
    <section className={`camera-stage ${inputMode === "demo" ? "is-demo" : ""}`}>
      {inputMode === "camera" ? (
        <>
          <video ref={bindVideo} muted playsInline autoPlay />
          <VisionOverlay snapshot={snapshot} showSkeleton={showSkeleton} />
        </>
      ) : (
        <div className="demo-stage-grid" />
      )}
      {children}
    </section>
  );
}

export function GameHud({
  title,
  remaining,
  score,
  playerCount,
  paused = false,
  onTogglePause
}: {
  title: string;
  remaining: number;
  score: Record<PlayerId, number>;
  playerCount: 1 | 2;
  paused?: boolean;
  onTogglePause?: () => void;
}) {
  return (
    <div className="game-hud">
      <div className="hud-score">
        <small>PLAYER A</small>
        <strong>{score.A}</strong>
      </div>
      <div className="hud-center">
        <span>{title}</span>
        <b className={remaining <= 10 ? "is-warning" : ""}>{remaining}</b>
        {playerCount === 2 && onTogglePause ? (
          <button className="hud-toggle" type="button" onClick={onTogglePause}>
            {paused ? "Lanjut" : "Jeda"}
          </button>
        ) : null}
      </div>
      {playerCount === 2 ? (
        <div className="hud-score is-b">
          <small>PLAYER B</small>
          <strong>{score.B}</strong>
        </div>
      ) : (
        <button className="hud-pause" type="button" onClick={onTogglePause}>
          {paused ? "Lanjut" : "Jeda"}
        </button>
      )}
    </div>
  );
}

export function FeedbackToast({
  message,
  tone = "neutral"
}: {
  message: string;
  tone?: "neutral" | "good" | "bad";
}) {
  return <div className={`feedback-toast is-${tone}`}>{message}</div>;
}

export function RoundEndOverlay({
  title = "Waktu habis",
  score,
  playerCount,
  onReplay,
  onCalibration
}: {
  title?: string;
  score: Record<PlayerId, number>;
  playerCount: 1 | 2;
  onReplay(): void;
  onCalibration(): void;
}) {
  const winner =
    playerCount === 1
      ? null
      : score.A === score.B
        ? "Seri"
        : score.A > score.B
          ? "Player A menang"
          : "Player B menang";

  return (
    <div className="round-end-overlay" role="dialog" aria-modal="true" aria-label={title}>
      <section className="round-end-card">
        <span className="round-end-mark">✓</span>
        <h2>{title}</h2>
        {winner ? <p>{winner}</p> : <p>Ronde selesai. Simpan skor terbaik dan coba lagi.</p>}
        <div className={`round-end-scores ${playerCount === 1 ? "is-single" : ""}`}>
          <div><small>PLAYER A</small><strong>{score.A}</strong></div>
          {playerCount === 2 ? <div><small>PLAYER B</small><strong>{score.B}</strong></div> : null}
        </div>
        <div className="round-end-actions">
          <button className="button button--primary" type="button" onClick={onReplay}>Main lagi</button>
          <button className="button button--ghost" type="button" onClick={onCalibration}>Kalibrasi ulang</button>
        </div>
      </section>
    </div>
  );
}
