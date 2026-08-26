import type { PlayerId, Point } from "../engine/types";
import type { Landmark } from "./types";

export interface BodyCandidate {
  id: string;
  player: PlayerId;
  landmarks: Landmark[];
  center: Point;
}

export interface HandCandidate {
  id: string;
  landmarks: Landmark[];
  point: Point;
}

interface BodyObservation {
  id: string;
  landmarks: Landmark[];
  center: Point;
}

function centerOf(landmarks: Landmark[], index: number): BodyObservation {
  const keypoints = [landmarks[11], landmarks[12], landmarks[23], landmarks[24]].filter(
    Boolean
  ) as Landmark[];
  const x =
    keypoints.reduce((sum, point) => sum + (1 - point.x), 0) /
    Math.max(1, keypoints.length);
  const y =
    keypoints.reduce((sum, point) => sum + point.y, 0) /
    Math.max(1, keypoints.length);
  return { id: `body-${index}`, landmarks, center: { x, y } };
}

function pointDistance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function landmarkDistance(a?: Landmark, b?: Landmark): number {
  return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 999;
}

/**
 * How far (normalized 0..1 stage units) a player's tracked centre may
 * plausibly move in a single frame while under continuous observation.
 * Loose enough for a child jumping or a parent leaning in, tight enough that
 * a stranger standing elsewhere in the room cannot be mistaken for the same
 * person just because they happen to be the closest thing on screen.
 */
const BASE_JUMP_BUDGET = 0.16;
/** Extra slack per missed frame, so a player who steps out of frame and back
 *  in still reclaims their own slot instead of being locked out forever. */
const JUMP_BUDGET_GROWTH = 0.03;
const MAX_JUMP_BUDGET = 0.6;
/**
 * How close a "recovery" candidate (one only inside the *grown* budget, not
 * the base one) has to land to the previous frame's recovery candidate to be
 * trusted. A real player settling back into roughly the same spot clears
 * this easily two frames running; someone else merely crossing that same
 * patch of floor is somewhere new again the very next frame.
 */
const RECOVERY_CONFIRM_RADIUS = 0.06;

/**
 * Maintains temporal A/B slots instead of reassigning players solely from the
 * left/right order of one frame. The first frame initializes left-to-right;
 * subsequent frames choose the assignment with the lowest movement cost -
 * but a candidate too far from where that slot was last seen is rejected
 * outright rather than accepted just because it was the closer of two. That
 * rejection is what stops the skeleton from snapping onto somebody else who
 * walks through the shot: without it, the moment a real player stepped out
 * of frame for one pose, whichever slot they used to occupy would happily
 * hand itself to whoever was nearest, stranger or not.
 */
export class BodySlotTracker {
  private anchors: Partial<Record<PlayerId, Point>> = {};
  private missingFrames: Record<PlayerId, number> = { A: 0, B: 0 };
  private pendingRecovery: Partial<Record<PlayerId, Point>> = {};

  reset(): void {
    this.anchors = {};
    this.missingFrames = { A: 0, B: 0 };
    this.pendingRecovery = {};
  }

  /** How far `player` is allowed to have moved since it was last confirmed. */
  private jumpBudget(player: PlayerId): number {
    return Math.min(
      MAX_JUMP_BUDGET,
      BASE_JUMP_BUDGET + this.missingFrames[player] * JUMP_BUDGET_GROWTH
    );
  }

  /**
   * Decides whether `candidate` is close enough to `player`'s last confirmed
   * position to accept. Ordinary continuous movement (within the base
   * budget) is accepted immediately. Anything further only qualifies via the
   * grown, missed-frames budget, and a single frame of that is not enough:
   * it has to land near the *same* spot again the frame after, so a passing
   * stranger who happens to cross a long-vacant anchor cannot be mistaken
   * for the real player settling back into place.
   */
  private accept(
    player: PlayerId,
    candidate: BodyObservation,
    distance: number
  ): boolean {
    if (distance <= BASE_JUMP_BUDGET) {
      delete this.pendingRecovery[player];
      return true;
    }
    if (distance > this.jumpBudget(player)) {
      delete this.pendingRecovery[player];
      return false;
    }
    const pending = this.pendingRecovery[player];
    if (pending && pointDistance(pending, candidate.center) <= RECOVERY_CONFIRM_RADIUS) {
      delete this.pendingRecovery[player];
      return true;
    }
    this.pendingRecovery[player] = candidate.center;
    return false;
  }

  update(landmarkSets: readonly Landmark[][], playerCount: 1 | 2): BodyCandidate[] {
    const observations = landmarkSets
      .map((landmarks, index) => centerOf(landmarks, index))
      .filter((body) => body.landmarks.length >= 25)
      .slice(0, Math.max(1, playerCount + 1));

    if (playerCount === 1) {
      const current = observations[0];
      if (!current) {
        this.missingFrames.A += 1;
        if (this.missingFrames.A > 30) delete this.anchors.A;
        return [];
      }
      if (this.anchors.A) {
        const distance = pointDistance(current.center, this.anchors.A);
        // Solo mode still has exactly one MediaPipe pose to work with, but
        // that one pose is not guaranteed to be *our* player - somebody else
        // stepping into frame while the real player is briefly missed is
        // enough to steal the slot without this check.
        if (!this.accept("A", current, distance)) {
          this.missingFrames.A += 1;
          if (this.missingFrames.A > 30) delete this.anchors.A;
          return [];
        }
      }
      this.missingFrames.A = 0;
      this.anchors.A = current.center;
      return [{ ...current, player: "A" }];
    }

    if (observations.length === 0) {
      this.missingFrames.A += 1;
      this.missingFrames.B += 1;
      if (this.missingFrames.A > 30) delete this.anchors.A;
      if (this.missingFrames.B > 30) delete this.anchors.B;
      return [];
    }

    if (!this.anchors.A || !this.anchors.B) {
      const ordered = [...observations].sort((left, right) => left.center.x - right.center.x);
      const result: BodyCandidate[] = [];
      const a = ordered[0];
      const b = ordered[1];
      if (a) {
        this.anchors.A = a.center;
        this.missingFrames.A = 0;
        result.push({ ...a, player: "A" });
      }
      if (b) {
        this.anchors.B = b.center;
        this.missingFrames.B = 0;
        result.push({ ...b, player: "B" });
      }
      return result;
    }

    // Both anchors are established. Each one independently claims its
    // nearest *plausible* observation - rather than forcing every
    // observation into an A/B pairing by whichever total distance is
    // smaller. Cost-minimizing the whole pairing sounds equivalent, but is
    // not: when one observation is a stranger, the "cheaper overall"
    // pairing can drag a genuinely good match down with it (a good A-match
    // gets forced into B's slot because that pairing's *total* happens to
    // cost less, even though neither leg is actually plausible). Matching
    // per-anchor and gating each claim independently does not have that
    // failure mode.
    type Claim = { body: BodyObservation; distance: number };
    const claims: Partial<Record<PlayerId, Claim>> = {};
    for (const player of ["A", "B"] as const) {
      const previous = this.anchors[player]!;
      let best: BodyObservation | null = null;
      let bestDistance = Infinity;
      for (const body of observations) {
        const distance = pointDistance(body.center, previous);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = body;
        }
      }
      if (best && bestDistance <= this.jumpBudget(player)) {
        claims[player] = { body: best, distance: bestDistance };
      }
    }

    // Both anchors reaching for the same observation only happens when one
    // of them is the true match and the other's nearest-plausible pick was
    // second-best; give it to whichever anchor is actually closer.
    if (claims.A && claims.B && claims.A.body === claims.B.body) {
      if (claims.A.distance <= claims.B.distance) delete claims.B;
      else delete claims.A;
    }

    const result: BodyCandidate[] = [];
    for (const player of ["A", "B"] as const) {
      const claim = claims[player];
      if (!claim || !this.accept(player, claim.body, claim.distance)) {
        this.missingFrames[player] += 1;
        if (this.missingFrames[player] > 30) delete this.anchors[player];
        continue;
      }
      const previous = this.anchors[player]!;
      const smoothed = {
        x: previous.x + (claim.body.center.x - previous.x) * 0.35,
        y: previous.y + (claim.body.center.y - previous.y) * 0.35
      };
      this.anchors[player] = smoothed;
      this.missingFrames[player] = 0;
      result.push({ ...claim.body, player });
    }

    return result;
  }
}

export function playerForBody(body: BodyCandidate): PlayerId {
  return body.player;
}

/** How far a hand may be from the nearest tracked player and still plausibly
 *  be theirs, rather than a third person's. Generous on purpose - a raised
 *  hand can sit well away from its own torso - but finite, which a fixed
 *  screen dead-band never was. */
const HAND_PLAUSIBLE_RADIUS = 0.6;

/**
 * Whether a detected hand plausibly belongs to one of the tracked players,
 * as opposed to somebody else in the room.
 *
 * `assignHandToPlayer` below always *commits* to a player once a hand is
 * treated as belonging to the game - that guarantee is what fixed the dead
 * band where a parent and child's hands met in the middle of frame and the
 * pen died mid-stroke. But "always commit once it belongs" is a different
 * claim from "everything HandLandmarker reports belongs": a third person
 * walking past the camera can register a hand too, and without this check it
 * got folded into whichever player's slot was merely closest - which is what
 * a jumping skeleton/hand actually looked like from the player's side.
 *
 * Only filters when at least one player is currently tracked; with nothing
 * to compare against there is no plausible/implausible to decide, so every
 * hand is kept (matches the existing frame-half fallback in
 * `assignHandToPlayer`).
 */
export function isHandPlausible(
  hand: HandCandidate,
  bodies: readonly BodyCandidate[]
): boolean {
  if (bodies.length === 0) return true;
  const nearest = Math.min(
    ...bodies.map((body) => pointDistance(body.center, hand.point))
  );
  return nearest <= HAND_PLAUSIBLE_RADIUS;
}

/**
 * Decides which player a detected hand belongs to.
 *
 * This used to be able to answer "neither", and the caller dropped those hands
 * on the floor. That sounds harmless and is not: the dead band was the strip
 * between x=0.46 and x=0.54, and a parent and a five-year-old sharing one
 * camera sit shoulder to shoulder with their hands meeting in the middle of
 * the frame - precisely inside that strip. Their pen kept vanishing mid-stroke
 * for reasons invisible from the outside, which is what made two-player mode
 * so hard to use.
 *
 * A hand that is visible belongs to *somebody*, so this now always commits to
 * an answer, in falling order of evidence: the pose wrist it sits nearest, the
 * body it sits nearest, and failing both, which half of the frame it is in.
 */
export function assignHandToPlayer(
  hand: HandCandidate,
  bodies: readonly BodyCandidate[],
  playerCount: 1 | 2
): PlayerId {
  if (playerCount === 1) return "A";

  if (bodies.length >= 1) {
    // 1. Pose wrist proximity: the strongest signal, when the pose model has
    //    actually found the wrists. Requiring the runner-up to be clearly
    //    further away stops a coin-flip between two overlapping players from
    //    being treated as a confident match.
    const wrist = hand.landmarks[0];
    const byWrist = bodies
      .map((body) => ({
        player: body.player,
        distance: Math.min(
          landmarkDistance(wrist, body.landmarks[15]),
          landmarkDistance(wrist, body.landmarks[16])
        )
      }))
      .sort((left, right) => left.distance - right.distance);

    const best = byWrist[0];
    const runnerUp = byWrist[1];
    if (
      best &&
      best.distance < 0.42 &&
      (!runnerUp || runnerUp.distance > best.distance * 1.25)
    ) {
      return best.player;
    }

    // 2. Body centre. Bodies carry temporal A/B slots that survive detection
    //    reordering, so this stays stable frame to frame even when the two
    //    players' hands are tangled together in the middle of the picture.
    const byCentre = bodies
      .map((body) => ({
        player: body.player,
        distance: Math.abs(body.center.x - hand.point.x)
      }))
      .sort((left, right) => left.distance - right.distance);
    if (byCentre[0]) return byCentre[0].player;
  }

  // 3. No bodies tracked at all: split the frame down the middle. There is no
  //    dead band, because "I am not sure" is not an outcome the caller can do
  //    anything useful with.
  return hand.point.x < 0.5 ? "A" : "B";
}

/**
 * Chooses which of a player's hands drives the pen.
 *
 * Both hands stay tracked and drawn - the previous build silently discarded
 * every hand after the first, which is why the skeleton always looked like it
 * was missing fingers. Only the *pen* is single-handed, and the choice is
 * sticky: a pinching hand keeps the pen until it stops pinching for a while,
 * so resting the other hand in frame never steals the stroke mid-character.
 */
export class PrimaryHandSelector {
  private currentId: string | null = null;
  private idleSince: number | null = null;

  constructor(private readonly releaseMs = 600) {}

  /**
   * @param candidates hands belonging to one player
   * @returns the id of the hand that should own the pen, or null
   */
  select(
    candidates: readonly { id: string; pinching: boolean; score: number }[],
    nowMs: number
  ): string | null {
    if (!candidates.length) {
      this.currentId = null;
      this.idleSince = null;
      return null;
    }

    const held = candidates.find((hand) => hand.id === this.currentId);
    if (held) {
      if (held.pinching) {
        this.idleSince = null;
        return held.id;
      }
      this.idleSince ??= nowMs;
      const otherPinching = candidates.find(
        (hand) => hand.id !== held.id && hand.pinching
      );
      if (!otherPinching && nowMs - this.idleSince < this.releaseMs) {
        return held.id;
      }
    }

    const ranked = [...candidates].sort((left, right) => {
      if (left.pinching !== right.pinching) return left.pinching ? -1 : 1;
      return right.score - left.score;
    });
    const chosen = ranked[0] ?? null;
    this.currentId = chosen ? chosen.id : null;
    this.idleSince = null;
    return this.currentId;
  }

  reset(): void {
    this.currentId = null;
    this.idleSince = null;
  }
}

/**
 * Normalizes MediaPipe's handedness label into the side the player perceives.
 *
 * MediaPipe reports handedness for the *unmirrored* image. The preview is a
 * selfie view, so the label has to be flipped to match what the player sees.
 */
export function screenSideFor(handedness: string): "left" | "right" | "unknown" {
  if (handedness === "Left") return "right";
  if (handedness === "Right") return "left";
  return "unknown";
}
