import type { Point, PlayerId } from "../engine/types.js";
import { analyzeHand, type Landmark as CoreLandmark } from "../lib/vision-core/landmarks";
import { DEFAULT_SPLIT } from "../lib/vision-core/coordinate";

export type Landmark = CoreLandmark;

/**
 * Split-screen boundaries.
 *
 * Widened from a 4% dead band to 12%. With the old band a hand hovering near the
 * middle changed owner several times a second, so two-player games kept losing
 * track of who was writing.
 */
export const PLAYER_A_MAX_X = DEFAULT_SPLIT.aEnd;
export const PLAYER_B_MIN_X = DEFAULT_SPLIT.bStart;

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function mirroredPoint(point: Landmark): Point {
  return { x: 1 - point.x, y: point.y, t: performance.now() };
}

export function assignPlayer(point: Point, singlePlayer: boolean): PlayerId | null {
  if (singlePlayer) return "A";
  if (point.x < PLAYER_A_MAX_X) return "A";
  if (point.x > PLAYER_B_MIN_X) return "B";
  return null;
}

export function toPlayerLocalPoint(point: Point, player: PlayerId, singlePlayer: boolean): Point {
  if (singlePlayer) return { ...point, x: clamp01(point.x), y: clamp01(point.y) };
  const x = player === "A"
    ? point.x / PLAYER_A_MAX_X
    : (point.x - PLAYER_B_MIN_X) / (1 - PLAYER_B_MIN_X);
  return { ...point, x: clamp01(x), y: clamp01(point.y) };
}

/**
 * Pose tests now delegate to the shared vision core.
 *
 * The previous versions compared raw landmark y values, so they only worked when
 * the hand was held perfectly upright: tilt it and "index extended" silently
 * became false, which is why writing kept stopping mid-digit. The core measures
 * the angle at each knuckle, which is unaffected by hand rotation.
 */
export function isIndexWritingPose(landmarks: readonly Landmark[]): boolean {
  return analyzeHand(landmarks)?.pose === "point";
}

export function isOpenPalm(landmarks: readonly Landmark[]): boolean {
  return analyzeHand(landmarks)?.pose === "open";
}

export function smoothPoint(previous: Point | null, next: Point, alpha = 0.42): Point {
  if (!previous) return next;
  const safeAlpha = clamp01(alpha);
  return {
    x: previous.x + (next.x - previous.x) * safeAlpha,
    y: previous.y + (next.y - previous.y) * safeAlpha,
    t: next.t
  };
}
