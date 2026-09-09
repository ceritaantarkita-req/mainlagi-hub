"use client";

import { useEffect, useRef, useState } from "react";
import { MotionPad } from "@/components/MotionPad";
import { playTone, speak } from "@/lib/audio/feedback";
import { evaluateHijaiyah, HIJAIYAH_TEMPLATES } from "@/lib/engine/hijaiyah";
import type { Stroke } from "@/lib/engine/types";
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

export function IqroMotionGame(props: GameModuleProps) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState({ A: 0, B: 0 });
  const [stars, setStars] = useState(0);
  const [message, setMessage] = useState(
    "Tulis badan huruf dulu. Lepas cubitan, lalu tambahkan titiknya."
  );
  const [tone, setTone] = useState<"neutral" | "good" | "bad">("neutral");
  const nextTimerRef = useRef<number | null>(null);
  const present = usePresence(props.vision, props.inputMode);
  const timer = useRoundTimer(120, {
    mode: props.sessionMode,
    presence: present
  });
  const template = HIJAIYAH_TEMPLATES[index]!;

  useEffect(
    () => () => {
      if (nextTimerRef.current !== null) window.clearTimeout(nextTimerRef.current);
    },
    []
  );

  const speakLetter = () => {
    speak(template.letter, "ar-SA", 0.75);
  };

  const submit = (strokes: Stroke[]) => {
    const result = evaluateHijaiyah(strokes, template);

    if (result.accepted) {
      playTone("correct");
      speak(template.latin);
      setScore((current) => ({ ...current, A: current.A + result.score }));
      setStars((value) => Math.min(5, value + 1));
      setTone("good");
      setMessage(
        result.reason ??
          `${template.latin} (${template.letter}) cocok ${result.score}%.`
      );
      nextTimerRef.current = window.setTimeout(() => {
        setIndex((value) => (value + 1) % HIJAIYAH_TEMPLATES.length);
        setTone("neutral");
      }, 900);
      return;
    }

    playTone("wrong");
    setTone("bad");
    setMessage(result.reason ?? "Coba lagi.");
  };

  const selectLetter = (value: number) => {
    if (nextTimerRef.current !== null) {
      window.clearTimeout(nextTimerRef.current);
      nextTimerRef.current = null;
    }
    setIndex(value);
    setTone("neutral");
    setMessage(HIJAIYAH_TEMPLATES[value]?.note ?? "Ikuti bentuk hurufnya.");
  };

  useProgressSync(props.game.slug, Math.max(score.A, score.B));

  return (
    <CameraBackdrop
      inputMode={props.inputMode}
      vision={props.vision}
    >
      <GameHud
        title="Iqro Motion"
        remaining={timer.remaining}
        timed={timer.timed}
        score={score}
        playerCount={1}
        paused={timer.paused}
        awayPaused={timer.awayPaused}
        onTogglePause={timer.timed ? timer.toggle : undefined}
      />
      <div className="iqro-layout">
        <aside className="iqro-library">
          <small>28 HURUF HIJAIYAH + HAMZAH</small>
          <div>
            {HIJAIYAH_TEMPLATES.map((item, itemIndex) => (
              <button
                key={item.letter}
                type="button"
                className={itemIndex === index ? "is-active" : ""}
                data-air-target={`iqro-${item.latin}`}
                onClick={() => selectLetter(itemIndex)}
              >
                <span>{item.letter}</span>
                <small>{item.latin}</small>
              </button>
            ))}
          </div>
          <p>
            Alat latihan interaktif, bukan pengganti guru mengaji. Bentuk dan
            audio tetap perlu ditinjau pengajar.
          </p>
        </aside>
        <section className="iqro-practice">
          <div className="iqro-target">
            <div>
              <span>{template.letter}</span>
              <small>
                {template.latin} · {template.dots} titik{" "}
                {template.dotZone === "above"
                  ? "di atas"
                  : template.dotZone === "below"
                    ? "di bawah"
                    : ""}
              </small>
              {template.note ? <em>{template.note}</em> : null}
            </div>
            <div className="iqro-target__side">
              <StarRow stars={stars} />
              <button
                type="button"
                data-air-target="iqro-audio"
                onClick={speakLetter}
              >
                Dengar
              </button>
            </div>
          </div>
          <div className="iqro-pad-wrap">
            <div className="iqro-watermark">{template.letter}</div>
            <MotionPad
              vision={props.vision}
              player="A"
              enabled={timer.running}
              target={template.body[0]}
              label={`Latihan ${template.latin}`}
              hint="Cubit = tulis · lepas = angkat pena · buka telapak = nilai"
              onSubmit={submit}
            />
          </div>
        </section>
      </div>
      <FeedbackToast message={message} tone={tone} />
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
