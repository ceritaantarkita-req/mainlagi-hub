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

**Batch 16 automated performance/accessibility/security hardening is live in production; Batch 16 remains IN PROGRESS pending representative physical-device acceptance.**

Latest implementation SHA:

`8193bccbab8293ec7e30fb4de54a0f86537cfa59`

Implementation landed through PR #80. Main CI #318 completed successfully across:

- Ubuntu quality, Batch 16 security regressions, learning/engine tests, and simulations;
- Windows compatibility;
- Chromium responsive route QA plus Batch 16 accessibility/lazy-load regressions;
- Cloudflare/OpenNext production build plus production JavaScript budgets;
- production dependency audit;
- full-history secret scan;
- exact-SHA Cloudflare production smoke.

Detailed progress evidence: `EXPANSION_BATCH16_PROGRESS_2026-09-11.md`.

Canonical physical-device matrix: `BATCH16_PHYSICAL_DEVICE_QA.md`.

Batch 16 is not production-closed yet. Physical iPhone/Safari and Android/Chrome evidence is still required for real camera, audio/TTS, trace/touch, orientation, browser chrome/safe-area, assistive-technology, text scaling, and offline/reconnect/session-isolation behavior.

Batch 15 remains fully production-complete. Its closure is documented in `EXPANSION_BATCH15_CLOSURE_2026-09-11.md`.

**Iqro review boundary remains unchanged:** all active Iqro packs remain `expert_required`, not `expert_approved`. Engineering production closure is not religious-learning expert approval.

## Current playable catalog

Batch 16 changes no catalog rows, classifications, IDs, or persistence schema. The canonical repository/live-DB catalog remains:

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

All nine planned tracks remain at the canonical 100-activity target.

## Batch 16 automated hardening

### Performance/build regression gates

Production-build CI now enforces explicit JavaScript regression ceilings through `scripts/run-batch16-build-budget.mjs`.

Verified CI #317/#318 baseline:

- largest static JavaScript chunk: **0.35 MiB** against a 5 MiB ceiling;
- total static JavaScript: **2.03 MiB** against an 18 MiB ceiling;
- root/main JavaScript: **0.42 MiB** against a 2 MiB ceiling;
- no app entry exceeds the 3 MiB per-entry gate;
- executable MediaPipe remains behind dynamic import boundaries;
- `AudioManager` construction does not eagerly call remote `/api/tts`.

These are automated regression budgets, not physical-device latency guarantees.

### Accessibility/lazy-load browser regression gates

The canonical Chromium route matrix still exercises 320, 360, 375, 390, 430, 768, and 1024 widths and representative learning runtimes.

Batch 16 adds representative checks for:

- `prefers-reduced-motion: reduce` behavior;
- visible image `alt` presence;
- accessible labels on visible form controls;
- keyboard focus reachability;
- no focusable controls under `aria-hidden="true"`;
- no eager MediaPipe/landmarker/WASM/task requests on representative non-vision routes;
- no eager remote `/api/tts` call before interaction.

Existing horizontal-overflow, touch-target, route-boundary, framework-overlay, page-error, and console-error checks remain in force.

### Security regression gates

`Quality gate (Ubuntu)` now runs `scripts/run-batch16-security-tests.mjs`, which locks the following boundaries:

- client code cannot reference server-only credential names;
- raw-HTML sinks remain on the reviewed allowlist;
- article HTML/JSON-LD must pass through the repository sanitizer/serializer;
- dangerous URL/embed sanitizer boundaries remain constrained;
- theme bootstrap raw HTML remains static and non-interpolated;
- migration `SECURITY DEFINER` occurrences retain pinned `search_path` context;
- `record_learning_attempt(...)` keeps its explicit revoke/grant boundary and stays unavailable to `anon`;
- learning outbox remains account-bound and credential-free;
- the Supabase service-role helper remains server-only and environment-backed.

This complements the pre-existing RLS/ownership/RPC/outbox/mastery tests, dependency audit, and full-history secret scan.

## Batch 15 adaptive/mastery/report scaling

Batch 15 remains closed and unchanged by Batch 16:

- child/parent recommendation consumers converge on Adaptive Learning V2;
- all nine subjects have bounded recommendation coverage;
- weak-skill remediation can prefer alternate same-skill activities/runtimes over exact replay;
- Drawing and Coloring remain recommendation-capable but practice-only;
- Parent reporting stays bounded rather than dumping raw catalog/history;
- creative-only subjects do not receive synthetic mastery percentages;
- completion-only creative activity cannot satisfy assessed certificate/mastery gates;
- the 1,200-attempt scale regression preserves `<64 KiB` bounded Parent report and conservative `<5s` adaptive/report CI sweep budgets.

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

Generic Latin tracing remains completion-only practice until a validated glyph-shape evaluator exists.

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

## Audio, tracing, science-safety, creative, and physical-device boundaries

Product speech remains consolidated behind `AudioManager`; no child pronunciation recording/upload is introduced.

Generic Latin tracing remains completion-only practice and is not handwriting-shape mastery evidence.

Science content uses age-appropriate observable/predictive reasoning and does not depend on unsafe unsupervised experiments.

Drawing/Coloring completion records participation only; it is intentionally separate from objective skill mastery.

Automated CI now has stronger accessibility/lazy-load/performance coverage, but it still does not replace physical-device camera/audio/trace/accessibility acceptance. The manual matrix in `BATCH16_PHYSICAL_DEVICE_QA.md` remains open and must contain actual physical-hardware evidence before Batch 16 closure.

## Supabase production state

Canonical project:

- organization: `inmydraft`
- project: `mainlagi-hub`
- project ref: `estvtgflwkebomsqlolv`
- region: `ap-southeast-1`
- status: active/healthy.

Applied expansion migration chain remains verified through Batch 14 Wave D. Batches 15 and 16 automated hardening require no migration/DDL. Recent expansion migrations remain `0039` through `0046` for Batch 13/14.

Final live catalog verification remains:

- 900 active activities;
- 683 assessed / 217 practice globally;
- every subject exactly 100 activities;
- Drawing exactly 100 practice activities;
- Coloring exactly 100 practice activities;
- 197 active packs;
- 200 active skills;
- zero active creative activities with assessed/non-completion evidence drift;
- zero Drawing/Coloring runtime-mechanic drift.

No Batch 16 DDL was introduced, so the existing post-Batch-14 advisor baseline remains applicable:

- security: two known WARN findings remain — intentional authenticated execution of protected `SECURITY DEFINER` `record_learning_attempt(...)`, and leaked-password protection disabled under the current Supabase configuration/plan;
- performance: the previously observed unused-index findings remain informational unless a later index/query review changes that state.

## CI and release governance

Primary CI now covers:

- Cloudflare/OpenNext production build plus Batch 16 JS/lazy-load budgets;
- Ubuntu structure/assets/source/security/typecheck/lint/engine/learning/simulations;
- Windows compatibility;
- Chromium responsive route QA plus representative accessibility/lazy-load gates;
- production dependency audit;
- full-history secret scan;
- exact-commit Cloudflare smoke on `main`.

```text
short-lived branch
  -> PR
  -> full CI / QA
  -> required migration verification where persistence changes
  -> squash merge
  -> Cloudflare deploy from main
  -> exact-commit production smoke
  -> closure/progress evidence
```

The active `Protect main` ruleset currently requires `Production build`, `Quality gate (Ubuntu)`, `Windows compatibility`, and `Production dependency audit`. `Secret history scan` runs successfully but is not yet configured as a required status check. This remains an account-level action documented in `ACCOUNT_LEVEL_ACTIONS.md`.

## Engineering closure status

- Batches 0–14 — complete at their documented scopes; Batch 10 catalog engineering is complete but Iqro expert review remains open;
- **Batch 15 adaptive/mastery/report scaling — COMPLETE IN PRODUCTION**;
- **Batch 16 performance/accessibility/security/device QA — IN PROGRESS: automated hardening COMPLETE IN PRODUCTION; representative physical-device acceptance PENDING**;
- **Batch 17 final acceptance/production closure — PLANNED and blocked on Batch 16 closure**.