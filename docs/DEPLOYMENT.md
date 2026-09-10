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

- repository: `ceritaantarkita-req/mainlagi-hub`;
- production branch: `main`;
- build: `npm run build:cloudflare`;
- deploy command: `npx wrangler deploy`;
- Worker: `mainlagi-hub`;
- custom domain: `mainlagihub.my.id`.

Manual local Wrangler deployment is operator fallback only.

## Commit-aware production smoke

Mainlagi bakes release SHA/branch into the server artifact and exposes non-secret release/backend metadata through `/api/health`.

On pushes to `main`, `Production smoke (Cloudflare)` succeeds only when production reports:

- the exact current `github.sha`;
- branch `main`;
- canonical site URL `https://mainlagihub.my.id`;
- backend `supabase`;
- Supabase project ref `estvtgflwkebomsqlolv`.

## Latest verified production implementation

Expansion Batch 7 — Math to 100 is production-complete.

```text
Batch:                 Expansion Batch 7 — Math to 100
Final PR:              #42
Git SHA:               82acd7d39c6cab98f38c92e4f6d7be6afe52cdcd
Main CI run:            #220
Quality gate (Ubuntu):  success
Windows compatibility: success
Mobile route QA:        success
Production build:       success
Dependency audit:       success
Secret history scan:   success
Production smoke:       success
```

The exact-SHA production smoke verified the final Wave D implementation release on the public Cloudflare deployment with the canonical Supabase backend.

Batch 7 wave release sequence:

| Wave | Math | PR | Migration | Main SHA | Exact-SHA smoke |
| --- | ---: | ---: | --- | --- | --- |
| A | 25 | #39 | `0015_batch7_math_wave_a` | `94c21cf84bc809272c93d997b1e994abfc8e9bbb` | success |
| B | 50 | #40 | `0016_batch7_math_wave_b` | `3c2be1bac0c5f15c559bc3f5a4ab099f4fedf53f` | success |
| C | 75 | #41 | `0017_batch7_math_wave_c` | `add22b874174ebbb797461f9a0b8c52fe60f9250` | success |
| D | 100 | #42 | `0018_batch7_math_wave_d` | `82acd7d39c6cab98f38c92e4f6d7be6afe52cdcd` | success |

Detailed Batch 7 evidence is in `EXPANSION_BATCH7_CLOSURE_2026-09-10.md`.

## Repository deployment configuration

- `wrangler.jsonc` — Worker `mainlagi-hub`, `.open-next/worker.js`, `.open-next/assets`, Cloudflare bindings.
- `open-next.config.ts` — OpenNext Cloudflare config.
- `next.config.mjs` — Cloudflare binding initialization and release-metadata baking.
- `src/app/api/health/route.ts` — public/non-secret release/backend health metadata.
- `package.json` — `build:cloudflare`, `preview`, `deploy`, `upload`.

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
0015_batch7_math_wave_a
0016_batch7_math_wave_b
0017_batch7_math_wave_c
0018_batch7_math_wave_d
```

Post-`0018` live catalog verification:

- 127 active learning activities;
- exactly 100 Math activities;
- 120 assessed / 7 practice;
- 37 active learning skills;
- 34 active content packs.

Important boundaries remain unchanged:

- `0007` prevents real-child attempts unless `child_key` resolves to an undeleted account-owned profile; `demo-gian` remains the explicit account-scoped sandbox sentinel;
- `0011` provides scalable content ownership without renaming historical IDs;
- `0012` expands mechanic/evidence vocabulary without fake playable counts;
- `0013`/`0014` establish Batch 6 subjects and eight-subject award scaling;
- `0015`–`0018` add Batch 7 Math content additively while preserving historical learning identity;
- current Iqro packs remain `expert_required`; database/code CI does not equal expert religious-learning approval.

## Post-DDL advisor state

After `0018`:

- performance advisor has **no WARN-level regression**; 19 unused-index observations are INFO-level only;
- security advisor still reports the existing intentional authenticated SECURITY DEFINER exposure for `public.record_learning_attempt(...)` and leaked-password protection disabled under the current Supabase configuration/plan;
- no new Batch 7 security warning was introduced.

## Auth and learning production state

Production supports account login, account-owned child profiles, assessed-attempt persistence, evidence/mastery materialization, parent-derived state, cloud child ownership/isolation, durable offline attempt queuing, and exact-commit health verification.

Practice/completion-only activities cannot manufacture academic mastery. Batch 7 Math additions use measured `choice_accuracy_v1` or `matching_accuracy_v1` evidence contracts.

## Production verification checklist

For every expansion wave/batch:

1. [x] focused branch/PR;
2. [x] full quality/security/build checks before merge;
3. [x] relevant schema migration regression-tested before application;
4. [x] live database counts verified after migration;
5. [x] Cloudflare remains Git-driven from `main`;
6. [x] post-merge smoke verifies exact release SHA and canonical Supabase metadata.

Batch 7 satisfies all six conditions across Waves A–D.

## Manual deployment fallback

Operator fallback only:

```bash
npm run deploy
```

It requires an authorized Cloudflare environment. Never commit Cloudflare API tokens or account credentials.

## Rollback

Rollback the Cloudflare deployment layer to a known-good Git deployment, then rerun public health/smoke verification. For additive catalog migrations, prefer a forward corrective migration rather than destructive rollback of learning history. Do not reintroduce a separate VPS rollback path unless the architecture is intentionally changed and documented through a new ADR.
