import type { GlyphInput, Point, Stroke } from "./types";

export function emptyGlyph(): GlyphInput {
  return { strokes: [], submittedAt: null };
}

export function beginStroke(
  glyph: GlyphInput,
  point: Point,
  now: number,
  id = `s-${now}`
): GlyphInput {
  return {
    ...glyph,
    strokes: [
      ...glyph.strokes,
      { id, points: [point], startedAt: now, endedAt: now }
    ]
  };
}

export function appendPoint(
  glyph: GlyphInput,
  point: Point,
  now: number,
  minDistance = 0.003
): GlyphInput {
  const strokes = [...glyph.strokes];
  const current = strokes[strokes.length - 1];
  if (!current) return glyph;
  const previous = current.points[current.points.length - 1];
  if (
    previous &&
    Math.hypot(previous.x - point.x, previous.y - point.y) < minDistance
  ) {
    return glyph;
  }
  strokes[strokes.length - 1] = {
    ...current,
    points: [...current.points.slice(-319), point],
    endedAt: now
  };
  return { ...glyph, strokes };
}

export function endStroke(glyph: GlyphInput, now: number): GlyphInput {
  const strokes = [...glyph.strokes];
  const current = strokes[strokes.length - 1];
  if (!current) return glyph;
  strokes[strokes.length - 1] = { ...current, endedAt: now };
  return { ...glyph, strokes };
}

export function submitGlyph(glyph: GlyphInput, now: number): GlyphInput {
  return { ...glyph, submittedAt: now };
}

/**
 * Single-point strokes are intentionally preserved. They are required for the
 * dots in Latin and Hijaiyah glyphs. Digit recognizers independently ignore
 * strokes that are too small to be meaningful digit segments.
 */
export function usableStrokes(glyph: GlyphInput): Stroke[] {
  return glyph.strokes.filter((stroke) => stroke.points.length >= 1);
}
