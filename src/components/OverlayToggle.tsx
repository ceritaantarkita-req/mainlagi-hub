"use client";

import { useOverlayPrefs } from "@/lib/react/useOverlayPrefs";

/**
 * In-game switches for the camera overlay, sitting in the game header next to
 * Bagikan / Kalibrasi ulang / Keluar.
 *
 * These belong *in* the game, not only in the pre-game settings panel: whether
 * the skeleton helps or distracts is something you discover while playing, and
 * having to quit to the calibration screen to turn it off is exactly the kind
 * of friction that means nobody ever does. The header is the one strip of the
 * play screen that is already chrome rather than playfield, so the buttons can
 * live there without covering anything a child needs to reach - the HUD owns
 * the top of the camera view and the feedback toast owns the bottom.
 *
 * They behave like a light/dark toggle: one tap, immediate effect, state
 * visible at a glance, remembered for next time.
 */
export function OverlayToggle() {
  const { prefs, toggle } = useOverlayPrefs();

  return (
    <div className="overlay-switch" role="group" aria-label="Tampilan kamera">
      <button
        type="button"
        className={`overlay-switch__button ${prefs.skeleton ? "is-on" : ""}`}
        aria-pressed={prefs.skeleton}
        title={prefs.skeleton ? "Sembunyikan rangka" : "Tampilkan rangka"}
        onClick={() => toggle("skeleton")}
      >
        <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden>
          <circle cx="12" cy="4.6" r="2.4" fill="currentColor" />
          <path
            d="M12 7.4v6.1M12 9.4l-4.6 2.8M12 9.4l4.6 2.8M12 13.5l-3.4 5.9M12 13.5l3.4 5.9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <span className="overlay-switch__label">Rangka</span>
      </button>
      <button
        type="button"
        className={`overlay-switch__button ${prefs.face ? "is-on" : ""}`}
        aria-pressed={prefs.face}
        title={prefs.face ? "Sembunyikan mesh wajah" : "Tampilkan mesh wajah"}
        onClick={() => toggle("face")}
      >
        <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden>
          <circle
            cx="12"
            cy="12"
            r="8.2"
            stroke="currentColor"
            strokeWidth="1.9"
            fill="none"
          />
          <path
            d="M3.8 12h16.4M12 3.8v16.4M5.5 6.6c4 2.6 9 2.6 13 0M5.5 17.4c4-2.6 9-2.6 13 0"
            stroke="currentColor"
            strokeWidth="1.1"
            fill="none"
            opacity=".75"
          />
        </svg>
        <span className="overlay-switch__label">Wajah</span>
      </button>
    </div>
  );
}
