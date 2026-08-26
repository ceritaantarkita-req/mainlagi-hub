import { distance, pathLength } from "./geometry";
import type { Point } from "./types";

/**
 * $P point-cloud recognizer.
 *
 * The previous matcher compared resampled paths index by index, which only
 * works when the writer produces points at the same rate and in the same order
 * as the template. It also had to concatenate separate strokes into one path,
 * inventing a phantom line across every pen-up.
 *
 * $P treats a glyph as an unordered cloud of points, so multi-stroke digits
 * (4, 5, 7) and multi-stroke Arabic letters are handled natively, stroke order
 * does not matter, and pen-ups never create phantom geometry.
 *
 * Reference: Vatavu, Anthony & Wobbrock, "Gestures as Point Clouds: A $P
 * Recognizer for User Interface Prototypes" (ICMI 2012).
 */

export const CLOUD_POINTS = 48;

export interface CloudPoint extends Point {
  /** Index of the stroke this point came from. */
  stroke: number;
}

function centroid(points: readonly CloudPoint[]): { x: number; y: number } {
  const sum = points.reduce(
    (accumulator, point) => ({
      x: accumulator.x + point.x,
      y: accumulator.y + point.y
    }),
    { x: 0, y: 0 }
  );
  return { x: sum.x / points.length, y: sum.y / points.length };
}

/**
 * Resamples every stroke so the whole glyph carries `count` points, allocated
 * in proportion to each stroke's length. A tiny dot therefore contributes a
 * couple of points, not a third of the cloud.
 */
function resampleStrokes(
  strokes: readonly (readonly Point[])[],
  count: number
): CloudPoint[] {
  const usable = strokes.filter((stroke) => stroke.length >= 1);
  if (!usable.length) return [];

  const lengths = usable.map((stroke) => Math.max(pathLength(stroke), 1e-6));
  const total = lengths.reduce((sum, value) => sum + value, 0);
  const output: CloudPoint[] = [];

  for (let index = 0; index < usable.length; index += 1) {
    const stroke = usable[index]!;
    const share = Math.max(
      2,
      Math.round((lengths[index]! / total) * count)
    );

    if (stroke.length === 1) {
      // A dot: represent it with a couple of coincident points so that it
      // still contributes position information without dominating the cloud.
      output.push({ ...stroke[0]!, stroke: index });
      output.push({ ...stroke[0]!, stroke: index });
      continue;
    }

    const interval = lengths[index]! / (share - 1);
    let accumulated = 0;
    let previous = stroke[0]!;
    output.push({ x: previous.x, y: previous.y, stroke: index });

    for (let step = 1; step < stroke.length; step += 1) {
      const current = stroke[step]!;
      let segment = distance(previous, current);
      if (segment < 1e-9) continue;

      while (
        accumulated + segment >= interval &&
        output.filter((point) => point.stroke === index).length < share
      ) {
        const ratio = (interval - accumulated) / segment;
        const inserted = {
          x: previous.x + ratio * (current.x - previous.x),
          y: previous.y + ratio * (current.y - previous.y)
        };
        output.push({ ...inserted, stroke: index });
        previous = inserted;
        segment = distance(previous, current);
        accumulated = 0;
      }
      accumulated += segment;
      previous = current;
    }

    while (output.filter((point) => point.stroke === index).length < share) {
      const last = stroke[stroke.length - 1]!;
      output.push({ x: last.x, y: last.y, stroke: index });
    }
  }

  return output;
}

/**
 * How the cloud is fitted before comparison.
 *
 * - `uniform` keeps the aspect ratio, so a tall thin "1" stays tall and thin.
 *   This is what separates 1 from 0.
 * - `square` stretches each axis independently to a unit box. Handwriting is
 *   routinely squeezed or stretched - a child writing in a narrow column, an
 *   adult writing wide - and without this, correct digits are rejected purely
 *   for being the wrong proportion.
 *
 * The recognizer scores both and keeps the better one, with `uniform`
 * preferred on ties. Aspect information is not lost, it moves into the
 * structural feature penalties where it can be applied per digit.
 */
export type CloudFit = "uniform" | "square";

export function normalizeCloud(
  strokes: readonly (readonly Point[])[],
  count = CLOUD_POINTS,
  fit: CloudFit = "uniform"
): CloudPoint[] {
  const resampled = resampleStrokes(strokes, count);
  if (!resampled.length) return [];

  const xs = resampled.map((point) => point.x);
  const ys = resampled.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const width = maxX - minX;
  const height = maxY - minY;
  const longest = Math.max(width, height, 1e-6);
  const scaleX = fit === "square" ? Math.max(width, 1e-6) : longest;
  const scaleY = fit === "square" ? Math.max(height, 1e-6) : longest;

  const scaled = resampled.map((point) => ({
    x: (point.x - minX) / scaleX,
    y: (point.y - minY) / scaleY,
    stroke: point.stroke
  }));
  const middle = centroid(scaled);

  return scaled.map((point) => ({
    x: point.x - middle.x,
    y: point.y - middle.y,
    stroke: point.stroke
  }));
}

function cloudDistance(
  candidate: readonly CloudPoint[],
  template: readonly CloudPoint[],
  startIndex: number
): number {
  const matched = new Array<boolean>(template.length).fill(false);
  let sum = 0;
  let index = startIndex;
  let weightIndex = 0;

  do {
    let best = Number.POSITIVE_INFINITY;
    let bestIndex = -1;

    for (let target = 0; target < template.length; target += 1) {
      if (matched[target]) continue;
      const candidatePoint = candidate[index]!;
      const templatePoint = template[target]!;
      const value = Math.hypot(
        candidatePoint.x - templatePoint.x,
        candidatePoint.y - templatePoint.y
      );
      if (value < best) {
        best = value;
        bestIndex = target;
      }
    }

    if (bestIndex >= 0) matched[bestIndex] = true;
    // Points visited early weigh more, which is what makes the greedy
    // approximation stable.
    const weight = 1 - weightIndex / candidate.length;
    sum += weight * (Number.isFinite(best) ? best : 1);

    index = (index + 1) % candidate.length;
    weightIndex += 1;
  } while (index !== startIndex);

  return sum;
}

/**
 * Greedy cloud match, averaged over a few start points.
 *
 * Lower is better. Values are roughly comparable across glyphs because both
 * clouds are normalized to a unit box.
 */
export function matchClouds(
  candidate: readonly CloudPoint[],
  template: readonly CloudPoint[]
): number {
  if (!candidate.length || !template.length) return Number.POSITIVE_INFINITY;
  if (candidate.length !== template.length) return Number.POSITIVE_INFINITY;

  const steps = Math.max(1, Math.round(candidate.length * 0.25));
  let best = Number.POSITIVE_INFINITY;

  for (let start = 0; start < candidate.length; start += steps) {
    best = Math.min(
      best,
      cloudDistance(candidate, template, start),
      cloudDistance(template, candidate, start)
    );
  }

  // Normalize by point count so the score does not scale with resolution.
  return best / candidate.length;
}
