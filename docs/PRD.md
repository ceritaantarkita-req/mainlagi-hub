# Product Requirements Document — Motion Learning Hub

## 1. Product definition

Motion Learning Hub is a browser-based learning platform for children approximately 4–8 years old. It converts webcam hand movement into educational input: air-written digits, guided number tracing, guided shape tracing, and answers to randomized mathematics and pattern questions.

## 2. Product principles

- Open and play without login.
- Camera processing stays on-device.
- Children receive immediate, friendly feedback.
- Recognition uncertainty triggers retry, not punishment.
- One reusable motion engine supports multiple games.
- Parent-child and classroom use are first-class scenarios.
- Mouse/touch demo mode is always available for review and accessibility.

## 3. Users

### Primary

- Kindergarten children.
- Grade 1 and Grade 2 students.

### Secondary

- Parents playing with a child.
- Teachers and tutors using a laptop/projector.
- Educational event operators.

## 4. MVP scope

### P0

- Hub homepage and four game catalog.
- Camera permission and lifecycle.
- MediaPipe hand landmark tracking.
- Mirrored user-facing coordinate system.
- Single-player and local two-player modes.
- Air-written digit recognition, one digit at a time.
- Guided tracing score for numbers and shapes.
- Procedural random question generation.
- Countdown, 60-second timer, pause, time-up, results, and replay.
- Mouse/touch demo fallback.
- Local best-score storage.
- Privacy and how-to-play pages.
- Automated engine tests and three deterministic simulations.

### P1

- Indonesian voice prompts.
- Additional digit templates learned from child testing.
- Classroom kiosk mode.
- Optional English interface.
- Offline service worker after model licensing and caching review.

### Out of scope

- Login and user accounts.
- Cloud database.
- Face recognition.
- Video upload or storage.
- Online multiplayer.
- Formal student assessment or report cards.
- Medical or diagnostic use.

## 5. Game requirements

### Math Motion Battle

- Same question for both players.
- Kindergarten: addition/subtraction, answer 0–10.
- Grade 1: addition/subtraction, answer 0–20.
- Grade 2: addition/subtraction/multiplication/division, answer 0–100.
- Division is always exact and divisor is nonzero.
- Answers are captured digit by digit.
- First correct answer receives speed bonus.

### Number Trace Adventure

- One player.
- Random target digit 0–9.
- Visible dotted target path.
- Score 0–100 based on normalized path distance.
- Passing threshold: 62 for MVP.

### Shape Quest

- One player.
- Circle, triangle, square, rectangle, and zigzag.
- Visible target path and path similarity score.

### Pattern Race

- One or two players.
- Procedurally generated additive/subtractive patterns.
- Range constrained by selected grade.
- Digit-by-digit answer validation.

## 6. Main user flow

```text
Hub → Choose game → Choose level → Camera or demo mode
→ Device check → Ready → Countdown 3–2–1
→ Play for 60 seconds → Time up → Result
→ Play again / choose another game
```

## 7. Error states

- Permission denied: explain browser camera settings and offer demo mode.
- No camera: offer demo mode.
- MediaPipe/model load failure: try local assets, pinned official fallback, then show actionable error.
- Hand missing: show “Tangan belum terlihat”.
- Gesture too short/unclear: retry with no score penalty.
- localStorage blocked: gameplay continues without progress saving.

## 8. Acceptance criteria

- All four game routes open from the hub.
- All controls are code-native and interactive.
- Timer cannot run before countdown completes.
- Pause stops timer input processing.
- No score changes after time-up.
- Replay resets score, timer, digits, challenge history, and winner.
- Zero and answer 100 are valid.
- Player coordinates use consistent mirror orientation.
- Critical engine tests and three simulations pass.
- Production build passes in an environment with npm registry access.
