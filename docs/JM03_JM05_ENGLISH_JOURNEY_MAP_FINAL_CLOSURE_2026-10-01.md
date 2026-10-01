# JM-03 + JM-04 + JM-05 — Bahasa Inggris Journey Map final closure

Date: **1 October 2026**  
Status: **CLOSED / MERGED / LIVE VERIFIED**  
Workstream: **Phase C — Canonical Journey Map System**

Runtime PR: **#418**  
Runtime head: `1694df8d39dd2ba11a61c2779912388be5d5fdd5`  
Merged main: `bd67e22e9eaced707eb8ef6da5384f7300be2699`  
Merged-main CI: **#2336 / run `36807942571` — FULL SUCCESS**  
Production smoke: **SUCCESS — exact Cloudflare deployment gate passed**

## 1. Scope closed

This package closes the complete Bahasa Inggris reference implementation:

- **JM-03** — clean full-page desktop Journey Map default surface;
- **JM-04** — contextual Stage detail with text-only activity list and Continue learning;
- **JM-05** — responsive portrait/tablet/landscape behavior, mobile bottom sheet, touch/keyboard interaction, and rotation-state preservation.

Only subject `english` moved to the reference Journey Map in this package. The other eight Belajar subjects remain on the existing subject gallery until JM-06 extracts the shared engine.

## 2. Canonical product contract preserved

The Bahasa Inggris Journey Map consumes the existing JM-01 canonical projection and preserves:

- internal subject ID `english`;
- child-facing title **Bahasa Inggris / Inggris**;
- exact **5 canonical Stages**:
  1. `english-first-words`
  2. `english-alphabet-basics`
  3. `english-everyday-words`
  4. `english-words-actions`
  5. `english-phrases-review`
- exact **100-activity** subject membership;
- canonical `completed | current | open | locked` presentation state;
- underlying `locked | in_progress | evidence_needed | ready` progression semantics;
- stable Stage/activity routes;
- age eligibility and lock boundaries in Browse All;
- existing Completion + Share ownership;
- JM-02 `PlayroomShell` as the single shared child-header owner.

No curriculum, Stage membership, readiness/evidence/mastery, database/schema, auth/profile, World, Shop, or creative-workspace semantics changed.

## 3. JM-03 acceptance

The English subject route now opens directly to the Journey Map instead of the legacy activity gallery.

Verified:

- full-page map default;
- no Stage detail popup on initial load;
- exact 5-Stage order;
- one current Stage from canonical state;
- locked Stage presentation preserved;
- JM-02 Back/header ownership preserved;
- no horizontal overflow on desktop/tablet/mobile.

## 4. JM-04 acceptance

Selecting an accessible Stage opens contextual detail.

Verified:

- text-only activity list;
- no activity thumbnails inside Stage detail;
- Stage readiness/progress text;
- **Continue learning** resolves to the next recommended eligible activity;
- Escape closes the dialog;
- Browse All remains available and contains exact 100-activity membership;
- direct activity links remain canonical where playable.

## 5. JM-05 acceptance

Responsive implementation is complete.

Verified:

- portrait uses a vertical map;
- Stage detail becomes a bottom sheet on mobile;
- tablet and landscape remain contained;
- touch and keyboard interaction work;
- minimum touch target contract is preserved;
- selected Stage detail survives portrait → landscape → portrait viewport rotation without document reload or local-state loss;
- reduced-motion and existing shared shell behavior remain compatible.

## 6. Local FAST-SAFE evidence

Local branch verification passed:

- `npm run typecheck`;
- `npm run lint` — **0 errors**; pre-existing warnings only;
- `npm run test:learning:journey-map`;
- `npm run build` on Next.js 16.3.6;
- `npm run test:ui:journey-map-english`;
- `npm run test:ui:mobile-routes` — **PASS / exit 0 / 873.92s**.

The blocking mobile suite included the dedicated JM-03/04/05 contract plus the complete existing regression matrix: 28 canonical routes, 7 viewport widths, Belajar runtime representatives, World, creative workspaces, Completion/Share, accessibility/lazy-load representatives, and browser warning inventory **0**.

## 7. CI / production evidence

Runtime PR #418 was squash-merged to:

```text
main@bd67e22e9eaced707eb8ef6da5384f7300be2699
```

Merged-main CI:

```text
#2336 / run 36807942571
Mobile route QA (Chromium)    SUCCESS
Windows compatibility        SUCCESS
Secret history scan          SUCCESS
Production dependency audit  SUCCESS
Production build             SUCCESS
Quality gate (Ubuntu)        SUCCESS
Production smoke (Cloudflare) SUCCESS
```

Therefore **JM-03, JM-04 and JM-05 are CLOSED / MERGED / LIVE VERIFIED**.

## 8. Next authorized package

Next:

```text
JM-06 — shared Journey Map engine extraction + Bahasa Indonesia
```

JM-06 must preserve English behavior exactly while extracting shared map layout, Stage detail, bottom-sheet/responsive/a11y/state handling into reusable subject-agnostic ownership. Bahasa Indonesia becomes the second consumer. Do not duplicate the English engine and do not start JM-07+ in the same package.
