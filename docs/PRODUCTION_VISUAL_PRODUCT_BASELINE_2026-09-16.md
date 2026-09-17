# Production Visual / Product Baseline Audit — 2026-09-16

Last updated: **17 September 2026**  
Status: **MERGED MAIN P0=0 / P1=1 / P2=3; FINAL P1 IMPLEMENTATION CANDIDATE ACCEPTED ON PR #162; LIVE CLOSURE PENDING; PATTERN #38 BLOCKED**  
Canonical production: `https://mainlagihub.my.id/`

## Verified closure chain

- baseline checkpoint: `d3d600ed92e78d30da8172e0bdb300119990614f`
- permanent VQA foundation: PR #156 -> `9269e9fd576004d7d91fbd840e8c752acc7a5aae`, CI #751 including exact Cloudflare smoke
- VUI-01 Parent Report: PR #157 -> `e212002eafef77a37a220834c6263e433cf9acbb`, CI #758
- VUI-02 Stage/Gallery: PR #158 -> `fe260ba7a239586ca2362fbabfca3e0a5019d453`, CI #764
- VUI-03 Public/Auth/Account: PR #160 -> `415008a4a0503da98937ee8df0a1e5feb1a08c62`, CI #776 / run `35124809180` including exact Cloudflare release smoke
- VUI-03 docs/live baseline: PR #161 -> `7c863ad2b1887fe0c39557b408b743036128abe1`, CI #778 / run `35130270215` including exact Cloudflare release smoke

## Current merged-production result

```text
P0 findings: 0
P1 findings: 1
P2 findings: 3
Garden representative activities: ACCEPTED anchor
Permanent visual QA: CLOSED / BLOCKING
Parent Report VUI-01: CLOSED / LIVE VERIFIED
Stage/Gallery VUI-02: CLOSED / LIVE VERIFIED
Public/Auth/Account VUI-03: CLOSED / LIVE VERIFIED
VBASE-P1-01 implementation: ACCEPTED ON PR #162 / LIVE CLOSURE PENDING
Whole-product visual acceptance: NOT YET ACCEPTED
Pattern #38: BLOCKED
```

The remaining merged-main P1 is not a statement that the PR #162 implementation failed. It reflects release discipline: production status does not move to zero before exact merged-main CI and Cloudflare verification.

## P1 findings

### VBASE-P1-01 — visual-token fragmentation — IMPLEMENTATION CANDIDATE ACCEPTED / LIVE CLOSURE PENDING

The highest-risk child, parent, stage, public, auth and account-root surfaces were already converged in VUI-01/02/03. PR #162 targets the residual user-facing family/system drift rather than performing a one-shot rewrite of `globals.css`.

Candidate migration:
- `/account/profile`;
- `/account/players`;
- `/account/preferences`;
- `/account/security`;
- `/account/delete`;
- `/account/about`;
- canonical not-found system state;
- `/reset-password` added to permanent visual evidence.

The six account subpages now use one scoped family account-section shell. Existing `ProfileEditor`, `PlayerProfiles`, `Preferences`, delete-account logic, auth/session behavior and route semantics remain unchanged. `/account/about` copy remains unchanged. `/account/security` remains a stub; no password/session functionality is invented.

The not-found route now uses scoped Mainlagi system-state styling while retaining exact HTTP 404 behavior and the canonical return-home action.

Admin-only utility styling is still evaluated separately and is not automatically a product P1. Game detail/preflight remains P2. Discover/leaderboard/legal utility cleanup remains lower priority and must not be pulled into the P1 wave merely for token purity.

#### Candidate evidence

Accepted implementation head before candidate-doc commits:

```text
923635645c164f08e9d26cc84be0b527d0e13ae0
```

Accepted implementation CI:

```text
#781 / run 35137266315 — full PR success
Cloudflare smoke — skipped on PR by design
```

Final accepted artifact:

```text
name:   mobile-route-qa-screenshots
id:     10464427013
digest: sha256:83c8181998c78da4faf1841b17a42b5874c14c00f6e557a736e946575a87e292
63 / 63 captures
21 canonical routes
3 canonical viewports
60 HTTP 200
3 intentional HTTP 404
0 missing screenshots
```

The permanent candidate matrix is now **21 routes × 3 viewports = 63 exact-path screenshots** at 390x844, 768x1024 and 1280x800. It explicitly covers all six migrated account subpages, reset-password and canonical not-found.

A useful negative result occurred during acceptance: CI #780 was structurally green, but manual screenshots exposed a large empty utility card on the security stub. That presentation defect was fixed at `92363564...`; #781 then passed the full matrix and final manual review confirmed the card was gone at all three canonical viewports. The gate was strengthened rather than relaxed.

Full evidence record: `VBASE_P1_01_VISUAL_TOKEN_CANDIDATE_2026-09-17.md`.

#### Remaining closure requirement

1. candidate canonical docs must pass fresh exact-head PR CI;
2. clean PR gate: mergeable, behind=0, intended scope, no unresolved comments/reviews/threads;
3. squash-merge exact PR head;
4. independent `main` CI must fully succeed;
5. exact Cloudflare release smoke must succeed on that merged SHA;
6. only then update the live baseline to **P0=0 / P1=0**.

Pattern #38 remains blocked until that sequence is complete.

### VBASE-P1-02 — parent-report density and internal jargon — CLOSED

Closed by PR #157. Primary parent copy is family-facing; technical vocabulary remains behind diagnostic disclosure; permanent VQA guards the primary copy layer.

### VBASE-P1-03 — stage/readiness hierarchy — CLOSED

Closed by PR #158. Stage hero/readiness/lesson composition and subject journey use available tablet/desktop width without changing readiness, progression, activity order, recommendation source, mastery or completion semantics.

### VBASE-P1-04 — public/adult root information architecture — CLOSED

Closed by PR #160 and independently live verified on `main` `415008a4a0503da98937ee8df0a1e5feb1a08c62`.

Accepted outcome:
- clean-session `/` is an explicit family/public entry;
- valid remembered child still uses the existing fast-resume path;
- child-start and parent/account routes are distinct;
- camera-based movement play is described as optional without unsupported privacy claims;
- `/login`, `/signup`, `/forgot-password`, `/reset-password` and `/auth/callback` use one scoped family auth shell;
- `/account` uses scoped family presentation;
- Supabase/session/recovery/redirect semantics are unchanged.

### VBASE-P1-05 — permanent whole-product visual coverage gap — CLOSED

PR #156 established the original blocking matrix at 14 canonical surfaces / 42 exact-path screenshots. PR #162 strengthens that permanent evidence on its candidate head to 21 canonical routes / 63 exact-path screenshots so every residual migrated account route is covered rather than relying on the older broad harness.

## P2 findings

### VBASE-P2-01 — games detail/preflight legacy vocabulary

Dark camera runtime can remain where functionally useful, but surrounding game detail/preflight metadata/navigation should converge after P1 closure.

### VBASE-P2-02 — iconography mixes canonical symbols and raw emoji

Emoji may remain decorative/content-level; permanent navigation/status semantics should prefer `LearningSymbol` / `Icon`.

### VBASE-P2-03 — inline visual styles increase drift risk

Some learning/parent surfaces retain inline visual values. Technical cleanup follows P1 closure and should not destabilize accepted behavior.

## Accepted anchor rules

- Garden activity framing is the child-facing reference.
- Mainlagi wordmark, cream paper, navy ink, green primary CTA, sky/sage support surfaces and character artwork are the default product vocabulary.
- Visual fixes must not alter activity answers, evidence, mastery, progression, readiness or auth/session behavior merely to simplify screenshots.
- Known-child fast resume is a product contract, not a visual defect.
- A green `no overflow` check is insufficient if a layout remains visibly cramped, clipped or wasteful.
- Manual screenshot review remains mandatory for changed family/system surfaces; #780 is the concrete precedent.
- Admin utility styling is evaluated separately from public/child/parent product surfaces.
- Do not mass-rewrite global CSS for token purity.

## Permanent viewport contract

- 390x844 — primary phone portrait
- 768x1024 — tablet portrait
- 1280x800 — desktop/laptop shell acceptance
- 320px — supplemental high-risk child/activity controls
- motion-game QA — suitable landscape evidence

## Current remediation order

1. Finish candidate docs on PR #162 and require fresh exact-head full PR CI.
2. Clean-gate and merge exact head.
3. Require independent merged-main CI + exact Cloudflare smoke.
4. Publish final live closure as **P0=0 / P1=0**.
5. Only then start a fresh objective/evidence audit for Pattern #38.

The learning engine and deployment are not the open issue in this checkpoint. The only remaining boundary is production verification of the accepted residual visual-token candidate.