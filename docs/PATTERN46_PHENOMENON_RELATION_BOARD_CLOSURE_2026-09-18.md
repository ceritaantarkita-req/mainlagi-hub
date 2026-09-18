# Pattern #46 Phenomenon Relation Board Closure — 18 September 2026

Status: **FULLY CLOSED / LIVE VERIFIED**

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

Explicit exclusion: `science-match-sky-observation-c` remains canonical matching / `matching_accuracy_v1`.

## Audit chain

```text
Audit PR:                 #199
Audit PR head:            b53a299fafa8058af78797b3cd345984dedc9027
Audit PR CI:              #928 / run 35316239193 — full success
Audit main:               b620c78f186b7c8e8612afdb616420d923a57e00
Audit merged-main CI:     #929 / run 35316693100 — full success + exact Cloudflare production smoke
```

## Implementation chain

```text
Implementation PR:        #200
Initial head:             83290426008e0fe81a959337b2af979ac21d3539
Initial CI:               #930 / run 35331633980 — blocked by 320px horizontal overflow
Accepted checkpoint:      558f154278a6a75c01e3fad14171e5ae5bc66fdd
Checkpoint CI:            #931 / run 35338034584 — full success
Final PR head:             2b8e47b18a29cebf3b3dde0eda31b3d70c73dbaf
Final PR CI:               #936 / run 35339040549 — full success
Implementation main:       027d81edba9f3b5585eb2c964aa89e80e3337422
Implementation main CI:    #937 / run 35339693569 — full success + exact Cloudflare production smoke
```

The #930 failure correctly caught a real 320px horizontal overflow. The accepted fix was layout containment/wrapping only; the canonical activity/evidence/classification contract did not change.

## Verified interaction contract

- stable observation remains visible;
- relation/result slot stays unresolved in idle;
- all three canonical choices remain in exact order;
- wrong selection increments incorrect/retry and cannot complete;
- wrong selection does not reveal the canonical result;
- choices remain retryable after wrong selection;
- correct selection resolves the result and completes;
- assessed accuracy remains `1 / (1 + incorrectCount)`;
- keyboard, pointer and actual-touch completion paths pass;
- no mastery/progression/schema/database/content ownership change.

Runtime metadata:

```text
source:             phenomenon-relation-board-runtime
evidenceFidelity:   choice_phenomenon_relation_interaction
relationMode
selectedChoice
observationLabel
relationLabel
```

## Visual acceptance

Manual nine-shot review is **ACCEPTED / no Pattern #46 P0 or P1 blocker**.

Viewports:
- 320x720
- 390x844 with actual touch
- 768x1024

Each viewport includes idle, wrong and success states. The 320px set verifies the overflow caught by CI #930 is closed.

## Merged-main distribution

CI #937 independently verifies:

```text
activities:                    900
classified:                    900
unclassified:                    0
active patterns:                46
choice_grid:                   237
phenomenon_relation_board:       4
global >35% hotspots:            0
```

Subject advisory hotspots remain non-blocking and unchanged in character: Mewarnai/coloring 100%, Menggambar/drawing 100%, Huruf & Menulis/symbol_hunt 64%.

## Final PR artifacts

```text
mobile screenshots:
  id:      10544341881
  digest:  sha256:e00ff5c98ed59ab8f992b08ac61eeef6ad312318966ed6e77ec83271e04abcc6

gameplay distribution:
  id:      10543913912
  digest:  sha256:9c83b699770f5f7d4f68819c346a969bb90895a8355d59652279820ae100cc44

activity quality:
  id:      10543614895
  digest:  sha256:43efb07859173d52d619b407834cf53f654738bf27d7fea8f4be2a770f7537b8
```

## Merged-main artifacts

```text
mobile screenshots:
  id:      10545080573
  digest:  sha256:abc667cc6d99f413337efae02278233878dd55a1c46b703930544d8b7e314b2e

gameplay distribution:
  id:      10544169351
  digest:  sha256:5650de6333e3fc8020e53800f51edef69316b460924cff0f184364d62c03cd29

activity quality:
  id:      10545055113
  digest:  sha256:3225e1046dde179948dadf42c65222ed2360bdc7dd21eab223cd5ff1a2b9ac13
```

## Closure result

Pattern #46 `phenomenon_relation_board` is **FULLY CLOSED / LIVE VERIFIED**.

Verified production baseline for the next fresh audit:

```text
main:                           027d81edba9f3b5585eb2c964aa89e80e3337422
activities:                     900
classified:                     900
unclassified:                     0
active child-facing patterns:    46
choice_grid:                    237
phenomenon_relation_board:        4
remaining to finish target 50:    4
```

Next gate: fresh Pattern #47 objective/evidence audit. No mechanic, subject, or content family is pre-approved.
