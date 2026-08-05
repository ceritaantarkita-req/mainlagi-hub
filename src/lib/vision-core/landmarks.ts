// GENERATED FILE - do not edit here.
// Source of truth: _vision-core/. Re-run `node _vision-core/sync.mjs` after changes.
/**
 * Hand landmark analysis.
 *
 * The previous implementation decided whether a finger was extended by comparing
 * each joint's straight-line distance to the wrist. That test collapses as soon as
 * the hand tilts toward the camera, because every joint ends up roughly the same
 * distance away. This version measures the interior angle at the PIP joint
 * instead, which is invariant to how the hand is rotated or how far away it is.
 */

export interface Landmark {
  x: number;
  y: number;
  z?: number;
}

export type HandPose = "point" | "open" | "fist" | "pinch" | "unknown";

export interface HandAnalysis {
  pose: HandPose;
  /** 0..1 - how confident the pose classification is. */
  confidence: number;
  extended: { thumb: boolean; index: boolean; middle: boolean; ring: boolean; pinky: boolean };
  extendedCount: number;
  /** Wrist-to-middle-MCP length; used to make thresholds distance-independent. */
  palmSize: number;
  /** Index fingertip, the drawing point. */
  tip: Landmark;
  /** Thumb tip. Paired with `tip` this gives the pinch. */
  thumbTip: Landmark;
  /**
   * Thumb-to-index distance divided by palm size.
   *
   * Exposed raw, not just as the "pinch" pose, because the pen controller needs
   * a continuous value to apply hysteresis to. A binary pose flag cannot express
   * "closing but not yet closed", which is exactly where chatter comes from.
   */
  pinchRatio: number;
  wrist: Landmark;
}

const FINGER_JOINTS = {
  thumb: [1, 2, 3, 4],
  index: [5, 6, 7, 8],
  middle: [9, 10, 11, 12],
  ring: [13, 14, 15, 16],
  pinky: [17, 18, 19, 20]
} as const;

export type FingerName = keyof typeof FINGER_JOINTS;

export const HAND_CONNECTIONS: ReadonlyArray<readonly [number, number]> = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17]
];

function distance2d(a: Landmark, b: Landmark): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Interior angle at `vertex`, in degrees. 180 means perfectly straight. */
export function jointAngle(from: Landmark, vertex: Landmark, to: Landmark): number {
  const ax = from.x - vertex.x;
  const ay = from.y - vertex.y;
  const bx = to.x - vertex.x;
  const by = to.y - vertex.y;
  const magnitude = Math.hypot(ax, ay) * Math.hypot(bx, by);
  if (magnitude < 1e-9) return 180;
  const cosine = Math.max(-1, Math.min(1, (ax * bx + ay * by) / magnitude));
  return (Math.acos(cosine) * 180) / Math.PI;
}

/**
 * A finger counts as extended when both of its joints are close to straight.
 * The thumb uses a looser threshold because it never straightens as far as the
 * other fingers do.
 */
export function isFingerExtended(landmarks: readonly Landmark[], finger: FingerName): boolean {
  const [mcp, pip, dip, tip] = FINGER_JOINTS[finger];
  const a = landmarks[mcp];
  const b = landmarks[pip];
  const c = landmarks[dip];
  const d = landmarks[tip];
  if (!a || !b || !c || !d) return false;
  const pipAngle = jointAngle(a, b, c);
  const dipAngle = jointAngle(b, c, d);
  const threshold = finger === "thumb" ? 150 : 160;
  return pipAngle >= threshold && dipAngle >= threshold - 25;
}

export function palmSizeOf(landmarks: readonly Landmark[]): number {
  const wrist = landmarks[0];
  const middleMcp = landmarks[9];
  if (!wrist || !middleMcp) return 0;
  return Math.max(1e-6, distance2d(wrist, middleMcp));
}

export function analyzeHand(landmarks: readonly Landmark[]): HandAnalysis | null {
  if (landmarks.length < 21) return null;
  const wrist = landmarks[0] as Landmark;
  const tip = landmarks[8] as Landmark;
  const thumbTip = landmarks[4] as Landmark;
  const palmSize = palmSizeOf(landmarks);

  const extended = {
    thumb: isFingerExtended(landmarks, "thumb"),
    index: isFingerExtended(landmarks, "index"),
    middle: isFingerExtended(landmarks, "middle"),
    ring: isFingerExtended(landmarks, "ring"),
    pinky: isFingerExtended(landmarks, "pinky")
  };
  const fingers = [extended.index, extended.middle, extended.ring, extended.pinky];
  const extendedCount = fingers.filter(Boolean).length;

  // Pinch is checked first: thumb and index tips touching overrides everything else.
  const pinchRatio = distance2d(thumbTip, tip) / palmSize;
  if (pinchRatio < 0.42) {
    return {
      pose: "pinch",
      confidence: Math.max(0, Math.min(1, (0.42 - pinchRatio) / 0.42)),
      extended,
      extendedCount,
      palmSize,
      tip,
      thumbTip,
      pinchRatio,
      wrist
    };
  }

  let pose: HandPose = "unknown";
  let confidence = 0.4;

  if (extended.index && !extended.middle && !extended.ring && !extended.pinky) {
    // Unambiguous pointing: exactly one finger up. This is the only pose that
    // may put ink on the canvas, so it is deliberately strict.
    pose = "point";
    confidence = 0.95;
  } else if (extendedCount >= 4) {
    pose = "open";
    confidence = 0.9;
  } else if (extendedCount === 0) {
    pose = "fist";
    confidence = 0.85;
  } else if (extended.index && extended.middle && !extended.ring && !extended.pinky) {
    // A "peace sign" is a common accident while pointing; treat it as its own
    // thing rather than silently drawing with it.
    pose = "unknown";
    confidence = 0.5;
  }

  return { pose, confidence, extended, extendedCount, palmSize, tip, thumbTip, pinchRatio, wrist };
}
