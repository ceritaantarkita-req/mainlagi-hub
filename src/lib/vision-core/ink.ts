// GENERATED FILE - do not edit here.
// Source of truth: _vision-core/. Re-run `node _vision-core/sync.mjs` after changes.
/**
 * Canvas ink renderer.
 *
 * WHY NOT SVG
 *
 * The overlay this replaces was an SVG re-rendered through React state on every
 * stroke point - i.e. every frame the finger moved - with a `feGaussianBlur`
 * applied to each path for the glow. That combination is close to a worst case:
 *
 *   - React reconciles the whole overlay each frame,
 *   - the browser rebuilds the SVG DOM and re-parses every path string,
 *   - and the blur filter is re-rasterised from scratch, on the CPU in several
 *     browsers, over the full stage rectangle.
 *
 * Two of those ran at once, one per player. That is the lag: it scaled with how
 * much the user had drawn, so it got worse the longer they wrote - which is
 * precisely when they could least afford it, because the round clock was running.
 *
 * A canvas draws the same ink with none of that. The glow is a `shadowBlur` the
 * GPU handles, the path is issued as drawing commands rather than parsed from a
 * string, and nothing round-trips through React at all.
 */

import type { Point2D } from "./coordinate";

export interface InkStyle {
  color: string;
  /** Stroke width in CSS pixels. */
  width: number;
  /** Glow radius in CSS pixels. Set to 0 to disable the glow entirely. */
  glow: number;
  /** Radius of the dot drawn at the live pen position. 0 hides it. */
  cursorRadius: number;
}

export const DEFAULT_INK_STYLE: InkStyle = {
  color: "rgba(24,142,245,0.95)",
  width: 14,
  glow: 12,
  cursorRadius: 9
};

export interface InkLayer {
  strokes: ReadonlyArray<readonly Point2D[]>;
  style?: Partial<InkStyle>;
  /** Live pen position, drawn as a cursor dot. */
  cursor?: Point2D | null;
}

/**
 * Size a canvas to its CSS box, accounting for device pixel ratio.
 *
 * Returns true when the backing store actually changed, so callers can skip
 * redundant work. Capped at 2x: beyond that the fill rate cost of the glow
 * outweighs any visible sharpness, and phones with dpr 3-4 were paying triple
 * for ink nobody can resolve.
 */
export function resizeInkCanvas(
  canvas: HTMLCanvasElement,
  cssWidth: number,
  cssHeight: number,
  maxRatio = 2
): boolean {
  const ratio = Math.min(
    maxRatio,
    typeof globalThis !== "undefined" && "devicePixelRatio" in globalThis
      ? (globalThis as { devicePixelRatio?: number }).devicePixelRatio ?? 1
      : 1
  );
  const width = Math.max(1, Math.round(cssWidth * ratio));
  const height = Math.max(1, Math.round(cssHeight * ratio));
  if (canvas.width === width && canvas.height === height) return false;
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;
  return true;
}

/**
 * Paint ink layers onto a canvas.
 *
 * `toPixels` converts a point from whatever space the caller stores strokes in
 * (glyph space, normalised, source pixels) into canvas CSS pixels. Passing it in
 * rather than assuming a space is what keeps the ink locked to the fingertip:
 * the caller uses the *same* function it used to measure the finger, so the two
 * cannot drift apart the way they did when the overlay had its own CSS box.
 */
export function drawInk(
  canvas: HTMLCanvasElement,
  layers: readonly InkLayer[],
  toPixels: (point: Point2D) => Point2D
): void {
  const context = canvas.getContext("2d");
  if (!context) return;

  const ratio = canvas.width / Math.max(1, parseFloat(canvas.style.width) || canvas.width);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, canvas.width / ratio, canvas.height / ratio);

  for (const layer of layers) {
    const style = { ...DEFAULT_INK_STYLE, ...layer.style };
    context.strokeStyle = style.color;
    context.fillStyle = style.color;
    context.lineWidth = style.width;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.shadowBlur = style.glow;
    context.shadowColor = style.glow > 0 ? style.color : "transparent";

    for (const stroke of layer.strokes) {
      if (stroke.length === 0) continue;
      if (stroke.length === 1) {
        const only = toPixels(stroke[0]!);
        context.beginPath();
        context.arc(only.x, only.y, style.width / 2, 0, Math.PI * 2);
        context.fill();
        continue;
      }
      context.beginPath();
      const first = toPixels(stroke[0]!);
      context.moveTo(first.x, first.y);
      // Quadratic smoothing through midpoints: raw polylines from a 30fps
      // fingertip look faceted, and the facets read as bad tracking even when
      // the tracking is fine.
      for (let i = 1; i < stroke.length - 1; i += 1) {
        const current = toPixels(stroke[i]!);
        const next = toPixels(stroke[i + 1]!);
        context.quadraticCurveTo(
          current.x, current.y,
          (current.x + next.x) / 2, (current.y + next.y) / 2
        );
      }
      const last = toPixels(stroke[stroke.length - 1]!);
      context.lineTo(last.x, last.y);
      context.stroke();
    }

    if (layer.cursor && style.cursorRadius > 0) {
      const cursor = toPixels(layer.cursor);
      context.beginPath();
      context.arc(cursor.x, cursor.y, style.cursorRadius, 0, Math.PI * 2);
      context.fill();
    }
  }

  context.shadowBlur = 0;
  context.shadowColor = "transparent";
}

/** Wipe a canvas without resizing it. */
export function clearInk(canvas: HTMLCanvasElement): void {
  const context = canvas.getContext("2d");
  if (!context) return;
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, canvas.width, canvas.height);
}
