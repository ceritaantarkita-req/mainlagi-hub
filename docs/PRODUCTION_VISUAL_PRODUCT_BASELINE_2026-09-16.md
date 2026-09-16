# Production Visual / Product Baseline Audit — 2026-09-16

Last updated: **17 September 2026**  
Status: **P0 = 0; P1 = 1 ON MERGED MAIN; VQA-01 + VUI-01 + VUI-02 + VUI-03 CLOSED; PATTERN #38 BLOCKED**  
Canonical production: `https://mainlagihub.my.id/`

## Verified closure chain

- baseline checkpoint: `d3d600ed92e78d30da8172e0bdb300119990614f`
- permanent VQA: PR #156 -> `9269e9fd576004d7d91fbd840e8c752acc7a5aae`, CI #751 including exact Cloudflare smoke
- VUI-01 Parent Report: PR #157 -> `e212002eafef77a37a220834c6263e433cf9acbb`, CI #758
- VUI-02 Stage/Gallery: PR #158 -> `fe260ba7a239586ca2362fbabfca3e0a5019d453`, CI #764
- VUI-03 Public/Auth/Account: PR #160 -> `415008a4a0503da98937ee8df0a1e5feb1a08c62`, CI #776 / run `35124809180` including exact Cloudflare release smoke

## Current baseline result

```text
P0 findings: 0
P1 findings: 1
P2 findings: 3
Garden representative activities: ACCEPTED anchor
Permanent visual QA: CLOSED / BLOCKING
Parent Report VUI-01: CLOSED / LIVE VERIFIED
Stage/Gallery VUI-02: CLOSED / LIVE VERIFIED
Public/Auth/Account VUI-03: CLOSED / LIVE VERIFIED
Whole-product visual acceptance: NOT YET ACCEPTED
Pattern #38: BLOCKED
```

Whole-product visual acceptance remains open only because one P1 remains.

## P1 findings

### VBASE-P1-01 — visual-token fragmentation — OPEN / SOLE P1

The highest-risk child, parent, stage, public, auth and account surfaces are now converged through the Garden/Art Bible direction and scoped modules. Remaining fragmentation is narrower and must be closed by a targeted evidence-first system/public residual pass rather than a one-shot rewrite of `globals.css`.

Initial residual evidence on live `main`:
- canonical `src/app/not-found.tsx` still uses legacy `center-page` + `dialog-card`;
- its primary CTA still inherits the older global blue `.button--primary` treatment;
- not-found is already a permanent visual-baseline route, so it can be migrated and guarded deterministically;
- `AdminGate` also uses legacy utility classes, but admin/diagnostic styling is explicitly allowed to remain utilitarian and is **not automatically a product P1** unless user-facing leakage is proven.

Closure requirement:
1. enumerate remaining legacy utility-shell usage on product-facing public/family/system routes;
2. separate product drift from admin-only utility styling;
3. migrate only evidenced user-facing residuals to scoped Mainlagi presentation;
4. keep permanent exact-path/status/error gates intact;
5. manual review at 390 / 768 / 1280;
6. exact-head CI + clean merge + independent main CI + exact Cloudflare smoke;
7. only then mark **P1=0**.

### VBASE-P1-02 — parent-report density and internal jargon — CLOSED

Closed by PR #157. Primary parent copy is family-facing; technical vocabulary remains behind diagnostic disclosure; permanent VQA guards the primary copy layer.

### VBASE-P1-03 — stage/readiness hierarchy — CLOSED

Closed by PR #158. Stage hero/readiness/lesson composition and subject journey now use available tablet/desktop width without changing readiness, progression, activity order, recommendation source, mastery or completion semantics.

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

Closure evidence:

```text
accepted implementation head: 96de380796cdcb16cd10f390805f4c7b62f9b83b
accepted PR CI:                #771 / run 35122985995 — full success
artifact:                      10458188042
artifact digest:               sha256:c554eca3a218c659b97c07f6bfb6521b00fea7f28c6b9de18ac1a799ea3fcdbb
final PR head:                 d6569864e0149816abea5bff65cbc2a948b4f58b
final PR CI:                   #775 / run 35124156787 — full success
merge main:                    415008a4a0503da98937ee8df0a1e5feb1a08c62
independent main CI:           #776 / run 35124809180 — full success
Cloudflare exact release:      success
```

Manual screenshot review accepted public root, account, login, signup, forgot-password and auth callback at 390x844, 768x1024 and 1280x800. `/reset-password` shares the same accepted family shell/form presentation.

### VBASE-P1-05 — permanent whole-product visual coverage gap — CLOSED

PR #156 established the blocking permanent matrix.

```text
390x844
768x1024
1280x800
14 canonical surfaces
42 exact-path screenshots
1 manifest.json
```

The matrix blocks unexpected redirects/status, blank output, missing main/H1, framework overlays, overflow, page/console errors, child target-floor regressions and the additional product-specific VUI guards.

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
- Admin utility styling is evaluated separately from public/child/parent product surfaces.
- Do not mass-rewrite global CSS for token purity.

## Permanent viewport contract

- 390x844 — primary phone portrait
- 768x1024 — tablet portrait
- 1280x800 — desktop/laptop shell acceptance
- 320px — supplemental high-risk child/activity controls
- motion-game QA — suitable landscape evidence

## Current remediation order

1. Close **VBASE-P1-01 residual visual-token fragmentation** with a targeted product-facing wave.
2. Re-run complete permanent visual QA + manual screenshot review.
3. Live-verify **P0=0 / P1=0** and update canonical docs.
4. Only then start a fresh objective/evidence audit for Pattern #38.

The learning engine and deployment are not the open issue in this checkpoint. The sole remaining P1 is residual product-surface token fragmentation.