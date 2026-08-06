/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { GameDefinition } from "@/lib/data/games";
import type { PlayerId } from "@/lib/engine/types";
import type { VisionSnapshot, VisionStatus } from "@/lib/vision/types";
import { VisionOverlay } from "./VisionOverlay";

interface Props {
  game: GameDefinition;
  playerCount: 1 | 2;
  setPlayerCount(value: 1 | 2): void;
  inputMode: "camera" | "demo";
  setInputMode(value: "camera" | "demo"): void;
  status: VisionStatus;
  error: string | null;
  snapshot: VisionSnapshot;
  bindVideo(element: HTMLVideoElement | null): void;
  start(): Promise<void>;
  stop(): void;
  onReady(): void;
}

interface GestureCalibration {
  pinch: Record<PlayerId, boolean>;
  open: Record<PlayerId, boolean>;
}

const EMPTY_GESTURES: GestureCalibration = {
  pinch: { A: false, B: false },
  open: { A: false, B: false }
};

export function PreflightPanel({
  game,
  playerCount,
  setPlayerCount,
  inputMode,
  setInputMode,
  status,
  error,
  snapshot,
  bindVideo,
  start,
  stop,
  onReady
}: Props) {
  const [gestures, setGestures] =
    useState<GestureCalibration>(EMPTY_GESTURES);
  const requiredPlayers = useMemo<PlayerId[]>(
    () => (playerCount === 1 ? ["A"] : ["A", "B"]),
    [playerCount]
  );
  const needsHands = game.visionMode !== "pose";
  const needsBodies = game.visionMode !== "hand" || playerCount === 2;

  const handByPlayer = useMemo(
    () => ({
      A: snapshot.hands.find((hand) => hand.player === "A"),
      B: snapshot.hands.find((hand) => hand.player === "B")
    }),
    [snapshot.hands]
  );

  useEffect(() => {
    if (inputMode === "demo" || !needsHands) return;

    setGestures((current) => {
      const next: GestureCalibration = {
        pinch: { ...current.pinch },
        open: { ...current.open }
      };
      let changed = false;

      for (const player of requiredPlayers) {
        const gesture = handByPlayer[player]?.gesture;
        if (gesture === "pinch" && !next.pinch[player]) {
          next.pinch[player] = true;
          changed = true;
        }
        if (gesture === "open" && !next.open[player]) {
          next.open[player] = true;
          changed = true;
        }
      }

      return changed ? next : current;
    });
  }, [handByPlayer, inputMode, needsHands, requiredPlayers]);

  const resetCalibration = () => {
    stop();
    setGestures(EMPTY_GESTURES);
  };

  const handsReady =
    !needsHands ||
    requiredPlayers.every((player) => Boolean(handByPlayer[player]));
  const bodiesReady = !needsBodies || snapshot.bodies.length >= playerCount;
  const gesturesReady =
    !needsHands ||
    requiredPlayers.every(
      (player) => gestures.pinch[player] && gestures.open[player]
    );
  const modelReady = status === "running";
  const canContinue =
    inputMode === "demo" ||
    (modelReady && handsReady && bodiesReady && gesturesReady);

  return (
    <div className="preflight-layout">
      <section className="preflight-copy">
        <Link className="back-link" href="/">
          ← Kembali ke beranda
        </Link>
        <span className="preflight-kicker">
          PRE-FLIGHT · {game.visionMode.toUpperCase()}
        </span>
        <h1>{game.title}</h1>
        <p>
          Periksa kamera, skeleton, gesture, dan jumlah pemain sebelum countdown.
        </p>

        <div className="preflight-control">
          <label>Jumlah pemain</label>
          <div className="segmented">
            {game.playerOptions.map((value) => (
              <button
                key={value}
                className={playerCount === value ? "is-active" : ""}
                type="button"
                onClick={() => {
                  resetCalibration();
                  setPlayerCount(value);
                }}
              >
                {value} pemain
              </button>
            ))}
          </div>
        </div>

        <div className="preflight-control">
          <label>Mode input</label>
          <div className="segmented">
            <button
              className={inputMode === "camera" ? "is-active" : ""}
              type="button"
              onClick={() => {
                resetCalibration();
                setInputMode("camera");
              }}
            >
              Kamera
            </button>
            <button
              className={inputMode === "demo" ? "is-active" : ""}
              type="button"
              onClick={() => {
                resetCalibration();
                setInputMode("demo");
              }}
            >
              Mouse / keyboard
            </button>
          </div>
        </div>

        <ol className="preflight-checks">
          <li
            className={
              inputMode === "demo" || status !== "idle" ? "is-done" : ""
            }
          >
            <i>1</i>
            <span>
              <b>Kamera</b>
              <small>
                {inputMode === "demo"
                  ? "Mode demo tidak memerlukan izin kamera"
                  : status === "permission"
                    ? "Menunggu izin kamera"
                    : status === "error"
                      ? "Perlu diperbaiki"
                      : status === "idle"
                        ? "Belum dimulai"
                        : "Aktif 960×540"}
              </small>
            </span>
          </li>
          <li className={inputMode === "demo" || modelReady ? "is-done" : ""}>
            <i>2</i>
            <span>
              <b>Model vision</b>
              <small>
                {inputMode === "demo"
                  ? "Input fallback siap"
                  : status === "loading-model"
                    ? "Memuat model MediaPipe"
                    : modelReady
                      ? "Model siap"
                      : "Menunggu kamera"}
              </small>
            </span>
          </li>
          <li
            className={
              inputMode === "demo" || (handsReady && bodiesReady)
                ? "is-done"
                : ""
            }
          >
            <i>3</i>
            <span>
              <b>Skeleton pemain</b>
              <small>
                {inputMode === "demo"
                  ? "Dilewati pada mode demo"
                  : `${snapshot.hands.length} tangan · ${snapshot.bodies.length} tubuh · target ${playerCount} pemain`}
              </small>
            </span>
          </li>
          <li
            className={
              inputMode === "demo" || gesturesReady ? "is-done" : ""
            }
          >
            <i>4</i>
            <span>
              <b>Kalibrasi gesture</b>
              <small>
                {inputMode === "demo"
                  ? "Dilewati pada mode demo"
                  : !needsHands
                    ? "Game tubuh tidak memerlukan gesture tangan"
                    : gesturesReady
                      ? "Pinch dan telapak terbuka terkonfirmasi"
                      : "Lakukan pinch, lalu buka telapak untuk setiap pemain"}
              </small>
            </span>
          </li>
          <li className={canContinue ? "is-done" : ""}>
            <i>5</i>
            <span>
              <b>Siap countdown</b>
              <small>
                {canContinue
                  ? "Tekan mulai untuk 3–2–1"
                  : "Selesaikan pemeriksaan di atas"}
              </small>
            </span>
          </li>
        </ol>

        {error ? (
          <div className="preflight-error">
            <b>Kamera belum siap</b>
            <span>{error}</span>
          </div>
        ) : null}

        <div className="preflight-actions">
          {inputMode === "camera" && status !== "running" ? (
            <button
              className="button button--secondary"
              type="button"
              onClick={() => void start()}
            >
              Aktifkan kamera
            </button>
          ) : null}
          {inputMode === "camera" && status === "running" ? (
            <button
              className="button button--secondary"
              type="button"
              onClick={resetCalibration}
            >
              Kalibrasi ulang
            </button>
          ) : null}
          <button
            className="button button--primary"
            type="button"
            disabled={!canContinue}
            onClick={onReady}
          >
            Mulai countdown
          </button>
        </div>
      </section>

      <section className="preflight-view">
        {inputMode === "camera" ? (
          <>
            <video ref={bindVideo} muted playsInline autoPlay />
            <VisionOverlay snapshot={snapshot} />
            <div className="vision-stats">
              <span>{Math.round(snapshot.fps)} FPS</span>
              <span>{snapshot.hands.length} tangan</span>
              <span>{snapshot.bodies.length} tubuh</span>
            </div>
          </>
        ) : (
          <div className="demo-preview">
            <div className="demo-cursor">✦</div>
            <h2>Mode demo siap</h2>
            <p>
              Gunakan mouse/touch untuk tulisan dan tombol panah untuk game
              tubuh.
            </p>
          </div>
        )}
        <div className="safe-note">
          <b>Area aman</b>
          <span>
            Pastikan pencahayaan cukup dan tidak ada benda berbahaya di sekitar
            pemain.
          </span>
        </div>
      </section>
    </div>
  );
}
