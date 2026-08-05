"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChallengeDeck } from "@/engine/challenges";
import { scorePathAgainstTarget } from "@/engine/geometry";
import { recordResult, sanitizeProgress, DEFAULT_PROGRESS } from "@/engine/progress";
import { createRandom, createRuntimeSeed } from "@/engine/random";
import { GAME_REGISTRY } from "@/engine/registry";
import { createSession, digitsToNumber, expectedDigitCount, reduceSession } from "@/engine/session";
import type { GameId, GameSession, LevelId, PlayerId, Point, RecognitionResult } from "@/engine/types";
import { useMotionCapture } from "@/hooks/useMotionCapture";
import { MotionCanvas } from "./MotionCanvas";

const STORAGE_KEY = "motion-learning-hub-progress-v1";
const ROUND_DURATION_SECONDS = 60;
const INITIAL_SEED = 0x4d4c4801;

type InputMode = "camera" | "pointer";

export function GameClient({ gameId }: { gameId: GameId }) {
  const game = GAME_REGISTRY[gameId];
  const [level, setLevel] = useState<LevelId>("kindergarten");
  const [inputMode, setInputMode] = useState<InputMode>("camera");
  const [session, setSession] = useState<GameSession>(() =>
    createSession(gameId, "kindergarten", ROUND_DURATION_SECONDS, INITIAL_SEED)
  );
  const sessionRef = useRef(session);
  const seedRef = useRef(INITIAL_SEED);
  const deckRef = useRef(new ChallengeDeck(gameId, "kindergarten", createRandom(INITIAL_SEED)));
  const answeredRef = useRef<Set<PlayerId>>(new Set());
  const advanceTimerRef = useRef<number | null>(null);
  const recordedResultSeedRef = useRef<number | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [roundMessage, setRoundMessage] = useState("Siap bergerak?");
  const [traceScores, setTraceScores] = useState<Record<PlayerId, number | null>>({ A: null, B: null });

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => () => {
    if (advanceTimerRef.current !== null) window.clearTimeout(advanceTimerRef.current);
  }, []);

  const dispatch = useCallback((event: Parameters<typeof reduceSession>[1]) => {
    setSession((current) => {
      const next = reduceSession(current, event);
      sessionRef.current = next;
      return next;
    });
  }, []);

  const nextSeed = useCallback(() => {
    const seed = createRuntimeSeed(seedRef.current);
    seedRef.current = seed;
    return seed;
  }, []);

  const resetDeck = useCallback((nextLevel: LevelId, seed: number) => {
    deckRef.current = new ChallengeDeck(gameId, nextLevel, createRandom(seed));
  }, [gameId]);

  const advanceChallenge = useCallback(() => {
    if (sessionRef.current.phase !== "playing") return;
    answeredRef.current.clear();
    setTraceScores({ A: null, B: null });
    dispatch({ type: "SET_CHALLENGE", challenge: deckRef.current.next() });
    setRoundMessage("Soal berikutnya!");
  }, [dispatch]);

  const scheduleAdvance = useCallback((delay = 850) => {
    if (advanceTimerRef.current !== null) return;
    advanceTimerRef.current = window.setTimeout(() => {
      advanceTimerRef.current = null;
      advanceChallenge();
    }, delay);
  }, [advanceChallenge]);

  const processDigit = useCallback((player: PlayerId, result: RecognitionResult<number>) => {
    const current = sessionRef.current;
    if (current.phase !== "playing" || answeredRef.current.has(player)) return;
    if (current.currentChallenge?.kind !== "math" && current.currentChallenge?.kind !== "pattern") return;
    if (!result.accepted || result.value === null) {
      dispatch({ type: "RETRY", player });
      setRoundMessage(result.reason ?? "Coba tulis ulang");
      return;
    }

    const digits = [...current.players[player].digits, result.value];
    dispatch({ type: "DIGIT", player, digit: result.value });
    if (digits.length < expectedDigitCount(current.currentChallenge)) {
      setRoundMessage(`Digit ${result.value} terbaca. Lanjutkan digit berikutnya.`);
      return;
    }

    const answer = digitsToNumber(digits);
    if (answer === current.currentChallenge.answer) {
      const first = answeredRef.current.size === 0;
      answeredRef.current.add(player);
      dispatch({ type: "CORRECT", player, speedBonus: first ? 25 : 0 });
      setRoundMessage(first ? `Player ${player} paling cepat!` : `Player ${player} benar!`);
      scheduleAdvance(first ? 950 : 600);
    } else {
      dispatch({ type: "WRONG", player });
      setRoundMessage(`Jawaban Player ${player} belum tepat. Coba lagi!`);
    }
  }, [dispatch, scheduleAdvance]);

  const processTrace = useCallback((player: PlayerId, points: Point[]) => {
    const current = sessionRef.current;
    const challenge = current.currentChallenge;
    if (
      current.phase !== "playing" ||
      answeredRef.current.has(player) ||
      !challenge ||
      (challenge.kind !== "trace" && challenge.kind !== "shape")
    ) return;

    const score = scorePathAgainstTarget(points, challenge.target);
    setTraceScores((existing) => ({ ...existing, [player]: score }));
    if (score >= 62) {
      answeredRef.current.add(player);
      dispatch({ type: "CORRECT", player, speedBonus: Math.round(score / 5) });
      setRoundMessage(`${score}% — Hebat!`);
      scheduleAdvance(850);
    } else {
      dispatch({ type: "RETRY", player });
      setRoundMessage(`${score}% — Ikuti jalur lebih dekat.`);
    }
  }, [dispatch, scheduleAdvance]);

  const handleMotionClear = useCallback((player: PlayerId) => {
    dispatch({ type: "CLEAR_DIGITS", player });
  }, [dispatch]);

  const {
    videoRef,
    players: motionPlayers,
    status: motionStatus,
    error: motionError,
    readiness,
    start: startMotion,
    stop: stopMotion,
    clearPlayer,
    submitPointerPath
  } = useMotionCapture({
    cameraEnabled: inputMode === "camera",
    captureEnabled: session.phase === "playing",
    singlePlayer: game.players === "1 pemain",
    onDigit: processDigit,
    onTrace: processTrace,
    onClear: handleMotionClear
  });

  useEffect(() => {
    if (session.phase === "device-check" && inputMode === "camera" && motionStatus === "idle") {
      void startMotion();
    }
  }, [inputMode, motionStatus, session.phase, startMotion]);

  useEffect(() => {
    // The model being loaded is not the same as the player being tracked. This
    // used to fire on motionStatus alone, so the first question appeared while
    // nobody had been detected yet and nothing the player wrote registered.
    if (
      session.phase === "device-check" &&
      inputMode === "camera" &&
      motionStatus === "ready" &&
      readiness.canStart
    ) {
      dispatch({ type: "READY" });
    }
  }, [dispatch, inputMode, motionStatus, readiness.canStart, session.phase]);

  useEffect(() => {
    if (session.phase !== "countdown") return;
    let value = 3;
    const timer = window.setInterval(() => {
      value -= 1;
      setCountdown(value);
      if (value <= 0) {
        window.clearInterval(timer);
        dispatch({ type: "START", challenge: deckRef.current.next() });
        setRoundMessage("Mulai!");
      }
    }, 800);
    return () => window.clearInterval(timer);
  }, [dispatch, session.phase]);

  useEffect(() => {
    if (session.phase !== "playing") return;
    const timer = window.setInterval(() => dispatch({ type: "TICK" }), 1_000);
    return () => window.clearInterval(timer);
  }, [dispatch, session.phase]);

  useEffect(() => {
    if (session.phase === "playing") return;
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  }, [session.phase]);

  useEffect(() => {
    if (session.phase !== "time-up") return;
    const timer = window.setTimeout(() => dispatch({ type: "RESULT" }), 900);
    return () => window.clearTimeout(timer);
  }, [dispatch, session.phase]);

  useEffect(() => {
    if (session.phase !== "result" || recordedResultSeedRef.current === session.seed) return;
    recordedResultSeedRef.current = session.seed;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const progress = raw ? sanitizeProgress(JSON.parse(raw)) : DEFAULT_PROGRESS;
      const bestRoundScore = Math.max(session.players.A.score, session.players.B.score);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(recordResult(progress, gameId, bestRoundScore)));
    } catch {
      // Local progress is optional; gameplay continues when storage is blocked.
    }
  }, [gameId, session.phase, session.players.A.score, session.players.B.score, session.seed]);

  const challenge = session.currentChallenge;
  const expectedDigits = challenge ? expectedDigitCount(challenge) : 1;
  const singlePlayer = game.players === "1 pemain";
  const target = challenge && (challenge.kind === "trace" || challenge.kind === "shape") ? challenge.target : undefined;
  const prompt = challenge?.prompt ?? (session.phase === "device-check" ? "Menyiapkan kamera…" : "Pilih mode lalu mulai");
  const isLiveArena = ["ready", "countdown", "playing", "paused", "time-up", "result"].includes(session.phase);

  const startSetup = (mode: InputMode) => {
    const seed = nextSeed();
    resetDeck(level, seed);
    let fresh = createSession(gameId, level, ROUND_DURATION_SECONDS, seed);
    fresh = reduceSession(fresh, { type: "DEVICE_CHECK" });
    if (mode === "pointer") fresh = reduceSession(fresh, { type: "READY" });
    sessionRef.current = fresh;
    setInputMode(mode);
    setSession(fresh);
    answeredRef.current.clear();
    setTraceScores({ A: null, B: null });
    setRoundMessage(mode === "camera" ? "Menyiapkan kamera…" : "Mode demo siap");
  };

  const switchToPointerMode = () => {
    stopMotion();
    setInputMode("pointer");
    dispatch({ type: "READY" });
  };

  const beginCountdown = () => {
    setCountdown(3);
    answeredRef.current.clear();
    setTraceScores({ A: null, B: null });
    dispatch({ type: "COUNTDOWN" });
  };

  const changeLevel = (nextLevel: LevelId) => {
    const seed = nextSeed();
    setLevel(nextLevel);
    resetDeck(nextLevel, seed);
    const fresh = createSession(gameId, nextLevel, ROUND_DURATION_SECONDS, seed);
    sessionRef.current = fresh;
    setSession(fresh);
    answeredRef.current.clear();
    setTraceScores({ A: null, B: null });
    setRoundMessage("Siap bergerak?");
  };

  const playAgain = () => {
    const seed = nextSeed();
    resetDeck(level, seed);
    let fresh = createSession(gameId, level, ROUND_DURATION_SECONDS, seed);
    fresh = reduceSession(fresh, { type: "DEVICE_CHECK" });
    fresh = reduceSession(fresh, { type: "READY" });
    fresh = reduceSession(fresh, { type: "COUNTDOWN" });
    sessionRef.current = fresh;
    setSession(fresh);
    setCountdown(3);
    answeredRef.current.clear();
    setRoundMessage("Ronde baru!");
    setTraceScores({ A: null, B: null });
  };

  if (session.phase === "setup") {
    return (
      <main className="setup-page">
        <Link href="/" className="back-link">← Kembali ke hub</Link>
        <section className="setup-card">
          <div className={`setup-icon setup-icon--${game.color}`}>🤸</div>
          <h1>{game.title}</h1>
          <p>{game.description}</p>
          <div className="level-picker" role="group" aria-label="Pilih level">
            {([
              ["kindergarten", "Kindergarten"],
              ["grade-1", "SD Kelas 1"],
              ["grade-2", "SD Kelas 2"]
            ] as Array<[LevelId, string]>).map(([value, label]) => (
              <button key={value} type="button" className={level === value ? "is-selected" : ""} onClick={() => changeLevel(value)}>
                {label}
              </button>
            ))}
          </div>
          <div className="setup-info">
            <span>⏱ 60 detik</span><span>👥 {game.players}</span><span>🔒 Tanpa rekaman</span>
          </div>
          <button type="button" className="primary-button wide" onClick={() => startSetup("camera")}>
            Aktifkan kamera
          </button>
          <button type="button" className="secondary-button wide" onClick={() => startSetup("pointer")}>
            Mode demo mouse / touch
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="game-page">
      <header className="game-header">
        <Link href="/" className="brand compact"><span className="brand-mark">🤸</span><span><b>MOTION</b><small>LEARNING HUB</small></span></Link>
        <h1>{game.title}</h1>
        <div className="game-header__actions">
          <button
            type="button"
            disabled={session.phase !== "playing" && session.phase !== "paused"}
            aria-label={session.phase === "paused" ? "Lanjutkan game" : "Jeda game"}
            onClick={() => dispatch({ type: session.phase === "paused" ? "RESUME" : "PAUSE" })}
          >
            {session.phase === "paused" ? "▶" : "Ⅱ"}
          </button>
          <Link href="/">Keluar</Link>
        </div>
      </header>

      <section className="arena">
        {inputMode === "camera" ? (
          <>
            <video ref={videoRef} className="camera-video" muted playsInline autoPlay aria-label="Preview kamera pemain" />
            {!readiness.canStart ? (
              <div className="readiness-banner" role="status" aria-live="polite">
                <span className="readiness-dot" />
                <strong>{readiness.message}</strong>
                <span className="readiness-count">
                  {readiness.handsSeen}/{game.players === "1 pemain" ? 1 : 2} tangan
                </span>
                <span className="readiness-bar">
                  <i style={{ width: `${Math.round(readiness.progress * 100)}%` }} />
                </span>
              </div>
            ) : null}
          </>
        ) : (
          <div className="demo-background"><span>Mode demo mouse / touch</span></div>
        )}
        <div className="arena-shade" />

        <div className="top-hud">
          <div className="score-card score-card--blue"><span>PLAYER A</span><strong>{session.players.A.score}</strong></div>
          <div className={session.remainingSeconds <= 10 ? "timer-card is-warning" : "timer-card"}>
            <small>WAKTU</small><strong>{session.remainingSeconds}</strong><span>DETIK</span>
          </div>
          {!singlePlayer && <div className="score-card score-card--pink"><span>PLAYER B</span><strong>{session.players.B.score}</strong></div>}
        </div>

        <div className="question-box"><small>SOAL #{session.challengeIndex || 1}</small><strong>{prompt}</strong><span>{roundMessage}</span></div>

        <div className={singlePlayer ? "canvas-grid is-single" : "canvas-grid"}>
          <MotionCanvas
            player="A"
            label="PLAYER A"
            accent="blue"
            points={motionPlayers.A.points}
            target={target}
            message={traceScores.A !== null ? `Nilai lintasan ${traceScores.A}%` : motionPlayers.A.message}
            digits={session.players.A.digits}
            expectedDigits={expectedDigits}
            inputEnabled={inputMode === "pointer" && session.phase === "playing"}
            onPointerPath={submitPointerPath}
            onClear={clearPlayer}
          />
          {!singlePlayer && (
            <MotionCanvas
              player="B"
              label="PLAYER B"
              accent="pink"
              points={motionPlayers.B.points}
              target={target}
              message={traceScores.B !== null ? `Nilai lintasan ${traceScores.B}%` : motionPlayers.B.message}
              digits={session.players.B.digits}
              expectedDigits={expectedDigits}
              inputEnabled={inputMode === "pointer" && session.phase === "playing"}
              onPointerPath={submitPointerPath}
              onClear={clearPlayer}
            />
          )}
        </div>

        {session.phase === "device-check" && (
          <div className="overlay-card" role="status" aria-live="polite">
            {motionStatus === "error" ? (
              <>
                <h2>Kamera belum siap</h2>
                <p>{motionError ?? "Periksa izin kamera, koneksi model, dan browser yang digunakan."}</p>
                <div className="result-actions">
                  <button type="button" className="primary-button" onClick={() => void startMotion()}>Coba kamera lagi</button>
                  <button type="button" className="secondary-button" onClick={switchToPointerMode}>Pakai mode demo</button>
                </div>
              </>
            ) : (
              <>
                <h2>Menyiapkan kamera…</h2>
                <p>Izinkan akses kamera. Model gerakan diproses langsung di perangkat.</p>
              </>
            )}
          </div>
        )}
        {session.phase === "ready" && (
          <div className="overlay-card">
            <h2>Siap bermain?</h2>
            <p>{inputMode === "camera" ? "Pastikan tangan terlihat di area masing-masing." : "Gambar dengan mouse atau sentuhan di canvas."}</p>
            <button type="button" className="primary-button" onClick={beginCountdown}>Mulai countdown</button>
          </div>
        )}
        {session.phase === "countdown" && <div className="countdown-overlay"><span>{countdown || "GO!"}</span></div>}
        {session.phase === "paused" && <div className="overlay-card"><h2>Game dijeda</h2><button type="button" className="primary-button" onClick={() => dispatch({ type: "RESUME" })}>Lanjutkan</button></div>}
        {session.phase === "time-up" && <div className="countdown-overlay time-up"><span>WAKTU HABIS!</span></div>}
        {session.phase === "result" && (
          <div className="result-overlay">
            <section className="result-card result-card--overlay">
              <div className="trophy">🏆</div>
              <h1>{singlePlayer ? "Ronde selesai!" : session.winner === "draw" ? "Seri!" : `Player ${session.winner} menang!`}</h1>
              <div className={singlePlayer ? "result-grid is-single" : "result-grid"}>
                {(["A", ...(singlePlayer ? [] : ["B"])] as PlayerId[]).map((player) => (
                  <article key={player}>
                    <span>Player {player}</span>
                    <strong>{session.players[player].score}</strong>
                    <small>✓ {session.players[player].correct} benar · ↻ {session.players[player].retries} retry</small>
                  </article>
                ))}
              </div>
              <div className="result-actions">
                <button className="primary-button" type="button" onClick={playAgain}>Main lagi</button>
                <Link className="secondary-button" href="/">Pilih game lain</Link>
              </div>
            </section>
          </div>
        )}
      </section>
      {isLiveArena && <div className="game-tip">☝️ Telunjuk untuk menulis · 🖐️ Tahan telapak terbuka untuk menghapus · Garis tengah adalah zona netral</div>}
    </main>
  );
}
