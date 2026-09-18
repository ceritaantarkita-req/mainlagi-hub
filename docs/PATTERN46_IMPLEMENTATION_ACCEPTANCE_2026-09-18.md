# Pattern #46 Implementation Acceptance — 18 September 2026

Status: **IMPLEMENTATION CHECKPOINT VERIFIED / NOT MERGED**

## Pattern

```text
Pattern:        #46
Name:           phenomenon_relation_board
Subject:        science
Stage:          science-earth-body-environment
Lesson:         science-earth-sky-patterns
Pack:           science.pack.earth-sky-patterns
Skill:          science.earth.sky_patterns.basic
Runtime:        tap_choice
Assessment:     assessed
Evidence:       choice_accuracy_v1
Exact scope:    4 activities
```

Exact scope:

- `science-earth-sun-day`
- `science-earth-moon-night`
- `science-earth-shadow-sun`
- `science-earth-cloud-rain`

Explicit exclusion: `science-match-sky-observation-c` remains canonical `matching` / `matching_accuracy_v1`.

## Audit verification

```text
Audit PR:                 #199
Audit PR head:            b53a299fafa8058af78797b3cd345984dedc9027
Audit PR CI:              #928 / run 35316239193 — full success
Audit main:               b620c78f186b7c8e8612afdb616420d923a57e00
Audit merged-main CI:     #929 / run 35316693100 — full success + exact Cloudflare production smoke
```

## Implementation checkpoint

```text
Implementation PR:        #200
Accepted head:            558f154278a6a75c01e3fad14171e5ae5bc66fdd
Checkpoint CI:            #931 / run 35338034584 — full success
PR production smoke:      skipped as expected
```

CI #930 on the previous head `83290426008e0fe81a959337b2af979ac21d3539` correctly blocked the PR because the new relation board overflowed horizontally at 320px. The fix is CSS-only containment/wrapping on `558f1542...`; no runtime/evidence/classifier/content contract changed.

## Verified interaction contract

The implementation preserves canonical `tap_choice` evidence while making the observation -> relation/result structure explicit.

- idle state shows a stable observation and an unresolved result slot;
- all three canonical choices remain present in exact canonical order;
- wrong selection increments incorrect/retry and cannot complete;
- wrong selection does **not** resolve the result slot or reveal the canonical answer;
- wrong selections remain retryable;
- correct selection resolves the relation slot and completes;
- assessed accuracy remains `1 / (1 + incorrectCount)`;
- no timer, speed score, drag-only dependency, prompt parser, secondary assessed checkpoint, mastery rewrite, progression rewrite, schema change, database change, or content ownership change.

Runtime metadata verified by browser QA:

```text
source:             phenomenon-relation-board-runtime
evidenceFidelity:   choice_phenomenon_relation_interaction
relationMode
selectedChoice
observationLabel
relationLabel
```

Representative `science-earth-sun-day` wrong-then-correct path records:

```text
correctCount:       1
incorrectCount:     1
retryCount:         1
accuracy:           0.5
relationMode:       sun_day_relation
selectedChoice:     siang hari
```

## Exact-scope regression

Dedicated learning regression verifies:

- exactly four Pattern #46 activities;
- exact prompts;
- exact choice arrays and order;
- exact `correctChoice`;
- exact Science/stage/pack/lesson/skill ownership;
- assessed `tap_choice` / `choice_accuracy_v1`;
- exact per-ID deterministic relation modes;
- same-pack matching exclusion;
- existing `cause_effect`, `investigation_board`, `growth_stage_transition` and `compare_properties` classifications unchanged;
- fail-closed rejection on prompt, choices, answer, stage, subject or runtime drift.

## Distribution checkpoint

CI #931 distribution artifact verifies:

```text
activities:                    900
classified:                    900
unclassified:                    0
active patterns:                46
choice_grid:                   237
phenomenon_relation_board:       4
global >35% hotspots:            0
```

Subject advisory hotspots remain the pre-existing non-blocking values for Mewarnai/coloring, Menggambar/drawing and Huruf & Menulis/symbol_hunt.

Artifact:

```text
gameplay-distribution-audit
id:      10544171315
digest:  sha256:cbcdda7f641994108ed0e9ae2d63edc1a3b26310ed5b9356eaa2b08679ff8643
```

## Browser and visual QA

Dedicated browser QA passed at:

- 320x720;
- 390x844 with actual touch completion;
- 768x1024.

Each viewport covers idle, wrong and success states, for nine dedicated screenshots total.

Verified properties:

- no horizontal overflow;
- choice touch targets remain at least 44x44;
- keyboard reaches and submits a wrong choice;
- wrong choice does not complete;
- wrong choice keeps target unresolved;
- canonical answer remains hidden after wrong selection;
- pointer completion works;
- actual touch completion works at 390px;
- success feedback and `Pilih permainan lain` CTA remain fully in viewport;
- no page errors;
- no console errors.

Manual review of all nine screenshots: **ACCEPTED / no Pattern #46 P0 or P1 blocker**.

Screenshot artifact:

```text
mobile-route-qa-screenshots
id:      10543982425
digest:  sha256:bc213d93d9126ff08c081a2cb5cd714e8fbfd631fe582b5c08832ca635e5441a
```

Screenshot set:

```text
320-phenomenon-relation-idle.png
320-phenomenon-relation-try.png
320-phenomenon-relation-success.png
390-phenomenon-relation-idle.png
390-phenomenon-relation-try.png
390-phenomenon-relation-success.png
768-phenomenon-relation-idle.png
768-phenomenon-relation-try.png
768-phenomenon-relation-success.png
```

## Other CI evidence

CI #931 also passed:

- Quality gate Ubuntu;
- Windows compatibility;
- production build;
- production dependency audit;
- secret history scan;
- permanent visual product QA through the mobile route job.

Activity-quality artifact:

```text
activity-quality-audit
id:      10543852087
digest:  sha256:7f37bd3a8e251aed7ce67e43875ca57b049b810c5fd7599e86af0e57f496f471
```

## Acceptance result

Head `558f154278a6a75c01e3fad14171e5ae5bc66fdd` is the accepted Pattern #46 implementation checkpoint.

This is **not merged production truth yet**. Before merge, docs-inclusive final head must independently pass full CI without code regression. Then PR #200 may be exact-head merged and the resulting `main` SHA must pass full merged-main CI including exact Cloudflare production smoke and verified 46/237/4 distribution.
