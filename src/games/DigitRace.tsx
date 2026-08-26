"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MotionPad } from "@/components/MotionPad";
import { playTone, speak } from "@/lib/audio/feedback";

import {
  createMathQuestion,
  createPatternQuestion,
  type Level,
  type MathQuestion,
  type PatternQuestion
} from "@/lib/engine/math";
import { createRandom, type RandomSource } from "@/lib/engine/random";
import type { PlayerId } from "@/lib/engine/types";
import type { GameModuleProps } from "./types";
import {
  CameraBackdrop,
  FeedbackToast,
  GameHud,
  RoundEndOverlay,
  StarRow,
  usePresence,
  useRoundTimer
} from "./shared";
import { useProgressSync } from "@/lib/auth/progress";

type Question = MathQuestion | PatternQuestion;

const LEVEL_LABELS: Record<Level, string> = {
  tk: "TK",
  sd1: "SD 1",
  sd2: "SD 2"
};

function makeQuestion(
  kind: "math" | "pattern",
  random: RandomSource,
  level: Level,
  id: string
): Question {
  return kind === "math"
    ? createMathQuestion(random, level, undefined, id)
    : createPatternQuestion(random, level, id);
}

export function DigitRace({
  kind,
  ...props
}: GameModuleProps & { kind: "math" | "pattern" }) {
  /**
   * The seed was hard-coded before, so every session produced the identical
   * question sequence. A child memorises that in an afternoon.
   */
  const [random] = useState<RandomSource>(() =>
    createRandom(Math.floor(Math.random() * 0x7fffffff) + 1)
  );
  const sequenceRef = useRef(0);
  const timeoutsRef = useRef<Record<PlayerId, number | null>>({
    A: null,
    B: null
  });

  const nextQuestion = useCallback(
    (player: PlayerId, level: Level): Question => {
      sequenceRef.current += 1;
      return makeQuestion(
        kind,
        random,
        level,
        `${kind === "math" ? "q" : "p"}-${player}-${sequenceRef.current}`
      );
    },
    [kind, random]
  );

  /**
   * Every player gets their own question at their own level. Previously both
   * players raced on one shared question at one shared level, which meant a
   * five-year-old and their thirty-six-year-old parent were given identical
   * arithmetic - a race the child could never win.
   */
  const [questions, setQuestions] = useState<Record<PlayerId, Question>>(() => ({
    A: makeQuestion(kind, random, props.playerLevels.A, "q-A-0"),
    B: makeQuestion(kind, random, props.playerLevels.B, "q-B-0")
  }));
  const [score, setScore] = useState<Record<PlayerId, number>>({ A: 0, B: 0 });
  const [stars, setStars] = useState<Record<PlayerId, number>>({ A: 0, B: 0 });
  const [feedback, setFeedback] = useState<{
    message: string;
    tone: "neutral" | "good" | "bad";
  }>({
    message: "Tulis satu angka. Nanti muncul angka bersihnya untuk kamu setujui.",
    tone: "neutral"
  });

  const present = usePresence(props.vision, props.inputMode);
  const timer = useRoundTimer(90, { mode: props.sessionMode, presence: present });

  useEffect(
    () => () => {
      for (const handle of Object.values(timeoutsRef.current)) {
        if (handle !== null) window.clearTimeout(handle);
      }
    },
    []
  );

  useProgressSync(props.game.slug, Math.max(score.A, score.B));

  /**
   * The pad now hands over a *confirmed* number rather than raw strokes: the
   * player has already seen each digit rendered back as a clean numeral and
   * accepted it. So the only judgement left here is arithmetic, not
   * handwriting - which is the right division of labour, and it is what makes
   * two-digit answers workable at all.
   */
  const answer = (player: PlayerId, value: number) => {
    if (!timer.running) return;

    const question = questions[player];

    if (value !== question.answer) {
      // No score penalty. Getting a sum wrong is part of learning, and the
      // handwriting is no longer in question.
      playTone("wrong");
      setFeedback({
        message: `Pemain ${player}: ${value} belum tepat. Coba lagi ya.`,
        tone: "bad"
      });
      return;
    }

    playTone("correct");
    speak(`Benar. ${question.answer}`);
    const bonus = timer.timed ? Math.max(0, Math.round(timer.remaining / 2)) : 0;
    setScore((current) => ({ ...current, [player]: current[player] + 100 + bonus }));
    setStars((current) => ({
      ...current,
      [player]: Math.min(5, current[player] + 1)
    }));
    setFeedback({
      message: `Pemain ${player} benar: ${question.answer}!`,
      tone: "good"
    });

    // Only this player's board advances. The other player's half-written
    // answer used to be wiped whenever their opponent scored.
    const handle = window.setTimeout(() => {
      setQuestions((current) => ({
        ...current,
        [player]: nextQuestion(player, props.playerLevels[player])
      }));
      timeoutsRef.current[player] = null;
    }, 700);
    timeoutsRef.current[player] = handle;
  };

  const selectLevel = (player: PlayerId, level: Level) => {
    props.setPlayerLevel(player, level);
    setQuestions((current) => ({
      ...current,
      [player]: nextQuestion(player, level)
    }));
  };

  const renderBoard = (player: PlayerId) => {
    const question = questions[player];
    const answerLength = String(Math.abs(question.answer)).length;

    return (
      <div className="pad-column" key={player}>
        <div className="question-card" data-player={player}>
          <div className="level-switch" role="group" aria-label="Tingkat soal">
            {(["tk", "sd1", "sd2"] as Level[]).map((item) => (
              <button
                key={item}
                type="button"
                className={props.playerLevels[player] === item ? "is-active" : ""}
                data-air-target={`level-${player}-${item}`}
                onClick={() => selectLevel(player, item)}
              >
                {LEVEL_LABELS[item]}
              </button>
            ))}
          </div>
          <small>{kind === "math" ? "HITUNG" : "LANJUTKAN POLA"}</small>
          <strong>{question.prompt}</strong>
          <span>
            {answerLength === 1
              ? "Tulis 1 angka"
              : `Tulis ${answerLength} angka, satu per satu`}
          </span>
          <StarRow stars={stars[player]} />
        </div>
        <MotionPad
          vision={props.vision}
          player={player}
          enabled={timer.running}
          label={player === "A" ? "Pemain A" : "Pemain B"}
          compose={{
            length: answerLength,
            onAnswer: (value) => answer(player, value)
          }}
        />
      </div>
    );
  };

  return (
    <CameraBackdrop
      inputMode={props.inputMode}
      vision={props.vision}
    >
      <GameHud
        title={kind === "math" ? "Math Motion Battle" : "Pattern Race"}
        remaining={timer.remaining}
        timed={timer.timed}
        score={score}
        playerCount={props.playerCount}
        paused={timer.paused}
        awayPaused={timer.awayPaused}
        onTogglePause={timer.timed ? timer.toggle : undefined}
      />
      <div
        className={`motion-pad-grid ${props.playerCount === 1 ? "is-single" : ""}`}
      >
        {renderBoard("A")}
        {props.playerCount === 2 ? renderBoard("B") : null}
      </div>
      <FeedbackToast
        message={
          timer.ended
            ? "Waktu habis. Main lagi atau kalibrasi ulang."
            : feedback.message
        }
        tone={feedback.tone}
      />
      {timer.ended ? (
        <RoundEndOverlay
          score={score}
          playerCount={props.playerCount}
          onReplay={props.onReplay}
          onCalibration={props.onExit}
          game={props.game.slug}
        />
      ) : null}
    </CameraBackdrop>
  );
}
