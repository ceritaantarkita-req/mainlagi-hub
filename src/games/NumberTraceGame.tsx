"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MotionPad } from "@/components/MotionPad";
import { DIGIT_TEMPLATES } from "@/lib/engine/templates";
import type { Stroke } from "@/lib/engine/types";
import { evaluateGuidedTrace } from "@/lib/tracing/guided";
import type { GameModuleProps } from "./types";
import {
  CameraBackdrop,
  FeedbackToast,
  GameHud,
  RoundEndOverlay,
  useRoundTimer
} from "./shared";
import { useProgressSync } from "@/lib/auth/progress";

export function NumberTraceGame(props: GameModuleProps) {
  const [digit, setDigit] = useState(0);
  const [score, setScore] = useState({ A: 0, B: 0 });
  const [message, setMessage] = useState(
    "Mulai dari titik awal dan ikuti arah garis sampai selesai."
  );
  const [tone, setTone] = useState<"neutral" | "good" | "bad">("neutral");
  const nextDigitTimerRef = useRef<number | null>(null);
  const timer = useRoundTimer(60);
  const hand = useMemo(
    () => props.snapshot.hands.find((item) => item.player === "A"),
    [props.snapshot.hands]
  );
  const target = DIGIT_TEMPLATES[digit]?.[0] ?? [];

  useEffect(
    () => () => {
      if (nextDigitTimerRef.current !== null) {
        window.clearTimeout(nextDigitTimerRef.current);
      }
    },
    []
  );

  const selectDigit = (value: number) => {
    if (nextDigitTimerRef.current !== null) {
      window.clearTimeout(nextDigitTimerRef.current);
      nextDigitTimerRef.current = null;
    }
    setDigit(value);
    setTone("neutral");
    setMessage(`Angka ${value}: mulai dari titik awal dan ikuti arah jalur.`);
  };

  const submit = (strokes: Stroke[]) => {
    const result = evaluateGuidedTrace(strokes, target, {
      corridor: 0.1,
      requireDirection: true,
      minCoverage: 0.62,
      maxOffPathRatio: 0.45,
      minScore: 58
    });
    const coverage = Math.round(result.coverage * 100);
    const precision = Math.round(result.precision * 100);

    if (result.accepted) {
      setScore((current) => ({ ...current, A: current.A + result.score }));
      setTone("good");
      setMessage(
        `${result.score}% — jalur angka ${digit} lengkap. Coverage ${coverage}%, presisi ${precision}%.`
      );
      nextDigitTimerRef.current = window.setTimeout(
        () => setDigit((value) => (value + 1) % 10),
        700
      );
    } else {
      setTone("bad");
      setMessage(
        `${result.score}% · coverage ${coverage}% — ${result.reason ?? "Coba lagi."} Retry tidak mengurangi skor.`
      );
      timer.addSeconds(1);
    }
  };

  useProgressSync(props.game.slug, Math.max(score.A, score.B));

  return (
    <CameraBackdrop
      inputMode={props.inputMode}
      bindVideo={props.bindVideo}
      snapshot={props.snapshot}
    >
      <GameHud
        title="Number Trace Adventure"
        remaining={timer.remaining}
        score={score}
        playerCount={1}
        paused={timer.paused}
        onTogglePause={timer.toggle}
      />
      <div className="trace-layout">
        <aside className="trace-sidebar">
          <small>ANGKA TARGET</small>
          <strong>{digit}</strong>
          <p>
            Sistem menilai coverage, kedekatan jalur, titik awal/akhir, dan arah
            tracing. Stroke yang terpisah tidak dijahit otomatis.
          </p>
          <div className="number-strip">
            {Array.from({ length: 10 }, (_, value) => (
              <button
                key={value}
                className={value === digit ? "is-active" : ""}
                onClick={() => selectDigit(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </aside>
        <MotionPad
          player="A"
          playerCount={1}
          hand={hand}
          enabled={timer.running}
          target={target}
          label="Area tracing"
          hint="Mulai di ujung awal · ikuti arah garis · telapak terbuka/Kirim untuk menilai"
          onSubmit={submit}
        />
      </div>
      <FeedbackToast message={message} tone={tone} />
      {timer.ended ? (
        <RoundEndOverlay
          score={score}
          playerCount={1}
          onReplay={props.onReplay}
          onCalibration={props.onExit}
        />
      ) : null}
    </CameraBackdrop>
  );
}
