/* eslint-disable react-hooks/set-state-in-effect */
"use client";

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

export function PreflightPanel(props: Props) {
  const [gestures, setGestures] = useState<GestureCalibration>(EMPTY_GESTURES);
  const requiredPlayers = useMemo<PlayerId[]>(
    () => (props.playerCount === 1 ? ["A"] : ["A", "B"]),
    [props.playerCount]
  );
  const needsHands = props.game.visionMode !== "pose";
  const needsBodies = props.game.visionMode !== "hand" || props.playerCount === 2;

  const handByPlayer = useMemo(
    () => ({
      A: props.snapshot.hands.find((hand) => hand.player === "A"),
      B: props.snapshot.hands.find((hand) => hand.player === "B")
    }),
    [props.snapshot.hands]
  );

  useEffect(() => {
    if (props.inputMode === "demo" || !needsHands) return;
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
  }, [handByPlayer, needsHands, props.inputMode, requiredPlayers]);

  const resetCalibration = () => {
    props.stop();
    setGestures(EMPTY_GESTURES);
  };

  const handsReady = !needsHands || requiredPlayers.every((player) => Boolean(handByPlayer[player]));
  const bodiesReady = !needsBodies || props.snapshot.bodies.length >= props.playerCount;
  const gesturesReady =
    !needsHands ||
    requiredPlayers.every((player) => gestures.pinch[player] && gestures.open[player]);
  const modelReady = props.status === "running";
  const canContinue =
    props.inputMode === "demo" ||
    (modelReady && handsReady && bodiesReady && gesturesReady);

  return (
    <div className="preflight-layout">
      <section className="preflight-copy">
        <a className="back-link" href="/">← Kembali ke beranda</a>
        <span className="preflight-kicker">PRE-FLIGHT · {props.game.visionMode.toUpperCase()}</span>
        <h1>{props.game.title}</h1>
        <p>Periksa kamera, skeleton, gesture, dan jumlah pemain sebelum countdown.</p>

        <div className="preflight-control">
          <label>Jumlah pemain</label>
          <div className="segmented">
            {props.game.playerOptions.map((value) => (
              <button
                key={value}
                className={props.playerCount === value ? "is-active" : ""}
                type="button"
                onClick={() => {
                  resetCalibration();
                  props.setPlayerCount(value);
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
              className={props.inputMode === "camera" ? "is-active" : ""}
              type="button"
              onClick={() => {
                resetCalibration();
                props.setInputMode("camera");
              }}
            >
              Kamera
            </button>
            <button
              className={props.inputMode === "demo" ? "is-active" : ""}
              type="button"
              onClick={() => {
                resetCalibration();
                props.setInputMode("demo");
              }}
            >
              Mouse / keyboard
            </button>
          </div>
        </div>

        <ol className="preflight-checks">
          <li className={props.inputMode === "demo" || props.status !== "idle" ? "is-done" : ""}>
            <i>1</i>
            <span>
              <b>Kamera</b>
              <small>
                {props.inputMode === "demo"
                  ? "Mode demo tidak memerlukan izin kamera"
                  : props.status === "permission"
                    ? "Menunggu izin kamera"
                    : props.status === "error"
                      ? "Perlu diperbaiki"
                      : props.status === "idle"
                        ? "Belum dimulai"
                        : "Aktif 960×540"}
              </small>
            </span>
          </li>
          <li className={props.inputMode === "demo" || modelReady ? "is-done" : ""}>
            <i>2</i>
            <span>
              <b>Model vision</b>
              <small>
                {props.inputMode === "demo"
                  ? "Input fallback siap"
                  : props.status === "loading-model"
                    ? "Memuat model MediaPipe"
                    : modelReady
                      ? "Model siap"
                      : "Menunggu kamera"}
              </small>
            </span>
          </li>
          <li className={props.inputMode === "demo" || (handsReady && bodiesReady) ? "is-done" : ""}>
            <i>3</i>
            <span>
              <b>Skeleton pemain</b>
              <small>
                {props.inputMode === "demo"
                  ? "Dilewati pada mode demo"
                  : `${props.snapshot.hands.length} tangan · ${props.snapshot.bodies.length} tubuh · target ${props.playerCount} pemain`}
              </small>
            </span>
          </li>
          <li className={props.inputMode === "demo" || gesturesReady ? "is-done" : ""}>
            <i>4</i>
            <span>
              <b>Kalibrasi gesture</b>
              <small>
                {props.inputMode === "demo"
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
              <small>{canContinue ? "Tekan mulai untuk 3–2–1" : "Selesaikan pemeriksaan di atas"}</small>
            </span>
          </li>
        </ol>

        {props.error ? (
          <div className="preflight-error">
            <b>Kamera belum siap</b>
            <span>{props.error}</span>
          </div>
        ) : null}

        <div className="preflight-actions">
          {props.inputMode === "camera" && props.status !== "running" ? (
            <button className="button button--secondary" type="button" onClick={() => void props.start()}>
              Aktifkan kamera
            </button>
          ) : null}
          {props.inputMode === "camera" && props.status === "running" ? (
            <button className="button button--secondary" type="button" onClick={resetCalibration}>
              Kalibrasi ulang
            </button>
          ) : null}
          <button
            className="button button--primary"
            type="button"
            disabled={!canContinue}
            onClick={props.onReady}
          >
            Mulai countdown
          </button>
        </div>
      </section>

      <section className="preflight-view">
        {props.inputMode === "camera" ? (
          <>
            <video ref={props.bindVideo} muted playsInline autoPlay />
            <VisionOverlay snapshot={props.snapshot} />
            <div className="vision-stats">
              <span>{Math.round(props.snapshot.fps)} FPS</span>
              <span>{props.snapshot.hands.length} tangan</span>
              <span>{props.snapshot.bodies.length} tubuh</span>
            </div>
          </>
        ) : (
          <div className="demo-preview">
            <div className="demo-cursor">✦</div>
            <h2>Mode demo siap</h2>
            <p>Gunakan mouse/touch untuk tulisan dan tombol panah untuk game tubuh.</p>
          </div>
        )}
        <div className="safe-note">
          <b>Area aman</b>
          <span>Pastikan pencahayaan cukup dan tidak ada benda berbahaya di sekitar pemain.</span>
        </div>
      </section>
    </div>
  );
}
