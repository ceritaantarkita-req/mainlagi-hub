# Mainlagi World — Accessibility Pass — 22 September 2026

Status: **VALIDATED GREEN / INCLUDED IN NON-AUDIO PRODUCTION CHECKPOINT**

Branch:

```text
feature/world-petualangan-uang-production-wave-20260922
```

This wave continues non-audio World production work.

## 1. Scope

The pass focuses on the active Petualangan Uang runtime and keeps the existing World hierarchy/content/progression intact.

Covered:

```text
journey map
Stage shell
Scene context
practice activities
Stage completion
share dialog
forced-colors / keyboard focus
```

## 2. Journey map semantics

Unlocked current Stage links now expose:

```text
aria-current="step"
```

Locked Stages expose:

```text
aria-disabled="true"
role="group"
aria-label="Stage N terkunci · <title>"
```

Keyboard focus rings are explicit on journey Stage links and the map back link.

## 3. Stage progress

The previous visual-only Stage progress strip now exposes real progressbar semantics:

```text
role="progressbar"
aria-valuemin=1
aria-valuemax=<Stage Segment count>
aria-valuenow=<current Segment>
aria-valuetext="Bagian X dari Y"
```

Visual progress remains unchanged.

## 4. Scene announcements

The reusable World Scene frame is now a labelled region.

Scene title/type/progress metadata uses:

```text
aria-live="polite"
aria-atomic="true"
```

This lets assistive technology receive concise Scene-context changes without turning the whole activity surface into an aggressive live region.

## 5. Activity semantics

Targeted improvements:

- drag source cards and target destinations are labelled groups;
- matching left/right columns are labelled groups;
- take-away token visualization is exposed as one labelled image;
- ordering output is a real list/listitem structure;
- final recap is a real list/listitem structure;
- open narrative-choice reaction is a polite status message.

Existing `aria-pressed`, disabled-state and activity `role="status"` feedback remain intact.

## 6. Completion focus

When a Stage finishes, focus moves to:

```text
#world-stage-complete-title
```

This makes the completion state immediately discoverable to keyboard and screen-reader users while keeping the visible ★★★ / praise / Back / Again / Next / Share layout unchanged.

## 7. Visual accessibility

World CSS now explicitly covers:

- focus-visible rings for journey links and share-dialog controls;
- current-Stage visual focus reinforcement;
- forced-colors borders;
- forced-colors selected/current outlines.

Existing reduced-motion handling remains active.

## 8. Browser QA

Focused World QA now verifies:

- Stage 1 progressbar semantics and values;
- active Scene uses `role="region"`;
- Scene metadata has polite/atomic live semantics;
- completion focus moves to the completion heading;
- Stage 2 becomes `aria-current="step"` after Stage 1;
- Stage 3 exposes a semantic locked-state label.

Static QA additionally locks the activity/list/image/focus/forced-colors contracts.

## 9. Boundaries

This wave does not:

- change narration generation/approval;
- change World IDs or progression;
- change learning evidence/mastery;
- change Stars into assessment;
- resume Gian/Naya final character work;
- touch Belajar;
- touch Bermain/motion;
- change database schemas.

## 10. Green validation

Accessibility plus the subsequent World-specific performance/lazy-load contract were validated together at the corrected non-audio head:

```text
head: 1a74e5da7803c736a9ccff6b1fda52975501bfeb
CI:   #1516 / run 35755761647
```

Full matrix:

```text
Quality gate (Ubuntu):        PASS
Windows compatibility:        PASS
Production build:             PASS
Production dependency audit:  PASS
Secret history scan:          PASS
Mobile route QA (Chromium):   PASS
overall:                      SUCCESS
```

Frozen checkpoint:

```text
checkpoint/world-petualangan-uang-non-audio-production-green-20260922
@ 1a74e5da7803c736a9ccff6b1fda52975501bfeb
```

The mobile route matrix includes the progressbar, Scene-region/live-region, completion-focus, current-Stage and locked-Stage assertions described above.

The earlier candidate failure was a QA literal mismatch for the authored Stage-3 title; runtime semantics were not changed to satisfy the typo. The assertion was corrected to the canonical title `Uang Datang dari Mana?`, then the exact corrected head passed the full matrix.

## 11. Next boundary

No further speculative accessibility refactor is authorized by this pass. Continue only for a verified defect or a separately approved World feature/art/evidence scope.
