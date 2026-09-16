# Production Visual / Product Baseline Audit — 2026-09-16

Status: **P0 = 0; P1 = 2 ON MERGED MAIN; VQA-01 + VUI-01 + VUI-02 CLOSED; PATTERN #38 BLOCKED**  
Canonical production: `https://mainlagihub.my.id/`  
Baseline checkpoint merge: `d3d600ed92e78d30da8172e0bdb300119990614f`  
Permanent VQA merge: `9269e9fd576004d7d91fbd840e8c752acc7a5aae`; main CI **#751 / run `35110724150`** including exact Cloudflare smoke  
VUI-01 merge: `e212002eafef77a37a220834c6263e433cf9acbb`; main CI **#758 / run `35115248445`** including exact Cloudflare smoke  
VUI-02 merge: `fe260ba7a239586ca2362fbabfca3e0a5019d453`; main CI **#764 / run `35118210891`** including exact Cloudflare smoke  
Next wave: **VUI-03 Public/Auth/Account convergence**

## Evidence boundary

This audit combines exact repository source, CI/browser screenshot artifacts, route/component review and exact Cloudflare release smoke. Garden learning/activity remains the accepted child-facing visual anchor. Whole-product visual acceptance remains open until P1 reaches zero.

## Current baseline result

Merged-main state after VUI-02 closure:

```text
P0 findings: 0
P1 findings: 2
P2 findings: 3
Garden representative activities: ACCEPTED anchor
Permanent visual QA: CLOSED / BLOCKING
Parent Report VUI-01: CLOSED / LIVE VERIFIED
Stage/Gallery VUI-02: CLOSED / LIVE VERIFIED
Whole-product visual acceptance: NOT YET ACCEPTED
Pattern #38: BLOCKED
```

## P1 findings

### VBASE-P1-01 — visual-token fragmentation — OPEN

Garden/Playroom, `LearningPlatform.module.css`, `globals.css` and migrated scoped modules still represent multiple generations of the product language. Required outcome remains scoped convergence and later targeted consolidation, not a one-shot CSS rewrite.

VUI-01 and VUI-02 intentionally use dedicated scoped modules so presentation can converge without destabilizing accepted activity mechanics. VUI-03 now targets the remaining public/auth/account legacy cluster, especially generic auth styling still sourced from global classes.

### VBASE-P1-02 — parent-report density and internal jargon — CLOSED

Closed by PR #157 merged as `e212002eafef77a37a220834c6263e433cf9acbb`. Independent main CI **#758 / run `35115248445`** passed every job including exact Cloudflare release smoke.

Accepted outcome:
- primary parent report reads in normal family-facing Indonesian;
- underlying report/mastery/evidence values retain original sources and semantics;
- technical vocabulary remains in diagnostic disclosure;
- permanent VQA prevents guarded jargon from returning to the primary report layer;
- manual screenshots accepted at 390 / 768 / 1280.

### VBASE-P1-03 — stage/readiness hierarchy — CLOSED

Closed by PR #158 merged as `fe260ba7a239586ca2362fbabfca3e0a5019d453`.

Baseline defect had two parts:
1. tablet/desktop subject journey used an internal horizontal scroller with partially clipped later-stage cards;
2. StageScreen inherited fixed global card columns, so two-activity lessons left a large unused desktop region.

Accepted VUI-02 outcome:
- stage title/subtitle + existing readiness form one Garden-aligned hero;
- lesson title/objective/progress form explicit groups;
- stage lesson layout uses content-aware columns so one to three activities use available width;
- existing adaptive recommendation is emphasized without changing ranking or order;
- optional motion remains separate and optional;
- phone journey remains horizontal by design;
- tablet/desktop journey becomes a responsive grid without internal horizontal scrolling.

No change was made to readiness calculation, stage gates, prerequisites, mastery, activity answers, curriculum data, lesson/activity ordering semantics or completion requirements.

Closure evidence:

```text
implementation head: 7e85721bf42a1b31605bc87cd58594a8bbc55bd7
implementation CI:   #759 / run 35116294362 — full success
final PR head:        cba874f0b43904999c1ca905137fb092076b9334
final PR CI:          #763 / run 35117490284 — full success
merge main:           fe260ba7a239586ca2362fbabfca3e0a5019d453
main CI:              #764 / run 35118210891 — full success
Cloudflare exact:     success
```

Permanent regression guard remains active for journey scroll width, journey card readability, stage readiness, canonical recommendation marker, lesson-grid overflow and lesson-card minimum width.

### VBASE-P1-04 — public/adult root information architecture — OPEN / NEXT

Exact source + final VUI-02 screenshots confirm the remaining issue.

Root:
- known-child fast resume is correct and uses `readActiveChild()` + `router.replace(childDestination(id))`;
- clean session still renders `HomePage` inside `PlayroomShell`, so navigation and primary framing read as child play mode rather than a deliberate adult/family public entry;
- first decision point does not yet clearly separate child-start from parent/account path or summarize optional camera expectations.

Auth:
- `/login`, `/signup` and `/forgot-password` share the correct `AuthForm` behavior but use generic global `center-page` + `dialog-card` presentation;
- wide desktop screenshots show a small isolated card in a large empty canvas;
- global auth links/focus styling still uses legacy product tokens rather than the scoped family system;
- `/auth/callback` has correct callback/error logic but the same generic visual shell.

Account:
- `/account` is already materially closer to Mainlagi family styling than auth, with branded navigation, green primary action and family language;
- account therefore requires targeted convergence/regression rather than a full rewrite.

Required VUI-03 outcome:
- preserve known-child fast resume;
- provide an explicit clean-session family/public hierarchy;
- separate child-start and parent/account actions;
- state that movement-camera play is optional without inventing unsupported privacy claims;
- move auth surfaces into a shared scoped family shell without changing Supabase operations, session semantics or redirects;
- apply only evidence-backed account polish;
- add permanent 390/768/1280 assertions for the public/auth contract.

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
- Stage recommendation may be emphasized visually, but recommendation source and activity order remain canonical.
- Public/auth convergence must preserve auth/session behavior; visual migration is not authorization to change security semantics.

## P1 remediation order

1. **VUI-03 Public/Auth/Account convergence**.
2. Close residual visual-token fragmentation through scoped migration and targeted cleanup.
3. Add deterministic remaining loading/empty/degraded fixtures where product states exist but cannot yet be captured reliably.
4. Re-run the complete visual matrix until **P0=0 / P1=0**.
5. Only then begin fresh Pattern #38 objective/evidence audit.

## Permanent viewport contract

- 390x844 — primary phone portrait;
- 768x1024 — tablet portrait;
- 1280x800 — desktop/laptop shell acceptance;
- 320px remains supplemental for high-risk child/activity controls;
- motion-game acceptance keeps suitable landscape evidence.

The learning engine and deployment are not the open issue in this checkpoint. The remaining P1 work is public/family entry + residual product-surface token convergence with evidence-backed acceptance.