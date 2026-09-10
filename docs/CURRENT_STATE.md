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

**Expansion Batch 11 — Letters/Menulis to 100 is engineering/content-catalog production-complete.**

Final Batch 11 implementation SHA:

`1ec8c69bce010424807d918a3b4655cd18b1f357`

Final implementation landed through PR #62. Main CI #270 succeeded for Ubuntu quality/learning/simulations, Windows compatibility, Chromium mobile-route QA, production build, dependency audit, full-history secret scan, and exact-SHA Cloudflare production smoke.

Detailed closure evidence: `EXPANSION_BATCH11_CLOSURE_2026-09-11.md`.

Batch 7 Math-to-100, Batch 8 Bahasa-Indonesia-to-100, Batch 9 English-to-100, and Batch 10 Iqro-to-100 remain production-complete with their own closure records.

**Iqro review boundary remains unchanged:** all active Iqro packs remain `expert_required`, not `expert_approved`. Engineering production closure is not religious-learning expert approval.

## Current playable catalog

Canonical repository and live Supabase counts after Batch 11:

- 8 first-class subjects;
- 8 learning paths;
- 30 stages;
- 117 lessons;
- 117 versioned content packs;
- **508 playable activities**;
- **120 skills**;
- **489 assessed activities**;
- **19 practice activities**.

Current subject activity counts:

| Subject | Playable | Assessed | Practice | Skills |
| --- | ---: | ---: | ---: | ---: |
| Bahasa Indonesia | 100 | 99 | 1 | 23 |
| English | 100 | 100 | 0 | 23 |
| Math | 100 | 98 | 2 | 22 |
| Iqro | 100 | 99 | 1 | 22 |
| **Letters / Menulis** | **100** | **87** | **13** | **25** |
| Logic / Logika | 3 | 3 | 0 | 2 |
| Science / Sains | 3 | 3 | 0 | 2 |
| Coloring / Mewarnai | 2 | 0 | 2 | 1 |

Drawing/Menggambar is not first-class yet. It remains planned for Batch 14 together with expansion of Coloring/Mewarnai.

## Batch 11 Letters/Menulis expansion

Batch 11 preserved the three historical Letters activities and added exactly **97 meaningful activities** through four separately gated waves:

- Wave A — 3 -> 25: +22 covering uppercase/lowercase B–F recognition, case matching, visual discrimination, and basic pre-writing strokes; PR #59, migration `0031`, SHA `cb6dfb662f0f14b8c66de29db30319ea08e06644`, main CI #261;
- Wave B — 25 -> 50: +25 covering G–M recognition, case matching, sequence, visual discrimination, and representative formation practice; PR #60, migration `0032`, SHA `3c3f446b70c6047236216b0b505e3f5fe9da9c88`, main CI #263;
- Wave C — 50 -> 75: +25 covering N–T recognition, case matching, sequence, visual discrimination, and representative formation practice; PR #61, migration `0033`, SHA `fdd0dae049b1cd4740286dd1b1a56700d9641154`, main CI #267;
- Wave D — 75 -> 100: +25 covering U–Z recognition, case matching, end-alphabet sequence, visual discrimination, and representative formation practice; PR #62, migration `0034`, SHA `1ec8c69bce010424807d918a3b4655cd18b1f357`, main CI #270.

All four post-merge runs passed exact-SHA Cloudflare production smoke.

Batch 11 additions are **85 assessed + 12 practice**. Together with the historical Letters baseline, Letters closes at **87 assessed / 13 practice**.

Generic pre-writing/letter-formation traces remain completion-only practice with `completion_only_v1`, cannot gate stage readiness, and do not claim letter-shape accuracy/mastery. No validated Latin letter-shape fidelity evaluator exists yet.

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

Batch 11 does not weaken these boundaries. Generic Latin tracing remains practice-only until shape fidelity is explicitly implemented and validated.

## Current runtime inventory

| Runtime | Activities |
| --- | ---: |
| `tap_choice` | 324 |
| `listen_and_choose` | 76 |
| `matching` | 88 |
| `trace` | 14 |
| `story` | 1 |
| `motion_game` | 3 |
| `coloring` | 2 |

Total: **508**.

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

Applied migration chain is verified through Batch 11 Wave D. The Batch 11 repo migrations are:

```text
0031_batch11_letters_wave_a.sql
0032_batch11_letters_wave_b.sql
0033_batch11_letters_wave_c.sql
0034_batch11_letters_wave_d.sql
```

The Supabase registry records the corresponding applied names `batch11_letters_wave_a` through `batch11_letters_wave_d`.

Post-`0034` live verification:

- 508 active activities;
- 489 assessed / 19 practice globally;
- Letters exactly 100 = 87 assessed / 13 practice;
- 117 active packs;
- 120 active skills;
- 25 active Letters skills;
- 25 Wave D activity-skill links;
- zero active Letters activities missing mechanic/evidence metadata.

Post-DDL performance advisor has no WARN-level regression; 18 unused-index observations remain INFO-only. Security advisor still reports the two known WARN findings: intentional authenticated execution of protected SECURITY DEFINER `record_learning_attempt(...)`, and leaked-password protection disabled under the current Supabase configuration/plan. Batch 11 introduced no new advisor warning.

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
- **Batch 11 Letters/Menulis to 100 — complete in production**;
- **Batch 12 Logic/Logika to 100 — NEXT**;
- Batch 13+ — planned according to `MAINLAGI_EXPANSION_IMPLEMENTATION_PLAN.md`.
