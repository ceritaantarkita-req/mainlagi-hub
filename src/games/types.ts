import type { GameDefinition } from "@/lib/data/games";
import type { Level } from "@/lib/engine/math";
import type { PlayerId } from "@/lib/engine/types";
import type { VisionRuntime } from "@/lib/vision/types";

/**
 * How a session is played.
 *
 * `santai` (relaxed) is the default: no countdown, no score penalties, retry
 * as often as you like. It exists because the previous build put every game
 * behind a 60-second timer with a -5 point penalty for a misread digit, which
 * is the wrong shape of pressure for a four-to-six year old who is still
 * learning to form the numerals at all.
 *
 * `tantangan` (challenge) restores the timer for older children and adults.
 */
export type SessionMode = "santai" | "tantangan";

export interface GameModuleProps {
  game: GameDefinition;
  playerCount: 1 | 2;
  inputMode: "camera" | "demo";
  sessionMode: SessionMode;
  /**
   * Difficulty per player. A five-year-old and a thirty-six-year-old sharing
   * one camera must not share one difficulty setting.
   */
  playerLevels: Record<PlayerId, Level>;
  setPlayerLevel(player: PlayerId, level: Level): void;
  /**
   * The camera runtime. Games subscribe to it for per-frame data instead of
   * receiving a snapshot prop - passing the snapshot down re-rendered the whole
   * game tree ~25 times a second.
   */
  vision: VisionRuntime;
  onExit(): void;
  onReplay(): void;
}
