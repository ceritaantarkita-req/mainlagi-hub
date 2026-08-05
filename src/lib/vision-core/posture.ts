// GENERATED FILE - do not edit here.
// Source of truth: _vision-core/. Re-run `node _vision-core/sync.mjs` after changes.
/**
 * Whole-body readiness checks.
 *
 * Hand-signal training needs the arms in frame, not just a hand. Previously the
 * app started the moment the camera turned on, so a user standing too close -
 * with their elbows outside the frame - got no recognition at all and no
 * explanation. This reports exactly which body parts are missing so the UI can
 * say "step back" instead of failing silently.
 */

export interface PoseLandmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

/** MediaPipe Pose landmark indices we care about. */
export const POSE_INDEX = {
  nose: 0,
  leftShoulder: 11,
  rightShoulder: 12,
  leftElbow: 13,
  rightElbow: 14,
  leftWrist: 15,
  rightWrist: 16,
  leftHip: 23,
  rightHip: 24
} as const;

export type BodyPart = keyof typeof POSE_INDEX;

export interface BodyVisibility {
  /** Parts that are present and confidently placed inside the frame. */
  visible: BodyPart[];
  missing: BodyPart[];
  /** 0..1 share of the required parts that are usable. */
  coverage: number;
  /** Shoulder width as a fraction of frame width; a proxy for distance. */
  shoulderSpan: number;
  distanceHint: "too-close" | "too-far" | "good" | "unknown";
  ready: boolean;
}

const REQUIRED: BodyPart[] = [
  "leftShoulder", "rightShoulder",
  "leftElbow", "rightElbow",
  "leftWrist", "rightWrist"
];

function usable(landmark: PoseLandmark | undefined, minVisibility: number): boolean {
  if (!landmark) return false;
  if ((landmark.visibility ?? 1) < minVisibility) return false;
  // A landmark outside 0..1 has been extrapolated beyond the frame edge.
  return landmark.x >= -0.02 && landmark.x <= 1.02 && landmark.y >= -0.02 && landmark.y <= 1.02;
}

export function evaluateBodyVisibility(
  landmarks: readonly PoseLandmark[] | null,
  options: { minVisibility?: number; required?: BodyPart[] } = {}
): BodyVisibility {
  const minVisibility = options.minVisibility ?? 0.5;
  const required = options.required ?? REQUIRED;

  if (!landmarks || landmarks.length === 0) {
    return {
      visible: [], missing: [...required], coverage: 0,
      shoulderSpan: 0, distanceHint: "unknown", ready: false
    };
  }

  const visible: BodyPart[] = [];
  const missing: BodyPart[] = [];
  for (const part of required) {
    if (usable(landmarks[POSE_INDEX[part]], minVisibility)) visible.push(part);
    else missing.push(part);
  }

  const left = landmarks[POSE_INDEX.leftShoulder];
  const right = landmarks[POSE_INDEX.rightShoulder];
  const shoulderSpan = left && right ? Math.abs(left.x - right.x) : 0;

  let distanceHint: BodyVisibility["distanceHint"] = "unknown";
  if (shoulderSpan > 0) {
    if (shoulderSpan > 0.55) distanceHint = "too-close";
    else if (shoulderSpan < 0.12) distanceHint = "too-far";
    else distanceHint = "good";
  }

  const coverage = required.length === 0 ? 1 : visible.length / required.length;
  return {
    visible,
    missing,
    coverage,
    shoulderSpan,
    distanceHint,
    ready: missing.length === 0 && distanceHint === "good"
  };
}

export const BODY_PART_LABELS_ID: Record<BodyPart, string> = {
  nose: "wajah",
  leftShoulder: "bahu kiri",
  rightShoulder: "bahu kanan",
  leftElbow: "siku kiri",
  rightElbow: "siku kanan",
  leftWrist: "pergelangan kiri",
  rightWrist: "pergelangan kanan",
  leftHip: "pinggul kiri",
  rightHip: "pinggul kanan"
};

export const BODY_PART_LABELS_EN: Record<BodyPart, string> = {
  nose: "face",
  leftShoulder: "left shoulder",
  rightShoulder: "right shoulder",
  leftElbow: "left elbow",
  rightElbow: "right elbow",
  leftWrist: "left wrist",
  rightWrist: "right wrist",
  leftHip: "left hip",
  rightHip: "right hip"
};

export function distanceMessage(hint: BodyVisibility["distanceHint"], locale: "id" | "en" = "id"): string {
  const messages = {
    id: {
      "too-close": "Terlalu dekat - mundur sedikit supaya siku terlihat.",
      "too-far": "Terlalu jauh - maju sedikit ke arah kamera.",
      good: "Jarak sudah pas.",
      unknown: "Berdiri menghadap kamera."
    },
    en: {
      "too-close": "Too close - step back so your elbows fit in frame.",
      "too-far": "Too far - move closer to the camera.",
      good: "Distance looks good.",
      unknown: "Stand facing the camera."
    }
  } as const;
  return messages[locale][hint];
}
