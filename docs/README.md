# Mainlagi Hub Documentation Index

Last reviewed: **18 September 2026**

Use this file to decide which documentation is current and which files are historical snapshots.

## Canonical current documents

Read these first for current work:

1. [`NEXT_PRODUCT_QUALITY_PLAN.md`](NEXT_PRODUCT_QUALITY_PLAN.md) — current execution order, workstreams, status and mandatory gates.
2. [`CURRENT_STATE.md`](CURRENT_STATE.md) — current repository/product/production baseline.
3. [`PRODUCTION_VISUAL_PRODUCT_BASELINE_2026-09-16.md`](PRODUCTION_VISUAL_PRODUCT_BASELINE_2026-09-16.md) — active production visual/product audit and P0/P1/P2 state.
4. [`MAINLAGI_ART_BIBLE.md`](MAINLAGI_ART_BIBLE.md) — canonical visual direction.
5. [`MOBILE_ROUTE_QA.md`](MOBILE_ROUTE_QA.md) — blocking browser route and permanent visual QA contract.
6. [`ARCHITECTURE.md`](ARCHITECTURE.md) — current technical boundaries and system architecture.
7. [`MAINLAGI_LEARNING_PLATFORM_UX_SPEC.md`](MAINLAGI_LEARNING_PLATFORM_UX_SPEC.md) — child/product/UX/activity rules.
8. [`LEARNING_ATTEMPTS_MASTERY.md`](LEARNING_ATTEMPTS_MASTERY.md) — evidence/mastery/progression contract.
9. [`GAMEPLAY_VARIATION_CATALOG.md`](GAMEPLAY_VARIATION_CATALOG.md) — canonical gameplay-pattern catalog and WS-05 boundaries.
10. [`PRODUCT_DIRECTION.md`](PRODUCT_DIRECTION.md) — product principles and direction.
11. [`KNOWN_LIMITATIONS.md`](KNOWN_LIMITATIONS.md) — current known limitations and external acceptance gaps.

Subsystem docs remain authoritative for their specific scope when they do not conflict with the canonical documents above.

## Current execution checkpoint

Pattern #42 `growth_stage_transition` is now the latest **FULLY CLOSED / LIVE VERIFIED** gameplay pattern.

Pattern #42 `growth_stage_transition` implementation is now merged and live verified:

```text
Audit PR:                 #186
Audit main:               541c2348507e976fb723c9c6e5b8f1b242cff490
Audit main CI:            #871 / run 35255083348 — full success + exact Cloudflare production smoke
Implementation PR:        #187
Code checkpoint CI:       #878 / run 35256885341 — full success
Final PR CI:              #883 / run 35259699934 — full success
Implementation main:      37190f5dabd5d8421d7575b8f220d2824e831f23
Implementation main CI:   #884 / run 35260402125 — full success + exact Cloudflare production smoke
Closure PR:               #188
Closure main:             ad7deb67dc15eefdb81dc5d5e66f4c10ccdc9710
Closure main CI:          #886 / run 35290502532 — full success + exact Cloudflare production smoke
```

Verified merged gameplay distribution is now **900/900 classified, 42 active patterns, 0 unclassified**, with `choice_grid` 254/900 and `growth_stage_transition` 3/900.

```text
P0 = 0
P1 = 0
P2 = 3
Permanent visual QA = 21 routes / 63 captures / BLOCKING
Pattern #38 = FULLY CLOSED
Pattern #39 = FULLY CLOSED
Pattern #40 = FULLY CLOSED
Pattern #41 = FULLY CLOSED / LIVE VERIFIED
Pattern #42 = FULLY CLOSED / LIVE VERIFIED
```

## Pattern #42 closure checkpoint

Exact Pattern #42 scope remains:

```text
science-cycle-frog
science-cycle-chick
science-cycle-seed-sprout
```

Canonical Science ownership, assessed `tap_choice`, `choice_accuracy_v1`, prompt/choice/answer payloads, mastery and progression are preserved. Butterfly full-sequence evidence and lifecycle matching remain explicitly outside scope.

Merged-main CI #884 reverified the exact 42-pattern distribution, Ubuntu/Windows engine suites, activity quality, simulations/final acceptance, production build, dependency/security gates, mobile route QA, permanent visual QA and exact Cloudflare production smoke.

Merged-main artifacts:

```text
mobile-route screenshots: 10514976832
sha256:ce7f6fc566952f8d20261eda8eb6c86c7fe6a2f0464f4c4fe72658d128451f4d

gameplay distribution:    10514382620
sha256:12212009d77256bb32b08a32de3a8e1dc4067c3899d7d410c8651f5bc2687b4f

activity quality:          10513967944
sha256:aa38d751cfdb5f24268c818dcf79a84d6d2fc30a2117bf8900df3f52ea3a6cc6
```

Pattern #42 closure gates are complete. Closure PR #188 merged and closure main `ad7deb67...` passed CI #886 including exact Cloudflare production smoke.

## Current evidence records

- [`PATTERN42_FINAL_CLOSURE_VERIFICATION_2026-09-18.md`](PATTERN42_FINAL_CLOSURE_VERIFICATION_2026-09-18.md) — final Pattern #42 merged-main closure truth.
- [`PATTERN42_GROWTH_STAGE_TRANSITION_CLOSURE_2026-09-18.md`](PATTERN42_GROWTH_STAGE_TRANSITION_CLOSURE_2026-09-18.md) — Pattern #42 closure record.
- [`WS05_GROWTH_STAGE_TRANSITION_WAVE_2026-09-18.md`](WS05_GROWTH_STAGE_TRANSITION_WAVE_2026-09-18.md) — Pattern #42 implementation/QA wave.
- [`PATTERN42_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`](PATTERN42_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md) — merged/live-verified Pattern #42 objective/evidence audit.
- [`PATTERN41_FINAL_CLOSURE_VERIFICATION_2026-09-17.md`](PATTERN41_FINAL_CLOSURE_VERIFICATION_2026-09-17.md) — final Pattern #41 merged-main truth.
- [`PATTERN41_PHRASE_SCENE_MATCH_CLOSURE_2026-09-17.md`](PATTERN41_PHRASE_SCENE_MATCH_CLOSURE_2026-09-17.md) — Pattern #41 closure record.
- [`WS05_PHRASE_SCENE_MATCH_WAVE_2026-09-17.md`](WS05_PHRASE_SCENE_MATCH_WAVE_2026-09-17.md) — Pattern #41 implementation/QA wave.
- [`PATTERN41_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`](PATTERN41_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md) — Pattern #41 objective/evidence audit.
- [`PATTERN40_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`](PATTERN40_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md)
- [`WS05_SPATIAL_RELATION_BOARD_WAVE_2026-09-17.md`](WS05_SPATIAL_RELATION_BOARD_WAVE_2026-09-17.md)

Historical closure/candidate/audit records must not be rewritten to pretend later QA or implementation state existed at their original checkpoint.

## Remaining product-quality work

Immediate WS-05 gate is now a fresh Pattern #43 objective/evidence audit from the verified 42-pattern baseline. No mechanic, subject or content family is pre-approved, and `no justified candidate` remains a valid audit result.

Other open work remains P2 game-shell/icon/inline-style convergence, WS-02 narration, WS-10 real-device/accessibility/human/Iqro acceptance, WS-11 governance, later WS-12 cleanup, and continued WS-05 progression toward 50–60 meaningful patterns.

## Historical snapshot documents

Dated audit/redesign/validation documents record what was true at the time they were written. They are evidence/history, **not the current product baseline**, unless explicitly promoted above as an active canonical audit.

If a historical document conflicts with current code or a canonical current document, use the current code/current canonical docs and record the reconciliation in `NEXT_PRODUCT_QUALITY_PLAN.md`.

## Mandatory documentation rule

Every developer/AI agent completing product-quality work must update affected canonical docs, workstream status, QA/results/remaining work, avoid unsupported deployment/approval claims, and keep visual documentation aligned with implemented reality.

**Code merged without related documentation updates is not complete.**
