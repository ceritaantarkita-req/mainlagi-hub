"use client";

/**
 * Silences MediaPipe's own logging.
 *
 * The MediaPipe WASM build writes its C++ log lines to stderr, which Emscripten
 * forwards to `console.error`. Next's development overlay treats anything on
 * that channel as an application error, so starting the camera filled the
 * screen with red boxes for lines that are purely informational:
 *
 *   INFO: Created TensorFlow Lite XNNPACK delegate for CPU.
 *   W0000 ... gl_context.cc:1118] OpenGL error checking is disabled
 *   W0000 ... landmark_projection_calculator.cc:81] Using NORM_RECT without ...
 *
 * None of those indicate a problem, and none of them are actionable. They are
 * matched exactly and downgraded to `console.debug`, so they remain available
 * when debugging while no longer masquerading as failures. Anything that does
 * not match is passed through untouched - this must never hide a real error.
 */

const NOISE_PATTERNS: RegExp[] = [
  /^INFO: Created TensorFlow Lite XNNPACK delegate/,
  /gl_context\.cc.*OpenGL error checking is disabled/,
  /landmark_projection_calculator\.cc.*NORM_RECT without IMAGE_DIMENSIONS/,
  /face_landmarker_graph\.cc.*FaceBlendshapesGraph acceleration/,
  /inference_feedback_manager\.cc/,
  /^W\d{4} \d{2}:\d{2}:\d{2}\.\d+\s+\d+ \w+\.cc:\d+\]/
];

let installed = false;

function isNoise(args: unknown[]): boolean {
  const first = args[0];
  if (typeof first !== "string") return false;
  return NOISE_PATTERNS.some((pattern) => pattern.test(first));
}

export function silenceMediapipeLogs(): void {
  if (installed || typeof window === "undefined") return;
  installed = true;

  for (const channel of ["error", "warn", "info"] as const) {
    const original = console[channel].bind(console);
    console[channel] = (...args: unknown[]) => {
      if (isNoise(args)) {
        console.debug("[mediapipe]", ...args);
        return;
      }
      original(...args);
    };
  }
}
