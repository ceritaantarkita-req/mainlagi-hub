# VBASE-P1-01 Visual Token Closure Candidate — 2026-09-17

Status: **IMPLEMENTATION ACCEPTED ON PR HEAD / LIVE CLOSURE PENDING**

This record documents the evidence for PR #162 before merge. It does **not** mark the merged production baseline P1 count as zero. `main` remains P0=0 / P1=1 until the exact merged SHA passes independent CI and the exact Cloudflare release smoke.

## Scope

PR #162 starts from live-verified `main` `7c863ad2b1887fe0c39557b408b743036128abe1`.

The targeted residual migration covers:

- `/account/profile`;
- `/account/players`;
- `/account/preferences`;
- `/account/security`;
- `/account/delete`;
- `/account/about`;
- canonical not-found system state;
- `/reset-password` added to permanent visual evidence.

The six account subpages now use one scoped `AccountSectionShell` instead of the legacy `fun-home` / `page-shell` composition. Existing account/auth/data components and behavior remain unchanged. The canonical not-found route now uses a scoped Mainlagi system-state presentation while preserving exact HTTP 404 behavior.

Explicitly excluded:

- mass rewrite of `globals.css`;
- admin-only utility styling without proven user-facing leakage;
- game detail/preflight, which remains the existing P2 wave;
- lower-priority discover/leaderboard/legal utility cleanup;
- learning, mastery, evidence, progression, readiness, curriculum, schema or database changes.

## Permanent visual QA expansion

The permanent exact-path matrix is expanded on this PR head from 14 routes / 42 captures to **21 routes / 63 captures** across:

```text
390x844
768x1024
1280x800
```

New permanent routes are all six migrated account subpages plus `/reset-password`.

The existing blocking checks remain intact:

- expected HTTP status;
- exact final pathname;
- meaningful body content;
- `<main>` and top-level heading;
- route-family boundary where applicable;
- no Next.js error overlay;
- no horizontal document overflow;
- no uncaught page errors;
- no unexpected console errors;
- existing child target-floor checks;
- product-specific Parent, Stage, Subject, Public/Auth/Account assertions.

New assertions additionally require the shared account-section marker/panel and readable tablet/desktop geometry on all six migrated subpages, preference button target sizing, reset-password auth mode, and canonical not-found state/CTA.

## Evidence chain

### First implementation pass

CI #779 / run `35131393809` on head `ed6d90030880a5b4a29134f9b91531dec4a599d0` passed the complete PR matrix and produced 51 captures after adding preferences/about/reset-password.

A coverage-gap review found that the older broad route harness does not exercise account subpages. The permanent matrix was therefore strengthened before closure rather than treating that pass as sufficient.

### Full six-subpage coverage

Head `5268ae9da6f6cb6fb3e12fe6b6f61d678ecf7d38` expanded the matrix to 21 routes / 63 captures.

CI #780 / run `35136551735` passed the blocking matrix. Artifact:

```text
name:   mobile-route-qa-screenshots
id:     10464045751
digest: sha256:4d449646d71ffa6675a564253c416e3860650489c1a4ae6bdf8580b52046d743
```

Manifest review verified:

```text
63 / 63 captures
21 canonical routes
3 canonical viewports
60 HTTP 200 captures
3 intentional HTTP 404 captures
0 missing screenshot files
```

Manual screenshot review then found a real presentation defect on `/account/security`: because that route is a content stub with no children, the shared shell rendered an empty white utility card. This was not treated as acceptable merely because automated checks were green.

### Manual-review defect fix

Commit `923635645c164f08e9d26cc84be0b527d0e13ae0` fixes the root cause with an empty-panel visual rule. The DOM marker remains present for deterministic regression coverage, but an empty stub no longer renders a fake card. No security/session behavior or new security feature was added.

CI #781 / run `35137266315` on exact head `923635645c164f08e9d26cc84be0b527d0e13ae0` is the accepted implementation gate:

- Quality gate (Ubuntu): SUCCESS;
- Windows compatibility: SUCCESS;
- Production build: SUCCESS;
- Production dependency audit: SUCCESS;
- Secret history scan: SUCCESS;
- broad Chromium route matrix: SUCCESS;
- permanent 63-capture visual baseline: SUCCESS;
- Cloudflare smoke: skipped on PR by design.

Final #781 artifact:

```text
name:   mobile-route-qa-screenshots
id:     10464427013
digest: sha256:83c8181998c78da4faf1841b17a42b5874c14c00f6e557a736e946575a87e292
```

Manifest review verified again:

```text
63 / 63 captures
21 canonical routes
3 canonical viewports
60 HTTP 200 captures
3 intentional HTTP 404 captures
0 missing screenshot files
```

Manual review of the final artifact confirms the security empty-card defect is gone at 390x844, 768x1024 and 1280x800. Profile, players, preferences, delete, about, reset-password and not-found remain coherent at the same three viewports.

## Closure boundary

This evidence is sufficient to accept the **implementation candidate** for VBASE-P1-01. It is not yet sufficient to change the merged-production status.

Remaining closure sequence:

1. update candidate-facing canonical docs while preserving merged-main P1=1 language;
2. run a fresh exact-head CI after those docs changes;
3. require clean PR scope/review/thread/behind gate;
4. squash-merge exact head;
5. require independent `main` CI success;
6. require exact Cloudflare release smoke success on that merged SHA;
7. only then create the live-closure docs update marking **P0=0 / P1=0** and unblocking Pattern #38 for a fresh objective/evidence audit.

Pattern #38 remains blocked at this candidate stage.