# Mainlagi Expansion Batch 17 — Engineering Acceptance

Date: 11 September 2026

Status: **ENGINEERING ACCEPTANCE COMPLETE IN PRODUCTION — FULL PRODUCT ACCEPTANCE PENDING EXTERNAL DEVICE/GOVERNANCE EVIDENCE**

This document records the strongest truthful closure that can be produced from repository automation, production CI, Cloudflare, and canonical Supabase. It intentionally does not convert headless browser evidence into physical-device certification.

## Production implementation

- implementation PR: #82 — `Batch 17: add final acceptance contract gate`;
- final Batch 17 implementation main SHA: `d27b32124d3df1613c648132aa2f1ff0ed94ebaa`;
- Batch 17 main CI: #322;
- exact-SHA Cloudflare production smoke: **success**;
- persistence change: **none**;
- catalog/evidence-classification change: **none**.

Batch 17 adds `scripts/run-batch17-final-acceptance-tests.mjs`, wires `test:batch17:final` into local release checks, and runs it as a permanent Ubuntu CI step.

## Post-acceptance physical-device QA helper

After Batch 17 engineering acceptance, PR #85 added a guided physical-device evidence recorder without changing the underlying acceptance boundary.

Verified follow-up release:

```text
PR:                     #85
main SHA:               ee7040ccff82b1d868bd0ca935ab80eb9136024c
main CI:                #328
Device-QA contract:     success
Ubuntu quality:         success
Windows compatibility: success
Mobile route QA:        success
Production build:       success
Dependency audit:       success
Secret history scan:   success
Exact-SHA smoke:        success
```

Production helper:

```text
https://mainlagihub.my.id/qa/device
```

The helper mirrors the 22 canonical physical-device rows, stores in-progress evidence locally in browser localStorage, captures non-secret device/browser context, and can export JSON or copy a summary. It does not upload evidence, access auth/session state, or automatically request camera/microphone permission.

`test:qa:device` permanently regression-protects the helper's noindex/local-only/privacy boundary, exact 22-test inventory, touch sizing, and no automatic camera/upload behavior.

This helper does **not** convert the external physical-device requirement into an automated pass. All canonical physical rows remain pending until actual representative iPhone/Safari and Android/Chrome tests are performed.

## Final machine-verifiable contract

The Batch 17 gate passed with:

```json
{
  "status": "PASS",
  "subjects": 9,
  "activities": 900,
  "assessed": 683,
  "practice": 217,
  "stages": 46,
  "lessons": 197,
  "packs": 197,
  "skills": 200,
  "physicalDeviceCertification": "PENDING_EXTERNAL_EVIDENCE"
}
```

The gate locks:

- exactly nine first-class subjects and exactly 100 activities per subject;
- 900 globally unique activity IDs;
- 46 unique stages, 197 unique lessons, 197 unique content packs, and 200 active skills;
- exact 683 assessed / 217 practice split;
- exact runtime inventory;
- every playable activity referenced by exactly one content pack;
- no uncovered stages or activities in the curriculum;
- Drawing/Coloring remain practice-only with `completion_only_v1` evidence;
- Batch 15 catalog-scale snapshot remains unchanged;
- outbox, ownership/isolation, mastery, adaptive, awards/report, schema, runtime-measurement, Batch 15, and Batch 16 gates remain wired;
- required CI topology remains present;
- production smoke remains commit-aware and pinned to `mainlagihub.my.id`, backend `supabase`, and project ref `estvtgflwkebomsqlolv`.

The final gate deliberately reports physical-device certification separately rather than failing or pretending it was executed in GitHub-hosted runners.

## Main CI #322

All seven Batch 17 implementation release jobs passed:

- `Quality gate (Ubuntu)` — success, including Batch 17 final acceptance contracts;
- `Windows compatibility` — success;
- `Mobile route QA (Chromium)` — success;
- `Production build` — success;
- `Production dependency audit` — success;
- `Secret history scan` — success;
- `Production smoke (Cloudflare)` — success.

The production smoke waited for and verified exact SHA `d27b32124d3df1613c648132aa2f1ff0ed94ebaa` with the canonical Cloudflare/Supabase release metadata.

## Canonical Supabase verification

Project `estvtgflwkebomsqlolv` was rechecked during Batch 17 and is `ACTIVE_HEALTHY` in `ap-southeast-1`.

Live database state matches repository contracts exactly:

- 900 active activities;
- 900 unique active activity IDs;
- 683 assessed / 217 practice;
- 9 subjects;
- 46 distinct stages;
- 197 distinct lessons;
- 197 referenced/active/unique content packs;
- 200 active/unique skills;
- every subject exactly 100 activities;
- runtime inventory exactly `481 tap_choice / 76 listen_and_choose / 125 matching / 14 trace / 1 story / 3 motion_game / 100 coloring / 100 drawing`;
- creative evidence drift: 0;
- Drawing runtime drift: 0;
- Coloring runtime drift: 0;
- Iqro active `expert_required` packs: 22;
- Iqro active `expert_approved` packs: 0.

Latest migration registry remains Batch 14 Wave D; Batches 15–17 and the QA helper introduce no DDL.

## Live ownership/security verification

The canonical learning/account tables rechecked during Batch 17 have RLS enabled, including:

- `player_profiles`;
- `learning_attempts`;
- `learning_attempt_skill_evidence`;
- `child_skill_mastery`;
- `child_learning_progress`;
- `child_learning_achievements`;
- `learning_certificates`.

`learning_attempts` retains trigger `learning_attempt_child_ownership`.

Live `record_learning_attempt(...)` remains:

- `SECURITY DEFINER`;
- pinned to `search_path=public`;
- executable by `authenticated`;
- not executable by `anon`;
- not executable by `public`.

This matches the intentional protected RPC boundary already regression-tested in source/migration contracts.

## Advisor state

Security advisor still has exactly two known WARN categories:

1. authenticated execution of the intentional protected `record_learning_attempt(...)` SECURITY DEFINER RPC;
2. leaked-password protection disabled under the current Supabase configuration/plan.

Performance advisor reports 17 `unused_index` observations at INFO level and no WARN regression.

These findings are documented boundaries rather than new Batch 17 regressions.

## External acceptance still open

Engineering work and the evidence-collection tooling are complete. Full product acceptance is not marked complete because two facts still require evidence/action outside repository automation:

1. **physical-device QA** — use `/qa/device` on actual representative iPhone/Safari and Android/Chrome hardware, then record the accepted results in `BATCH16_PHYSICAL_DEVICE_QA.md`; all rows remain pending until actually exercised;
2. **GitHub ruleset administration** — `Secret history scan` runs and passes, but the active `Protect main` ruleset still requires only Production build, Ubuntu quality, Windows compatibility, and dependency audit.

Canonical external tracker: issue #83 — `Final external acceptance: physical-device QA and required secret-scan check`.

Do not close issue #83 or mark full Batch 16/17 acceptance COMPLETE until those external conditions are actually evidenced or explicitly accepted as reviewed governance exceptions.

## Preserved learning boundaries

Neither Batch 17 nor the QA helper relaxes any previous evidence rule:

- assessed mastery still requires qualifying measured assessed evidence;
- measured all-wrong remains accuracy `0`;
- missing measurement fails closed;
- replay/retry anti-farming remains active;
- generic Latin tracing remains completion-only practice;
- Drawing/Coloring remain completion-only creative practice;
- motion remains opt-in;
- Iqro engineering/catalog completion remains separate from competent human religious-learning review.

## Result

All engineering work that can be completed and verified through code, GitHub CI, Cloudflare production, and canonical Supabase is complete. The latest production release containing the guided physical-device evidence recorder is SHA `ee7040ccff82b1d868bd0ca935ab80eb9136024c`.

The repository must continue to describe the remaining state as **external acceptance pending**, not as an engineering defect and not as completed physical-device certification.