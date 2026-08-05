"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { boardFor, readPlayerName, writePlayerName, type ScoreEntry } from "@/engine/leaderboard";
import { createRuntimeSeed, createRandom } from "@/engine/random";
import { GAME_REGISTRY } from "@/engine/registry";
import { dealQuiz, QUIZ_CATEGORY_LABELS, type QuizCategory, type QuizQuestion } from "@/engine/quiz";
import type { Point } from "@/engine/types";
import { useMotionCapture } from "@/hooks/useMotionCapture";
import { TargetSelector, type ARTarget } from "@/lib/vision-core/target";

const QUESTION_COUNT = 10;
const GAME_ID = "pilih-jawaban" as const;

/**
 * Buttons sit low and wide apart.
 *
 * Low, because a raised arm blocks the prompt if the targets are near the top.
 * Wide apart, because the whole design rests on the user being able to sit
 * inside one target without their natural hand tremor clipping the other.
 */
const TARGETS: ARTarget[] = [
  { id: "0", center: { x: 0.24, y: 0.66 }, radius: 0.15 },
  { id: "1", center: { x: 0.76, y: 0.66 }, radius: 0.15 }
];

type Phase = "intro" | "playing" | "result";

export function QuizGame() {
  const game = GAME_REGISTRY[GAME_ID];
  const [phase, setPhase] = useState<Phase>("intro");
  const [categories, setCategories] = useState<QuizCategory[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<{ option: number; right: boolean } | null>(null);
  const [hoverProgress, setHoverProgress] = useState<Record<string, number>>({});
  const [name, setName] = useState("");
  const [entries, setEntries] = useState<ScoreEntry[]>([]);
  const [rank, setRank] = useState<number | null>(null);

  const selectorRef = useRef(new TargetSelector({ dwellMs: 950 }));
  const lockedRef = useRef(false);
  const phaseRef = useRef<Phase>("intro");
  const indexRef = useRef(0);
  const questionsRef = useRef<QuizQuestion[]>([]);

  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { indexRef.current = index; }, [index]);
  useEffect(() => { questionsRef.current = questions; }, [questions]);
  useEffect(() => { setName(readPlayerName()); }, []);

  const current = questions[index] ?? null;

  const answer = useCallback((option: number) => {
    const question = questionsRef.current[indexRef.current];
    if (!question || lockedRef.current) return;
    lockedRef.current = true;

    const right = option === question.answer;
    setFeedback({ option, right });
    if (right) {
      setCorrect((value) => value + 1);
      setScore((value) => value + 10);
    }

    window.setTimeout(() => {
      setFeedback(null);
      setHoverProgress({});
      selectorRef.current.reset();
      lockedRef.current = false;
      if (indexRef.current + 1 >= questionsRef.current.length) setPhase("result");
      else setIndex((value) => value + 1);
    }, 1100);
  }, []);

  const handlePointer = useCallback((player: "A" | "B", point: Point | null) => {
    if (player !== "A") return;
    if (phaseRef.current !== "playing") return;

    const update = selectorRef.current.update(point, TARGETS, performance.now());
    setHoverProgress(
      Object.fromEntries(update.progress.map((entry) => [entry.id, entry.progress]))
    );
    if (update.selected !== null) answer(Number(update.selected));
  }, [answer]);

  const motion = useMotionCapture({
    cameraEnabled: phase === "playing",
    captureEnabled: false,   // this game selects, it never writes
    singlePlayer: true,
    onDigit: () => undefined,
    onTrace: () => undefined,
    onClear: () => undefined,
    onPointer: handlePointer
  });

  const start = useCallback(() => {
    const seed = createRuntimeSeed();
    const random = createRandom(seed);
    const deck = dealQuiz(QUESTION_COUNT, () => random.next(), categories.length ? categories : undefined);
    setQuestions(deck);
    questionsRef.current = deck;
    setIndex(0);
    setScore(0);
    setCorrect(0);
    setFeedback(null);
    setHoverProgress({});
    selectorRef.current.reset();
    lockedRef.current = false;
    setPhase("playing");
  }, [categories]);

  // Submit the run once, when the result screen is reached.
  useEffect(() => {
    if (phase !== "result") return;
    const board = boardFor(GAME_ID);
    const result = board.submit({
      name: name || "Pemain",
      score,
      at: Date.now(),
      mode: categories.length ? categories.join("+") : "semua",
      detail: { benar: correct, total: questions.length }
    });
    setEntries(result.entries);
    setRank(result.rank);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const toggleCategory = (category: QuizCategory) => {
    setCategories((current) =>
      current.includes(category) ? current.filter((value) => value !== category) : [...current, category]
    );
  };

  const cameraBusy = motion.status === "loading";
  const readiness = motion.readiness;

  const buttonStyle = useMemo(
    () => (target: ARTarget) => ({
      left: `${target.center.x * 100}%`,
      top: `${target.center.y * 100}%`,
      width: `${target.radius * 2 * 100}%`,
      aspectRatio: "1 / 1"
    }),
    []
  );

  if (phase === "intro") {
    return (
      <main className="quiz-screen">
        <Link href="/" className="quiz-back">← Kembali ke beranda</Link>
        <section className="quiz-card">
          <span className="quiz-eyebrow">{game.age} · {game.players}</span>
          <h1>{game.title}</h1>
          <p>{game.description}</p>
          <p className="quiz-howto">
            Arahkan tangan ke tombol jawaban dan <strong>tahan sebentar</strong> sampai
            lingkarannya penuh. Tidak perlu menulis apa pun.
          </p>

          <h2>Pilih kategori</h2>
          <div className="quiz-categories">
            {(Object.keys(QUIZ_CATEGORY_LABELS) as QuizCategory[]).map((category) => (
              <button
                type="button"
                key={category}
                className={`quiz-category ${categories.includes(category) ? "is-selected" : ""}`}
                onClick={() => toggleCategory(category)}
              >
                {QUIZ_CATEGORY_LABELS[category]}
              </button>
            ))}
          </div>
          <small className="quiz-hint">
            {categories.length === 0 ? "Belum dipilih = semua kategori dipakai." : `${categories.length} kategori dipilih.`}
          </small>

          <label className="quiz-name">
            <span>Nama untuk papan skor</span>
            <input
              type="text"
              value={name}
              maxLength={18}
              placeholder="Pemain"
              onChange={(event) => { setName(event.target.value); writePlayerName(event.target.value); }}
            />
          </label>

          <button type="button" className="quiz-start" onClick={start}>MULAI</button>
        </section>
      </main>
    );
  }

  if (phase === "result") {
    return (
      <main className="quiz-screen">
        <section className="quiz-card">
          <span className="quiz-eyebrow">SELESAI</span>
          <h1>Skor kamu: {score}</h1>
          <p>{correct} benar dari {questions.length} soal.</p>
          {rank ? <p className="quiz-rank">Peringkat #{rank} di papan skor.</p> : null}

          <h2>Papan Skor</h2>
          <ol className="quiz-board">
            {entries.map((entry, position) => (
              <li key={`${entry.at}-${entry.name}`} className={position + 1 === rank ? "is-me" : ""}>
                <b>{position + 1}</b>
                <span>{entry.name}</span>
                <strong>{entry.score}</strong>
              </li>
            ))}
            {entries.length === 0 ? <li className="quiz-board-empty">Belum ada skor.</li> : null}
          </ol>

          <div className="quiz-result-actions">
            <button type="button" className="quiz-start" onClick={start}>MAIN LAGI</button>
            <button type="button" className="quiz-secondary" onClick={() => setPhase("intro")}>GANTI KATEGORI</button>
            <Link href="/" className="quiz-secondary">BERANDA</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="quiz-stage">
      <video ref={motion.videoRef} className="quiz-video" muted playsInline autoPlay aria-label="Kamera" />

      <header className="quiz-hud">
        <Link href="/" className="quiz-hud-home">←</Link>
        <div className="quiz-hud-progress">Soal {index + 1} / {questions.length}</div>
        <div className="quiz-hud-score">⭐ {score}</div>
      </header>

      {motion.error ? (
        <div className="quiz-banner quiz-banner--error">{motion.error}</div>
      ) : cameraBusy || !readiness.canStart ? (
        <div className="quiz-banner">
          {readiness.message}
          <div className="quiz-banner-bar"><i style={{ width: `${readiness.progress * 100}%` }} /></div>
        </div>
      ) : null}

      {current ? (
        <>
          <div className="quiz-prompt">
            <span className="quiz-prompt-symbol">{current.prompt}</span>
            <p>{current.question}</p>
          </div>

          {TARGETS.map((target, optionIndex) => {
            const progress = hoverProgress[target.id] ?? 0;
            const isAnswered = feedback?.option === optionIndex;
            const state = isAnswered ? (feedback.right ? "is-right" : "is-wrong") : "";
            return (
              <button
                type="button"
                key={target.id}
                className={`quiz-target ${state}`}
                style={buttonStyle(target)}
                onClick={() => answer(optionIndex)}
                aria-label={current.options[optionIndex]}
              >
                <svg className="quiz-ring" viewBox="0 0 100 100" aria-hidden="true">
                  <circle className="quiz-ring-track" cx="50" cy="50" r="46" />
                  <circle
                    className="quiz-ring-fill"
                    cx="50" cy="50" r="46"
                    style={{ strokeDashoffset: 289 - 289 * progress }}
                  />
                </svg>
                <span className="quiz-target-label">{current.options[optionIndex]}</span>
              </button>
            );
          })}

          {feedback ? (
            <div className={`quiz-feedback ${feedback.right ? "is-right" : "is-wrong"}`}>
              {feedback.right ? "Benar! 🎉" : `Jawabannya: ${current.options[current.answer]}`}
            </div>
          ) : null}
        </>
      ) : null}
    </main>
  );
}
