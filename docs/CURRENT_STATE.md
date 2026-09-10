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
- Production is not VPS/SSH based. Old VPS deployment references are superseded.

## Latest verified production baseline

The latest fully verified production baseline **before Batch 5 merges** is Expansion Batch 4:

`923315882f7244f24a2045398a061d12a2b472cf`

Verification on 10 September 2026:

- `Quality gate (Ubuntu)` — success, including learning tests and simulations;
- `Windows compatibility` — success;
- `Mobile route QA (Chromium)` — success;
- `Production build` — success;
- `Production dependency audit` — success;
- `Secret history scan` — success;
- `Workers Builds: mainlagi-hub` — success;
- Cloudflare Build ID `0b98b636-b17a-4e64-902b-7b2b958b1e3f`;
- Cloudflare Version ID `5559c169-20db-448d-8162-029146ddb4bf`;
- `Production smoke (Cloudflare)` — success for the exact SHA and canonical Supabase target.

`/api/health` exposes only non-secret release/backend metadata. The smoke gate rejects an older still-running Worker and requires the expected SHA, `main` branch, canonical site URL, backend `supabase`, and project ref `estvtgflwkebomsqlolv`.

Batch 5 code in this repository adds the reusable mechanic library on top of that verified baseline. Its final production SHA belongs to the merge/deployment closure rather than being guessed in advance inside this PR.

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

Current playable catalog baseline:

- 5 subjects: Bahasa Indonesia, English, Matematika, Iqro, Mewarnai;
- 5 learning paths;
- 7 stages;
- 13 lessons;
- 13 versioned content packs;
- 25 playable activities;
- 12 skills;
- 19 assessed activities and 6 practice activities.

All 25 historical activity IDs remain stable. Batch 4 did not rewrite learning-attempt/mastery/progress identity.

### Reusable mechanic library

Batch 5 defines 20 reusable mechanic contracts across seven interaction families: choice, pairing, targeting, classification, ordering, path, and practice. The library covers:

- tap choice and listen-and-choose;
- matching and draw-line matching;
- drag-to-target;
- sort/classify;
- ordering/sequence and connect-dots;
- pattern completion and odd-one-out;
- guided trace and maze/path;
- memory pairs;
- compare and missing-item;
- story comprehension and find-object/observation;
- story, coloring, and optional motion wrapper as practice-only mechanics.

Every assessed-capable mechanic declares its payload contract, evidence contract, scoring model, accuracy behavior, correct/incorrect behavior, hint/retry semantics, completion boundary, and mastery behavior. The reusable session engine publishes canonical `LearningAttemptOutcome` data through a small runtime adapter into the existing measurement-event/`LearningAttemptBridge` pipeline.

These 20 mechanics are **capabilities**, not 20 additional playable activities. The playable catalog remains 25 until later content packs instantiate the new mechanics.

## Learning evidence and mastery integrity

Mastery levels are:

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
- measured all-wrong reusable-mechanic interactions remain accuracy `0` evidence instead of being silently dropped;
- missing mechanic measurement fails closed to completion-only;
- hints/retries are retained and the existing mastery engine applies the independence penalty once downstream.

Parent-facing UI uses **Skor evidence** separately from mastery level.

## Curriculum and adaptive learning

Adaptive Learning V2 is deterministic and testable. Ranking respects hard gates for age, stage access, and motion opt-in, then uses measured history for:

- different-activity remediation for weak evidence;
- confidence-building with varied evidence;
- spaced review for stronger skills;
- repeat suppression;
- soft difficulty adjustment from recent accuracy/retries.

Adaptive ranking never changes mastery itself.

Eight additional assessed evidence-variant activities across Bahasa, English, Math, and Iqro provide varied evidence without inflating stage completion requirements.

## Cloud profiles, learning state, and offline behavior

Authenticated mode uses Supabase as the source of truth for account-owned child profiles, attempts, evidence, mastery, derived progress, achievements, and certificates. Successful cloud attempt sync triggers immediate cloud refresh.

Guest mode remains local-only and does not silently upload profiles after login.

Legacy child-specific `age_group` compatibility remains:

- `TK -> 5`
- `SD 1 -> 6`
- `SD 2 -> 7`

Ambiguous legacy `Umum` is intentionally not assigned a child age automatically.

Authenticated attempt sync has a durable browser outbox. Failed cloud attempts stay queued, are account-bound without storing tokens, use bounded retry/backoff/TTL, can appear as optimistic pending history, and cannot create server mastery until accepted by the canonical RPC. Server idempotency remains anchored by client attempt ID.

## Parent and child safety boundaries

Production parent routes are server gated when Supabase is configured:

- `/parent/*` requires a valid server-verified session;
- real child routes require an undeleted account-owned `player_profiles` row;
- foreign/deleted child IDs fail closed;
- authenticated direct `/child/<childId>` manipulation is ownership checked;
- unauthenticated guest/local child play remains available by design;
- `demo-gian` is the single explicit sandbox sentinel and its learning data remains account scoped.

Migration `0007_learning_child_ownership` enforces real-child ownership at the `learning_attempts` database boundary.

## Parent experience, achievements, and certificates

Parent Dashboard V2 includes stage readiness/lock reasons, completion vs evidence readiness, skill/mastery summaries, subject recommendations, recent attempt history, and weekly report metrics. Achievements and certificates are server persisted; the UI does not invent local awards when cloud rows are absent.

Certificate issuance is idempotent and tied to canonical completion/evidence criteria. Practice-only areas cannot issue a competency certificate merely because they have no assessed skills.

## Audio and tracing

Batch 3 consolidated product speech behind `AudioManager` with warmup/unlock, locale voice caching, queue/deduplication, stale-speech cancellation, standardized rates, fallback handling, and privacy-safe local latency instrumentation.

No pronunciation microphone capture is part of this architecture. Any future microphone/voice inference feature requires a separate privacy/consent design.

Guided trace assessment uses explicit runtime measurement. If a trace runtime cannot produce valid measurement, it fails conservatively to completion-only instead of manufacturing accuracy.

## Supabase production state

Canonical project:

- organization: `inmydraft`
- project: `mainlagi-hub`
- project ref: `estvtgflwkebomsqlolv`
- region: `ap-southeast-1`
- status: active/healthy.

Applied migrations verified before Batch 5 DB closure:

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

`0011` creates `learning_content_packs` and adds nullable pack/lesson/mechanic/evidence metadata plus non-null positive `content_revision` to `learning_activities`. Live verification found 13 packs and all 25 repository activities fully backfilled. The two current Iqro packs remain explicitly `expert_required`, not `expert_approved`.

Batch 5 adds additive migration `0012_reusable_mechanic_library`, which expands only the allowed mechanic/evidence vocabularies. It does not rename activity IDs or delete attempt/mastery/progress history. Its live applied state must be verified during Batch 5 closure.

Latest advisor review before this expansion had 0 performance WARN; remaining unused-index observations were INFO only. Security advisor retains the intentional warning for authenticated execution of protected SECURITY DEFINER `public.record_learning_attempt(...)`. Leaked-password protection remains unavailable on the current Supabase Free plan.

## CI and regression coverage

Primary CI covers OpenNext/Cloudflare production build, Ubuntu typecheck/lint/source/assets/engine/learning/simulations, Windows typecheck/lint/engine tests, Chromium mobile-route QA, production dependency audit, full-history Gitleaks, and exact-commit production smoke after `main` pushes.

Learning regression coverage includes mastery transitions/anti-one-shot, replay/retry anti-farming, practice classification, stage progression, curriculum hierarchy/content diversity, scalable content-pack validation, reusable mechanic payload/evidence contracts, Adaptive Learning V2, explicit runtime measurement/guided tracing, audio fallback, Parent Dashboard/reporting, awards/certificates, cloud ownership/multi-child isolation, durable offline outbox, and migration/RLS/RPC contracts.

## Engineering closure status

Foundation/platform work is complete for cloud child profiles/source of truth, attempts/mastery, anti-farming, curriculum hierarchy, adaptive recommendation, stage readiness, Parent Dashboard/Report V2, persisted awards/certificates, guided trace measurement, AudioManager, authenticated offline outbox, database hardening, CI, and exact-commit deployment verification.

Expansion progress:

- Batch 0 baseline — complete;
- Batch 1 mobile foundation — complete;
- Batch 2 mobile route migration/Chromium QA — complete;
- Batch 3 AudioManager — complete;
- Batch 4 scalable content architecture — complete in production;
- Batch 5 reusable mechanic library — implemented in this branch; final DB/CI/merge/exact-SHA production closure still determines completion;
- Batch 6+ — future expansion stages.

## Evidence boundary: automated vs human/device acceptance

Automated evidence proves repository, schema, regression, deployment, and public health-contract behavior. It does not substitute for all physical-device UX evidence. Still useful later: disposable real cloud child UX acceptance, intentional offline/reconnect acceptance, camera/gesture QA on representative devices, and screen-reader/keyboard/touch/visual QA.

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

One account-level governance action remains outside connector write capability: add `Secret history scan` to the active `Protect main` ruleset's required-status-check list. The scan itself already runs and passes; the remaining action is making it mandatory in GitHub Settings. See `docs/ACCOUNT_LEVEL_ACTIONS.md`.
