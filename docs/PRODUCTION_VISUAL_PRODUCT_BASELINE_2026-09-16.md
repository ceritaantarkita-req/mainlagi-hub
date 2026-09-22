# Production Visual / Product Baseline Audit — 2026-09-16

Last updated: **22 September 2026**  
Status: **P0=0 / P1=0 / P2=3 BASELINE PRESERVED; WS-13 PRODUCT UX THROUGH PARENT WAVE LIVE VERIFIED; CHARACTER DEVELOPMENT PAUSED**  
Canonical production: `https://mainlagihub.my.id/`

## 20 September WS-13 product-UX addendum

The original 16–17 September visual P1 baseline remains valid as a visual-system checkpoint, but product UX continued after it. The following WS-13 work is now merged, and the parent wave is independently live verified:

- canonical route/component + warning audit;
- child home/header/navigation + responsive 3-column subject directory;
- activity gallery + isolated QA unlock;
- shared completion;
- matching randomization/retry behavior;
- first-instruction narration latency;
- parent/profile/settings responsive redesign.

Latest independently live-verified runtime/product state:

```text
PR:                #251
main:              77bee682f84b5d68b85d2c91b1d6f2ca4c93d2d9
main CI:           #1160 / run 35520629179
Cloudflare smoke:  PASS, exact SHA
QA artifact:       10608044389
```

Parent responsive contract is <760px mobile header + fixed five-item bottom nav and >=760px desktop sidebar. Manual review at 320 / 390 / 768 / 1024 was accepted; the 768 hero remains stacked to avoid pathological wrapping.

Current visual-product gap still includes human-character production: Paca/Gavi have production Garden WebP assets, while Naya/Gian/Zia still lack production files under `public/artwork`. **Execution is currently paused by the project owner.** Existing Drive character material is reference-only; no candidate review, binary integration, runtime activation, or five-character hero composition should resume until explicitly authorized. Mainlagi World is developed separately and remains out of scope for this workstream.

## Verified closure chain

- baseline checkpoint: `d3d600ed92e78d30da8172e0bdb300119990614f`
- permanent VQA foundation: PR #156 -> `9269e9fd576004d7d91fbd840e8c752acc7a5aae`, CI #751 including exact Cloudflare smoke
- VUI-01 Parent Report: PR #157 -> `e212002eafef77a37a220834c6263e433cf9acbb`, CI #758
- VUI-02 Stage/Gallery: PR #158 -> `fe260ba7a239586ca2362fbabfca3e0a5019d453`, CI #764
- VUI-03 Public/Auth/Account: PR #160 -> `415008a4a0503da98937ee8df0a1e5feb1a08c62`, CI #776 / run `35124809180` including exact Cloudflare release smoke
- VUI-03 docs/live baseline: PR #161 -> `7c863ad2b1887fe0c39557b408b743036128abe1`, CI #778 / run `35130270215` including exact Cloudflare release smoke
- VBASE-P1-01 residual token closure: PR #162 -> `2d3f95066e1106c43c76bf91dd29bf5707dca52c`, CI **#788 / run `35168877485` including exact Cloudflare release smoke**

## Current verified-production result

```text
P0 findings: 0
P1 findings: 0
P2 findings: 3
Garden representative activities: ACCEPTED anchor
Permanent visual QA: CLOSED / BLOCKING / 21 ROUTES / 63 CAPTURES
Parent Report VUI-01: CLOSED / LIVE VERIFIED
Stage/Gallery VUI-02: CLOSED / LIVE VERIFIED
Public/Auth/Account VUI-03: CLOSED / LIVE VERIFIED
VBASE-P1-01 residual token fragmentation: CLOSED / LIVE VERIFIED
Visual P1 checkpoint: ACCEPTED
Pattern #38: UNBLOCKED FOR FRESH OBJECTIVE/EVIDENCE AUDIT
```

The P1 checkpoint is complete. This does not erase the P2 backlog or external acceptance requirements.

## P1 findings

### VBASE-P1-01 — visual-token fragmentation — CLOSED / LIVE VERIFIED

The highest-risk child, parent, stage, public, auth and account-root surfaces were already converged in VUI-01/02/03. PR #162 closed the residual user-facing family/system drift without a one-shot rewrite of `globals.css`.

Closed migration scope:

- `/account/profile`;
- `/account/players`;
- `/account/preferences`;
- `/account/security`;
- `/account/delete`;
- `/account/about`;
- canonical not-found system state;
- `/reset-password` added to permanent visual evidence.

The six account subpages use one scoped family account-section shell. Existing `ProfileEditor`, `PlayerProfiles`, `Preferences`, delete-account logic, auth/session behavior and route semantics remain unchanged. `/account/about` copy remains unchanged. `/account/security` remains a stub; no password/session functionality was invented.

Canonical not-found now uses scoped Mainlagi system-state styling while retaining exact HTTP 404 behavior and the return-home action.

Admin-only utility styling remains a separate concern and was not mass-migrated. Game detail/preflight remains P2. Discover/leaderboard/legal utility cleanup remains lower priority.

#### PR acceptance evidence

Accepted implementation head before candidate-doc commits:

```text
923635645c164f08e9d26cc84be0b527d0e13ae0
```

Accepted implementation CI:

```text
#781 / run 35137266315 — full PR success
```

Accepted PR artifact:

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

CI #780 was structurally green, but manual screenshot review exposed a large empty utility card on the security stub. The defect was fixed at `92363564...` and re-proven by #781 rather than waived. This remains a permanent precedent: green structure/no-overflow is not sufficient when the screenshot is visibly wrong.

#### Final candidate-doc and merge evidence

Final PR #162 head:

```text
38b9eb7920d1e6796384b889f928dfcbf4d7e629
```

Fresh exact-head PR CI:

```text
#787 / run 35138385672 — full success
```

Clean merge gate:

```text
mergeable: true
behind main: 0
changed files: 17, all intended scope
comments: 0
reviews: 0
review threads: 0
```

Squash merge:

```text
2d3f95066e1106c43c76bf91dd29bf5707dca52c
```

#### Independent production verification

Merged-main CI:

```text
#788 / run 35168877485 — full success
```

The main run passed Quality, Windows, Production build, dependency audit, secret-history scan, broad Chromium route QA, permanent 63-capture visual QA and Production smoke (Cloudflare).

Exact release step:

```text
Wait for exact Cloudflare release and smoke public endpoints — SUCCESS
```

Merged-main visual artifact:

```text
id: 10476008006
digest: sha256:6fe0aa3de9bfadfc8e40229948edaca1cf633b33705a429515779b78f077266c
head SHA: 2d3f95066e1106c43c76bf91dd29bf5707dca52c
```

Full record: `VBASE_P1_01_VISUAL_TOKEN_CLOSURE_2026-09-17.md`.

### VBASE-P1-02 — parent-report density and internal jargon — CLOSED

Closed by PR #157. Primary parent copy is family-facing; technical vocabulary remains behind diagnostic disclosure; permanent VQA guards the primary copy layer.

### VBASE-P1-03 — stage/readiness hierarchy — CLOSED

Closed by PR #158. Stage hero/readiness/lesson composition and subject journey use available tablet/desktop width without changing readiness, progression, activity order, recommendation source, mastery or completion semantics.

### VBASE-P1-04 — public/adult root information architecture — CLOSED

Closed by PR #160 and independently live verified on `main` `415008a4a0503da98937ee8df0a1e5feb1a08c62`.

Accepted outcome:

- clean-session `/` is an explicit family/public entry;
- valid remembered child still uses existing fast-resume logic;
- child-start and parent/account routes are distinct;
- movement-camera play is described as optional without unsupported privacy claims;
- `/login`, `/signup`, `/forgot-password`, `/reset-password` and `/auth/callback` use one scoped family auth shell;
- `/account` uses scoped family presentation;
- Supabase/session/recovery/redirect semantics are unchanged.

### VBASE-P1-05 — permanent whole-product visual coverage gap — CLOSED

PR #156 established the original blocking matrix at 14 canonical surfaces / 42 exact-path screenshots. PR #162 permanently strengthened the production gate to:

```text
21 canonical routes
3 canonical viewports
63 exact-path screenshots
390x844
768x1024
1280x800
```

Every residual migrated account route, reset-password and canonical not-found now has deterministic exact-path evidence.

## P2 findings

### VBASE-P2-01 — games detail/preflight legacy vocabulary

Dark camera runtime can remain where functionally useful, but surrounding game detail/preflight metadata/navigation should converge in a later targeted wave.

### VBASE-P2-02 — iconography mixes canonical symbols and raw emoji

Emoji may remain decorative/content-level; permanent navigation/status semantics should prefer `LearningSymbol` / `Icon`.

### VBASE-P2-03 — inline visual styles increase drift risk

Some learning/parent surfaces retain inline visual values. Technical cleanup should not destabilize accepted behavior.

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

## Next remediation / execution order

1. Keep the permanent 21-route / 63-capture visual baseline blocking and continue the broad route/browser QA matrix.
2. Execute the character-production wave: production spec + provenance + reviewed Naya/Gian/Zia assets, preserving Paca/Gavi continuity.
3. Follow with subject theme/background system and clearer learning illustrations.
4. Continue English narration-quality work after the completed first-instruction latency wave.
5. Keep WS-05 mechanic work separate and evidence-driven; the Logic `pattern_completion` audit is already merged/live verified and runtime is not started.
6. Continue physical-device/accessibility and Iqro expert acceptance.
7. Address remaining P2 game-shell/icon/inline-style cleanup in targeted waves without reopening closed P1 surfaces.

The permanent visual baseline remains a gate, not a claim that every later product surface is visually final.
