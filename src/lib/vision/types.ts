import type { BodyAction, PlayerId, Point } from "../engine/types";

export interface Landmark { x: number; y: number; z?: number; visibility?: number }
export type GestureName = "pinch" | "open" | "fist" | "point" | "unknown";
export interface TrackedHand {
  id: string;
  player: PlayerId;
  landmarks: Landmark[];
  point: Point;
  gesture: GestureName;
  confidence: number;
  handedness: string;
}
export interface TrackedBody {
  id: string;
  player: PlayerId;
  landmarks: Landmark[];
  center: Point;
  action: BodyAction;
  confidence: number;
  torsoScale: number;
  hipY: number;
}
export interface VisionSnapshot {
  hands: TrackedHand[];
  bodies: TrackedBody[];
  fps: number;
  timestamp: number;
}
export type VisionStatus = "idle" | "permission" | "loading-model" | "running" | "error";
