# Production Visual / Product Baseline Audit — 2026-09-16

Status: **P0 = 0; P1 = 5; VQA-01 IMPLEMENTATION CANDIDATE; PATTERN #38 BLOCKED**  
Canonical production: `https://mainlagihub.my.id/`  
Baseline checkpoint merge: `d3d600ed92e78d30da8172e0bdb300119990614f`  
Baseline checkpoint CI: **#743 / run `35105996090` — full success including exact Cloudflare production smoke**

## Evidence boundary

The baseline combines exact production source, CI/browser screenshot artifacts, route/component source review, and exact Cloudflare release smoke. Direct external web-fetch from the assistant environment returned a cache miss and is not treated as outage evidence or as an independent visual walkthrough.

The Garden learning/activity direction remains the **accepted child-facing visual anchor**. Whole-product visual acceptance is still open.

## Baseline result

```text
P0 findings: 0
P1 findings: 5
P2 findings: 3
Garden representative activities: ACCEPTED anchor
Whole-product visual acceptance: NOT YET ACCEPTED
Pattern #38: BLOCKED
```

## P1 findings

### VBASE-P1-01 — visual-token fragmentation

Garden/Playroom uses cream paper, navy ink, green CTA, sky/sage surfaces and Nunito. `LearningPlatform.module.css` and `globals.css` still express separate white/blue/teal and generic blue/navy product languages.

Required outcome: migrate product surfaces wave-by-wave to `MAINLAGI_ART_BIBLE.md`; do not mass-rewrite already accepted gameplay mechanics.

### VBASE-P1-02 — parent-report density and internal jargon

Parent reporting exposes terms such as `attempt`, `assessed`, `practice`, `qualifying evidence`, mastery internals and completion ratios directly in the primary reading layer.

Required outcome: preserve the underlying metrics/evidence semantics but present them in normal parent language with stronger hierarchy and progressive disclosure.

### VBASE-P1-03 — stage/readiness hierarchy

Tablet/desktop stage layouts are structurally correct but underuse available space and weakly distinguish progress, readiness, recommendation and lesson grouping.

Required outcome: Garden-compatible stage hierarchy without changing progression/readiness logic.

### VBASE-P1-04 — public/adult root information architecture

Root is primarily a child playroom/fast-resume surface and does not yet provide a deliberate first-time adult/public value proposition and parent-vs-child path.

Required outcome: preserve fast resume for known children while defining a clean-session adult/public entry contract.

### VBASE-P1-05 — permanent whole-product visual coverage gap

Gameplay screenshots are strong, but the release gate historically lacked a stable product-shell matrix with exact final-path assertions for public root, profile selection, rewards, account/auth and representative system states.

Required outcome: VQA-01 permanent visual product baseline.

## VQA-01 implementation candidate

Branch: `agent/vqa01-permanent-visual-baseline-20260916`.

The candidate adds `scripts/run-visual-baseline-browser-tests.mjs` to the existing blocking `Mobile route QA (Chromium)` job.

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

Expected evidence: **42 deterministic screenshots** plus `.mobile-route-qa/visual-baseline/manifest.json`.

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
- no browser console errors.

This candidate does not close VBASE-P1-05 until fresh exact-head CI passes, the screenshot artifact is manually reviewed, the PR clean gate passes, and the implementation is merged and independently verified on `main` including exact Cloudflare smoke.

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

1. **VQA-01 Permanent visual baseline gate** — current implementation candidate.
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

This product-quality gate does not claim that the learning engine or deployment is broken. The baseline checkpoint itself is live and verified; the open work is whole-product visual convergence and evidence coverage.