// GENERATED FILE - do not edit here.
// Source of truth: _vision-core/. Re-run `node _vision-core/sync.mjs` after changes.
/**
 * Mapping from MediaPipe's normalised landmark space to what is actually on
 * screen, and from there to an undistorted space suitable for shape matching.
 *
 * The bug this replaces: fingertip coordinates were remapped into an arbitrary
 * per-player box whose height was 51% of the viewport, while the ink overlay was
 * anchored 12% up from the bottom. On a 1920x1080 screen that put the ink up to
 * 400px away from the finger. Separately, the x axis was divided by the half-width
 * and the y axis by the full height, so a circle drawn in the air arrived at the
 * recogniser as a 1.17:1 ellipse.
 */

export interface Point2D {
  x: number;
  y: number;
  t?: number;
}

export interface VideoGeometry {
  /** On-screen size of the element the video is painted into. */
  containerWidth: number;
  containerHeight: number;
  /** Intrinsic size of the camera frame. */
  sourceWidth: number;
  sourceHeight: number;
  objectFit: "cover" | "contain";
  /** True when the element is displayed with transform: scaleX(-1). */
  mirrored: boolean;
  /**
   * CSS object-position along each axis, 0..1 (0 = left/top, 0.5 = centre,
   * 1 = right/bottom). Math Warung shows one camera across two panels with
   * object-position left and right, so the default of centre is not enough.
   */
  objectPositionX?: number;
  objectPositionY?: number;
}

export interface StagePoint {
  /** Pixels inside the container. Ink drawn here sits exactly on the fingertip. */
  px: number;
  py: number;
  /** Same position as a 0..1 fraction of the container. */
  x: number;
  y: number;
  /** True when the point falls outside the visible area of the video. */
  offscreen: boolean;
}

/**
 * Convert a normalised landmark into container pixels, honouring object-fit and
 * the CSS mirror. This is the single source of truth: overlays and the recogniser
 * both consume its output, so ink can never drift away from the finger again.
 */
export function landmarkToStage(point: Point2D, geometry: VideoGeometry): StagePoint {
  const { containerWidth, containerHeight, sourceWidth, sourceHeight, objectFit, mirrored } = geometry;
  if (containerWidth <= 0 || containerHeight <= 0 || sourceWidth <= 0 || sourceHeight <= 0) {
    return { px: 0, py: 0, x: 0, y: 0, offscreen: true };
  }

  const scale =
    objectFit === "cover"
      ? Math.max(containerWidth / sourceWidth, containerHeight / sourceHeight)
      : Math.min(containerWidth / sourceWidth, containerHeight / sourceHeight);
  const renderedWidth = sourceWidth * scale;
  const renderedHeight = sourceHeight * scale;
  // Where the painted video starts relative to the container's top-left corner.
  // object-position decides how the overflow is distributed; 0.5 centres it.
  const alignX = geometry.objectPositionX ?? 0.5;
  const alignY = geometry.objectPositionY ?? 0.5;
  const originX = (containerWidth - renderedWidth) * alignX;
  const originY = (containerHeight - renderedHeight) * alignY;

  const sourceX = mirrored ? 1 - point.x : point.x;
  const px = originX + sourceX * renderedWidth;
  const py = originY + point.y * renderedHeight;

  return {
    px,
    py,
    x: px / containerWidth,
    y: py / containerHeight,
    offscreen: px < 0 || py < 0 || px > containerWidth || py > containerHeight
  };
}

/**
 * Aspect-correct space derived from the camera frame itself rather than the DOM.
 *
 * Dividing both source axes by the source height gives a layout-independent
 * space: x spans 0..(width/height), y spans 0..1, and a circle traced in the air
 * stays circular no matter how the video is laid out on screen.
 */
export function sourceGlyphSpace(
  point: Point2D,
  sourceWidth: number,
  sourceHeight: number,
  mirrored: boolean
): Point2D {
  const aspect = sourceHeight > 0 ? sourceWidth / sourceHeight : 1;
  return { x: (mirrored ? 1 - point.x : point.x) * aspect, y: point.y };
}

/**
 * Aspect-correct space for shape matching.
 *
 * Both axes are divided by the same number of pixels, so a square traced in the
 * air stays square. Without this the recogniser compares the user's stretched
 * glyph against square templates and rejects correct answers.
 */
export function stageToGlyphSpace(stage: StagePoint, containerHeight: number): Point2D {
  const unit = Math.max(1, containerHeight);
  return { x: stage.px / unit, y: stage.py / unit };
}

export interface SplitZone {
  /** Fraction of the container width where player A's area ends. */
  aEnd: number;
  /** Fraction where player B's area begins. */
  bStart: number;
}

export const DEFAULT_SPLIT: SplitZone = { aEnd: 0.44, bStart: 0.56 };

export type SideId = "A" | "B";

/**
 * Which half of the screen a point belongs to.
 *
 * The dead band is 12% wide rather than the old 4%. A 4% band meant a hand near
 * the middle flickered between players several times a second, which is what made
 * two-player mode feel broken.
 */
export function sideForX(x: number, zone: SplitZone = DEFAULT_SPLIT): SideId | null {
  if (x < zone.aEnd) return "A";
  if (x > zone.bStart) return "B";
  return null;
}

/** Position within a player's own half, 0..1 on x, container-relative on y. */
export function toSideLocal(stage: StagePoint, side: SideId, zone: SplitZone = DEFAULT_SPLIT): Point2D {
  const span = side === "A" ? zone.aEnd : 1 - zone.bStart;
  const start = side === "A" ? 0 : zone.bStart;
  return {
    x: Math.max(0, Math.min(1, (stage.x - start) / Math.max(1e-6, span))),
    y: Math.max(0, Math.min(1, stage.y))
  };
}
