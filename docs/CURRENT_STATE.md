# Mainlagi Hub — Current State

Last reviewed: 11 September 2026

This file is the canonical human/AI handoff for the current repository state. `main` is the product source of truth. Commit SHAs below are verification snapshots, not permanent version labels.

## Canonical baseline

- Repository: `ceritaantarkita-req/mainlagi-hub`
- Default/canonical branch: `main`
- Production URL: `https://mainlagihub.my.id/`
- Canonical Supabase project ref: `estvtgflwkebomsqlolv`
- Production transport: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker `mainlagi-hub`
- Production is not VPS/SSH based.

## Latest verified production baseline

**Batch 15 — Adaptive/mastery/report scaling across the completed 900-activity catalog is production-complete.**

Final Batch 15 implementation SHA:

`58e5d14633dd3d105f383f56e016c61c9104a892`

Implementation landed through PR #78. PR CI #311 completed successfully. Main CI #312 completed successfully across Ubuntu quality/learning/simulations, Windows compatibility, Chromium mobile-route QA, production build, dependency audit, full-history secret scan, and exact-SHA Cloudflare production smoke.

Batch 15 required **no Supabase migration/DDL**: it changes adaptive policy, progression evaluation, and Parent projections while preserving the canonical persisted catalog/schema. Migration history intentionally remains through `0046_batch14_creative_wave_d.sql`.

Detailed closure evidence: `EXPANSION_BATCH15_CLOSURE_2026-09-11.md`.

Batch 14 remains the final catalog-expansion closure at implementation SHA `b273edc282261bbec89b0c3d438822204cd925e5`. Earlier expansion closures remain valid.

**Iqro review boundary remains unchanged:** all active Iqro packs remain `expert_required`, not `expert_approved`. Engineering production closure is not religious-learning expert approval.

## Current playable catalog

Batch 15 does not change the Batch 14 catalog baseline:

- 9 first-class subjects;
- 9 learning paths;
- 46 stages;
- 197 lessons;
- 197 versioned content packs;
- **900 playable activities**;
- **200 active skills**;
- **683 assessed activities**;
- **217 practice activities**;
- 8 reusable manifest mechanics.

| Subject | Playable | Assessed | Practice | Active skills |
| --- | ---: | ---: | ---: | ---: |
| Bahasa Indonesia | 100 | 99 | 1 | 23 |
| English | 100 | 100 | 0 | 23 |
| Math | 100 | 98 | 2 | 22 |
| Iqro | 100 | 99 | 1 | 22 |
| Letters / Menulis | 100 | 87 | 13 | 25 |
| Logic / Logika | 100 | 100 | 0 | 22 |
| Science / Sains | 100 | 100 | 0 | 22 |
| Coloring / Mewarnai | 100 | 0 | 100 | 21 |
| Drawing / Menggambar | 100 | 0 | 100 | 20 |

Live Supabase verification after the Batch 15 behavioral release remains exactly **900 / 683 assessed / 217 practice**, with Drawing 100, Coloring 100, 197 active packs, 200 active skills, and zero creative evidence/runtime-mechanic drift.

## Batch 15 adaptive/mastery/report scaling

Batch 15 scales the existing learning system rather than creating a second model.

Shipped behavior:

- child landing, child path, Parent Progress, and Parent Reports now resolve recommendations through the same Adaptive Learning V2 policy;
- stage unlock/readiness is computed at stage scope rather than repeatedly per activity candidate;
- catalog activity descriptors are reused instead of rebuilt for each recommendation render;
- attempt history is indexed by skill once per adaptive ranking;
- weak measured evidence prefers a different activity for the same skill over exact replay, with an additional diversity boost when the runtime differs;
- recent exact repeats are penalized;
- low-confidence but reasonable evidence can trigger `build_confidence` recommendations;
- proficient/mastered skills can re-enter through spaced review without decaying or rewriting mastery itself;
- recent accuracy, retries, hints, and interruptions softly tune difficulty while age/stage/motion remain hard eligibility gates;
- completion-only creative activities remain recommendation-eligible without consulting or fabricating mastery.

Parent projections are now bounded:

- one compact summary row per each of the 9 subjects;
- weekly assessed/practice attempt split;
- assessed-only mastery summary;
- stage status rollups (`ready`, `in_progress`, `evidence_needed`, `locked`);
- per-subject adaptive recommendation;
- recent raw attempt display capped rather than dumping the full history;
- Drawing/Coloring explicitly report participation/completion with `mastery: null`.

The dedicated Batch 15 CI gate simulates a **1,200-attempt history** and a full 9-subject recommendation/report sweep. PR CI #311 measured **72.8 ms** for the sweep and a **7,937-byte** serialized bounded Parent report, below the conservative guards of 5 seconds and 64 KiB.

## Learning evidence and mastery integrity

Mastery remains `not_started -> exploring -> developing -> proficient -> mastered`.

Protections remain in force:

- one perfect qualifying attempt remains at most `exploring`;
- repeated qualifying evidence is required for higher mastery;
- rapid replay inside 30 seconds does not qualify for mastery farming;
- seven or more retries make evidence non-qualifying;
- practice/completion-only activities cannot manufacture assessed mastery evidence;
- server/catalog classification owns assessed status;
- stage readiness uses qualifying evidence rather than raw replay count;
- measured all-wrong interactions remain accuracy `0` evidence;
- missing measurement fails closed to completion-only;
- hints/retries remain available for independence/frustration policy signals.

Batch 15 does not rewrite mastery snapshots to implement spacing. Spacing only affects recommendation priority.

Generic Latin tracing remains completion-only practice until a validated Latin glyph-shape evaluator exists.

Drawing/Coloring remain `practice` + `completion_only_v1`. Full creative completion is regression-tested to keep `completionReady=true` while `masteryReady=false` and academic certificate eligibility remains false.

## Current runtime inventory

| Runtime | Activities |
| --- | ---: |
| `tap_choice` | 481 |
| `listen_and_choose` | 76 |
| `matching` | 125 |
| `trace` | 14 |
| `story` | 1 |
| `motion_game` | 3 |
| `coloring` | 100 |
| `drawing` | 100 |

Total: **900**.

## Cloud profiles and ownership

Authenticated mode uses Supabase as source of truth for account-owned child profiles, attempts, evidence, mastery, derived progress, achievements, and certificates. Guest mode remains local-only.

Real child routes require an undeleted account-owned `player_profiles` row; foreign/deleted IDs fail closed. `demo-gian` remains the explicit account-scoped sandbox sentinel. Migration `0007_learning_child_ownership` enforces this ownership boundary at attempt recording.

Authenticated attempt sync retains the durable browser outbox. Failed attempts stay account-bound without storing tokens, use bounded retry/backoff/TTL, and cannot create server mastery until accepted by the canonical RPC.

## Supabase production state

Canonical project:

- organization: `inmydraft`
- project: `mainlagi-hub`
- project ref: `estvtgflwkebomsqlolv`
- region: `ap-southeast-1`
- status: active/healthy.

Applied migration chain remains verified through Batch 14 Wave D / migration `0046`. Batch 15 intentionally has no migration because schema and persisted catalog data are unchanged.

Final live verification after Batch 15 implementation:

- 900 active activities;
- 683 assessed / 217 practice globally;
- all nine subjects exactly 100 activities;
- 197 active packs;
- 200 active skills;
- zero creative assessed/non-completion evidence drift;
- zero Drawing/Coloring runtime-mechanic drift.

Advisor state after Batch 15:

- security: the same two known WARN findings remain — intentional authenticated execution of protected `SECURITY DEFINER` `record_learning_attempt(...)`, and leaked-password protection disabled under the current Supabase configuration/plan;
- performance: 17 `unused_index` observations, INFO-only; no WARN-level regression.

## CI and release governance

Primary CI covers OpenNext/Cloudflare build, Ubuntu typecheck/lint/source/assets/engine/learning/simulations, Windows compatibility, Chromium mobile-route QA, dependency audit, full-history Gitleaks, and exact-commit Cloudflare smoke on `main`.

```text
short-lived branch
  -> PR
  -> full CI / QA
  -> migration/live verification when persistence changes
  -> squash merge
  -> Cloudflare deploy from main
  -> exact-commit production smoke
  -> closure evidence
```

The active `Protect main` ruleset currently requires `Production build`, `Quality gate (Ubuntu)`, `Windows compatibility`, and `Production dependency audit`. `Secret history scan` runs and is green but is not yet configured as a required status check. This remains an account-level action documented in `ACCOUNT_LEVEL_ACTIONS.md`.

## Engineering closure status

- Batches 0–9 — complete at their defined engineering/catalog scopes;
- Batch 10 Iqro to 100 — engineering/content-catalog complete; expert review still required;
- Batch 11 Letters/Menulis to 100 — complete in production;
- Batch 12 Logic/Logika to 100 — complete in production;
- Batch 13 Science/Sains to 100 — complete in production;
- Batch 14 Drawing + Coloring to 100 each — complete in production;
- **Batch 15 adaptive/mastery/report scaling — complete in production**;
- **Batch 16 performance/accessibility/security/device QA — NEXT**;
- Batch 17 final acceptance/production closure — planned.

## Remaining boundaries

Product speech remains consolidated behind `AudioManager`; no child pronunciation recording/upload is introduced. Science remains age-appropriate and does not depend on unsafe unsupervised experiments. Automated CI does not replace representative physical-device camera/audio/trace/accessibility/touch-canvas acceptance; this is a Batch 16 responsibility.
