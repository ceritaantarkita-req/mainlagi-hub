# Production Visual / Product Baseline Audit — 2026-09-16

Status: **BASELINE AUDIT RECORDED; P0 = 0; P1 REMEDIATION REQUIRED BEFORE PATTERN #38**  
Canonical production domain: `https://mainlagihub.my.id/`  
Audited source baseline: `main` `b1793adaabe19a9c73e021534899f8b50c4097f6`  
Final Pattern #37 closure CI: **#741 / run `35103399012` — full success including exact Cloudflare production smoke**

## Evidence boundary

This audit combines the exact production source, CI/browser screenshot artifacts, route/component source review, and exact Cloudflare release smoke.

The current UI code on `b1793ada...` is visually identical to implementation merge `6a6f99ccb3a733af4e298ed8c48452e019f9980c` because the only commit between them is the docs-only Pattern #37 closure. Therefore the CI #739 screenshot artifact is valid visual evidence for the current production UI code.

Representative CI evidence reviewed:

- `320-child-demo-gian-home.png`;
- `375-child-demo-gian-learn.png`;
- `768-child-demo-gian-stage-math-angka.png`;
- `390-parent-children-demo-gian-reports.png`;
- `430-play-math-choice.png`;
- `1024-games-math-choice.png`;
- Garden activity screenshots at 320 / 390 / 768, including `reading_passage_question` and `sentence_order_cards` idle/wrong/success states.

The external web-fetch environment used during this audit returned a cache-miss when opening the production domain directly. That is **not** treated as evidence of a production outage. Exact Cloudflare smoke on CI #741 passed. This document therefore does not claim a separate interactive remote-browser walkthrough beyond the CI/browser evidence listed above.

## Baseline decision

The Garden activity direction is the **approved child-facing visual anchor**. Representative learning activities are clear, playful, readable and materially more cohesive than the older generic application surfaces.

The product shell is **not yet visually accepted as a whole**. There are no evidenced P0 blockers, but five P1 findings must be resolved before Pattern #38 begins.

## Route / surface matrix

| Surface | Current evidence | Baseline status | Required next evidence |
|---|---|---|---|
| `/` / public-home entry | source review; child-first `HomePage` | **P1** | clean-session 390 / 768 / 1280 screenshots + IA decision |
| child profile select/create | route exists; no current representative artifact | **P1 QA GAP** | 390 / 768 screenshots; empty/error/profile-created states |
| child home/playroom | 320 screenshot + source | **ACCEPTED WITH SYSTEM P1** | 390 / 768 / 1280 permanent baseline |
| subject/gallery | 375 learning screenshot + source | **ACCEPTED WITH SYSTEM P1** | 390 / 768 permanent baseline + locked/open states |
| stage/readiness | 768 screenshot + source | **P1 VISUAL HIERARCHY** | 390 / 768 / 1280 after remediation |
| representative Garden activities | extensive 320 / 390 / 768 CI screenshots | **ANCHOR / ACCEPTED** | keep regression coverage on stable representatives |
| rewards | route exists; no current representative artifact | **P1 QA GAP** | 390 / 768 screenshots incl. empty/earned states |
| parent report | 390 screenshot + source | **P1 VISUAL + COPY DENSITY** | 390 / 768 / 1280 after remediation |
| account | route exists; no current representative artifact | **P1 QA GAP** | 390 / 768 screenshots |
| login/signup/forgot/reset/auth callback | generic global `dialog-card`; no baseline artifact | **P1 QA GAP / VISUAL DRIFT** | 390 / 768 screenshots incl. validation/error states |
| games catalog/detail | 1024 screenshot | **P2** | 390 / 768 / 1280 baseline after shell convergence |
| motion-game camera preflight/runtime | 430 screenshot | **FUNCTIONALLY DISTINCT / P2 SHELL** | retain dark runtime where functionally useful; align surrounding shell |
| not-found/loading/error/empty/degraded | partial source only | **P1 QA GAP** | explicit screenshot/state matrix |
| legal/about/faq/data-request | route inventory only | **P2** | representative adult/public baseline |

## Findings

### VBASE-P1-01 — three visual token systems are simultaneously active

Evidence:

- Garden / Playroom uses cream paper, navy ink, green CTA, sky/sage surfaces, Nunito and rounded playful cards.
- `LearningPlatform.module.css` carries a separate white/blue/teal product language.
- `globals.css` still carries the older blue/navy generic site system and is used by auth/system/public utilities.

Impact: moving between child home, stage, parent, auth/account and legacy public/game surfaces feels like moving between different products. Shared controls cannot be visually regression-tested against one canonical vocabulary.

Required fix: establish the Art Bible as canonical and migrate surfaces wave-by-wave; do not mass-rewrite gameplay components that already match the Garden anchor.

### VBASE-P1-02 — parent reporting reads and looks like an internal analytics dashboard

Evidence: the 390 parent-report screenshot and `ParentBatch15Report.tsx` expose terms such as `attempt`, `assessed`, `practice`, `qualifying evidence`, `mastery canonical`, completion ratios and stage-state counts directly in dense cards.

Impact: technically accurate evidence language leaks into the parent UX, increasing cognitive load and weakening the family-friendly Mainlagi identity.

Required fix: preserve the underlying metrics while rewriting presentation into parent language, stronger hierarchy and progressive disclosure. Technical evidence terms may remain in diagnostics/admin, not as the primary parent reading layer.

### VBASE-P1-03 — stage/readiness presentation is structurally correct but visually under-signaled

Evidence: the 768 `Kelas Angka` stage screenshot has large unused canvas, small repeated cards and weak visual distinction between stage state, lesson group and activity priority.

Impact: tablet/desktop does not use available space to communicate progress, recommendation and lesson grouping. The experience becomes document-like compared with the Garden activities.

Required fix: add stronger Garden surface hierarchy, progress/readiness treatment, responsive lesson grid and clearer recommended/primary activity emphasis without changing progression logic.

### VBASE-P1-04 — public/adult entry information architecture is unresolved

Evidence: root `HomePage` is fundamentally a child playroom entry and redirects an existing active child directly to the child destination. It does not operate as a complete public/family value-proposition page.

Impact: first-time adults do not receive a deliberate Mainlagi overview, trust/safety context and clear parent-vs-child path before entering play.

Required fix: define the clean-session root contract. Preserve fast resume for known child profiles, but provide a deliberate public/adult entry for first-time or signed-out users.

### VBASE-P1-05 — permanent visual coverage is incomplete across product-shell surfaces

Evidence: the current mobile-route artifact is strong for gameplay patterns but only contains a small number of shell screenshots. It does not provide approved representative captures for profile selection, rewards, account, auth flows, public-home clean state, error/loading/empty/degraded states and several adult routes.

Impact: CI can remain green while shell styling drifts. Whole-product visual acceptance cannot be claimed.

Required fix: add a permanent deterministic visual-baseline route suite with exact pathname assertions, fixture/readiness setup and screenshots at canonical viewports.

### VBASE-P2-01 — games detail/preflight uses a legacy visual vocabulary

The 1024 games detail view and the 430 camera preflight differ materially from Garden. The dark camera runtime is functionally defensible for contrast and motion tracking, but surrounding metadata, CTA and navigation should converge on the product system.

### VBASE-P2-02 — iconography mixes custom symbols and raw emoji

Learning surfaces increasingly use `LearningSymbol`/`Icon`, while parent reporting still uses emoji as primary card labels. Emoji may remain decorative/content-level, but primary navigation/status semantics should use the canonical icon system for stable cross-platform rendering.

### VBASE-P2-03 — inline visual styles increase drift risk

Several learning/parent components carry inline colors/margins in addition to CSS modules. This is not currently a blocker, but it weakens token enforcement and visual regression maintainability.

## Accepted anchor rules

Until a later intentional redesign is approved:

- Garden activity framing is the child-facing reference.
- Mainlagi wordmark, cream paper, navy ink, green primary CTA, sky/sage support surfaces and character artwork are the default brand vocabulary.
- Activities must keep large touch targets, explicit wrong/success feedback and low UI clutter.
- Visual fixes must not alter canonical activity answers, evidence, mastery, progression or readiness behavior merely to simplify screenshots.
- Motion runtime may use a dark functional environment, but entry/exit shell should still read as Mainlagi.

## P1 remediation order

1. **VQA-01 Permanent visual baseline gate** — add deterministic representative routes and screenshot matrix before broad restyling so regressions are measurable.
2. **VUI-01 Parent report convergence** — family-language hierarchy + Garden-compatible adult visual system; preserve metrics/evidence semantics.
3. **VUI-02 Stage/gallery convergence** — improve tablet/desktop hierarchy, progress and recommended-state emphasis without progression changes.
4. **VUI-03 Public/auth/account convergence** — resolve clean-session root IA and migrate generic dialog/account surfaces to the canonical family system.
5. Re-run the complete baseline matrix and close all P1 findings.
6. Only after P0=0 and P1=0 with permanent visual QA green may the fresh Pattern #38 objective/evidence audit begin.

## Viewport contract for permanent baseline

Minimum canonical viewports:

- **390x844** — primary phone portrait;
- **768x1024** — tablet portrait;
- **1280x800** — desktop/laptop shell acceptance.

Additional 320px width remains required for high-risk child/activity controls. Landscape is mandatory for motion-game-specific QA but not every static shell surface.

## Baseline acceptance status

```text
P0 findings: 0
P1 findings: 5
P2 findings: 3
Garden representative activities: ACCEPTED anchor
Whole-product visual acceptance: NOT YET ACCEPTED
Pattern #38 gate: BLOCKED until P1 remediation + permanent visual QA
```

This is a product-quality gate, not a claim that the learning engine or deployment is broken. CI, production build and exact Cloudflare smoke are green on the audited baseline.