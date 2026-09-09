# Mainlagi Hub — Current State

Last reviewed: 9 September 2026

This file is the canonical human/AI handoff for the current repository state. `main` is the only source of truth. Commit SHAs below are dated snapshots, not permanent version labels.

## Canonical baseline

- Repository: `ceritaantarkita-req/mainlagi-hub`
- Visibility: Public
- Default/canonical branch: `main`
- Learning/mastery + database-hardening baseline: `16f20b22f4a0e99419221f9f2a88b38564bb193d`
- Cloudflare Git auto-deploy validation baseline: `90096246de3ae9b051af03e16a59dbd3bab0368a`
- Source license: `AGPL-3.0-only`
- Commercial/open-core policy: see `OPEN_CORE.md`, `COMMERCIAL_LICENSE.md`, and `docs/PRODUCT_TIERS_AND_CODE_BOUNDARY.md`.

## Canonical production architecture

Production is **not VPS/SSH based**.

Canonical path confirmed on 9 September 2026:

```text
GitHub (`ceritaantarkita-req/mainlagi-hub`)
  -> protected `main`
  -> Cloudflare Git integration / build
  -> OpenNext for Cloudflare Workers
  -> Worker `mainlagi-hub`
  -> https://mainlagihub.my.id/
```

Repository support for this path exists through `@opennextjs/cloudflare`, `open-next.config.ts`, `wrangler.jsonc`, and the Cloudflare build/deploy scripts in `package.json`.

All earlier references to `mainlagi.inmydraft.com`, a Mainlagi VPS deployment, `/srv/mainlagi`, forced-command SSH, or `MAINLAGI_VPS_*` deployment secrets are superseded.

GitHub Actions is the quality/security gate. The production build gate validates the actual OpenNext/Cloudflare artifact; Cloudflare handles publication from the Git-connected `main` branch.

### Auto-deploy validation

Cloudflare Git integration is now empirically validated, not just documented:

- repo: `ceritaantarkita-req/mainlagi-hub`;
- production branch: `main`;
- test merge: PR #14;
- resulting `main` commit: `90096246de3ae9b051af03e16a59dbd3bab0368a`;
- Cloudflare GitHub check: `Workers Builds: mainlagi-hub`;
- Cloudflare Build ID: `29bdf24f-58da-4a94-9011-e7321934dd3c`;
- Cloudflare Version ID: `4cbcd05f-a821-4891-a41e-4706ad14f2e3`;
- result: success.

The public homepage at `https://mainlagihub.my.id/` was observed loading over HTTPS in the browser after the integration was connected. This validates deployment transport, but it does not by itself close auth/learning persistence smoke testing.

See `docs/DEPLOYMENT.md`.

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

The engine supports correct/incorrect counts, hints, retries, duration, input mode, anti-replay guards, evidence weighting, mastery bands, progression readiness, and next-best ranking.

The next-best ranking primitive exists, but the child-home quest ribbon has not yet been fully replaced by this ranking everywhere.

See `docs/LEARNING_ATTEMPTS_MASTERY.md`.

## CI and public-repository controls

Primary CI provides:

- `Production build` — OpenNext/Cloudflare production artifact build;
- `Quality gate (Ubuntu)`;
- `Windows compatibility`;
- `Production dependency audit`;
- `Secret history scan`.

The learning/mastery implementation, database hardening, deployment-architecture correction, and Cloudflare trigger-validation PRs passed the applicable code/security gates before merge.

The stale GitHub Actions VPS deployment job and manual SSH deployment assumptions have been removed from the canonical path.

The `Protect main` repository ruleset is Active, requires PRs, squash-only merging, conversation resolution, strict/up-to-date status checks, linear history, and blocks deletion/non-fast-forward updates.

Account-level follow-up remains: add `Secret history scan` as a fifth required status check in the ruleset if it has not already been added.

## Supabase state

Canonical Mainlagi database:

- Supabase organization: `inmydraft`
- project: `mainlagi-hub`
- project ref: `estvtgflwkebomsqlolv`
- region: `ap-southeast-1` (Singapore)
- observed status: active/healthy

A second, empty/unused Mainlagi-named Supabase project was removed by the account owner. No Mainlagi learning migrations or production data were written to that deleted project, so there was nothing to migrate.

Applied migration history verified on 9 September 2026:

1. `0001_init`
2. `0002_learning_attempt_schema`
3. `0003_learning_mastery_functions`
4. `0004_learning_rpc_hardening`
5. `0005_database_advisor_hardening`
6. `0006_private_admin_helper`

Live verification after migration:

- 12 canonical learning skills;
- 17 canonical learning activities;
- 17 activity-skill mappings;
- all nine new learning tables have RLS enabled;
- normal `anon` / `authenticated` clients cannot directly mutate attempts, evidence, mastery, derived progress, achievements, or certificates;
- `record_learning_attempt` is executable by `authenticated` and `service_role`, not `anon`;
- `recompute_child_skill_mastery` is service-role only;
- activity subject/stage/runtime/assessment are canonicalized from the server catalog before evidence materialization;
- rapid replay protection uses server receipt time;
- completion-only attempts with no measurable score/accuracy do not create mastery evidence.

Supabase advisors after hardening:

- performance advisor: no WARN findings; remaining findings are INFO-only legacy/unutilized-index observations;
- security advisor: one intentional warning for authenticated execution of the SECURITY DEFINER `record_learning_attempt` RPC;
- leaked-password protection remains disabled because it is a Supabase Pro-plan feature while this project is on Free.

Current Free-plan password mitigation confirmed in the dashboard:

- leaked-password protection OFF;
- minimum password length at least 8;
- secure password change ON;
- current password required when updating password ON.

The leaked-password advisor warning is an accepted plan limitation, not a production-closure blocker.

## Production closure state

Database closure is complete. Deployment transport closure is also complete: GitHub `main` successfully triggered a Cloudflare production build/deploy on 9 September 2026.

Completed:

1. [x] remove stale VPS deployment workflows/docs from the canonical architecture;
2. [x] verify Cloudflare Git integration is connected to this repository and production branch `main`;
3. [x] verify a fresh merged `main` commit is observed and successfully deployed by Cloudflare;
4. [x] verify the public homepage loads over HTTPS at `https://mainlagihub.my.id/`.

Remaining application-level closure:

1. [ ] verify Cloudflare production environment points to canonical Supabase project `estvtgflwkebomsqlolv` without exposing secrets;
2. [ ] explicitly verify `https://mainlagihub.my.id/api/health` after the Git-sourced deployment;
3. [ ] run authenticated learning-attempt/mastery write-path smoke test;
4. [ ] verify parent-derived state;
5. [ ] verify guest/local fallback still works.

No `MAINLAGI_VPS_*` GitHub Actions secrets are required.

## Branch policy

No persistent `develop` branch is used.

Normal lifecycle:

```text
short-lived branch
  -> PR
  -> CI / visual QA when applicable
  -> squash merge
  -> Cloudflare deploy from main
  -> delete branch
  -> main is canonical again
```

See `docs/BRANCH_LIFECYCLE.md`.

## Current engineering priority

Finish the remaining application-level production smoke checks for the learning-attempt/mastery foundation. After that, focus on explicit measurable activity-result integration, wider adaptive next-best UI integration, and curriculum/content expansion rather than weakening evidence integrity.

## Manual/account-level actions

Items that cannot be completed from repository code are tracked in `docs/ACCOUNT_LEVEL_ACTIONS.md`.
