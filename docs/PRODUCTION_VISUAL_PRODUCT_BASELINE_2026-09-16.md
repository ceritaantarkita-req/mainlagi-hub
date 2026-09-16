# Production Visual / Product Baseline Audit — 2026-09-16

Status: **P0 = 0; P1 = 4 ON MERGED MAIN; VQA-01 CLOSED; VUI-01 EXACT-HEAD ACCEPTED; PATTERN #38 BLOCKED**  
Canonical production: `https://mainlagihub.my.id/`  
Baseline checkpoint merge: `d3d600ed92e78d30da8172e0bdb300119990614f`  
Baseline checkpoint CI: **#743 / run `35105996090` — full success including exact Cloudflare production smoke**  
Permanent VQA merge: `9269e9fd576004d7d91fbd840e8c752acc7a5aae`  
Permanent VQA final main CI: **#751 / run `35110724150` — full success including exact Cloudflare release smoke**  
Current product PR: **#157 — VUI-01 Parent Report convergence**  
VUI-01 accepted code head: `6a4450467b8d9bd01cd9f2bc0806100c84d187f3`  
VUI-01 code-head CI: **#753 / run `35112741852` — full PR success**

## Evidence boundary

The baseline combines exact repository source, CI/browser screenshot artifacts, route/component review, and exact Cloudflare release smoke. The Garden learning/activity direction remains the accepted child-facing visual anchor. Whole-product visual acceptance remains open until P1 reaches zero.

## Current baseline result

Merged-main state after VQA-01 closure and before VUI-01 merge:

```text
P0 findings: 0
P1 findings: 4
P2 findings: 3
Garden representative activities: ACCEPTED anchor
Permanent visual QA: CLOSED / BLOCKING
VUI-01 Parent Report: exact-head accepted; merge/live verification pending
Whole-product visual acceptance: NOT YET ACCEPTED
Pattern #38: BLOCKED
```

If VUI-01 completes exact merge and independent production verification without regression, P1 count becomes **3**.

## P1 findings

### VBASE-P1-01 — visual-token fragmentation — OPEN

Garden/Playroom, `LearningPlatform.module.css`, and `globals.css` still express overlapping product languages. Required outcome remains scoped migration, not a one-shot stylesheet rewrite. VUI-01 reduces this fragmentation for Parent Report through a dedicated scoped module.

### VBASE-P1-02 — parent-report density and internal jargon — EXACT-HEAD ACCEPTED

Original problem: Parent Report exposed `attempt`, `assessed`, `practice`, `qualifying evidence`, mastery internals and retry terminology in the primary family-facing reading layer, with nine equal dashboard-like subject cards.

VUI-01 PR #157 changes only presentation and visual regression:
- primary copy is translated into normal parent-facing Indonesian;
- same `buildBatch15ParentReport` output fields remain the source of counts, accuracy, completion, mastery score/coverage, stage states, recommendations, recent results and awards;
- technical vocabulary remains available inside per-subject diagnostic disclosure;
- permanent semantic UI prefers `LearningSymbol` and product icons rather than analytics emoji;
- subject detail is grouped in one family-report panel instead of nine equally weighted dashboard cards;
- a dedicated `ParentReport.module.css` keeps the migration local;
- VQA explicitly fails if guarded internal vocabulary leaks back into the Parent Report primary layer.

No change was made to `buildBatch15ParentReport`, mastery/evidence logic, progression, readiness, schema, migrations, activity data or learning answers.

#### Evidence and responsive correction

CI #752 initially passed all automation, including visual baseline, but human screenshot review found the 768px summary cards visually too narrow because three columns were forced inside the post-sidebar content width. This was treated as a real visual defect rather than accepted merely because overflow checks were green.

The fix changes tablet-class summary layout to **2+1 cards** and restores three columns only from 1020px upward.

Fresh head `6a4450467b8d9bd01cd9f2bc0806100c84d187f3` passed CI **#753 / run `35112741852`** completely. Artifact evidence:

```text
artifact: mobile-route-qa-screenshots
id:       10452654695
digest:   sha256:c8d985fdf5cc9601d8fe2bbecd4ac0c4f7b39a82ed14bf7f091eec7dd273a170
captures: 42 / 42
```

Parent Report manifest evidence:

```text
390x844   /parent/children/demo-gian/reports -> exact same path, HTTP 200
768x1024  /parent/children/demo-gian/reports -> exact same path, HTTP 200
1280x800  /parent/children/demo-gian/reports -> exact same path, HTTP 200
```

Manual review after the fix:
- 390: readable single-column hierarchy;
- 768: readable 2+1 summary layout with no pathological word wrapping;
- 1280: balanced three-column summary layout;
- primary family copy is readable and technical detail remains behind closed disclosure.

VBASE-P1-02 remains formally open until final docs-head CI, clean PR gate, exact merge, and independent `main` + exact Cloudflare verification complete.

### VBASE-P1-03 — stage/readiness hierarchy — OPEN / NEXT

Tablet/desktop stage layouts are structurally correct but underuse available space and weakly distinguish progress, readiness, recommendation and lesson grouping.

Required outcome: VUI-02 Garden-compatible hierarchy without changing progression/readiness logic.

### VBASE-P1-04 — public/adult root information architecture — OPEN

Root remains primarily a child playroom/fast-resume surface. Clean-session adult/public value proposition and parent-vs-child entry need an explicit contract. Auth/system utility cards also remain under-scaled at wider viewports.

Required outcome: VUI-03 public/auth/account convergence while preserving known-child fast resume.

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

Blocking assertions include expected HTTP status, exact final pathname, nonblank body, main/H1, expected route boundary, no Next.js error overlay, no horizontal overflow, child phone touch-target floor, no uncaught page errors and no unexpected console errors.

The intentional not-found route remains strict: exact HTTP 404 + exact pathname are required; only Chromium's exact document-load 404 console message is scoped out on that explicit expected-404 surface.

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
- Activities retain large touch targets, explicit wrong/success feedback and low UI clutter.
- Visual fixes must not alter canonical activity answers, evidence, mastery, progression or readiness merely to simplify screenshots.
- Motion runtime may remain dark where functionally useful; entry/exit shell still needs Mainlagi continuity.
- A green structural test does not override visible responsive defects found in screenshot review.

## P1 remediation order

1. Finish **VUI-01 Parent Report** exact merge and production verification.
2. **VUI-02 Stage/Gallery convergence**.
3. **VUI-03 Public/Auth/Account convergence**.
4. Close residual visual-token fragmentation through those scoped migrations and targeted cleanup.
5. Add deterministic remaining loading/empty/degraded fixtures where product states exist but cannot yet be captured reliably.
6. Re-run the complete visual matrix until **P0=0 / P1=0**.
7. Only then begin fresh Pattern #38 objective/evidence audit.

## Permanent viewport contract

- 390x844 — primary phone portrait;
- 768x1024 — tablet portrait;
- 1280x800 — desktop/laptop shell acceptance;
- 320px remains supplemental for high-risk child/activity controls;
- motion-game acceptance keeps suitable landscape evidence.

The learning engine and deployment are not the open issue in this checkpoint. The remaining work is product-surface convergence with evidence-backed acceptance.