// GENERATED FILE - do not edit here.
// Source of truth: _vision-core/. Re-run `node _vision-core/sync.mjs` after changes.
/**
 * Reference shapes for the digits 0-9.
 *
 * Written the way people actually write them: 4, 5 and 7 are two strokes, and the
 * pen-up travel between strokes is no longer baked into the path as if it were
 * ink. Each digit also carries several variants (common alternative stroke orders
 * and shapes) so the recogniser is not fooled by a legitimate style difference.
 *
 * Coordinates live in a 0..1 box where y grows downward, matching screen space.
 */

import type { Point2D } from "./coordinate";
import type { GlyphStroke, GlyphTemplate } from "./glyph";
import { clampAspect } from "./raster";

type Stroke = Point2D[];

function line(x1: number, y1: number, x2: number, y2: number, steps = 14): Stroke {
  return Array.from({ length: steps }, (_, index) => {
    const t = steps === 1 ? 1 : index / (steps - 1);
    return { x: x1 + (x2 - x1) * t, y: y1 + (y2 - y1) * t };
  });
}

function arc(
  cx: number, cy: number, rx: number, ry: number,
  fromDegrees: number, toDegrees: number, steps = 26
): Stroke {
  return Array.from({ length: steps }, (_, index) => {
    const t = steps === 1 ? 1 : index / (steps - 1);
    const angle = ((fromDegrees + (toDegrees - fromDegrees) * t) * Math.PI) / 180;
    return { x: cx + Math.cos(angle) * rx, y: cy + Math.sin(angle) * ry };
  });
}

function join(...parts: Stroke[]): Stroke {
  const result: Point2D[] = [];
  for (const part of parts) {
    for (const point of part) {
      const last = result[result.length - 1];
      if (!last || Math.hypot(last.x - point.x, last.y - point.y) > 1e-6) result.push(point);
    }
  }
  return result;
}

function boundsAspect(strokes: readonly GlyphStroke[]): number {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const stroke of strokes) {
    for (const point of stroke) {
      minX = Math.min(minX, point.x); maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y); maxY = Math.max(maxY, point.y);
    }
  }
  // Clamped: a dead-straight vertical stroke (the plain "1") has zero width,
  // and an unclamped ratio of ~1e6 would dominate the whole distance function.
  return clampAspect(Math.max(maxY - minY, 1e-6) / Math.max(maxX - minX, 1e-6));
}

function template(value: number, label: string, strokes: GlyphStroke[]): GlyphTemplate {
  return { value, label, strokes, aspect: boundsAspect(strokes) };
}

const DIGIT_VARIANTS: Array<{ value: number; strokes: Stroke[] }> = [
  // 0 - a single closed oval, both directions.
  { value: 0, strokes: [arc(0.5, 0.5, 0.30, 0.48, -90, 270, 40)] },
  { value: 0, strokes: [arc(0.5, 0.5, 0.30, 0.48, 270, -90, 40)] },

  // 1 - the bare vertical stroke, and the version with a small entry serif.
  { value: 1, strokes: [line(0.5, 0.02, 0.5, 0.98, 26)] },
  { value: 1, strokes: [join(line(0.30, 0.20, 0.50, 0.03, 8), line(0.50, 0.03, 0.50, 0.98, 24))] },
  // 1 with a base bar (common in Indonesian schools).
  { value: 1, strokes: [join(line(0.32, 0.18, 0.50, 0.03, 8), line(0.50, 0.03, 0.50, 0.92, 22)), line(0.28, 0.97, 0.72, 0.97, 10)] },

  // 2 - top curve into a diagonal, then the base.
  { value: 2, strokes: [join(arc(0.50, 0.22, 0.28, 0.20, 180, 20, 22), line(0.74, 0.32, 0.20, 0.92, 20), line(0.20, 0.94, 0.82, 0.94, 14))] },

  // 3 - two stacked bowls.
  { value: 3, strokes: [join(arc(0.48, 0.26, 0.26, 0.24, 190, 90, 22), arc(0.48, 0.73, 0.28, 0.25, 270, 90, 24))] },
  // 3 with a flat top bar.
  { value: 3, strokes: [join(line(0.22, 0.05, 0.74, 0.05, 12), line(0.74, 0.05, 0.44, 0.44, 12), arc(0.46, 0.70, 0.28, 0.27, 275, 95, 24))] },

  // 4 - two strokes: the open V down to the crossbar, then the vertical.
  { value: 4, strokes: [join(line(0.62, 0.03, 0.14, 0.64, 20), line(0.14, 0.64, 0.88, 0.64, 18)), line(0.66, 0.03, 0.66, 0.98, 22)] },
  // 4 closed, drawn as one stroke.
  { value: 4, strokes: [join(line(0.62, 0.03, 0.14, 0.64, 18), line(0.14, 0.64, 0.88, 0.64, 16), line(0.68, 0.30, 0.68, 0.98, 16))] },

  // 5 - the body, then the top bar as a separate stroke.
  { value: 5, strokes: [join(line(0.72, 0.05, 0.26, 0.05, 12), line(0.26, 0.05, 0.22, 0.45, 12), arc(0.50, 0.68, 0.30, 0.29, 190, 90, 26))] },
  { value: 5, strokes: [join(line(0.26, 0.05, 0.22, 0.45, 12), arc(0.50, 0.68, 0.30, 0.29, 190, 90, 26)), line(0.24, 0.05, 0.76, 0.05, 12)] },

  // 6 - a descending curve closing into a loop.
  { value: 6, strokes: [join(arc(0.52, 0.30, 0.30, 0.28, -60, 180, 24), arc(0.50, 0.70, 0.29, 0.27, 180, 540, 30))] },

  // 7 - top bar then the diagonal, both as one stroke and as two.
  { value: 7, strokes: [join(line(0.16, 0.05, 0.84, 0.05, 16), line(0.84, 0.05, 0.36, 0.97, 22))] },
  { value: 7, strokes: [line(0.16, 0.05, 0.84, 0.05, 16), line(0.82, 0.07, 0.36, 0.97, 20)] },
  // 7 with the European crossbar.
  { value: 7, strokes: [join(line(0.16, 0.05, 0.84, 0.05, 14), line(0.84, 0.05, 0.36, 0.97, 20)), line(0.30, 0.52, 0.68, 0.52, 8)] },

  // 8 - two loops.
  { value: 8, strokes: [join(arc(0.50, 0.26, 0.25, 0.24, 90, 450, 26), arc(0.50, 0.74, 0.29, 0.25, 270, -90, 26))] },

  // 9 - loop on top with a tail.
  { value: 9, strokes: [join(arc(0.50, 0.28, 0.28, 0.26, 0, 360, 28), line(0.78, 0.28, 0.70, 0.98, 18))] },
  { value: 9, strokes: [arc(0.50, 0.28, 0.28, 0.26, 0, 360, 28), line(0.78, 0.30, 0.68, 0.98, 16)] }
];


function cubic(
  p0: Point2D, c1: Point2D, c2: Point2D, p1: Point2D, steps = 24
): Stroke {
  return Array.from({ length: steps }, (_, index) => {
    const t = steps === 1 ? 1 : index / (steps - 1);
    const inv = 1 - t;
    return {
      x: inv * inv * inv * p0.x + 3 * inv * inv * t * c1.x + 3 * inv * t * t * c2.x + t * t * t * p1.x,
      y: inv * inv * inv * p0.y + 3 * inv * inv * t * c1.y + 3 * inv * t * t * c2.y + t * t * t * p1.y
    };
  });
}

function ellipse(cx: number, cy: number, rx: number, ry: number, steps = 48): Stroke {
  return Array.from({ length: steps }, (_, index) => {
    const angle = -Math.PI / 2 + (index / (steps - 1)) * Math.PI * 2;
    return { x: cx + Math.cos(angle) * rx, y: cy + Math.sin(angle) * ry };
  });
}

/**
 * A second family of reference shapes, using rounder bowls and different stroke
 * geometry for 3, 5, 6 and 8.
 *
 * These matter: a cross-check showed that a recogniser carrying only one shape
 * family scores 100% on handwriting in its own style and about 60% on the other,
 * with 3, 5, 6 and 8 failing every single time. People write both ways, so both
 * families ship.
 */
const ROUND_VARIANTS: Array<{ value: number; strokes: Stroke[] }> = [
  { value: 0, strokes: [ellipse(0.5, 0.5, 0.32, 0.44, 60)] },
  { value: 1, strokes: [join(line(0.38, 0.22, 0.53, 0.08, 8), line(0.53, 0.08, 0.53, 0.92, 30))] },
  { value: 2, strokes: [join(
      cubic({ x: 0.18, y: 0.28 }, { x: 0.22, y: 0.02 }, { x: 0.82, y: 0.02 }, { x: 0.84, y: 0.28 }, 22),
      cubic({ x: 0.84, y: 0.28 }, { x: 0.84, y: 0.48 }, { x: 0.28, y: 0.62 }, { x: 0.18, y: 0.88 }, 24),
      line(0.18, 0.88, 0.86, 0.88, 16)
    )] },
  { value: 3, strokes: [join(
      cubic({ x: 0.2, y: 0.18 }, { x: 0.45, y: 0.02 }, { x: 0.84, y: 0.1 }, { x: 0.72, y: 0.43 }, 24),
      cubic({ x: 0.72, y: 0.43 }, { x: 0.96, y: 0.52 }, { x: 0.74, y: 0.96 }, { x: 0.2, y: 0.82 }, 28)
    )] },
  { value: 4, strokes: [join(
      line(0.72, 0.08, 0.2, 0.62, 20), line(0.2, 0.62, 0.86, 0.62, 20),
      line(0.86, 0.62, 0.66, 0.62, 6), line(0.66, 0.62, 0.66, 0.92, 12)
    )] },
  { value: 5, strokes: [join(
      line(0.82, 0.1, 0.25, 0.1, 16), line(0.25, 0.1, 0.22, 0.5, 14),
      cubic({ x: 0.22, y: 0.5 }, { x: 0.48, y: 0.38 }, { x: 0.86, y: 0.48 }, { x: 0.82, y: 0.72 }, 22),
      cubic({ x: 0.82, y: 0.72 }, { x: 0.78, y: 0.98 }, { x: 0.3, y: 0.98 }, { x: 0.18, y: 0.8 }, 20)
    )] },
  { value: 6, strokes: [join(
      cubic({ x: 0.76, y: 0.14 }, { x: 0.3, y: 0.02 }, { x: 0.12, y: 0.5 }, { x: 0.22, y: 0.76 }, 26),
      cubic({ x: 0.22, y: 0.76 }, { x: 0.34, y: 1.02 }, { x: 0.82, y: 0.94 }, { x: 0.8, y: 0.66 }, 22),
      cubic({ x: 0.8, y: 0.66 }, { x: 0.78, y: 0.42 }, { x: 0.36, y: 0.36 }, { x: 0.22, y: 0.64 }, 20)
    )] },
  { value: 7, strokes: [join(line(0.16, 0.12, 0.86, 0.12, 18), line(0.86, 0.12, 0.32, 0.92, 30))] },
  { value: 8, strokes: [Array.from({ length: 80 }, (_, index) => {
      const t = (index / 79) * Math.PI * 2;
      return { x: 0.5 + 0.29 * Math.sin(2 * t), y: 0.5 - 0.43 * Math.cos(t) };
    })] },
  { value: 9, strokes: [join(
      ellipse(0.5, 0.32, 0.3, 0.26, 40),
      cubic({ x: 0.5, y: 0.06 }, { x: 0.84, y: 0.24 }, { x: 0.8, y: 0.72 }, { x: 0.38, y: 0.92 }, 28)
    )] }
];


/**
 * A third shape family, covering the rounder "warung" style used in the
 * Indonesian primary-school worksheets the games are modelled on. Its 6 and 9 in
 * particular are drawn with a loop that the other two families do not cover.
 */
const LOOPED_VARIANTS: Array<{ value: number; strokes: Stroke[] }> = [
  { value: 0, strokes: [ellipse(0.5, 0.5, 0.28, 0.40, 56)] },
  { value: 1, strokes: [join(line(0.38, 0.27, 0.51, 0.12, 8), line(0.51, 0.12, 0.51, 0.88, 30), line(0.35, 0.88, 0.67, 0.88, 10))] },
  { value: 2, strokes: [join(
      cubic({ x: 0.22, y: 0.28 }, { x: 0.32, y: 0.03 }, { x: 0.80, y: 0.08 }, { x: 0.79, y: 0.33 }, 22),
      cubic({ x: 0.79, y: 0.33 }, { x: 0.75, y: 0.50 }, { x: 0.28, y: 0.66 }, { x: 0.20, y: 0.87 }, 22),
      line(0.20, 0.87, 0.82, 0.87, 16)
    )] },
  { value: 3, strokes: [join(
      cubic({ x: 0.24, y: 0.20 }, { x: 0.50, y: 0.03 }, { x: 0.83, y: 0.13 }, { x: 0.66, y: 0.46 }, 26),
      cubic({ x: 0.66, y: 0.46 }, { x: 0.88, y: 0.54 }, { x: 0.80, y: 0.91 }, { x: 0.24, y: 0.82 }, 28)
    )] },
  { value: 4, strokes: [
      join(line(0.70, 0.10, 0.22, 0.62, 22), line(0.22, 0.62, 0.82, 0.62, 20)),
      line(0.68, 0.10, 0.68, 0.90, 26)
    ] },
  { value: 5, strokes: [
      join(line(0.28, 0.14, 0.25, 0.50, 14),
           cubic({ x: 0.25, y: 0.50 }, { x: 0.48, y: 0.37 }, { x: 0.82, y: 0.47 }, { x: 0.78, y: 0.72 }, 22),
           cubic({ x: 0.78, y: 0.72 }, { x: 0.72, y: 0.98 }, { x: 0.28, y: 0.91 }, { x: 0.20, y: 0.78 }, 20)),
      line(0.78, 0.14, 0.28, 0.14, 16)
    ] },
  { value: 6, strokes: [join(
      cubic({ x: 0.72, y: 0.14 }, { x: 0.35, y: 0.08 }, { x: 0.18, y: 0.44 }, { x: 0.25, y: 0.67 }, 26),
      arc(0.49, 0.66, 0.27, 0.24, 180, 540, 40)
    )] },
  { value: 7, strokes: [join(line(0.20, 0.15, 0.82, 0.15, 18), line(0.82, 0.15, 0.37, 0.90, 30))] },
  { value: 8, strokes: [join(
      cubic({ x: 0.50, y: 0.50 }, { x: 0.12, y: 0.28 }, { x: 0.27, y: 0.08 }, { x: 0.52, y: 0.12 }, 18),
      cubic({ x: 0.52, y: 0.12 }, { x: 0.84, y: 0.13 }, { x: 0.88, y: 0.40 }, { x: 0.50, y: 0.50 }, 18),
      cubic({ x: 0.50, y: 0.50 }, { x: 0.12, y: 0.65 }, { x: 0.24, y: 0.92 }, { x: 0.50, y: 0.88 }, 20),
      cubic({ x: 0.50, y: 0.88 }, { x: 0.86, y: 0.92 }, { x: 0.88, y: 0.63 }, { x: 0.50, y: 0.50 }, 20)
    )] },
  { value: 9, strokes: [join(
      arc(0.50, 0.34, 0.27, 0.23, 90, 450, 38),
      cubic({ x: 0.75, y: 0.35 }, { x: 0.75, y: 0.61 }, { x: 0.64, y: 0.85 }, { x: 0.35, y: 0.90 }, 28)
    )] }
];

export function createDigitTemplates(): GlyphTemplate[] {
  return [...DIGIT_VARIANTS, ...ROUND_VARIANTS, ...LOOPED_VARIANTS].map((variant) =>
    template(variant.value, String(variant.value), variant.strokes)
  );
}

export { line as templateLine, arc as templateArc, join as templateJoin, boundsAspect };
