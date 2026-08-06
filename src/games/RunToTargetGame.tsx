"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { BodyAction } from "@/lib/engine/types";
import type { GameModuleProps } from "./types";
import {
  CameraBackdrop,
  FeedbackToast,
  RoundEndOverlay,
  useRoundTimer
} from "./shared";
import { useProgressSync } from "@/lib/auth/progress";

const TARGETS: BodyAction[] = ["left", "right", "forward", "back", "center"];
const LABELS: Record<string, string> = {
  left: "KIRI",
  right: "KANAN",
  forward: "MAJU",
  back: "MUNDUR",
  center: "TENGAH",
  jump: "LOMPAT",
  crouch: "JONGKOK"
};

export function RunToTargetGame(props: GameModuleProps) {
  const [target, setTarget] = useState<BodyAction>("left");
  const targetRef = useRef<BodyAction>("left");
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const [keyAction, setKeyAction] = useState<BodyAction>("center");
  const body = useMemo(
    () => props.snapshot.bodies.find((item) => item.player === "A"),
    [props.snapshot.bodies]
  );
  const action =
    props.inputMode === "camera" ? (body?.action ?? "center") : keyAction;
  const lastFrameRef = useRef(0);
  const timer = useRoundTimer(60);

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") setKeyAction("left");
      if (event.key === "ArrowRight") setKeyAction("right");
      if (event.key === "ArrowUp") setKeyAction("forward");
      if (event.key === "ArrowDown") setKeyAction("back");
      if (event.key === "Enter") setKeyAction("center");
    };
    const up = () => setKeyAction("center");

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    if (!timer.running) return;

    let frame = 0;
    lastFrameRef.current = performance.now();

    const loop = (now: number) => {
      const delta = Math.min(80, now - lastFrameRef.current);
      lastFrameRef.current = now;
      let next =
        action === targetRef.current
          ? Math.min(100, progressRef.current + delta / 12)
          : Math.max(0, progressRef.current - delta / 18);

      if (next >= 100) {
        setScore((current) => current + 100);
        const choices = TARGETS.filter((item) => item !== targetRef.current);
        const selected = choices[Math.floor(Math.random() * choices.length)]!;
        targetRef.current = selected;
        setTarget(selected);
        next = 0;
      }

      progressRef.current = next;
      setProgress(next);
      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [action, timer.running]);

  const position =
    action === "left" ? "18%" : action === "right" ? "82%" : "50%";
  const scale = action === "forward" ? 1.22 : action === "back" ? 0.8 : 1;
  const scoreRecord = { A: score, B: 0 };
  useProgressSync(props.game.slug, score);

  return (
    <CameraBackdrop
      inputMode={props.inputMode}
      bindVideo={props.bindVideo}
      snapshot={props.snapshot}
    >
      <div className="run-hud">
        <div>
          <small>SKOR</small>
          <strong>{score}</strong>
        </div>
        <div className="run-target-label">
          <small>TARGET BERIKUTNYA · {timer.remaining} DETIK</small>
          <strong>{LABELS[target]}</strong>
          <span>
            <i style={{ width: `${progress}%` }} />
          </span>
        </div>
        <div>
          <small>GERAKAN</small>
          <strong>{LABELS[action]}</strong>
        </div>
      </div>

      <section className="run-field">
        <div className="target-zone zone-left" data-active={target === "left"}>
          KIRI
        </div>
        <div
          className="target-zone zone-center"
          data-active={target === "center"}
        >
          TENGAH
        </div>
        <div className="target-zone zone-right" data-active={target === "right"}>
          KANAN
        </div>
        <div
          className="depth-zone depth-forward"
          data-active={target === "forward"}
        >
          MAJU
        </div>
        <div className="depth-zone depth-back" data-active={target === "back"}>
          MUNDUR
        </div>
        <div
          className="runner-avatar"
          style={{ left: position, transform: `translateX(-50%) scale(${scale})` }}
        >
          <span>●</span>
          <i />
          <b />
        </div>
      </section>

      <div className="body-instructions">
        <span>← kiri</span>
        <span>→ kanan</span>
        <span>↑ maju</span>
        <span>↓ mundur</span>
        <span>Tahan posisi sampai progress penuh</span>
      </div>
      <FeedbackToast
        message={
          body
            ? `Body action: ${action} · target ${target}`
            : props.inputMode === "demo"
              ? "Keyboard fallback aktif"
              : "Berdiri di area kamera untuk kalibrasi"
        }
      />
      {timer.ended ? (
        <RoundEndOverlay
          score={scoreRecord}
          playerCount={1}
          onReplay={props.onReplay}
          onCalibration={props.onExit}
        />
      ) : null}
    </CameraBackdrop>
  );
}
