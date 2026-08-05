// GENERATED FILE - do not edit here.
// Source of truth: _vision-core/. Re-run `node _vision-core/sync.mjs` after changes.
/**
 * Draws the detected hand skeleton over the camera feed.
 *
 * None of the apps showed the user what the model could see. When detection
 * failed there was no feedback at all, which is why the whole thing felt broken:
 * a user with a hand slightly out of frame got silence instead of a hint. This
 * overlay is drawn during calibration and can stay on during play.
 */

import { HAND_CONNECTIONS, type Landmark } from "./landmarks";
import { landmarkToStage, type VideoGeometry } from "./coordinate";

export interface SkeletonStyle {
  boneColor: string;
  jointColor: string;
  tipColor: string;
  boneWidth: number;
  jointRadius: number;
  tipRadius: number;
}

export const DEFAULT_SKELETON_STYLE: SkeletonStyle = {
  boneColor: "rgba(255,255,255,0.85)",
  jointColor: "rgba(120,220,255,0.95)",
  tipColor: "#ffd23f",
  boneWidth: 3,
  jointRadius: 4,
  tipRadius: 9
};

export interface SkeletonHand {
  landmarks: readonly Landmark[];
  /** Tint per player so two users can tell their own hand apart. */
  accent?: string;
  highlightTip?: boolean;
}

/** Size the backing store to the CSS box so the drawing is not blurry. */
export function resizeCanvas(canvas: HTMLCanvasElement, width: number, height: number): void {
  const ratio = Math.min(2, typeof window === "undefined" ? 1 : window.devicePixelRatio || 1);
  const targetWidth = Math.round(width * ratio);
  const targetHeight = Math.round(height * ratio);
  if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
  }
  const context = canvas.getContext("2d");
  if (context) context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

export function drawSkeleton(
  canvas: HTMLCanvasElement,
  hands: readonly SkeletonHand[],
  geometry: VideoGeometry,
  style: Partial<SkeletonStyle> = {}
): void {
  const context = canvas.getContext("2d");
  if (!context) return;
  const resolved = { ...DEFAULT_SKELETON_STYLE, ...style };

  resizeCanvas(canvas, geometry.containerWidth, geometry.containerHeight);
  context.clearRect(0, 0, geometry.containerWidth, geometry.containerHeight);

  for (const hand of hands) {
    if (hand.landmarks.length < 21) continue;
    const points = hand.landmarks.map((landmark) => landmarkToStage(landmark, geometry));

    context.lineWidth = resolved.boneWidth;
    context.lineCap = "round";
    context.strokeStyle = hand.accent ?? resolved.boneColor;
    context.beginPath();
    for (const [from, to] of HAND_CONNECTIONS) {
      const a = points[from];
      const b = points[to];
      if (!a || !b) continue;
      context.moveTo(a.px, a.py);
      context.lineTo(b.px, b.py);
    }
    context.stroke();

    context.fillStyle = resolved.jointColor;
    for (const point of points) {
      context.beginPath();
      context.arc(point.px, point.py, resolved.jointRadius, 0, Math.PI * 2);
      context.fill();
    }

    if (hand.highlightTip !== false) {
      const tip = points[8];
      if (tip) {
        context.fillStyle = resolved.tipColor;
        context.beginPath();
        context.arc(tip.px, tip.py, resolved.tipRadius, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = "rgba(0,0,0,0.35)";
        context.lineWidth = 2;
        context.stroke();
      }
    }
  }
}

export function clearCanvas(canvas: HTMLCanvasElement): void {
  const context = canvas.getContext("2d");
  if (!context) return;
  context.clearRect(0, 0, canvas.width, canvas.height);
}
