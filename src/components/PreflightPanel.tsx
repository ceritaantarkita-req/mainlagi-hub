/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GameDefinition } from "@/lib/data/games";
import { unlockAudio } from "@/lib/audio/feedback";
import type { PlayerId } from "@/lib/engine/types";
import type { VisionRuntime, VisionSnapshot } from "@/lib/vision/types";
import { usePlayerGesture, useVisionValue } from "@/lib/vision/useVisionSelector";
import { useOverlayPrefs } from "@/lib/react/useOverlayPrefs";
import type { SessionMode } from "@/games/types";
import { Icon } from "./Icon";
import { VisionOverlay } from "./VisionOverlay";
import startStyles from "./PreflightStartGesture.module.css";

interface Props {
  game: GameDefinition;
  playerCount: 1 | 2;
  setPlayerCount(value: 1 | 2): void;
  inputMode: "camera" | "demo";
  setInputMode(value: "camera" | "demo"): void;
  sessionMode: SessionMode;
  setSessionMode(value: SessionMode): void;
  vision: VisionRuntime;
  onReady(): void;
}

const START_HOLD_MS = 700;

function hasRaisedHands(snapshot: VisionSnapshot): boolean {
  const body = snapshot.bodies.find((item) => item.player === "A");
  const leftShoulder = body?.landmarks[11];
  const rightShoulder = body?.landmarks[12];
  const leftWrist = body?.landmarks[15];
  const rightWrist = body?.landmarks[16];
  if (!leftShoulder || !rightShoulder || !leftWrist || !rightWrist) {
    return false;
  }
  return (
    leftWrist.y < leftShoulder.y - 0.04 && rightWrist.y < rightShoulder.y - 0.04
  );
}

function announceReady(): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance("Siap. Ayo main.");
  utterance.lang = "id-ID";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

export function PreflightPanel({
  game,
  playerCount,
  setPlayerCount,
  inputMode,
  setInputMode,
  sessionMode,
  setSessionMode,
  vision,
  onReady
}: Props) {
  const { status, error, summary } = vision;
  /**
   * The old preflight had seven gates before a game could start: camera,
   * model, hands, bodies, a confirmed pinch, a confirmed open palm, and a
   * 900 ms thumbs-up hold. A five-year-old cannot clear that alone, and in a
   * living room the two-body requirement for two-player hand games regularly
   * failed outright.
   *
   * The default is now a single visible step - be in front of the camera -
   * with the full technical checklist moved behind a parent view.
   */
  const [detailed, setDetailed] = useState(false);
  const { prefs: overlayPrefs, toggle: toggleOverlay } = useOverlayPrefs();
  const [tick, setTick] = useState(0);
  const [startGestureProgress, setStartGestureProgress] = useState(0);
  const startGestureSinceRef = useRef<number | null>(null);
  const startTriggeredRef = useRef(false);

  const requiredPlayers = useMemo<PlayerId[]>(
    () => (playerCount === 1 ? ["A"] : ["A", "B"]),
    [playerCount]
  );
  const needsHands = game.visionMode !== "pose";

  /**
   * Preflight reads the runtime's low-frequency summary plus two gesture
   * strings. It used to render from the full snapshot, which meant this panel
   * re-rendered on every camera frame while the player was still deciding what
   * to press.
   */
  const gestureA = usePlayerGesture(vision, "A");
  const gestureB = usePlayerGesture(vision, "B");
  const handsSeen = useVisionValue<Record<PlayerId, boolean>>(
    vision,
    (snapshot) => ({
      A: snapshot.hands.some((hand) => hand.player === "A"),
      B: snapshot.hands.some((hand) => hand.player === "B")
    }),
    (a, b) => a.A === b.A && a.B === b.B
  );
  const raisedHands = useVisionValue(vision, hasRaisedHands);

  const modelReady = status === "running";
  const handsReady =
    !needsHands || requiredPlayers.every((player) => handsSeen[player]);
  /**
   * Pose detection is no longer required for hand games, even with two
   * players. Two complete bodies plus four hands at 960x540 is a studio
   * requirement, not a living-room one; player separation falls back to
   * horizontal position and face slots.
   */
  const bodiesReady =
    game.visionMode === "hand" || summary.bodies >= playerCount;
  const canContinue =
    inputMode === "demo" || (modelReady && handsReady && bodiesReady);

  const startGestureActive =
    inputMode === "camera" &&
    canContinue &&
    (needsHands
      ? gestureA === "open" || gestureA === "thumbs-up"
      : raisedHands);
  const startInstruction = needsHands
    ? "Angkat telapak tangan terbuka untuk mulai"
    : "Angkat kedua tangan untuk mulai";

  useEffect(() => {
    if (!startGestureActive || inputMode !== "camera" || !canContinue) {
      startGestureSinceRef.current = null;
      startTriggeredRef.current = false;
      setStartGestureProgress((current) => (current === 0 ? current : 0));
      return;
    }

    const now = performance.now();
    startGestureSinceRef.current ??= now;
    const progress = Math.min(
      1,
      (now - startGestureSinceRef.current) / START_HOLD_MS
    );
    const rounded = Math.round(progress * 100) / 100;
    setStartGestureProgress((current) =>
      Math.abs(current - rounded) < 0.01 ? current : rounded
    );

    if (progress >= 1 && !startTriggeredRef.current) {
      startTriggeredRef.current = true;
      announceReady();
      onReady();
    }
    // The gesture hold advances on its own animation frame rather than on the
    // camera stream, so this effect no longer re-runs 25 times a second.
    const handle = window.setTimeout(() => setTick((value) => value + 1), 60);
    return () => window.clearTimeout(handle);
  }, [canContinue, inputMode, onReady, startGestureActive, tick]);

  const resetCalibration = useCallback(() => {
    vision.stop();
    setStartGestureProgress((current) => (current === 0 ? current : 0));
    startGestureSinceRef.current = null;
    startTriggeredRef.current = false;
  }, [vision]);

  const cameraHint = (() => {
    if (inputMode === "demo") return "Mode mouse siap.";
    if (status === "idle") return "Tekan tombol di bawah untuk menyalakan kamera.";
    if (status === "permission") return "Izinkan akses kamera di browser.";
    if (status === "loading-model") return "Menyiapkan pelacak gerak…";
    if (status === "error") return error ?? "Kamera bermasalah.";
    if (summary.distance === "too-far") return "Maju sedikit ke arah kamera.";
    if (summary.distance === "too-close") return "Mundur sedikit dari kamera.";
    if (needsHands && !handsReady) return "Angkat tangan supaya terlihat kamera.";
    if (!bodiesReady) return "Mundur supaya seluruh badan terlihat.";
    return "Semua siap. Angkat telapak tangan untuk mulai.";
  })();

  return (
    <div className="preflight-layout">
      <div className="preflight-backdrop">
        {inputMode === "camera" ? (
          <>
            {/* eslint-disable react-hooks/refs -- `vision` is a plain object of
            stable callbacks. The React compiler classifies it as ref-derived
            because useVisionRuntime builds it around refs, but nothing here
            reads a `.current` value during render. */}
            <div className="camera-placeholder" aria-hidden>
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="6.5" width="13" height="11" rx="2.5" />
                <path d="M16 10.5 21 8v8l-5-2.5" />
              </svg>
              <span>Aktifkan kamera untuk melihat dirimu</span>
            </div>
            <video ref={vision.bindVideo} muted playsInline autoPlay />
            <VisionOverlay
              vision={vision}
              showSkeleton={overlayPrefs.skeleton}
              showFace={overlayPrefs.face}
            />
          </>
        ) : (
          <div className="demo-preview">
            <div className="demo-cursor">✦</div>
            <h2>Mode mouse siap</h2>
            <p>Gunakan mouse atau layar sentuh untuk menulis.</p>
          </div>
        )}
      </div>

      <header className="preflight-topbar">
        <Link className="preflight-back" href="/" aria-label="Kembali ke beranda">
          <Icon name="back" size={20} />
        </Link>
        <div className="preflight-topbar__title">
          <span className="preflight-kicker">SIAP-SIAP</span>
          <h1>{game.title}</h1>
        </div>
        {inputMode === "camera" ? (
          <div className="preflight-topbar__stats" aria-hidden>
            <span>{summary.hands} tangan</span>
            <span>{summary.bodies} tubuh</span>
            {summary.faces ? <span>{summary.faces} wajah</span> : null}
          </div>
        ) : null}
      </header>

      <section className="preflight-sheet">
        <div className="preflight-status" data-state={canContinue ? "ready" : "waiting"}>
          <span className="preflight-status__dot" aria-hidden />
          <p>{cameraHint}</p>
        </div>

        <div className="preflight-settings">
          <div className="preflight-control">
            <label>Siapa yang main</label>
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
                  {value === 1 ? "Sendiri" : "Berdua"}
                </button>
              ))}
            </div>
          </div>

          <div className="preflight-settings__divider" aria-hidden />

          <div className="preflight-control">
            <label>Cara main</label>
            <div className="segmented">
              <button
                className={sessionMode === "santai" ? "is-active" : ""}
                type="button"
                onClick={() => setSessionMode("santai")}
              >
                Santai
              </button>
              <button
                className={sessionMode === "tantangan" ? "is-active" : ""}
                type="button"
                onClick={() => setSessionMode("tantangan")}
              >
                Tantangan
              </button>
            </div>
            <small className="preflight-note">
              {sessionMode === "santai"
                ? "Tanpa hitung mundur, tanpa pengurangan nilai. Cocok untuk usia 4–6."
                : "Ada hitung mundur 90 detik dan bonus kecepatan."}
            </small>
          </div>
        </div>

        <div className="preflight-actions">
          {inputMode === "camera" && status !== "running" ? (
            <button
              className="button button--primary"
              type="button"
              onClick={() => {
                unlockAudio();
                void vision.start();
              }}
            >
              Nyalakan kamera
            </button>
          ) : null}

          {inputMode === "camera" && canContinue ? (
            <div
              className={startStyles.startGesture}
              data-active={startGestureActive}
              aria-live="polite"
            >
              <span className={startStyles.label}>{startInstruction}</span>
              <span className={startStyles.track} aria-hidden>
                <span
                  className={startStyles.fill}
                  style={{ width: `${Math.round(startGestureProgress * 100)}%` }}
                />
              </span>
            </div>
          ) : null}

          {/* The start button only appears once starting is actually possible.
              Showing a permanently greyed-out button next to the one the user
              is supposed to press is noise, and on a phone it costs a whole
              row of the sticky action bar. */}
          {canContinue ? (
            <button
              className="button button--primary button--large"
              type="button"
              onClick={() => {
                unlockAudio();
                onReady();
              }}
            >
              Ayo main
            </button>
          ) : null}
        </div>

        <div className="preflight-sheet__foot">
          <span className="safe-note-inline">
            <b>Area aman:</b> pastikan cukup terang dan tidak ada benda berbahaya di sekitar.
          </span>
          <button
            className="preflight-toggle"
            type="button"
            aria-expanded={detailed}
            onClick={() => setDetailed(true)}
          >
            Mode orang tua &mdash; pengaturan &amp; diagnostik
          </button>
        </div>

        {error && !detailed ? (
          <div className="preflight-error">
            <b>Kamera belum siap</b>
            <span>{error}</span>
          </div>
        ) : null}
      </section>

      {detailed ? (
        <div
          className="preflight-parent-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Mode orang tua"
        >
          <div className="preflight-parent-sheet">
            <div className="preflight-parent-sheet__head">
              <strong>Mode orang tua</strong>
              <button
                type="button"
                className="preflight-parent-sheet__close"
                aria-label="Tutup mode orang tua"
                onClick={() => setDetailed(false)}
              >
                <Icon name="close" size={16} />
              </button>
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

            <div className="preflight-control">
              <label>Tampilan overlay</label>
              <div className="overlay-toggle-row">
                <button
                  type="button"
                  className={`overlay-toggle-chip ${overlayPrefs.skeleton ? "is-on" : ""}`}
                  aria-pressed={overlayPrefs.skeleton}
                  onClick={() => toggleOverlay("skeleton")}
                >
                  <b>Rangka</b>
                  <small>{overlayPrefs.skeleton ? "Nyala" : "Mati"}</small>
                </button>
                <button
                  type="button"
                  className={`overlay-toggle-chip ${overlayPrefs.face ? "is-on" : ""}`}
                  aria-pressed={overlayPrefs.face}
                  onClick={() => toggleOverlay("face")}
                >
                  <b>Wajah</b>
                  <small>{overlayPrefs.face ? "Nyala" : "Mati"}</small>
                </button>
              </div>
              <small className="preflight-note">
                Berlaku di semua permainan, bisa diubah kapan saja.
              </small>
            </div>

            <ol className="preflight-checks">
              <li className={inputMode === "demo" || status !== "idle" ? "is-done" : ""}>
                <i>1</i>
                <span>
                  <b>Kamera</b>
                  <small>
                    {inputMode === "demo"
                      ? "Tidak diperlukan"
                      : status === "running"
                        ? "Aktif"
                        : status === "error"
                          ? (error ?? "Perlu diperbaiki")
                          : "Belum aktif"}
                  </small>
                </span>
              </li>
              <li className={inputMode === "demo" || modelReady ? "is-done" : ""}>
                <i>2</i>
                <span>
                  <b>Model gerak</b>
                  <small>
                    {modelReady
                      ? `Tangan, tubuh${summary.faces ? ", wajah" : ""} siap`
                      : "Menunggu kamera"}
                  </small>
                </span>
              </li>
              <li
                className={
                  inputMode === "demo" || (handsReady && bodiesReady) ? "is-done" : ""
                }
              >
                <i>3</i>
                <span>
                  <b>Deteksi pemain</b>
                  <small>
                    {summary.hands} tangan · {summary.bodies} tubuh ·{" "}
                    {summary.faces} wajah · target {playerCount} pemain
                  </small>
                </span>
              </li>
              <li className={canContinue ? "is-done" : ""}>
                <i>4</i>
                <span>
                  <b>Siap main</b>
                  <small>
                    {canContinue ? startInstruction : "Selesaikan langkah di atas"}
                  </small>
                </span>
              </li>
            </ol>

            <div className="preflight-diagnostics">
              <span>{Math.round(summary.fps)} FPS</span>
              <span>jarak: {summary.distance}</span>
              {gestureA !== "none" ? <span>A: {gestureA}</span> : null}
              {gestureB !== "none" ? <span>B: {gestureB}</span> : null}
            </div>

            {status === "running" ? (
              <button
                className="button button--ghost"
                type="button"
                onClick={resetCalibration}
              >
                Kalibrasi ulang
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
