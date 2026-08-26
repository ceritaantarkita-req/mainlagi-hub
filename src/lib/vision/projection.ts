/**
 * Camera stage projection.
 *
 * The camera preview is rendered with `object-fit: cover`, which crops the
 * video so that it fills the container. MediaPipe returns landmarks in
 * normalized video coordinates (0..1 of the *source* frame), so drawing them
 * straight onto the container rectangle misaligns the skeleton whenever the
 * container aspect ratio differs from the camera aspect ratio - which is
 * always the case on a phone in portrait.
 *
 * Every consumer of landmark coordinates (skeleton overlay, air cursor,
 * air targets) must project through the same transform so that what the player
 * sees and what the engine measures agree.
 */

export interface StageProjection {
  /** Container size in CSS pixels. */
  containerWidth: number;
  containerHeight: number;
  /** Uniform scale applied to the source frame. */
  scale: number;
  /** Offset of the scaled frame inside the container (negative when cropped). */
  offsetX: number;
  offsetY: number;
  /** Source frame size in pixels. */
  sourceWidth: number;
  sourceHeight: number;
  /** True when the preview is horizontally mirrored (selfie view). */
  mirrored: boolean;
}

const FALLBACK_SOURCE_WIDTH = 960;
const FALLBACK_SOURCE_HEIGHT = 540;

export function createProjection(
  containerWidth: number,
  containerHeight: number,
  sourceWidth = FALLBACK_SOURCE_WIDTH,
  sourceHeight = FALLBACK_SOURCE_HEIGHT,
  mirrored = true
): StageProjection {
  const safeContainerWidth = Math.max(1, containerWidth);
  const safeContainerHeight = Math.max(1, containerHeight);
  const safeSourceWidth = sourceWidth > 0 ? sourceWidth : FALLBACK_SOURCE_WIDTH;
  const safeSourceHeight =
    sourceHeight > 0 ? sourceHeight : FALLBACK_SOURCE_HEIGHT;

  // `object-fit: cover` scales so the *smaller* overflow direction still fills.
  const scale = Math.max(
    safeContainerWidth / safeSourceWidth,
    safeContainerHeight / safeSourceHeight
  );
  const renderedWidth = safeSourceWidth * scale;
  const renderedHeight = safeSourceHeight * scale;

  return {
    containerWidth: safeContainerWidth,
    containerHeight: safeContainerHeight,
    scale,
    offsetX: (safeContainerWidth - renderedWidth) / 2,
    offsetY: (safeContainerHeight - renderedHeight) / 2,
    sourceWidth: safeSourceWidth,
    sourceHeight: safeSourceHeight,
    mirrored
  };
}

/**
 * Projects a normalized landmark (0..1 in source-frame space) to CSS pixels
 * inside the container.
 */
export function projectPoint(
  x: number,
  y: number,
  projection: StageProjection
): { x: number; y: number } {
  const sourceX = projection.mirrored ? 1 - x : x;
  return {
    x: projection.offsetX + sourceX * projection.sourceWidth * projection.scale,
    y: projection.offsetY + y * projection.sourceHeight * projection.scale
  };
}

/**
 * Inverse of {@link projectPoint}. Used when a DOM rectangle has to be
 * expressed back in landmark space.
 */
export function unprojectPoint(
  x: number,
  y: number,
  projection: StageProjection
): { x: number; y: number } {
  const sourceX =
    (x - projection.offsetX) / (projection.sourceWidth * projection.scale);
  const sourceY =
    (y - projection.offsetY) / (projection.sourceHeight * projection.scale);
  return {
    x: projection.mirrored ? 1 - sourceX : sourceX,
    y: sourceY
  };
}

/**
 * Scale factor for drawing sizes (stroke width, joint radius) so the skeleton
 * keeps the same visual weight on a 360 px phone and a 1920 px television.
 */
export function strokeScale(projection: StageProjection): number {
  const reference = Math.min(projection.containerWidth, projection.containerHeight);
  return Math.max(0.55, Math.min(2.4, reference / 520));
}
