import { bounds, pathLength } from "./geometry";
import type { Point } from "./types";

/**
 * Structural features of a handwritten glyph.
 *
 * Shape distance alone cannot separate digits that are rotations or partial
 * copies of each other. The clearest example is 6 versus 9: they are the same
 * curve rotated 180 degrees, so any position-normalized distance metric puts
 * them almost on top of each other. What actually distinguishes them is *where
 * the closed loop sits* - low for 6, high for 9 - and that is a structural
 * fact, not a distance.
 */
export interface GlyphFeatures {
  /** Number of strokes that carry real length. */
  strokeCount: number;
  /** Bounding-box width divided by height. */
  aspect: number;
  /** Number of times the glyph crosses itself. */
  crossings: number;
  /**
   * Vertical centre of each detected loop, 0 = top of the glyph, 1 = bottom.
   * Sorted top to bottom.
   */
  loopCenters: number[];
  /** Start and end points, normalized into the bounding box. */
  start: Point;
  end: Point;
  /** Direction of the first 15% of the path, in radians (-pi..pi). */
  initialDirection: number;
  /** Total signed turning, in turns. Roughly +/-1 for a full circle. */
  netRotation: number;
  /** Straight-line distance between start and end, relative to glyph size. */
  closure: number;
  /** Path length divided by bounding-box diagonal. */
  complexity: number;
}

interface Segment {
  ax: number;
  ay: number;
  bx: number;
  by: number;
  /** Index of the source point, used to slice out loops. */
  index: number;
  stroke: number;
}

function segmentsOf(strokes: readonly (readonly Point[])[]): Segment[] {
  const segments: Segment[] = [];
  let running = 0;
  for (let strokeIndex = 0; strokeIndex < strokes.length; strokeIndex += 1) {
    const points = strokes[strokeIndex]!;
    for (let index = 1; index < points.length; index += 1) {
      const a = points[index - 1]!;
      const b = points[index]!;
      segments.push({
        ax: a.x,
        ay: a.y,
        bx: b.x,
        by: b.y,
        index: running + index,
        stroke: strokeIndex
      });
    }
    running += points.length;
  }
  return segments;
}

function intersect(
  first: Segment,
  second: Segment
): { x: number; y: number } | null {
  const r1x = first.bx - first.ax;
  const r1y = first.by - first.ay;
  const r2x = second.bx - second.ax;
  const r2y = second.by - second.ay;
  const denominator = r1x * r2y - r1y * r2x;
  if (Math.abs(denominator) < 1e-12) return null;

  const dx = second.ax - first.ax;
  const dy = second.ay - first.ay;
  const t = (dx * r2y - dy * r2x) / denominator;
  const u = (dx * r1y - dy * r1x) / denominator;
  if (t < 0 || t > 1 || u < 0 || u > 1) return null;

  return { x: first.ax + t * r1x, y: first.ay + t * r1y };
}

function angleBetween(
  from: Point,
  to: Point
): number {
  return Math.atan2(to.y - from.y, to.x - from.x);
}

function normalizeAngle(value: number): number {
  let angle = value;
  while (angle > Math.PI) angle -= Math.PI * 2;
  while (angle < -Math.PI) angle += Math.PI * 2;
  return angle;
}

function pointToSegment(
  px: number,
  py: number,
  segment: Segment
): number {
  const dx = segment.bx - segment.ax;
  const dy = segment.by - segment.ay;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared < 1e-12) return Math.hypot(px - segment.ax, py - segment.ay);
  const t = Math.max(
    0,
    Math.min(1, ((px - segment.ax) * dx + (py - segment.ay) * dy) / lengthSquared)
  );
  return Math.hypot(px - (segment.ax + t * dx), py - (segment.ay + t * dy));
}

function segmentGap(first: Segment, second: Segment): number {
  if (intersect(first, second)) return 0;
  return Math.min(
    pointToSegment(first.ax, first.ay, second),
    pointToSegment(first.bx, first.by, second),
    pointToSegment(second.ax, second.ay, first),
    pointToSegment(second.bx, second.by, first)
  );
}

/**
 * Finds loops and reports where each one sits vertically.
 *
 * This is the feature that separates 6 from 9 and identifies the two lobes of
 * an 8. Exact self-intersection is not enough on its own: a handwritten 6
 * frequently does not quite cross itself, and neither do the idealized
 * templates. A loop is therefore any place where the path comes back close to
 * itself after travelling a meaningful distance.
 */
function analyzeLoops(
  strokes: readonly (readonly Point[])[],
  box: ReturnType<typeof bounds>
): { crossings: number; loopCenters: number[] } {
  const segments = segmentsOf(strokes);
  const flat = strokes.flat();
  const height = Math.max(box.height, 1e-6);
  const diagonal = Math.max(Math.hypot(box.width, box.height), 1e-6);
  const proximity = diagonal * 0.09;
  /** A loop has to enclose a real span of the path, not two adjacent points. */
  const minSpan = Math.max(6, Math.round(segments.length * 0.12));

  /**
   * Signed turning between consecutive segments of the same stroke. A
   * genuine loop curls consistently in one rotational direction and racks up
   * a large total; a sharp corner, or a hand pausing and wobbling before
   * changing direction, turns one way and then mostly undoes it, so the
   * signed sum stays small. This is what keeps an open shape - a 4's diagonal
   * crossing its own bar, a 7's crossbar drawn as a backtrack instead of a
   * lifted second stroke, a hand overshooting a sharp corner - from reading
   * as "has a loop" just because the path happened to touch itself.
   */
  const directions = segments.map((segment) =>
    angleBetween({ x: segment.ax, y: segment.ay }, { x: segment.bx, y: segment.by })
  );
  const turnPrefix: number[] = [0];
  for (let index = 1; index < segments.length; index += 1) {
    const sameStroke = segments[index]!.stroke === segments[index - 1]!.stroke;
    const delta = sameStroke
      ? normalizeAngle(directions[index]! - directions[index - 1]!)
      : 0;
    turnPrefix.push(turnPrefix[index - 1]! + delta);
  }
  /** Minimum consistent winding, in radians, before a touch counts as a loop. */
  const LOOP_ROTATION_MIN = 3.0;

  const ranges: Array<{ from: number; to: number }> = [];
  let crossings = 0;

  for (let i = 0; i < segments.length; i += 1) {
    for (let j = i + minSpan; j < segments.length; j += 1) {
      const first = segments[i]!;
      const second = segments[j]!;
      if (first.stroke !== second.stroke) continue;
      const crosses = intersect(first, second) !== null;
      if (crosses) crossings += 1;
      if (!crosses && segmentGap(first, second) > proximity) continue;
      const winding = Math.abs(turnPrefix[j]! - turnPrefix[i]!);
      if (winding < LOOP_ROTATION_MIN) continue;
      ranges.push({ from: i, to: j });
    }
  }

  // Merge overlapping candidate ranges so one loop is counted once.
  ranges.sort((left, right) => left.from - right.from || right.to - left.to);
  const merged: Array<{ from: number; to: number }> = [];
  for (const range of ranges) {
    const current = merged[merged.length - 1];
    if (current && range.from <= current.to) {
      current.to = Math.max(current.to, range.to);
      continue;
    }
    merged.push({ ...range });
  }

  const loopCenters = merged
    .map((range) => {
      const first = segments[range.from]!;
      const last = segments[range.to]!;
      const slice = flat.slice(first.index - 1, last.index + 1);
      if (slice.length < 3) return null;
      const mean = slice.reduce((sum, point) => sum + point.y, 0) / slice.length;
      return (mean - box.minY) / height;
    })
    .filter((value): value is number => value !== null)
    .sort((a, b) => a - b);

  return { crossings, loopCenters };
}

export function extractFeatures(
  strokes: readonly (readonly Point[])[]
): GlyphFeatures {
  const usable = strokes.filter((stroke) => stroke.length >= 2);
  const flat = usable.flat();
  const box = bounds(flat.length ? flat : strokes.flat());
  const width = Math.max(box.width, 1e-6);
  const height = Math.max(box.height, 1e-6);
  const diagonal = Math.max(Math.hypot(box.width, box.height), 1e-6);

  const first = usable[0];
  const last = usable[usable.length - 1];
  const startRaw = first?.[0] ?? { x: box.minX, y: box.minY };
  const endRaw = last?.[last.length - 1] ?? { x: box.maxX, y: box.maxY };

  const start = {
    x: (startRaw.x - box.minX) / width,
    y: (startRaw.y - box.minY) / height
  };
  const end = {
    x: (endRaw.x - box.minX) / width,
    y: (endRaw.y - box.minY) / height
  };

  let initialDirection = 0;
  if (first && first.length >= 2) {
    const target = Math.max(
      1,
      Math.min(first.length - 1, Math.round(first.length * 0.15))
    );
    initialDirection = angleBetween(first[0]!, first[target]!);
  }

  let netRotation = 0;
  for (const stroke of usable) {
    for (let index = 2; index < stroke.length; index += 1) {
      const previous = angleBetween(stroke[index - 2]!, stroke[index - 1]!);
      const current = angleBetween(stroke[index - 1]!, stroke[index]!);
      netRotation += normalizeAngle(current - previous);
    }
  }

  const { crossings, loopCenters } = analyzeLoops(usable, box);
  const totalLength = usable.reduce(
    (sum, stroke) => sum + pathLength(stroke),
    0
  );

  return {
    strokeCount: usable.length,
    aspect: box.width / height,
    crossings,
    loopCenters,
    start,
    end,
    initialDirection,
    netRotation: netRotation / (Math.PI * 2),
    closure: Math.hypot(endRaw.x - startRaw.x, endRaw.y - startRaw.y) / diagonal,
    complexity: totalLength / diagonal
  };
}
