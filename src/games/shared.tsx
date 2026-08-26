/* eslint-disable react-hooks/set-state-in-effect -- timer and presence state
   are driven by the external MediaPipe snapshot stream, which arrives outside
   React's render cycle. */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PlayerId } from "@/lib/engine/types";
import type { GameSlug } from "@/lib/data/games";
import type { VisionRuntime } from "@/lib/vision/types";
import { LeaderboardCapture } from "@/components/LeaderboardCapture";
import { VisionOverlay } from "@/components/VisionOverlay";
import { useOverlayPrefs } from "@/lib/react/useOverlayPrefs";
import type { SessionMode } from "./types";

interface TimerOptions {
  /** In `santai` mode the countdown is disabled entirely. */
  mode?: SessionMode;
  /** Pauses the countdown while nobody is in front of the camera. */
  presence?: boolean;
}

/**
 * Round timer.
 *
 * Two behaviours were added:
 *
 * - In relaxed mode the timer simply never runs, instead of running with a
 *   generous duration. A visible countdown is itself the pressure.
 * - The timer pauses when the player leaves the camera. Previously the clock
 *   kept ticking while a child wandered off to fetch a drink, and they came
 *   back to "waktu habis".
 */
export function useRoundTimer(duration = 60, options: TimerOptions = {}) {
  const { mode = "tantangan", presence = true } = options;
  const timed = mode === "tantangan";
  const [remaining, setRemaining] = useState(duration);
  const [running, setRunning] = useState(timed);
  const [awayPaused, setAwayPaused] = useState(false);
  const deadlineRef = useRef<number | null>(null);

  useEffect(() => {
    if (!timed) return;
    if (presence) {
      if (awayPaused) {
        setAwayPaused(false);
        deadlineRef.current = performance.now() + remaining * 1000;
        setRunning(true);
      }
      return;
    }
    if (running) {
      setAwayPaused(true);
      setRunning(false);
    }
  }, [awayPaused, presence, remaining, running, timed]);

  useEffect(() => {
    if (!timed || !running) return;

    if (deadlineRef.current === null) {
      deadlineRef.current = performance.now() + duration * 1000;
    }

    let frame = 0;
    const loop = () => {
      const deadline = deadlineRef.current;
      if (deadline === null) return;

      const next = Math.max(
        0,
        Math.ceil((deadline - performance.now()) / 1000)
      );
      setRemaining(next);
      if (next <= 0) {
        setRunning(false);
        return;
      }
      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [duration, running, timed]);

  const pause = useCallback(() => setRunning(false), []);
  const resume = useCallback(() => {
    if (!timed || remaining <= 0) return;
    deadlineRef.current = performance.now() + remaining * 1000;
    setRunning(true);
  }, [remaining, timed]);
  const toggle = useCallback(() => {
    if (running) pause();
    else resume();
  }, [pause, resume, running]);
  const addSeconds = useCallback(
    (seconds: number) => {
      if (!timed || seconds <= 0) return;
      if (deadlineRef.current !== null) {
        deadlineRef.current += seconds * 1000;
      }
      setRemaining((value) => value + seconds);
    },
    [timed]
  );

  return {
    /** Play is allowed. In relaxed mode this is always true. */
    running: timed ? running : true,
    remaining: timed ? remaining : Number.POSITIVE_INFINITY,
    timed,
    paused: timed && !running && remaining > 0,
    awayPaused,
    ended: timed && remaining <= 0,
    pause,
    resume,
    toggle,
    addSeconds
  };
}

/**
 * True while at least one player is visible to the camera.
 *
 * Reads the runtime's low-frequency summary rather than recomputing from every
 * frame: presence only needs to be right within a second, and computing it from
 * the frame stream meant a state update per frame.
 */
export function usePresence(
  vision: VisionRuntime,
  inputMode: "camera" | "demo"
): boolean {
  return inputMode === "demo" || vision.summary.present;
}

/**
 * Rangka (skeleton) and wajah (face mesh) on/off. The overlay is a lot of
 * moving line-work over the player's own picture, and that is exactly right
 * for some households and distracting for others - a parent lining up a
 * five-year-old's hand may just want to see the hand, not thirty more lines
 * drawn on top of it.
 *
 * The switch lives in "Mode orang tua" on the pre-game screen (see
 * `PreflightPanel`), not floating over the gameplay itself: every full-width
 * strip of the play screen is already spoken for (the HUD across the top,
 * the feedback toast across the entire bottom edge), so there is no corner a
 * floating button could sit in without covering something a child needs to
 * tap. The choice still applies on the play screen, through the same
 * persisted preference (see {@link useOverlayPrefs}) - it is just set once,
 * before the round starts, rather than fought over mid-game.
 */
export function CameraBackdrop({
  inputMode,
  vision,
  children,
  showSkeleton = true,
  showFace = true
}: {
  inputMode: "camera" | "demo";
  vision: VisionRuntime;
  children: React.ReactNode;
  showSkeleton?: boolean;
  showFace?: boolean;
}) {
  const { prefs } = useOverlayPrefs();

  return (
    <section className={`camera-stage ${inputMode === "demo" ? "is-demo" : ""}`}>
      {inputMode === "camera" ? (
        <>
          {/* eslint-disable react-hooks/refs -- `vision` is a plain object of
          stable callbacks. The React compiler classifies it as ref-derived
          because useVisionRuntime builds it around refs, but nothing here
          reads a `.current` value during render. */}
          <video ref={vision.bindVideo} muted playsInline autoPlay />
          <VisionOverlay
            vision={vision}
            showSkeleton={showSkeleton && prefs.skeleton}
            showFace={showFace && prefs.face}
          />
        </>
      ) : (
        <div className="demo-stage-grid" />
      )}
      {children}
    </section>
  );
}

export function GameHud({
  title,
  remaining,
  timed,
  score,
  playerCount,
  paused = false,
  awayPaused = false,
  onTogglePause
}: {
  title: string;
  remaining: number;
  timed?: boolean;
  score: Record<PlayerId, number>;
  playerCount: 1 | 2;
  paused?: boolean;
  awayPaused?: boolean;
  onTogglePause?: () => void;
}) {
  const clock = timed === false ? "∞" : String(remaining);

  return (
    <div className="game-hud">
      <div className="hud-score">
        <small>PEMAIN A</small>
        <strong>{score.A}</strong>
      </div>
      <div className="hud-center">
        <span>{title}</span>
        <b className={timed !== false && remaining <= 10 ? "is-warning" : ""}>
          {clock}
        </b>
        {awayPaused ? <em className="hud-away">Menunggu pemain…</em> : null}
      </div>
      {playerCount === 2 ? (
        <div className="hud-score is-b">
          <small>PEMAIN B</small>
          <strong>{score.B}</strong>
        </div>
      ) : (
        <button
          className="hud-pause"
          type="button"
          data-air-target="hud-pause"
          onClick={onTogglePause}
          disabled={!onTogglePause}
        >
          {paused ? "Lanjut" : "Jeda"}
        </button>
      )}
    </div>
  );
}

export function FeedbackToast({
  message,
  tone = "neutral"
}: {
  message: string;
  tone?: "neutral" | "good" | "bad";
}) {
  return (
    <div className={`feedback-toast is-${tone}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}

/**
 * Star progress. Replaces the numeric penalty system: children respond to
 * collecting things far better than to a score going down.
 */
export function StarRow({ stars, max = 5 }: { stars: number; max?: number }) {
  const items = useMemo(
    () => Array.from({ length: max }, (_, index) => index < stars),
    [max, stars]
  );
  return (
    <div className="star-row" aria-label={`${stars} dari ${max} bintang`}>
      {items.map((filled, index) => (
        <span key={index} className={filled ? "is-filled" : ""} aria-hidden>
          ★
        </span>
      ))}
    </div>
  );
}

export function RoundEndOverlay({
  title = "Waktu habis",
  score,
  playerCount,
  onReplay,
  onCalibration,
  game,
  durationSeconds
}: {
  title?: string;
  score: Record<PlayerId, number>;
  playerCount: 1 | 2;
  onReplay(): void;
  onCalibration(): void;
  /** When given, the round is offered to that game's leaderboard. */
  game?: GameSlug;
  durationSeconds?: number;
}) {
  const winner =
    playerCount === 1
      ? null
      : score.A === score.B
        ? "Seri"
        : score.A > score.B
          ? "Pemain A menang"
          : "Pemain B menang";

  return (
    <div
      className="round-end-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <section className="round-end-card">
        <span className="round-end-mark">✓</span>
        <h2>{title}</h2>
        {winner ? (
          <p>{winner}</p>
        ) : (
          <p>Ronde selesai. Simpan skor terbaik dan coba lagi.</p>
        )}
        <div
          className={`round-end-scores ${playerCount === 1 ? "is-single" : ""}`}
        >
          <div>
            <small>PEMAIN A</small>
            <strong>{score.A}</strong>
          </div>
          {playerCount === 2 ? (
            <div>
              <small>PEMAIN B</small>
              <strong>{score.B}</strong>
            </div>
          ) : null}
        </div>
        {game ? (
          <LeaderboardCapture
            game={game}
            /* Two players share one board: the round's best score is the one
               worth recording, and a head-to-head win is already shown above. */
            score={playerCount === 2 ? Math.max(score.A, score.B) : score.A}
            durationSeconds={durationSeconds}
          />
        ) : null}
        <div className="round-end-actions">
          <button
            className="button button--primary"
            type="button"
            data-air-target="round-replay"
            onClick={onReplay}
          >
            Main lagi
          </button>
          <button
            className="button button--ghost"
            type="button"
            data-air-target="round-calibrate"
            onClick={onCalibration}
          >
            Kalibrasi ulang
          </button>
        </div>
      </section>
    </div>
  );
}
