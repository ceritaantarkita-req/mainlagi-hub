import type { GameDefinition } from "@/lib/data/games";
import type { VisionSnapshot } from "@/lib/vision/types";

export interface GameModuleProps {
  game: GameDefinition;
  playerCount: 1 | 2;
  inputMode: "camera" | "demo";
  snapshot: VisionSnapshot;
  bindVideo(element: HTMLVideoElement | null): void;
  onExit(): void;
  onReplay(): void;
}
