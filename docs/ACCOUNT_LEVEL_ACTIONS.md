# Account-Level Actions

Last reviewed: 9 September 2026

These actions require repository/account/VPS access that is intentionally not represented by committed source. They must not be marked complete by a code change alone.

## 1. Add the secret-history check to `Protect main`

The CI job `Secret history scan` already exists and is passing. If the active ruleset still requires only the four earlier checks, add it manually.

In GitHub:

1. Open repository **Settings**.
2. Open **Rules -> Rulesets -> Protect main**.
3. Under required status checks, add:

```text
Secret history scan
```

Expected required-check set:

```text
Production build
Quality gate (Ubuntu)
Windows compatibility
Production dependency audit
Secret history scan
```

## 2. Resolve Supabase active-project capacity and restore `mainlagihub`

The connected Supabase project is confirmed as `mainlagihub`, but it is currently paused/inactive.

A restore request on 9 September 2026 was rejected because the account had reached Supabase's maximum number of active Free projects.

Required account-level action:

- either pause/delete an unrelated active Free Supabase project that is genuinely safe to stop; or
- upgrade the relevant Supabase capacity/plan;
- then restore `mainlagihub`.

Do **not** pause another project automatically or apply Mainlagi migrations to another database just to bypass the limit.

After `mainlagihub` becomes active, the repository migrations can be applied and verified:

```text
supabase/migrations/0002_learning_attempt_schema.sql
supabase/migrations/0003_learning_mastery_functions.sql
```

Production closure must verify RLS, RPC access, idempotency, replay/retry guards, mastery materialization, and Supabase security/performance advisors.

## 3. Restore production deployment secrets

Repository code must never contain the values.

In GitHub **Settings -> Secrets and variables -> Actions**, ensure these repository/environment secrets exist with the correct current values:

```text
MAINLAGI_VPS_HOST
MAINLAGI_VPS_USER
MAINLAGI_VPS_KNOWN_HOSTS
MAINLAGI_VPS_SSH_KEY
```

The post-merge `main` run for commit `e82acf5d400916bab30ee7611f4db9bb0a8b4d8b` passed all code/security gates but failed closed at `Validate deployment secrets` before SSH.

The Actions log showed the four workflow environment values empty. The first explicit error was:

```text
VPS_HOST is not configured
```

After configuration:

- rerun the failed production deployment job or use the manual fallback workflow;
- confirm secret validation succeeds;
- confirm SSH succeeds with strict host-key checking;
- confirm the server-side forced deployment command completes;
- verify the public health endpoint;
- run learning-attempt/mastery smoke tests after the Supabase migrations are active.

Do not paste any secret value into an issue, PR, Actions log, screenshot, or repository file.

## 4. Delete merged/superseded remote branches

After all currently active closure work is merged, delete obsolete remote branches in the GitHub Branches UI.

Do not delete `main` or any branch that still has intentionally unmerged work. Keep the current closure/docs branch until its PR is merged.

After cleanup, local clones should use:

```bash
git fetch origin --prune
```

to remove stale remote-tracking references.

## 5. Author-email privacy choice

Published Git history contains the contributor author address used by earlier commits. That is public metadata, not a credential.

If future commits should not expose a personal address, configure Git/GitHub to use the GitHub-provided `noreply` address for future commits. Do not rewrite public history casually just to change old author metadata.

## 6. Repository security settings review

Where supported by the account/repository plan, periodically review:

- Dependabot alerts/updates;
- secret scanning / push protection;
- Private Vulnerability Reporting;
- who may invoke manual deployment workflows;
- production environment approvals and access.

These settings can change independently of source code, so `docs/CURRENT_STATE.md` must not claim they are enabled without verification.
