# Technical Specification

## Stack

- Next.js 16 App Router.
- React 19.
- TypeScript.
- MediaPipe Tasks Vision 0.10.35.
- Native Canvas/SVG, MediaDevices API, localStorage.
- Node built-in test runner for deterministic engine tests.

## Routes

| Route | Purpose |
|---|---|
| `/` | Hub and game catalog |
| `/games/math-battle` | Two-player/random mathematics |
| `/games/number-trace` | Guided digit tracing |
| `/games/shape-quest` | Guided shape tracing |
| `/games/pattern-race` | Random sequence challenge |
| `/how-to-play` | Setup and gestures |
| `/privacy` | Camera/data behavior |
| `/api/health` | Deployment health response |

## Camera lifecycle

1. Request `getUserMedia` with 1280×720 ideal resolution.
2. Play local stream in mirrored video element.
3. Create Hand Landmarker with maximum 2 or 4 hands.
4. Prefer local WASM/model, then pinned official remote fallback.
5. Prefer GPU delegate, then CPU.
6. Process only new video frames.
7. Stop tracks and close landmarker during cleanup.

## Writing gesture

- Index fingertip is above index PIP.
- Middle, ring, and pinky tips are below their PIP joints.
- Points are smoothed with exponential interpolation.
- Path ends after approximately 650 ms without meaningful motion.
- Open palm held approximately 850 ms clears the current digit.

## Digit recognizer

The MVP uses deterministic unistroke template comparison:

1. resample to 64 points;
2. normalize bounding box and position;
3. compare path distance to digit 0–9 templates;
4. evaluate normal and horizontally flipped candidates;
5. combine absolute distance and nearest-neighbor separation into confidence;
6. reject low-confidence input as retry.

This is not a trained handwriting model. See `KNOWN_LIMITATIONS.md`.

## Performance controls

- Dynamic MediaPipe import prevents model loading on the hub page.
- Detection skips duplicate video timestamps.
- Trail length is capped at 240 points per player.
- Camera assets are local-first.
- Gameplay UI uses SVG paths and CSS transforms.

## Security/privacy controls

- Camera permission limited to same origin with `Permissions-Policy`.
- Microphone is disabled.
- No video upload endpoint exists.
- No authentication secrets or API keys are required.
- Security headers disable MIME sniffing and framing outside same origin.
