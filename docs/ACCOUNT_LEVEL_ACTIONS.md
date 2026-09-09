# Account-Level Actions

Last reviewed: 9 September 2026

These actions require repository/account/VPS access that is intentionally not represented by committed source. They must not be marked complete by a code change alone.

## 1. Add the secret-history check to `Protect main`

The CI job `Secret history scan` already exists and is passing. The active ruleset still requires only the four earlier checks.

In GitHub:

1. Open repository **Settings**.
2. Open **Rules -> Rulesets -> Protect main**.
3. Under required status checks, add:

```text
Secret history scan
```

Keep the existing four checks and strict/up-to-date behavior.

Expected required-check set:

```text
Production build
Quality gate (Ubuntu)
Windows compatibility
Production dependency audit
Secret history scan
```

## 2. Restore production deployment secrets

Repository code must never contain the values.

In GitHub **Settings -> Secrets and variables -> Actions**, ensure these repository/environment secrets exist with the correct current values:

```text
MAINLAGI_VPS_HOST
MAINLAGI_VPS_USER
MAINLAGI_VPS_KNOWN_HOSTS
MAINLAGI_VPS_SSH_KEY
```

Recent `main` runs failed closed at `Validate deployment secrets` before SSH because one or more values were unavailable.

After configuration:

- run the manual fallback workflow or allow the next intended `main` deployment;
- confirm secret validation succeeds;
- confirm SSH succeeds;
- confirm the server-side forced deployment command completes;
- verify the public health endpoint.

Do not paste any secret value into an issue, PR, Actions log, screenshot, or repository file.

## 3. Delete merged/superseded remote branches

After all currently active closure work is merged, delete obsolete remote branches in the GitHub Branches UI. Candidate branches from the 9 September audit are:

```text
agent/platform-closure-hardening-20260909
agent/public-open-source-readiness-20260909
docs/mainlagi-learning-platform-ux-spec-20260909
docs/open-core-public-licensing-20260909
feature/mobile-learning-ui-system-20260909
feature/mainlagi-world-vertical-slice-20260909
feature/mainlagi-world-mainline-20260909
security/public-exposure-audit-20260909
security/asset-provenance-remediation-20260909
```

Also delete this governance branch and later learning-foundation branches after their PRs are squash-merged.

Do not delete `main` or any branch that still has intentionally unmerged work.

After cleanup, local clones should use:

```bash
git fetch origin --prune
```

to remove stale remote-tracking references.

## 4. Author-email privacy choice

Published Git history contains the contributor author address used by earlier commits. That is public metadata, not a credential.

If future commits should not expose a personal address, configure Git/GitHub to use the GitHub-provided `noreply` address for future commits. Do not rewrite public history casually just to change old author metadata.

## 5. Repository security settings review

Where supported by the account/repository plan, periodically review:

- Dependabot alerts/updates;
- secret scanning / push protection;
- Private Vulnerability Reporting;
- who may invoke manual deployment workflows;
- production environment approvals and access.

These settings can change independently of source code, so `docs/CURRENT_STATE.md` must not claim they are enabled without verification.
