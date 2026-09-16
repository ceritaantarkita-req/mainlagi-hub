# Production Visual / Product Baseline Audit — 2026-09-16

Status: **P0 = 0; P1 = 2 ON MERGED MAIN; VQA-01 + VUI-01 + VUI-02 CLOSED; VUI-03 EXACT-HEAD ACCEPTED; PATTERN #38 BLOCKED**  
Canonical production: `https://mainlagihub.my.id/`  
Baseline checkpoint merge: `d3d600ed92e78d30da8172e0bdb300119990614f`  
Permanent VQA merge: `9269e9fd576004d7d91fbd840e8c752acc7a5aae`; main CI **#751 / run `35110724150`** including exact Cloudflare smoke  
VUI-01 merge: `e212002eafef77a37a220834c6263e433cf9acbb`; main CI **#758 / run `35115248445`**  
VUI-02 merge: `fe260ba7a239586ca2362fbabfca3e0a5019d453`; main CI **#764 / run `35118210891`**  
VUI-03 PR: **#160**; accepted implementation head `96de380796cdcb16cd10f390805f4c7b62f9b83b`; CI **#771 / run `35122985995` — full PR success**

## Evidence boundary

This audit combines exact repository source, CI/browser screenshot artifacts, route/component review and exact Cloudflare release smoke where the change is merged. Garden learning/activity remains the accepted child-facing visual anchor. Whole-product visual acceptance remains open until P1 reaches zero.

## Current baseline result

Merged-main state remains after VUI-02 closure until VUI-03 is merged and independently production-verified:

```text
P0 findings: 0
P1 findings: 2
P2 findings: 3
Garden representative activities: ACCEPTED anchor
Permanent visual QA: CLOSED / BLOCKING
Parent Report VUI-01: CLOSED / LIVE VERIFIED
Stage/Gallery VUI-02: CLOSED / LIVE VERIFIED
Public/Auth/Account VUI-03: EXACT-HEAD ACCEPTED
Whole-product visual acceptance: NOT YET ACCEPTED
Pattern #38: BLOCKED
```

If VUI-03 completes exact merge and independent production verification without regression, P1 count becomes **1**.

## P1 findings

### VBASE-P1-01 — visual-token fragmentation — OPEN

Garden/Playroom, `LearningPlatform.module.css`, `globals.css` and migrated scoped modules still represent multiple generations of the product language. Required outcome remains scoped convergence and targeted consolidation, not a one-shot CSS rewrite.

VUI-01, VUI-02 and VUI-03 deliberately use scoped modules so presentation can converge without destabilizing accepted learning/auth behavior. VUI-03 materially removes the public/auth/account legacy cluster, but residual global/legacy styling still requires a dedicated evidence-first closure pass before P1 can reach zero.

### VBASE-P1-02 — parent-report density and internal jargon — CLOSED

Closed by PR #157 merged as `e212002eafef77a37a220834c6263e433cf9acbb`. Independent main CI #758 passed including exact Cloudflare release smoke.

### VBASE-P1-03 — stage/readiness hierarchy — CLOSED

Closed by PR #158 merged as `fe260ba7a239586ca2362fbabfca3e0a5019d453`, independently verified by main CI #764 including exact Cloudflare smoke.

### VBASE-P1-04 — public/adult root information architecture — EXACT-HEAD ACCEPTED

#### Baseline defect confirmed

Root:
- known-child fast resume was already correct through `readActiveChild()` + `childDestination()`;
- clean session still rendered the child-oriented `PlayroomShell`, so the first impression read as child mode rather than a deliberate family/public entry;
- first decision point did not clearly separate child-start from parent/account path or summarize optional camera expectations.

Auth:
- `/login`, `/signup`, `/forgot-password` and `/auth/callback` used correct behavior but generic global `center-page` / `dialog-card` presentation;
- desktop produced a small isolated utility card in a large empty canvas;
- auth focus/link/button styling came from older global tokens.

Account:
- `/account` was closer to the target family language but still used a narrow legacy global presentation cluster.

#### VUI-03 accepted implementation

Public root:
- clean session now uses the public/family AppShell and a dedicated scoped `PublicHome` composition;
- known-child fast resume remains unchanged for a valid remembered child;
- child and parent actions are explicit and separate;
- Main Gerak camera use is described as optional without unsupported privacy/security guarantees;
- canonical subject directory remains available and still routes through profile preparation.

Auth:
- `/login`, `/signup`, `/forgot-password`, `/reset-password` and `/auth/callback` now share one scoped Mainlagi family visual shell;
- family auth routes own the viewport so public navigation is not duplicated around the auth shell;
- email/password/recovery/callback Supabase operations, validation, messages, session behavior and redirects are unchanged;
- form controls use scoped Mainlagi styling and >=44px targets.

Account:
- `/account` uses a scoped family account module rather than legacy global presentation classes;
- signed-in/signed-out behavior and destination routes are unchanged;
- tablet/desktop use a two-column settings grid while phone remains stacked.

#### Permanent regression guard

The existing 14-route / 42-capture matrix now additionally asserts:
- clean root family marker plus exactly one child CTA and one parent CTA;
- optional-camera copy and >=44px family CTA height;
- shared auth family shell/context/panel markers;
- login/signup/forgot expected form mode and >=44px form controls;
- auth callback error status remains inside the family shell;
- account family/settings markers, seven canonical settings links and readable geometry at tablet/desktop;
- all previous exact-path, status, overflow, error and console gates remain blocking.

#### CI and artifact evidence

```text
accepted implementation head: 96de380796cdcb16cd10f390805f4c7b62f9b83b
PR CI:                       #771 / run 35122985995 — full success
artifact:                    mobile-route-qa-screenshots
artifact id:                 10458188042
artifact digest:             sha256:c554eca3a218c659b97c07f6bfb6521b00fea7f28c6b9de18ac1a799ea3fcdbb
captures:                    42 / 42
manifest path/status mismatch: 0
```

Manual screenshot acceptance:
- **390x844 public:** family proposition, child CTA and parent CTA are visible and legible; public mobile navigation remains usable;
- **768x1024 public:** hero and child/parent paths use tablet width intentionally;
- **1280x800 public:** family hero + Gavi/Paca use the desktop canvas instead of child-playroom framing;
- **390x844 account:** signed-out family gate and settings stack clearly;
- **768/1280 account:** two-column family settings remove the narrow utility-card feel;
- **390/768/1280 auth:** login/signup/forgot/callback use one coherent family shell with readable forms/status and no duplicate public navbar.

`/reset-password` is migrated to the same accepted shell/form styling but remains outside the canonical 14-surface screenshot matrix.

VBASE-P1-04 remains formally open until the final docs head passes fresh CI, PR #160 passes clean exact merge checks, exact head is merged, and independent `main` + exact Cloudflare release verification succeeds.

### VBASE-P1-05 — permanent whole-product visual coverage gap — CLOSED

PR #156 is merged as `9269e9fd576004d7d91fbd840e8c752acc7a5aae`; independent main CI #751 passed the full matrix including exact Cloudflare release smoke.

Permanent blocking evidence remains:

```text
390x844
768x1024
1280x800
14 canonical surfaces
42 exact-path screenshots
1 manifest.json
```

## P2 findings

### VBASE-P2-01 — games detail/preflight legacy vocabulary

Dark camera runtime is functionally defensible, but surrounding game detail/preflight metadata, navigation and CTA should converge on Mainlagi.

### VBASE-P2-02 — iconography mixes canonical symbols and raw emoji

Emoji may remain decorative/content-level; permanent navigation/status semantics should prefer `LearningSymbol` / `Icon`.

### VBASE-P2-03 — inline visual styles increase drift risk

Several learning/parent surfaces retain inline colors/margins alongside CSS modules. Cleanup comes after P1 visual behavior is stable.

## Accepted anchor rules

- Garden activity framing is the child-facing reference.
- Mainlagi wordmark, cream paper, navy ink, green primary CTA, sky/sage support surfaces and character artwork are the default brand vocabulary.
- Visual fixes must not alter canonical activity answers, evidence, mastery, progression or readiness merely to simplify screenshots.
- Auth/public fixes must preserve session/security/recovery behavior unless separately justified and tested.
- Known-child fast resume is a product contract, not a visual defect.
- A green `no overflow` check is insufficient when internal components remain clipped, cramped or visibly waste available canvas.
- Public/auth/account desktop surfaces should use available width for context rather than centering a tiny generic utility card.

## P1 remediation order

1. Finish **VUI-03 Public/Auth/Account** exact docs-head CI, clean merge and production verification.
2. Run a targeted **VBASE-P1-01 residual visual-token closure** against remaining legacy/global clusters.
3. Re-run the complete visual matrix until **P0=0 / P1=0**.
4. Only then begin fresh Pattern #38 objective/evidence audit.

## Permanent viewport contract

- 390x844 — primary phone portrait;
- 768x1024 — tablet portrait;
- 1280x800 — desktop/laptop shell acceptance;
- 320px remains supplemental for high-risk child/activity controls;
- motion-game acceptance keeps suitable landscape evidence.

The learning engine and deployment are not the open issue in this checkpoint. After VUI-03 live closure, the sole remaining P1 should be residual visual-token fragmentation.