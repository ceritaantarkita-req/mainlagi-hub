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

The automatic production path is the deploy job inside `ci.yml`.

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

## Canonical Supabase dependency

Canonical production database for Mainlagi:

- organization: `inmydraft`
- project: `mainlagi-hub`
- project ref: `estvtgflwkebomsqlolv`
- region: Singapore (`ap-southeast-1`)
- observed status: healthy/active

The previously observed duplicate/empty Mainlagi-named Supabase project was deleted by the account owner. No learning migration or production data had been written there, so no database transfer was necessary.

Verified migration history on the canonical project:

```text
0001_init
0002_learning_attempt_schema
0003_learning_mastery_functions
0004_learning_rpc_hardening
0005_database_advisor_hardening
0006_private_admin_helper
```

Live database checks confirmed learning RLS, derived-table mutation restrictions, RPC ACLs, catalog rows, and Supabase advisor state. The database portion of the learning-attempt/mastery closure is therefore complete.

Before deployment, verify the production environment's Supabase URL/publishable key target this canonical project. Do not copy secret/service-role values into repository files, issues, PRs, or screenshots.

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

## Verification checklist

A successful deployment validation requires more than a green build:

1. `Production build` succeeds.
2. `Quality gate (Ubuntu)` succeeds.
3. `Windows compatibility` succeeds.
4. `Production dependency audit` succeeds.
5. `Secret history scan` succeeds.
6. canonical Supabase `mainlagi-hub` is active.
7. Supabase migrations `0001–0006` are present.
8. production Supabase environment values point to canonical `mainlagi-hub`.
9. `Validate deployment secrets` succeeds.
10. SSH host/key verification succeeds.
11. the forced server-side deployment command completes successfully.
12. public health succeeds.
13. authenticated learning-attempt/mastery write-path smoke test succeeds.
14. local/guest fallback still works without cloud persistence.

Example public health check:

```bash
curl -fsS https://mainlagi.inmydraft.com/api/health
```

## Supabase advisor follow-up

After migrations `0004–0006`:

- performance advisor has no WARN-level findings; remaining findings are INFO-only legacy/unutilized-index observations;
- security advisor has one intentional warning because `record_learning_attempt` is an authenticated SECURITY DEFINER RPC by design;
- Supabase Auth still reports **Leaked Password Protection disabled**. Enable it from Auth settings before final security closure where the plan supports it.

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
