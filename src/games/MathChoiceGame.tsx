"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AirCursor } from "@/components/AirCursor";
import { playTone, speak } from "@/lib/audio/feedback";
import { buildChoices, type ChoiceSet } from "@/lib/engine/choices";
import { createMathQuestion, type Level, type MathQuestion } from "@/lib/engine/math";
import { createRandom, type RandomSource } from "@/lib/engine/random";
import type { PlayerId } from "@/lib/engine/types";
import { useProgressSync } from "@/lib/auth/progress";
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

const LEVEL_LABELS: Record<Level, string> = {
  tk: "TK",
  sd1: "SD 1",
  sd2: "SD 2"
};

/** How long the hand rests on a box before it counts as a choice. */
const DWELL_MS = 850;

interface Round {
  question: MathQuestion;
  choices: ChoiceSet;
}

/**
 * Math Pilih Jawaban - arithmetic answered by pointing, not by writing.
 *
 * Every other maths game here asks the player to do two things at once: work
 * out the answer, and then form a numeral in mid-air well enough for the
 * recognizer to read it. Those are separate skills, and for the youngest
 * players the second one is by far the harder - which means a child who
 * understands the arithmetic perfectly still fails, and cannot tell which of
 * the two things they got wrong.
 *
 * Here the answer is chosen by resting a hand on one of four boxes. Nothing
 * has to be recognised, so nothing can be misread: a wrong answer is now
 * genuinely a wrong answer, and that makes the feedback worth something. The
 * distractors are the specific mistakes a child makes rather than random
 * numbers (see `buildChoices`), so guessing by elimination does not work
 * either.
 */
export function MathChoiceGame(props: GameModuleProps) {
  const [random] = useState<RandomSource>(() =>
    createRandom(Math.floor(Math.random() * 0x7fffffff) + 1)
  );
  const sequenceRef = useRef(0);
  const timeoutsRef = useRef<Record<PlayerId, number | null>>({
    A: null,
    B: null
  });

  const nextRound = useCallback(
    (player: PlayerId, level: Level): Round => {
      sequenceRef.current += 1;
      const question = createMathQuestion(
        random,
        level,
        undefined,
        `c-${player}-${sequenceRef.current}`
      );
      return { question, choices: buildChoices(random, question, level) };
    },
    [random]
  );

  const [rounds, setRounds] = useState<Record<PlayerId, Round>>(() => ({
    A: (() => {
      const question = createMathQuestion(random, props.playerLevels.A, undefined, "c-A-0");
      return { question, choices: buildChoices(random, question, props.playerLevels.A) };
    })(),
    B: (() => {
      const question = createMathQuestion(random, props.playerLevels.B, undefined, "c-B-0");
      return { question, choices: buildChoices(random, question, props.playerLevels.B) };
    })()
  }));
  const [score, setScore] = useState<Record<PlayerId, number>>({ A: 0, B: 0 });
  const [stars, setStars] = useState<Record<PlayerId, number>>({ A: 0, B: 0 });
  /** The box each player's hand is currently resting on, for highlighting. */
  const [focused, setFocused] = useState<Record<PlayerId, string | null>>({
    A: null,
    B: null
  });
  /** Boxes already ruled out this round, so a wrong pick is not repeated. */
  const [ruledOut, setRuledOut] = useState<Record<PlayerId, number[]>>({
    A: [],
    B: []
  });
  const [locked, setLocked] = useState<Record<PlayerId, boolean>>({
    A: false,
    B: false
  });
  const [feedback, setFeedback] = useState<{
    message: string;
    tone: "neutral" | "good" | "bad";
  }>({
    message: "Arahkan tangan ke kotak jawaban, lalu tahan sebentar.",
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

  const advance = useCallback(
    (player: PlayerId) => {
      const handle = window.setTimeout(() => {
        setRounds((current) => ({
          ...current,
          [player]: nextRound(player, props.playerLevels[player])
        }));
        setRuledOut((current) => ({ ...current, [player]: [] }));
        setLocked((current) => ({ ...current, [player]: false }));
        timeoutsRef.current[player] = null;
      }, 750);
      timeoutsRef.current[player] = handle;
    },
    [nextRound, props.playerLevels]
  );

  const choose = useCallback(
    (player: PlayerId, value: number) => {
      if (!timer.running || locked[player]) return;
      const round = rounds[player];
      if (ruledOut[player].includes(value)) return;

      if (value !== round.question.answer) {
        // No score penalty, and the round stays open. A wrong pick removes
        // that box and the player tries again, which keeps a mistake as a step
        // towards the answer rather than the end of the attempt.
        playTone("wrong");
        setRuledOut((current) => ({
          ...current,
          [player]: [...current[player], value]
        }));
        setFeedback({
          message: `Pemain ${player}: ${value} belum tepat. Coba yang lain.`,
          tone: "bad"
        });
        return;
      }

      setLocked((current) => ({ ...current, [player]: true }));
      playTone("correct");
      speak(`Benar. ${round.question.answer}`);
      // A first-try answer is worth more than one found by elimination.
      const cleanBonus = ruledOut[player].length === 0 ? 40 : 0;
      const timeBonus = timer.timed ? Math.max(0, Math.round(timer.remaining / 2)) : 0;
      setScore((current) => ({
        ...current,
        [player]: current[player] + 100 + cleanBonus + timeBonus
      }));
      setStars((current) => ({
        ...current,
        [player]: Math.min(5, current[player] + 1)
      }));
      setFeedback({
        message: `Pemain ${player} benar: ${round.question.answer}!`,
        tone: "good"
      });
      advance(player);
    },
    [advance, locked, rounds, ruledOut, timer.remaining, timer.running, timer.timed]
  );

  const selectLevel = (player: PlayerId, level: Level) => {
    props.setPlayerLevel(player, level);
    setRounds((current) => ({ ...current, [player]: nextRound(player, level) }));
    setRuledOut((current) => ({ ...current, [player]: [] }));
    setLocked((current) => ({ ...current, [player]: false }));
  };

  /** Air-cursor ids look like `opt-A-7`; the value is the trailing number. */
  const handleAirSelect = (player: PlayerId) => (targetId: string) => {
    const raw = targetId.split("-").pop();
    const value = Number(raw);
    if (Number.isFinite(value)) choose(player, value);
  };

  const renderBoard = (player: PlayerId) => {
    const round = rounds[player];
    const out = ruledOut[player];

    return (
      <div className="choice-column" key={player}>
        <div className="question-card" data-player={player}>
          <div className="level-switch" role="group" aria-label="Tingkat soal">
            {(["tk", "sd1", "sd2"] as Level[]).map((item) => (
              <button
                key={item}
                type="button"
                className={props.playerLevels[player] === item ? "is-active" : ""}
                onClick={() => selectLevel(player, item)}
              >
                {LEVEL_LABELS[item]}
              </button>
            ))}
          </div>
          <small>PILIH JAWABAN</small>
          <strong>{round.question.prompt}</strong>
          <StarRow stars={stars[player]} />
        </div>

        <div className="choice-grid" role="group" aria-label="Pilihan jawaban">
          {round.choices.options.map((value) => {
            const id = `opt-${player}-${value}`;
            const dead = out.includes(value);
            const correct = locked[player] && value === round.question.answer;
            return (
              <button
                key={value}
                type="button"
                className={`choice-box ${dead ? "is-out" : ""} ${
                  correct ? "is-correct" : ""
                } ${focused[player] === id ? "is-focused" : ""}`}
                data-player={player}
                data-air-target={id}
                data-air-disabled={dead || locked[player] ? "true" : undefined}
                disabled={dead || locked[player]}
                onClick={() => choose(player, value)}
              >
                {value}
              </button>
            );
          })}
        </div>

        <span className="choice-hint">
          {props.inputMode === "camera"
            ? "Arahkan tangan ke kotak, tahan sampai lingkarannya penuh"
            : "Klik kotak jawaban"}
        </span>
      </div>
    );
  };

  return (
    <CameraBackdrop inputMode={props.inputMode} vision={props.vision}>
      <GameHud
        title="Math Pilih Jawaban"
        remaining={timer.remaining}
        timed={timer.timed}
        score={score}
        playerCount={props.playerCount}
        paused={timer.paused}
        awayPaused={timer.awayPaused}
        onTogglePause={timer.timed ? timer.toggle : undefined}
      />

      <div
        className={`choice-grid-layout ${
          props.playerCount === 1 ? "is-single" : ""
        }`}
      >
        {renderBoard("A")}
        {props.playerCount === 2 ? renderBoard("B") : null}
      </div>

      {props.inputMode === "camera" ? (
        <>
          <AirCursor
            vision={props.vision}
            player="A"
            enabled={timer.running && !locked.A}
            targetSelector='[data-air-target^="opt-A-"]'
            dwellMs={DWELL_MS}
            label="Tahan untuk memilih"
            onFocusChange={(id) =>
              setFocused((current) =>
                current.A === id ? current : { ...current, A: id }
              )
            }
            onSelect={handleAirSelect("A")}
          />
          {props.playerCount === 2 ? (
            <AirCursor
              vision={props.vision}
              player="B"
              enabled={timer.running && !locked.B}
              targetSelector='[data-air-target^="opt-B-"]'
              dwellMs={DWELL_MS}
              label="Tahan untuk memilih"
              onFocusChange={(id) =>
                setFocused((current) =>
                  current.B === id ? current : { ...current, B: id }
                )
              }
              onSelect={handleAirSelect("B")}
            />
          ) : null}
        </>
      ) : null}

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
