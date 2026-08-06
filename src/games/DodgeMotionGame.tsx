"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { BodyAction } from "@/lib/engine/types";
import type { GameModuleProps } from "./types";
import { CameraBackdrop, FeedbackToast } from "./shared";
import { useProgressSync } from "@/lib/auth/progress";

interface Obstacle {
  id: number;
  lane: -1 | 0 | 1;
  kind: "wall" | "bar-high" | "bar-low";
  progress: number;
  resolved: boolean;
}

function actionLane(action: BodyAction) {
  return action === "left" ? -1 : action === "right" ? 1 : 0;
}

export function DodgeMotionGame(props: GameModuleProps) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const [message, setMessage] = useState(
    "Geser kiri/kanan, lompat, atau jongkok untuk menghindar."
  );
  const [keyAction, setKeyAction] = useState<BodyAction>("center");
  const nextIdRef = useRef(1);
  const lastSpawnRef = useRef(0);
  const body = useMemo(
    () => props.snapshot.bodies.find((item) => item.player === "A"),
    [props.snapshot.bodies]
  );
  const action =
    props.inputMode === "camera" ? (body?.action ?? "center") : keyAction;

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") setKeyAction("left");
      if (event.key === "ArrowRight") setKeyAction("right");
      if (event.key === "ArrowUp" || event.key === " ") setKeyAction("jump");
      if (event.key === "ArrowDown") setKeyAction("crouch");
    };
    const up = () => setKeyAction("center");

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    if (lives <= 0) return;

    let frame = 0;
    let previous = performance.now();
    lastSpawnRef.current = previous;

    const loop = (now: number) => {
      const deltaSeconds = Math.min(0.05, (now - previous) / 1000);
      previous = now;

      if (now - lastSpawnRef.current > 1700) {
        lastSpawnRef.current = now;
        const kinds: Obstacle["kind"][] = ["wall", "bar-high", "bar-low"];
        const lanes: Array<-1 | 0 | 1> = [-1, 0, 1];
        obstaclesRef.current = [
          ...obstaclesRef.current,
          {
            id: nextIdRef.current++,
            lane: lanes[Math.floor(Math.random() * lanes.length)]!,
            kind: kinds[Math.floor(Math.random() * kinds.length)]!,
            progress: 0,
            resolved: false
          }
        ];
      }

      let hits = 0;
      let clears = 0;
      let lastKind: Obstacle["kind"] | null = null;
      const lane = actionLane(action);
      const next = obstaclesRef.current
        .map((item) => ({
          ...item,
          progress: item.progress + deltaSeconds * 0.37
        }))
        .filter((item) => item.progress < 1.12)
        .map((item) => {
          if (item.resolved || item.progress < 0.82) return item;

          const hit =
            item.kind === "wall"
              ? lane === item.lane
              : item.kind === "bar-low"
                ? action !== "jump"
                : action !== "crouch";
          lastKind = item.kind;
          if (hit) hits += 1;
          else clears += 1;
          return { ...item, resolved: true };
        });

      obstaclesRef.current = next;
      setObstacles(next);

      if (hits) {
        setLives((value) => Math.max(0, value - hits));
        setMessage(`Kena ${lastKind}. Coba gerakan lebih tegas.`);
      }
      if (clears) {
        setScore((value) => value + clears * 100);
        setMessage("Berhasil menghindar!");
      }

      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [action, lives]);

  useProgressSync(props.game.slug, score);

  return (
    <CameraBackdrop
      inputMode={props.inputMode}
      bindVideo={props.bindVideo}
      snapshot={props.snapshot}
    >
      <div className="body-game-hud">
        <div>
          <small>SKOR</small>
          <strong>{score}</strong>
        </div>
        <div>
          <span className={`action-pill action-${action}`}>
            {action.toUpperCase()}
          </span>
          <small>
            {body
              ? `skeleton ${Math.round(body.confidence * 100)}%`
              : props.inputMode === "demo"
                ? "keyboard aktif"
                : "cari tubuh"}
          </small>
        </div>
        <div>
          <small>NYAWA</small>
          <strong>
            {"♥".repeat(lives)}
            {"♡".repeat(3 - lives)}
          </strong>
        </div>
      </div>

      <section className="dodge-field">
        <div className="lane-grid">
          <i />
          <i />
          <i />
        </div>
        {obstacles.map((item) => (
          <div
            key={item.id}
            className={`dodge-obstacle is-${item.kind} lane-${item.lane + 1} ${item.resolved ? "is-resolved" : ""}`}
            style={{ top: `${item.progress * 100}%` }}
          >
            <span>
              {item.kind === "wall"
                ? "▦"
                : item.kind === "bar-low"
                  ? "LOW"
                  : "HIGH"}
            </span>
          </div>
        ))}
        <div className={`body-avatar action-${action}`}>
          <span>●</span>
          <i />
          <b />
        </div>
        {lives <= 0 ? (
          <div className="game-over-card">
            <h2>Ronde selesai</h2>
            <p>Skor {score}</p>
            <div>
              <button onClick={props.onReplay}>Main lagi</button>
              <button onClick={props.onExit}>Kalibrasi ulang</button>
            </div>
          </div>
        ) : null}
      </section>

      <div className="body-instructions">
        <span>← → geser</span>
        <span>↑ / Space lompat</span>
        <span>↓ jongkok</span>
        <span>Pastikan area bermain aman</span>
      </div>
      <FeedbackToast message={message} />
    </CameraBackdrop>
  );
}
