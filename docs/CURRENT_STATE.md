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

## Latest verified production engineering baseline

Engineering hardening commit:

`771409b04a5ea626f6dfc68d1265197492e0263e`

Verification on 10 September 2026:

- `Quality gate (Ubuntu)` — success;
- `Windows compatibility` — success;
- `Production build` — success;
- `Production dependency audit` — success;
- `Secret history scan` — success;
- `Workers Builds: mainlagi-hub` — success;
- Cloudflare Build ID `01a94875-f9c8-4b1f-ad89-9824a14fdbc5`;
- Cloudflare Version ID `2f9a60e6-6571-494d-bfd5-ce9847454d9c`;
- `Production smoke (Cloudflare)` — success for the exact SHA above and canonical Supabase target.

`/api/health` exposes only non-secret release/backend metadata. The smoke gate rejects an older still-running Worker and requires the expected SHA, `main` branch, canonical site URL, backend `supabase`, and project ref `estvtgflwkebomsqlolv`.

## Shipped learning architecture

Canonical hierarchy:

```text
Subject
  -> Learning Path
    -> Stage
      -> Lesson
        -> Activity
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

The motion/vision engine remains an Activity runtime. It is not the universal learning data model.

Current subjects:

- Bahasa Indonesia
- English
- Matematika
- Iqro
- Mewarnai

Current activity families include touch choice, listening, matching, guided trace, story, coloring, and motion/gesture activities.

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
- guided trace can publish explicit evaluator output based on actual path quality.

Parent-facing UI uses **Skor evidence** separately from mastery level.

## Curriculum and adaptive learning

The repository now formalizes Subject -> Learning Path -> Stage -> Lesson -> Activity without breaking existing activity IDs.

Adaptive Learning V2 is deterministic and testable. Ranking respects hard gates for age, stage access, and motion opt-in, then uses measured history to provide:

- different-activity remediation for weak evidence;
- confidence-building with varied evidence;
- spaced review for stronger skills;
- repeat suppression;
- soft difficulty adjustment from recent accuracy/retries.

Adaptive ranking never changes mastery itself.

Eight additional assessed evidence-variant activities were added across Bahasa, English, Math, and Iqro. They provide varied evidence without inflating stage completion requirements.

## Cloud profiles, learning state, and offline behavior

Authenticated mode uses Supabase as the source of truth:

- account-owned `player_profiles` for child profiles;
- cloud attempts, evidence, mastery, and derived progress;
- cloud achievements and certificates;
- immediate cloud refresh after successful attempt sync.

Guest mode remains local-only and does not silently upload profiles after login.

Legacy child-specific `age_group` values remain compatible:

- `TK -> 5`
- `SD 1 -> 6`
- `SD 2 -> 7`

Ambiguous legacy `Umum` is intentionally not assigned a child age automatically.

### Offline authenticated attempts

Authenticated attempt sync now has a durable browser outbox:

- failed cloud attempts remain queued instead of disappearing;
- queue entries are bound to the authenticated account ID;
- tokens are never stored in the outbox;
- retries use bounded exponential backoff, retry ceiling, and TTL;
- pending attempts can appear as optimistic activity history but cannot create server mastery until accepted by the canonical RPC;
- duplicate queue entries and cross-account replay are regression tested.

Server-side idempotency remains anchored by the attempt client ID/RPC path.

## Parent and child safety boundaries

Production parent routes are server gated when Supabase is configured:

- `/parent/*` requires a valid server-verified session;
- real child routes require an undeleted account-owned `player_profiles` row;
- foreign/deleted child IDs fail closed;
- authenticated direct `/child/<childId>` manipulation is ownership checked;
- unauthenticated guest/local child play remains available by design;
- `demo-gian` is the single explicit sandbox sentinel and its learning data remains account scoped.

Migration `0007_learning_child_ownership` also enforces real-child ownership at the `learning_attempts` database boundary.

## Parent experience, achievements, and certificates

Parent Dashboard V2 includes:

- stage readiness and lock reasons;
- completion vs evidence readiness;
- skill/mastery summaries;
- subject recommendations;
- recent attempt history;
- weekly report metrics including active learning days, assessed/practice attempts, qualifying evidence, accuracy trend context, strengths, and skills to reinforce.

Achievements and certificates are server persisted. The UI does not invent local awards when cloud rows are absent.

Certificate issuance is idempotent and tied to canonical completion/evidence criteria. Practice-only areas cannot issue a competency certificate merely because they have no assessed skills.

## Audio and tracing

Listening activities provide browser speech/TTS status and a fallback state when speech is unavailable, muted, or fails.

No pronunciation microphone capture is part of this closure. Any future microphone/voice inference feature requires a separate privacy/consent design.

Guided trace assessment uses explicit runtime measurement. If a trace runtime cannot produce valid measurement, it fails conservatively to completion-only instead of manufacturing accuracy.

## Supabase production state

Canonical project:

- organization: `inmydraft`
- project: `mainlagi-hub`
- project ref: `estvtgflwkebomsqlolv`
- region: `ap-southeast-1`
- status: active/healthy

Applied migrations verified 10 September 2026:

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

`0010` adds non-destructive covering indexes for the legacy foreign keys reported by the performance advisor.

Latest advisor review:

- performance advisor: **0 WARN** and no unindexed-foreign-key finding;
- remaining performance findings are INFO-level unused-index observations, including newly created indexes with insufficient workload history, so they are not deleted without evidence;
- security advisor retains the intentional warning for authenticated execution of `public.record_learning_attempt(...)` as a protected SECURITY DEFINER RPC;
- leaked-password protection is unavailable on the current Supabase Free plan and remains an accepted plan limitation with existing password-change protections.

## CI and regression coverage

Primary CI covers:

- OpenNext/Cloudflare production build;
- Ubuntu typecheck, lint, source/asset validation, engine tests, learning tests, simulations;
- Windows typecheck, lint, and engine tests;
- production dependency audit;
- full-history Gitleaks secret scan;
- exact-commit production smoke after `main` pushes.

Learning regression coverage includes:

- mastery transitions and anti-one-shot behavior;
- replay/retry anti-farming;
- evidence degradation and practice classification;
- stage progression from qualifying evidence;
- assessed-runtime/catalog consistency;
- curriculum hierarchy/content diversity;
- Adaptive Learning V2 remediation/confidence/spacing/age/motion behavior;
- explicit runtime measurement and guided tracing;
- audio fallback;
- Parent Dashboard readiness and subject recommendations;
- achievement/certificate issuance and weekly report logic;
- cloud child/account ownership and multi-child isolation;
- durable offline outbox account isolation, deduplication, backoff, TTL, and pending overlay;
- migration/RLS/RPC security contracts.

## Engineering closure status

The foundation/platform wave requested in September 2026 is engineering-complete for:

- cloud child profiles and cloud learning source of truth;
- learning attempts + mastery;
- anti-farming and varied evidence;
- curriculum hierarchy;
- adaptive next-best activity;
- stage readiness/progression;
- Parent Dashboard/Report V2;
- persisted achievements and certificates;
- guided trace measurement;
- listening/TTS fallback;
- authenticated offline attempt outbox;
- Supabase database/index hardening;
- CI + exact-commit Cloudflare deployment verification.

This does **not** mean the product has no future work. Curriculum breadth, richer audio/voice, animation, camera/device tuning, accessibility refinement, performance profiling, and broader child UX can continue as product development rather than foundation blockers.

## Evidence boundary: automated vs human/device acceptance

Automated evidence proves repository, schema, regression, deployment, and public health-contract behavior. It does not substitute for all physical-device UX evidence.

Still useful as non-code acceptance exercises:

- create/use/delete a disposable real cloud child profile through the browser;
- intentionally go offline, complete an activity, return online, and observe outbox reconciliation;
- camera/gesture QA on representative phones/tablets/laptops;
- screen-reader, keyboard, touch-target, and visual QA on real devices.

These are acceptance/polish evidence, not unresolved schema or deployment implementation.

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
