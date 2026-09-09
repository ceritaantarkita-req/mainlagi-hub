# Account-Level Actions

Last reviewed: 9 September 2026

These actions require repository/account/Cloudflare access that is intentionally not represented by committed secret values. They must not be marked complete by a code change alone.

## Resolved: canonical Supabase selection and learning migrations

Canonical Mainlagi database is:

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

Expected required-check set:

```text
Production build
Quality gate (Ubuntu)
Windows compatibility
Production dependency audit
Secret history scan
```

## 2. Supabase leaked-password protection — accepted Free-plan limitation

Canonical `mainlagi-hub` is on Supabase Free. Supabase documents leaked-password protection as a Pro-plan feature, so the advisor warning cannot be cleared on the current plan without upgrading.

Current mitigation confirmed in the dashboard:

- leaked-password protection: OFF;
- minimum password length: at least 8;
- secure password change: ON;
- require current password when updating: ON.

This warning is **not a production blocker** on the current plan. Revisit it if the project upgrades to Pro or above.

## 3. Verify Cloudflare Git integration

Canonical production path:

```text
GitHub `ceritaantarkita-req/mainlagi-hub`
  -> protected `main`
  -> Cloudflare Git integration / build
  -> OpenNext Cloudflare Worker `mainlagi-hub`
  -> https://mainlagihub.my.id/
```

In the Cloudflare dashboard, verify:

- repository connection targets `ceritaantarkita-req/mainlagi-hub`;
- production branch is `main`;
- the build uses the repository's OpenNext/Cloudflare configuration;
- the deployed Worker/project is `mainlagi-hub`;
- the custom domain is `mainlagihub.my.id`;
- the latest successful deployment corresponds to the expected `main` commit.

No `MAINLAGI_VPS_*` GitHub Actions secrets are required. Do not create them.

## 4. Verify Cloudflare production environment target

Cloudflare runtime variables must point to canonical Supabase `mainlagi-hub`, project ref:

```text
estvtgflwkebomsqlolv
```

Verify the configured Supabase URL and client-safe publishable/anon key source without exposing secret values. Any service-role/secret credentials must remain server-only.

Do not paste Cloudflare API tokens, Supabase service-role values, or other secret values into issues, PRs, Actions logs, screenshots, or repository files.

## 5. Production smoke verification

After Cloudflare deploys the corrected `main` commit:

- verify `https://mainlagihub.my.id/` over HTTPS;
- verify `https://mainlagihub.my.id/api/health`;
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

Do not delete `main` or any branch that still has intentionally unmerged work.

After cleanup, local clones should use:

```bash
git fetch origin --prune
```

## 7. Author-email privacy choice

Published Git history contains the contributor author address used by earlier commits. That is public metadata, not a credential.

If future commits should not expose a personal address, configure Git/GitHub to use the GitHub-provided `noreply` address for future commits. Do not rewrite public history casually just to change old author metadata.

## 8. Repository / Cloudflare security settings review

Where supported by the relevant plans, periodically review:

- GitHub Dependabot alerts/updates;
- GitHub secret scanning / push protection;
- Private Vulnerability Reporting;
- Cloudflare Git integration permissions;
- Cloudflare production environment variables/secrets;
- Cloudflare custom-domain and deployment history;
- Supabase Auth security settings.

These settings can change independently of source code, so `docs/CURRENT_STATE.md` must not claim they are enabled without verification.
