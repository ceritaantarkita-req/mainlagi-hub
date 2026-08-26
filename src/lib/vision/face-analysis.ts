import type { PlayerId } from "../engine/types";
import type { FaceDistance, Landmark, TrackedFace } from "./types";

/**
 * MediaPipe FaceLandmarker canonical indices used here.
 * The full mesh has 478 points; only these are needed for the derived signals.
 */
const NOSE_TIP = 1;
const CHIN = 152;
const FOREHEAD = 10;
const CHEEK_LEFT = 234;
const CHEEK_RIGHT = 454;
const UPPER_LIP_INNER = 13;
const LOWER_LIP_INNER = 14;
const MOUTH_LEFT = 61;
const MOUTH_RIGHT = 291;
const LEFT_EYE_TOP = 159;
const LEFT_EYE_BOTTOM = 145;
const LEFT_EYE_OUTER = 33;
const LEFT_EYE_INNER = 133;
const RIGHT_EYE_TOP = 386;
const RIGHT_EYE_BOTTOM = 374;
const RIGHT_EYE_OUTER = 263;
const RIGHT_EYE_INNER = 362;

/** Face width below this fraction of the frame means the player is too far. */
const TOO_FAR_SCALE = 0.11;
/** Above this the player is close enough that hands leave the frame. */
const TOO_CLOSE_SCALE = 0.42;

function get(landmarks: readonly Landmark[], index: number): Landmark | undefined {
  return landmarks[index];
}

function span(
  landmarks: readonly Landmark[],
  a: number,
  b: number
): number {
  const first = get(landmarks, a);
  const second = get(landmarks, b);
  if (!first || !second) return 0;
  return Math.hypot(first.x - second.x, first.y - second.y);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function ratio(numerator: number, denominator: number): number {
  if (denominator < 1e-6) return 0;
  return numerator / denominator;
}

export function classifyFaceDistance(scale: number): FaceDistance {
  if (scale <= 0) return "unknown";
  if (scale < TOO_FAR_SCALE) return "too-far";
  if (scale > TOO_CLOSE_SCALE) return "too-close";
  return "good";
}

/**
 * Derives the interaction signals used by preflight, auto-pause and the
 * mouth-open submit shortcut from a raw FaceLandmarker result.
 *
 * All ratios are normalized by face size so that they stay stable whether the
 * player sits close to a laptop or stands three metres from a television.
 */
export function analyzeFace(
  landmarks: readonly Landmark[],
  player: PlayerId,
  id: string
): TrackedFace | null {
  if (landmarks.length < 468) return null;

  const faceWidth = span(landmarks, CHEEK_LEFT, CHEEK_RIGHT);
  const faceHeight = span(landmarks, FOREHEAD, CHIN);
  if (faceWidth < 1e-4 || faceHeight < 1e-4) return null;

  const mouthWidth = span(landmarks, MOUTH_LEFT, MOUTH_RIGHT);
  const mouthOpen = clamp(
    ratio(span(landmarks, UPPER_LIP_INNER, LOWER_LIP_INNER), mouthWidth),
    0,
    1.5
  );

  const leftEye = ratio(
    span(landmarks, LEFT_EYE_TOP, LEFT_EYE_BOTTOM),
    span(landmarks, LEFT_EYE_OUTER, LEFT_EYE_INNER)
  );
  const rightEye = ratio(
    span(landmarks, RIGHT_EYE_TOP, RIGHT_EYE_BOTTOM),
    span(landmarks, RIGHT_EYE_OUTER, RIGHT_EYE_INNER)
  );
  const eyeOpen = clamp((leftEye + rightEye) / 2, 0, 1);

  const nose = get(landmarks, NOSE_TIP);
  const cheekLeft = get(landmarks, CHEEK_LEFT);
  const cheekRight = get(landmarks, CHEEK_RIGHT);
  const forehead = get(landmarks, FOREHEAD);
  const chin = get(landmarks, CHIN);
  if (!nose || !cheekLeft || !cheekRight || !forehead || !chin) return null;

  // Yaw: how far the nose sits from the midpoint between the cheeks.
  const cheekMidX = (cheekLeft.x + cheekRight.x) / 2;
  const yaw = clamp(((nose.x - cheekMidX) / (faceWidth / 2)) * -1, -1, 1);

  // Pitch: how far the nose sits from the midpoint between forehead and chin.
  const verticalMidY = (forehead.y + chin.y) / 2;
  const pitch = clamp((nose.y - verticalMidY) / (faceHeight / 2), -1, 1);

  const scale = faceWidth;
  const distance = classifyFaceDistance(scale);
  const attentive = Math.abs(yaw) < 0.42 && Math.abs(pitch) < 0.5;

  return {
    id,
    player,
    landmarks: landmarks as Landmark[],
    // Mirror x so the face lives in the same screen space as hands and bodies.
    center: { x: 1 - nose.x, y: nose.y, t: 0 },
    mouthOpen,
    eyeOpen,
    yaw,
    pitch,
    scale,
    distance,
    attentive
  };
}

/**
 * Latches a sustained "mouth open" into a single submit event.
 *
 * A five-year-old cannot reliably hold an open palm still for 700 ms, but
 * opening the mouth is effortless and unambiguous. The latch requires the
 * mouth to close again before it can fire a second time, so one long yawn
 * never submits twice.
 */
export class MouthOpenLatch {
  private openedAt: number | null = null;
  private armed = true;

  constructor(
    private readonly openThreshold = 0.4,
    private readonly closeThreshold = 0.22,
    private readonly holdMs = 320
  ) {}

  /** Returns true on the frame the gesture completes. */
  update(mouthOpen: number, nowMs: number): boolean {
    if (mouthOpen < this.closeThreshold) {
      this.openedAt = null;
      this.armed = true;
      return false;
    }

    if (mouthOpen < this.openThreshold) return false;
    if (!this.armed) return false;

    this.openedAt ??= nowMs;
    if (nowMs - this.openedAt < this.holdMs) return false;

    this.armed = false;
    this.openedAt = null;
    return true;
  }

  reset(): void {
    this.openedAt = null;
    this.armed = true;
  }
}

/**
 * How far (as a fraction of frame width) a player's face may plausibly move
 * in one frame while continuously tracked. Mirrors the same budget in
 * `BodySlotTracker`, for the same reason: without it, the moment a real
 * player turned away or was briefly missed, this slot would hand itself to
 * whichever other face was nearest - stranger or not - which is what a face
 * mesh "jumping to someone else" actually was.
 */
const FACE_BASE_JUMP_BUDGET = 0.18;
const FACE_JUMP_BUDGET_GROWTH = 0.03;
const FACE_MAX_JUMP_BUDGET = 0.6;
/** Mirrors BodySlotTracker's recovery confirmation: a "grown budget" match
 *  has to land near the same spot two frames running before it is trusted,
 *  so a stranger merely crossing a long-vacant anchor is not enough. */
const FACE_RECOVERY_CONFIRM_RADIUS = 0.06;

/**
 * Assigns faces to player slots by horizontal position, with hysteresis so a
 * player who leans sideways does not swap identity with the other player.
 */
export class FaceSlotTracker {
  private anchors: Partial<Record<PlayerId, number>> = {};
  private missing: Record<PlayerId, number> = { A: 0, B: 0 };
  private pendingRecovery: Partial<Record<PlayerId, number>> = {};

  reset(): void {
    this.anchors = {};
    this.missing = { A: 0, B: 0 };
    this.pendingRecovery = {};
  }

  private jumpBudget(player: PlayerId): number {
    return Math.min(
      FACE_MAX_JUMP_BUDGET,
      FACE_BASE_JUMP_BUDGET + this.missing[player] * FACE_JUMP_BUDGET_GROWTH
    );
  }

  private accept(player: PlayerId, candidateX: number, distance: number): boolean {
    if (distance <= FACE_BASE_JUMP_BUDGET) {
      delete this.pendingRecovery[player];
      return true;
    }
    if (distance > this.jumpBudget(player)) {
      delete this.pendingRecovery[player];
      return false;
    }
    const pending = this.pendingRecovery[player];
    if (pending !== undefined && Math.abs(pending - candidateX) <= FACE_RECOVERY_CONFIRM_RADIUS) {
      delete this.pendingRecovery[player];
      return true;
    }
    this.pendingRecovery[player] = candidateX;
    return false;
  }

  update(
    faceSets: readonly Landmark[][],
    playerCount: 1 | 2
  ): Array<{ landmarks: Landmark[]; player: PlayerId; index: number }> {
    const observations = faceSets
      .map((landmarks, index) => ({
        landmarks,
        index,
        // Mirrored x of the nose tip.
        x: 1 - (landmarks[NOSE_TIP]?.x ?? 0.5)
      }))
      .filter((item) => item.landmarks.length >= 468)
      .slice(0, playerCount);

    if (!observations.length) {
      this.missing.A += 1;
      this.missing.B += 1;
      if (this.missing.A > 45) delete this.anchors.A;
      if (this.missing.B > 45) delete this.anchors.B;
      return [];
    }

    if (playerCount === 1) {
      const face = observations[0]!;
      if (this.anchors.A !== undefined) {
        const distance = Math.abs(face.x - this.anchors.A);
        // Solo mode still only ever gets one face from MediaPipe, but that
        // one face is not guaranteed to be our player's - somebody else
        // leaning into frame while the real player looks away is enough to
        // steal the slot without this check.
        if (!this.accept("A", face.x, distance)) {
          this.missing.A += 1;
          if (this.missing.A > 45) delete this.anchors.A;
          return [];
        }
      }
      this.anchors.A = face.x;
      this.missing.A = 0;
      return [{ landmarks: face.landmarks, player: "A", index: face.index }];
    }

    if (this.anchors.A === undefined || this.anchors.B === undefined) {
      const ordered = [...observations].sort((left, right) => left.x - right.x);
      const result: Array<{
        landmarks: Landmark[];
        player: PlayerId;
        index: number;
      }> = [];
      const first = ordered[0];
      const second = ordered[1];
      if (first) {
        this.anchors.A = first.x;
        this.missing.A = 0;
        result.push({
          landmarks: first.landmarks,
          player: "A",
          index: first.index
        });
      }
      if (second) {
        this.anchors.B = second.x;
        this.missing.B = 0;
        result.push({
          landmarks: second.landmarks,
          player: "B",
          index: second.index
        });
      }
      return result;
    }

    // Both anchors established: each independently claims its nearest
    // plausible observation (see BodySlotTracker for why this beats a single
    // global "cheapest total pairing" choice), gated through the same
    // accept() used above.
    type FaceObservation = (typeof observations)[number];
    type Claim = { face: FaceObservation; distance: number };
    const claims: Partial<Record<PlayerId, Claim>> = {};
    for (const player of ["A", "B"] as const) {
      const previous = this.anchors[player]!;
      let best: FaceObservation | null = null;
      let bestDistance = Infinity;
      for (const face of observations) {
        const distance = Math.abs(face.x - previous);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = face;
        }
      }
      if (best && bestDistance <= this.jumpBudget(player)) {
        claims[player] = { face: best, distance: bestDistance };
      }
    }

    if (claims.A && claims.B && claims.A.face === claims.B.face) {
      if (claims.A.distance <= claims.B.distance) delete claims.B;
      else delete claims.A;
    }

    const result: Array<{ landmarks: Landmark[]; player: PlayerId; index: number }> = [];
    for (const player of ["A", "B"] as const) {
      const claim = claims[player];
      if (!claim || !this.accept(player, claim.face.x, claim.distance)) {
        this.missing[player] += 1;
        if (this.missing[player] > 45) delete this.anchors[player];
        continue;
      }
      const previous = this.anchors[player]!;
      this.anchors[player] = previous + (claim.face.x - previous) * 0.4;
      this.missing[player] = 0;
      result.push({
        landmarks: claim.face.landmarks,
        player,
        index: claim.face.index
      });
    }
    return result;
  }
}
