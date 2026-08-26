"use client";

import { useEffect, useRef } from "react";
import { useLatest } from "@/lib/react/useLatest";
import {
  createProjection,
  projectPoint,
  strokeScale,
  type StageProjection
} from "@/lib/vision/projection";
import type {
  Landmark,
  VisionRuntime,
  VisionSnapshot
} from "@/lib/vision/types";

/**
 * Hand skeleton, drawn per finger so each digit is individually legible.
 * The previous build drew one flat list of 21 bones in a single colour at a
 * fixed 3 px, which collapsed into a blob on a phone.
 */
const HAND_CHAINS: Array<{ name: string; joints: number[] }> = [
  { name: "palm", joints: [0, 5, 9, 13, 17, 0] },
  { name: "thumb", joints: [0, 1, 2, 3, 4] },
  { name: "index", joints: [5, 6, 7, 8] },
  { name: "middle", joints: [9, 10, 11, 12] },
  { name: "ring", joints: [13, 14, 15, 16] },
  { name: "pinky", joints: [17, 18, 19, 20] }
];
const FINGERTIPS = new Set([4, 8, 12, 16, 20]);
const KNUCKLES = new Set([0, 5, 9, 13, 17]);

/**
 * MediaPipe pose topology, from the shoulders down.
 *
 * The nine face bones (nose-eye-ear, mouth) that MediaPipe also reports are
 * deliberately *not* drawn. Pose face points are coarse - they exist to orient
 * the body, not to describe a face - and rendering them as full-weight bones
 * painted a thick angular cage straight across each player's face, on top of
 * the 478-point face mesh already drawn there. Two overlapping representations
 * of the same face, one of them crude, read as breakage. The head now
 * contributes a single nose dot; the face mesh does the rest.
 */
const POSE_CONNECTIONS: Array<[number, number]> = [
  // Arms
  [11, 13], [13, 15], [12, 14], [14, 16],
  // Hands
  [15, 17], [15, 19], [15, 21], [17, 19],
  [16, 18], [16, 20], [16, 22], [18, 20],
  // Torso
  [11, 12], [11, 23], [12, 24], [23, 24],
  // Legs
  [23, 25], [25, 27], [24, 26], [26, 28],
  // Feet
  [27, 29], [27, 31], [29, 31],
  [28, 30], [28, 32], [30, 32]
];

/** Pose indices 1..10 are eyes, ears and mouth - the face mesh covers those. */
const POSE_FACE_DETAIL = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

/**
 * Face mesh contours. The full 478-point tessellation is far too dense to read
 * on a moving preview, so only the silhouette and the features that matter for
 * feedback are drawn.
 */
const FACE_CONTOURS: number[][] = [
  // Jaw and face silhouette
  [
    10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379,
    378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127,
    162, 21, 54, 103, 67, 109, 10
  ],
  // Left eye
  [33, 246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163, 7, 33],
  // Right eye
  [263, 466, 388, 387, 386, 385, 384, 398, 362, 382, 381, 380, 374, 373, 390, 249, 263],
  // Left brow
  [70, 63, 105, 66, 107],
  // Right brow
  [300, 293, 334, 296, 336],
  // Outer lips
  [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146, 61],
  // Inner lips
  [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95, 78],
  // Nose bridge and tip
  [168, 6, 197, 195, 5, 4, 1]
];

const PLAYER_COLOURS = {
  A: { body: "#5CA8FF", hand: "#8FE3FF", face: "#BFE6FF" },
  B: { body: "#FF73B6", hand: "#FFB4D8", face: "#FFD2E6" }
} as const;

const FINGER_TINT: Record<string, string> = {
  palm: "rgba(255,255,255,0.55)",
  thumb: "#FFD166",
  index: "#7BE495",
  middle: "#7FD4FF",
  ring: "#C6A8FF",
  pinky: "#FF9EB1"
};

type LandmarkSource = "hand" | "pose" | "face";

/**
 * Whether a landmark is worth drawing.
 *
 * This used to be one shared visibility gate, and it silently deleted the
 * entire hand skeleton. MediaPipe fills in `visibility: 0` for hand and face
 * landmarks - the field is vestigial there, not a confidence score - so a
 * `visibility >= 0.35` test rejected every single hand bone. The joint dots
 * survived only because the dot loop never consulted it, which is exactly the
 * "dots but no lines" you saw on screen.
 *
 * Visibility is meaningful for *pose* landmarks and nowhere else.
 */
function usable(point: Landmark | undefined, source: LandmarkSource): boolean {
  if (!point) return false;
  if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) return false;
  if (
    source === "pose" &&
    typeof point.visibility === "number" &&
    point.visibility < 0.5
  ) {
    return false;
  }
  // MediaPipe extrapolates landmarks past the edge of the frame - legs under a
  // desk, for example. Those are guesses, and joining them produced the long
  // lines shooting off the bottom of the screen.
  return point.x > -0.12 && point.x < 1.12 && point.y > -0.12 && point.y < 1.12;
}

/**
 * Rejects implausibly long bones.
 *
 * When one end of a limb is a bad estimate, the bone stretches across the whole
 * picture.
 */
function plausibleBone(
  from: { x: number; y: number },
  to: { x: number; y: number },
  maxLength: number
): boolean {
  return Math.hypot(to.x - from.x, to.y - from.y) <= maxLength;
}

/**
 * How long a bone is allowed to be, measured against the player's own body.
 *
 * The previous limit was a fraction of the *stage* diagonal, which on a wide
 * desktop window came to roughly half the screen - so a badly estimated hip or
 * ankle still drew a bone hundreds of pixels long before being rejected, which
 * is the wild criss-crossing in the reported screenshot. Shoulder width is the
 * right yardstick instead: it scales with how far the player is sitting from
 * the camera, so the same rule works for a child leaning in and a parent
 * sitting back. No human bone exceeds about twice the shoulder span, so a
 * limit of 2.4x is generous and still rejects the nonsense.
 *
 * Falls back to hip width, then to a conservative slice of the stage when the
 * torso itself is not visible.
 */
function boneLimitFor(
  landmarks: readonly Landmark[],
  projection: StageProjection,
  stageDiagonal: number
): number {
  const span = (first: number, second: number): number | null => {
    const a = landmarks[first];
    const b = landmarks[second];
    if (!usable(a, "pose") || !usable(b, "pose")) return null;
    const from = projectPoint(a!.x, a!.y, projection);
    const to = projectPoint(b!.x, b!.y, projection);
    const length = Math.hypot(to.x - from.x, to.y - from.y);
    return length > 1 ? length : null;
  };

  const shoulders = span(11, 12);
  if (shoulders) return shoulders * 2.4;
  const hips = span(23, 24);
  if (hips) return hips * 3;
  // Neither shoulders nor hips visible: the pose is largely guesswork, so the
  // limit stays deliberately tight rather than trusting it.
  return stageDiagonal * 0.15;
}

/**
 * Bounding box of a body's usable pose landmarks, in projected stage pixels.
 * Used to draw the per-player lock box - a visible confirmation that the
 * identity tracking in `BodySlotTracker` is holding onto one consistent
 * person rather than drifting, and the thing a parent can actually glance at
 * to tell whether it's working.
 */
function boundingBoxFor(
  landmarks: readonly Landmark[],
  projection: StageProjection
): { minX: number; minY: number; maxX: number; maxY: number } | null {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (let index = 0; index < landmarks.length; index += 1) {
    if (POSE_FACE_DETAIL.has(index)) continue;
    const point = landmarks[index];
    if (!usable(point, "pose")) continue;
    const projected = projectPoint(point!.x, point!.y, projection);
    if (projected.x < minX) minX = projected.x;
    if (projected.y < minY) minY = projected.y;
    if (projected.x > maxX) maxX = projected.x;
    if (projected.y > maxY) maxY = projected.y;
  }
  if (!Number.isFinite(minX) || !Number.isFinite(minY)) return null;
  return { minX, minY, maxX, maxY };
}

/**
 * Draws a dashed lock box with a small "PEMAIN A/B" tag over one tracked
 * body. Deliberately just an outline - a filled panel here would repeat the
 * exact mistake fixed in the math-choice game, hiding the player behind the
 * very thing meant to show they are being tracked.
 */
function drawLockBox(
  context: CanvasRenderingContext2D,
  box: { minX: number; minY: number; maxX: number; maxY: number },
  colour: string,
  label: string,
  unit: number
): void {
  const pad = 14 * unit;
  const x = box.minX - pad;
  const y = box.minY - pad;
  const width = box.maxX - box.minX + pad * 2;
  const height = box.maxY - box.minY + pad * 2;
  const radius = Math.max(4, Math.min(18 * unit, width / 2, height / 2));

  context.save();
  context.globalAlpha = 0.85;
  context.strokeStyle = colour;
  context.lineWidth = 2 * unit;
  context.setLineDash([8 * unit, 6 * unit]);
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
  context.stroke();
  context.setLineDash([]);

  const fontSize = Math.max(11, 12 * unit);
  context.font = `700 ${fontSize}px ui-sans-serif, system-ui, sans-serif`;
  const textWidth = context.measureText(label).width;
  const labelPadX = 8 * unit;
  const labelHeight = Math.max(18, 20 * unit);
  const labelWidth = textWidth + labelPadX * 2;
  const labelX = x;
  const labelY = Math.max(0, y - labelHeight - 4 * unit);

  context.globalAlpha = 0.92;
  context.fillStyle = colour;
  context.beginPath();
  context.roundRect(labelX, labelY, labelWidth, labelHeight, Math.min(6 * unit, labelHeight / 2));
  context.fill();

  context.globalAlpha = 1;
  context.fillStyle = "#08152c";
  context.textBaseline = "middle";
  context.fillText(label, labelX + labelPadX, labelY + labelHeight / 2 + 0.5);
  context.restore();
}

function drawPolyline(
  context: CanvasRenderingContext2D,
  landmarks: readonly Landmark[],
  indices: readonly number[],
  projection: StageProjection,
  source: LandmarkSource,
  colour: string,
  width: number
): void {
  context.strokeStyle = colour;
  context.lineWidth = width;
  context.beginPath();

  let started = false;
  for (const index of indices) {
    const point = landmarks[index];
    if (!usable(point, source)) {
      started = false;
      continue;
    }
    const projected = projectPoint(point!.x, point!.y, projection);
    if (started) context.lineTo(projected.x, projected.y);
    else context.moveTo(projected.x, projected.y);
    started = true;
  }

  context.stroke();
}

/**
 * Skeleton overlay.
 *
 * Draws from its own animation frame, reading the latest snapshot out of the
 * runtime rather than receiving it as a prop. Passing the snapshot down meant
 * this component re-rendered ~25 times a second and dragged the whole game
 * tree with it.
 */
export function VisionOverlay({
  vision,
  showSkeleton = true,
  showFace = true
}: {
  vision: VisionRuntime;
  showSkeleton?: boolean;
  showFace?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const optionsRef = useLatest({ showSkeleton, showFace });
  const tessellationRef = useRef<Array<[number, number]> | null>(null);

  // The tessellation index list ships inside the MediaPipe bundle, which the
  // vision runtime has already loaded, so this import resolves from cache.
  useEffect(() => {
    if (!showFace) return;
    let cancelled = false;
    void import("@mediapipe/tasks-vision")
      .then((vision) => {
        if (cancelled) return;
        const raw = vision.FaceLandmarker
          .FACE_LANDMARKS_TESSELATION as ReadonlyArray<{
          start: number;
          end: number;
        }>;
        tessellationRef.current = raw.map(
          (item) => [item.start, item.end] as [number, number]
        );
      })
      .catch(() => {
        // Without it the feature outlines still draw.
        tessellationRef.current = null;
      });
    return () => {
      cancelled = true;
    };
  }, [showFace]);

  useEffect(() => {
    let frame = 0;
    let lastDrawn = -1;

    const render = () => {
      frame = requestAnimationFrame(render);
      const snapshot = vision.getSnapshot();
      // Nothing new since the last paint: skip the work entirely.
      if (snapshot.timestamp === lastDrawn) return;
      lastDrawn = snapshot.timestamp;
      draw(snapshot);
    };

    const draw = (snapshot: VisionSnapshot) => {
    const { showSkeleton, showFace } = optionsRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));

    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) return;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, rect.width, rect.height);
    if (!showSkeleton) return;

    // The preview uses object-fit: cover, so landmarks must be projected
    // through the same crop the player is looking at.
    const projection = createProjection(
      rect.width,
      rect.height,
      snapshot.sourceWidth,
      snapshot.sourceHeight,
      true
    );
    const unit = strokeScale(projection);

    context.lineCap = "round";
    context.lineJoin = "round";

    // --- Face mesh -------------------------------------------------------
    if (showFace) {
      for (const face of snapshot.faces) {
        const colour = PLAYER_COLOURS[face.player].face;

        // The real 478-point tessellation, drawn faintly. Sparse contours read
        // as random scribbles on a moving face; the tessellation reads as a
        // mesh, which is what it actually is.
        const mesh = tessellationRef.current;
        if (mesh) {
          context.globalAlpha = face.attentive ? 0.3 : 0.16;
          context.strokeStyle = colour;
          context.lineWidth = Math.max(0.5, 0.6 * unit);
          context.beginPath();
          for (const [a, b] of mesh) {
            const first = face.landmarks[a];
            const second = face.landmarks[b];
            if (!usable(first, "face") || !usable(second, "face")) continue;
            const from = projectPoint(first!.x, first!.y, projection);
            const to = projectPoint(second!.x, second!.y, projection);
            context.moveTo(from.x, from.y);
            context.lineTo(to.x, to.y);
          }
          context.stroke();
        }

        // Feature outlines on top, brighter, so eyes and mouth stay readable.
        context.globalAlpha = face.attentive ? 0.95 : 0.5;
        for (const contour of FACE_CONTOURS) {
          drawPolyline(
            context,
            face.landmarks,
            contour,
            projection,
            "face",
            colour,
            1.3 * unit
          );
        }
        context.globalAlpha = 1;
      }
    }

    // --- Body skeleton ---------------------------------------------------
    for (const body of snapshot.bodies) {
      const colour = PLAYER_COLOURS[body.player].body;

      const maxBone = boneLimitFor(
        body.landmarks,
        projection,
        Math.hypot(rect.width, rect.height)
      );
      const bones: Array<[{ x: number; y: number }, { x: number; y: number }]> = [];
      for (const [a, b] of POSE_CONNECTIONS) {
        const first = body.landmarks[a];
        const second = body.landmarks[b];
        if (!usable(first, "pose") || !usable(second, "pose")) continue;
        const from = projectPoint(first!.x, first!.y, projection);
        const to = projectPoint(second!.x, second!.y, projection);
        if (!plausibleBone(from, to, maxBone)) continue;
        bones.push([from, to]);
      }

      // Soft halo underneath so the skeleton reads over a bright background.
      context.strokeStyle = "rgba(4,12,28,0.45)";
      context.lineWidth = 6 * unit;
      context.beginPath();
      for (const [from, to] of bones) {
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);
      }
      context.stroke();

      context.strokeStyle = colour;
      context.lineWidth = 3.2 * unit;
      context.beginPath();
      for (const [from, to] of bones) {
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);
      }
      context.stroke();

      context.fillStyle = colour;
      for (let index = 0; index < body.landmarks.length; index += 1) {
        if (POSE_FACE_DETAIL.has(index)) continue;
        const point = body.landmarks[index];
        if (!usable(point, "pose")) continue;
        const projected = projectPoint(point!.x, point!.y, projection);
        // Major joints get a larger dot than face and finger points.
        const major = index === 0 || (index >= 11 && index <= 28);
        context.beginPath();
        context.arc(
          projected.x,
          projected.y,
          (major ? 3.6 : 1.9) * unit,
          0,
          Math.PI * 2
        );
        context.fill();
      }

      // Lock box: visible confirmation of which person this skeleton is
      // currently attached to, and that it is staying attached to them.
      const box = boundingBoxFor(body.landmarks, projection);
      if (box) {
        drawLockBox(
          context,
          box,
          colour,
          body.player === "A" ? "PEMAIN A" : "PEMAIN B",
          unit
        );
      }
    }

    // --- Hand skeleton ---------------------------------------------------
    for (const hand of snapshot.hands) {
      const base = PLAYER_COLOURS[hand.player].hand;
      const emphasis = hand.primary ? 1 : 0.62;
      context.globalAlpha = emphasis;

      for (const chain of HAND_CHAINS) {
        drawPolyline(
          context,
          hand.landmarks,
          chain.joints,
          projection,
          "hand",
          "rgba(4,12,28,0.5)",
          5.4 * unit
        );
      }

      for (const chain of HAND_CHAINS) {
        drawPolyline(
          context,
          hand.landmarks,
          chain.joints,
          projection,
          "hand",
          chain.name === "palm" ? base : (FINGER_TINT[chain.name] ?? base),
          (chain.name === "palm" ? 3.4 : 3) * unit
        );
      }

      for (let index = 0; index < hand.landmarks.length; index += 1) {
        const point = hand.landmarks[index];
        if (!usable(point, "hand")) continue;
        const projected = projectPoint(point.x, point.y, projection);
        const radius = FINGERTIPS.has(index)
          ? 4.2
          : KNUCKLES.has(index)
            ? 3
            : 2.2;
        context.fillStyle = FINGERTIPS.has(index) ? "#FFFFFF" : base;
        context.beginPath();
        context.arc(projected.x, projected.y, radius * unit, 0, Math.PI * 2);
        context.fill();
      }

      // The index fingertip of the pen hand gets a ring so a child can see
      // exactly which point the game is following.
      const tip = hand.landmarks[8];
      if (hand.primary && tip) {
        const projected = projectPoint(tip.x, tip.y, projection);
        context.strokeStyle =
          hand.gesture === "pinch" ? "#C8F26B" : "rgba(255,255,255,0.85)";
        context.lineWidth = 2.4 * unit;
        context.beginPath();
        context.arc(projected.x, projected.y, 11 * unit, 0, Math.PI * 2);
        context.stroke();
      }

      context.globalAlpha = 1;
    }
    };

    frame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frame);
  }, [optionsRef, vision]);

  return <canvas className="vision-overlay" ref={canvasRef} aria-hidden />;
}
