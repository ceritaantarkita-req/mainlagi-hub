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

Repository settings validated for this path:

- repo: `ceritaantarkita-req/mainlagi-hub`;
- production branch: `main`;
- build: `npm run build:cloudflare`;
- deploy command: `npx wrangler deploy`;
- Worker: `mainlagi-hub`;
- custom domain: `mainlagihub.my.id`.

Manual local Wrangler deployment is only an operator fallback.

## Commit-aware production smoke

Mainlagi bakes release SHA/branch into the server artifact and exposes non-secret metadata through `/api/health`. On pushes to `main`, `Production smoke (Cloudflare)` waits for the public release and succeeds only when production reports the exact current `github.sha`, branch `main`, canonical site URL, backend `supabase`, and project ref `estvtgflwkebomsqlolv`.

Latest fully verified production baseline before Batch 5 merges:

```text
Batch:                 Expansion Batch 4
Git SHA:               923315882f7244f24a2045398a061d12a2b472cf
Cloudflare Build ID:   0b98b636-b17a-4e64-902b-7b2b958b1e3f
Cloudflare Version ID: 5559c169-20db-448d-8162-029146ddb4bf
Workers Builds:        success
Production smoke:      success
```

This exact release contains the scalable content-pack architecture and migration `0011` compatibility code. Batch 5 final production SHA must be taken from its squash merge and exact-SHA smoke; it is intentionally not guessed inside the pre-merge branch.

## Repository deployment configuration

- `wrangler.jsonc` — Worker `mainlagi-hub`, `.open-next/worker.js`, `.open-next/assets`, Cloudflare bindings.
- `open-next.config.ts` — OpenNext Cloudflare config.
- `next.config.mjs` — Cloudflare binding initialization + release metadata baking.
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

Applied migrations verified after Batch 4:

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
```

Important current boundaries:

- `0007` prevents new real-child learning attempts unless `child_key` resolves to an undeleted account-owned `player_profiles` row; `demo-gian` is the explicit account-scoped sandbox sentinel.
- `0011` creates `learning_content_packs` and adds pack/lesson/mechanic/evidence/revision metadata without renaming historical activity IDs. Live verification found 13 packs and 25/25 repository activities fully registered.
- Current Iqro packs remain `expert_required`; database/code CI does not equal expert religious-learning review.
- Batch 5 migration `0012_reusable_mechanic_library` expands only the allowed mechanic/evidence vocabularies. It must be applied and verified during Batch 5 release closure before that batch is called production-complete.

Cloudflare production environment is verified by smoke to target the canonical Supabase backend/project metadata without exposing secret values.

## Auth and learning production state

Production validation has demonstrated account login, authenticated assessed attempt persistence, evidence/mastery materialization, parent-derived state, cloud child ownership/isolation, durable offline attempt queuing, and exact-commit health verification.

A manual create/delete of a brand-new real cloud profile remains useful UX acceptance evidence but is not an unresolved deployment/schema blocker.

## Supabase Auth Free-plan limitation

Leaked-password protection remains unavailable on the current Supabase Free plan. Existing mitigation includes minimum password length at least 8, secure password change, and current-password requirement for password updates. This is an accepted plan limitation rather than a deployment blocker.

## Production verification checklist

For every expansion batch:

1. [x] focused branch/PR used;
2. [x] quality/security/build checks required before merge;
3. [x] relevant schema migration regression-tested before application;
4. [x] Cloudflare production remains Git-driven from `main`;
5. [x] smoke requires exact release SHA and canonical Supabase metadata;
6. [x] public HTTPS homepage/health contract stays part of closure.

Batch-specific migration application and exact-SHA smoke are recorded only after they actually happen.

## Manual deployment fallback

Operator fallback only:

```bash
npm run deploy
```

It requires an authorized Cloudflare environment. Never commit Cloudflare API tokens or account credentials.

## Rollback

Rollback at the Cloudflare deployment layer to a known-good Git deployment, then rerun public health/smoke verification. For additive DB vocabulary migrations, prefer a forward corrective migration rather than destructive rollback of learning history. Do not introduce a separate VPS rollback path unless architecture is intentionally changed and documented through a new ADR.
