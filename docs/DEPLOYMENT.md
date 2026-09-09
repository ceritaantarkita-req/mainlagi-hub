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

## Current Cloudflare integration validation

As of 9 September 2026, the Cloudflare Worker `mainlagi-hub` is connected to GitHub repository `ceritaantarkita-req/mainlagi-hub` with production branch `main`.

This documentation update intentionally serves as a harmless post-connection trigger to verify that a new push to `main` is observed and built/deployed by Cloudflare Git integration. Production closure must not be declared until a Git-sourced Cloudflare build/deployment is visible and the public smoke checks pass.

## Repository deployment configuration

Cloudflare production support is already represented in the repository:

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

The following settings live in Cloudflare and are intentionally not committed as secret values:

1. Git repository connection points to `ceritaantarkita-req/mainlagi-hub`.
2. Production branch points to `main`.
3. Build command uses `npm run build:cloudflare`.
4. Deploy command uses `npx wrangler deploy`.
5. The deployed Worker/project is `mainlagi-hub`.
6. Custom domain routes production traffic to `https://mainlagihub.my.id/`.
7. Runtime environment variables/secrets needed by Mainlagi are configured in Cloudflare, not committed to Git.

Exact Cloudflare account settings must be verified from the Cloudflare dashboard before calling production deployment fully closed.

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

A deployment/closure verification requires:

1. PR quality/security checks are green before merge to protected `main`.
2. `Production build` passes using `npm run build:cloudflare`.
3. Cloudflare observes the new `main` commit and completes its build/deploy successfully.
4. Cloudflare production environment points to canonical Supabase `mainlagi-hub`.
5. `https://mainlagihub.my.id/` loads successfully over HTTPS.
6. `https://mainlagihub.my.id/api/health` succeeds.
7. Auth/login works against canonical Supabase.
8. An authenticated measurable learning attempt writes exactly once to cloud persistence.
9. Evidence/mastery materialization follows the server-side catalog and replay/idempotency rules.
10. Parent reporting reads the derived state.
11. Guest/local fallback continues to work without cloud persistence.

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

Normal production flow remains GitHub `main` -> Cloudflare Git integration.

## Rollback

Rollback is performed at the Cloudflare deployment layer by selecting/redeploying a known-good Git commit/deployment, then re-running public health and learning smoke tests.

Do not introduce a separate VPS/Docker rollback path unless the production architecture is intentionally changed and documented through a new architecture decision.
