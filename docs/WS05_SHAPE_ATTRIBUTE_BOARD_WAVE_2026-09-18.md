# WS-05 Pattern #47 — Shape Attribute Board Wave — 18 September 2026

Status: **IMPLEMENTATION CHECKPOINT VERIFIED / NOT MERGED**

## Goal

Move exactly four audited Math `math-shapes` direct-choice activities from generic `choice_grid` into a geometry-specific `shape_attribute_board` while preserving canonical ownership, payload, assessed evidence, mastery and progression.

## Audit verification

```text
Audit PR:                 #202
Audit PR head:            1ee6e245a3e150d1b6b4d9a4b0b3a801b0f9fe65
Audit PR CI:              #940 / run 35350664877 — full success
Audit main:               5978530aff2ad42a0feb28e8bf462b5048a8a69f
Audit merged-main CI:     #941 / run 35351346873 — full success + exact Cloudflare production smoke
```

Audit-main #941 artifacts:

```text
mobile screenshots:       10548794714 / sha256:c9a78ab214e3206e864951556f484e4e61e2169c1fabaa7753338f048deb9fa3
gameplay distribution:    10549609851 / sha256:36c73f1b58f0d1b238fa8ffea4492302b83cd33dccd02485c1df10e979befd4c
activity quality:          10549874667 / sha256:963a1b02dbdf0f72a1bad7313d8b71ac3cb557bd24e5fd0abfc7fed4f7256bab
```

## Exact scope

```text
math-shape-find-circle
math-shape-find-triangle
math-shape-find-square
math-shape-three-sides
```

Same-pack matching remains matching:

```text
math-shape-match-circle-square
math-shape-match-triangle-rectangle
```

## Presentation contract

`shape_attribute_board` renders three equal geometry tiles in exact canonical order.

Before submission:
- no correct-answer emphasis;
- no side-count label that reveals the answer;
- no reordered choices;
- all choices remain keyboard/pointer/touch reachable.

Wrong selection:
- increments incorrect + retry;
- does not complete;
- keeps all canonical choices retryable.

Correct selection:
- records measured assessed evidence;
- completes canonical activity;
- may reveal explanatory shape/property feedback only after completion.

## Evidence contract

```text
runtime:            tap_choice
assessment:         assessed
contract:           choice_accuracy_v1
accuracy:           1 / (1 + incorrectCount)
source:             shape-attribute-board-runtime
evidenceFidelity:   choice_shape_attribute_interaction
```

No mastery/progression/schema/database/content payload migration is approved.

## Implementation files

Runtime/config:
- `src/lib/learning/shapeAttributeBoardConfig.ts`
- `src/components/learning/ShapeAttributeBoardActivity.tsx`
- `src/components/learning/ShapeAttributeBoardActivity.module.css`
- `src/lib/learning/gameplayPatternClassifier.ts`
- `src/app/child/[childId]/activity/[activity]/page.tsx`

Regression/QA:
- `scripts/run-shape-attribute-board-tests.mjs`
- `scripts/run-shape-attribute-board-browser-tests.mjs`
- `scripts/audit-gameplay-distribution.mjs`
- `tsconfig.learning-tests.json`
- `package.json`

## Target branch distribution

Only after implementation tests pass:

```text
900/900 classified
0 unclassified
47 active child-facing patterns
choice_grid 233
shape_attribute_board 4
```

## Accepted checkpoint

```text
Implementation PR:        #203
Initial head:             2bf3eef89b414d25e6e472d4594209e893c6b867
CI #942:                  failed test-only baseline assertion
Accepted checkpoint:      8d4a2bc1334b853d205cb8981312194ab1deeba5
Checkpoint CI:            #943 / run 35360529236 — full success
Manual visual review:     ACCEPTED / 9 screenshots / no P0-P1 blocker
Branch distribution:      47 active / choice_grid 233 / shape_attribute_board 4
```

CI #942 did not expose a runtime defect. The regression incorrectly expected `math-spatial-above` to already classify as `spatial_relation_board`; verified baseline classification is `choice_grid`. The accepted fix changed only that assertion.

Checkpoint artifacts:

```text
mobile screenshots:       10553614390 / sha256:a5211f08e5d0489c9f9a7aaf09a5ef5fe68d14793a18f393607e6c06db18a001
gameplay distribution:    10554204045 / sha256:3ebabd402a2880d8cdd87a251a1b14851347950c27d94567f10e84ecc86636bb
activity quality:          10553799372 / sha256:5c65273fb782b35af0524a52a685210266bce01e1d23b6fcf02978e365e78e42
```

## Remaining gate

1. Full exact-head CI on the final docs-inclusive PR head.
2. Exact four-ID regression + fail-closed drift checks.
3. Browser QA at 320x720, 390x844 actual touch, 768x1024.
4. Idle/wrong/success screenshots at all three viewports.
5. Manual nine-shot visual review with no P0/P1 Pattern #47 blocker.
6. Permanent visual QA green.
7. Exact-head merge.
8. Independent merged-main 47/233/4 verification + exact Cloudflare production smoke.
9. Post-merge Pattern #47 docs closure before Pattern #48 implementation.
