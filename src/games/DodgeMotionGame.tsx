"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GameModuleProps } from "./types";
import {
  CameraBackdrop,
  FeedbackToast,
  RoundEndOverlay,
  usePresence,
  useRoundTimer
} from "./shared";
import { useProgressSync } from "@/lib/auth/progress";
import { useVisionFrame } from "@/lib/vision/useVisionSelector";
import { laneFor, normalisePosition, type Lane } from "@/lib/engine/lanes";

/**
 * Beat Motion - step into the arrow, do not run away from it.
 *
 * This started life as a dodging game, and dodging turned out to be the wrong
 * verb. Avoiding things rewards standing still and shrinking; the child who
 * played it best was the child who moved least, which is a strange lesson for
 * a game whose entire point is getting a five-year-old off the sofa. Catching
 * things inverts that: the only way to score is to actually go where the arrow
 * is, over and over, faster and faster.
 *
 * Vertical dodges (jump, crouch) are gone too. They needed a calibrated body
 * baseline to detect at all, they fired late when they fired, and half the
 * time a small jump in a small living room simply did not register. Three
 * lanes on the floor need no calibration and no thresholds worth arguing
 * about: you are standing left, middle, or right, and the camera can see which.
 */

interface Target {
  id: number;
  lane: Lane;
  spawnAt: number;
}

/** Time from spawning at the top to reaching the hit line. */
const TRAVEL_MS = 2300;
/** Spawn cadence at the start of a round, and the fastest it ever gets. */
const SPAWN_START_MS = 950;
const SPAWN_FLOOR_MS = 520;
/** How quickly the cadence tightens, per second of play. */
const SPAWN_RAMP_PER_SECOND = 4.2;
/**
 * A hit still counts if the player was in the lane within this window. Frame
 * -perfect timing is not a reasonable thing to ask of a small child, and
 * without this the game reads as broken rather than hard.
 */
const HIT_GRACE_MS = 260;
/** Targets are cleaned up shortly after crossing the line. */
const DESPAWN_PROGRESS = 1.3;
const BASE_POINTS = 100;
const MAX_MULTIPLIER = 5;

const DURATION_PRESETS = [
  { label: "1 menit", seconds: 60 },
  { label: "3 menit", seconds: 180 },
  { label: "5 menit", seconds: 300 }
];

function ArrowMark({ lane }: { lane: Lane }) {
  // Drawn rather than typed: a glyph like "←" renders at wildly different
  // weights across devices, and this needs to be readable from across a room.
  const rotation = lane === -1 ? 180 : lane === 1 ? 0 : -90;
  return (
    <svg viewBox="0 0 100 100" aria-hidden focusable="false">
      <g transform={`rotate(${rotation} 50 50)`}>
        <path
          d="M12 40 H58 V18 L92 50 L58 82 V60 H12 Z"
          fill="currentColor"
          stroke="rgba(6,16,34,.55)"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

const LANE_NAME: Record<Lane, string> = {
  [-1]: "KIRI",
  0: "TENGAH",
  1: "KANAN"
};

export function DodgeMotionGame(props: GameModuleProps) {
  const [durationSeconds, setDurationSeconds] = useState(60);
  const [customMinutes, setCustomMinutes] = useState("2");
  const [roundNonce, setRoundNonce] = useState(0);

  const applyDuration = (seconds: number) => {
    setDurationSeconds(seconds);
    setRoundNonce((value) => value + 1);
  };

  return (
    <>
      <BeatRound
        key={`${durationSeconds}-${roundNonce}`}
        {...props}
        durationSeconds={durationSeconds}
      />
      <div className="beat-duration" role="group" aria-label="Lama permainan">
        {DURATION_PRESETS.map((item) => (
          <button
            key={item.seconds}
            type="button"
            className={durationSeconds === item.seconds ? "is-active" : ""}
            onClick={() => applyDuration(item.seconds)}
          >
            {item.label}
          </button>
        ))}
        <label className="beat-duration__custom">
          <span>Custom</span>
          <input
            type="number"
            min={1}
            max={30}
            value={customMinutes}
            onChange={(event) => setCustomMinutes(event.target.value)}
          />
          <button
            type="button"
            onClick={() => {
              const minutes = Number(customMinutes);
              if (!Number.isFinite(minutes) || minutes < 1) return;
              applyDuration(Math.round(Math.min(30, minutes) * 60));
            }}
          >
            Set
          </button>
        </label>
      </div>
    </>
  );
}

function BeatRound(
  props: GameModuleProps & { durationSeconds: number }
) {
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [targets, setTargets] = useState<Target[]>([]);
  const [message, setMessage] = useState(
    "Melangkah ke kiri, tengah, atau kanan supaya kena panahnya."
  );
  const [laneDisplay, setLaneDisplay] = useState<Lane>(0);

  const present = usePresence(props.vision, props.inputMode);
  /**
   * Always timed, even in relaxed mode: a rhythm round has to end for a score
   * to mean anything, and the length is chosen explicitly right below the
   * stage instead of inherited from the session setting.
   */
  const timer = useRoundTimer(props.durationSeconds, {
    mode: "tantangan",
    presence: present
  });

  const fieldRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<HTMLDivElement | null>(null);
  const nodesRef = useRef(new Map<number, HTMLDivElement>());
  const targetsRef = useRef<Target[]>([]);
  const nextIdRef = useRef(1);
  const lastSpawnRef = useRef(0);
  const startedAtRef = useRef(0);
  const positionRef = useRef(0.5);
  const laneRef = useRef<Lane>(0);
  /** Recent lane occupancy, for the timing grace window. */
  const historyRef = useRef<Array<{ at: number; lane: Lane }>>([]);
  const keyboardRef = useRef<Lane | null>(null);
  /** Targets already scored, so a target is judged exactly once. */
  const judgedRef = useRef(new Set<number>());
  /** Combo lives in a ref as well as state: the loop needs its current value
   *  to work out the multiplier, and state is one render behind. */
  const comboRef = useRef(0);

  useProgressSync(props.game.slug, score);

  /**
   * Player position, read straight off the vision stream and written straight
   * to the DOM.
   *
   * The previous build routed this through `classifyBodyAction`, which reports
   * one of three states only after the player has moved more than 12% of the
   * frame away from a baseline captured over the first 24 frames. Two things
   * followed: a step that felt large in a living room often did not clear the
   * threshold at all, and when it did, the marker teleported between three
   * fixed spots. Reading the smoothed body centre directly gives a continuous
   * position at camera rate with nothing to calibrate.
   */
  useVisionFrame(props.vision, (snapshot) => {
    if (props.inputMode !== "camera") return;
    const body = snapshot.bodies.find((item) => item.player === "A");
    if (!body) return;
    positionRef.current = normalisePosition(body.center.x);
  });

  useEffect(() => {
    if (props.inputMode === "camera") return;
    const down = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") keyboardRef.current = -1;
      if (event.key === "ArrowRight") keyboardRef.current = 1;
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        keyboardRef.current = 0;
      }
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [props.inputMode]);

  const registerNode = useCallback(
    (id: number) => (node: HTMLDivElement | null) => {
      if (node) nodesRef.current.set(id, node);
      else nodesRef.current.delete(id);
    },
    []
  );

  useEffect(() => {
    if (!timer.running) return;

    let frame = 0;
    const now0 = performance.now();
    startedAtRef.current = now0;
    lastSpawnRef.current = now0;

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);

      // --- Player position -------------------------------------------------
      if (props.inputMode !== "camera" && keyboardRef.current !== null) {
        positionRef.current =
          keyboardRef.current === -1 ? 0.1 : keyboardRef.current === 1 ? 0.9 : 0.5;
      }
      const position = positionRef.current;
      const lane = laneFor(position, laneRef.current);
      if (lane !== laneRef.current) {
        laneRef.current = lane;
        setLaneDisplay(lane);
      }
      historyRef.current.push({ at: now, lane });
      while (
        historyRef.current.length &&
        now - historyRef.current[0]!.at > HIT_GRACE_MS
      ) {
        historyRef.current.shift();
      }
      const marker = markerRef.current;
      if (marker) {
        marker.style.left = `${position * 100}%`;
      }

      // --- Spawning --------------------------------------------------------
      const elapsedSeconds = (now - startedAtRef.current) / 1000;
      const cadence = Math.max(
        SPAWN_FLOOR_MS,
        SPAWN_START_MS - elapsedSeconds * SPAWN_RAMP_PER_SECOND
      );
      if (now - lastSpawnRef.current >= cadence) {
        lastSpawnRef.current = now;
        const lanes: Lane[] = [-1, 0, 1];
        const previous = targetsRef.current[targetsRef.current.length - 1];
        // Never three of the same lane in a row: a run of identical arrows
        // means standing still scores, which is the habit this game exists
        // to break.
        const pool =
          previous && targetsRef.current.length >= 2 &&
          targetsRef.current[targetsRef.current.length - 2]?.lane === previous.lane
            ? lanes.filter((item) => item !== previous.lane)
            : lanes;
        const picked = pool[Math.floor(Math.random() * pool.length)] ?? 0;
        targetsRef.current = [
          ...targetsRef.current,
          { id: nextIdRef.current++, lane: picked, spawnAt: now }
        ];
        setTargets(targetsRef.current);
      }

      // --- Movement and judging -------------------------------------------
      let gained = 0;
      let hitCount = 0;
      let missCount = 0;
      let changed = false;
      let latest = "";
      const survivors: Target[] = [];

      for (const target of targetsRef.current) {
        const progress = (now - target.spawnAt) / TRAVEL_MS;
        const node = nodesRef.current.get(target.id);
        if (node) node.style.top = `${Math.min(progress, DESPAWN_PROGRESS) * 100}%`;

        if (progress >= 1 && !judgedRef.current.has(target.id)) {
          judgedRef.current.add(target.id);
          const caught = historyRef.current.some(
            (item) => item.lane === target.lane
          );
          if (node) node.dataset.judged = caught ? "hit" : "miss";
          if (caught) {
            hitCount += 1;
            comboRef.current += 1;
            const multiplier = Math.min(
              MAX_MULTIPLIER,
              1 + Math.floor(comboRef.current / 4)
            );
            gained += BASE_POINTS * multiplier;
            latest =
              comboRef.current >= 4
                ? `Mantap! Combo ${comboRef.current} (x${multiplier})`
                : "Kena!";
          } else {
            missCount += 1;
            comboRef.current = 0;
            latest = "Lewat. Cepat pindah ke panah berikutnya.";
          }
        }

        if (progress < DESPAWN_PROGRESS) survivors.push(target);
        else {
          changed = true;
          judgedRef.current.delete(target.id);
        }
      }

      if (hitCount || missCount) {
        setCombo(comboRef.current);
        setBestCombo((best) => Math.max(best, comboRef.current));
        if (gained) setScore((total) => total + gained);
        if (hitCount) setHits((value) => value + hitCount);
        if (missCount) setMisses((value) => value + missCount);
        setMessage(latest);
      }

      if (changed) {
        targetsRef.current = survivors;
        setTargets(survivors);
      }
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [props.inputMode, timer.running]);

  const accuracy = hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0;

  return (
    <CameraBackdrop inputMode={props.inputMode} vision={props.vision}>
      <div className="beat-hud">
        <div>
          <small>SKOR</small>
          <strong>{score}</strong>
        </div>
        <div>
          <small>COMBO</small>
          <strong>{combo}</strong>
        </div>
        <div>
          <small>POSISI</small>
          <strong className="beat-hud__lane">{LANE_NAME[laneDisplay]}</strong>
        </div>
        <div>
          <small>WAKTU</small>
          <strong>
            {Math.floor(timer.remaining / 60)}:
            {String(Math.max(0, timer.remaining % 60)).padStart(2, "0")}
          </strong>
        </div>
        <div>
          <small>AKURASI</small>
          <strong>{accuracy}%</strong>
        </div>
      </div>

      <section className="beat-field" ref={fieldRef}>
        <div className="beat-lanes" aria-hidden>
          <i />
          <i />
          <i />
        </div>

        {targets.map((target) => (
          <div
            key={target.id}
            ref={registerNode(target.id)}
            className={`beat-target beat-lane-${target.lane + 1}`}
            style={{ top: "0%" }}
          >
            <ArrowMark lane={target.lane} />
          </div>
        ))}

        <div className="beat-hitline" aria-hidden>
          <span>{LANE_NAME[laneDisplay]}</span>
        </div>
        <div className="beat-marker" ref={markerRef} aria-hidden>
          <i />
        </div>
      </section>

      <FeedbackToast message={timer.ended ? "Waktu habis!" : message} />

      {timer.ended ? (
        <RoundEndOverlay
          title={`Selesai · combo terbaik ${bestCombo}`}
          score={{ A: score, B: 0 }}
          playerCount={1}
          onReplay={props.onReplay}
          onCalibration={props.onExit}
          game={props.game.slug}
          durationSeconds={props.durationSeconds}
        />
      ) : null}
    </CameraBackdrop>
  );
}
