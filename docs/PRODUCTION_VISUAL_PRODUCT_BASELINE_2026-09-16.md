# Production Visual / Product Baseline Audit — 2026-09-16

Status: **P0 = 0; P1 = 5; VQA-01 EXACT-HEAD ACCEPTED; MERGE/LIVE VERIFICATION PENDING; PATTERN #38 BLOCKED**  
Canonical production: `https://mainlagihub.my.id/`  
Baseline checkpoint merge: `d3d600ed92e78d30da8172e0bdb300119990614f`  
Baseline checkpoint CI: **#743 / run `35105996090` — full success including exact Cloudflare production smoke**  
VQA-01 implementation PR: **#156**  
VQA-01 accepted code head: `0197344db13e4fc9e36d86b79a38e2cf726a9069`  
VQA-01 exact-head CI: **#745 / run `35108485349` — full PR matrix success**

## Evidence boundary

The baseline combines exact production source, CI/browser screenshot artifacts, route/component source review, and exact Cloudflare release smoke. Direct external web-fetch from the assistant environment returned a cache miss and is not treated as outage evidence or as an independent visual walkthrough.

The Garden learning/activity direction remains the **accepted child-facing visual anchor**. Whole-product visual acceptance is still open.

## Baseline result

Before PR #156 merges and receives independent production verification:

```text
P0 findings: 0
P1 findings: 5
P2 findings: 3
Garden representative activities: ACCEPTED anchor
Permanent visual QA: exact-head accepted; merge/live verification pending
Whole-product visual acceptance: NOT YET ACCEPTED
Pattern #38: BLOCKED
```

When PR #156 is merged from its final exact head and independent `main` CI + exact Cloudflare smoke pass, **VBASE-P1-05 closes and the baseline P1 count becomes four**. The other P1 findings remain product work; VQA-01 does not hide them.

## P1 findings

### VBASE-P1-01 — visual-token fragmentation

Garden/Playroom uses cream paper, navy ink, green CTA, sky/sage surfaces and Nunito. `LearningPlatform.module.css` and `globals.css` still express overlapping white/blue/teal and generic blue/navy product languages.

Required outcome: migrate product surfaces wave-by-wave to `MAINLAGI_ART_BIBLE.md`; do not mass-rewrite already accepted gameplay mechanics.

### VBASE-P1-02 — parent-report density and internal jargon

Parent reporting exposes terms such as `attempt`, `assessed`, `practice`, `qualifying evidence`, mastery internals and completion ratios directly in the primary reading layer.

Required outcome: preserve the underlying metrics/evidence semantics but present them in normal parent language with stronger hierarchy and progressive disclosure.

Manual VQA-01 screenshot review reconfirmed this as the highest-priority visual/content P1 after permanent QA: the parent report is the densest and most technical family-facing surface in the canonical matrix.

### VBASE-P1-03 — stage/readiness hierarchy

Tablet/desktop stage layouts are structurally correct but underuse available space and weakly distinguish progress, readiness, recommendation and lesson grouping.

Required outcome: Garden-compatible stage hierarchy without changing progression/readiness logic.

VQA-01 768/1280 screenshots reconfirmed the large unused tablet/desktop canvas.

### VBASE-P1-04 — public/adult root information architecture

Root is primarily a child playroom/fast-resume surface and does not yet provide a deliberate first-time adult/public value proposition and parent-vs-child path.

Required outcome: preserve fast resume for known children while defining a clean-session adult/public entry contract.

The permanent matrix also shows that auth/system utility cards are visually under-scaled at wider viewports; that convergence belongs with VUI-03 rather than VQA-01.

### VBASE-P1-05 — permanent whole-product visual coverage gap

**Implementation exact-head accepted; merge/live verification pending.**

PR #156 adds `scripts/run-visual-baseline-browser-tests.mjs` to the existing blocking `Mobile route QA (Chromium)` job.

Canonical viewports:

```text
390x844
768x1024
1280x800
```

Canonical surfaces:

```text
public root
child select
child home
Math subject/gallery
Math Angka stage
math-count-3 Garden activity
rewards
parent report
account
login
signup
forgot-password
expired auth-link error
not-found
```

Expected and verified evidence: **42 deterministic screenshots** plus `.mobile-route-qa/visual-baseline/manifest.json`.

Blocking assertions:
- expected HTTP status;
- exact final pathname;
- nonblank body;
- main landmark + top-level heading;
- expected route boundary where applicable;
- no Next.js error overlay;
- no horizontal overflow;
- child phone touch targets remain >= approximately 44 CSS px with the existing measurement tolerance;
- no page errors;
- no unexpected browser console errors.

## VQA-01 failure-driven hardening

Initial PR CI #744 / run `35107021073` was intentionally treated as evidence, not bypassed. Every job except `Mobile route QA (Chromium)` passed; the existing broad mobile/runtime matrix also passed. The new visual step failed on the deliberate not-found surface because:

- the route correctly returned HTTP 404;
- the exact pathname and structural assertions had passed;
- Chromium emitted its normal document-load console message: `Failed to load resource: the server responded with a status of 404 (Not Found)`.

The fix is narrowly scoped:
- expected-404 surfaces still require exact 404 and exact pathname;
- main/H1, route structure, overflow and page-error assertions remain active;
- only the exact document-level 404 console string is filtered when the route contract itself expects 404;
- unrelated console errors still fail;
- status-200 surfaces retain the zero-console-error contract.

Fresh exact-head CI #745 / run `35108485349` then passed every PR job, including `Run permanent visual product baseline`. This is not a global relaxation of browser-error checking.

## VQA-01 artifact verification

Run #745 artifact:

```text
name:   mobile-route-qa-screenshots
id:     10450999235
size:   43,655,320 bytes
digest: sha256:07ae0dfc14ebdb13af4c2ebc270644194d8a4972b4630c428aa1c0dbeaa745e2
```

Manifest verification:

```text
captures:            42 / 42
viewports:           390x844, 768x1024, 1280x800
canonical surfaces:  14
final paths:         14 unique expected paths
HTTP responses:      39 x 200, 3 x intentional 404
missing screenshots: 0
```

Manual review of all 42 screenshots found no new P0 blocker. It confirmed:
- child select/home, representative Garden activity and rewards are suitable baseline references;
- parent report remains the highest-priority dense/technical adult surface;
- stage tablet/desktop still underuses available space;
- auth/system cards are visually too small on wide screens;
- public root remains visually coherent but does not yet solve first-time adult IA.

VBASE-P1-05 remains formally open only until the final docs head passes fresh CI, PR #156 passes the clean merge gate, the exact head is merged, and independent `main` CI including exact Cloudflare smoke succeeds.

## P2 findings

### VBASE-P2-01 — games detail/preflight legacy vocabulary

Dark camera runtime is functionally defensible for contrast and tracking, but surrounding game detail/preflight metadata, navigation and CTA should converge on Mainlagi.

### VBASE-P2-02 — iconography mixes canonical symbols and raw emoji

Emoji may remain decorative/content-level; permanent navigation/status semantics should prefer `LearningSymbol` / `Icon` for stable rendering.

### VBASE-P2-03 — inline visual styles increase drift risk

Several learning/parent surfaces retain inline colors/margins alongside CSS modules. Cleanup comes after visual behavior is stable.

## Accepted anchor rules

- Garden activity framing is the child-facing reference.
- Mainlagi wordmark, cream paper, navy ink, green primary CTA, sky/sage support surfaces and character artwork are the default brand vocabulary.
- Activities retain large touch targets, explicit wrong/success feedback and low UI clutter.
- Visual fixes must not alter canonical activity answers, evidence, mastery, progression or readiness merely to simplify screenshots.
- Motion runtime may remain dark where functionally useful; entry/exit shell still needs Mainlagi continuity.

## P1 remediation order

1. Finish **VQA-01 Permanent visual baseline gate** with exact merge and production verification.
2. **VUI-01 Parent report convergence**.
3. **VUI-02 Stage/gallery convergence**.
4. **VUI-03 Public/auth/account convergence**.
5. Add deterministic remaining loading/empty/degraded-state fixtures where product states exist but cannot yet be captured reliably.
6. Re-run the complete visual matrix until **P0=0 / P1=0**.
7. Only then begin fresh Pattern #38 objective/evidence audit.

## Permanent viewport contract

- 390x844 — primary phone portrait;
- 768x1024 — tablet portrait;
- 1280x800 — desktop/laptop shell acceptance;
- 320px remains supplemental for high-risk child/activity controls;
- motion-game acceptance keeps suitable landscape evidence.

This product-quality gate does not claim that the learning engine or deployment is broken. The baseline checkpoint itself is live and verified; the open work is whole-product visual convergence and final VQA-01 merge/live closure.