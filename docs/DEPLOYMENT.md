# Mainlagi Production Deployment

Last reviewed: 9 September 2026

## Production target

The repository currently documents the production application at `https://mainlagi.inmydraft.com` with the server-side deployment root under `/srv/mainlagi`.

Do not put production credentials, private keys, secret values, or service-role tokens in this file.

## GitHub workflow paths

There are two deployment entry points:

1. `.github/workflows/ci.yml`
   - runs quality/security gates for PRs and pushes;
   - its production deployment job runs only on a push to `main` after prerequisite jobs succeed.
2. `.github/workflows/deploy-mainlagi.yml`
   - manual `workflow_dispatch` fallback;
   - uses the same dedicated SSH credential boundary.

The old statement that every `main` push directly runs `deploy-mainlagi.yml` is no longer correct; the automatic path is the deploy job inside `ci.yml`.

## Required Actions secrets

Both deployment paths require:

```text
MAINLAGI_VPS_HOST
MAINLAGI_VPS_USER
MAINLAGI_VPS_KNOWN_HOSTS
MAINLAGI_VPS_SSH_KEY
```

The workflows validate that these values are non-empty before configuring SSH.

As observed on 9 September 2026, recent `main` runs passed the application/security gates but the production job failed at `Validate deployment secrets` before SSH because one or more required values were unavailable to the job. This is a deployment-configuration blocker, not an application build failure.

See `ACCOUNT_LEVEL_ACTIONS.md` for the manual repository-settings step.

## Dedicated SSH / forced-command design

The repository workflow intentionally invokes SSH with a harmless client command (`true`). The documented production design relies on the corresponding public key on the VPS being restricted with an OpenSSH **forced command** so the key can execute only the Mainlagi server-side deployment entry point (documented as `/srv/mainlagi/deploy.sh`) rather than obtaining an unrestricted shell.

With a correctly configured forced command, the server ignores the client-supplied `true` command and runs the restricted deployment command instead.

This boundary must be verified on the VPS. Repository source alone cannot prove that the current `authorized_keys` entry still has the intended forced-command restriction.

## SSH hardening in the workflows

The current workflows:

- use a dedicated temporary key file on the runner;
- validate that the private key can be parsed;
- require `StrictHostKeyChecking=yes`;
- use an explicitly supplied `known_hosts` file;
- use batch/identity-only SSH behavior;
- remove the temporary private-key file in an `always()` cleanup step.

Do not replace host-key verification with `StrictHostKeyChecking=no` to work around configuration problems.

## Intended server-side deployment sequence

The documented `/srv/mainlagi/deploy.sh` design is expected to:

1. acquire an exclusive deployment lock;
2. require a clean server checkout;
3. fast-forward the server checkout from canonical `main`;
4. build a SHA-addressed Mainlagi image;
5. health-check a candidate before switching production;
6. update only the Mainlagi service/image selection;
7. verify container and public HTTPS health;
8. roll back to the previous known-good image if the switch fails.

It should not use broad Docker prune operations or destructive Git reset/clean behavior as part of normal deployment.

Because the server script is outside the public repository execution surface used in this audit, the current VPS implementation must be checked directly before claiming production deployment is fully verified.

## Verification after secrets are restored

A successful deployment validation requires more than a green build:

1. `Production build` succeeds.
2. `Quality gate (Ubuntu)` succeeds.
3. `Windows compatibility` succeeds.
4. `Production dependency audit` succeeds.
5. `Secret history scan` succeeds.
6. `Validate deployment secrets` succeeds.
7. SSH host/key verification succeeds.
8. the forced server-side deployment command completes successfully.
9. public health succeeds.

Example public health check:

```bash
curl -fsS https://mainlagi.inmydraft.com/api/health
```

## VPS diagnostics

From an authorized VPS shell, use narrow Mainlagi-specific checks rather than broad host cleanup commands:

```bash
sudo docker ps --filter "name=mainlagi-web" \
  --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'

sudo docker inspect mainlagi-web \
  --format 'Status={{.State.Status}} Health={{.State.Health.Status}} RestartCount={{.RestartCount}}'

sudo docker logs --tail=100 mainlagi-web
```

Do not publish private VPS usernames, IP addresses, SSH keys, `.env` contents, or secret values in issues/PRs/screenshots.

## Rollback

Rollback should select a known-good retained Mainlagi image and recreate only the Mainlagi service, followed by container and public health verification. Do not use `docker system prune` as part of rollback or routine deployment.
