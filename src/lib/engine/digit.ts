import { extractFeatures, type GlyphFeatures } from "./features";
import { bounds, pathLength } from "./geometry";
import {
  CLOUD_POINTS,
  matchClouds,
  normalizeCloud,
  type CloudFit,
  type CloudPoint
} from "./pointcloud";
import { DIGIT_VARIANTS } from "./templates";
import type { Point, RecognitionResult, Stroke } from "./types";

/**
 * Digit recognition.
 *
 * Three deliberate changes from the previous implementation:
 *
 * 1. **No mirroring.** The old matcher scored the input against a mirrored
 *    copy of itself and accepted the better of the two. Because 6 and 9 are
 *    180-degree rotations of one another, that made them mathematically
 *    inseparable. Mirror matching is gone.
 * 2. **Pen-ups are preserved.** Strokes are matched as a point cloud rather
 *    than concatenated into a single path, so lifting the finger no longer
 *    invents a line across the glyph.
 * 3. **Structure decides ties.** After shape distance, structural features -
 *    above all the vertical position of the closed loop - separate the digits
 *    that distance alone cannot.
 */

/** Strokes shorter than this fraction of the pad are treated as noise. */
const MIN_STROKE_LENGTH = 0.02;
/** Cloud distance at which a glyph is considered unrelated to a template. */
const DISTANCE_CEILING = 0.42;
/**
 * A glyph has to occupy a real part of the pad before it is judged at all.
 *
 * Normalization scales any mark up to a unit box, so three small dashes in a
 * corner get compared as if they were a full-size character - and sometimes
 * land close enough to the expected digit to be accepted. Requiring a minimum
 * size turns those into honest "write it bigger" feedback instead of a wrong
 * "correct".
 */
const MIN_GLYPH_DIAGONAL = 0.2;
/** Absolute distance a glyph must be within to count as the expected digit. */
const MAX_ACCEPT_DISTANCE = 0.2;

export interface DigitMatch {
  digit: number;
  distance: number;
  variant: string;
}

export interface DigitRanking {
  matches: DigitMatch[];
  features: GlyphFeatures | null;
  /** Bounding-box diagonal of the written glyph, in pad units. */
  size: number;
}

function usableStrokes(strokes: readonly Stroke[]): Point[][] {
  return strokes
    .map((stroke) => stroke.points.filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y)))
    .filter((points) => points.length >= 2 && pathLength(points) >= MIN_STROKE_LENGTH);
}

const templateClouds = new Map<string, CloudPoint[]>();

function cloudFor(
  digit: number,
  variantIndex: number,
  fit: CloudFit
): CloudPoint[] {
  const key = `${digit}:${variantIndex}:${fit}`;
  const cached = templateClouds.get(key);
  if (cached) return cached;
  const variant = DIGIT_VARIANTS[digit]?.[variantIndex];
  const cloud = variant ? normalizeCloud(variant.strokes, CLOUD_POINTS, fit) : [];
  templateClouds.set(key, cloud);
  return cloud;
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

/**
 * Structural plausibility of a digit, given the measured features.
 *
 * Returns a multiplier applied to the shape distance: 1 means "nothing
 * surprising", higher means "this shape does not behave like that digit".
 * Penalties are intentionally moderate - they are meant to break ties, not to
 * override a clearly better shape match.
 */
export function featurePenalty(digit: number, features: GlyphFeatures): number {
  const { crossings, loopCenters, aspect, closure, start, end, complexity } =
    features;
  const lowestLoop = loopCenters.length
    ? loopCenters[loopCenters.length - 1]!
    : null;
  const highestLoop = loopCenters.length ? loopCenters[0]! : null;
  let penalty = 0;

  switch (digit) {
    case 0:
      // A zero is a single closed ring: ends meet, no interior crossing.
      if (closure > 0.45) penalty += 0.35;
      if (crossings >= 2) penalty += 0.4;
      if (aspect > 1.15) penalty += 0.25;
      break;

    case 1:
      // A one is tall and thin with essentially no turning.
      if (aspect > 0.72) penalty += 0.55;
      if (crossings >= 1) penalty += 0.5;
      if (complexity > 2.1) penalty += 0.3;
      break;

    case 2:
      if (crossings >= 1) penalty += 0.3;
      // The tail of a 2 finishes at the bottom right.
      if (end.y < 0.6) penalty += 0.25;
      break;

    case 3:
      if (crossings >= 1) penalty += 0.3;
      if (start.x < 0.25 && end.x < 0.25 && closure < 0.2) penalty += 0.2;
      break;

    case 4:
      // Fours have a horizontal bar and usually a corner, never a closed ring
      // occupying the whole glyph.
      if (lowestLoop !== null && lowestLoop > 0.7) penalty += 0.35;
      if (aspect < 0.45) penalty += 0.3;
      break;

    case 5:
      if (crossings >= 1) penalty += 0.25;
      if (start.y > 0.4 && end.y < 0.4) penalty += 0.2;
      break;

    case 6:
      // The decisive rule: a six carries its loop in the lower half. A six
      // with no loop at all - now a stricter test since loops require real
      // winding, not just a near touch - almost never happens in genuine
      // handwriting, so that case is treated as strong counter-evidence
      // rather than a shrug.
      if (lowestLoop === null) {
        penalty += 0.5;
      } else if (lowestLoop < 0.5) {
        penalty += 0.9;
      } else if (lowestLoop < 0.58) {
        penalty += 0.3;
      }
      if (loopCenters.length >= 2) penalty += 0.3;
      break;

    case 7:
      // Sevens are open: no loop anywhere.
      if (crossings >= 1 && complexity < 3) penalty += 0.35;
      if (lowestLoop !== null) penalty += 0.45;
      if (start.y > 0.35) penalty += 0.25;
      break;

    case 8:
      // Two lobes, one above and one below the waist.
      if (loopCenters.length >= 2) {
        penalty -= 0.15;
      } else if (crossings === 0) {
        penalty += 0.5;
      } else {
        penalty += 0.15;
      }
      break;

    case 9:
      // Mirror of the six rule: a nine carries its loop in the upper half.
      if (highestLoop === null) {
        penalty += 0.5;
      } else if (highestLoop > 0.5) {
        penalty += 0.9;
      } else if (highestLoop > 0.42) {
        penalty += 0.3;
      }
      if (loopCenters.length >= 2) penalty += 0.3;
      break;

    default:
      break;
  }

  return Math.max(0, penalty);
}

/** Ranks every digit against the written glyph, best first. */
export function rankDigits(strokes: readonly Stroke[]): DigitRanking {
  const paths = usableStrokes(strokes);
  if (!paths.length) return { matches: [], features: null, size: 0 };

  const box = bounds(paths.flat());
  const size = Math.hypot(box.width, box.height);

  const uniformCloud = normalizeCloud(paths, CLOUD_POINTS, "uniform");
  if (!uniformCloud.length) return { matches: [], features: null, size };

  const features = extractFeatures(paths);
  const squareCloud = normalizeCloud(paths, CLOUD_POINTS, "square");
  // Aspect-free matching is only safe for shapes that are not extremely thin.
  // Stretching a "1" into a square would let it match anything.
  const allowSquareFit = features.aspect > 0.22;
  const fits: CloudFit[] = allowSquareFit ? ["uniform", "square"] : ["uniform"];
  const matches: DigitMatch[] = [];

  for (const key of Object.keys(DIGIT_VARIANTS)) {
    const digit = Number(key);
    const variants = DIGIT_VARIANTS[digit] ?? [];
    const penalty = featurePenalty(digit, features);
    let best: DigitMatch | null = null;

    for (let index = 0; index < variants.length; index += 1) {
      for (const fit of fits) {
        const template = cloudFor(digit, index, fit);
        const cloud = fit === "square" ? squareCloud : uniformCloud;
        if (template.length !== cloud.length) continue;
        const raw = matchClouds(cloud, template);
        if (!Number.isFinite(raw)) continue;
        // Uniform fitting is trusted slightly more, so it wins close calls.
        const bias = fit === "square" ? 1.08 : 1;
        const distance = raw * bias * (1 + penalty);
        if (!best || distance < best.distance) {
          best = { digit, distance, variant: variants[index]!.label };
        }
      }
    }

    if (best) matches.push(best);
  }

  matches.sort((left, right) => left.distance - right.distance);
  return { matches, features, size };
}

function scoreOf(distance: number, runnerUp: number | null): number {
  const absolute = clamp01(1 - distance / DISTANCE_CEILING);
  const separation =
    runnerUp === null
      ? 0.5
      : clamp01((runnerUp - distance) / Math.max(0.04, distance * 0.9));
  return clamp01(absolute * 0.72 + separation * 0.28);
}

export function classifyDigit(
  strokes: readonly Stroke[]
): RecognitionResult<number> {
  const { matches, size } = rankDigits(strokes);
  if (!matches.length) {
    return {
      value: null,
      confidence: 0,
      accepted: false,
      reason: "Gerakan terlalu pendek."
    };
  }
  if (size < MIN_GLYPH_DIAGONAL) {
    return {
      value: null,
      confidence: 0,
      accepted: false,
      reason: "Tulisannya terlalu kecil. Tulis lebih besar ya."
    };
  }

  const best = matches[0]!;
  const second = matches[1] ?? null;
  const confidence = scoreOf(best.distance, second ? second.distance : null);

  return {
    value: best.digit,
    confidence,
    accepted: confidence >= 0.45,
    reason:
      confidence >= 0.45
        ? undefined
        : "Tulisan belum cukup jelas. Coba tulis lebih besar dan pelan."
  };
}

/**
 * Checks a glyph against the digit the game is waiting for.
 *
 * This is deliberately more forgiving than {@link classifyDigit}: the child
 * already knows which digit they meant, so the job is to confirm the shape is
 * plausibly that digit and clearly not a *different* digit.
 */
export function verifyExpectedDigit(
  strokes: readonly Stroke[],
  expected: number
): RecognitionResult<number> {
  const { matches, size } = rankDigits(strokes);
  if (!matches.length) {
    return {
      value: null,
      confidence: 0,
      accepted: false,
      reason: "Gerakan terlalu pendek."
    };
  }
  if (size < MIN_GLYPH_DIAGONAL) {
    return {
      value: null,
      confidence: 0,
      accepted: false,
      reason: "Tulisannya terlalu kecil. Tulis lebih besar ya."
    };
  }

  const target = matches.find((match) => match.digit === expected);
  if (!target) {
    return {
      value: null,
      confidence: 0,
      accepted: false,
      reason: "Bentuk belum terbaca."
    };
  }

  const best = matches[0]!;
  const bestOther = matches.find((match) => match.digit !== expected) ?? null;
  const confidence = scoreOf(
    target.distance,
    bestOther ? bestOther.distance : null
  );
  /**
   * Three independent gates, because a single relative one let scribbles
   * through: the shape has to be close to the expected digit in absolute
   * terms, it has to be nearly the best explanation of what was drawn, and the
   * combined confidence has to clear a floor.
   */
  const closeToBest = target.distance <= best.distance * 1.1;
  const closeEnough = target.distance <= MAX_ACCEPT_DISTANCE;
  const accepted = confidence >= 0.45 && closeToBest && closeEnough;

  return {
    value: expected,
    confidence,
    accepted,
    reason: accepted
      ? undefined
      : bestOther && bestOther.distance < target.distance * 0.82
        ? `Bentuknya lebih mirip angka ${bestOther.digit}.`
        : "Bentuk belum cukup dekat. Coba tulis lebih besar."
  };
}

export interface DigitCandidate {
  digit: number;
  confidence: number;
}

/**
 * Reads a written glyph as a short list of ranked candidates.
 *
 * This is what makes "messy line becomes a clear number" possible. Instead of
 * the engine quietly deciding and the player finding out only when the answer
 * is marked wrong, the player is shown what was read - and, when the reading is
 * close, the runners-up so a misread costs one tap instead of a rewrite.
 *
 * Returns an empty list when the glyph is too small or too short to judge, so
 * the caller can say "write it bigger" rather than guess.
 */
export function readDigitCandidates(
  strokes: readonly Stroke[],
  limit = 3
): DigitCandidate[] {
  const { matches, size } = rankDigits(strokes);
  if (!matches.length || size < MIN_GLYPH_DIAGONAL) return [];

  const best = matches[0]!;
  const winner = scoreOf(best.distance, matches[1]?.distance ?? null);
  return matches.slice(0, limit).map((match, index) => ({
    digit: match.digit,
    confidence:
      index === 0
        ? winner
        : // Runners-up are scored relative to the winner, so a close second
          // reads as a genuine alternative and a distant one does not. They can
          // never out-score the winner, or the list would contradict itself.
          Math.min(
            winner * 0.95,
            clamp01(
              1 - (match.distance - best.distance) / Math.max(0.05, best.distance * 2)
            )
          )
  }));
}
