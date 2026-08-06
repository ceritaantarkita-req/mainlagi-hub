/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GameDefinition } from "@/lib/data/games";
import { countdownValue } from "@/lib/engine/countdown";
import { useVisionRuntime } from "@/lib/vision/useVisionRuntime";
import { GameIcon } from "./GameIcon";
import { PreflightPanel } from "./PreflightPanel";
import { ShareButton } from "./ShareButton";
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
  const [phase, setPhase] = useState<GamePhase>("preflight");
  const [countdown, setCountdown] = useState<number | "GO">(3);
  const [sessionKey, setSessionKey] = useState(0);
  const countdownStartRef = useRef(0);
  const runtimeMode =
    playerCount === 2 && game.visionMode === "hand"
      ? "hybrid"
      : game.visionMode;
  const runtime = useVisionRuntime({ mode: runtimeMode, playerCount });

  const startCountdown = useCallback(() => {
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
          status={runtime.status}
          error={runtime.error}
          snapshot={runtime.snapshot}
          bindVideo={runtime.bindVideo}
          start={runtime.start}
          stop={runtime.stop}
          onReady={startCountdown}
        />
      </main>
    );
  }

  const moduleProps = {
    game,
    playerCount,
    inputMode,
    snapshot: runtime.snapshot,
    bindVideo: runtime.bindVideo,
    onExit: returnToPreflight,
    onReplay: replay
  };

  const renderGame = () => {
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
            <b>Mainlagi TV</b>
            <small>Motion Learning Hub</small>
          </span>
        </Link>
        <div className="experience-title">
          <GameIcon name={game.icon} size={36} />
          <strong>{game.title}</strong>
        </div>
        <div className="experience-actions">
          <ShareButton title={game.title} text={game.description} />
          <button type="button" onClick={returnToPreflight}>
            Kalibrasi ulang
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
