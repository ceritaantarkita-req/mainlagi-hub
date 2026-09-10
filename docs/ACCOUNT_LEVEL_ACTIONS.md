# Account-Level Actions

Last reviewed: 10 September 2026

Only actions that genuinely require account/UI access belong here. Secret values must never be committed or pasted into repository issues, logs, docs, screenshots, or chat.

## Canonical production state — resolved

Supabase:

```text
organization: inmydraft
project:      mainlagi-hub
project ref:  estvtgflwkebomsqlolv
region:       ap-southeast-1
```

Applied migrations are verified through `0010_legacy_fk_indexes`.

Production path:

```text
GitHub main
  -> Cloudflare Git integration
  -> OpenNext Worker mainlagi-hub
  -> https://mainlagihub.my.id/
```

Verified engineering release baseline before this docs-only closure:

```text
main SHA:            771409b04a5ea626f6dfc68d1265197492e0263e
Cloudflare Build:    01a94875-f9c8-4b1f-ad89-9824a14fdbc5
Cloudflare Version:  2f9a60e6-6571-494d-bfd5-ce9847454d9c
Production smoke:    success
Supabase project:    estvtgflwkebomsqlolv
```

The exact-commit production smoke verifies non-secret metadata for SHA, branch, canonical site URL, backend `supabase`, and canonical Supabase project ref. Secret values are intentionally not printed.

No `MAINLAGI_VPS_*` GitHub secrets are required. Production is not VPS/SSH based.

## Required manual action: add Secret history scan to Protect main

Current active `Protect main` ruleset inspection shows these required status checks:

1. `Production build`
2. `Quality gate (Ubuntu)`
3. `Windows compatibility`
4. `Production dependency audit`

The CI workflow also runs `Secret history scan`, and the scan is passing, but it is **not yet mandatory in the ruleset**.

In GitHub repository settings, edit the active `Protect main` ruleset and add:

```text
Secret history scan
```

Do not remove or weaken any existing required check.

This action cannot be performed through the connected GitHub API surface used for this closure because repository-ruleset administration writes are not exposed there.

## Accepted platform limitation: Supabase leaked-password protection

The canonical project is on Supabase Free. Leaked-password/HIBP protection remains unavailable on the current plan.

Existing mitigation previously confirmed:

- minimum password length at least 8;
- secure password change enabled;
- current password required for password update.

Revisit this only if plan capability changes. It is not an unresolved application-code blocker.

## Optional human/device acceptance

These are useful acceptance exercises, not missing backend implementation:

### Real cloud child browser exercise

1. Sign in with a controlled test account.
2. Create a disposable child profile through `/child/select`.
3. Reload or open another browser session and confirm the profile remains available.
4. Complete a measurable activity.
5. Confirm Parent Progress/Report reflects cloud state.
6. Soft-delete the disposable profile.

### Offline reconciliation exercise

1. Sign in with a controlled test account.
2. Go offline after the app is loaded.
3. Complete a measurable activity.
4. Confirm the attempt remains visible as pending/local history rather than disappearing.
5. Return online.
6. Confirm the durable account-bound outbox reconciles the attempt to cloud state.

### Physical-device QA

Periodically test representative phones/tablets/laptops for:

- camera/gesture behavior;
- touch targets;
- keyboard/screen-reader behavior where applicable;
- TTS/listening fallback;
- responsive layout and performance.

Do not represent these as completed unless they were actually exercised on the relevant device/browser.

## Branch cleanup

After the final docs closure is merged and its exact-commit production smoke passes, delete merged/superseded remote branches while preserving:

- `main`;
- any intentionally unmerged branch still carrying unique work.

Developer clones can then run `git fetch origin --prune`.

## Periodic account-security review

Where supported by the current plans, periodically review:

- required-check ruleset state;
- Dependabot/security alerts;
- secret scanning/push protection;
- Private Vulnerability Reporting;
- Cloudflare Git integration permissions;
- Cloudflare environment variables/secrets;
- Supabase Auth security settings;
- deployment history and custom-domain configuration.

Do not mark an account-level setting enabled merely because repository code references it; verify it in the relevant account UI or API state first.
