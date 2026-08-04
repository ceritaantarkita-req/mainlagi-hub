import { mirrorPath, normalizePath, pathDistance } from "./geometry.js";
import { DIGIT_TEMPLATES } from "./templates.js";
import type { Point, RecognitionResult } from "./types.js";

const NORMALIZED_TEMPLATES = Object.entries(DIGIT_TEMPLATES).flatMap(([digit, variants]) =>
  variants.map((points) => ({ digit: Number(digit), points: normalizePath(points) }))
);

function classify(points: readonly Point[]): { digit: number; distance: number; second: number } {
  const normalized = normalizePath(points);
  const matches = NORMALIZED_TEMPLATES
    .map((template) => ({ digit: template.digit, distance: pathDistance(normalized, template.points) }))
    .sort((a, b) => a.distance - b.distance);
  return {
    digit: matches[0]?.digit ?? -1,
    distance: matches[0]?.distance ?? Number.POSITIVE_INFINITY,
    second: matches[1]?.distance ?? Number.POSITIVE_INFINITY
  };
}

export function recognizeDigit(points: readonly Point[], minimumConfidence = 0.5): RecognitionResult<number> {
  if (points.length < 4) {
    return { value: null, confidence: 0, accepted: false, reason: "Gerakan terlalu pendek." };
  }

  const normal = classify(points);
  const flipped = classify(mirrorPath(points));
  const best = normal.distance <= flipped.distance ? normal : flipped;
  const absolute = Math.max(0, 1 - best.distance / 0.45);
  const separation = Number.isFinite(best.second) ? Math.max(0, Math.min(1, (best.second - best.distance) / 0.18)) : 0;
  const confidence = Math.max(0, Math.min(1, absolute * 0.82 + separation * 0.18));
  return {
    value: best.digit >= 0 ? best.digit : null,
    confidence,
    accepted: best.digit >= 0 && confidence >= minimumConfidence,
    reason: confidence >= minimumConfidence ? undefined : "Tulisan belum cukup jelas. Coba tulis lebih besar dan stabil."
  };
}
