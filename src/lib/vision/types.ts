import type { BodyAction, PlayerId, Point } from "../engine/types";

export interface Landmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export type GestureName =
  | "pinch"
  | "open"
  | "fist"
  | "point"
  | "thumbs-up"
  | "unknown";

export type HandSide = "left" | "right" | "unknown";

export interface TrackedHand {
  id: string;
  player: PlayerId;
  /** Which of the player's hands this is, after mirroring into screen space. */
  side: HandSide;
  /** True for the hand currently driving the pen / cursor for this player. */
  primary: boolean;
  landmarks: Landmark[];
  point: Point;
  gesture: GestureName;
  /**
   * Handedness score reported by MediaPipe. Kept for diagnostics only - it is
   * almost always > 0.95 and must never be used as a gesture quality gate.
   */
  confidence: number;
  /** Confidence of the *gesture* classification. This is the useful one. */
  gestureConfidence: number;
  /** Thumb-tip to index-tip distance divided by palm size. */
  pinchRatio: number;
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

export type FaceDistance = "too-close" | "good" | "too-far" | "unknown";

export interface TrackedFace {
  id: string;
  player: PlayerId;
  landmarks: Landmark[];
  /** Nose tip, in mirrored screen space. */
  center: Point;
  /** Inner-lip opening divided by mouth width. */
  mouthOpen: number;
  /** Eye aperture ratio, averaged over both eyes. 0 = closed. */
  eyeOpen: number;
  /** Head rotation, -1 (looking left) .. 1 (looking right). */
  yaw: number;
  /** Head tilt, -1 (looking up) .. 1 (looking down). */
  pitch: number;
  /** Face width as a fraction of the frame. Used as a distance proxy. */
  scale: number;
  distance: FaceDistance;
  /** True while the player is looking at the camera. */
  attentive: boolean;
}

export interface VisionSnapshot {
  hands: TrackedHand[];
  bodies: TrackedBody[];
  faces: TrackedFace[];
  fps: number;
  timestamp: number;
  /** Source frame size, needed to project landmarks onto the stage. */
  sourceWidth: number;
  sourceHeight: number;
}

export type VisionStatus =
  | "idle"
  | "permission"
  | "loading-model"
  | "running"
  | "error";

export const EMPTY_SNAPSHOT: VisionSnapshot = {
  hands: [],
  bodies: [],
  faces: [],
  fps: 0,
  timestamp: 0,
  sourceWidth: 960,
  sourceHeight: 540
};

/**
 * Cheap, low-frequency view of the vision stream that is safe to keep in React
 * state and render directly.
 *
 * The full {@link VisionSnapshot} must never live in React state: it is
 * replaced ~25 times a second, and every consumer that called `setState` from
 * it produced another render, which re-ran the effect, which set state again.
 * That is what triggered "Maximum update depth exceeded". Per-frame data is
 * read through `getSnapshot()` / `subscribe()` instead; only this summary is
 * published to React, and only when one of its values actually changes.
 */
export interface VisionSummary {
  hands: number;
  bodies: number;
  faces: number;
  fps: number;
  distance: FaceDistance;
  /** True while at least one player is visible. */
  present: boolean;
}

export const EMPTY_SUMMARY: VisionSummary = {
  hands: 0,
  bodies: 0,
  faces: 0,
  fps: 0,
  distance: "unknown",
  present: false
};

export type VisionListener = (snapshot: VisionSnapshot) => void;

export interface VisionRuntime {
  bindVideo(element: HTMLVideoElement | null): void;
  start(): Promise<void>;
  stop(updateState?: boolean): void;
  status: VisionStatus;
  error: string | null;
  /** Latest frame. Identity changes every publish - never store it in state. */
  getSnapshot(): VisionSnapshot;
  /** Called on every publish. Returns an unsubscribe function. */
  subscribe(listener: VisionListener): () => void;
  summary: VisionSummary;
}
