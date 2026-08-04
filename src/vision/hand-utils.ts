import type { Point, PlayerId } from "../engine/types.js";

export interface Landmark {
  x: number;
  y: number;
  z?: number;
}

export function mirroredPoint(point: Landmark): Point {
  return { x: 1 - point.x, y: point.y, t: performance.now() };
}

export function assignPlayer(point: Point, singlePlayer: boolean): PlayerId | null {
  if (singlePlayer) return "A";
  if (point.x < 0.48) return "A";
  if (point.x > 0.52) return "B";
  return null;
}

export function isIndexWritingPose(landmarks: readonly Landmark[]): boolean {
  if (landmarks.length < 21) return false;
  const indexExtended = landmarks[8]!.y < landmarks[6]!.y;
  const middleFolded = landmarks[12]!.y > landmarks[10]!.y;
  const ringFolded = landmarks[16]!.y > landmarks[14]!.y;
  const pinkyFolded = landmarks[20]!.y > landmarks[18]!.y;
  return indexExtended && middleFolded && ringFolded && pinkyFolded;
}

export function isOpenPalm(landmarks: readonly Landmark[]): boolean {
  if (landmarks.length < 21) return false;
  return [8, 12, 16, 20].every((tip) => landmarks[tip]!.y < landmarks[tip - 2]!.y);
}

export function smoothPoint(previous: Point | null, next: Point, alpha = 0.42): Point {
  if (!previous) return next;
  return {
    x: previous.x + (next.x - previous.x) * alpha,
    y: previous.y + (next.y - previous.y) * alpha,
    t: next.t
  };
}
