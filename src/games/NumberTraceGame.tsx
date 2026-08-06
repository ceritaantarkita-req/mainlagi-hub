"use client";

import { useMemo, useState } from "react";
import { MotionPad } from "@/components/MotionPad";
import { flattenStrokes, scorePath } from "@/lib/engine/geometry";
import { DIGIT_TEMPLATES } from "@/lib/engine/templates";
import type { Stroke } from "@/lib/engine/types";
import type { GameModuleProps } from "./types";
import { CameraBackdrop, FeedbackToast, GameHud, RoundEndOverlay, useRoundTimer } from "./shared";
import { useProgressSync } from "@/lib/auth/progress";

export function NumberTraceGame(props: GameModuleProps) {
  const [digit, setDigit] = useState(0);
  const [score, setScore] = useState({ A: 0, B: 0 });
  const [message, setMessage] = useState("Mulai dari titik atas dan ikuti garis putus-putus.");
  const [tone, setTone] = useState<"neutral" | "good" | "bad">("neutral");
  const timer = useRoundTimer(60);
  const hand = useMemo(() => props.snapshot.hands.find((item) => item.player === "A"), [props.snapshot.hands]);
  const target = DIGIT_TEMPLATES[digit]?.[0] ?? [];
  const submit = (strokes: Stroke[]) => {
    const result = scorePath(flattenStrokes(strokes), target);
    if (result >= 62) {
      setScore((current) => ({ ...current, A: current.A + result }));
      setTone("good"); setMessage(`${result}% — bentuk angka ${digit} cocok. Lanjut!`);
      window.setTimeout(() => setDigit((value) => (value + 1) % 10), 700);
    } else {
      setTone("bad"); setMessage(`${result}% — ikuti jalur lebih dekat. Retry tidak mengurangi skor.`); timer.addSeconds(1);
    }
  };
  useProgressSync(props.game.slug, Math.max(score.A, score.B));
  return <CameraBackdrop inputMode={props.inputMode} bindVideo={props.bindVideo} snapshot={props.snapshot}>
    <GameHud title="Number Trace Adventure" remaining={timer.remaining} score={score} playerCount={1} paused={timer.paused} onTogglePause={timer.toggle} />
    <div className="trace-layout"><aside className="trace-sidebar"><small>ANGKA TARGET</small><strong>{digit}</strong><p>Setiap lintasan dinilai dari kedekatan bentuk, bukan klasifikasi angka bebas.</p><div className="number-strip">{Array.from({ length: 10 }, (_, value) => <button key={value} className={value === digit ? "is-active" : ""} onClick={() => setDigit(value)}>{value}</button>)}</div></aside><MotionPad player="A" playerCount={1} hand={hand} enabled={timer.running} target={target} label="Area tracing" hint="Pinch atau drag mengikuti garis · telapak terbuka / Kirim untuk menilai" onSubmit={submit} /></div>
    <FeedbackToast message={message} tone={tone} />
    {timer.ended ? <RoundEndOverlay score={score} playerCount={1} onReplay={props.onReplay} onCalibration={props.onExit} /> : null}
  </CameraBackdrop>;
}
