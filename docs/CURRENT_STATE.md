# Mainlagi Hub — Current State

Last reviewed: 10 September 2026

This file is the canonical human/AI handoff for the current repository state. `main` is the only product source of truth. Commit SHAs are verification snapshots, not permanent version labels.

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

Expansion Batch 6 is the latest production-complete expansion baseline.

Canonical Batch 6 release SHA:

`466634e0d673893cbe25fae68bfe5e22dad04f0a`

PR #37 (`feat: add Batch 6 subject and curriculum foundations`) was squash-merged on 10 September 2026.

Post-merge workflow run #210 succeeded for:

- `Quality gate (Ubuntu)` including learning tests and simulations;
- `Windows compatibility`;
- `Mobile route QA (Chromium)`;
- `Production build`;
- `Production dependency audit`;
- `Secret history scan`;
- `Production smoke (Cloudflare)`.

The production smoke verified the exact release SHA, branch `main`, canonical public site, backend `supabase`, and project ref `estvtgflwkebomsqlolv`.

Batch 5 is also production-complete. It landed through PR #35 at squash SHA `5164d3b40492531b4ba5654ecc192ab3f8db72d8`; migration `0012_reusable_mechanic_library` is applied in the canonical Supabase project.

## Shipped learning/content architecture

Canonical authoring hierarchy:

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

The motion/vision engine remains an optional Activity runtime. It is not the universal learning data model.

## Current playable catalog

Batch 6 production baseline:

- 8 first-class subjects: Bahasa Indonesia, English, Matematika, Iqro, Letters/Menulis, Logic/Logika, Science/Sains, and Coloring/Mewarnai;
- 8 learning paths;
- 10 stages;
- 16 lessons;
- 16 versioned content packs;
- 34 playable activities;
- 18 skills;
- 27 assessed activities;
- 7 practice activities.

The 25 activities that predate Batch 6 retain their historical IDs. Batch 6 adds exactly nine starter activities: three each for Letters/Menulis, Logic/Logika, and Science/Sains.

Drawing/Menggambar is not first-class yet. It remains planned for Batch 14 together with expansion of Coloring/Mewarnai to 100 activities.

## Batch 6 subject foundations

### Letters / Menulis

- path: `letters-writing-foundations`
- stage: `letters-foundations`
- lesson: `letters-a-foundations`
- pack: `letters.pack.letter-a`
- starter activities: 3
- starter skills: 2

Evidence boundary:

- `letters-find-a` — required + assessed;
- `letters-trace-a` — required guided practice, `completion_only_v1`;
- `letters-match-case` — assessed variation.

Letter tracing is deliberately completion-only because the currently validated trace-fidelity evaluator is digit-specific. It must not manufacture academic accuracy/mastery until a letter-shape fidelity evaluator is explicitly implemented and validated.

### Logic / Logika

- path: `logic-thinking-foundations`
- stage: `logic-foundations`
- lesson: `logic-visual-foundations`
- pack: `logic.pack.visual-basics`
- starter activities: 3
- starter skills: 2

Two required measured core activities and one assessed variation are registered through existing measured choice/matching runtimes.

### Science / Sains

- path: `science-discovery-foundations`
- stage: `science-foundations`
- lesson: `science-living-world`
- pack: `science.pack.living-world`
- starter activities: 3
- starter skills: 2

Two required measured core activities and one assessed variation are registered through existing measured choice/matching runtimes. No unsafe unsupervised experiment flow is introduced.

All three foundations are touch-first and camera-independent.

## Reusable mechanic library

Batch 5 established exactly 20 reusable mechanic contracts across choice, pairing, targeting, classification, ordering, path, and practice families.

The library includes tap choice, listen-and-choose, matching, guided trace, drag-to-target, draw-line matching, sort/classify, ordering/sequence, pattern completion, odd-one-out, connect-dots, memory pairs, compare, missing item, maze/path, story comprehension, find-object/observation, story, coloring, and optional motion wrapper.

Seventeen mechanics support assessed + practice mode; story, coloring, and optional motion wrapper are intentionally practice-only. A mechanic capability does not itself count as a playable activity.

## Learning evidence and mastery integrity

Mastery levels remain:

`not_started -> exploring -> developing -> proficient -> mastered`

Current protections include:

- one perfect qualifying attempt remains at most `exploring`;
- repeated qualifying evidence is required for higher mastery;
- rapid replay inside 30 seconds is retained but does not qualify for mastery farming;
- seven or more retries make evidence non-qualifying;
- practice/completion-only activities cannot manufacture assessed mastery evidence;
- server/catalog classification owns whether an activity is assessed;
- stage readiness uses qualifying evidence, not raw replay count;
- completion-only trace paths do not receive fabricated accuracy;
- measured all-wrong interactions remain accuracy `0` evidence instead of disappearing;
- missing measurement fails closed to completion-only;
- hints/retries are retained and the existing mastery engine applies independence penalties downstream.

Parent-facing UI uses evidence score separately from mastery level.

## Curriculum, adaptive learning, and reporting

Adaptive Learning V2 remains deterministic and testable. Ranking respects hard gates for age, stage access, and motion opt-in, then uses measured history for remediation, confidence building, spaced review, repeat suppression, and soft difficulty adjustment.

Batch 6 subject foundations participate in the same existing systems as older subjects:

- child navigation and Mainlagi World entry;
- subject/stage/activity routing;
- canonical path/lesson/content-pack ownership;
- age eligibility;
- measured attempts where evidence fidelity is supported;
- completion-only practice where fidelity is not supported;
- skill mastery and stage readiness;
- adaptive subject-scoped recommendations;
- Parent Dashboard subject summaries and skill rows;
- evidence-driven certificate eligibility.

The local and cloud `all-subjects` achievement threshold is now eight first-class subjects instead of the historical five-subject threshold.

## Cloud profiles, learning state, and offline behavior

Authenticated mode uses Supabase as the source of truth for account-owned child profiles, attempts, evidence, mastery, derived progress, achievements, and certificates. Guest mode remains local-only.

Legacy child-specific `age_group` compatibility remains:

- `TK -> 5`
- `SD 1 -> 6`
- `SD 2 -> 7`

Ambiguous legacy `Umum` is intentionally not assigned a child age automatically.

Authenticated attempt sync uses a durable browser outbox. Failed cloud attempts stay queued, remain account-bound without storing tokens, use bounded retry/backoff/TTL, and cannot create server mastery until accepted by the canonical RPC.

## Parent and child safety boundaries

Production parent routes are server gated when Supabase is configured. Real child routes require an undeleted account-owned `player_profiles` row; foreign/deleted child IDs fail closed. Guest/local child play remains available by design. `demo-gian` remains the single explicit account-scoped sandbox sentinel.

Migration `0007_learning_child_ownership` enforces real-child ownership at the learning-attempt database boundary.

Certificate issuance is idempotent and tied to canonical completion/evidence criteria. Practice-only areas cannot issue competency certificates merely because they have no assessed skills.

## Audio and tracing

Batch 3 consolidated product speech behind `AudioManager` with unlock/warmup, locale voice caching, bounded queue/deduplication, stale-speech cancellation, standardized rates, readable fallback handling, and privacy-safe local latency instrumentation.

No pronunciation microphone capture is part of this architecture.

Guided trace assessment requires explicit validated runtime measurement. Unsupported trace fidelity remains completion-only.

## Supabase production state

Canonical project:

- organization: `inmydraft`
- project: `mainlagi-hub`
- project ref: `estvtgflwkebomsqlolv`
- region: `ap-southeast-1`
- status: active/healthy.

Applied migration chain verified on 10 September 2026:

1. `0001_init`
2. `0002_learning_attempt_schema`
3. `0003_learning_mastery_functions`
4. `0004_learning_rpc_hardening`
5. `0005_database_advisor_hardening`
6. `0006_private_admin_helper`
7. `0007_learning_child_ownership`
8. `0008_curriculum_content_expansion`
9. `0009_learning_awards_certificates`
10. `0010_legacy_fk_indexes`
11. `0011_scalable_content_architecture`
12. `0012_reusable_mechanic_library`
13. `0013_new_subject_curriculum_foundations`
14. `0014_batch6_award_catalog_scaling`

Live catalog verification matches repository Batch 6 counts: 34 active activities, 27 assessed, 7 practice, 18 active skills, and 16 active content packs.

Post-DDL performance advisor has no WARN-level finding; current unused-index observations are INFO only.

Security advisor still reports two known warnings:

- authenticated execution of protected SECURITY DEFINER `public.record_learning_attempt(...)`; intentional for the canonical authenticated attempt RPC and covered by ownership/anti-farming hardening;
- leaked-password protection disabled; accepted limitation of the current Supabase plan, not introduced by Batch 6.

## CI and regression coverage

Primary CI covers:

- OpenNext/Cloudflare production build;
- Ubuntu typecheck/lint/source/assets/engine/learning/simulations;
- Windows typecheck/lint/engine tests;
- Chromium mobile-route QA;
- production dependency audit;
- full-history Gitleaks;
- exact-commit Cloudflare production smoke after `main` pushes.

Learning regression coverage includes mastery transitions, anti-farming, practice classification, progression, curriculum hierarchy, content diversity, scalable content packs, reusable mechanic payload/evidence contracts, Adaptive Learning V2, explicit runtime measurement, audio fallback, parent insights/reporting, awards/certificates, cloud ownership/multi-child isolation, durable offline outbox, migration/RLS/RPC contracts, Batch 6 subject foundations, and local/cloud all-subject threshold scaling.

## Engineering closure status

Expansion progress:

- Batch 0 baseline — complete;
- Batch 1 mobile foundation — complete;
- Batch 2 mobile route migration/Chromium QA — complete;
- Batch 3 AudioManager — complete;
- Batch 4 scalable content architecture — complete in production;
- Batch 5 reusable mechanic library — complete in production;
- Batch 6 new subject/curriculum foundations — complete in production;
- Batch 7 Math to 100 — next planned expansion stage;
- Batch 8+ — planned according to `MAINLAGI_EXPANSION_IMPLEMENTATION_PLAN.md`.

Batch 6 closure evidence is recorded in `EXPANSION_BATCH6_CLOSURE_2026-09-10.md`.

## Evidence boundary: automated vs human/device acceptance

Automated evidence proves repository, schema, regression, deployment, and public health-contract behavior. It does not replace all physical-device UX evidence. Representative real-device camera/audio/trace/accessibility QA remains part of later Batch 16 acceptance.

## Repository governance

Normal lifecycle:

```text
short-lived branch
  -> PR
  -> CI / QA
  -> squash merge
  -> Cloudflare deploy from main
  -> exact-commit production smoke
  -> delete merged branch
```

`main` remains canonical.

One account-level governance action remains outside the current connector write capability: ensure `Secret history scan` is required by the active main protection ruleset. The scan itself runs and passes; the remaining action is repository-setting enforcement. See `docs/ACCOUNT_LEVEL_ACTIONS.md`.
