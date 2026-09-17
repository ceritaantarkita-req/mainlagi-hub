# Production Visual / Product Baseline Audit — 2026-09-16

Last updated: **17 September 2026**  
Status: **P0=0 / P1=0 / P2=3 LIVE VERIFIED; PATTERN #38 UNBLOCKED FOR FRESH AUDIT**  
Canonical production: `https://mainlagihub.my.id/`

## Verified closure chain

- baseline checkpoint: `d3d600ed92e78d30da8172e0bdb300119990614f`
- permanent VQA foundation: PR #156 -> `9269e9fd576004d7d91fbd840e8c752acc7a5aae`, CI #751
- VUI-01 Parent Report: PR #157 -> `e212002eafef77a37a220834c6263e433cf9acbb`, CI #758
- VUI-02 Stage/Gallery: PR #158 -> `fe260ba7a239586ca2362fbabfca3e0a5019d453`, CI #764
- VUI-03 Public/Auth/Account: PR #160 -> `415008a4a0503da98937ee8df0a1e5feb1a08c62`, CI #776
- VUI-03 docs/live baseline: PR #161 -> `7c863ad2b1887fe0c39557b408b743036128abe1`, CI #778
- VBASE-P1-01 final residual token closure: PR #162 -> `2d3f95066e1106c43c76bf91dd29bf5707dca52c`, independent main CI **#788 / run `35168877485`**, exact Cloudflare release smoke **success**

## Current production result

```text
P0 findings: 0
P1 findings: 0
P2 findings: 3
Garden representative activities: ACCEPTED anchor
Permanent visual QA: BLOCKING / LIVE VERIFIED
Parent Report VUI-01: CLOSED / LIVE VERIFIED
Stage/Gallery VUI-02: CLOSED / LIVE VERIFIED
Public/Auth/Account VUI-03: CLOSED / LIVE VERIFIED
VBASE-P1-01: CLOSED / LIVE VERIFIED
Whole-product P1 visual checkpoint: CLOSED
Pattern #38: UNBLOCKED FOR FRESH OBJECTIVE/EVIDENCE AUDIT
```

## P1 findings

### VBASE-P1-01 — visual-token fragmentation — CLOSED / LIVE VERIFIED

PR #162 removed the remaining evidenced user-facing family/system drift without a one-shot rewrite of `globals.css`.

Closed scope:
- `/account/profile`;
- `/account/players`;
- `/account/preferences`;
- `/account/security`;
- `/account/delete`;
- `/account/about`;
- canonical not-found system state;
- `/reset-password` added to permanent visual evidence.

The six account subpages share one scoped family account-section shell. Existing auth/session/data behavior remains unchanged. `/account/about` copy remains unchanged. `/account/security` remains a stub; no password/session functionality was invented.

Canonical not-found now uses a scoped Mainlagi system state while retaining exact HTTP 404 behavior and its return-home action.

Accepted implementation evidence before merge:

```text
implementation head: 923635645c164f08e9d26cc84be0b527d0e13ae0
CI:                  #781 / run 35137266315 — full PR success
artifact:            10464427013
digest:              sha256:83c8181998c78da4faf1841b17a42b5874c14c00f6e557a736e946575a87e292
captures:            63 / 63
routes:              21
viewports:           390x844, 768x1024, 1280x800
status:              60 x HTTP 200 + 3 intentional HTTP 404
missing screenshots: 0
```

Final production evidence:

```text
final PR head:       38b9eb7920d1e6796384b889f928dfcbf4d7e629
merge/main SHA:      2d3f95066e1106c43c76bf91dd29bf5707dca52c
main CI:             #788 / run 35168877485 — success
Cloudflare exact release + public smoke: success
```

Manual review remains mandatory. CI #780 was structurally green but exposed a large empty card on the security stub. The defect was fixed before #781; the visual gate was strengthened rather than relaxed.

Full live closure record: `VBASE_P1_01_LIVE_CLOSURE_2026-09-17.md`.

### VBASE-P1-02 — parent-report density/internal jargon — CLOSED

Closed by PR #157. Primary parent copy is family-facing; technical vocabulary remains behind diagnostic disclosure.

### VBASE-P1-03 — stage/readiness hierarchy — CLOSED

Closed by PR #158 without changing readiness, progression, activity order, recommendation source, mastery or completion semantics.

### VBASE-P1-04 — public/adult root information architecture — CLOSED

Closed by PR #160 with live verification. Known-child fast resume, auth/session semantics and account destinations remain preserved.

### VBASE-P1-05 — permanent whole-product visual coverage gap — CLOSED

PR #156 established the blocking gate. PR #162 strengthened it from 14 routes / 42 captures to **21 canonical routes / 63 exact-path screenshots**.

## P2 findings

### VBASE-P2-01 — games detail/preflight legacy vocabulary

Dark camera runtime can remain where functionally useful, but surrounding game detail/preflight metadata/navigation should converge in a later wave.

### VBASE-P2-02 — iconography mixes canonical symbols and raw emoji

Emoji may remain decorative/content-level; permanent navigation/status semantics should prefer `LearningSymbol` / `Icon`.

### VBASE-P2-03 — inline visual styles increase drift risk

Some learning/parent surfaces retain inline visual values. Technical cleanup should not destabilize accepted behavior.

These remain P2. They do not block the fresh Pattern #38 audit.

## Accepted anchor rules

- Garden activity framing is the child-facing reference.
- Mainlagi wordmark, cream paper, navy ink, green primary CTA, sky/sage support surfaces and character artwork are the default product vocabulary.
- Visual fixes must not alter activity answers, evidence, mastery, progression, readiness or auth/session behavior merely to simplify screenshots.
- Known-child fast resume is a product contract, not a visual defect.
- A green `no overflow` check is insufficient if a layout remains visibly cramped, clipped or wasteful.
- Manual screenshot review remains mandatory for changed family/system surfaces.
- Admin utility styling is evaluated separately from public/child/parent product surfaces.
- Do not mass-rewrite global CSS for token purity.

## Permanent viewport contract

- 390x844 — primary phone portrait
- 768x1024 — tablet portrait
- 1280x800 — desktop/laptop shell acceptance
- 320px — supplemental high-risk child/activity controls
- motion-game QA — suitable landscape evidence

## Current remediation/order

1. Keep permanent 63-capture visual QA blocking.
2. Run a fresh objective/evidence audit for Pattern #38; no gameplay family is pre-approved.
3. Continue WS-05 toward 50–60 meaningful patterns only when each new pattern is justified by learning objective and evidence contract.
4. Address P2 visual cleanup later without destabilizing accepted P1 surfaces.
5. Continue external physical-device, accessibility and expert acceptance work.

The visual P1 checkpoint is complete. The next gating question is whether a distinct Pattern #38 is pedagogically and evidentially justified, not whether another mechanic can simply be added.
