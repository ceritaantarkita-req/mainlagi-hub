# Account-Level Actions

Last reviewed: 9 September 2026

These actions require repository/account/VPS access that is intentionally not represented by committed source. They must not be marked complete by a code change alone.

## Resolved: canonical Supabase selection and learning migrations

Canonical Mainlagi database is now:

```text
organization: inmydraft
project:      mainlagi-hub
project ref:  estvtgflwkebomsqlolv
region:       ap-southeast-1
```

The duplicate empty Mainlagi-named Supabase project was deleted by the account owner. No learning migration/data had been written to it, so no transfer was required.

The canonical project is active/healthy and migrations `0001` through `0006` are applied. Live RLS, function ACL, catalog, and advisor checks were completed on 9 September 2026.

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

## 2. Enable Supabase Auth leaked-password protection

The Supabase security advisor currently reports **Leaked Password Protection disabled** for canonical `mainlagi-hub`.

In the canonical project, open the Authentication password/security settings and enable leaked-password protection where available for the current plan.

This is an account/project setting, not a SQL migration. Do not weaken authentication settings merely to make an advisor warning disappear.

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
- run learning-attempt/mastery smoke tests.

Do not paste any secret value into an issue, PR, Actions log, screenshot, or repository file.

## 4. Verify production Supabase environment target

Before the next production deploy, confirm the VPS/application environment uses canonical `mainlagi-hub` rather than any deleted/old project.

Verify the configured public Supabase URL/project identity and publishable/anon credential source without publishing secret values. The target project ref should resolve to:

```text
estvtgflwkebomsqlolv
```

Service-role values must remain server-only.

## 5. Production smoke verification

After deployment succeeds:

- verify `/api/health` over public HTTPS;
- authenticate with a controlled test account;
- complete one measurable assessed learning activity;
- confirm exactly one cloud attempt is stored;
- confirm server-canonical subject/stage/runtime values;
- confirm evidence/mastery materializes only when measurable score/accuracy exists;
- confirm replay/idempotency behavior;
- confirm parent report reads the derived state;
- confirm guest/local mode still works without cloud persistence.

Do not use a child's real production learning history as disposable QA data when a controlled test profile can be used.

## 6. Delete merged/superseded remote branches

After all currently active closure work is merged, delete obsolete remote branches in the GitHub Branches UI.

Do not delete `main` or any branch that still has intentionally unmerged work. Keep the current closure branch until its PR is merged.

After cleanup, local clones should use:

```bash
git fetch origin --prune
```

to remove stale remote-tracking references.

## 7. Author-email privacy choice

Published Git history contains the contributor author address used by earlier commits. That is public metadata, not a credential.

If future commits should not expose a personal address, configure Git/GitHub to use the GitHub-provided `noreply` address for future commits. Do not rewrite public history casually just to change old author metadata.

## 8. Repository security settings review

Where supported by the account/repository plan, periodically review:

- Dependabot alerts/updates;
- secret scanning / push protection;
- Private Vulnerability Reporting;
- who may invoke manual deployment workflows;
- production environment approvals and access.

These settings can change independently of source code, so `docs/CURRENT_STATE.md` must not claim they are enabled without verification.
