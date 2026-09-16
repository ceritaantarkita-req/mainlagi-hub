# Production Visual / Product Baseline Audit — 2026-09-16

Status: **P0 = 0; P1 = 3 ON MERGED MAIN; VQA-01 + VUI-01 CLOSED; VUI-02 EXACT-HEAD ACCEPTED; PATTERN #38 BLOCKED**  
Canonical production: `https://mainlagihub.my.id/`  
Baseline checkpoint merge: `d3d600ed92e78d30da8172e0bdb300119990614f`  
Permanent VQA merge: `9269e9fd576004d7d91fbd840e8c752acc7a5aae`; main CI **#751 / run `35110724150`** including exact Cloudflare smoke  
VUI-01 merge: `e212002eafef77a37a220834c6263e433cf9acbb`; main CI **#758 / run `35115248445`** including exact Cloudflare smoke  
Current product PR: **#158 — VUI-02 Stage / Gallery convergence**  
VUI-02 accepted implementation head before docs: `7e85721bf42a1b31605bc87cd58594a8bbc55bd7`  
VUI-02 code-head CI: **#759 / run `35116294362` — full PR success**

## Evidence boundary

This audit combines exact repository source, CI/browser screenshot artifacts, route/component review and exact Cloudflare release smoke. Garden learning/activity remains the accepted child-facing visual anchor. Whole-product visual acceptance remains open until P1 reaches zero.

## Current baseline result

Merged-main state after VUI-01 closure:

```text
P0 findings: 0
P1 findings: 3
P2 findings: 3
Garden representative activities: ACCEPTED anchor
Permanent visual QA: CLOSED / BLOCKING
Parent Report VUI-01: CLOSED / LIVE VERIFIED
Stage/Gallery VUI-02: exact-head accepted; merge/live verification pending
Whole-product visual acceptance: NOT YET ACCEPTED
Pattern #38: BLOCKED
```

If VUI-02 completes exact merge and independent production verification without regression, P1 count becomes **2**.

## P1 findings

### VBASE-P1-01 — visual-token fragmentation — OPEN

Garden/Playroom, `LearningPlatform.module.css`, `globals.css` and migrated scoped modules still represent multiple generations of the product language. Required outcome remains scoped convergence and later targeted consolidation, not a one-shot CSS rewrite.

VUI-01 and VUI-02 intentionally use dedicated scoped modules so presentation can converge without destabilizing accepted activity mechanics.

### VBASE-P1-02 — parent-report density and internal jargon — CLOSED

Closed by PR #157 merged as `e212002eafef77a37a220834c6263e433cf9acbb`. Independent main CI **#758 / run `35115248445`** passed every job including exact Cloudflare release smoke.

Accepted outcome:
- primary parent report reads in normal family-facing Indonesian;
- underlying report/mastery/evidence values retain their original sources and semantics;
- technical vocabulary remains in diagnostic disclosure;
- permanent VQA prevents guarded jargon from returning to the primary report layer;
- manual screenshots accepted at 390 / 768 / 1280 after tablet layout correction.

### VBASE-P1-03 — stage/readiness hierarchy — EXACT-HEAD ACCEPTED

#### Baseline defect confirmed

The Subject Gallery itself was structurally healthy, but two issues were visible in the permanent screenshots and source:

1. **Subject journey at tablet/desktop:** stage cards lived in a horizontal flex scroller. At 768/1280, later stage cards were partially clipped even though the page itself had no horizontal overflow.
2. **Stage lesson density:** `StageScreen` inherited the global fixed `.cardGrid` breakpoints. The canonical Math stage's first lesson contains two activities, so desktop rendered two relatively narrow cards on the left while a large right-side region remained unused.

The issue was presentation density/hierarchy, not progression/readiness logic.

#### VUI-02 implementation

Stage:
- stage title/subtitle and existing readiness become one Garden-aligned hero;
- readiness uses the same canonical `status`, `completedCount` and `requiredCount` data;
- lesson title/objective and done counts become explicit lesson panels;
- stage-only lesson grid uses `repeat(auto-fit, minmax(260px, 1fr))` so one to three cards use available width naturally;
- the existing adaptive recommendation ID receives visual emphasis without reordering or replacing any activity;
- motion activities remain separate and optional.

Subject journey:
- exact same stages, statuses and routes are preserved;
- phone keeps horizontal journey behavior;
- >=700px switches to responsive stage grid to remove internal horizontal scrolling and partial clipping.

No change was made to readiness calculation, stage gates, prerequisites, mastery, activity answers, curriculum data, lesson/activity ordering semantics or completion requirements.

#### Permanent regression guard

`run-visual-baseline-browser-tests.mjs` now asserts on the canonical Math subject/stage routes that:
- tablet/desktop journey has `scrollWidth <= clientWidth + 1`;
- journey items remain >=200px wide;
- stage screen and readiness markers exist;
- exactly one canonical recommended activity remains visually marked;
- canonical lesson grid does not overflow;
- canonical lesson cards remain >=240px at tablet and >=320px on wide desktop.

#### CI and artifact evidence

Code head `7e85721bf42a1b31605bc87cd58594a8bbc55bd7` passed **CI #759 / run `35116294362`** completely.

```text
artifact: mobile-route-qa-screenshots
id:       10455798162
size:     43,942,101 bytes
digest:   sha256:41ee08ebb674a7f2ccebd6d7498c6f60e2c4032618dd268c3db2290686eed012
captures: 42 / 42
```

Manual screenshot acceptance:
- **390x844 subject:** first stage card remains fully readable and the next card intentionally peeks into view as a phone scroll affordance; no page overflow;
- **768x1024 subject:** six Math stages form a readable 2x3 grid; no clipped journey cards;
- **1280x800 subject:** responsive stage grid uses desktop width intentionally;
- **390x844 stage:** hero/readiness stack cleanly and lesson cards become readable single-column items;
- **768x1024 stage:** readiness hierarchy is clear and the first lesson's two activity cards fill available width evenly;
- **1280x800 stage:** two-column hero plus two broad lesson cards remove the previous large empty right canvas.

VBASE-P1-03 remains formally open until final docs-head CI, clean PR gate, exact merge and independent `main` + exact Cloudflare verification complete.

### VBASE-P1-04 — public/adult root information architecture — OPEN / NEXT

Root still behaves primarily as a child playroom / fast-resume entry. Clean-session adult/public value proposition, parent-vs-child path and wide-screen utility presentation remain unresolved. Auth/account system surfaces also still look more generic than the accepted Mainlagi family language.

Required outcome: VUI-03 Public/Auth/Account convergence while preserving known-child fast resume and existing auth/account security semantics.

### VBASE-P1-05 — permanent whole-product visual coverage gap — CLOSED

PR #156 is merged as `9269e9fd576004d7d91fbd840e8c752acc7a5aae`; independent main CI **#751 / run `35110724150`** passed the full matrix including exact Cloudflare release smoke.

Permanent blocking evidence covers:

```text
390x844
768x1024
1280x800
14 canonical surfaces
42 exact-path screenshots
1 manifest.json
```

Blocking assertions include expected HTTP status, exact final pathname, nonblank body, main/H1, expected route boundary, no Next.js error overlay, no horizontal page overflow, child phone target floor, no uncaught page errors and no unexpected console errors.

## P2 findings

### VBASE-P2-01 — games detail/preflight legacy vocabulary

Dark camera runtime is functionally defensible, but surrounding game detail/preflight metadata, navigation and CTA should converge on Mainlagi.

### VBASE-P2-02 — iconography mixes canonical symbols and raw emoji

Emoji may remain decorative/content-level; permanent navigation/status semantics should prefer `LearningSymbol` / `Icon`.

### VBASE-P2-03 — inline visual styles increase drift risk

Several learning/parent surfaces retain inline colors/margins alongside CSS modules. Cleanup comes after visual behavior is stable.

## Accepted anchor rules

- Garden activity framing is the child-facing reference.
- Mainlagi wordmark, cream paper, navy ink, green primary CTA, sky/sage support surfaces and character artwork are the default brand vocabulary.
- Visual fixes must not alter canonical activity answers, evidence, mastery, progression or readiness merely to simplify screenshots.
- A green `no overflow` check is insufficient when internal components remain clipped, cramped or visibly waste available canvas.
- Fixed viewport breakpoints do not imply fixed card counts: layout density must follow usable content width and actual item count.
- Stage recommendation may be emphasized visually, but the recommendation source and activity order remain canonical.

## P1 remediation order

1. Finish **VUI-02 Stage/Gallery** exact merge and production verification.
2. **VUI-03 Public/Auth/Account convergence**.
3. Close residual visual-token fragmentation through these scoped migrations and targeted cleanup.
4. Add deterministic remaining loading/empty/degraded fixtures where product states exist but cannot yet be captured reliably.
5. Re-run the complete visual matrix until **P0=0 / P1=0**.
6. Only then begin fresh Pattern #38 objective/evidence audit.

## Permanent viewport contract

- 390x844 — primary phone portrait;
- 768x1024 — tablet portrait;
- 1280x800 — desktop/laptop shell acceptance;
- 320px remains supplemental for high-risk child/activity controls;
- motion-game acceptance keeps suitable landscape evidence.

The learning engine and deployment are not the open issue in this checkpoint. The remaining work is product-surface convergence with evidence-backed acceptance.