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

**Expansion Batch 13 — Science/Sains to 100 is engineering/content-catalog production-complete.**

Final Batch 13 implementation SHA:

`e35d211ada182e0c5379da7b9b33614309994852`

Final implementation landed through PR #71. Main CI #290 completed successfully across Ubuntu quality/learning/simulations, Windows compatibility, Chromium mobile-route QA, production build, dependency audit, full-history secret scan, and exact-SHA Cloudflare production smoke.

Detailed closure evidence: `EXPANSION_BATCH13_CLOSURE_2026-09-11.md`.

Batch 12 Logic/Logika is also production-complete at final implementation SHA `553b9e28f91feefa9af9c2995f2f7e913bf31491`; detailed evidence is in `EXPANSION_BATCH12_CLOSURE_2026-09-11.md`.

Batch 7 Math, Batch 8 Bahasa Indonesia, Batch 9 English, Batch 10 Iqro, and Batch 11 Letters/Menulis remain production-complete at their catalog targets.

**Iqro review boundary remains unchanged:** all active Iqro packs remain `expert_required`, not `expert_approved`. Engineering production closure is not religious-learning expert approval.

## Current playable catalog

Canonical repository/live-DB state after Batch 13:

- 8 first-class subjects;
- 8 learning paths;
- 38 stages;
- 157 lessons;
- 157 versioned content packs;
- **702 playable activities**;
- **160 skills**;
- **683 assessed activities**;
- **19 practice activities**.

| Subject | Playable | Assessed | Practice | Skills |
| --- | ---: | ---: | ---: | ---: |
| Bahasa Indonesia | 100 | 99 | 1 | 23 |
| English | 100 | 100 | 0 | 23 |
| Math | 100 | 98 | 2 | 22 |
| Iqro | 100 | 99 | 1 | 22 |
| Letters / Menulis | 100 | 87 | 13 | 25 |
| Logic / Logika | 100 | 100 | 0 | 22 |
| Science / Sains | 100 | 100 | 0 | 22 |
| Coloring / Mewarnai | 2 | 0 | 2 | 1 |

Drawing/Menggambar is not first-class yet. Batch 14 is planned to introduce Drawing and expand Coloring under creative-practice evidence rules.

The seven academic subjects are now all at the canonical 100-activity catalog target.

## Batch 12 Logic/Logika expansion

Logic preserved its three historical assessed activities and added exactly **97 measured assessed activities**:

- Wave A — 3 -> 25: +22; relations, classification, odd-one-out, comparison, simple rules; PR #64; migration `0035`; main SHA `ce76d5f7d11385712005a1edaf4005c459ac0eb7`; main CI #274.
- Wave B — 25 -> 50: +25; patterns, sequences, associations, comparisons, spatial relations; PR #65; migration `0036`; main SHA `1aa97490ab2d9f6625edfc027d4916784f719dfd`; main CI #276.
- Wave C — 50 -> 75: +25; conditional rules, multi-attribute classification, analogies, relative ordering, elimination/inference; PR #66; migration `0037`; main SHA `1208d9487d150ff2825be417f82fe01ce0413d96`; main CI #279.
- Wave D — 75 -> 100: +25; composed rules, set reasoning, transitive comparison, spatial transforms, mixed relational review; PR #67; migration `0038`; main SHA `553b9e28f91feefa9af9c2995f2f7e913bf31491`; main CI #281.

All additions use validated measured choice/matching evidence. Logic closes at **100 assessed / 0 practice**. All four post-merge runs passed exact-SHA Cloudflare production smoke.

## Batch 13 Science/Sains expansion

Science preserved its three historical assessed activities and added exactly **97 measured assessed activities**:

- Wave A — 3 -> 25: +22; living/non-living, plant basics, animal features/habitats, senses/observation, weather/day-night; PR #68; migration `0039`; main SHA `296b8c69513d5577233a8a777062741fd83163c9`; main CI #283.
- Wave B — 25 -> 50: +25; life cycles, organism needs/food, material properties, water state changes, forces/motion; PR #69; migration `0040`; main SHA `92f6767ee3015fb7e160adb0cd8ce85309676eb9`; main CI #285.
- Wave C — 50 -> 75: +25; Earth/sky patterns, body/healthy habits, ecosystem dependencies, environment care, observation/measurement; PR #70; migration `0041`; main SHA `1c956867fd912bfea25c7cb0105a97921299cf80`; main CI #287.
- Wave D — 75 -> 100: +25; investigation/evidence, living features/functions, material choice, weather/environment reasoning, mixed review; PR #71; migration `0042`; main SHA `e35d211ada182e0c5379da7b9b33614309994852`; main CI #290.

All additions use validated measured `choice_accuracy_v1` / `matching_accuracy_v1` evidence paths. Science closes at **100 assessed / 0 practice**. All four post-merge runs passed exact-SHA Cloudflare production smoke.

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

Generic Latin tracing remains completion-only practice until a validated Latin glyph-shape evaluator exists. Batch 12/13 do not weaken this boundary.

## Current runtime inventory

| Runtime | Activities |
| --- | ---: |
| `tap_choice` | 481 |
| `listen_and_choose` | 76 |
| `matching` | 125 |
| `trace` | 14 |
| `story` | 1 |
| `motion_game` | 3 |
| `coloring` | 2 |

Total: **702**.

## Cloud profiles and ownership

Authenticated mode uses Supabase as source of truth for account-owned child profiles, attempts, evidence, mastery, derived progress, achievements, and certificates. Guest mode remains local-only.

Real child routes require an undeleted account-owned `player_profiles` row; foreign/deleted IDs fail closed. `demo-gian` remains the explicit account-scoped sandbox sentinel. Migration `0007_learning_child_ownership` enforces this ownership boundary at attempt recording.

Authenticated attempt sync retains the durable browser outbox. Failed attempts stay account-bound without storing tokens, use bounded retry/backoff/TTL, and cannot create server mastery until accepted by the canonical RPC.

## Audio, tracing, science-safety, and device boundaries

Product speech remains consolidated behind `AudioManager`; no child pronunciation recording/upload is introduced.

Generic Latin tracing remains completion-only practice and is not handwriting-shape mastery evidence.

Science content uses age-appropriate observable/predictive reasoning and does not depend on unsafe unsupervised experiments.

Automated CI does not replace physical-device camera/audio/trace/accessibility acceptance. Representative real-device testing remains part of Batch 16.

## Supabase production state

Canonical project:

- organization: `inmydraft`
- project: `mainlagi-hub`
- project ref: `estvtgflwkebomsqlolv`
- region: `ap-southeast-1`
- status: active/healthy.

Applied migration chain is verified through Batch 13 Wave D. Recent expansion migrations:

```text
0035_batch12_logic_wave_a.sql
0036_batch12_logic_wave_b.sql
0037_batch12_logic_wave_c.sql
0038_batch12_logic_wave_d.sql
0039_batch13_science_wave_a.sql
0040_batch13_science_wave_b.sql
0041_batch13_science_wave_c.sql
0042_batch13_science_wave_d.sql
```

The canonical registry records `batch12_logic_wave_a` through `batch12_logic_wave_d` and `batch13_science_wave_a` through `batch13_science_wave_d`.

Final live verification after `0042`:

- 702 active activities;
- 683 assessed / 19 practice globally;
- Logic exactly 100 = 100 assessed / 0 practice;
- Science exactly 100 = 100 assessed / 0 practice;
- 157 active packs;
- 160 active skills;
- 22 active Logic skills;
- 22 active Science skills;
- zero active Science activities missing mechanic/evidence metadata.

Post-DDL performance advisor has no WARN-level regression; 18 unused-index observations remain INFO-only. Security advisor still reports the two known WARN findings: intentional authenticated execution of protected `SECURITY DEFINER` `record_learning_attempt(...)`, and leaked-password protection disabled under the current Supabase configuration/plan. Batch 12/13 introduced no new advisor warning.

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

One account-level action remains outside current connector write capability: ensure `Secret history scan` is required by the active `main` protection ruleset. The scan itself runs successfully; see `ACCOUNT_LEVEL_ACTIONS.md`.

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
- **Batch 12 Logic/Logika to 100 — complete in production**;
- **Batch 13 Science/Sains to 100 — complete in production**;
- **Batch 14 Drawing + Coloring to 100 each — NEXT**;
- Batch 15 adaptive/mastery/report scaling — planned;
- Batch 16 performance/accessibility/security/device QA — planned;
- Batch 17 final acceptance/production closure — planned.
