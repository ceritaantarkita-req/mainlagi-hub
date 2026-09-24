# Learning Semantic P0 — Production Safe Checkpoint

Date: **25 September 2026**

Status: **SAFE / MERGED / LIVE VERIFIED / DISCUSSION BOUNDARY**

This document is the canonical handoff after the semantic-P0 production approval/integration wave. It exists so a later human or agent can resume from the exact verified boundary without re-opening already-closed work or accidentally activating runtime behavior.

## Verified repository checkpoint

```text
production integration PR:        #324
PR final head:                    6fb74cac152f55f3ba8fa81344990c942cd4f982
PR CI:                            #1609 / run 36035812364 — full success
merged main:                      1e27869dfc71186e83ed8bb0a4dff2ca44dddfc9
merged-main CI:                   #1610 / run 36036726413 — full success
Cloudflare exact-release smoke:   PASS
```

Merged-main CI #1610 passed all jobs:

- Production build;
- Quality gate (Ubuntu), including asset validation, typecheck, lint, engine tests, activity-quality audit, gameplay distribution, simulations, and final acceptance;
- Windows compatibility;
- Production dependency audit;
- full-history secret scan;
- Mobile route QA (Chromium), including canonical route/accessibility/lazy-load matrix and permanent visual baseline;
- Production smoke (Cloudflare), including waiting for the exact Cloudflare release and smoking public endpoints.

## Canonical semantic-P0 truth

```text
visual decisions frozen:          17/17
production semantic approvals:    14/17
production WebP binaries:         14/17
held / not rendered:               3/17
runtime semantic activation:         0
```

Approved production semantic keys:

- `action.jump`
- `animal.bird`
- `animal.cat`
- `animal.fish`
- `body.head`
- `feature.beak`
- `feature.cactus-thick-stem`
- `feature.gills`
- `object.apple`
- `object.ball`
- `object.cup`
- `object.house`
- `object.toy-block`
- `object.umbrella`

Still held, unchanged, and fail-closed:

- `vehicle.car`
- `object.towel`
- `object.raincoat`

The 14 approved files are exact deterministic 512×512 alpha WebP production binaries with SHA-256 bindings, provenance/redistribution records, child-readability approval, and required attribution. The three held keys have no production path/SHA and must not be silently substituted.

## What is closed

The following work is **closed and must not be repeated as active work**:

1. 17/17 P0 visual-decision freeze;
2. real-source production-readiness preflight for the 14 clear assets;
3. production provenance/redistribution approval for those 14;
4. deterministic production binary integration for those 14;
5. SHA/path binding and fail-closed asset validation;
6. required CC BY attribution;
7. PR + merged-main CI and exact Cloudflare release verification.

Historical documents that say production approvals/binaries were 0 remain valid only for their dated historical checkpoint. They are not current production truth.

## What is deliberately NOT done

The following remains intentionally untouched:

- runtime semantic mapping / activation;
- `LearningVisualToken` runtime behavior;
- activity configs and current emoji/glyph fallback behavior;
- gameplay mechanics;
- mastery, progression, evidence, rewards, schema, or database contracts;
- Mainlagi World;
- character development, which remains paused;
- fixed English narration/audio activation;
- the three held visuals.

Therefore **production binary availability does not mean child-facing runtime activation**.

## Next discussion boundary

Do not start runtime code automatically. The next conversation should decide the runtime activation design first.

Recommended discussion questions:

1. **Resolver contract** — should runtime use a centralized semantic-key → approved-production-path resolver, rather than embedding file paths in activities?
2. **Activation scope** — activate all 14 together, or pilot the highest-value mismatches first such as HEAD, JUMP, gills, beak, and cactus thick stem?
3. **Held-key behavior** — explicitly retain current fallback for car/towel/raincoat until a later approved replacement/rights path exists.
4. **Surface scope** — confirm exactly which Activity Gallery / Picture & Word / Feature Function / Material Lab / other learning surfaces may consume the resolver.
5. **Fail-closed behavior** — missing/unapproved semantic keys must resolve to the existing canonical fallback, never to a guessed neighboring asset.
6. **QA contract** — preserve 320/390/768/1280 containment/readability checks, mobile route QA, keyboard/touch/accessibility coverage, and exact production smoke.
7. **Rollout boundary** — runtime activation must remain separate from any new artwork generation, World work, character work, or narration work.

## Canonical files to read next

Start the next discussion from:

- `docs/LEARNING_SEMANTIC_P0_PRODUCTION_SAFE_CHECKPOINT_2026-09-25.md` — this file;
- `docs/LEARNING_SEMANTIC_P0_PRODUCTION_APPROVAL_INTEGRATION_2026-09-25.md` — exact production bindings/provenance scope;
- `src/lib/data/learning-illustration-asset-provenance.json` — machine-readable lifecycle truth;
- `docs/CURRENT_STATE.md` — repository-level current truth;
- `docs/NEXT_PRODUCT_QUALITY_PLAN.md` — next execution boundary;
- `docs/LEARNING_VISUAL_CONTAINMENT_CLOSURE_2026-09-23.md` — existing visual containment contract.

## Resume instruction

A future agent should summarize the checkpoint first and **discuss runtime activation design with the project owner before changing runtime code**.

Safe baseline:

```text
14 approved production assets
3 held assets
0 runtime activation
World untouched
character development paused
fixed narration activation unchanged
```
