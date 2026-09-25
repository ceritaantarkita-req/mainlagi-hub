# Learning Semantic P0 — Production Safe Checkpoint

Date: **25 September 2026**

Status: **SAFE / MERGED / LIVE VERIFIED / REGISTRY V2 MIGRATED / SESSION 11 PRODUCTION-PROMOTION HANDOFF**

This document is the canonical handoff after the semantic-P0 production approval/integration wave. It exists so a later human or agent can resume from the exact verified boundary without re-opening already-closed work or accidentally activating runtime behavior.

## Post-checkpoint project-owner format decision — CURRENT

The verified PR #324 facts below remain unchanged: 14 semantic P0 assets were approved and integrated as deterministic WebP production derivatives, 3 remain held, and runtime semantic activation is 0.

After that checkpoint, the project owner changed the **next asset-format direction**:

> If the approved canonical source already exists as a suitable SVG, integrate the SVG directly; do not convert it to WebP merely to satisfy the older pipeline.

All 14 source/license-clear semantic P0 assets used by the real-source preflight have canonical Drive/library SVG sources. Therefore the next semantic implementation wave should migrate the production registry/validator/path contract toward direct sanitized SVG assets before broad runtime activation.

Target path convention:

```text
/artwork/learning-illustrations/<semantic-slug>-v1.svg
```

The three held keys (`vehicle.car`, `object.towel`, `object.raincoat`) remain held. SVG format does not waive provenance/redistribution requirements.

The existing 14 WebP production files remain valid rollback/historical production assets until the SVG migration is merged, verified in runtime and explicitly cleaned up later.

Canonical cross-system policy: `SVG_NATIVE_ASSET_POLICY_2026-09-25.md`.

## Session 10 SVG-aware registry migration — CURRENT

Session 10 is **CLOSED / MERGED / LIVE VERIFIED**.

```text
PR #343 final head:              698cba5f9baa8de896d0056daf777f3e00e56f6e
PR CI #1678 / run:              36142537668 — full success
merged main:                    21955a64728162f8985d04160e8ec683e1238080
merged-main CI #1679 / run:     36143708306 — full success
Cloudflare exact-release smoke: PASS
```

Current machine truth:

```text
registry version:               2
preferred production format:    svg
runtime activation:             off
approved WebP history:          14
SVG migration-ready:            14
approved SVG binaries:           0
held SVG slots:                  3
```

The 14 clear records now have canonical target paths:

```text
/artwork/learning-illustrations/<semantic-slug>-v1.svg
```

but remain deliberately unpromoted:

```text
SVG status: migration-ready
SVG path: null
SVG sha256: null
```

The three held keys remain `review-required` / SVG `held` / no production path or hash.

Canonical closure: `LEARNING_SEMANTIC_SVG_REGISTRY_SESSION10_CLOSURE_2026-09-25.md`.

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

## Next execution boundary

### Session 11 — exact SVG production promotion

Promote only the exact 14 already-reviewed canonical SVG sources into the prepared registry v2 slots.

Required behavior:

1. sanitize every source with the shared SVG security foundation;
2. normalize each production path to `/artwork/learning-illustrations/<semantic-slug>-v1.svg`;
3. bind exact production SHA-256 values;
4. move exactly 14 SVG slots from `migration-ready` to `approved`;
5. preserve the 14 existing WebPs as rollback/history;
6. keep car/towel/raincoat held;
7. keep runtime activation off.

Runtime resolver activation remains Session 12.

## Canonical files to read next

Start the next discussion from:

- `docs/LEARNING_SEMANTIC_P0_PRODUCTION_SAFE_CHECKPOINT_2026-09-25.md` — this file;
- `docs/LEARNING_SEMANTIC_SVG_REGISTRY_SESSION10_CLOSURE_2026-09-25.md` — exact registry v2 migration closure;
- `docs/LEARNING_SEMANTIC_P0_PRODUCTION_APPROVAL_INTEGRATION_2026-09-25.md` — historical exact WebP production bindings/provenance scope;
- `src/lib/data/learning-illustration-asset-provenance.json` — machine-readable lifecycle truth;
- `docs/CURRENT_STATE.md` — repository-level current truth;
- `docs/NEXT_PRODUCT_QUALITY_PLAN.md` — next execution boundary;
- `docs/LEARNING_VISUAL_CONTAINMENT_CLOSURE_2026-09-23.md` — existing visual containment contract.

## Resume instruction

A future agent starting Session 11 should first verify latest `main`, confirm the registry remains v2 with 14 `migration-ready` SVG slots and 3 held slots, and then perform only exact SVG production promotion. Do not change runtime code in Session 11.

Safe baseline:

```text
14 approved WebP history assets
14 SVG migration-ready slots
0 approved semantic SVG binaries
3 held semantic assets
0 runtime semantic activation
World unchanged by semantic migration
shared character runtime unchanged
fixed narration activation unchanged
```
