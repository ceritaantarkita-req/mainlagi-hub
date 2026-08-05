// GENERATED FILE - do not edit here.
// Source of truth: _vision-core/. Re-run `node _vision-core/sync.mjs` after changes.
/**
 * Pre-flight check that runs before any game or tool starts.
 *
 * Users reported that the apps simply "did not work" - what actually happened is
 * that play started while the camera, the model, or the hand were not ready yet,
 * so the first interactions silently did nothing. This state machine makes each
 * prerequisite visible and refuses to hand over control until the hand has been
 * held steady for a moment.
 */

export type ReadinessStage =
  | "camera"        // waiting for the video stream
  | "model"         // waiting for MediaPipe to load
  | "searching"     // no hand in frame yet
  | "detected"      // a hand is visible but not yet a usable pose
  | "calibrating"   // correct pose held, counting down
  | "ready";        // safe to start

export interface ReadinessSnapshot {
  stage: ReadinessStage;
  /** 0..1 progress through the calibration hold. */
  progress: number;
  message: string;
  handsSeen: number;
  canStart: boolean;
}

export interface ReadinessInput {
  cameraActive: boolean;
  modelReady: boolean;
  handsSeen: number;
  /** How many of the required hands are currently in the pointing pose. */
  pointingHands: number;
  requiredHands: number;
}

const MESSAGES: Record<ReadinessStage, string> = {
  camera: "Menunggu kamera aktif...",
  model: "Memuat model pendeteksi...",
  searching: "Arahkan tangan ke kamera",
  // Says what to do with the pen, since pinching is what actually draws now.
  detected: "Tangan terlihat - satukan jempol dan telunjuk",
  calibrating: "Bagus! Tahan sebentar...",
  ready: "Siap bermain"
};

export class ReadinessGate {
  private holdStartedAt: number | null = null;
  private stage: ReadinessStage = "camera";

  constructor(private readonly holdMs = 1200) {}

  reset(): void {
    this.holdStartedAt = null;
    this.stage = "camera";
  }

  update(input: ReadinessInput, now: number): ReadinessSnapshot {
    const required = Math.max(1, input.requiredHands);

    if (!input.cameraActive) return this.snapshot("camera", 0, input);
    if (!input.modelReady) return this.snapshot("model", 0, input);
    if (input.handsSeen < required) {
      this.holdStartedAt = null;
      return this.snapshot("searching", 0, input);
    }
    if (input.pointingHands < required) {
      this.holdStartedAt = null;
      return this.snapshot("detected", 0, input);
    }

    this.holdStartedAt ??= now;
    const held = now - this.holdStartedAt;
    if (held < this.holdMs) {
      return this.snapshot("calibrating", Math.max(0, Math.min(1, held / this.holdMs)), input);
    }
    return this.snapshot("ready", 1, input);
  }

  private snapshot(stage: ReadinessStage, progress: number, input: ReadinessInput): ReadinessSnapshot {
    this.stage = stage;
    return {
      stage,
      progress,
      message: MESSAGES[stage],
      handsSeen: input.handsSeen,
      canStart: stage === "ready"
    };
  }

  get current(): ReadinessStage {
    return this.stage;
  }
}
