# Mainlagi Production Deployment

Last reviewed: 9 September 2026

## Canonical production architecture

The canonical production path is:

```text
GitHub (`ceritaantarkita-req/mainlagi-hub`)
  -> protected `main`
  -> Cloudflare Git integration / build
  -> OpenNext for Cloudflare Workers
  -> Worker `mainlagi-hub`
  -> https://mainlagihub.my.id/
```

There is **no VPS/SSH production deployment path** for Mainlagi. Previous documentation and GitHub Actions jobs that referred to a VPS, `/srv/mainlagi`, SSH deploy keys, or `mainlagi.inmydraft.com` were stale and are superseded by this document.

## Cloudflare Git integration validation

The Cloudflare Worker `mainlagi-hub` is connected to GitHub repository `ceritaantarkita-req/mainlagi-hub` with production branch `main`.

A harmless documentation-only validation PR (#14) was merged to `main` on 9 September 2026, producing commit:

```text
90096246de3ae9b051af03e16a59dbd3bab0368a
```

Cloudflare Git integration observed that exact commit and created the GitHub check:

```text
Workers Builds: mainlagi-hub
```

The Cloudflare check completed successfully with:

```text
Build ID:   29bdf24f-58da-4a94-9011-e7321934dd3c
Version ID: 4cbcd05f-a821-4891-a41e-4706ad14f2e3
```

This verifies the automatic production path **GitHub `main` -> Cloudflare build/deploy -> Worker `mainlagi-hub`**. Manual local `wrangler deploy` is no longer the normal release path.

The custom domain `https://mainlagihub.my.id/` was also observed loading over HTTPS in the browser. The Git/deployment layer is therefore validated; application-level closure still requires the health/auth/learning smoke tests listed below.

## Repository deployment configuration

Cloudflare production support is represented in the repository:

- `wrangler.jsonc`
  - worker name: `mainlagi-hub`
  - worker entry: `.open-next/worker.js`
  - static assets: `.open-next/assets`
  - Cloudflare Images binding: `IMAGES`
- `open-next.config.ts`
  - OpenNext Cloudflare configuration
- `next.config.mjs`
  - initializes OpenNext Cloudflare bindings for local development
- `package.json`
  - `npm run build:cloudflare`
  - `npm run preview`
  - `npm run deploy`
  - `npm run upload`

The canonical public URL is:

```text
https://mainlagihub.my.id/
```

## GitHub CI vs production deployment

GitHub Actions is responsible for repository quality/security gates, not for SSH deployment.

The primary workflow `.github/workflows/ci.yml` runs:

- `Production build` — builds the actual OpenNext/Cloudflare production artifact;
- `Quality gate (Ubuntu)`;
- `Windows compatibility`;
- `Production dependency audit`;
- `Secret history scan`.

Production publication is handled by the Cloudflare-side Git integration after the protected `main` branch changes.

No `MAINLAGI_VPS_*` GitHub Actions secrets are required. The obsolete VPS deployment workflow has been removed.

## Cloudflare account-level configuration

Verified on 9 September 2026:

1. Git repository connection points to `ceritaantarkita-req/mainlagi-hub`.
2. Production branch points to `main`.
3. Build command uses `npm run build:cloudflare`.
4. Deploy command uses `npx wrangler deploy`.
5. The deployed Worker/project is `mainlagi-hub`.
6. Custom domain routes production traffic to `https://mainlagihub.my.id/`.
7. A fresh `main` commit was automatically observed and deployed successfully by Cloudflare.

Runtime environment variables/secrets live in Cloudflare and are intentionally not committed as values. Their target must still be verified against the canonical Supabase project without exposing secret values.

## Canonical Supabase dependency

Canonical production database for Mainlagi:

- organization: `inmydraft`
- project: `mainlagi-hub`
- project ref: `estvtgflwkebomsqlolv`
- region: Singapore (`ap-southeast-1`)
- status: active/healthy as verified on 9 September 2026

Verified migration chain:

```text
0001_init
0002_learning_attempt_schema
0003_learning_mastery_functions
0004_learning_rpc_hardening
0005_database_advisor_hardening
0006_private_admin_helper
```

Cloudflare production environment values must point to this canonical Supabase project. Never put service-role/secret credentials in client-exposed variables or repository files.

## Supabase Auth plan limitation

Supabase security advisor reports leaked-password protection disabled. The canonical project is on the Free plan, where Supabase documents leaked-password protection as a Pro-plan feature.

Current Free-plan mitigation:

- leaked-password protection remains OFF;
- minimum password length is set to at least 8;
- secure password change is enabled;
- current password is required when updating password.

The leaked-password advisor finding is therefore an **accepted plan limitation**, not a production-deployment blocker. Revisit it if the project upgrades to Pro or above.

## Production verification checklist

Deployment transport is validated. Remaining application-level closure requires:

1. [x] PR quality/security checks are green before merge to protected `main`.
2. [x] `Production build` passes using `npm run build:cloudflare`.
3. [x] Cloudflare observes a fresh `main` commit and completes its build/deploy successfully.
4. [ ] Cloudflare production environment is verified to point to canonical Supabase `mainlagi-hub` without exposing secret values.
5. [x] `https://mainlagihub.my.id/` loads successfully over HTTPS in the browser.
6. [ ] `https://mainlagihub.my.id/api/health` is explicitly verified after the Git-sourced deployment.
7. [ ] Auth/login is smoke-tested against canonical Supabase.
8. [ ] An authenticated measurable learning attempt writes exactly once to cloud persistence.
9. [ ] Evidence/mastery materialization follows the server-side catalog and replay/idempotency rules in production.
10. [ ] Parent reporting reads the derived state in production.
11. [ ] Guest/local fallback continues to work without cloud persistence.

Example public health check:

```bash
curl -fsS https://mainlagihub.my.id/api/health
```

## Manual deployment fallback

The repository still exposes:

```bash
npm run deploy
```

This runs the OpenNext Cloudflare build and deploy CLI path. It is an operator fallback and requires an authenticated/authorized Cloudflare environment. Do not commit Cloudflare API tokens or account credentials.

Normal production flow is GitHub `main` -> Cloudflare Git integration.

## Rollback

Rollback is performed at the Cloudflare deployment layer by selecting/redeploying a known-good Git commit/deployment, then re-running public health and learning smoke tests.

Do not introduce a separate VPS/Docker rollback path unless the production architecture is intentionally changed and documented through a new architecture decision.
