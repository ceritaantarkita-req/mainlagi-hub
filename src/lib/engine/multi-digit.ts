import { classifyDigit, verifyExpectedDigit } from "./digit";
import { bounds, pathLength } from "./geometry";
import type { Point, Stroke } from "./types";

/**
 * Multi-digit segmentation.
 *
 * Previously a number such as 10 or 69 could only be produced one digit at a
 * time, with an open-palm submit gesture held for 700 ms in between. For a
 * five-year-old that is effectively impossible, and it is why "10" and "69"
 * were unusable in practice.
 *
 * This module splits a written glyph into digit-sized pieces so the whole
 * number can be written in one go. Splitting happens in two passes:
 *
 * 1. Group strokes into columns by horizontal gaps. This handles the normal
 *    case where each digit is one or more separate strokes.
 * 2. If a single stroke is far too wide to be one digit (a child joining "6"
 *    and "9" without lifting), cut it at the deepest vertical valleys in its
 *    horizontal density profile.
 */

export interface DigitSegment {
  strokes: Stroke[];
  minX: number;
  maxX: number;
}

export interface MultiDigitResult {
  /** Recognized digits, left to right. */
  digits: number[];
  /** The number formed by the digits, or null when a digit was unreadable. */
  value: number | null;
  confidence: number;
  accepted: boolean;
  segments: number;
  reason?: string;
}

const MIN_STROKE_LENGTH = 0.02;

function usable(strokes: readonly Stroke[]): Stroke[] {
  return strokes.filter(
    (stroke) =>
      stroke.points.length >= 2 && pathLength(stroke.points) >= MIN_STROKE_LENGTH
  );
}

function boxOf(stroke: Stroke): { minX: number; maxX: number } {
  const box = bounds(stroke.points);
  return { minX: box.minX, maxX: box.maxX };
}

/**
 * Cuts one over-wide stroke into `count` pieces at the points where the pen
 * spends least horizontal time - the natural seams between joined digits.
 */
function splitWideStroke(stroke: Stroke, count: number): Stroke[] {
  if (count <= 1 || stroke.points.length < count * 4) return [stroke];

  const box = bounds(stroke.points);
  const width = Math.max(box.width, 1e-6);
  const bins = 24;
  const density = new Array<number>(bins).fill(0);
  for (const point of stroke.points) {
    const bin = Math.min(
      bins - 1,
      Math.max(0, Math.floor(((point.x - box.minX) / width) * bins))
    );
    density[bin] = (density[bin] ?? 0) + 1;
  }

  // Candidate seams: interior bins that are local minima of the density.
  const candidates: Array<{ bin: number; value: number }> = [];
  for (let bin = 2; bin < bins - 2; bin += 1) {
    const value = density[bin] ?? 0;
    if (value <= (density[bin - 1] ?? 0) && value <= (density[bin + 1] ?? 0)) {
      candidates.push({ bin, value });
    }
  }
  candidates.sort((left, right) => left.value - right.value);

  const seams = candidates
    .slice(0, count - 1)
    .map((item) => box.minX + ((item.bin + 0.5) / bins) * width)
    .sort((left, right) => left - right);
  if (seams.length !== count - 1) return [stroke];

  const buckets: Point[][] = Array.from({ length: count }, () => []);
  for (const point of stroke.points) {
    let index = 0;
    while (index < seams.length && point.x > seams[index]!) index += 1;
    buckets[index]!.push(point);
  }

  const pieces = buckets
    .filter((points) => points.length >= 2)
    .map((points, index) => ({
      id: `${stroke.id}-part-${index}`,
      points,
      startedAt: stroke.startedAt,
      endedAt: stroke.endedAt
    }));

  return pieces.length === count ? pieces : [stroke];
}

/**
 * Groups strokes into left-to-right digit segments.
 *
 * @param expectedCount when known, the segmentation is forced to produce
 *        exactly this many segments by cutting at the widest gaps. Knowing the
 *        answer length is a legitimate and very strong hint.
 */
export function segmentDigits(
  strokes: readonly Stroke[],
  expectedCount?: number
): DigitSegment[] {
  let source = usable(strokes);
  if (!source.length) return [];

  // Pass 2 first when there is only one very wide stroke: a joined number.
  if (source.length === 1 && expectedCount && expectedCount > 1) {
    const box = bounds(source[0]!.points);
    if (box.width > box.height * 0.95) {
      source = splitWideStroke(source[0]!, expectedCount);
    }
  }

  const boxed = source
    .map((stroke) => ({ stroke, ...boxOf(stroke) }))
    .sort((left, right) => left.minX - right.minX);

  const segments: DigitSegment[] = [];
  for (const item of boxed) {
    const current = segments[segments.length - 1];
    if (current && item.minX <= current.maxX) {
      // Overlapping horizontally: same digit (for example the bar of a 4).
      current.strokes.push(item.stroke);
      current.maxX = Math.max(current.maxX, item.maxX);
      current.minX = Math.min(current.minX, item.minX);
      continue;
    }
    segments.push({
      strokes: [item.stroke],
      minX: item.minX,
      maxX: item.maxX
    });
  }

  if (!expectedCount || segments.length === expectedCount) return segments;

  // Too many segments: merge the pairs separated by the smallest gaps.
  while (segments.length > expectedCount) {
    let bestIndex = 0;
    let bestGap = Number.POSITIVE_INFINITY;
    for (let index = 1; index < segments.length; index += 1) {
      const gap = segments[index]!.minX - segments[index - 1]!.maxX;
      if (gap < bestGap) {
        bestGap = gap;
        bestIndex = index;
      }
    }
    const previous = segments[bestIndex - 1]!;
    const merged = segments[bestIndex]!;
    previous.strokes.push(...merged.strokes);
    previous.maxX = Math.max(previous.maxX, merged.maxX);
    segments.splice(bestIndex, 1);
  }

  // Too few segments: split the widest one.
  while (segments.length < expectedCount) {
    let widest = 0;
    for (let index = 1; index < segments.length; index += 1) {
      if (
        segments[index]!.maxX - segments[index]!.minX >
        segments[widest]!.maxX - segments[widest]!.minX
      ) {
        widest = index;
      }
    }
    const target = segments[widest]!;
    if (target.strokes.length === 1) {
      const parts = splitWideStroke(target.strokes[0]!, 2);
      if (parts.length !== 2) break;
      const first = { strokes: [parts[0]!], ...boxOf(parts[0]!) };
      const second = { strokes: [parts[1]!], ...boxOf(parts[1]!) };
      segments.splice(widest, 1, first, second);
      continue;
    }
    const sorted = [...target.strokes].sort(
      (left, right) => boxOf(left).minX - boxOf(right).minX
    );
    const half = Math.ceil(sorted.length / 2);
    const left = sorted.slice(0, half);
    const right = sorted.slice(half);
    if (!right.length) break;
    segments.splice(
      widest,
      1,
      {
        strokes: left,
        minX: Math.min(...left.map((item) => boxOf(item).minX)),
        maxX: Math.max(...left.map((item) => boxOf(item).maxX))
      },
      {
        strokes: right,
        minX: Math.min(...right.map((item) => boxOf(item).minX)),
        maxX: Math.max(...right.map((item) => boxOf(item).maxX))
      }
    );
  }

  return segments;
}

/** Reads a whole number written in one go. */
export function classifyNumber(
  strokes: readonly Stroke[],
  expectedDigits?: number
): MultiDigitResult {
  const segments = segmentDigits(strokes, expectedDigits);
  if (!segments.length) {
    return {
      digits: [],
      value: null,
      confidence: 0,
      accepted: false,
      segments: 0,
      reason: "Gerakan terlalu pendek."
    };
  }

  const results = segments.map((segment) => classifyDigit(segment.strokes));
  const digits = results.map((result) => result.value ?? -1);
  const confidence =
    results.reduce((sum, result) => sum + result.confidence, 0) / results.length;
  const readable = digits.every((value) => value >= 0);

  return {
    digits,
    value: readable ? Number(digits.join("")) : null,
    confidence,
    accepted: readable && results.every((result) => result.accepted),
    segments: segments.length,
    reason: readable
      ? undefined
      : "Ada angka yang belum terbaca. Tulis lebih besar dan beri jarak antar angka."
  };
}

/**
 * Checks a whole written number against the answer the game expects.
 *
 * Knowing the answer lets the segmenter split into exactly the right number of
 * digits and lets each digit be verified rather than blindly classified, which
 * is considerably more forgiving of a child's handwriting.
 */
export function verifyExpectedNumber(
  strokes: readonly Stroke[],
  expected: number
): MultiDigitResult {
  const text = String(Math.abs(Math.trunc(expected)));
  const segments = segmentDigits(strokes, text.length);

  if (segments.length !== text.length) {
    return {
      digits: [],
      value: null,
      confidence: 0,
      accepted: false,
      segments: segments.length,
      reason:
        segments.length < text.length
          ? `Jawabannya ${text.length} angka. Beri jarak antar angka.`
          : "Terlalu banyak bagian terbaca. Tulis lebih rapat."
    };
  }

  const results = segments.map((segment, index) =>
    verifyExpectedDigit(segment.strokes, Number(text[index]))
  );
  const confidence =
    results.reduce((sum, result) => sum + result.confidence, 0) / results.length;
  const accepted = results.every((result) => result.accepted);
  const failedIndex = results.findIndex((result) => !result.accepted);

  return {
    digits: text.split("").map(Number),
    value: accepted ? Number(text) : null,
    confidence,
    accepted,
    segments: segments.length,
    reason: accepted
      ? undefined
      : (results[failedIndex]?.reason ??
        "Bentuk belum cukup dekat. Coba tulis lebih besar.")
  };
}
