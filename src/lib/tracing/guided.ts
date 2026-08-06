import { distance, resample } from "../engine/geometry";
import type { Point, Stroke } from "../engine/types";

export interface GuidedTraceOptions {
  corridor?: number;
  sampleCount?: number;
  requireDirection?: boolean;
  requireClosure?: boolean;
  closureThreshold?: number;
  minCoverage?: number;
  maxOffPathRatio?: number;
  minScore?: number;
}

export interface GuidedTraceResult {
  accepted: boolean;
  score: number;
  coverage: number;
  precision: number;
  offPathRatio: number;
  startScore: number;
  endScore: number;
  directionScore: number;
  directionValid: boolean;
  closureScore: number;
  closureValid: boolean;
  reason?: string;
}

interface Segment {
  start: Point;
  end: Point;
}

const DEFAULT_OPTIONS: Required<GuidedTraceOptions> = {
  corridor: 0.075,
  sampleCount: 96,
  requireDirection: false,
  requireClosure: false,
  closureThreshold: 0.12,
  minCoverage: 0.7,
  maxOffPathRatio: 0.34,
  minScore: 64
};

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function finitePoint(point: Point): boolean {
  return Number.isFinite(point.x) && Number.isFinite(point.y);
}

function usableStrokePoints(strokes: readonly Stroke[]): Point[][] {
  return strokes
    .map((stroke) => stroke.points.filter(finitePoint))
    .filter((points) => points.length >= 2);
}

function segmentsFromPaths(paths: readonly Point[][]): Segment[] {
  const segments: Segment[] = [];
  for (const points of paths) {
    for (let index = 1; index < points.length; index += 1) {
      const start = points[index - 1];
      const end = points[index];
      if (!start || !end || distance(start, end) < 1e-6) continue;
      segments.push({ start, end });
    }
  }
  return segments;
}

function distanceToSegment(point: Point, segment: Segment): number {
  const dx = segment.end.x - segment.start.x;
  const dy = segment.end.y - segment.start.y;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared < 1e-12) return distance(point, segment.start);

  const projection = clamp01(
    ((point.x - segment.start.x) * dx +
      (point.y - segment.start.y) * dy) /
      lengthSquared
  );
  return Math.hypot(
    point.x - (segment.start.x + projection * dx),
    point.y - (segment.start.y + projection * dy)
  );
}

function nearestDistance(point: Point, segments: readonly Segment[]): number {
  let nearest = Number.POSITIVE_INFINITY;
  for (const segment of segments) {
    nearest = Math.min(nearest, distanceToSegment(point, segment));
  }
  return nearest;
}

function firstAndLast(paths: readonly Point[][]): {
  first: Point | null;
  last: Point | null;
} {
  const first = paths[0]?.[0] ?? null;
  const lastPath = paths[paths.length - 1];
  const last = lastPath?.[lastPath.length - 1] ?? null;
  return { first, last };
}

function proximityScore(actual: Point | null, expected: Point, tolerance: number): number {
  if (!actual) return 0;
  return clamp01(1 - distance(actual, expected) / Math.max(1e-6, tolerance));
}

function reasonForFailure(
  options: Required<GuidedTraceOptions>,
  coverage: number,
  offPathRatio: number,
  directionValid: boolean,
  closureValid: boolean,
  startScore: number,
  endScore: number
): string {
  if (coverage < options.minCoverage) {
    return "Lintasan belum lengkap. Ikuti lebih banyak bagian garis target.";
  }
  if (offPathRatio > options.maxOffPathRatio) {
    return "Terlalu banyak bagian tulisan keluar dari jalur target.";
  }
  if (options.requireDirection && !directionValid) {
    return "Mulai dari titik awal dan ikuti arah garis sampai titik akhir.";
  }
  if (options.requireClosure && !closureValid) {
    return "Sambungkan kembali ujung bentuk ke titik awal.";
  }
  if (startScore < 0.25) {
    return "Mulai lebih dekat ke titik awal.";
  }
  if (endScore < 0.2) {
    return "Selesaikan lintasan sampai titik akhir.";
  }
  return "Ikuti jalur lebih dekat dan lebih lengkap.";
}

/**
 * Scores guided tracing in the same normalized canvas coordinate space used by
 * MotionPad. Stroke boundaries remain separate, so lifting the finger never
 * creates an imaginary bridge between two distant strokes.
 */
export function evaluateGuidedTrace(
  strokes: readonly Stroke[],
  target: readonly Point[],
  config: GuidedTraceOptions = {}
): GuidedTraceResult {
  const options = { ...DEFAULT_OPTIONS, ...config };
  const cleanTarget = target.filter(finitePoint);
  const inputPaths = usableStrokePoints(strokes);
  const inputSegments = segmentsFromPaths(inputPaths);

  if (cleanTarget.length < 2 || inputSegments.length === 0) {
    return {
      accepted: false,
      score: 0,
      coverage: 0,
      precision: 0,
      offPathRatio: 1,
      startScore: 0,
      endScore: 0,
      directionScore: 0,
      directionValid: false,
      closureScore: 0,
      closureValid: false,
      reason: "Gerakan terlalu pendek untuk dinilai."
    };
  }

  const targetSamples = resample(cleanTarget, options.sampleCount);
  const inputPoints = inputPaths.flat();
  const coveredSamples = targetSamples.filter(
    (point) => nearestDistance(point, inputSegments) <= options.corridor
  ).length;
  const coverage = coveredSamples / targetSamples.length;

  const inputDistances = inputPoints.map((point) =>
    nearestDistance(point, segmentsFromPaths([cleanTarget]))
  );
  const offPathRatio =
    inputDistances.filter((value) => value > options.corridor * 1.35).length /
    inputDistances.length;
  const meanDistance =
    inputDistances.reduce((sum, value) => sum + value, 0) /
    inputDistances.length;
  const precision = clamp01(1 - meanDistance / (options.corridor * 1.6));

  const endpoints = firstAndLast(inputPaths);
  const targetStart = cleanTarget[0]!;
  const targetEnd = cleanTarget[cleanTarget.length - 1]!;
  const endpointTolerance = Math.max(options.corridor * 2.2, 0.1);
  const startScore = proximityScore(
    endpoints.first,
    targetStart,
    endpointTolerance
  );
  const endScore = proximityScore(endpoints.last, targetEnd, endpointTolerance);
  const reverseStartScore = proximityScore(
    endpoints.first,
    targetEnd,
    endpointTolerance
  );
  const reverseEndScore = proximityScore(
    endpoints.last,
    targetStart,
    endpointTolerance
  );
  const forwardFit = (startScore + endScore) / 2;
  const reverseFit = (reverseStartScore + reverseEndScore) / 2;
  const directionScore = clamp01(
    0.5 + (forwardFit - reverseFit) * 0.75
  );
  const directionValid =
    !options.requireDirection ||
    (forwardFit >= 0.35 && forwardFit >= reverseFit + 0.08);

  const closureDistance =
    endpoints.first && endpoints.last
      ? distance(endpoints.first, endpoints.last)
      : Number.POSITIVE_INFINITY;
  const closureScore = clamp01(
    1 - closureDistance / Math.max(options.closureThreshold, 1e-6)
  );
  const closureValid =
    !options.requireClosure || closureDistance <= options.closureThreshold;

  let score = Math.round(
    100 *
      (coverage * 0.5 +
        precision * 0.25 +
        startScore * 0.08 +
        endScore * 0.07 +
        directionScore * 0.1)
  );
  if (options.requireClosure) {
    score = Math.round(score * 0.88 + closureScore * 12);
  }

  const accepted =
    score >= options.minScore &&
    coverage >= options.minCoverage &&
    offPathRatio <= options.maxOffPathRatio &&
    directionValid &&
    closureValid;

  return {
    accepted,
    score,
    coverage,
    precision,
    offPathRatio,
    startScore,
    endScore,
    directionScore,
    directionValid,
    closureScore,
    closureValid,
    reason: accepted
      ? undefined
      : reasonForFailure(
          options,
          coverage,
          offPathRatio,
          directionValid,
          closureValid,
          startScore,
          endScore
        )
  };
}
