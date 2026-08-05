// GENERATED FILE - do not edit here.
// Source of truth: _vision-core/. Re-run `node _vision-core/sync.mjs` after changes.
/**
 * Multi-stroke glyph recognition.
 *
 * HISTORY OF WHAT WAS WRONG, so nobody reintroduces it:
 *
 * 1. The first version normalised into a unit box but re-centred both axes
 *    independently, destroying aspect ratio. "1" and "7" became twins.
 *    Aspect is now a separate, explicitly weighted feature.
 * 2. It retried every match against a mirrored copy and accepted the mirror when
 *    it scored better. Since 2/5 are near-mirrors, this actively turned correct
 *    answers into wrong ones. Mirroring belongs in the coordinate layer, where
 *    the camera feed is actually flipped, and it lives there now.
 * 3. The second version compared points *in order*. Drawing the same digit with
 *    a different stroke order or direction produced a totally different score,
 *    which is why users watched a visibly correct answer get rejected on repeat.
 *    Matching is now done on a raster (see raster.ts) and cannot see order.
 *
 * The scoring below deliberately separates two questions that were previously
 * conflated: "does this look like the winner?" (fit) and "does it look like the
 * winner MORE than anything else?" (margin). A glyph that matches two characters
 * equally well is rejected rather than guessed at, because a wrong-but-confident
 * answer costs the user a life, while a rejection just costs them a retry.
 */

import type { Point2D } from "./coordinate";
import { chamfer, clampAspect, overlap, rasterize, type RasterGlyph } from "./raster";

/**
 * Recognition works on plain geometry. `Stroke` from the air writer carries
 * timestamps and is assignable to this, so both feed the same recogniser.
 */
export type GlyphStroke = readonly Point2D[];

export interface GlyphTemplate {
  label: string;
  /**
   * Numeric identity for digit-style callers. Character sets that are not
   * numeric (Latin, Hijaiyah) use `key` and may share value -1.
   */
  value: number;
  /** Stable string identity. Falls back to `label` when omitted. */
  key?: string;
  strokes: GlyphStroke[];
  /** Height divided by width of the reference shape. */
  aspect: number;
  /**
   * Strokes that are diacritical marks rather than body, e.g. the i'jam under
   * ba or the dot on a Latin "i". Scored separately: getting the body right but
   * the dots wrong should say "check the dots", not "unreadable".
   */
  markStrokes?: GlyphStroke[];
}

export interface RecognitionResult {
  value: number;
  key: string;
  label: string;
  confidence: number;
  distance: number;
  accepted: boolean;
  alternatives: Array<{ value: number; key: string; label: string; confidence: number }>;
  reason?: string;
  /** True when the body matched but the diacritical marks did not. */
  markMismatch?: boolean;
}

export interface RecognizerOptions {
  minConfidence?: number;
  /** Weight given to the aspect-ratio mismatch. */
  aspectWeight?: number;
  /** Penalty applied when the stroke count differs from the template. */
  strokePenalty?: number;
  /**
   * Chamfer distance (in grid cells) treated as "no resemblance at all".
   * Scores are mapped to 0..1 against this.
   */
  distanceCeiling?: number;
  /** How much clear water the winner needs over the runner-up, in cells. */
  marginScale?: number;
}

interface PreparedTemplate {
  template: GlyphTemplate;
  body: RasterGlyph;
  marks: RasterGlyph | null;
  markCount: number;
}

/** Split a template's strokes into body and diacritical marks. */
function splitTemplate(template: GlyphTemplate): { body: GlyphStroke[]; marks: GlyphStroke[] } {
  if (template.markStrokes && template.markStrokes.length > 0) {
    return { body: template.strokes, marks: template.markStrokes };
  }
  return { body: template.strokes, marks: [] };
}

/**
 * A stroke counts as a mark when it is tiny relative to the whole glyph.
 *
 * This is how the user's ink gets split the same way the templates are, without
 * asking them to declare "this next bit is a dot". The threshold is relative to
 * the glyph's own size so it works whether they wrote big or small.
 */
export function splitMarks(
  strokes: readonly GlyphStroke[],
  markSizeRatio = 0.22
): { body: GlyphStroke[]; marks: GlyphStroke[] } {
  const usable = strokes.filter((stroke) => stroke.length > 0);
  if (usable.length <= 1) return { body: usable as GlyphStroke[], marks: [] };

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const stroke of usable) {
    for (const point of stroke) {
      minX = Math.min(minX, point.x); maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y); maxY = Math.max(maxY, point.y);
    }
  }
  const span = Math.max(maxX - minX, maxY - minY, 1e-6);

  const body: GlyphStroke[] = [];
  const marks: GlyphStroke[] = [];
  for (const stroke of usable) {
    let sminX = Infinity, sminY = Infinity, smaxX = -Infinity, smaxY = -Infinity;
    for (const point of stroke) {
      sminX = Math.min(sminX, point.x); smaxX = Math.max(smaxX, point.x);
      sminY = Math.min(sminY, point.y); smaxY = Math.max(smaxY, point.y);
    }
    const strokeSpan = Math.max(smaxX - sminX, smaxY - sminY);
    if (strokeSpan / span <= markSizeRatio) marks.push(stroke);
    else body.push(stroke);
  }
  // Everything looked like a mark: it was not a dotted glyph, it was just small.
  if (body.length === 0) return { body: usable as GlyphStroke[], marks: [] };
  return { body, marks };
}

/** Centroids of each mark, in glyph-normalised space, for position comparison. */
function markCentroids(strokes: readonly GlyphStroke[], bodyBounds: {
  minX: number; minY: number; scale: number;
}): Point2D[] {
  return strokes.map((stroke) => {
    let x = 0;
    let y = 0;
    for (const point of stroke) { x += point.x; y += point.y; }
    return {
      x: (x / stroke.length - bodyBounds.minX) / bodyBounds.scale,
      y: (y / stroke.length - bodyBounds.minY) / bodyBounds.scale
    };
  });
}

function boundsOf(strokes: readonly GlyphStroke[]): { minX: number; minY: number; scale: number } {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const stroke of strokes) {
    for (const point of stroke) {
      minX = Math.min(minX, point.x); maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y); maxY = Math.max(maxY, point.y);
    }
  }
  if (!Number.isFinite(minX)) return { minX: 0, minY: 0, scale: 1 };
  return { minX, minY, scale: Math.max(maxX - minX, maxY - minY, 1e-6) };
}

/**
 * Score how well the user's marks match the template's, 0..1.
 *
 * Count must match exactly - two dots is a different letter from three, that is
 * the entire point of i'jam - and then position is compared greedily.
 */
function scoreMarks(
  userMarks: readonly GlyphStroke[],
  templateMarks: readonly GlyphStroke[],
  userBody: readonly GlyphStroke[],
  templateBody: readonly GlyphStroke[]
): number {
  if (templateMarks.length === 0 && userMarks.length === 0) return 1;
  if (templateMarks.length !== userMarks.length) return 0;
  if (templateMarks.length === 0) return 1;

  const userCentroids = markCentroids(userMarks, boundsOf(userBody));
  const templateCentroids = markCentroids(templateMarks, boundsOf(templateBody));

  const taken = new Set<number>();
  let total = 0;
  for (const target of templateCentroids) {
    let bestIndex = -1;
    let bestGap = Infinity;
    userCentroids.forEach((candidate, index) => {
      if (taken.has(index)) return;
      const gap = Math.hypot(candidate.x - target.x, candidate.y - target.y);
      if (gap < bestGap) { bestGap = gap; bestIndex = index; }
    });
    if (bestIndex < 0) return 0;
    taken.add(bestIndex);
    total += bestGap;
  }
  const average = total / templateCentroids.length;
  // Dots sitting within ~35% of the glyph size of where they belong is a pass;
  // handwriting places them loosely and demanding better rejects real writing.
  return Math.max(0, Math.min(1, 1 - average / 0.55));
}

export class GlyphRecognizer {
  private readonly prepared: PreparedTemplate[];
  private readonly minConfidence: number;
  private readonly aspectWeight: number;
  private readonly strokePenalty: number;
  private readonly distanceCeiling: number;
  private readonly marginScale: number;

  constructor(templates: GlyphTemplate[], options: RecognizerOptions = {}) {
    this.minConfidence = options.minConfidence ?? 0.5;
    this.aspectWeight = options.aspectWeight ?? 1.1;
    this.strokePenalty = options.strokePenalty ?? 0.16;
    this.distanceCeiling = options.distanceCeiling ?? 3.4;
    this.marginScale = options.marginScale ?? 0.85;

    this.prepared = templates
      .map((template) => {
        const { body, marks } = splitTemplate(template);
        const raster = rasterize(body);
        if (!raster) return null;
        return {
          template,
          body: raster,
          marks: marks.length > 0 ? rasterize(marks) : null,
          markCount: marks.length
        } satisfies PreparedTemplate;
      })
      .filter((entry): entry is PreparedTemplate => entry !== null);
  }

  recognize(strokes: readonly GlyphStroke[]): RecognitionResult | null {
    const usable = strokes.filter((stroke) => stroke.length > 1);
    if (usable.length === 0) return null;

    const { body: userBody, marks: userMarks } = splitMarks(usable);
    const input = rasterize(userBody);
    if (!input) return null;

    interface Scored {
      value: number;
      key: string;
      label: string;
      distance: number;
      markScore: number;
    }

    // Keep the best score per identity, not per template: several templates
    // describe the same character in different handwriting styles, and the user
    // only has to match one of them.
    const best = new Map<string, Scored>();

    for (const entry of this.prepared) {
      const { template } = entry;
      const identity = template.key ?? template.label;

      let distance = chamfer(input, entry.body);

      // Overlap disambiguates shapes the chamfer rates similarly - closed
      // figures like 0/6/8 sit close in chamfer terms but differ in filled area.
      distance += (1 - overlap(input, entry.body)) * 0.55;

      // Aspect in log space so 2:1 and 1:2 are penalised equally. Both sides are
      // clamped: a template drawn as a dead-straight line has zero width and an
      // infinite ratio, which would otherwise dwarf every other term.
      const aspectGap = Math.abs(
        Math.log(clampAspect(input.aspect) / clampAspect(template.aspect))
      );
      distance += aspectGap * this.aspectWeight;

      // Stroke count is a hint, not a rule: someone writing a "4" without
      // lifting should still be understood, just scored slightly lower.
      distance += Math.abs(input.strokeCount - entry.body.strokeCount) * this.strokePenalty;

      const { body: templateBody, marks: templateMarks } = splitTemplate(template);
      const markScore = scoreMarks(userMarks, templateMarks, userBody, templateBody);

      const existing = best.get(identity);
      if (!existing || distance < existing.distance) {
        best.set(identity, {
          value: template.value,
          key: identity,
          label: template.label,
          distance,
          markScore
        });
      }
    }

    if (best.size === 0) return null;

    // Marks fold into the ranked distance so a body that matches ba but carries
    // three dots ranks below tsa, rather than winning and then complaining.
    const ranked = [...best.values()]
      .map((entry) => ({ ...entry, ranked: entry.distance + (1 - entry.markScore) * 1.5 }))
      .sort((a, b) => a.ranked - b.ranked);

    const winner = ranked[0]!;
    const runnerUp = ranked[1];

    const fit = Math.max(0, Math.min(1, 1 - winner.ranked / this.distanceCeiling));
    const margin = runnerUp
      ? Math.max(0, Math.min(1, (runnerUp.ranked - winner.ranked) / this.marginScale))
      : 1;

    // Fit is weighted well above margin. An unusual but unmistakable glyph
    // should pass even when a second character is somewhat close, otherwise
    // dense alphabets like Hijaiyah reject almost everything.
    const confidence = Math.max(0, Math.min(0.99, fit * 0.72 + margin * 0.28));
    const accepted = confidence >= this.minConfidence;

    const markMismatch = !accepted && winner.markScore < 0.5 &&
      winner.distance < this.distanceCeiling * 0.55;

    return {
      value: winner.value,
      key: winner.key,
      label: winner.label,
      confidence,
      distance: winner.distance,
      accepted,
      markMismatch: markMismatch || undefined,
      alternatives: ranked.slice(0, 3).map((entry) => ({
        value: entry.value,
        key: entry.key,
        label: entry.label,
        confidence: Math.max(0, Math.min(1, 1 - entry.ranked / this.distanceCeiling))
      })),
      reason: accepted
        ? undefined
        : markMismatch
          ? `Bentuknya mirip ${winner.label}, tapi titiknya belum pas.`
          : runnerUp && runnerUp.ranked - winner.ranked < this.marginScale * 0.35
            ? `Mirip ${winner.label} atau ${runnerUp.label}. Tulis lebih jelas.`
            : "Tulisan belum terbaca. Coba tulis lebih besar dan pelan."
    };
  }
}

/* ------------------------------------------------------------------ *
 * Compatibility helpers.
 *
 * normalizeGlyph/resample are still exported because existing tests and the
 * two vanilla-JS projects import them. They are no longer used for matching.
 * ------------------------------------------------------------------ */

const RESAMPLE_POINTS = 48;

function pathLength(points: readonly Point2D[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    total += Math.hypot(points[i]!.x - points[i - 1]!.x, points[i]!.y - points[i - 1]!.y);
  }
  return total;
}

export function resample(points: readonly Point2D[], count = RESAMPLE_POINTS): Point2D[] {
  if (points.length === 0) return [];
  if (points.length === 1) return Array.from({ length: count }, () => ({ ...points[0]! }));
  const total = pathLength(points);
  if (total < 1e-9) return Array.from({ length: count }, () => ({ ...points[0]! }));

  const step = total / (count - 1);
  const output: Point2D[] = [{ ...points[0]! }];
  let accumulated = 0;
  let previous = { ...points[0]! };
  let index = 1;

  while (index < points.length && output.length < count) {
    const current = points[index]!;
    const segment = Math.hypot(current.x - previous.x, current.y - previous.y);
    if (segment < 1e-9) { previous = { ...current }; index += 1; continue; }
    if (accumulated + segment >= step) {
      const ratio = (step - accumulated) / segment;
      const inserted = {
        x: previous.x + ratio * (current.x - previous.x),
        y: previous.y + ratio * (current.y - previous.y)
      };
      output.push(inserted);
      previous = inserted;
      accumulated = 0;
    } else {
      accumulated += segment;
      previous = { ...current };
      index += 1;
    }
  }
  while (output.length < count) output.push({ ...points[points.length - 1]! });
  return output.slice(0, count);
}

export interface NormalizedGlyph {
  points: Point2D[];
  strokeCount: number;
  aspect: number;
}

export function normalizeGlyph(
  strokes: readonly GlyphStroke[],
  count = RESAMPLE_POINTS
): NormalizedGlyph | null {
  const nonEmpty = strokes.filter((stroke) => stroke.length > 1);
  if (nonEmpty.length === 0) return null;

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const stroke of nonEmpty) {
    for (const point of stroke) {
      minX = Math.min(minX, point.x); maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y); maxY = Math.max(maxY, point.y);
    }
  }
  const width = Math.max(maxX - minX, 1e-6);
  const height = Math.max(maxY - minY, 1e-6);
  const scale = Math.max(width, height);

  const lengths = nonEmpty.map((stroke) => Math.max(pathLength(stroke), 1e-6));
  const totalLength = lengths.reduce((sum, value) => sum + value, 0);

  const points: Point2D[] = [];
  nonEmpty.forEach((stroke, index) => {
    const share = Math.max(4, Math.round((lengths[index]! / totalLength) * count));
    for (const point of resample(stroke, share)) {
      points.push({ x: (point.x - minX) / scale, y: (point.y - minY) / scale });
    }
  });

  return { points: resample(points, count), strokeCount: nonEmpty.length, aspect: height / width };
}
