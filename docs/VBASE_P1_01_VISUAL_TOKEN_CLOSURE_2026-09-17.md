# VBASE-P1-01 Visual Token Closure — 2026-09-17

Status: **FULLY CLOSED / LIVE VERIFIED**  
Repository: `ceritaantarkita-req/mainlagi-hub`  
Production: `https://mainlagihub.my.id/`

## Result

The residual visual-token fragmentation P1 is closed on production.

```text
P0 findings: 0
P1 findings: 0
P2 findings: 3
active merged gameplay patterns: 37
Pattern #38: UNBLOCKED FOR FRESH OBJECTIVE/EVIDENCE AUDIT ONLY
```

This closure does **not** mean every visual cleanup item is finished. The three existing P2 findings remain open, external physical-device/accessibility/human-art/Iqro evidence remains separate, and Pattern #38 has not been selected or implemented.

## Scope closed by PR #162

PR #162 targeted only evidenced user-facing residual drift:

- `/account/profile`;
- `/account/players`;
- `/account/preferences`;
- `/account/security`;
- `/account/delete`;
- `/account/about`;
- canonical not-found system state;
- permanent visual coverage for `/reset-password` and every migrated account subpage.

The six account subpages now use one scoped Mainlagi family account-section shell. Canonical not-found uses a scoped Mainlagi system-state presentation instead of the legacy generic dialog / old blue-primary cluster.

Explicitly preserved:

- existing account component data operations;
- Supabase auth/session/recovery/callback behavior;
- signed-in/signed-out route behavior;
- known-child fast resume;
- learning/mastery/evidence/progression/readiness/content semantics;
- curriculum/schema/database contracts.

`/account/security` remains a stub. No password/session feature was invented by this visual pass.

Admin-only utility styling was not mass-migrated, and `globals.css` was not rewritten for token purity.

## Permanent visual QA strengthening

The permanent exact-path baseline is now live at:

```text
21 canonical routes
3 canonical viewports
63 exact-path screenshots per run
390x844
768x1024
1280x800
```

Coverage includes public, child, Parent Report, account root, all six account subpages, auth/recovery, deterministic auth error and canonical not-found.

Blocking assertions continue to cover exact path/status, meaningful main/H1 output, route boundary where applicable, framework overlay absence, no horizontal overflow, no uncaught page errors, no unexpected console errors, child touch target floors, and product-specific Parent/Stage/Public/Auth/Account/System guards.

## Acceptance history

### Implementation acceptance

Accepted implementation head before candidate documentation:

```text
923635645c164f08e9d26cc84be0b527d0e13ae0
```

CI #781 / run `35137266315` passed the complete PR matrix.

Accepted PR artifact:

```text
name: mobile-route-qa-screenshots
id: 10464427013
digest: sha256:83c8181998c78da4faf1841b17a42b5874c14c00f6e557a736e946575a87e292
captures: 63 / 63
routes: 21
status: 60 x HTTP 200 + 3 intentional HTTP 404
missing screenshots: 0
```

### Negative evidence that changed the implementation

CI #780 was structurally green but manual screenshot review exposed a large empty utility card on the `/account/security` stub. That was treated as a real product defect rather than waived.

Commit `923635645c164f08e9d26cc84be0b527d0e13ae0` removed the false empty-card presentation while preserving the stub route and deterministic account-section marker. CI #781 and manual 390/768/1280 review then confirmed the defect was gone.

This remains the precedent that `no overflow` and green structure checks are necessary but not sufficient for visual acceptance.

## Candidate-doc gate and merge

Final PR #162 candidate-doc head:

```text
38b9eb7920d1e6796384b889f928dfcbf4d7e629
```

Fresh exact-head PR CI:

```text
#787 / run 35138385672 — full success
Cloudflare smoke — skipped on PR by design
```

Clean merge gate verified:

- mergeable: true;
- behind main: 0;
- changed files: 17, all scoped to account/system visual work, permanent visual QA and canonical docs;
- comments: 0;
- submitted reviews: 0;
- review threads: 0.

Squash merge:

```text
PR: #162
main SHA: 2d3f95066e1106c43c76bf91dd29bf5707dca52c
```

## Independent production verification

Independent merged-main CI:

```text
#788 / run 35168877485 — full success
```

Successful jobs included:

- Quality gate (Ubuntu);
- Windows compatibility;
- Production build;
- Production dependency audit;
- Secret history scan;
- Mobile route QA (Chromium), including broad route QA and permanent 63-capture visual baseline;
- Production smoke (Cloudflare).

The exact Cloudflare release step:

```text
Wait for exact Cloudflare release and smoke public endpoints — SUCCESS
```

Merged-main visual artifact:

```text
name: mobile-route-qa-screenshots
id: 10476008006
digest: sha256:6fe0aa3de9bfadfc8e40229948edaca1cf633b33705a429515779b78f077266c
head SHA: 2d3f95066e1106c43c76bf91dd29bf5707dca52c
```

The production SHA therefore passed the same strengthened 21-route / 63-capture gate before exact Cloudflare release smoke completed.

## Canonical checkpoint after closure

The visual P1 checkpoint is now complete:

```text
P0 = 0
P1 = 0
P2 = 3
```

All five baseline P1 findings are closed and live verified.

This unblocks WS-05 only for the next required step: a **fresh objective/evidence audit for Pattern #38**. The audit must choose a mechanic from the learning need and evidence contract; it may also conclude that no proposed mechanic is justified yet. No gameplay family is pre-approved by this visual closure.

The merged pattern count remains **37** until a future Pattern #38 implementation independently satisfies its own regression, evidence/progression, responsive, visual and production gates.

## Remaining independent work

Still open after this closure:

- VBASE-P2-01 game detail/preflight vocabulary convergence;
- VBASE-P2-02 canonical semantic icon convergence;
- VBASE-P2-03 inline visual-style technical cleanup;
- WS-02 narration;
- WS-10 external physical-device/accessibility/human acceptance;
- Iqro expert review (`expert_required`, not `expert_approved`);
- WS-11 governance;
- later WS-12 technical cleanup;
- WS-05 continuation toward 50–60 meaningful gameplay patterns after the fresh Pattern #38 audit.

The P1 visual checkpoint is closed; these remaining items must not be rewritten as already completed.