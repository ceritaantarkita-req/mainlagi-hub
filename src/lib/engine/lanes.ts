/**
 * Three-lane floor positioning for the body games.
 *
 * Kept out of the React component so it can be tested without a camera: these
 * two functions are the whole reason the position marker feels responsive or
 * does not, and "does it feel right" is not something you want to be
 * discovering only by standing in front of a webcam.
 */

export type Lane = -1 | 0 | 1;

/**
 * The slice of the frame treated as the full playing width.
 *
 * A player who is completely in shot never reaches x=0 or x=1 - their body
 * centre stays well inside the frame - so mapping the raw centre straight to
 * a lane would require walking further than most living rooms allow.
 */
export const BAND_MIN = 0.24;
export const BAND_MAX = 0.76;

/** Body centre (0..1 across the mirrored frame) to playing position (0..1). */
export function normalisePosition(centerX: number): number {
  if (!Number.isFinite(centerX)) return 0.5;
  const t = (centerX - BAND_MIN) / (BAND_MAX - BAND_MIN);
  return Math.min(1, Math.max(0, t));
}

/**
 * Which lane a position belongs to, given the lane it is currently in.
 *
 * The asymmetry is deliberate. Leaving a lane needs a bigger move than
 * entering it, so a player standing near a boundary does not oscillate
 * between two lanes several times a second - that oscillation is what a
 * player experiences as an unresponsive marker, because the game never
 * settles anywhere long enough to act on.
 */
export function laneFor(position: number, current: Lane): Lane {
  if (current === -1 ? position < 0.42 : position < 0.31) return -1;
  if (current === 1 ? position > 0.58 : position > 0.69) return 1;
  return 0;
}
