import type { GameSlug } from "./games";

export interface GameTheme {
  from: string;
  to: string;
  /** 01–10, short index badge for busy cards. */
  mark: string;
}

/** Single source of per-game colour identity. Used on home, /games, /games/[slug]. */
export const GAME_THEMES: Record<GameSlug, GameTheme> = {
  "math-choice": { from: "#23c99a", to: "#078b78", mark: "01" },
  "math-motion-battle": { from: "#4f8df7", to: "#2862c9", mark: "02" },
  "number-trace": { from: "#9b72ee", to: "#6841c5", mark: "03" },
  "shape-quest": { from: "#f5b51b", to: "#e67b12", mark: "04" },
  "pattern-race": { from: "#ee5f9d", to: "#c93172", mark: "05" },
  "math-warung": { from: "#fb8a27", to: "#e55416", mark: "06" },
  "iqro-motion": { from: "#22bcae", to: "#0b8f8f", mark: "07" },
  "airboard-presenter": { from: "#7779ed", to: "#4c4bc8", mark: "08" },
  "dodge-motion": { from: "#ef6268", to: "#d83e4f", mark: "09" },
  "run-to-target": { from: "#25add2", to: "#087dbd", mark: "10" }
};
