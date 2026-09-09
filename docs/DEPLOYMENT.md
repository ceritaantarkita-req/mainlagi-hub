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

### Current observed state

On the post-merge `main` run for commit `e82acf5d400916bab30ee7611f4db9bb0a8b4d8b` on 9 September 2026:

- Production build: passed
- Quality gate (Ubuntu): passed
- Windows compatibility: passed
- Production dependency audit: passed
- Secret history scan: passed
- Deploy V3 production: failed at `Validate deployment secrets`

The job log showed the workflow environment variables derived from the four required Actions secrets were empty, and the first explicit failure was:

```text
VPS_HOST is not configured
```

SSH configuration and the actual VPS deployment were skipped. This is a deployment-configuration blocker, not an application build failure.

See `ACCOUNT_LEVEL_ACTIONS.md` for the required repository-settings action.

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

## Supabase dependency for learning-attempt/mastery closure

The connected Supabase project is currently named `mainlagihub`.

As observed on 9 September 2026:

- the project is paused/inactive;
- a restore request was rejected because the account had reached Supabase's maximum active Free-project limit;
- `0002_learning_attempt_schema.sql` and `0003_learning_mastery_functions.sql` have therefore not yet been applied to production.

Do not point Mainlagi migrations at a different Supabase project as a workaround. Resolve the account/project-capacity issue first, restore `mainlagihub`, then apply and verify the committed migrations.

## Verification after blockers are resolved

A successful deployment validation requires more than a green build:

1. `Production build` succeeds.
2. `Quality gate (Ubuntu)` succeeds.
3. `Windows compatibility` succeeds.
4. `Production dependency audit` succeeds.
5. `Secret history scan` succeeds.
6. Mainlagi Supabase project is active.
7. required Supabase migrations are applied and verified.
8. `Validate deployment secrets` succeeds.
9. SSH host/key verification succeeds.
10. the forced server-side deployment command completes successfully.
11. public health succeeds.
12. learning-attempt/mastery production smoke tests succeed for authenticated and local fallback paths.

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
