# VBASE-P1-01 Visual Token Closure — 2026-09-17

Status: **FULLY CLOSED / LIVE VERIFIED**

This record preserves the complete evidence chain for PR #162, from candidate acceptance through merged-production verification.

## Scope

PR #162 started from live-verified `main` `7c863ad2b1887fe0c39557b408b743036128abe1`.

Targeted residual migration:
- `/account/profile`;
- `/account/players`;
- `/account/preferences`;
- `/account/security`;
- `/account/delete`;
- `/account/about`;
- canonical not-found system state;
- `/reset-password` added to permanent visual evidence.

The six account subpages use one scoped `AccountSectionShell` instead of the legacy `fun-home` / `page-shell` composition. Existing account/auth/data behavior remains unchanged. Canonical not-found uses scoped Mainlagi system-state presentation while preserving exact HTTP 404 behavior.

Explicit exclusions remained intact:
- no mass rewrite of `globals.css`;
- no admin-only styling migration without proven user-facing leakage;
- no game detail/preflight P2 work;
- no lower-priority discover/leaderboard/legal cleanup;
- no learning/mastery/evidence/progression/readiness/curriculum/schema/database changes.

## Permanent visual QA expansion

The permanent exact-path matrix was expanded from 14 routes / 42 captures to **21 routes / 63 captures** across:

```text
390x844
768x1024
1280x800
```

New permanent routes are all six migrated account subpages plus `/reset-password`.

Blocking checks include expected HTTP status, exact final pathname, meaningful body, main/H1, route boundary where applicable, no Next.js overlay, no horizontal overflow, no uncaught page errors, no unexpected console errors, existing child/parent/stage/public/auth/account guards, account-section geometry, reset-password auth mode and canonical not-found markers.

## Candidate evidence chain

### CI #779 — first implementation pass

Run `35131393809` on head `ed6d90030880a5b4a29134f9b91531dec4a599d0` passed with 51 captures.

Coverage review found that the older broad route harness does not exercise account subpages, so the permanent matrix was strengthened before closure.

### CI #780 — full six-subpage coverage

Head `5268ae9da6f6cb6fb3e12fe6b6f61d678ecf7d38` expanded the matrix to 21 routes / 63 captures. CI #780 / run `35136551735` passed automated checks.

Artifact:

```text
id:     10464045751
digest: sha256:4d449646d71ffa6675a564253c416e3860650489c1a4ae6bdf8580b52046d743
63 / 63 captures
21 canonical routes
60 HTTP 200
3 intentional HTTP 404
0 missing screenshots
```

Manual screenshot review found a real presentation defect on `/account/security`: the content-stub route rendered an empty white utility card. Automated green status was therefore not treated as sufficient.

### CI #781 — accepted implementation

Commit `923635645c164f08e9d26cc84be0b527d0e13ae0` fixed the empty-card root cause without adding security functionality.

CI #781 / run `35137266315` passed:
- Quality gate (Ubuntu);
- Windows compatibility;
- Production build;
- Production dependency audit;
- Secret history scan;
- broad Chromium route matrix;
- permanent 63-capture visual baseline.

Accepted artifact:

```text
id:     10464427013
digest: sha256:83c8181998c78da4faf1841b17a42b5874c14c00f6e557a736e946575a87e292
63 / 63 captures
21 canonical routes
3 canonical viewports
60 HTTP 200
3 intentional HTTP 404
0 missing screenshots
```

Manual review confirmed the security empty-card defect was gone at 390x844, 768x1024 and 1280x800. Profile, players, preferences, delete, about, reset-password and not-found remained coherent.

### Final candidate-doc CI #787

Candidate canonical docs were added while deliberately keeping merged-production status at P1=1 until post-merge verification.

Exact final PR head:

```text
38b9eb7920d1e6796384b889f928dfcbf4d7e629
```

CI #787 / run `35138385672` passed all PR jobs. Cloudflare was skipped on PR by design.

## Merge and live-production verification

PR #162 merged to `main` as:

```text
2d3f95066e1106c43c76bf91dd29bf5707dca52c
```

Independent `main` CI:

```text
#788 / run 35168877485
```

All jobs succeeded:
- Quality gate (Ubuntu);
- Windows compatibility;
- Production build;
- Production dependency audit;
- Secret history scan;
- Mobile route QA (Chromium), including permanent 63-capture baseline;
- Production smoke (Cloudflare).

The exact Cloudflare step **“Wait for exact Cloudflare release and smoke public endpoints”** succeeded on the merged SHA.

## Final closure result

The production visual checkpoint is therefore legitimately:

```text
P0 findings: 0
P1 findings: 0
P2 findings: 3
VBASE-P1-01: CLOSED / LIVE VERIFIED
```

Pattern #38 is no longer blocked by the visual P1 gate. Its next step is a **fresh objective/evidence audit**; no gameplay family is pre-approved.

`/account/security` remains a stub. This closure does not claim password/session controls exist there.