# Pattern #47 Shape Attribute Board Closure — 18 September 2026

Status: **FULLY CLOSED / LIVE VERIFIED**

## Pattern

```text
Pattern:        #47
Name:           shape_attribute_board
Subject:        math
Stage:          math-banding-bentuk
Lesson:         math-shapes
Pack:           math.pack.shapes
Runtime:        tap_choice
Assessment:     assessed
Evidence:       choice_accuracy_v1
Exact scope:    4 activities
```

Exact scope:
- `math-shape-find-circle`
- `math-shape-find-triangle`
- `math-shape-find-square`
- `math-shape-three-sides`

Same-pack exclusions that remain canonical matching:
- `math-shape-match-circle-square`
- `math-shape-match-triangle-rectangle`

## Audit chain

```text
Audit PR:                 #202
Audit PR head:            1ee6e245a3e150d1b6b4d9a4b0b3a801b0f9fe65
Audit PR CI:              #940 / run 35350664877 — full success
Audit main:               5978530aff2ad42a0feb28e8bf462b5048a8a69f
Audit merged-main CI:     #941 / run 35351346873 — full success + exact Cloudflare production smoke
```

## Implementation chain

```text
Implementation PR:        #203
Initial head:             2bf3eef89b414d25e6e472d4594209e893c6b867
Initial CI:               #942 / run 35352690760 — failed test-only baseline assertion
Accepted checkpoint:      8d4a2bc1334b853d205cb8981312194ab1deeba5
Checkpoint CI:            #943 / run 35360529236 — full success
Final PR head:            aa77de822ca21ba6f4ab4347c946cd349fc2fff5
Final PR CI:              #948 / run 35361686710 — full success
Implementation main:      7c5610d5872c572ad37e55a6bcffd5d6c576dc81
Implementation main CI:   #949 / run 35362716105 — full success + exact Cloudflare production smoke
```

CI #942 did not expose a runtime defect. The new Pattern #47 regression incorrectly expected `math-spatial-above` to already classify as `spatial_relation_board`; the verified canonical baseline remains `choice_grid`. The accepted fix changed only that regression expectation. No Pattern #47 product behavior changed.

## Verified interaction/evidence contract

- exact canonical prompt preserved;
- exact canonical choice order and submitted values preserved;
- exact canonical `correctChoice` preserved;
- idle state cannot complete;
- wrong choice increments incorrect + retry and cannot complete;
- all canonical choices remain retryable after wrong;
- correct choice completes through canonical measured evidence;
- assessed accuracy remains `1 / (1 + incorrectCount)`;
- three activities remain `math.shape.recognition`;
- `math-shape-three-sides` remains `math.shape.properties`;
- same-pack matching remains `visible_matching` / `matching_accuracy_v1`;
- no mastery, progression, schema, database, content payload or ownership change.

Runtime metadata:

```text
source:             shape-attribute-board-runtime
evidenceFidelity:   choice_shape_attribute_interaction
shapeMode
selectedChoice
```

## Visual acceptance

Manual nine-shot review is **ACCEPTED / no Pattern #47 P0 or P1 blocker**.

Viewports:
- 320x720;
- 390x844 with actual touch;
- 768x1024.

Each viewport includes idle, wrong and success states.

Verified:
- shape glyphs are readable and visually equivalent before submission;
- no answer-specific cue is exposed in idle state;
- wrong state is clear and still retryable;
- success explanation remains readable;
- CTA is fully visible;
- no horizontal clipping/overflow;
- permanent visual QA passes.

## Accepted checkpoint artifacts — CI #943

```text
mobile screenshots:
  id:      10553614390
  digest:  sha256:a5211f08e5d0489c9f9a7aaf09a5ef5fe68d14793a18f393607e6c06db18a001

gameplay distribution:
  id:      10554204045
  digest:  sha256:3ebabd402a2880d8cdd87a251a1b14851347950c27d94567f10e84ecc86636bb

activity quality:
  id:      10553799372
  digest:  sha256:5c65273fb782b35af0524a52a685210266bce01e1d23b6fcf02978e365e78e42
```

## Merged-main verification — CI #949

CI #949 independently verifies:

```text
activities:                    900
classified:                    900
unclassified:                    0
active patterns:                47
choice_grid:                   233
shape_attribute_board:           4
global >35% hotspots:            0
```

Subject advisory hotspots remain non-blocking:
- Mewarnai / `coloring_canvas`: 100/100;
- Menggambar / `drawing_canvas`: 100/100;
- Huruf & Menulis / `symbol_hunt`: 64/100.

Merged-main #949 artifacts:

```text
mobile screenshots:
  id:      10554833911
  digest:  sha256:1dfb8c532c72e05a738edb515d875a8838e9ff38a9bd34819f298d174e484321

gameplay distribution:
  id:      10554873408
  digest:  sha256:abddd15f631bd3ba1432f714b1246c701ce4cbb5665f2794a60f5efb3488d78d

activity quality:
  id:      10555243210
  digest:  sha256:533ef27ca61acc255551fd71929e9e5eab8b5f23f2e89e2a8a80525b589834b8
```

## Closure result

Pattern #47 `shape_attribute_board` is implementation-merged and live-verified on production.

Verified production baseline for docs closure:

```text
main:                           7c5610d5872c572ad37e55a6bcffd5d6c576dc81
activities:                     900
classified:                     900
unclassified:                     0
active child-facing patterns:    47
choice_grid:                    233
shape_attribute_board:            4
remaining to finish target 50:    3
```

This document participates in the required post-merge docs-closure PR. The Pattern #47 Definition of Done becomes final only after that docs closure is itself merged and its merged-main CI/Cloudflare verification passes.

Next product gate after docs closure: fresh Pattern #48 objective/evidence audit. No mechanic, subject, or content family is pre-approved.
