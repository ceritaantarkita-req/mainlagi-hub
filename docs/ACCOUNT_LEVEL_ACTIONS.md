# Account-Level Actions

Last reviewed: 10 September 2026

Only actions that genuinely require account/UI access belong here. Secret values must never be committed or pasted into repository issues/logs/docs.

## Resolved: canonical Supabase

```text
organization: inmydraft
project:      mainlagi-hub
project ref:  estvtgflwkebomsqlolv
region:       ap-southeast-1
```

The duplicate empty Mainlagi Supabase project was deleted. Canonical project is active/healthy.

Applied migrations are now `0001` through `0007`, including `0007_learning_child_ownership`.

## Resolved: Cloudflare Git production path

```text
GitHub main
  -> Cloudflare Git integration
  -> OpenNext Worker mainlagi-hub
  -> https://mainlagihub.my.id/
```

Verified:

- repository `ceritaantarkita-req/mainlagi-hub`;
- production branch `main`;
- build `npm run build:cloudflare`;
- deploy `npx wrangler deploy`;
- Worker `mainlagi-hub`;
- custom domain `mainlagihub.my.id`;
- exact-commit Cloudflare deployment checks work;
- `Production smoke (Cloudflare)` verifies the exact SHA and canonical Supabase metadata.

No `MAINLAGI_VPS_*` GitHub secrets are required.

## Resolved: production backend target

The commit-aware production smoke gate verifies non-secret runtime metadata for:

- canonical site URL;
- backend `supabase`;
- canonical Supabase project ref `estvtgflwkebomsqlolv`.

Secret/publishable credential values are intentionally not printed by the health endpoint.

## Resolved: learning/cloud-profile implementation block

Production code now contains:

- cloud child profile list/create/select/soft-delete path;
- authenticated cloud learning-state reads;
- immediate refresh after successful attempt sync;
- multi-child/account ownership regression tests;
- parent server auth gate;
- parent child ownership gate;
- authenticated child direct-URL ownership gate;
- DB-level real-child attempt ownership trigger.

Implementation baseline `7fa7ab7b4642e67343370924e740433fefe8f914` passed Cloudflare deploy and exact-commit production smoke. Migration `0007` is live.

A manual browser create/delete exercise for a brand-new real cloud child is optional UX acceptance evidence, not an account-level configuration blocker.

## 1. Protect-main required checks review

The repository CI currently provides:

```text
Production build
Quality gate (Ubuntu)
Windows compatibility
Production dependency audit
Secret history scan
```

If `Secret history scan` is not yet included in the active `Protect main` ruleset's required checks, add it in GitHub settings. Do not weaken the existing required checks.

## 2. Supabase leaked-password protection — accepted Free-plan limitation

Canonical project is on Supabase Free. Leaked-password protection requires a higher plan and therefore remains OFF.

Current mitigation confirmed:

- minimum password length at least 8;
- secure password change ON;
- current password required for password update ON.

Revisit only if the project upgrades plans; this is not a current closure blocker.

## 3. Optional UX acceptance: real cloud child profile

For additional human/browser evidence, use a controlled test account/profile rather than a child's real history:

1. log in;
2. create a new child through `/child/select`;
3. verify it appears after reload/another browser session;
4. complete a measurable activity;
5. verify Parent Progress updates from cloud;
6. soft-delete the disposable test profile.

This is acceptance evidence, not a missing backend implementation step.

## 4. Merged branch cleanup

After active work is merged, delete superseded remote feature/docs branches. Never delete `main` or an intentionally unmerged branch.

Local clones can then run:

```bash
git fetch origin --prune
```

## 5. Author-email privacy choice

Published Git history may contain author addresses from earlier commits. This is public metadata, not a credential. Configure a GitHub `noreply` author address for future commits if preferred; do not casually rewrite public history.

## 6. Periodic account-security review

Where supported by the current plans, periodically review:

- GitHub Dependabot/security settings;
- secret scanning/push protection;
- Private Vulnerability Reporting;
- Cloudflare Git integration permissions;
- Cloudflare environment variables/secrets;
- custom-domain/deployment history;
- Supabase Auth security settings.

Do not mark an account-level feature enabled merely because repository code references it; verify it in the relevant account UI first.
