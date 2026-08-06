import { normalizePath, pathDistance, mirrorPath, pathLength } from "./geometry";
import { DIGIT_TEMPLATES } from "./templates";
import type { Point, RecognitionResult, Stroke } from "./types";

function merged(strokes: readonly Stroke[]): Point[] {
  const significant = strokes.filter(
    (stroke) => stroke.points.length >= 2 && pathLength(stroke.points) >= 0.012
  );
  return significant.flatMap((stroke) => stroke.points);
}

function templateDistance(points: readonly Point[], digit: number): number {
  const input = normalizePath(points);
  const mirrored = normalizePath(mirrorPath(points));
  return Math.min(
    ...(DIGIT_TEMPLATES[digit] ?? []).flatMap((template) => {
      const target = normalizePath(template);
      return [
        pathDistance(input, target),
        pathDistance(mirrored, target),
        pathDistance(input, [...target].reverse())
      ];
    })
  );
}

export function verifyExpectedDigit(
  strokes: readonly Stroke[],
  expected: number
): RecognitionResult<number> {
  const points = merged(strokes);
  if (points.length < 4) {
    return {
      value: null,
      confidence: 0,
      accepted: false,
      reason: "Gerakan terlalu pendek."
    };
  }

  const expectedDistance = templateDistance(points, expected);
  const competitors = Object.keys(DIGIT_TEMPLATES)
    .map(Number)
    .filter((digit) => digit !== expected)
    .map((digit) => templateDistance(points, digit))
    .sort((left, right) => left - right);
  const separation = Math.max(
    0,
    Math.min(1, ((competitors[0] ?? 0.6) - expectedDistance) / 0.16)
  );
  const absolute = Math.max(0, Math.min(1, 1 - expectedDistance / 0.43));
  const confidence = absolute * 0.82 + separation * 0.18;
  return {
    value: expected,
    confidence,
    accepted: confidence >= 0.48,
    reason:
      confidence >= 0.48
        ? undefined
        : "Bentuk belum cukup dekat dengan jawaban. Coba tulis lebih besar."
  };
}

export function classifyDigit(strokes: readonly Stroke[]): RecognitionResult<number> {
  const points = merged(strokes);
  if (points.length < 4) {
    return {
      value: null,
      confidence: 0,
      accepted: false,
      reason: "Gerakan terlalu pendek."
    };
  }

  const matches = Object.keys(DIGIT_TEMPLATES)
    .map(Number)
    .map((digit) => ({ digit, distance: templateDistance(points, digit) }))
    .sort((left, right) => left.distance - right.distance);
  const best = matches[0];
  const second = matches[1];
  if (!best) return { value: null, confidence: 0, accepted: false };

  const absolute = Math.max(0, 1 - best.distance / 0.43);
  const separation = second
    ? Math.max(0, Math.min(1, (second.distance - best.distance) / 0.16))
    : 0;
  const confidence = absolute * 0.82 + separation * 0.18;
  return {
    value: best.digit,
    confidence,
    accepted: confidence >= 0.5,
    reason: confidence >= 0.5 ? undefined : "Tulisan belum cukup jelas."
  };
}
