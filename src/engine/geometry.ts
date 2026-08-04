import type { Point } from "./types.js";

const EPSILON = 1e-9;

export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function pathLength(points: readonly Point[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) total += distance(points[i - 1]!, points[i]!);
  return total;
}

export function resample(points: readonly Point[], count = 64): Point[] {
  if (count < 2) throw new Error("Resample count must be at least 2.");
  if (points.length === 0) return [];
  if (points.length === 1) return Array.from({ length: count }, () => ({ ...points[0]! }));

  const source = points.map((point) => ({ x: point.x, y: point.y }));
  const total = pathLength(source);
  if (total < EPSILON) return Array.from({ length: count }, () => ({ ...source[0]! }));

  const interval = total / (count - 1);
  const result: Point[] = [{ ...source[0]! }];
  let accumulated = 0;
  let previous = source[0]!;

  for (let index = 1; index < source.length; index += 1) {
    const current = source[index]!;
    let segment = distance(previous, current);
    if (segment < EPSILON) continue;

    while (accumulated + segment >= interval && result.length < count) {
      const ratio = (interval - accumulated) / segment;
      const inserted = {
        x: previous.x + ratio * (current.x - previous.x),
        y: previous.y + ratio * (current.y - previous.y)
      };
      result.push(inserted);
      previous = inserted;
      segment = distance(previous, current);
      accumulated = 0;
    }
    accumulated += segment;
    previous = current;
  }

  while (result.length < count) result.push({ ...source[source.length - 1]! });
  return result.slice(0, count);
}

export function normalizePath(points: readonly Point[], count = 64): Point[] {
  if (points.length === 0) return [];
  const sampled = resample(points, count);
  const xs = sampled.map((point) => point.x);
  const ys = sampled.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = Math.max(maxX - minX, EPSILON);
  const height = Math.max(maxY - minY, EPSILON);
  const scale = Math.max(width, height);
  const normalized = sampled.map((point) => ({
    x: (point.x - minX) / scale,
    y: (point.y - minY) / scale
  }));
  const cx = normalized.reduce((sum, point) => sum + point.x, 0) / normalized.length;
  const cy = normalized.reduce((sum, point) => sum + point.y, 0) / normalized.length;
  return normalized.map((point) => ({ x: point.x - cx, y: point.y - cy }));
}

export function mirrorPath(points: readonly Point[]): Point[] {
  return points.map((point) => ({ ...point, x: 1 - point.x }));
}

export function pathDistance(a: readonly Point[], b: readonly Point[]): number {
  if (a.length === 0 || b.length === 0 || a.length !== b.length) return Number.POSITIVE_INFINITY;
  let total = 0;
  for (let i = 0; i < a.length; i += 1) total += distance(a[i]!, b[i]!);
  return total / a.length;
}

export function scorePathAgainstTarget(input: readonly Point[], target: readonly Point[]): number {
  if (input.length < 4 || target.length < 4) return 0;
  const normalizedInput = normalizePath(input);
  const normalizedTarget = normalizePath(target);
  const forward = pathDistance(normalizedInput, normalizedTarget);
  const reverse = pathDistance(normalizedInput, [...normalizedTarget].reverse());
  const best = Math.min(forward, reverse);
  return Math.max(0, Math.min(100, Math.round((1 - best / 0.42) * 100)));
}

export function addNoise(points: readonly Point[], magnitude: number, random: () => number): Point[] {
  return points.map((point) => ({
    x: point.x + (random() * 2 - 1) * magnitude,
    y: point.y + (random() * 2 - 1) * magnitude
  }));
}
