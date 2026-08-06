/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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

export function GameShell({ game }: { game: GameDefinition }) {
  const [playerCount, setPlayerCount] = useState<1 | 2>(game.playerOptions[0] ?? 1);
  const [inputMode, setInputMode] = useState<"camera" | "demo">("camera");
  const [phase, setPhase] = useState<"preflight" | "countdown" | "playing">("preflight");
  const [countdown, setCountdown] = useState<number | "GO">(3);
  const [sessionKey, setSessionKey] = useState(0);
  const countdownStartRef = useRef(0);
  const runtimeMode = playerCount === 2 && game.visionMode === "hand" ? "hybrid" : game.visionMode;
  const runtime = useVisionRuntime({ mode: runtimeMode, playerCount });

  useEffect(() => {
    if (phase !== "countdown") return;
    countdownStartRef.current = performance.now();
    let frame = 0;
    const loop = (now: number) => { const value = countdownValue(countdownStartRef.current, now); if (value === null) { setPhase("playing"); return; } setCountdown(value); frame = requestAnimationFrame(loop); };
    frame = requestAnimationFrame(loop); return () => cancelAnimationFrame(frame);
  }, [phase]);

  const replay = () => {
    setSessionKey((value) => value + 1);
    setCountdown(3);
    setPhase("countdown");
  };
  const moduleProps = {
    game,
    playerCount,
    inputMode,
    snapshot: runtime.snapshot,
    bindVideo: runtime.bindVideo,
    onExit: () => setPhase("preflight"),
    onReplay: replay
  };
  const content = (() => {
    if (game.slug === "math-motion-battle") return <MathMotionGame key={sessionKey} {...moduleProps} />;
    if (game.slug === "number-trace") return <NumberTraceGame key={sessionKey} {...moduleProps} />;
    if (game.slug === "shape-quest") return <ShapeQuestGame key={sessionKey} {...moduleProps} />;
    if (game.slug === "pattern-race") return <PatternRaceGame key={sessionKey} {...moduleProps} />;
    if (game.slug === "math-warung") return <MathWarungGame key={sessionKey} {...moduleProps} />;
    if (game.slug === "iqro-motion") return <IqroMotionGame key={sessionKey} {...moduleProps} />;
    if (game.slug === "airboard-presenter") return <AirBoardGame key={sessionKey} {...moduleProps} />;
    if (game.slug === "dodge-motion") return <DodgeMotionGame key={sessionKey} {...moduleProps} />;
    return <RunToTargetGame key={sessionKey} {...moduleProps} />;
  })();

  if (phase === "preflight") return <main className="game-preflight"><PreflightPanel game={game} playerCount={playerCount} setPlayerCount={setPlayerCount} inputMode={inputMode} setInputMode={setInputMode} status={runtime.status} error={runtime.error} snapshot={runtime.snapshot} bindVideo={runtime.bindVideo} start={runtime.start} stop={runtime.stop} onReady={() => setPhase("countdown")} /></main>;

  return <main className="experience-page" style={{ "--accent": game.accent, "--soft": game.accentSoft } as React.CSSProperties}>
    <header className="experience-header"><Link href="/" className="experience-brand"><img src="/brand/mainlagi-square.png" alt="" /><span><b>Mainlagi TV</b><small>Motion Learning Hub</small></span></Link><div className="experience-title"><GameIcon name={game.icon} size={36} /><strong>{game.title}</strong></div><div className="experience-actions"><ShareButton title={game.title} text={game.description} /><button type="button" onClick={() => setPhase("preflight")}>Kalibrasi ulang</button><Link href="/">Keluar</Link></div></header>
    {phase === "countdown" ? <section className="countdown-screen"><div><span>{countdown}</span><small>{inputMode === "camera" ? "Tetap berada di area kamera" : "Siapkan mouse atau keyboard"}</small></div></section> : content}
  </main>;
}
