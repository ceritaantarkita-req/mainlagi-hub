# Known Limitations

## 1. Digit recognition is template-based

The included recognizer is deterministic and works without an additional AI model, but real children write digits in many styles and stroke orders. Production accuracy requires collecting consented trajectory samples and expanding/validating templates or replacing the classifier with a purpose-trained model.

## 2. Automated QA is not hardware QA

Engine rules, mirror utilities, randomization, state transitions, and simulated paths are testable in this environment. Webcam quality, hand occlusion, lighting, camera field of view, GPU support, and browser permissions must be validated on physical devices.

## 3. MediaPipe assets require installation or internet fallback

`npm install` tries to create local model/WASM assets. If the model download fails, runtime uses the pinned official remote URL. A fully air-gapped deployment must manually place the official model in `public/models/hand_landmarker.task`.

## 4. Mobile is secondary

The hub is responsive and single-player games can work on mobile, but two-player split-screen is optimized for laptop/desktop.

## 5. No cloud progress

Scores are stored only on the current browser. Clearing site data removes them.

## 6. Guided games use path similarity

Number Trace and Shape Quest compare normalized paths. They are learning games, not formal handwriting or motor-skill assessments.
