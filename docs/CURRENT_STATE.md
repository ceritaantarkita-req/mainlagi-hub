# Mainlagi Hub — Current State

Last reviewed: 10 September 2026

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

**Expansion Batch 7 — Math to 100 is production-complete.**

Final Batch 7 implementation SHA:

`82acd7d39c6cab98f38c92e4f6d7be6afe52cdcd`

Final implementation landed through PR #42 after Waves A–C had each been separately closed. Post-merge main CI run #220 succeeded for Ubuntu quality/learning/simulations, Windows compatibility, Chromium mobile-route QA, production build, dependency audit, secret-history scan, and exact-SHA Cloudflare production smoke.

Detailed closure evidence: `EXPANSION_BATCH7_CLOSURE_2026-09-10.md`.

## Current playable catalog

Canonical repository and live Supabase counts after Batch 7:

- 8 first-class subjects: Bahasa Indonesia, English, Matematika, Iqro, Letters/Menulis, Logic/Logika, Science/Sains, and Coloring/Mewarnai;
- 8 learning paths;
- 14 stages;
- 34 lessons;
- 34 versioned content packs;
- 127 playable activities;
- 37 skills;
- 120 assessed activities;
- 7 practice activities;
- Math: exactly **100 playable activities**.

Current subject activity counts:

| Subject | Playable |
| --- | ---: |
| Bahasa Indonesia | 6 |
| English | 6 |
| Math | 100 |
| Iqro | 4 |
| Letters / Menulis | 3 |
| Logic / Logika | 3 |
| Science / Sains | 3 |
| Coloring / Mewarnai | 2 |

Drawing/Menggambar is not first-class yet. It remains planned for Batch 14 together with expansion of Coloring/Mewarnai.

## Batch 7 Math expansion

Batch 7 preserved the seven historical Math activity IDs and added 93 new Math activities through four reviewable waves:

- Wave A — 7 -> 25: numeral recognition, counting, quantity matching, early quantity intuition; PR #39, migration `0015`, SHA `94c21cf84bc809272c93d997b1e994abfc8e9bbb`;
- Wave B — 25 -> 50: quantity comparison, ordering, shapes/properties, patterns; PR #40, migration `0016`, SHA `3c2be1bac0c5f15c559bc3f5a4ab099f4fedf53f`;
- Wave C — 50 -> 75: missing numbers, grouping, addition/subtraction within 10, size/length; PR #41, migration `0017`, SHA `add22b874174ebbb797461f9a0b8c52fe60f9250`;
- Wave D — 75 -> 100: spatial position, measurement intuition, mixed operations, visual problems, integrated review; PR #42, migration `0018`, SHA `82acd7d39c6cab98f38c92e4f6d7be6afe52cdcd`.

All 93 Batch 7 additions are touch-first and use existing measured `tap_choice` or `matching` evidence contracts. No camera requirement was introduced for core Math learning.

## Shipped learning/content architecture

Canonical hierarchy:

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

Canonical progress/evidence flow:

```text
Child Profile
  -> Learning Attempt
    -> Skill Evidence
      -> Skill Mastery
        -> Stage Readiness / Unlock
          -> Reward / Achievement / Certificate
            -> Parent Report
```

The motion/vision engine remains an optional activity runtime rather than the universal learning data model.

## Learning evidence and mastery integrity

Mastery remains:

`not_started -> exploring -> developing -> proficient -> mastered`

Current protections remain in force:

- one perfect qualifying attempt remains at most `exploring`;
- repeated qualifying evidence is required for higher mastery;
- rapid replay inside 30 seconds is retained but does not qualify for mastery farming;
- seven or more retries make evidence non-qualifying;
- practice/completion-only activities cannot manufacture assessed mastery evidence;
- server/catalog classification owns assessed status;
- stage readiness uses qualifying evidence rather than raw replay count;
- measured all-wrong interactions remain accuracy `0` evidence;
- missing measurement fails closed to completion-only;
- hints/retries are retained and independence penalties remain downstream in the mastery engine.

All Batch 7 Math additions use measured `choice_accuracy_v1` or `matching_accuracy_v1` evidence. Existing conservative trace boundaries are unchanged: `letters-trace-a` remains completion-only practice until a letter-specific fidelity evaluator is validated.

## Batch 6 subject foundations retained

Letters/Menulis, Logic/Logika, and Science/Sains remain first-class subjects integrated with child navigation, age eligibility, adaptive ranking, stage readiness, Parent summaries, skill rows, cloud catalog registration, and certificate eligibility.

The local/cloud `all-subjects` achievement threshold remains eight first-class subjects. Drawing will require another intentional threshold/catalog update when it becomes first-class.

Current Iqro packs remain `expert_required`, not `expert_approved`; passing code/CI is not religious-learning expert approval.

## Reusable mechanic library

Batch 5 established 20 reusable mechanic contracts spanning choice, pairing, targeting, classification, ordering, path, and practice families. Mechanic capability does not itself count as a playable activity.

Seventeen mechanics support assessed + practice mode; story, coloring, and optional motion wrapper remain practice-only. Assessed usage requires valid measured evidence.

## Cloud profiles and ownership

Authenticated mode uses Supabase as the source of truth for account-owned child profiles, attempts, evidence, mastery, derived progress, achievements, and certificates. Guest mode remains local-only.

Real child routes require an undeleted account-owned `player_profiles` row; foreign/deleted IDs fail closed. `demo-gian` remains the explicit account-scoped sandbox sentinel. Migration `0007_learning_child_ownership` enforces the ownership boundary at attempt recording.

Authenticated attempt sync retains the durable browser outbox. Failed attempts stay account-bound without storing tokens, use bounded retry/backoff/TTL, and cannot create server mastery until accepted by the canonical RPC.

## Audio, tracing, and device boundaries

Batch 3 consolidated speech behind `AudioManager` with unlock/warmup, locale voice caching, bounded queue/deduplication, stale-speech cancellation, standardized rates, fallback handling, and privacy-safe local latency instrumentation. No child pronunciation recording/upload is introduced.

Guided trace assessment still requires validated runtime measurement. Unsupported trace fidelity remains completion-only.

Automated CI does not replace physical-device camera/audio/trace/accessibility acceptance. Representative real-device testing remains part of Batch 16.

## Supabase production state

Canonical project:

- organization: `inmydraft`
- project: `mainlagi-hub`
- project ref: `estvtgflwkebomsqlolv`
- region: `ap-southeast-1`
- status: active/healthy.

Applied migration chain is verified through:

```text
0001_init
0002_learning_attempt_schema
0003_learning_mastery_functions
0004_learning_rpc_hardening
0005_database_advisor_hardening
0006_private_admin_helper
0007_learning_child_ownership
0008_curriculum_content_expansion
0009_learning_awards_certificates
0010_legacy_fk_indexes
0011_scalable_content_architecture
0012_reusable_mechanic_library
0013_new_subject_curriculum_foundations
0014_batch6_award_catalog_scaling
0015_batch7_math_wave_a
0016_batch7_math_wave_b
0017_batch7_math_wave_c
0018_batch7_math_wave_d
```

Post-`0018` live verification: 127 active activities, 100 Math, 120 assessed / 7 practice, 37 active skills, and 34 active packs.

Post-DDL performance advisor has no WARN-level regression; 19 unused-index observations are INFO only. Security advisor still reports the two known pre-existing warnings: intentional authenticated execution of protected SECURITY DEFINER `record_learning_attempt(...)`, and leaked-password protection disabled under the current Supabase configuration/plan.

## CI and release governance

Primary CI covers OpenNext/Cloudflare build, Ubuntu typecheck/lint/source/assets/engine/learning/simulations, Windows compatibility, Chromium mobile-route QA, dependency audit, full-history Gitleaks, and exact-commit Cloudflare smoke on `main`.

Normal lifecycle:

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

One account-level action remains outside current connector write capability: ensure `Secret history scan` is required by the active `main` protection ruleset. The scan itself runs successfully; see `ACCOUNT_LEVEL_ACTIONS.md`.

## Engineering closure status

- Batch 0 baseline — complete;
- Batch 1 mobile foundation — complete;
- Batch 2 mobile route migration/Chromium QA — complete;
- Batch 3 AudioManager — complete;
- Batch 4 scalable content architecture — complete in production;
- Batch 5 reusable mechanic library — complete in production;
- Batch 6 new subject/curriculum foundations — complete in production;
- **Batch 7 Math to 100 — complete in production**;
- **Batch 8 Bahasa Indonesia to 100 — NEXT**;
- Batch 9+ — planned according to `MAINLAGI_EXPANSION_IMPLEMENTATION_PLAN.md`.
