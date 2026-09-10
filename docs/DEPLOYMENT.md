# Mainlagi Production Deployment

Last reviewed: 10 September 2026

## Canonical production architecture

```text
GitHub (`ceritaantarkita-req/mainlagi-hub`)
  -> `main`
  -> Cloudflare Git integration / build
  -> OpenNext for Cloudflare Workers
  -> Worker `mainlagi-hub`
  -> https://mainlagihub.my.id/
```

There is **no VPS/SSH production deployment path** for Mainlagi. Previous VPS, `/srv/mainlagi`, SSH deploy-key, `MAINLAGI_VPS_*`, and `mainlagi.inmydraft.com` references are superseded.

## Cloudflare Git deployment

Normal production publication is Cloudflare-side Git integration from branch `main`.

Repository settings for this path:

- repo: `ceritaantarkita-req/mainlagi-hub`;
- production branch: `main`;
- build: `npm run build:cloudflare`;
- deploy command: `npx wrangler deploy`;
- Worker: `mainlagi-hub`;
- custom domain: `mainlagihub.my.id`.

Manual local Wrangler deployment is operator fallback only.

## Commit-aware production smoke

Mainlagi bakes release SHA/branch into the server artifact and exposes non-secret metadata through `/api/health`.

On pushes to `main`, `Production smoke (Cloudflare)` waits for the public release and succeeds only when production reports:

- the exact current `github.sha`;
- branch `main`;
- canonical site URL;
- backend `supabase`;
- Supabase project ref `estvtgflwkebomsqlolv`.

## Latest verified production baseline

Expansion Batch 6 is production-complete.

```text
Batch:                 Expansion Batch 6
PR:                    #37
Git SHA:               466634e0d673893cbe25fae68bfe5e22dad04f0a
Main CI run:            #210
Quality gate (Ubuntu):  success
Windows compatibility: success
Mobile route QA:        success
Production build:       success
Dependency audit:       success
Secret history scan:   success
Production smoke:       success
```

The exact-SHA production smoke completed successfully after the Batch 6 squash merge and verified the public Cloudflare release plus canonical Supabase metadata.

Batch 5 is also production-complete through PR #35 at squash SHA `5164d3b40492531b4ba5654ecc192ab3f8db72d8`.

## Repository deployment configuration

- `wrangler.jsonc` — Worker `mainlagi-hub`, `.open-next/worker.js`, `.open-next/assets`, Cloudflare bindings.
- `open-next.config.ts` — OpenNext Cloudflare config.
- `next.config.mjs` — Cloudflare binding initialization and release-metadata baking.
- `src/app/api/health/route.ts` — public/non-secret release/backend health metadata.
- `package.json` — `build:cloudflare`, `preview`, `deploy`, `upload`.

Canonical URL: `https://mainlagihub.my.id/`.

## GitHub CI responsibilities

GitHub Actions validates; Cloudflare deploys. Primary jobs are:

- `Production build`;
- `Quality gate (Ubuntu)` including engine/learning tests and simulations;
- `Windows compatibility`;
- `Mobile route QA (Chromium)`;
- `Production dependency audit`;
- `Secret history scan`;
- `Production smoke (Cloudflare)` on `main`.

No `MAINLAGI_VPS_*` secrets are required.

## Canonical Supabase dependency

- organization: `inmydraft`
- project: `mainlagi-hub`
- project ref: `estvtgflwkebomsqlolv`
- region: Singapore (`ap-southeast-1`)
- status: active/healthy.

Applied migration chain verified on 10 September 2026:

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
```

Batch 6 DB verification confirms:

- 34 active learning activities;
- 27 assessed / 7 practice;
- 18 active learning skills;
- 16 active content packs;
- subject rows for Bahasa, English, Math, Iqro, Letters, Logic, Science, and Coloring;
- `letters-trace-a` remains completion-only practice rather than fabricated assessed trace evidence;
- the server-owned `all-subjects` award gate is scaled to eight current first-class subjects.

Important boundaries:

- `0007` prevents real-child learning attempts unless `child_key` resolves to an undeleted account-owned `player_profiles` row; `demo-gian` is the explicit account-scoped sandbox sentinel.
- `0011` provides content-pack and activity metadata without renaming historical activity IDs.
- `0012` expands reusable mechanic/evidence vocabularies without adding fake playable activity counts.
- `0013` registers the new Batch 6 subject foundations additively.
- `0014` updates server-owned award catalog scaling.
- current Iqro packs remain `expert_required`; database/code CI is not expert religious-learning approval.

## Post-DDL advisor state

Performance advisor has no WARN-level regression after Batch 6. Current observations are INFO-level unused indexes.

Security advisor still reports two known warnings:

1. authenticated execution of protected SECURITY DEFINER `public.record_learning_attempt(...)`; this is intentional for the canonical authenticated attempt RPC and remains protected by ownership/catalog/anti-farming logic;
2. leaked-password protection disabled on the current Supabase plan; this is an existing accepted plan limitation, not a Batch 6 regression.

## Auth and learning production state

Production architecture supports account login, authenticated assessed-attempt persistence, evidence/mastery materialization, parent-derived state, cloud child ownership/isolation, durable offline attempt queuing, and exact-commit health verification.

A manual create/delete of a brand-new real cloud profile remains useful UX acceptance evidence but is not a schema/deployment blocker.

## Production verification checklist

For every expansion batch:

1. [x] focused branch/PR used;
2. [x] quality/security/build checks run before merge;
3. [x] relevant schema migrations regression-tested before application;
4. [x] Cloudflare production remains Git-driven from `main`;
5. [x] smoke requires exact release SHA and canonical Supabase metadata;
6. [x] public HTTPS homepage/health contract stays part of closure.

Batch 6 satisfies all six closure conditions. Detailed evidence is recorded in `EXPANSION_BATCH6_CLOSURE_2026-09-10.md`.

## Manual deployment fallback

Operator fallback only:

```bash
npm run deploy
```

It requires an authorized Cloudflare environment. Never commit Cloudflare API tokens or account credentials.

## Rollback

Rollback at the Cloudflare deployment layer to a known-good Git deployment, then rerun public health/smoke verification. For additive database vocabulary/content migrations, prefer a forward corrective migration rather than destructive rollback of learning history. Do not introduce a separate VPS rollback path unless the architecture is intentionally changed and documented through a new ADR.
