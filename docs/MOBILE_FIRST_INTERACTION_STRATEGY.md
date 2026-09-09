# Mainlagi — Mobile-First Interaction Strategy

Status: **canonical product/UX constraint**.

This document records a product decision that applies to the future Mainlagi learning platform and must be read together with:

- `docs/MAINLAGI_LEARNING_PLATFORM_UX_SPEC.md`
- `docs/PRODUCT_DIRECTION.md`
- `docs/ARCHITECTURE.md`
- `docs/AI_OCR_OPENROUTER.md`

## 1. Product decision

Mainlagi is **mobile-first and touch-first** for the core child learning experience.

The existing MediaPipe motion/vision engine remains an important Mainlagi capability and all existing motion games remain supported, but motion capture is **optional**, not the mandatory default interaction model for the whole platform.

Do not force camera motion into a learning activity when touch, drag, trace, drawing, audio, OCR, or another simpler interaction gives the child a better experience on a phone or tablet.

## 2. Why this decision exists

The primary real-world device for many children is a phone or tablet, not a laptop connected to a large display.

On a phone, motion capture can be difficult for a young child because:

- the child may need to hold the same device that is tracking them;
- the camera field of view is limited;
- full-body framing requires distance and physical space;
- the screen becomes difficult to see when the device is positioned far enough away for motion tracking;
- portrait orientation and handheld use are poor fits for many body-motion interactions;
- setup and calibration increase friction before learning starts;
- young children may not understand camera-position instructions consistently.

This is a UX constraint, not a criticism of the existing motion engine.

## 3. Default input priority

For normal curriculum activities, prefer the lowest-friction interaction that still teaches the intended skill.

Recommended default priority on phones/tablets:

```text
1. tap / choice
2. drag and drop / matching
3. touch tracing / drawing / coloring
4. audio / listen-and-choose
5. device camera for a deliberate capture such as OCR
6. motion capture when it meaningfully improves the experience
```

Motion should be chosen because it adds learning or play value, not because the engine exists.

## 4. Existing motion engine is preserved

The following remain hard constraints:

- do not delete the MediaPipe hand/pose/hybrid runtime;
- do not rewrite it merely to make the new platform architecture simpler;
- do not remove the existing 10 game experiences;
- do not pretend motion is unsupported;
- keep direct access to motion games in the product.

The change is about **product priority and input choice**, not removal.

## 5. Activity input capability model

An activity should describe which input modes it supports.

Conceptual example:

```ts
type InputMode =
  | "touch"
  | "pointer"
  | "keyboard"
  | "motion_hand"
  | "motion_pose"
  | "motion_hybrid"
  | "camera_capture"
  | "audio";

interface ActivityInputCapabilities {
  preferredMobile: InputMode;
  supported: InputMode[];
  motionOptional: boolean;
  requiresCamera: boolean;
}
```

This exact TypeScript shape is not mandatory, but the product behavior is.

## 6. One learning objective may have multiple input modes

Where pedagogically valid, one activity concept may be delivered through different input modes.

Example:

```text
Learning objective: identify the correct answer

Phone default:
Tap the correct answer

Optional motion mode:
Move a hand/body cursor to the correct answer
```

Another example:

```text
Learning objective: form the number 5

Phone default:
Trace the number with a finger

Optional motion mode:
Write the number in the air

Future option:
Write on paper and capture with OCR
```

These are alternate interaction methods around the same learning objective. They should not automatically be treated as identical learning evidence; the evidence model may record the input mode used.

## 7. Mobile-first library behavior

The child library should not make camera requirements a surprise.

Activities should be visually understandable as:

- touch-friendly;
- drawing/tracing;
- audio;
- camera capture;
- motion/camera play.

Motion activities may use a small clear indicator such as `Gerak` or a camera/movement symbol, but the UI must remain child-friendly and must not expose technical labels such as `MediaPipe`.

## 8. Main Gerak / Games behavior

The direct motion-game catalogue remains available.

On mobile, a motion game can show a simple pre-launch note for the parent/child such as:

- taruh HP di tempat stabil;
- gunakan layar landscape when required;
- beri jarak untuk kamera;
- pastikan tubuh/tangan terlihat;
- use touch fallback or another activity if setup is uncomfortable.

Do not force a motion game into the normal recommended learning queue if the current device/context makes it impractical.

## 9. Device-aware recommendation

The recommendation layer may eventually use device capability/context as a signal.

Conceptual behavior:

```text
phone handheld
  -> recommend touch/trace/audio first

tablet on stand
  -> touch first, motion optionally available

desktop/laptop with stable camera and larger screen
  -> motion can be recommended more often

large-screen/cast setup
  -> body-motion activities can become a featured play mode
```

Do not use fragile browser/device detection as a hard curriculum lock. Always provide a clear user choice where practical.

## 10. Motion mode selection

If an activity supports both touch and motion, the product should normally:

1. default to the mobile-friendly mode;
2. offer `Main pakai gerakan` or equivalent as an optional secondary action;
3. remember the parent's/child's preference where appropriate;
4. allow returning to touch without losing the entire learning path.

Motion is an enhancement, not a gate.

## 11. Camera/OCR distinction

Motion capture and OCR camera capture are different UX modes.

Motion:

- continuous real-time camera inference;
- needs framing and space;
- best for deliberate movement play.

OCR/camera capture:

- short, intentional capture;
- child/parent points the camera at writing or a worksheet;
- should capture only what is needed;
- should not require continuous video upload.

Do not conflate the two engines.

## 12. Screen-size requirements

Child UI must be designed from the smallest supported phone viewport upward.

Requirements:

- no horizontal page overflow;
- large touch targets;
- no tiny desktop navigation compressed onto mobile;
- one or two activity cards per row depending on viewport;
- horizontal subject/category scrollers are acceptable;
- activity instructions remain readable without zoom;
- important actions remain reachable with one hand where possible;
- safe-area insets must be considered on iOS/Android;
- landscape should be requested only for activities that genuinely need it.

Desktop is an enhancement of the mobile information architecture, not a different product.

## 13. Touch-first activity runtime priority

The first implementation waves of the broader learning platform should prioritize:

- tap/choice;
- matching;
- drag/drop;
- touch tracing;
- coloring;
- listen-and-choose;
- story/media;
- simple puzzles;
- OCR capture later where useful.

The existing motion runtime is integrated alongside them, but new curriculum content does not need to be motion-enabled by default.

## 14. Learning evidence

Learning events should record the interaction context where useful.

Examples:

```text
activity_completed input=touch
trace_completed input=touch
motion_round_completed input=motion_hand
ocr_submission_received input=camera_capture
```

Do not award higher educational mastery merely because a child used motion mode.

## 15. Accessibility and fallback

Every motion-enabled curriculum activity should be evaluated for a non-motion fallback when the learning objective allows it.

Reasons may include:

- small phone screen;
- camera permission denied;
- low light;
- limited physical space;
- child motor/accessibility needs;
- device performance;
- parent preference.

A child should not be blocked from core learning merely because motion capture is unavailable.

## 16. AI-agent rule

Any AI agent implementing Mainlagi must apply this rule:

> Preserve the existing motion engine and games, but never force motion capture into an activity solely because the engine exists. The core child experience is mobile-first and touch-first. Motion is an optional first-class capability used when it creates a better learning/play experience.

If an agent proposes a motion-only curriculum flow, it must explain why a touch/mobile alternative would not satisfy the learning objective.

## 17. Compact mental model

```text
MAINLAGI LEARNING PLATFORM
        ↓
MOBILE / TOUCH FIRST
        ↓
Activity chooses the best input for the learning goal
        ↓
┌────────────────────────────────────────────┐
│ Touch │ Drag │ Trace │ Audio │ OCR capture │
│       Optional Motion / Existing Games     │
└────────────────────────────────────────────┘
        ↓
Learning Event + Progress
```

Motion remains a differentiator, but it is no longer assumed to be the default input for every child, device, or lesson.
