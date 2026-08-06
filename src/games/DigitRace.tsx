"use client";

import { useMemo, useRef, useState } from "react";
import { MotionPad } from "@/components/MotionPad";
import { classifyDigit, verifyExpectedDigit } from "@/lib/engine/digit";
import { createMathQuestion, createPatternQuestion, type Level, type MathQuestion, type PatternQuestion } from "@/lib/engine/math";
import { createRandom } from "@/lib/engine/random";
import type { PlayerId, Stroke } from "@/lib/engine/types";
import type { GameModuleProps } from "./types";
import { CameraBackdrop, FeedbackToast, GameHud, RoundEndOverlay, useRoundTimer } from "./shared";
import { useProgressSync } from "@/lib/auth/progress";

export function DigitRace({ kind, ...props }: GameModuleProps & { kind: "math" | "pattern" }) {
  const randomRef = useRef(createRandom((Date.now() ^ (kind === "math" ? 0x51aa : 0x91bb)) >>> 0));
  const sequenceRef = useRef(0);
  const [level, setLevel] = useState<Level>("tk");
  const makeQuestion = () => { sequenceRef.current += 1; return kind === "math" ? createMathQuestion(randomRef.current, level, undefined, `q-${sequenceRef.current}`) : createPatternQuestion(randomRef.current, level, `p-${sequenceRef.current}`); };
  const [question, setQuestion] = useState<MathQuestion | PatternQuestion>(() => makeQuestion());
  const [score, setScore] = useState<Record<PlayerId, number>>({ A: 0, B: 0 });
  const [digits, setDigits] = useState<Record<PlayerId, string>>({ A: "", B: "" });
  const [feedback, setFeedback] = useState<{ message: string; tone: "neutral" | "good" | "bad" }>({ message: "Tulis digit pertama, lalu kirim setiap digit.", tone: "neutral" });
  const timer = useRoundTimer(60);
  const lockedRef = useRef(false);
  const hands = useMemo(() => ({ A: props.snapshot.hands.find((hand) => hand.player === "A"), B: props.snapshot.hands.find((hand) => hand.player === "B") }), [props.snapshot.hands]);

  useProgressSync(props.game.slug, Math.max(score.A, score.B));

  const answer = String(question.answer);
  const submit = (player: PlayerId, strokes: Stroke[]) => {
    if (!timer.running || lockedRef.current) return;
    const index = digits[player].length;
    const expected = Number(answer[index]);
    const expectedResult = verifyExpectedDigit(strokes, expected);
    const classified = classifyDigit(strokes);
    if (!expectedResult.accepted) {
      if (classified.accepted && classified.value !== expected && classified.confidence >= .62) {
        setScore((current) => ({ ...current, [player]: Math.max(0, current[player] - 5) }));
        setDigits((current) => ({ ...current, [player]: "" }));
        setFeedback({ message: `Player ${player}: terbaca ${classified.value}, jawaban belum tepat.`, tone: "bad" });
      } else {
        timer.addSeconds(1);
        setFeedback({ message: `Player ${player}: belum terbaca jelas. Coba lebih besar — waktu +1 detik.`, tone: "neutral" });
      }
      return;
    }
    const nextDigits = `${digits[player]}${expected}`;
    setDigits((current) => ({ ...current, [player]: nextDigits }));
    if (nextDigits.length < answer.length) { setFeedback({ message: `Digit ${expected} terbaca. Lanjutkan digit berikutnya.`, tone: "good" }); return; }
    if (Number(nextDigits) === question.answer) {
      lockedRef.current = true;
      setScore((current) => ({ ...current, [player]: current[player] + 100 + timer.remaining }));
      setFeedback({ message: `Player ${player} benar: ${question.answer}!`, tone: "good" });
      window.setTimeout(() => { setDigits({ A: "", B: "" }); setQuestion(makeQuestion()); lockedRef.current = false; setFeedback({ message: "Soal berikutnya.", tone: "neutral" }); }, 850);
    }
  };

  return <CameraBackdrop inputMode={props.inputMode} bindVideo={props.bindVideo} snapshot={props.snapshot}>
    <GameHud title={kind === "math" ? "Math Motion Battle" : "Pattern Race"} remaining={timer.remaining} score={score} playerCount={props.playerCount} paused={timer.paused} onTogglePause={timer.toggle} />
    <div className="question-ribbon"><div className="level-switch">{(["tk","sd1","sd2"] as Level[]).map((item) => <button key={item} className={level === item ? "is-active" : ""} onClick={() => { setLevel(item); setQuestion(kind === "math" ? createMathQuestion(randomRef.current, item) : createPatternQuestion(randomRef.current, item)); setDigits({ A:"", B:"" }); }}>{item.toUpperCase()}</button>)}</div><small>{kind === "math" ? "HITUNG" : "LANJUTKAN POLA"}</small><strong>{question.prompt}</strong><span>Jawaban {answer.length} digit</span></div>
    <div className={`motion-pad-grid ${props.playerCount === 1 ? "is-single" : ""}`}>
      <div><div className="digit-preview">{digits.A || "?"}</div><MotionPad player="A" playerCount={props.playerCount} hand={hands.A} enabled={timer.running} onSubmit={(strokes) => submit("A", strokes)} /></div>
      {props.playerCount === 2 ? <div><div className="digit-preview is-b">{digits.B || "?"}</div><MotionPad player="B" playerCount={props.playerCount} hand={hands.B} enabled={timer.running} onSubmit={(strokes) => submit("B", strokes)} /></div> : null}
    </div>
    <FeedbackToast message={timer.remaining <= 0 ? "Waktu habis. Kalibrasi ulang atau keluar untuk memulai ronde baru." : feedback.message} tone={feedback.tone} />
    {timer.ended ? <RoundEndOverlay score={score} playerCount={props.playerCount} onReplay={props.onReplay} onCalibration={props.onExit} /> : null}
  </CameraBackdrop>;
}
