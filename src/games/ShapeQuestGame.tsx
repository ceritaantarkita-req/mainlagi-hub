"use client";

import { useEffect, useRef, useState } from "react";
import { MotionPad } from "@/components/MotionPad";
import { SHAPE_TEMPLATES, type ShapeName } from "@/lib/engine/templates";
import type { Stroke } from "@/lib/engine/types";
import { evaluateGuidedTrace } from "@/lib/tracing/guided";
import type { GameModuleProps } from "./types";
import {
  CameraBackdrop,
  FeedbackToast,
  GameHud,
  usePresence,
  RoundEndOverlay,
  useRoundTimer
} from "./shared";
import { useProgressSync } from "@/lib/auth/progress";

const LABELS: Record<ShapeName, string> = {
  circle: "Lingkaran",
  triangle: "Segitiga",
  square: "Persegi",
  rectangle: "Persegi panjang",
  zigzag: "Zigzag"
};
const CLOSED_SHAPES = new Set<ShapeName>([
  "circle",
  "triangle",
  "square",
  "rectangle"
]);

export function ShapeQuestGame(props: GameModuleProps) {
  const shapes = Object.keys(SHAPE_TEMPLATES) as ShapeName[];
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState({ A: 0, B: 0 });
  const [feedback, setFeedback] = useState<{
    message: string;
    tone: "neutral" | "good" | "bad";
  }>({
    message: "Ikuti seluruh jalur bentuk. Bentuk tertutup harus tersambung lagi.",
    tone: "neutral"
  });
  const nextShapeTimerRef = useRef<number | null>(null);
  const present = usePresence(props.vision, props.inputMode);
  const timer = useRoundTimer(60, {
    mode: props.sessionMode,
    presence: present
  });
  const shape = shapes[index] ?? "circle";
  const target = SHAPE_TEMPLATES[shape];
  const requiresClosure = CLOSED_SHAPES.has(shape);

  useEffect(
    () => () => {
      if (nextShapeTimerRef.current !== null) {
        window.clearTimeout(nextShapeTimerRef.current);
      }
    },
    []
  );

  const selectShape = (shapeIndex: number) => {
    if (nextShapeTimerRef.current !== null) {
      window.clearTimeout(nextShapeTimerRef.current);
      nextShapeTimerRef.current = null;
    }
    setIndex(shapeIndex);
    const selected = shapes[shapeIndex] ?? "circle";
    setFeedback({
      message: CLOSED_SHAPES.has(selected)
        ? `${LABELS[selected]} harus mengikuti jalur dan kembali tersambung ke titik awal.`
        : `Ikuti jalur ${LABELS[selected]} dari awal sampai akhir.`,
      tone: "neutral"
    });
  };

  const submit = (strokes: Stroke[]) => {
    const result = evaluateGuidedTrace(strokes, target, {
      corridor: 0.11,
      requireClosure: requiresClosure,
      closureThreshold: 0.16,
      minCoverage: 0.6,
      maxOffPathRatio: 0.48,
      minScore: 56
    });
    const coverage = Math.round(result.coverage * 100);
    const precision = Math.round(result.precision * 100);

    if (result.accepted) {
      setScore((current) => ({ ...current, A: current.A + result.score }));
      setFeedback({
        message: `${result.score}% — ${LABELS[shape]} lengkap. Coverage ${coverage}%, presisi ${precision}%.`,
        tone: "good"
      });
      nextShapeTimerRef.current = window.setTimeout(
        () => setIndex((value) => (value + 1) % shapes.length),
        700
      );
    } else {
      setFeedback({
        message: `${result.score}% · coverage ${coverage}% — ${result.reason ?? "Coba lagi."}`,
        tone: "bad"
      });
      timer.addSeconds(1);
    }
  };

  useProgressSync(props.game.slug, Math.max(score.A, score.B));

  return (
    <CameraBackdrop
      inputMode={props.inputMode}
      vision={props.vision}
    >
      <GameHud
        title="Shape Quest"
        remaining={timer.remaining}
        timed={timer.timed}
        score={score}
        playerCount={1}
        paused={timer.paused}
        awayPaused={timer.awayPaused}
        onTogglePause={timer.timed ? timer.toggle : undefined}
      />
      <div className="trace-layout">
        <aside className="trace-sidebar shape-sidebar">
          <small>BENTUK TARGET</small>
          <strong>{LABELS[shape]}</strong>
          <p>
            Sistem menilai coverage dan bagian yang keluar jalur.
            {requiresClosure
              ? " Ujung bentuk wajib kembali tersambung ke awal."
              : " Jalur harus selesai sampai ujung akhir."}
          </p>
          <div className="shape-picker">
            {shapes.map((item, shapeIndex) => (
              <button
                key={item}
                className={shapeIndex === index ? "is-active" : ""}
                onClick={() => selectShape(shapeIndex)}
              >
                {LABELS[item]}
              </button>
            ))}
          </div>
        </aside>
        <MotionPad
          vision={props.vision}
          player="A"
          enabled={timer.running}
          target={target}
          label="Area bentuk"
          hint={
            requiresClosure
              ? "Boleh multi-stroke · tutup bentuk kembali ke titik awal"
              : "Boleh multi-stroke · ikuti jalur sampai ujung"
          }
          onSubmit={submit}
        />
      </div>
      <FeedbackToast message={feedback.message} tone={feedback.tone} />
      {timer.ended ? (
        <RoundEndOverlay
          score={score}
          playerCount={1}
          onReplay={props.onReplay}
          onCalibration={props.onExit}
          game={props.game.slug}
        />
      ) : null}
    </CameraBackdrop>
  );
}
