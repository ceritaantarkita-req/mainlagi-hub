# Mainlagi Production Deployment

Last reviewed: 10 September 2026

## Canonical production architecture

```text
GitHub (`ceritaantarkita-req/mainlagi-hub`)
  -> protected `main`
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

Cloudflare Workers Builds provides non-secret Git metadata. Mainlagi bakes the release SHA/branch into the server artifact and exposes them through `/api/health`.

On pushes to `main`, GitHub CI runs `Production smoke (Cloudflare)` after the quality/security jobs. It waits for the public release and succeeds only when production reports the **exact current `github.sha`**, branch `main`, and canonical production backend metadata.

For cloud-learning implementation commit:

```text
7fa7ab7b4642e67343370924e740433fefe8f914
```

verified results:

```text
Cloudflare Build ID:   77e6e799-bd5d-4170-ae2e-8a39876a5c6d
Cloudflare Version ID: e9d879f1-100d-48d6-9142-90f1f51d1912
Workers Builds:        success
Production smoke:      success
```

This proves the exact cloud-profile/ownership release reached production.

## Repository deployment configuration

- `wrangler.jsonc` — Worker `mainlagi-hub`, `.open-next/worker.js`, `.open-next/assets`, Cloudflare bindings.
- `open-next.config.ts` — OpenNext Cloudflare config.
- `next.config.mjs` — Cloudflare binding initialization + release metadata baking.
- `src/app/api/health/route.ts` — public/non-secret release/backend health metadata.
- `package.json` — `build:cloudflare`, `preview`, `deploy`, `upload`.

Canonical URL:

```text
https://mainlagihub.my.id/
```

## GitHub CI responsibilities

GitHub Actions validates; Cloudflare deploys.

Primary jobs:

- `Production build`;
- `Quality gate (Ubuntu)`;
- `Windows compatibility`;
- `Production dependency audit`;
- `Secret history scan`;
- `Production smoke (Cloudflare)` on `main`.

No `MAINLAGI_VPS_*` secrets are required.

## Canonical Supabase dependency

- organization: `inmydraft`
- project: `mainlagi-hub`
- project ref: `estvtgflwkebomsqlolv`
- region: Singapore (`ap-southeast-1`)
- status: active/healthy

Applied migrations verified 10 September 2026:

```text
0001_init
0002_learning_attempt_schema
0003_learning_mastery_functions
0004_learning_rpc_hardening
0005_database_advisor_hardening
0006_private_admin_helper
0007_learning_child_ownership
```

Migration `0007` prevents new real-child learning attempts unless `child_key` resolves to an undeleted `player_profiles` row owned by the same account. `demo-gian` is the explicit account-scoped sandbox sentinel.

Cloudflare production environment is verified by the smoke gate to target the canonical Supabase backend/project metadata without exposing secret values.

## Auth and learning production state

Production validation already demonstrated:

- account login flow in the canonical Supabase project;
- authenticated assessed learning attempts persisted to canonical Supabase;
- evidence/mastery rows materialized;
- parent-facing derived state reflected the learning attempts;
- exact-commit production health verification.

The cloud-profile/ownership release additionally provides:

- cloud child profile list/create/select/soft-delete code path;
- authenticated cloud-only learning reads;
- immediate cloud refresh after successful attempt sync;
- server-side parent auth and child ownership gates;
- direct authenticated child URL ownership gate;
- DB-level attempt child ownership trigger;
- multi-child regression coverage.

A manual create/delete of a brand-new real cloud profile remains useful UX acceptance evidence but is not an unresolved deployment/schema blocker.

## Supabase Auth Free-plan limitation

Leaked-password protection remains unavailable on the current Supabase Free plan. Current mitigation includes minimum password length at least 8, secure password change, and current-password requirement for password updates. This is an accepted plan limitation rather than a deployment blocker.

## Production verification checklist

1. [x] PR quality/security checks green before merge.
2. [x] OpenNext/Cloudflare production build green.
3. [x] Cloudflare observes and deploys fresh `main` commit.
4. [x] Cloudflare runtime metadata points to canonical Supabase project.
5. [x] public HTTPS homepage reachable.
6. [x] exact-commit `Production smoke (Cloudflare)` passes.
7. [x] authenticated learning attempt persistence verified in production.
8. [x] evidence/mastery materialization verified in production.
9. [x] parent-derived learning state observed.
10. [x] cloud-profile/ownership implementation deployed with CI/regression coverage.

## Manual deployment fallback

Operator fallback only:

```bash
npm run deploy
```

It requires an authorized Cloudflare environment. Never commit Cloudflare API tokens or account credentials.

## Rollback

Rollback at the Cloudflare deployment layer to a known-good Git deployment, then rerun public health/smoke verification. Do not introduce a separate VPS rollback path unless architecture is intentionally changed and documented through a new ADR.
