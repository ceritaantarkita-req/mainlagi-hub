# ADR-0002 — Canonical Production Deployment on Cloudflare

Date: 9 September 2026
Status: Accepted

## Context

Mainlagi repository history accumulated contradictory deployment assumptions. Some current files described a VPS/SSH path and `mainlagi.inmydraft.com`, while the repository already contained active OpenNext/Cloudflare production tooling (`@opennextjs/cloudflare`, `open-next.config.ts`, `wrangler.jsonc`) and the actual production architecture was confirmed by the project owner as GitHub -> Cloudflare -> `https://mainlagihub.my.id/`.

The stale VPS GitHub Actions job caused every `main` workflow run to fail at missing `MAINLAGI_VPS_*` secrets even though those secrets do not belong to the real production architecture.

## Decision

Canonical production architecture is:

```text
GitHub `ceritaantarkita-req/mainlagi-hub`
  -> protected `main`
  -> Cloudflare Git integration / build
  -> OpenNext for Cloudflare Workers
  -> Worker `mainlagi-hub`
  -> https://mainlagihub.my.id/
```

GitHub Actions remains the code/security quality gate. It validates the actual OpenNext/Cloudflare production artifact but does not perform SSH deployment.

Cloudflare owns production publication, runtime environment variables/secrets, deployment history, and the custom domain mapping.

## Consequences

- Remove the obsolete VPS deploy job from `.github/workflows/ci.yml`.
- Remove `.github/workflows/deploy-mainlagi.yml`.
- Do not create or require `MAINLAGI_VPS_HOST`, `MAINLAGI_VPS_USER`, `MAINLAGI_VPS_KNOWN_HOSTS`, or `MAINLAGI_VPS_SSH_KEY`.
- `Production build` must validate `npm run build:cloudflare`.
- Canonical production URL is `https://mainlagihub.my.id/`.
- Cloudflare production environment must target canonical Supabase `inmydraft/mainlagi-hub` (`estvtgflwkebomsqlolv`).
- Manual `npm run deploy` remains an operator fallback for an authenticated Cloudflare environment, not the normal production path.
- Any future change away from Cloudflare requires a new ADR and coordinated code/docs change.

## Superseded assumptions

The following are not current Mainlagi production architecture:

- `mainlagi.inmydraft.com` as the canonical production URL;
- VPS/Docker production for Mainlagi;
- `/srv/mainlagi` deployment root;
- SSH forced-command deployment;
- GitHub Actions VPS deployment secrets.

Historical audit documents may mention those assumptions as historical observations; this ADR takes precedence for current architecture.
