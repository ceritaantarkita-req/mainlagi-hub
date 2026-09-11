# Account-Level Actions

Last reviewed: 11 September 2026

Only actions that genuinely require account/UI access belong here. Secret values must never be committed or pasted into repository issues, logs, docs, screenshots, or chat.

## Canonical production state — resolved

Supabase:

```text
organization: inmydraft
project:      mainlagi-hub
project ref:  estvtgflwkebomsqlolv
region:       ap-southeast-1
```

Applied migrations are verified through `0046_batch14_creative_wave_d.sql`; the canonical migration registry contains Batch 14 `batch14_creative_wave_a` through `batch14_creative_wave_d`.

Production path:

```text
GitHub main
  -> Cloudflare Git integration
  -> OpenNext Worker mainlagi-hub
  -> https://mainlagihub.my.id/
```

Latest verified implementation release before this docs-only closure:

```text
main SHA:            b273edc282261bbec89b0c3d438822204cd925e5
Main CI:             #308
Production smoke:    success, exact SHA
Supabase project:    estvtgflwkebomsqlolv
Playable catalog:    900
```

The exact-commit production smoke verifies non-secret metadata for SHA, branch, canonical site URL, backend `supabase`, and canonical Supabase project ref. Secret values are intentionally not printed.

No `MAINLAGI_VPS_*` GitHub secrets are required. Production is not VPS/SSH based.

## Required manual action: add Secret history scan to Protect main

Current active `Protect main` ruleset inspection on 11 September 2026 shows these required status checks:

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

`Mobile route QA (Chromium)` also runs in CI and is green, but it is not currently listed among the required status checks. This is documented for visibility; the explicit required manual action in this file remains adding `Secret history scan`.

## Accepted platform limitation: Supabase leaked-password protection

The canonical project currently reports leaked-password/HIBP protection disabled. Existing mitigation remains:

- minimum password length at least 8;
- secure password change enabled;
- current password required for password update.

Revisit leaked-password protection when the account/plan supports enabling it. It is not an unresolved application-code blocker for Batch 14 closure.

## Known Supabase security boundary

The security advisor reports authenticated execution of `public.record_learning_attempt(...)` because it is a `SECURITY DEFINER` RPC. This execution path is intentional: the function is the protected server-side attempt-recording boundary and retains ownership/content validation before evidence/mastery updates.

Do not blindly revoke or convert it solely to silence the advisor; any change requires a reviewed replacement that preserves authenticated attempt recording and fail-closed ownership/evidence behavior.

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
- Drawing/Coloring touch-canvas behavior;
- responsive layout and performance.

Do not represent these as completed unless they were actually exercised on the relevant device/browser.

## Branch cleanup

After the final docs closure is merged and its exact-commit production smoke passes, delete merged/superseded remote branches while preserving:

- `main`;
- any intentionally unmerged branch still carrying unique work.

Developer clones can then run `git fetch origin --prune`.

## Periodic account-security review

Where supported by current plans, periodically review:

- required-check ruleset state;
- Dependabot/security alerts;
- secret scanning/push protection;
- Private Vulnerability Reporting;
- Cloudflare Git integration permissions;
- Cloudflare environment variables/secrets;
- Supabase Auth security settings;
- deployment history and custom-domain configuration.

Do not mark an account-level setting enabled merely because repository code references it; verify it in the relevant account UI or API state first.
