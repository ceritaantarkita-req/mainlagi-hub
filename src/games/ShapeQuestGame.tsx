"use client";

import { useMemo, useState } from "react";
import { MotionPad } from "@/components/MotionPad";
import { flattenStrokes, scorePath } from "@/lib/engine/geometry";
import { SHAPE_TEMPLATES, type ShapeName } from "@/lib/engine/templates";
import type { Stroke } from "@/lib/engine/types";
import type { GameModuleProps } from "./types";
import { CameraBackdrop, FeedbackToast, GameHud, RoundEndOverlay, useRoundTimer } from "./shared";
import { useProgressSync } from "@/lib/auth/progress";

const LABELS: Record<ShapeName, string> = { circle: "Lingkaran", triangle: "Segitiga", square: "Persegi", rectangle: "Persegi panjang", zigzag: "Zigzag" };
export function ShapeQuestGame(props: GameModuleProps) {
  const shapes = Object.keys(SHAPE_TEMPLATES) as ShapeName[];
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState({ A: 0, B: 0 });
  const [feedback, setFeedback] = useState({ message: "Gambar bentuk dengan satu atau beberapa stroke.", tone: "neutral" as "neutral" | "good" | "bad" });
  const timer = useRoundTimer(60);
  const hand = useMemo(() => props.snapshot.hands.find((item) => item.player === "A"), [props.snapshot.hands]);
  const shape = shapes[index] ?? "circle";
  const submit = (strokes: Stroke[]) => { const result = scorePath(flattenStrokes(strokes), SHAPE_TEMPLATES[shape]); if (result >= 60) { setScore((current) => ({ ...current, A: current.A + result })); setFeedback({ message: `${result}% — ${LABELS[shape]} terbaca. Hebat!`, tone: "good" }); window.setTimeout(() => setIndex((value) => (value + 1) % shapes.length), 700); } else { setFeedback({ message: `${result}% — periksa sudut dan sambungan bentuk.`, tone: "bad" }); timer.addSeconds(1); } };
  useProgressSync(props.game.slug, Math.max(score.A, score.B));
  return <CameraBackdrop inputMode={props.inputMode} bindVideo={props.bindVideo} snapshot={props.snapshot}>
    <GameHud title="Shape Quest" remaining={timer.remaining} score={score} playerCount={1} paused={timer.paused} onTogglePause={timer.toggle} />
    <div className="trace-layout"><aside className="trace-sidebar shape-sidebar"><small>BENTUK TARGET</small><strong>{LABELS[shape]}</strong><div className="shape-picker">{shapes.map((item, shapeIndex) => <button key={item} className={shapeIndex === index ? "is-active" : ""} onClick={() => setIndex(shapeIndex)}>{LABELS[item]}</button>)}</div></aside><MotionPad player="A" playerCount={1} hand={hand} enabled={timer.running} target={SHAPE_TEMPLATES[shape]} label="Area bentuk" hint="Boleh multi-stroke · submit saat bentuk lengkap" onSubmit={submit} /></div>
    <FeedbackToast message={feedback.message} tone={feedback.tone} />
    {timer.ended ? <RoundEndOverlay score={score} playerCount={1} onReplay={props.onReplay} onCalibration={props.onExit} /> : null}
  </CameraBackdrop>;
}
