import type { GestureName, Landmark } from "./types";

function distance(a?: Landmark, b?: Landmark): number {
  return a && b
    ? Math.hypot(a.x - b.x, a.y - b.y, (a.z ?? 0) - (b.z ?? 0))
    : 999;
}

function angle(a?: Landmark, b?: Landmark, c?: Landmark): number {
  if (!a || !b || !c) return 0;
  const ax = a.x - b.x;
  const ay = a.y - b.y;
  const bx = c.x - b.x;
  const by = c.y - b.y;
  const denominator = Math.hypot(ax, ay) * Math.hypot(bx, by);
  if (denominator < 1e-8) return 180;
  const cosine = Math.max(
    -1,
    Math.min(1, (ax * bx + ay * by) / denominator)
  );
  return (Math.acos(cosine) * 180) / Math.PI;
}

function extended(
  landmarks: readonly Landmark[],
  joints: readonly [number, number, number, number],
  threshold = 155
): boolean {
  const [mcp, pip, dip, tip] = joints;
  return (
    angle(landmarks[mcp], landmarks[pip], landmarks[dip]) >= threshold &&
    angle(landmarks[pip], landmarks[dip], landmarks[tip]) >= threshold - 22
  );
}

const FINGERS = {
  index: [5, 6, 7, 8],
  middle: [9, 10, 11, 12],
  ring: [13, 14, 15, 16],
  pinky: [17, 18, 19, 20]
} as const;

function isThumbsUp(
  landmarks: readonly Landmark[],
  extendedFingerCount: number,
  palmSize: number
): boolean {
  const thumbMcp = landmarks[2];
  const thumbIp = landmarks[3];
  const thumbTip = landmarks[4];
  const wrist = landmarks[0];
  if (!thumbMcp || !thumbIp || !thumbTip || !wrist) return false;

  const thumbStraight =
    angle(landmarks[1], thumbMcp, thumbIp) >= 135 &&
    angle(thumbMcp, thumbIp, thumbTip) >= 135;
  const verticalTravel = (thumbMcp.y - thumbTip.y) / palmSize;
  const pointsUp =
    thumbTip.y < thumbIp.y &&
    thumbIp.y < thumbMcp.y &&
    thumbTip.y < wrist.y;

  return extendedFingerCount === 0 && thumbStraight && pointsUp && verticalTravel > 0.55;
}

/**
 * Pinch uses hysteresis rather than a single threshold.
 *
 * With one threshold the classification flickers at the boundary, and every
 * flicker splits a handwriting stroke in two. Entering a pinch requires the
 * fingers to be clearly together; leaving it requires them to be clearly
 * apart. The band between the two values is where a child's slightly loose
 * pinch lives, and inside that band the previous state is kept.
 */
export const PINCH_ENTER_RATIO = 0.4;
export const PINCH_EXIT_RATIO = 0.56;

export interface GestureAnalysis {
  gesture: GestureName;
  pinchRatio: number;
  confidence: number;
  extendedFingers: number;
}

export function analyzeGesture(
  landmarks: readonly Landmark[],
  wasPinching = false
): GestureAnalysis {
  if (landmarks.length < 21) {
    return {
      gesture: "unknown",
      pinchRatio: 99,
      confidence: 0,
      extendedFingers: 0
    };
  }

  const palm = Math.max(0.0001, distance(landmarks[0], landmarks[9]));
  const pinchRatio = distance(landmarks[4], landmarks[8]) / palm;
  const index = extended(landmarks, FINGERS.index);
  const middle = extended(landmarks, FINGERS.middle);
  const ring = extended(landmarks, FINGERS.ring);
  const pinky = extended(landmarks, FINGERS.pinky);
  const count = [index, middle, ring, pinky].filter(Boolean).length;
  const pinchThreshold = wasPinching ? PINCH_EXIT_RATIO : PINCH_ENTER_RATIO;

  if (isThumbsUp(landmarks, count, palm)) {
    const verticalTravel =
      ((landmarks[2]?.y ?? 0) - (landmarks[4]?.y ?? 0)) / palm;
    return {
      gesture: "thumbs-up",
      pinchRatio,
      confidence: Math.max(0.72, Math.min(0.98, verticalTravel / 1.2)),
      extendedFingers: count
    };
  }
  if (pinchRatio < pinchThreshold) {
    return {
      gesture: "pinch",
      pinchRatio,
      // Confidence grows as the fingers close further past the threshold.
      confidence: Math.max(0.5, Math.min(1, 1 - pinchRatio / pinchThreshold)),
      extendedFingers: count
    };
  }
  // Three extended fingers is enough to mean "open palm". Requiring all four
  // sounds stricter and safer, but in practice a child's ring finger rarely
  // straightens past the 155-degree test, so a genuinely open hand kept
  // flickering out of the "open" class - which is why holding the palm up to
  // submit only worked some of the time.
  if (count >= 3) {
    return {
      gesture: "open",
      pinchRatio,
      confidence: count >= 4 ? 0.9 : 0.72,
      extendedFingers: count
    };
  }
  if (count === 0) {
    return {
      gesture: "fist",
      pinchRatio,
      confidence: 0.86,
      extendedFingers: count
    };
  }
  if (index && count === 1) {
    return {
      gesture: "point",
      pinchRatio,
      confidence: 0.92,
      extendedFingers: count
    };
  }
  return {
    gesture: "unknown",
    pinchRatio,
    confidence: 0.45,
    extendedFingers: count
  };
}

/**
 * Debounces gesture transitions.
 *
 * Pinch enters after a single frame on purpose: MotionPad keeps a short
 * pre-pinch ring buffer and stitches those samples back into the stroke, so a
 * fast entry costs nothing while a slow one would clip the start of every
 * character. Non-drawing gestures still need two frames because a false
 * "open palm" would submit an unfinished answer.
 */
export class GestureLatch {
  private active: GestureName = "unknown";
  private candidate: GestureName = "unknown";
  private frames = 0;

  constructor(
    private readonly enterFrames = 2,
    private readonly exitFrames = 2,
    private readonly pinchEnterFrames = 1
  ) {}

  update(next: GestureName): GestureName {
    if (next === this.active) {
      this.candidate = next;
      this.frames = 0;
      return this.active;
    }

    if (next !== this.candidate) {
      this.candidate = next;
      this.frames = 1;
    } else {
      this.frames += 1;
    }

    const required =
      next === "unknown"
        ? this.exitFrames
        : next === "pinch"
          ? this.pinchEnterFrames
          : this.enterFrames;
    if (this.frames >= required) {
      this.active = next;
      this.frames = 0;
    }
    return this.active;
  }

  get current(): GestureName {
    return this.active;
  }

  reset(): void {
    this.active = "unknown";
    this.candidate = "unknown";
    this.frames = 0;
  }
}

/**
 * "Hold this gesture for a moment to confirm", with tolerance for dropouts.
 *
 * The previous inline version restarted its timer the instant a single frame
 * classified as anything else:
 *
 *     if (gesture === "open") started ??= now;
 *     else started = null;          // one bad frame and the hold is lost
 *
 * Hand classification is not stable frame to frame - a finger dips below the
 * straightness threshold, the hand rotates, the tracker drops a frame - so
 * over a 500 ms hold at ~25 fps a dropout is likely rather than rare. Every
 * dropout silently reset the countdown to zero, and the gesture appeared to
 * simply not work. That is the reported "kadang ga bisa".
 *
 * Here a dropout has to *persist* past `graceMs` before the hold is abandoned,
 * so the timer measures how long the player has genuinely been holding the
 * gesture rather than how lucky the classifier has been. After firing, a
 * cooldown prevents one long hold from triggering repeatedly.
 */
export class GestureHold {
  private since: number | null = null;
  private lastActiveAt: number | null = null;
  private cooldownUntil = 0;

  constructor(
    private readonly holdMs = 500,
    private readonly graceMs = 220,
    private readonly cooldownMs = 1200
  ) {}

  /** @returns true exactly once, on the frame the hold completes. */
  update(active: boolean, nowMs: number): boolean {
    if (nowMs < this.cooldownUntil) {
      // Still cooling down. Only a genuine release clears the state, so
      // continuing to hold does not immediately re-fire.
      if (!active) {
        this.since = null;
        this.lastActiveAt = null;
      }
      return false;
    }

    if (active) {
      this.since ??= nowMs;
      this.lastActiveAt = nowMs;
    } else if (
      this.lastActiveAt !== null &&
      nowMs - this.lastActiveAt > this.graceMs
    ) {
      this.since = null;
      this.lastActiveAt = null;
    }

    if (this.since !== null && nowMs - this.since >= this.holdMs) {
      this.since = null;
      this.lastActiveAt = null;
      this.cooldownUntil = nowMs + this.cooldownMs;
      return true;
    }
    return false;
  }

  /** Progress towards firing, 0..1 - for showing a filling ring. */
  progress(nowMs: number): number {
    if (this.since === null || nowMs < this.cooldownUntil) return 0;
    return Math.max(0, Math.min(1, (nowMs - this.since) / this.holdMs));
  }

  reset(): void {
    this.since = null;
    this.lastActiveAt = null;
  }
}
