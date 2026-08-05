// GENERATED FILE - do not edit here.
// Source of truth: _vision-core/. Re-run `node _vision-core/sync.mjs` after changes.
/**
 * 2D shape detection with auto-correction, plus isometric pseudo-3D solids.
 *
 * WHAT AUTO-CORRECTION IS FOR
 *
 * Nobody draws a clean rectangle in mid-air. Freehand strokes wobble, corners
 * round off, and the two ends of a "closed" shape never quite meet. Presenting
 * that raw is what makes an air-drawing tool feel broken even when the tracking
 * is perfect. So the stroke is classified, and then *replaced* with the ideal
 * form of whatever the user was clearly attempting - fitted to their own size
 * and position, so it still feels like their drawing.
 *
 * Classification is geometric rather than template-based: corner count, how
 * closed the path is, and how well it fits a circle. That generalises to any
 * size and orientation without a template library, and - unlike the glyph
 * recogniser - it cannot be confused by stroke direction.
 *
 * THE 3D HERE IS ISOMETRIC, DELIBERATELY
 *
 * These are 2D projections of solids, drawn on the same flat canvas. Real 3D
 * from a webcam would mean depending on MediaPipe's z coordinate, which is
 * coarse and noisy - a cube drawn with it would jitter and shear in ways the
 * user cannot correct for. An isometric projection is stable, reads clearly as
 * a solid, and costs nothing to render.
 */

import type { Point2D } from "./coordinate";

export type Shape2D = "line" | "rectangle" | "square" | "circle" | "ellipse" | "triangle" | "arrow" | "freehand";
export type Solid3D = "cube" | "box" | "pyramid" | "cylinder";

export interface ShapeFit {
  kind: Shape2D;
  confidence: number;
  /** Ideal form of the detected shape, ready to draw. */
  points: Point2D[];
  /** True when the path returns close to where it started. */
  closed: boolean;
  bounds: { minX: number; minY: number; maxX: number; maxY: number };
}

function distance(a: Point2D, b: Point2D): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function pathLength(points: readonly Point2D[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) total += distance(points[i]!, points[i - 1]!);
  return total;
}

function boundsOf(points: readonly Point2D[]) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const point of points) {
    minX = Math.min(minX, point.x); maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y); maxY = Math.max(maxY, point.y);
  }
  return { minX, minY, maxX, maxY };
}

function centroidOf(points: readonly Point2D[]): Point2D {
  let x = 0, y = 0;
  for (const point of points) { x += point.x; y += point.y; }
  return { x: x / points.length, y: y / points.length };
}

/** Even spacing along the path, so corner detection is not biased by drawing speed. */
function resampleEven(points: readonly Point2D[], count: number): Point2D[] {
  if (points.length < 2) return points.map((point) => ({ ...point }));
  const total = pathLength(points);
  if (total < 1e-9) return Array.from({ length: count }, () => ({ ...points[0]! }));
  const step = total / (count - 1);
  const out: Point2D[] = [{ ...points[0]! }];
  let accumulated = 0;
  let previous = points[0]!;
  for (let i = 1; i < points.length && out.length < count; ) {
    const segment = distance(previous, points[i]!);
    if (accumulated + segment >= step) {
      const ratio = (step - accumulated) / segment;
      const inserted = {
        x: previous.x + ratio * (points[i]!.x - previous.x),
        y: previous.y + ratio * (points[i]!.y - previous.y)
      };
      out.push(inserted);
      previous = inserted;
      accumulated = 0;
    } else {
      accumulated += segment;
      previous = points[i]!;
      i += 1;
    }
  }
  while (out.length < count) out.push({ ...points[points.length - 1]! });
  return out;
}

/**
 * Corners, found by turning angle over a window.
 *
 * A window rather than adjacent points: consecutive samples from a shaky hand
 * produce large spurious angles everywhere, and counting those would call every
 * drawing a polygon with forty sides.
 */
function findCorners(
  points: readonly Point2D[],
  closed: boolean,
  window = 4,
  thresholdDegrees = 48
): number[] {
  const count = points.length;
  if (count < window * 2 + 1) return [];

  // On a closed path the start and end are the same physical place, so the
  // last sample is dropped and indices wrap. Without this, the corner sitting
  // on the seam is invisible: a square reported three corners and was
  // classified as a triangle, and a triangle reported two and fell through to
  // freehand. Every closed polygon was therefore off by exactly one corner.
  const length = closed ? count - 1 : count;
  const at = (index: number) => points[((index % length) + length) % length]!;

  const scored: Array<{ index: number; turn: number }> = [];
  const from = closed ? 0 : window;
  const to = closed ? length : count - window;

  for (let i = from; i < to; i += 1) {
    const before = at(i - window);
    const here = at(i);
    const after = at(i + window);
    const ax = before.x - here.x, ay = before.y - here.y;
    const bx = after.x - here.x, by = after.y - here.y;
    const magnitude = Math.hypot(ax, ay) * Math.hypot(bx, by);
    if (magnitude < 1e-9) continue;
    const cosine = Math.max(-1, Math.min(1, (ax * bx + ay * by) / magnitude));
    const turn = 180 - (Math.acos(cosine) * 180) / Math.PI;
    if (turn >= thresholdDegrees) scored.push({ index: i, turn });
  }
  if (scored.length === 0) return [];

  // Non-maximum suppression: one physical corner spans several samples, and
  // keeping the sharpest of each cluster is what stops a four-corner shape
  // being reported as a twelve-corner one.
  const kept: Array<{ index: number; turn: number }> = [];
  const near = (a: number, b: number) => {
    const raw = Math.abs(a - b);
    return closed ? Math.min(raw, length - raw) <= window : raw <= window;
  };
  for (const candidate of [...scored].sort((a, b) => b.turn - a.turn)) {
    if (kept.some((entry) => near(entry.index, candidate.index))) continue;
    kept.push(candidate);
  }
  return kept.map((entry) => entry.index).sort((a, b) => a - b);
}

/**
 * How round a path is, measured after squashing it to a square.
 *
 * Testing raw distance-from-centre only recognises circles: a legitimate oval
 * has radii ranging from its minor to its major axis, which reads as enormous
 * variance and scores near zero. Normalising by the bounding box first turns
 * any ellipse into a circle, so this measures "is it a smooth closed curve"
 * rather than "is it specifically circular" - and the circle-vs-ellipse call is
 * then made separately, from the aspect ratio, where it belongs.
 */
function circularity(points: readonly Point2D[]): number {
  const bounds = boundsOf(points);
  const width = Math.max(bounds.maxX - bounds.minX, 1e-6);
  const height = Math.max(bounds.maxY - bounds.minY, 1e-6);
  const normalized = points.map((point) => ({
    x: (point.x - bounds.minX) / width,
    y: (point.y - bounds.minY) / height
  }));
  const centre = centroidOf(normalized);
  const radii = normalized.map((point) => distance(point, centre));
  const mean = radii.reduce((sum, value) => sum + value, 0) / radii.length;
  if (mean < 1e-9) return 0;
  const variance = radii.reduce((sum, value) => sum + (value - mean) ** 2, 0) / radii.length;
  return Math.max(0, 1 - Math.sqrt(variance) / mean / 0.42);
}

function rectanglePoints(b: { minX: number; minY: number; maxX: number; maxY: number }): Point2D[] {
  return [
    { x: b.minX, y: b.minY }, { x: b.maxX, y: b.minY },
    { x: b.maxX, y: b.maxY }, { x: b.minX, y: b.maxY },
    { x: b.minX, y: b.minY }
  ];
}

function ellipsePoints(cx: number, cy: number, rx: number, ry: number, steps = 64): Point2D[] {
  return Array.from({ length: steps + 1 }, (_, index) => {
    const angle = (index / steps) * Math.PI * 2;
    return { x: cx + Math.cos(angle) * rx, y: cy + Math.sin(angle) * ry };
  });
}

/**
 * Classify a freehand stroke and return its idealised form.
 *
 * Returns `freehand` when nothing fits well. That matters: silently snapping a
 * deliberate squiggle into a triangle is far more annoying than leaving it
 * alone, so the thresholds here are set to prefer doing nothing.
 */
export function detectShape(rawPoints: readonly Point2D[]): ShapeFit {
  const bounds = boundsOf(rawPoints);
  const fallback: ShapeFit = {
    kind: "freehand",
    confidence: 0,
    points: rawPoints.map((point) => ({ ...point })),
    closed: false,
    bounds
  };
  if (rawPoints.length < 6) return fallback;

  const points = resampleEven(rawPoints, 64);
  const width = Math.max(bounds.maxX - bounds.minX, 1e-6);
  const height = Math.max(bounds.maxY - bounds.minY, 1e-6);
  const diagonal = Math.hypot(width, height);
  const span = pathLength(points);
  if (diagonal < 1e-6 || span < 1e-6) return fallback;

  const gap = distance(points[0]!, points[points.length - 1]!);
  const closed = gap < diagonal * 0.22;
  const corners = findCorners(points, closed);

  // --- Straight line: the path barely deviates from its own chord. ---
  const chord = distance(points[0]!, points[points.length - 1]!);
  if (!closed && chord / span > 0.93) {
    return {
      kind: "line",
      confidence: Math.min(0.99, chord / span),
      points: [{ ...points[0]! }, { ...points[points.length - 1]! }],
      closed: false,
      bounds
    };
  }

  // --- Arrow: a line with a small V at the end (two corners near the tip). ---
  if (!closed && corners.length >= 1 && chord / span > 0.55) {
    const tailCorners = corners.filter((index) => index > points.length * 0.62);
    if (tailCorners.length >= 1 && chord / span > 0.62) {
      const tip = points[Math.min(points.length - 1, tailCorners[0]!)]!;
      const start = points[0]!;
      const angle = Math.atan2(tip.y - start.y, tip.x - start.x);
      const head = diagonal * 0.22;
      return {
        kind: "arrow",
        confidence: 0.72,
        points: [
          start, tip,
          { x: tip.x - Math.cos(angle - 0.42) * head, y: tip.y - Math.sin(angle - 0.42) * head },
          tip,
          { x: tip.x - Math.cos(angle + 0.42) * head, y: tip.y - Math.sin(angle + 0.42) * head }
        ],
        closed: false,
        bounds
      };
    }
  }

  if (!closed) return fallback;

  // --- Circle / ellipse: round, and with no real corners. ---
  const round = circularity(points);
  if (round > 0.62 && corners.length <= 2) {
    const centre = { x: (bounds.minX + bounds.maxX) / 2, y: (bounds.minY + bounds.maxY) / 2 };
    const ratio = width / height;
    const isCircle = ratio > 0.82 && ratio < 1.22;
    const radius = (width + height) / 4;
    return {
      kind: isCircle ? "circle" : "ellipse",
      confidence: Math.min(0.99, round),
      points: isCircle
        ? ellipsePoints(centre.x, centre.y, radius, radius)
        : ellipsePoints(centre.x, centre.y, width / 2, height / 2),
      closed: true,
      bounds
    };
  }

  // --- Triangle: three corners. Snapped to the user's own three corners so an
  //     intentionally scalene triangle is not forced into an equilateral one.
  if (corners.length === 3) {
    const vertices = corners.map((index) => ({ ...points[index]! }));
    return {
      kind: "triangle",
      confidence: 0.8,
      points: [...vertices, vertices[0]!],
      closed: true,
      bounds
    };
  }

  // --- Rectangle / square: four corners. ---
  if (corners.length === 4) {
    const ratio = width / height;
    const square = ratio > 0.85 && ratio < 1.18;
    if (square) {
      const side = (width + height) / 2;
      const centre = { x: (bounds.minX + bounds.maxX) / 2, y: (bounds.minY + bounds.maxY) / 2 };
      const half = side / 2;
      return {
        kind: "square",
        confidence: 0.82,
        points: rectanglePoints({
          minX: centre.x - half, maxX: centre.x + half,
          minY: centre.y - half, maxY: centre.y + half
        }),
        closed: true,
        bounds
      };
    }
    return { kind: "rectangle", confidence: 0.8, points: rectanglePoints(bounds), closed: true, bounds };
  }

  return { ...fallback, closed };
}

/* ------------------------------------------------------------------ *
 * Isometric solids
 * ------------------------------------------------------------------ */

export interface SolidRender {
  kind: Solid3D;
  /** Polylines to stroke, back faces first so the front overdraws them. */
  paths: Point2D[][];
  /** Edges that are hidden behind the solid, for dashed rendering. */
  hidden: Point2D[][];
}

/** Standard 2:1 isometric projection. */
function iso(x: number, y: number, z: number, scale: number, origin: Point2D): Point2D {
  return {
    x: origin.x + (x - y) * scale * 0.866,
    y: origin.y + ((x + y) * 0.5 - z) * scale
  };
}

/**
 * Build a solid sized to fit the box the user drew.
 *
 * Taking the footprint from their own stroke is what makes this feel like
 * drawing rather than stamping a clipart cube.
 */
export function buildSolid(
  kind: Solid3D,
  bounds: { minX: number; minY: number; maxX: number; maxY: number }
): SolidRender {
  const width = Math.max(bounds.maxX - bounds.minX, 1e-6);
  const height = Math.max(bounds.maxY - bounds.minY, 1e-6);
  const origin = { x: (bounds.minX + bounds.maxX) / 2, y: (bounds.minY + bounds.maxY) / 2 };
  const scale = Math.min(width, height) / 2.4;

  if (kind === "cylinder") {
    const radius = Math.min(width, height) / 2.2;
    const depth = height / 2.4;
    const top = ellipsePoints(origin.x, origin.y - depth / 2, radius, radius * 0.42);
    const bottomVisible = ellipsePoints(origin.x, origin.y + depth / 2, radius, radius * 0.42)
      .filter((point) => point.y >= origin.y + depth / 2);
    const bottomHidden = ellipsePoints(origin.x, origin.y + depth / 2, radius, radius * 0.42)
      .filter((point) => point.y < origin.y + depth / 2);
    return {
      kind,
      paths: [
        top,
        bottomVisible,
        [{ x: origin.x - radius, y: origin.y - depth / 2 }, { x: origin.x - radius, y: origin.y + depth / 2 }],
        [{ x: origin.x + radius, y: origin.y - depth / 2 }, { x: origin.x + radius, y: origin.y + depth / 2 }]
      ],
      hidden: [bottomHidden]
    };
  }

  if (kind === "pyramid") {
    const half = 1;
    const apex = iso(0, 0, 2.1, scale, origin);
    const base = [
      iso(-half, -half, 0, scale, origin),
      iso(half, -half, 0, scale, origin),
      iso(half, half, 0, scale, origin),
      iso(-half, half, 0, scale, origin)
    ];
    return {
      kind,
      paths: [
        [base[0]!, base[1]!, base[2]!, base[3]!, base[0]!],
        [base[0]!, apex], [base[1]!, apex], [base[2]!, apex]
      ],
      // The far base vertex and its edge to the apex sit behind the solid.
      hidden: [[base[3]!, apex]]
    };
  }

  // cube / box - box is simply taller.
  const halfX = 1;
  const halfY = 1;
  const halfZ = kind === "box" ? 1.6 : 1;
  const corner = (x: number, y: number, z: number) => iso(x, y, z, scale, origin);
  const bottom = [
    corner(-halfX, -halfY, 0), corner(halfX, -halfY, 0),
    corner(halfX, halfY, 0), corner(-halfX, halfY, 0)
  ];
  const top = [
    corner(-halfX, -halfY, halfZ * 2), corner(halfX, -halfY, halfZ * 2),
    corner(halfX, halfY, halfZ * 2), corner(-halfX, halfY, halfZ * 2)
  ];
  return {
    kind,
    paths: [
      [top[0]!, top[1]!, top[2]!, top[3]!, top[0]!],
      [bottom[0]!, bottom[1]!], [bottom[1]!, bottom[2]!],
      [top[0]!, bottom[0]!], [top[1]!, bottom[1]!], [top[2]!, bottom[2]!]
    ],
    // The rear vertical edge and the two base edges behind the solid.
    hidden: [
      [bottom[2]!, bottom[3]!], [bottom[3]!, bottom[0]!], [top[3]!, bottom[3]!]
    ]
  };
}

/** Palette offered by the colour picker. */
export const DRAW_COLORS = [
  { id: "ink", label: "Hitam", value: "#1b2440" },
  { id: "red", label: "Merah", value: "#e8384f" },
  { id: "orange", label: "Oranye", value: "#f5872b" },
  { id: "yellow", label: "Kuning", value: "#f5c518" },
  { id: "green", label: "Hijau", value: "#17a34a" },
  { id: "blue", label: "Biru", value: "#188ef5" },
  { id: "purple", label: "Ungu", value: "#8b5cf6" },
  { id: "white", label: "Putih", value: "#ffffff" }
] as const;

export type DrawColorId = (typeof DRAW_COLORS)[number]["id"];

/* ------------------------------------------------------------------ *
 * Connect the dots
 * ------------------------------------------------------------------ */

export interface DotPuzzleDot {
  id: number;
  point: Point2D;
}

/**
 * Connect-the-dots progress tracker.
 *
 * Dots must be visited in order. Out-of-order touches are ignored rather than
 * treated as mistakes, because a hand crossing the canvas passes over dots it
 * did not mean to select - the same problem the AR buttons have, and the same
 * resolution.
 */
export class DotPuzzle {
  private index = 0;

  constructor(
    private readonly dots: readonly DotPuzzleDot[],
    private readonly radius = 0.06
  ) {}

  get nextDot(): DotPuzzleDot | null {
    return this.dots[this.index] ?? null;
  }

  get completed(): boolean {
    return this.index >= this.dots.length;
  }

  get progress(): number {
    return this.dots.length === 0 ? 1 : this.index / this.dots.length;
  }

  /** Returns the dot just connected, or null. */
  visit(point: Point2D): DotPuzzleDot | null {
    const target = this.dots[this.index];
    if (!target) return null;
    if (distance(point, target.point) > this.radius) return null;
    this.index += 1;
    return target;
  }

  /** Points of every dot connected so far, for drawing the line. */
  connectedPath(): Point2D[] {
    return this.dots.slice(0, this.index).map((dot) => ({ ...dot.point }));
  }

  reset(): void {
    this.index = 0;
  }
}
