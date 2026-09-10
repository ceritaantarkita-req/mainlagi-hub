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

**Expansion Batch 10 — Iqro to 100 is engineering/content-catalog production-complete.**

Final Batch 10 implementation SHA:

`e927e3e283b3c15fb97239c9ce013ef6121d3947`

Final implementation landed through PR #57 after Waves A–C had each been separately production-closed. Post-merge main CI #256 succeeded for Ubuntu quality/learning/simulations, Windows compatibility, Chromium mobile-route QA, production build, dependency audit, full-history secret scan, and exact-SHA Cloudflare production smoke.

Detailed closure evidence: `EXPANSION_BATCH10_CLOSURE_2026-09-10.md`.

Batch 7 Math-to-100, Batch 8 Bahasa-Indonesia-to-100, and Batch 9 English-to-100 remain production-complete with their own closure records.

**Iqro review boundary:** all active Iqro packs remain `expert_required`, not `expert_approved`. Code/DB/CI/production success is not religious-learning expert approval.

## Current playable catalog

Canonical repository and live Supabase counts after Batch 10:

- 8 first-class subjects;
- 8 learning paths;
- 26 stages;
- 94 lessons;
- 94 versioned content packs;
- **411 playable activities**;
- **97 skills**;
- **404 assessed activities**;
- **7 practice activities**.

Current subject activity counts:

| Subject | Playable | Assessed | Practice | Skills |
| --- | ---: | ---: | ---: | ---: |
| Bahasa Indonesia | 100 | 99 | 1 | 23 |
| English | 100 | 100 | 0 | 23 |
| Math | 100 | 98 | 2 | 22 |
| **Iqro** | **100** | **99** | **1** | **22** |
| Letters / Menulis | 3 | 2 | 1 | 2 |
| Logic / Logika | 3 | 3 | 0 | 2 |
| Science / Sains | 3 | 3 | 0 | 2 |
| Coloring / Mewarnai | 2 | 0 | 2 | 1 |

Drawing/Menggambar is not first-class yet. It remains planned for Batch 14 together with expansion of Coloring/Mewarnai.

## Batch 10 Iqro expansion

Batch 10 preserved the four historical Iqro activity IDs and added exactly **96** meaningful activities through four separately gated waves:

- Wave A — 4 -> 25: early Hijaiyah recognition/discrimination, listening, dot awareness, and name/form matching; PR #54, migration `0027`, SHA `75152bcf5d930c5a0f072e77a2679ca1c9edef73`, main CI #250;
- Wave B — 25 -> 50: Dal/Dzal, Ra/Zai, Sin/Syin recognition/listening/dot/name/family discrimination; PR #55, migration `0028`, SHA `074026b1c8b62a5a63b3004e6d591c820dd3ec5d`, main CI #252;
- Wave C — 50 -> 75: Shad through Qaf recognition/listening/dot/name/family discrimination; PR #56, migration `0029`, SHA `dc367d2fa712c3ec793d6161d8fdde434197a17b`, main CI #254;
- Wave D — 75 -> 100: Kaf through Ya, standalone Hamzah, and integrated review; PR #57, migration `0030`, SHA `e927e3e283b3c15fb97239c9ce013ef6121d3947`, main CI #256.

All four post-merge CI runs passed exact-SHA Cloudflare production smoke.

All 96 Batch 10 additions are assessed through existing measured `tap_choice`, `listen_and_choose`, or `matching` paths. No new generic trace was promoted to assessed. Iqro therefore closes at **99 assessed / 1 historical practice**.

Batch 10 authoring metadata is automatically checked against the canonical `HIJAIYAH_TEMPLATES` registry for 29 entries: 28 Hijaiyah letters plus standalone Hamzah. Tests lock glyph, Latin label, dot count, and dot-zone parity.

All **22 active Iqro packs** remain `expert_required`. Formal review of content/audio/pedagogical sequencing remains a separate human requirement.

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

Mastery remains:

`not_started -> exploring -> developing -> proficient -> mastered`

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

Batch 10 does not weaken these boundaries. Existing trace assessment remains conservative: unsupported glyph tracing stays completion-only until shape-fidelity measurement is explicitly validated.

## Current runtime inventory

| Runtime | Activities |
| --- | ---: |
| `tap_choice` | 251 |
| `listen_and_choose` | 76 |
| `matching` | 76 |
| `trace` | 2 |
| `story` | 1 |
| `motion_game` | 3 |
| `coloring` | 2 |

Total: **411**.

## Cloud profiles and ownership

Authenticated mode uses Supabase as source of truth for account-owned child profiles, attempts, evidence, mastery, derived progress, achievements, and certificates. Guest mode remains local-only.

Real child routes require an undeleted account-owned `player_profiles` row; foreign/deleted IDs fail closed. `demo-gian` remains the explicit account-scoped sandbox sentinel. Migration `0007_learning_child_ownership` enforces this ownership boundary at attempt recording.

Authenticated attempt sync retains the durable browser outbox. Failed attempts stay account-bound without storing tokens, use bounded retry/backoff/TTL, and cannot create server mastery until accepted by the canonical RPC.

## Audio, tracing, and device boundaries

Product speech remains consolidated behind `AudioManager`, including unlock/warmup, locale voice caching, bounded queue/deduplication, stale-speech cancellation, fallback handling, and privacy-safe local latency instrumentation. No child pronunciation recording/upload is introduced.

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
0019_batch8_bahasa_wave_a
0020_batch8_bahasa_wave_b
0021_batch8_bahasa_wave_c
0022_batch8_bahasa_wave_d
0023_batch9_english_wave_a
0024_batch9_english_wave_b
0025_batch9_english_wave_c
0026_batch9_english_wave_d
0027_batch10_iqro_wave_a
0028_batch10_iqro_wave_b
0029_batch10_iqro_wave_c
0030_batch10_iqro_wave_d
```

Post-`0030` live verification: 411 active activities, exactly 100 Iqro / 100 English / 100 Bahasa / 100 Math, 404 assessed / 7 practice, 97 active skills, 94 active packs, 100 Iqro activity-skill links, 22 Iqro `expert_required` packs, and zero active Iqro activities missing mechanic/evidence metadata.

Post-DDL performance advisor has no WARN-level regression; 18 unused-index observations are INFO only. Security advisor still reports the two known warnings: intentional authenticated execution of protected SECURITY DEFINER `record_learning_attempt(...)`, and leaked-password protection disabled under the current Supabase configuration/plan. Batch 10 introduced no new advisor warning.

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
- **Batch 8 Bahasa Indonesia to 100 — complete in production**;
- **Batch 9 English to 100 — complete in production**;
- **Batch 10 Iqro to 100 — engineering/content-catalog complete in production; expert review still required**;
- **Batch 11 Letters/Menulis to 100 — NEXT**;
- Batch 12+ — planned according to `MAINLAGI_EXPANSION_IMPLEMENTATION_PLAN.md`.
