# WS-05 Relative Order Track Wave — 2026-09-15

Status: **IMPLEMENTATION IN PROGRESS / UNMERGED**

Branch: `agent/ws05-logic-relative-order-track-20260915`

Base: verified live `main` at `d2c0f490a0130f7e537c3644c9f8a6846596bbf4` after Investigation Board closure PR #136.

## Audit decision

Pattern #29 is selected from a fresh objective/evidence audit of the verified 28-pattern baseline, not from pattern count alone.

Logic Wave C contains four remaining choice families plus one matching family. Conditional rules overlap conceptually with the already-specialized Rule Pipeline family, multi-attribute classification overlaps existing classification/sorting mechanics, elimination inference overlaps existing discrimination/elimination mechanics, and analogies already use canonical visible matching. Relative ordering is the strongest distinct fit: five assessed `tap_choice` activities share one lesson, one pack and one canonical skill while all asking the child to reason about position inside an explicit ordered sequence.

Pattern #29: `relative_order_track`.

## Exact scope

```text
logic-order-first-after-start
logic-order-before-d
logic-order-between-blue-green
logic-order-third-symbol
logic-order-two-steps-after
```

All five share:
- subject `logic`;
- stage `logic-conditional-analogy-inference`;
- lesson `logic-relative-ordering`;
- pack `logic.pack.relative-ordering`;
- canonical skill `logic.order.relative.basic`;
- assessed `tap_choice` runtime;
- exactly three canonical choices with unchanged `correctChoice`.

Explicit exclusions include:
- Logic conditional-rule, multi-classification and elimination-inference families;
- Logic analogies, which remain canonical matching;
- Math `math-order-*`, which retain the existing `number_line` presentation;
- Letters `letters-order-*`, which retain the existing `sequence_slot` presentation.

## Interaction design

The Relative Order Track visualizes only the ordered context already present in each canonical prompt and masks the position the child must infer with `?`.

Representative examples:

```text
A → B → ? → D        tepat setelah B / tepat sebelum D
merah → biru → ? → hijau
★ → ● → ? → ■        posisi ketiga
1 → 2 → 3 → ? → 5    dua langkah setelah 2
```

The hidden slot is validated to equal the canonical `correctChoice`; the answer is never displayed before assessment. The canonical three choices remain direct keyboard/touch/pointer buttons. A wrong choice increments assessed incorrect/retry and cannot complete. A correct choice completes the existing canonical activity. No extra confirmation, invented sequence fact, changed answer set, drag-only dependency, or intermediate assessment is introduced.

Assessed evidence fidelity: `choice_relative_order_track_interaction`. Runtime metadata source: `relative-order-track-runtime`.

## Expected PR-head distribution

```text
classified:                 900 / 900
unclassified:                 0
active PR-head patterns:     29
choice_grid                 313 / 900 = 34.78%
relative_order_track          5 / 900 = 0.56%
Logic choice_grid             47 / 100
Science choice_grid           56 / 100
```

If merged unchanged, remaining distance becomes **21 patterns to minimum 50** and **31 to working target 60**.

## Required acceptance gates

Before this wave may be called QA accepted:
1. exact-family static regression proves exactly five scoped IDs and preserves runtime, assessment, skill, choices and `correctChoice`;
2. explicit config validation proves the masked track slot equals the canonical `correctChoice` and appears only once in source sequence context;
3. nearby Logic conditional/classification/inference/analogy families remain outside scope;
4. Math number-line and Letters sequence-slot ordering families remain unchanged;
5. permanent gameplay-presentation regression includes the exact five-ID family and keeps the default-family guard;
6. gameplay-distribution audit verifies 29 patterns, 900/900 classified, zero unclassified, `choice_grid` 313/900, `relative_order_track` 5/900, Logic 47/100 and Science 56/100;
7. deterministic activity-quality remains 900 KEEP / zero flagged / structural findings 0;
8. simulations and Batch17 remain clean;
9. representative browser QA passes 320x720, 390x844 and 768x1024 with legitimate prior-stage readiness, keyboard wrong-state, pointer completion, exact choices, >=44px touch targets, no horizontal overflow, hidden target slot, fully visible idle/retry/success feedback + CTA, assessed evidence, and zero console/page errors;
10. generated idle/try/success screenshots are manually reviewed at all three viewports;
11. full implementation-head CI must be green before canonical docs are finalized as QA accepted / unmerged;
12. fresh exact docs-head CI, clean PR gate, exact-head merge, live-main verification, and separate docs-only closure remain required before Pattern #29 is fully closed.

This document intentionally does not claim acceptance or merge before those gates pass.
