# Mainlagi Hub — Current State

Last reviewed: 9 September 2026

This file is the canonical human/AI handoff for the current repository state. `main` is the only source of truth. Commit SHAs below are dated snapshots, not permanent version labels.

## Canonical baseline

- Repository: `ceritaantarkita-req/mainlagi-hub`
- Visibility: Public
- Default/canonical branch: `main`
- Current learning/mastery baseline: `e82acf5d400916bab30ee7611f4db9bb0a8b4d8b`
- Source license: `AGPL-3.0-only`
- Commercial/open-core policy: see `OPEN_CORE.md`, `COMMERCIAL_LICENSE.md`, and `docs/PRODUCT_TIERS_AND_CODE_BOUNDARY.md`.

## Shipped platform shape

Mainlagi is a child-learning platform whose motion/vision engine remains a retained activity runtime rather than the universal learning data model.

Current public core includes:

- five learning subjects: Bahasa Indonesia, English, Matematika, Iqro, and Mewarnai;
- child profiles and local/basic learning progress;
- stage/activity learning registry;
- touch/audio/story/coloring/tracing/matching/motion activity types;
- canonical learning-attempt, skill-evidence, mastery, progression, achievement, and certificate primitives;
- evidence-aware stage access guard;
- parent-facing progress/mastery/report/certificate surfaces;
- Mainlagi World child-facing vertical slice, including Kota Angka, stage progression, rewards, and responsive child navigation;
- ten existing motion games, retained rather than rewritten;
- MediaPipe/browser vision runtime and existing gesture/tracing engines;
- public licensing, security, provenance, and CI controls.

The architectural direction is:

```text
Subject
  -> Stage / learning path
    -> Activity
      -> Activity runtime
         - touch / choice
         - matching
         - tracing
         - coloring
         - listening / story
         - motion game
      -> Learning Attempt
         -> Skill Evidence
            -> Skill Mastery
```

The motion engine is one activity runtime, not the learning-platform data model.

## Learning evidence state

The learning-attempt/mastery foundation is merged into `main`.

Important integrity rule: legacy `completeActivity(...)` events are retained as completion-only attempts but **do not** fabricate assessment score/accuracy and do not create mastery evidence. Existing assessed activities need explicit measurable attempt outcomes before they can advance mastery.

The engine already supports correct/incorrect counts, hints, retries, duration, input mode, anti-replay guards, evidence weighting, mastery bands, progression readiness, and next-best ranking.

The next-best ranking primitive exists, but the child-home quest ribbon has not yet been fully replaced by this ranking everywhere.

See `docs/LEARNING_ATTEMPTS_MASTERY.md`.

## CI and public-repository controls

Primary CI currently provides:

- `Production build`
- `Quality gate (Ubuntu)`
- `Windows compatibility`
- `Production dependency audit`
- `Secret history scan`

The post-merge `main` run for the learning/mastery baseline passed all five code/security gates on 9 September 2026.

The `Protect main` repository ruleset is Active, requires PRs, squash-only merging, conversation resolution, strict/up-to-date status checks, linear history, and blocks deletion/non-fast-forward updates.

Account-level follow-up remains: add `Secret history scan` as a fifth required status check in the ruleset if it has not already been added. The job itself exists and passes in CI.

## Public exposure / asset state

- Full fetched Git history is scanned with pinned Gitleaks in CI using redacted output.
- Public affiliate image redistribution is fail-closed.
- Unverified local affiliate binaries were removed from the current tree.
- New local affiliate imagery requires explicit provenance that permits redistribution.
- Historical Git objects remain historical; removal from the current tree is not a history rewrite.
- Other creative assets still require normal provenance discipline when added or changed.

## Supabase state

The connected Supabase project has been renamed/confirmed as `mainlagihub`.

As observed on 9 September 2026:

- project status is paused/inactive;
- restoring it through the connected Supabase account was rejected because the account has reached the maximum number of active Free projects;
- production migrations `0002_learning_attempt_schema.sql` and `0003_learning_mastery_functions.sql` are therefore still unapplied;
- the repository migrations remain the source of truth and must not be applied to another Supabase project as a workaround.

Production database closure requires freeing one active Free-project slot or upgrading the relevant Supabase capacity, restoring `mainlagihub`, then applying and verifying the migrations.

## Deployment state

The GitHub workflows reference four server-side deployment secrets:

- `MAINLAGI_VPS_HOST`
- `MAINLAGI_VPS_USER`
- `MAINLAGI_VPS_KNOWN_HOSTS`
- `MAINLAGI_VPS_SSH_KEY`

The post-merge `main` run passed every code/security gate but `Deploy V3 production` failed at `Validate deployment secrets` before SSH.

The job log showed all four deployment environment values empty; the first explicit failure was `VPS_HOST is not configured`. SSH configuration and the VPS deployment were skipped.

No secret value is stored in this repository. Restoring those values is an account-level action.

The SSH command intentionally sends a harmless client command; the production design relies on the dedicated VPS key being restricted by an OpenSSH forced command to the server-side Mainlagi deployment script. See `docs/DEPLOYMENT.md`.

## Branch policy

No persistent `develop` branch is used.

Normal lifecycle:

```text
short-lived branch
  -> PR
  -> CI / visual QA when applicable
  -> squash merge
  -> delete branch
  -> main is canonical again
```

See `docs/BRANCH_LIFECYCLE.md`.

## Current engineering priority

The immediate priority is **production closure of the learning-attempt/mastery foundation**, not another feature layer.

Required sequence:

1. resolve Supabase active-Free-project capacity;
2. restore `mainlagihub`;
3. apply migrations `0002` and `0003`;
4. verify tables, RLS, RPC, idempotency, replay guard, mastery materialization, and advisors;
5. restore GitHub Actions deployment secrets;
6. rerun production deployment;
7. verify VPS/public health and learning smoke tests;
8. only then mark learning-attempt/mastery production closure complete.

After production closure, the next product engineering work should focus on explicit measurable activity-result integration, wider adaptive next-best UI integration, and curriculum/content expansion rather than weakening evidence integrity.

## Manual/account-level actions

Items that cannot be completed from repository code are tracked in `docs/ACCOUNT_LEVEL_ACTIONS.md`. Do not mark them complete merely because code/docs exist.
