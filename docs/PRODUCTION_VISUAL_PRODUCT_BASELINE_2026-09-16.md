# Production Visual / Product Baseline Audit — 2026-09-16

Last updated: **17 September 2026**  
Status: **P0=0 / P1=0 LIVE VERIFIED; P2=3 REMAIN; WHOLE-PRODUCT P0/P1 CHECKPOINT ACCEPTED**  
Canonical production: `https://mainlagihub.my.id/`

## Verified closure chain

- baseline checkpoint: `d3d600ed92e78d30da8172e0bdb300119990614f`
- permanent VQA foundation: PR #156 -> `9269e9fd576004d7d91fbd840e8c752acc7a5aae`, CI #751 including exact Cloudflare smoke
- VUI-01 Parent Report: PR #157 -> `e212002eafef77a37a220834c6263e433cf9acbb`, CI #758
- VUI-02 Stage/Gallery: PR #158 -> `fe260ba7a239586ca2362fbabfca3e0a5019d453`, CI #764
- VUI-03 Public/Auth/Account: PR #160 -> `415008a4a0503da98937ee8df0a1e5feb1a08c62`, CI #776 / run `35124809180` including exact Cloudflare release smoke
- VUI-03 docs/live baseline: PR #161 -> `7c863ad2b1887fe0c39557b408b743036128abe1`, CI #778 / run `35130270215` including exact Cloudflare release smoke
- VBASE-P1-01 residual visual-token closure: PR #162 -> `2d3f95066e1106c43c76bf91dd29bf5707dca52c`, independent `main` CI **#788 / run `35168877485` — full success including exact Cloudflare release smoke**

## Current production result

```text
P0 findings: 0
P1 findings: 0
P2 findings: 3
Garden representative activities: ACCEPTED anchor
Permanent visual QA: CLOSED / BLOCKING / LIVE VERIFIED
Parent Report VUI-01: CLOSED / LIVE VERIFIED
Stage/Gallery VUI-02: CLOSED / LIVE VERIFIED
Public/Auth/Account VUI-03: CLOSED / LIVE VERIFIED
Residual visual-token P1-01: CLOSED / LIVE VERIFIED
Whole-product P0/P1 visual checkpoint: ACCEPTED
```

## P1 findings

### VBASE-P1-01 — visual-token fragmentation — CLOSED / LIVE VERIFIED

PR #162 closed the residual user-facing family/system drift without mass-rewriting `globals.css`.

Closed scope:
- `/account/profile`;
- `/account/players`;
- `/account/preferences`;
- `/account/security`;
- `/account/delete`;
- `/account/about`;
- canonical not-found system state;
- `/reset-password` added to permanent visual evidence.

The six account subpages share one scoped family account-section shell. Existing account/auth/data components and behavior remain unchanged. `/account/about` copy remains unchanged. `/account/security` remains a stub; no password/session functionality was invented.

Canonical not-found now uses scoped Mainlagi system-state styling while preserving exact HTTP 404 behavior and the return-home action.

Accepted implementation evidence:

```text
implementation head: 923635645c164f08e9d26cc84be0b527d0e13ae0
PR CI:              #781 / run 35137266315 — full success
artifact id:        10464427013
digest:             sha256:83c8181998c78da4faf1841b17a42b5874c14c00f6e557a736e946575a87e292
captures:           63 / 63
routes:             21
viewports:          390x844, 768x1024, 1280x800
status:             60 HTTP 200 + 3 intentional HTTP 404
missing:            0
```

A useful negative result occurred during acceptance: CI #780 was structurally green, but manual screenshots exposed a large empty utility card on the `/account/security` stub. The defect was fixed before #781; the visual gate was not weakened.

Live-production evidence:

```text
PR:                  #162
merged main:         2d3f95066e1106c43c76bf91dd29bf5707dca52c
independent main CI: #788 / run 35168877485 — full success
Cloudflare exact release smoke: SUCCESS
```

The exact main smoke step **“Wait for exact Cloudflare release and smoke public endpoints”** succeeded.

### VBASE-P1-02 — parent-report density and internal jargon — CLOSED

Closed by PR #157. Primary parent copy is family-facing; technical vocabulary remains behind diagnostic disclosure; permanent VQA guards the primary copy layer.

### VBASE-P1-03 — stage/readiness hierarchy — CLOSED

Closed by PR #158. Stage hero/readiness/lesson composition and subject journey use available tablet/desktop width without changing readiness, progression, activity order, recommendation source, mastery or completion semantics.

### VBASE-P1-04 — public/adult root information architecture — CLOSED

Closed by PR #160 and independently live verified on `main` `415008a4a0503da98937ee8df0a1e5feb1a08c62`.

### VBASE-P1-05 — permanent whole-product visual coverage gap — CLOSED

PR #156 established the original 14-route / 42-capture blocking matrix. PR #162 strengthened it permanently to **21 canonical routes / 63 exact-path screenshots**, covering every migrated account route plus reset-password.

## Remaining P2 findings

### VBASE-P2-01 — games detail/preflight legacy vocabulary

Dark camera runtime may remain where functionally useful, but surrounding game detail/preflight metadata/navigation should converge in a separate scoped wave.

### VBASE-P2-02 — iconography mixes canonical symbols and raw emoji

Emoji may remain decorative/content-level; permanent navigation/status semantics should prefer `LearningSymbol` / `Icon`.

### VBASE-P2-03 — inline visual styles increase drift risk

Some learning/parent surfaces retain inline visual values. Cleanup is technical follow-up and must not destabilize accepted behavior.

These P2 items do **not** reopen the completed P0/P1 checkpoint.

## Accepted anchor rules

- Garden activity framing is the child-facing reference.
- Mainlagi wordmark, cream paper, navy ink, green primary CTA, sky/sage support surfaces and character artwork are the default product vocabulary.
- Visual fixes must not alter activity answers, evidence, mastery, progression, readiness or auth/session behavior merely to simplify screenshots.
- Known-child fast resume is a product contract, not a visual defect.
- A green `no overflow` check is insufficient if a layout remains visibly cramped, clipped, wasteful or falsely carded.
- Manual screenshot review remains mandatory for changed family/system surfaces; #780 is the concrete precedent.
- Admin utility styling is evaluated separately from public/child/parent product surfaces.
- Do not mass-rewrite global CSS for token purity.

## Permanent viewport contract

- 390x844 — primary phone portrait
- 768x1024 — tablet portrait
- 1280x800 — desktop/laptop shell acceptance
- 320px — supplemental high-risk child/activity controls
- motion-game QA — suitable landscape evidence

## Next quality order

1. Run a fresh objective/evidence audit for Pattern #38; no gameplay family is pre-approved.
2. Continue WS-05 toward 50–60 meaningful patterns with permanent visual QA blocking every wave.
3. Address P2 game-shell/iconography/inline-style work in separate evidence-backed waves.
4. Continue narration, external-device/accessibility/Iqro acceptance and governance work.
5. Finish with full end-to-end production and external acceptance closure.