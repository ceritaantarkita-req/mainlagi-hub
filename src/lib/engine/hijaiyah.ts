import { bounds, pathLength } from "./geometry";
import { CLOUD_POINTS, matchClouds, normalizeCloud } from "./pointcloud";
import type { Point, Stroke } from "./types";

/**
 * Hijaiyah letter evaluation.
 *
 * Rewritten from the previous single-line implementation, which had four
 * structural problems:
 *
 * 1. The *longest* stroke was assumed to be the letter body. A child who draws
 *    the dots slowly produces more points there than in the body, and the
 *    letter was then scored against a dot.
 * 2. Body similarity ran through `scorePath`, which accepted mirrored input.
 *    Arabic is written right to left and direction is part of a letter's
 *    identity - dal and ra, dzal and zai become the same shape under a mirror.
 * 3. Only 14 of the 28 letters existed.
 * 4. Ba, Ta, Tsa and Nun all shared one identical bowl, although Nun's bowl is
 *    visibly deeper.
 *
 * Body matching now uses the same point-cloud recognizer as the digits, dots
 * are separated by size relative to the whole glyph, and writing direction is
 * scored as feedback rather than being ignored.
 */

export type DotZone = "above" | "below" | "none";

export interface HijaiyahTemplate {
  letter: string;
  latin: string;
  /** One entry per pen-down. */
  body: Point[][];
  dots: number;
  dotZone: DotZone;
  /** Short teaching note shown next to the target. */
  note?: string;
}

const p = (values: Array<[number, number]>): Point[] =>
  values.map(([x, y]) => ({ x, y }));

// Shared letter bodies. Letters that genuinely share a skeleton reuse it;
// letters that only looked similar in the old data now have their own.
const ALIF = [p([[.5,.06],[.5,.94]])];
const BOWL_SHALLOW = [p([[.92,.28],[.9,.48],[.74,.64],[.48,.7],[.22,.62],[.1,.44]])];
const BOWL_DEEP = [p([[.86,.2],[.9,.46],[.76,.7],[.5,.8],[.24,.7],[.12,.46],[.16,.24]])];
const YA_BODY = [p([[.86,.24],[.9,.46],[.74,.66],[.46,.74],[.2,.66],[.1,.44],[.2,.26]]), p([[.2,.26],[.34,.2]])];
const HA_CURVE = [p([[.82,.24],[.6,.16],[.38,.24],[.52,.4],[.7,.5],[.6,.72],[.36,.82],[.16,.7]])];
const DAL = [p([[.72,.26],[.54,.22],[.42,.36],[.5,.52],[.72,.58]])];
const RA = [p([[.7,.28],[.62,.5],[.44,.68],[.24,.76]])];
const SIN = [p([[.9,.5],[.82,.34],[.74,.52],[.64,.34],[.56,.52],[.44,.34],[.34,.56],[.2,.68],[.1,.5]])];
const SHAD = [p([[.88,.42],[.74,.3],[.58,.34],[.54,.46],[.68,.52],[.84,.5],[.66,.68],[.38,.74],[.16,.62],[.12,.44]])];
const THA = [p([[.7,.5],[.55,.42],[.44,.5],[.5,.62],[.7,.66],[.86,.56]]), p([[.68,.12],[.68,.62]])];
const AIN = [p([[.78,.26],[.6,.18],[.46,.3],[.56,.42],[.74,.46],[.66,.68],[.44,.82],[.2,.72],[.12,.52]])];
const FA = [p([[.7,.28],[.56,.22],[.46,.32],[.54,.44],[.7,.44],[.84,.54],[.7,.68],[.46,.72],[.24,.62],[.16,.48]])];
const QAF = [p([[.7,.26],[.55,.2],[.45,.3],[.54,.42],[.7,.42],[.86,.52],[.76,.72],[.5,.82],[.22,.72],[.12,.5]])];
const KAF = [p([[.3,.14],[.36,.48],[.32,.66],[.52,.74],[.76,.72],[.88,.6]]), p([[.4,.34],[.56,.3],[.5,.42]])];
const LAM = [p([[.68,.12],[.64,.56],[.5,.74],[.3,.76],[.14,.62]])];
const MIM = [p([[.62,.38],[.5,.32],[.4,.42],[.5,.54],[.64,.5],[.66,.7],[.6,.88]])];
const HA_LOOP = [p([[.5,.22],[.32,.34],[.32,.58],[.5,.7],[.68,.58],[.68,.34],[.5,.22]])];
const WAW = [p([[.6,.28],[.44,.24],[.34,.38],[.44,.5],[.62,.48],[.66,.68],[.56,.86],[.4,.92]])];
const HAMZA = [p([[.4,.28],[.6,.26],[.62,.42],[.42,.5],[.62,.58]])];

/** All 28 letters, in Iqro teaching order. */
export const HIJAIYAH_TEMPLATES: HijaiyahTemplate[] = [
  { letter: "ا", latin: "Alif", body: ALIF, dots: 0, dotZone: "none", note: "Satu garis tegak dari atas ke bawah." },
  { letter: "ب", latin: "Ba", body: BOWL_SHALLOW, dots: 1, dotZone: "below", note: "Mangkuk dangkal, satu titik di bawah." },
  { letter: "ت", latin: "Ta", body: BOWL_SHALLOW, dots: 2, dotZone: "above", note: "Mangkuk dangkal, dua titik di atas." },
  { letter: "ث", latin: "Tsa", body: BOWL_SHALLOW, dots: 3, dotZone: "above", note: "Mangkuk dangkal, tiga titik di atas." },
  { letter: "ج", latin: "Jim", body: HA_CURVE, dots: 1, dotZone: "below", note: "Lekuk seperti Ha, satu titik di dalam." },
  { letter: "ح", latin: "Ha", body: HA_CURVE, dots: 0, dotZone: "none", note: "Lekuk tanpa titik." },
  { letter: "خ", latin: "Kha", body: HA_CURVE, dots: 1, dotZone: "above", note: "Lekuk dengan satu titik di atas." },
  { letter: "د", latin: "Dal", body: DAL, dots: 0, dotZone: "none", note: "Lengkung pendek menghadap kiri." },
  { letter: "ذ", latin: "Dzal", body: DAL, dots: 1, dotZone: "above", note: "Seperti Dal, satu titik di atas." },
  { letter: "ر", latin: "Ra", body: RA, dots: 0, dotZone: "none", note: "Turun miring ke kiri bawah." },
  { letter: "ز", latin: "Zai", body: RA, dots: 1, dotZone: "above", note: "Seperti Ra, satu titik di atas." },
  { letter: "س", latin: "Sin", body: SIN, dots: 0, dotZone: "none", note: "Tiga gigi lalu mangkuk." },
  { letter: "ش", latin: "Syin", body: SIN, dots: 3, dotZone: "above", note: "Seperti Sin, tiga titik di atas." },
  { letter: "ص", latin: "Shad", body: SHAD, dots: 0, dotZone: "none", note: "Bulatan kecil lalu mangkuk lebar." },
  { letter: "ض", latin: "Dhad", body: SHAD, dots: 1, dotZone: "above", note: "Seperti Shad, satu titik di atas." },
  { letter: "ط", latin: "Tha", body: THA, dots: 0, dotZone: "none", note: "Mangkuk kecil lalu garis tegak." },
  { letter: "ظ", latin: "Zha", body: THA, dots: 1, dotZone: "above", note: "Seperti Tha, satu titik di atas." },
  { letter: "ع", latin: "Ain", body: AIN, dots: 0, dotZone: "none", note: "Mulut terbuka di atas, ekor melengkung." },
  { letter: "غ", latin: "Ghain", body: AIN, dots: 1, dotZone: "above", note: "Seperti Ain, satu titik di atas." },
  { letter: "ف", latin: "Fa", body: FA, dots: 1, dotZone: "above", note: "Kepala bulat, satu titik di atas." },
  { letter: "ق", latin: "Qaf", body: QAF, dots: 2, dotZone: "above", note: "Kepala bulat, mangkuk dalam, dua titik." },
  { letter: "ك", latin: "Kaf", body: KAF, dots: 0, dotZone: "none", note: "Garis tegak dengan tanda kecil di dalam." },
  { letter: "ل", latin: "Lam", body: LAM, dots: 0, dotZone: "none", note: "Tegak lalu melengkung ke kiri." },
  { letter: "م", latin: "Mim", body: MIM, dots: 0, dotZone: "none", note: "Bulatan kecil dengan ekor ke bawah." },
  { letter: "ن", latin: "Nun", body: BOWL_DEEP, dots: 1, dotZone: "above", note: "Mangkuk dalam, satu titik di atas." },
  { letter: "ه", latin: "Ha besar", body: HA_LOOP, dots: 0, dotZone: "none", note: "Bulatan tertutup." },
  { letter: "و", latin: "Wawu", body: WAW, dots: 0, dotZone: "none", note: "Bulatan kecil dengan ekor panjang." },
  { letter: "ي", latin: "Ya", body: YA_BODY, dots: 2, dotZone: "below", note: "Mangkuk dengan dua titik di bawah." },
  { letter: "ء", latin: "Hamzah", body: HAMZA, dots: 0, dotZone: "none", note: "Tanda kecil seperti angka dua." }
];

export interface HijaiyahResult {
  score: number;
  bodyScore: number;
  dots: number;
  dotZone: DotZone;
  /** True when the body was written right to left, as Arabic requires. */
  directionValid: boolean;
  accepted: boolean;
  reason?: string;
}

/** Strokes smaller than this share of the glyph diagonal are dots. */
const DOT_RATIO = 0.3;
/** Point-cloud distance at which a body is considered unrelated. */
const BODY_DISTANCE_CEILING = 0.2;
const ACCEPT_SCORE = 64;
const ACCEPT_BODY_SCORE = 58;
/**
 * How much worse than the best-matching letter the target may be.
 * Without this an alif scored 83% against dal, because a short line and a
 * short curve are genuinely close in normalized space.
 */
const DISCRIMINATION_MARGIN = 1.12;

const bodyClouds = new WeakMap<HijaiyahTemplate, ReturnType<typeof normalizeCloud>>();

function bodyCloudFor(template: HijaiyahTemplate) {
  const cached = bodyClouds.get(template);
  if (cached) return cached;
  const cloud = normalizeCloud(template.body, CLOUD_POINTS);
  bodyClouds.set(template, cloud);
  return cloud;
}

function diagonalOf(points: readonly Point[]): number {
  const box = bounds(points);
  return Math.hypot(box.width, box.height);
}

/**
 * Splits the written strokes into letter body and dots.
 *
 * The split is by *size relative to the whole glyph*, not by point count. A
 * dot is small no matter how slowly it was drawn.
 */
export function separateDots(
  strokes: readonly Stroke[],
  minBodyStrokes = 1
): {
  body: Stroke[];
  dots: Stroke[];
} {
  const cleaned = strokes.filter((stroke) => stroke.points.length >= 1);
  if (!cleaned.length) return { body: [], dots: [] };

  const all = cleaned.flatMap((stroke) => stroke.points);
  const glyphDiagonal = Math.max(diagonalOf(all), 1e-6);

  const body: Stroke[] = [];
  const dots: Stroke[] = [];
  for (const stroke of cleaned) {
    const size = Math.max(
      diagonalOf(stroke.points),
      pathLength(stroke.points) * 0.5
    );
    if (size / glyphDiagonal < DOT_RATIO) dots.push(stroke);
    else body.push(stroke);
  }

  // Some letters legitimately have a small second body stroke - the inner
  // mark of kaf, the hook of ya. Those are not dots, so the largest remaining
  // strokes are promoted until the expected body stroke count is reached.
  while (body.length < Math.max(1, minBodyStrokes) && dots.length) {
    let largest = 0;
    for (let index = 1; index < dots.length; index += 1) {
      if (diagonalOf(dots[index]!.points) > diagonalOf(dots[largest]!.points)) {
        largest = index;
      }
    }
    body.push(...dots.splice(largest, 1));
  }

  return { body, dots };
}

function centroidY(strokes: readonly Stroke[]): number {
  const points = strokes.flatMap((stroke) => stroke.points);
  if (!points.length) return 0.5;
  return points.reduce((sum, point) => sum + point.y, 0) / points.length;
}

/**
 * Checks that the body was drawn right to left.
 *
 * Direction is scored, not enforced: a child still learning will sometimes
 * draw a correct shape backwards, and rejecting that outright is discouraging.
 * The feedback message says so instead.
 */
function writtenRightToLeft(body: readonly Stroke[]): boolean {
  const longest = [...body].sort(
    (left, right) => pathLength(right.points) - pathLength(left.points)
  )[0];
  const points = longest?.points ?? [];
  if (points.length < 2) return true;
  const start = points[0]!;
  const end = points[points.length - 1]!;
  const horizontal = Math.abs(end.x - start.x);
  const vertical = Math.abs(end.y - start.y);
  // A mostly vertical letter (alif, lam) has no meaningful direction.
  if (horizontal < vertical * 0.6) return true;
  return end.x <= start.x;
}

export function evaluateHijaiyah(
  strokes: readonly Stroke[],
  template: HijaiyahTemplate
): HijaiyahResult {
  const { body, dots } = separateDots(strokes, template.body.length);
  if (!body.length) {
    return {
      score: 0,
      bodyScore: 0,
      dots: 0,
      dotZone: "none",
      directionValid: true,
      accepted: false,
      reason: "Belum ada tulisan."
    };
  }

  const bodyPaths = body
    .map((stroke) => stroke.points)
    .filter((points) => points.length >= 2);
  if (!bodyPaths.length) {
    return {
      score: 0,
      bodyScore: 0,
      dots: dots.length,
      dotZone: "none",
      directionValid: true,
      accepted: false,
      reason: "Badan huruf terlalu pendek."
    };
  }

  const written = normalizeCloud(bodyPaths, CLOUD_POINTS);
  const distance = matchClouds(written, bodyCloudFor(template));

  /**
   * Fit of the same handwriting against another letter, separated the way
   * *that* letter expects.
   *
   * Doing the comparison with a single shared split was wrong: a letter with
   * two body strokes (tha) absorbs the dot of a one-stroke letter (dzal) into
   * its body, and the resulting shape happened to score well enough to be
   * accepted. Each candidate has to be judged on its own terms.
   */
  const fitAgainst = (candidate: HijaiyahTemplate): number => {
    const split = separateDots(strokes, candidate.body.length);
    const paths = split.body
      .map((item) => item.points)
      .filter((points) => points.length >= 2);
    if (!paths.length) return Number.POSITIVE_INFINITY;
    return matchClouds(
      normalizeCloud(paths, CLOUD_POINTS),
      bodyCloudFor(candidate)
    );
  };
  const bodyScore = Number.isFinite(distance)
    ? Math.max(
        0,
        Math.min(100, Math.round((1 - distance / BODY_DISTANCE_CEILING) * 100))
      )
    : 0;

  // Discriminative check: the written body must not fit some *other* letter
  // clearly better than the one being practised.
  let bestOther = Number.POSITIVE_INFINITY;
  let bestOtherLetter: HijaiyahTemplate | null = null;
  for (const candidate of HIJAIYAH_TEMPLATES) {
    if (candidate.body === template.body) continue;
    const other = fitAgainst(candidate);
    if (other < bestOther) {
      bestOther = other;
      bestOtherLetter = candidate;
    }
  }
  const distinctive =
    !Number.isFinite(bestOther) || distance <= bestOther * DISCRIMINATION_MARGIN;

  let dotZone: DotZone = "none";
  if (dots.length) {
    dotZone = centroidY(dots) < centroidY(body) ? "above" : "below";
  }

  // Dots are not decoration - they are what distinguishes ba, ta and tsa.
  // The count therefore has to be exact, and so does the side they sit on.
  const dotsCorrect = dots.length === template.dots;
  const zoneCorrect = template.dotZone === "none" || dotZone === template.dotZone;
  const dotCountScore = dotsCorrect
    ? 100
    : Math.max(0, 100 - Math.abs(template.dots - dots.length) * 34);
  const zoneScore = zoneCorrect ? 100 : 20;
  const directionValid = writtenRightToLeft(body);
  const directionScore = directionValid ? 100 : 55;

  const score = Math.round(
    bodyScore * 0.56 +
      dotCountScore * 0.22 +
      zoneScore * 0.12 +
      directionScore * 0.1
  );
  const accepted =
    score >= ACCEPT_SCORE &&
    bodyScore >= ACCEPT_BODY_SCORE &&
    dotsCorrect &&
    zoneCorrect &&
    distinctive;

  let reason: string | undefined;
  if (!accepted) {
    if (!dotsCorrect) {
      reason = `Titiknya ${dots.length}, seharusnya ${template.dots}.`;
    } else if (!zoneCorrect) {
      reason = `Titik harus di ${template.dotZone === "above" ? "atas" : "bawah"}.`;
    } else if (!distinctive && bestOtherLetter) {
      reason = `Bentuknya lebih mirip ${bestOtherLetter.latin} (${bestOtherLetter.letter}).`;
    } else {
      reason = `Bentuk badan huruf baru ${bodyScore}%. Ikuti contoh lebih dekat dan tulis lebih besar.`;
    }
  } else if (!directionValid) {
    reason = "Benar. Lain kali tulis dari kanan ke kiri ya.";
  }

  return {
    score,
    bodyScore,
    dots: dots.length,
    dotZone,
    directionValid,
    accepted,
    reason
  };
}
