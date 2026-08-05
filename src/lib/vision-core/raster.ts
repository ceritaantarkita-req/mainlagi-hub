// GENERATED FILE - do not edit here.
// Source of truth: _vision-core/. Re-run `node _vision-core/sync.mjs` after changes.
/**
 * Order-invariant shape comparison.
 *
 * WHY THIS EXISTS
 *
 * The previous recogniser concatenated every stroke into one long list of points
 * and compared it to a template point-by-point, in order. That makes the score
 * depend on things the user never agreed to:
 *
 *   - which stroke they drew first ("4" as tiang-then-diagonal vs the reverse),
 *   - which direction they drew each stroke in,
 *   - where exactly they started.
 *
 * All three produce an identical shape on screen and a completely different
 * distance. That is the mechanical reason a visibly correct answer was rejected
 * over and over: the ink was right, the traversal order was not.
 *
 * This module compares what the glyph *looks like* instead. Strokes are drawn
 * into a small square grid of ink coverage, then compared with a symmetric
 * chamfer distance over a distance transform. Nothing in that pipeline can see
 * stroke order, stroke direction, or the seam between two strokes, so none of
 * them can change the answer.
 *
 * It is also cheap: a 24x24 grid is 576 floats per template, compared with a
 * 52x52 dynamic-programming matrix per template in the old Arabic recogniser.
 */

import type { Point2D } from "./coordinate";

/** Grid resolution. 24 is enough to separate 3/8 and ba/tsa without overfitting. */
export const GRID = 24;

/**
 * Aspect ratios are clamped before they are ever compared.
 *
 * A perfectly straight vertical line has zero width, so height/width is
 * infinity - and the reference "1" is exactly that. Comparing a user's slightly
 * wobbly "1" (aspect maybe 15) against a template whose aspect was recorded as
 * 960000 produced a log-space gap of ~11, which swamped every other term and
 * made the engine reject a textbook-perfect "1". Clamping says what we actually
 * mean: past this point a shape is simply "very thin", and the exact number
 * carries no further information.
 */
export const MIN_ASPECT = 0.16;
export const MAX_ASPECT = 6.2;

export function clampAspect(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 1;
  return Math.max(MIN_ASPECT, Math.min(MAX_ASPECT, value));
}

export type Grid = Float32Array;

export interface RasterGlyph {
  /** Ink coverage per cell, 0..1, length GRID*GRID. */
  ink: Grid;
  /** Distance-to-nearest-ink per cell, in cell units. */
  distance: Grid;
  /** Cells that carry ink, as flat indices - the chamfer sampling set. */
  inkCells: number[];
  /** height / width of the original ink, before it was squared off. */
  aspect: number;
  strokeCount: number;
  /** Total ink path length in normalised units; separates "3" from a scribble. */
  pathLength: number;
}

function pathLengthOf(points: readonly Point2D[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    total += Math.hypot(points[i]!.x - points[i - 1]!.x, points[i]!.y - points[i - 1]!.y);
  }
  return total;
}

/**
 * Draw a line into the grid with additive coverage.
 *
 * Sub-cell stepping matters: a fast fingertip can jump several cells between
 * frames, and without interpolation the glyph arrives as a dotted line whose
 * chamfer distance is dominated by the gaps rather than the shape.
 */
function drawLine(ink: Grid, ax: number, ay: number, bx: number, by: number): void {
  const steps = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) * 2));
  for (let step = 0; step <= steps; step += 1) {
    const t = step / steps;
    const x = ax + (bx - ax) * t;
    const y = ay + (by - ay) * t;
    // Bilinear splat, so a line that runs between two cells lights both rather
    // than aliasing onto whichever one it happens to round into.
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const fx = x - x0;
    const fy = y - y0;
    for (let dy = 0; dy <= 1; dy += 1) {
      for (let dx = 0; dx <= 1; dx += 1) {
        const cx = x0 + dx;
        const cy = y0 + dy;
        if (cx < 0 || cy < 0 || cx >= GRID || cy >= GRID) continue;
        const weight = (dx ? fx : 1 - fx) * (dy ? fy : 1 - fy);
        const index = cy * GRID + cx;
        ink[index] = Math.min(1, ink[index]! + weight);
      }
    }
  }
}

/**
 * Two-pass chamfer distance transform (Rosenfeld-Pfaltz).
 *
 * Gives, for every cell, the approximate distance to the nearest inked cell.
 * Comparing "how far is your ink from my ink" through this is what makes the
 * match tolerant of wobbly handwriting while still refusing genuinely different
 * shapes.
 */
function distanceTransform(ink: Grid): Grid {
  const out = new Float32Array(GRID * GRID);
  const BIG = GRID * 4;
  for (let i = 0; i < out.length; i += 1) out[i] = ink[i]! > 0.16 ? 0 : BIG;

  const relax = (index: number, from: number, cost: number) => {
    const candidate = out[from]! + cost;
    if (candidate < out[index]!) out[index] = candidate;
  };

  for (let y = 0; y < GRID; y += 1) {
    for (let x = 0; x < GRID; x += 1) {
      const i = y * GRID + x;
      if (x > 0) relax(i, i - 1, 1);
      if (y > 0) relax(i, i - GRID, 1);
      if (x > 0 && y > 0) relax(i, i - GRID - 1, 1.4142);
      if (x < GRID - 1 && y > 0) relax(i, i - GRID + 1, 1.4142);
    }
  }
  for (let y = GRID - 1; y >= 0; y -= 1) {
    for (let x = GRID - 1; x >= 0; x -= 1) {
      const i = y * GRID + x;
      if (x < GRID - 1) relax(i, i + 1, 1);
      if (y < GRID - 1) relax(i, i + GRID, 1);
      if (x < GRID - 1 && y < GRID - 1) relax(i, i + GRID + 1, 1.4142);
      if (x > 0 && y < GRID - 1) relax(i, i + GRID - 1, 1.4142);
    }
  }
  return out;
}

/**
 * Turn strokes into a comparable raster.
 *
 * The glyph is scaled by its longest side (so the shape is never stretched) and
 * centred. Aspect ratio is preserved separately as a feature rather than being
 * baked into the pixels, because squashing a "1" into a square makes it look
 * like a "7".
 */
export function rasterize(strokes: readonly (readonly Point2D[])[]): RasterGlyph | null {
  const usable = strokes.filter((stroke) => stroke.length > 0);
  if (usable.length === 0) return null;

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const stroke of usable) {
    for (const point of stroke) {
      if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) continue;
      minX = Math.min(minX, point.x); maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y); maxY = Math.max(maxY, point.y);
    }
  }
  if (!Number.isFinite(minX) || !Number.isFinite(minY)) return null;

  const width = Math.max(maxX - minX, 1e-6);
  const height = Math.max(maxY - minY, 1e-6);
  const scale = Math.max(width, height);
  // One cell of padding all round: strokes that touch the border lose half their
  // bilinear weight off-grid otherwise, which quietly thins the outer edges.
  const usable_span = GRID - 3;
  const offsetX = (GRID - (width / scale) * usable_span) / 2;
  const offsetY = (GRID - (height / scale) * usable_span) / 2;

  const toCell = (point: Point2D) => ({
    x: offsetX + ((point.x - minX) / scale) * usable_span,
    y: offsetY + ((point.y - minY) / scale) * usable_span
  });

  const ink = new Float32Array(GRID * GRID);
  let totalLength = 0;
  for (const stroke of usable) {
    totalLength += pathLengthOf(stroke) / scale;
    if (stroke.length === 1) {
      const only = toCell(stroke[0]!);
      drawLine(ink, only.x, only.y, only.x, only.y);
      continue;
    }
    for (let i = 1; i < stroke.length; i += 1) {
      const a = toCell(stroke[i - 1]!);
      const b = toCell(stroke[i]!);
      drawLine(ink, a.x, a.y, b.x, b.y);
    }
  }

  const inkCells: number[] = [];
  for (let i = 0; i < ink.length; i += 1) if (ink[i]! > 0.16) inkCells.push(i);
  if (inkCells.length === 0) return null;

  return {
    ink,
    distance: distanceTransform(ink),
    inkCells,
    aspect: clampAspect(height / width),
    strokeCount: usable.filter((stroke) => stroke.length > 1).length || usable.length,
    pathLength: totalLength
  };
}

/**
 * Symmetric chamfer distance between two rasters, in cell units.
 *
 * Symmetry is the point. A one-way chamfer rewards glyphs that are a subset of
 * the template: a bare vertical line sits entirely on top of a "4" and scores
 * beautifully in one direction. Measuring both ways means the template's own ink
 * must also be covered, so missing parts of a letter are penalised as heavily as
 * extra ones. That is what stops a half-finished character from being accepted.
 */
export function chamfer(a: RasterGlyph, b: RasterGlyph): number {
  let forward = 0;
  for (const cell of a.inkCells) forward += b.distance[cell]!;
  forward /= a.inkCells.length;

  let backward = 0;
  for (const cell of b.inkCells) backward += a.distance[cell]!;
  backward /= b.inkCells.length;

  // The worse direction dominates, so a glyph cannot pass by being good one way.
  return Math.max(forward, backward) * 0.65 + ((forward + backward) / 2) * 0.35;
}

/** Overlap of inked area, 0..1. Cheap tie-breaker for shapes of similar chamfer. */
export function overlap(a: RasterGlyph, b: RasterGlyph): number {
  let intersection = 0;
  let union = 0;
  for (let i = 0; i < a.ink.length; i += 1) {
    const av = a.ink[i]!;
    const bv = b.ink[i]!;
    intersection += Math.min(av, bv);
    union += Math.max(av, bv);
  }
  return union < 1e-9 ? 0 : intersection / union;
}
