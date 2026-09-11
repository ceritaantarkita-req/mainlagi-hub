# Mainlagi Hub — Current State

Last reviewed: 11 September 2026

This file is the canonical human/AI handoff for the current repository state. `main` is the product source of truth. Commit SHAs below are verification snapshots, not permanent version labels.

## Canonical baseline

- Repository: `ceritaantarkita-req/mainlagi-hub`
- Visibility: Public
- Default/canonical branch: `main`
- Source license: `AGPL-3.0-only`
- Production URL: `https://mainlagihub.my.id/`
- Canonical Supabase project ref: `estvtgflwkebomsqlolv`
- Production transport: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker `mainlagi-hub`
- Production is not VPS/SSH based.

## Latest verified production baseline

**Expansion Batch 14 — Drawing/Menggambar + Coloring/Mewarnai to 100 each is engineering/content-catalog production-complete.**

Final Batch 14 implementation SHA:

`b273edc282261bbec89b0c3d438822204cd925e5`

Final implementation landed through PR #76. Main CI #308 completed successfully across Ubuntu quality/learning/simulations, Windows compatibility, Chromium mobile-route QA, production build, dependency audit, full-history secret scan, and exact-SHA Cloudflare production smoke.

Detailed closure evidence: `EXPANSION_BATCH14_CLOSURE_2026-09-11.md`.

Earlier expansion closures remain valid:

- Batch 12 Logic/Logika final implementation SHA `553b9e28f91feefa9af9c2995f2f7e913bf31491`;
- Batch 13 Science/Sains final implementation SHA `e35d211ada182e0c5379da7b9b33614309994852`.

Batch 7 Math, Batch 8 Bahasa Indonesia, Batch 9 English, Batch 10 Iqro, and Batch 11 Letters/Menulis also remain production-complete at their catalog targets.

**Iqro review boundary remains unchanged:** all active Iqro packs remain `expert_required`, not `expert_approved`. Engineering production closure is not religious-learning expert approval.

## Current playable catalog

Canonical repository/live-DB state after Batch 14:

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

All nine planned tracks are now at the canonical 100-activity catalog target.

## Batch 14 Drawing + Coloring expansion

Batch 14 preserved the two historical Coloring practice activities, introduced Drawing as a first-class subject, and added exactly **198 creative-practice activities**: 100 Drawing and 98 Coloring.

- Wave A — Drawing 0 -> 25; Coloring 2 -> 25: +48 total; PR #73; migration `0043`; main SHA `f27ea5b047e657e896d991656bfe64cdb215c84e`; main CI #301.
- Wave B — both 25 -> 50: +50 total; PR #74; migration `0044`; main SHA `62e88a5f696d2b4eb2e691298671e137e91caa30`; main CI #304.
- Wave C — both 50 -> 75: +50 total; PR #75; migration `0045`; main SHA `e120d1fa098ff9f1a7949ba3d1ffa0dee00d312c`; main CI #306.
- Wave D — both 75 -> 100: +50 total; PR #76; migration `0046`; main SHA `b273edc282261bbec89b0c3d438822204cd925e5`; main CI #308.

All four post-merge runs passed exact-SHA Cloudflare production smoke.

Every Batch 14 creative addition is `practice` with `completion_only_v1` evidence. Drawing uses the `drawing` runtime/mechanic and Coloring uses `coloring`. Free-form or guided creative participation does not manufacture academic accuracy, mastery, stage mastery, or certificate evidence.

## Shipped learning/content architecture

```text
Subject
  -> Learning Path
    -> Stage
      -> Lesson
        -> Content Pack
          -> Activity Instance
            -> Mechanic
              -> Skill mapping / evidence contract
```

Canonical evidence flow:

```text
Child Profile
  -> Learning Attempt
    -> Skill Evidence
      -> Skill Mastery
        -> Stage Readiness / Unlock
          -> Reward / Achievement / Certificate
            -> Parent Report
```

The motion/vision engine remains optional rather than the universal learning data model.

## Learning evidence and mastery integrity

Mastery remains `not_started -> exploring -> developing -> proficient -> mastered`.

Protections remain in force:

- one perfect qualifying attempt remains at most `exploring`;
- repeated qualifying evidence is required for higher mastery;
- rapid replay inside 30 seconds is retained but does not qualify for mastery farming;
- seven or more retries make evidence non-qualifying;
- practice/completion-only activities cannot manufacture assessed mastery evidence;
- server/catalog classification owns assessed status;
- stage readiness uses qualifying evidence rather than raw replay count;
- measured all-wrong interactions remain accuracy `0` evidence;
- missing measurement fails closed to completion-only;
- hints/retries remain available for downstream independence penalties.

Generic Latin tracing remains completion-only practice until a validated Latin glyph-shape evaluator exists. Batch 14 does not weaken this boundary.

Creative Drawing/Coloring remains completion-only practice. There is no objective drawing/coloring mastery claim without a separately validated evaluator and evidence contract.

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

## Audio, tracing, science-safety, creative, and device boundaries

Product speech remains consolidated behind `AudioManager`; no child pronunciation recording/upload is introduced.

Generic Latin tracing remains completion-only practice and is not handwriting-shape mastery evidence.

Science content uses age-appropriate observable/predictive reasoning and does not depend on unsafe unsupervised experiments.

Drawing/Coloring completion records participation only; it is intentionally separate from objective skill mastery.

Automated CI does not replace physical-device camera/audio/trace/accessibility acceptance. Representative real-device testing remains part of Batch 16.

## Supabase production state

Canonical project:

- organization: `inmydraft`
- project: `mainlagi-hub`
- project ref: `estvtgflwkebomsqlolv`
- region: `ap-southeast-1`
- status: active/healthy.

Applied expansion migration chain is verified through Batch 14 Wave D. Recent migrations:

```text
0039_batch13_science_wave_a.sql
0040_batch13_science_wave_b.sql
0041_batch13_science_wave_c.sql
0042_batch13_science_wave_d.sql
0043_batch14_creative_wave_a.sql
0044_batch14_creative_wave_b.sql
0045_batch14_creative_wave_c.sql
0046_batch14_creative_wave_d.sql
```

Canonical migration registry contains `batch13_science_wave_a` through `batch13_science_wave_d` and `batch14_creative_wave_a` through `batch14_creative_wave_d`.

Final live verification after `0046`:

- 900 active activities;
- 683 assessed / 217 practice globally;
- every subject exactly 100 activities;
- Drawing exactly 100 practice activities;
- Coloring exactly 100 practice activities;
- 197 active packs;
- 200 active skills;
- Drawing 20 active skills;
- Coloring 21 active skills;
- zero active creative activities with assessed/non-completion evidence drift;
- zero Drawing/Coloring runtime-mechanic drift.

Post-DDL advisor state after Batch 14 Wave D:

- security: exactly two known WARN findings remain — intentional authenticated execution of protected `SECURITY DEFINER` `record_learning_attempt(...)`, and leaked-password protection disabled under the current Supabase configuration/plan;
- performance: 17 `unused_index` observations, INFO-only; no WARN-level regression.

## CI and release governance

Primary CI covers OpenNext/Cloudflare build, Ubuntu typecheck/lint/source/assets/engine/learning/simulations, Windows compatibility, Chromium mobile-route QA, dependency audit, full-history Gitleaks, and exact-commit Cloudflare smoke on `main`.

```text
short-lived branch
  -> PR
  -> full CI / QA
  -> required migration verification
  -> squash merge
  -> Cloudflare deploy from main
  -> exact-commit production smoke
  -> closure evidence
```

The active `Protect main` ruleset currently requires `Production build`, `Quality gate (Ubuntu)`, `Windows compatibility`, and `Production dependency audit`. `Secret history scan` runs and is green but is not yet configured as a required status check. This remains an account-level action documented in `ACCOUNT_LEVEL_ACTIONS.md`.

## Engineering closure status

- Batch 0 baseline — complete;
- Batch 1 mobile foundation — complete;
- Batch 2 mobile route migration/Chromium QA — complete;
- Batch 3 AudioManager — complete;
- Batch 4 scalable content architecture — complete in production;
- Batch 5 reusable mechanic library — complete in production;
- Batch 6 new subject/curriculum foundations — complete in production;
- Batch 7 Math to 100 — complete in production;
- Batch 8 Bahasa Indonesia to 100 — complete in production;
- Batch 9 English to 100 — complete in production;
- Batch 10 Iqro to 100 — engineering/content-catalog complete in production; expert review still required;
- Batch 11 Letters/Menulis to 100 — complete in production;
- Batch 12 Logic/Logika to 100 — complete in production;
- Batch 13 Science/Sains to 100 — complete in production;
- **Batch 14 Drawing + Coloring to 100 each — complete in production**;
- **Batch 15 adaptive/mastery/report scaling — NEXT**;
- Batch 16 performance/accessibility/security/device QA — planned;
- Batch 17 final acceptance/production closure — planned.
