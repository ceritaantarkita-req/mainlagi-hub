/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GameDefinition } from "@/lib/data/games";
import { unlockAudio } from "@/lib/audio/feedback";
import { countdownValue } from "@/lib/engine/countdown";
import type { Level } from "@/lib/engine/math";
import type { PlayerId } from "@/lib/engine/types";
import { useVisionRuntime } from "@/lib/vision/useVisionRuntime";
import { GameIcon } from "./GameIcon";
import { OverlayToggle } from "./OverlayToggle";
import { PreflightPanel } from "./PreflightPanel";
import { ShareButton } from "./ShareButton";
import type { SessionMode } from "@/games/types";
import { MathChoiceGame } from "@/games/MathChoiceGame";
import { MathMotionGame } from "@/games/MathMotionGame";
import { NumberTraceGame } from "@/games/NumberTraceGame";
import { ShapeQuestGame } from "@/games/ShapeQuestGame";
import { PatternRaceGame } from "@/games/PatternRaceGame";
import { MathWarungGame } from "@/games/MathWarungGame";
import { IqroMotionGame } from "@/games/IqroMotionGame";
import { AirBoardGame } from "@/games/AirBoardGame";
import { DodgeMotionGame } from "@/games/DodgeMotionGame";
import { RunToTargetGame } from "@/games/RunToTargetGame";

type GamePhase = "preflight" | "countdown" | "playing";

export function GameShell({ game }: { game: GameDefinition }) {
  const [playerCount, setPlayerCount] = useState<1 | 2>(
    game.playerOptions[0] ?? 1
  );
  const [inputMode, setInputMode] = useState<"camera" | "demo">("camera");
  const [sessionMode, setSessionMode] = useState<SessionMode>("santai");
  /**
   * Difficulty is per player. In a parent-and-child session the two people at
   * the camera are years apart; one shared level guarantees one of them is
   * bored and the other overwhelmed.
   */
  const [playerLevels, setPlayerLevels] = useState<Record<PlayerId, Level>>({
    A: "tk",
    B: "sd2"
  });
  const [phase, setPhase] = useState<GamePhase>("preflight");
  const [countdown, setCountdown] = useState<number | "GO">(3);
  const [sessionKey, setSessionKey] = useState(0);
  const countdownStartRef = useRef(0);
  const runtimeMode =
    playerCount === 2 && game.visionMode === "hand"
      ? "hybrid"
      : game.visionMode;
  /**
   * Face mesh is enabled for the writing games, where it powers the
   * mouth-open submit shortcut, distance guidance and away-detection. Body
   * games skip it to keep the frame budget for pose tracking.
   */
  const useFace = game.visionMode !== "pose";
  const runtime = useVisionRuntime({
    mode: runtimeMode,
    playerCount,
    face: useFace
  });

  const setPlayerLevel = useCallback((player: PlayerId, level: Level) => {
    setPlayerLevels((current) =>
      current[player] === level ? current : { ...current, [player]: level }
    );
  }, []);

  const startCountdown = useCallback(() => {
    unlockAudio();
    setCountdown(3);
    setPhase("countdown");
  }, []);

  const returnToPreflight = useCallback(() => {
    setPhase("preflight");
  }, []);

  const replay = useCallback(() => {
    setSessionKey((value) => value + 1);
    setCountdown(3);
    setPhase("countdown");
  }, []);

  useEffect(() => {
    if (phase !== "countdown") return;

    countdownStartRef.current = performance.now();
    let frame = 0;
    const loop = (now: number) => {
      const value = countdownValue(countdownStartRef.current, now);
      if (value === null) {
        setPhase("playing");
        return;
      }
      setCountdown((current) => (current === value ? current : value));
      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  if (phase === "preflight") {
    return (
      <main className="game-preflight">
        <PreflightPanel
          game={game}
          playerCount={playerCount}
          setPlayerCount={setPlayerCount}
          inputMode={inputMode}
          setInputMode={setInputMode}
          sessionMode={sessionMode}
          setSessionMode={setSessionMode}
          vision={runtime}
          onReady={startCountdown}
        />
      </main>
    );
  }

  const moduleProps = {
    game,
    playerCount,
    inputMode,
    sessionMode,
    playerLevels,
    setPlayerLevel,
    vision: runtime,
    onExit: returnToPreflight,
    onReplay: replay
  };

  const renderGame = () => {
    if (game.slug === "math-choice") {
      return <MathChoiceGame key={sessionKey} {...moduleProps} />;
    }
    if (game.slug === "math-motion-battle") {
      return <MathMotionGame key={sessionKey} {...moduleProps} />;
    }
    if (game.slug === "number-trace") {
      return <NumberTraceGame key={sessionKey} {...moduleProps} />;
    }
    if (game.slug === "shape-quest") {
      return <ShapeQuestGame key={sessionKey} {...moduleProps} />;
    }
    if (game.slug === "pattern-race") {
      return <PatternRaceGame key={sessionKey} {...moduleProps} />;
    }
    if (game.slug === "math-warung") {
      return <MathWarungGame key={sessionKey} {...moduleProps} />;
    }
    if (game.slug === "iqro-motion") {
      return <IqroMotionGame key={sessionKey} {...moduleProps} />;
    }
    if (game.slug === "airboard-presenter") {
      return <AirBoardGame key={sessionKey} {...moduleProps} />;
    }
    if (game.slug === "dodge-motion") {
      return <DodgeMotionGame key={sessionKey} {...moduleProps} />;
    }
    return <RunToTargetGame key={sessionKey} {...moduleProps} />;
  };

  return (
    <main
      className="experience-page"
      style={
        {
          "--accent": game.accent,
          "--soft": game.accentSoft
        } as React.CSSProperties
      }
    >
      <header className="experience-header">
        <Link href="/" className="experience-brand" aria-label="Beranda">
          <img src="/brand/mainlagi-square.png" alt="" />
          <span>
            <b>Mainlagi Hub</b>
            <small>Motion Learning Hub</small>
          </span>
        </Link>
        <div className="experience-title">
          <GameIcon name={game.icon} size={32} />
          <strong>{game.title}</strong>
        </div>
        <div className="experience-actions">
          {inputMode === "camera" ? <OverlayToggle /> : null}
          <ShareButton title={game.title} text={game.description} />
          <button
            type="button"
            aria-label="Kalibrasi ulang"
            onClick={returnToPreflight}
          >
            <span className="experience-recal-label">Kalibrasi ulang</span>
            <span className="experience-recal-icon" aria-hidden>
              ⟳
            </span>
          </button>
          <Link href="/" aria-label="Keluar dari permainan">
            <span className="experience-exit-label">Keluar</span>
            <span className="experience-exit-icon" aria-hidden>
              ×
            </span>
          </Link>
        </div>
      </header>

      {phase === "countdown" ? (
        <section className="countdown-screen">
          <div>
            <span>{countdown}</span>
            <small>
              {inputMode === "camera"
                ? "Tetap berada di area kamera"
                : "Siapkan mouse atau keyboard"}
            </small>
          </div>
        </section>
      ) : (
        renderGame()
      )}
    </main>
  );
}
