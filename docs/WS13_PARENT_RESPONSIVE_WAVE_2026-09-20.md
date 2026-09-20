# WS-13 — Parent / Profile / Settings Responsive Redesign

Date: **20 September 2026**  
Status: **IMPLEMENTATION BRANCH / VALIDATION PENDING**  
Base: `main` = `a3223fa96788c12dcfcce575f0cb8a4e34206793`  
Branch: `agent/ws13-parent-responsive-redesign-20260920`

This wave continues the approved product-UX plan after audio first-instruction latency was merged and live verified. Scope is deliberately presentation-only: parent/profile/settings UX is reorganized without changing curriculum, mastery, evidence, progression, database schema, or WS-05 gameplay mechanics.

## Scope

### Responsive parent shell

- Mobile no longer uses the old horizontally scrolling parent navigation.
- Mobile uses a compact sticky parent header plus a fixed five-destination bottom navigation.
- Desktop keeps the canonical parent sidebar.
- Mode anak remains directly reachable but is visually separated from parent destinations.
- Parent content reserves safe-area/bottom-navigation space instead of being covered by navigation.

### Parent overview

Canonical root remains `CloudParentOverviewScreen`.

The dashboard now answers the three accepted parent questions with data that already exists:

1. **What did my child do?** — completed activity count + most recent activity.
2. **How are they progressing?** — recorded completion count and stars only; no invented mastery.
3. **What is next?** — direct actions to the child detail view or the canonical child home where the existing recommendation flow continues.

Real family profiles and `demo-gian` are rendered in separate sections so demo activity cannot be mistaken for family reporting.

### Child identity vs guide character

The parent UI now uses a neutral profile-identity badge derived from the child profile name. Guide characters remain visible as **teman panduan** metadata rather than acting as the child's identity/avatar.

This is a presentation separation only. No profile schema or character ownership changes are introduced.

### Settings

`/parent/settings` is reorganized into:

- language;
- family/profile management;
- privacy & AI;
- product/plan access;
- reserved parent/public information slots for About/FAQ and policy/terms/recommendation surfaces.

No broken public routes are invented in this wave.

## Regression gates

The canonical mobile-route browser suite is extended to require:

- parent root heading and family/demo separation;
- five primary mobile parent destinations;
- mobile parent navigation pinned to the viewport bottom below 720px;
- mobile navigation hidden on desktop layouts;
- minimum readable parent mobile navigation geometry;
- parent settings links to Profiles, Privacy & AI, and Plan;
- existing global no-overflow/no-console-error checks;
- existing canonical responsive matrix.

New parent-root screenshots are requested at 320, 390, 768 and 1024 widths for artifact review.

## Guardrails

This wave does **not**:

- change mastery/evidence contracts;
- alter progression or unlock rules;
- create new learning scores;
- change child-profile storage schema;
- make demo data count as family data;
- expose parent/product links in the child navigation;
- claim About/FAQ/Terms/affiliate routes are complete before those routes exist.

## Validation still required

Before merge:

1. exact-head CI;
2. browser/mobile-route QA;
3. review parent screenshots at 320 / 390 / 768 / 1024;
4. confirm 0 unexpected console errors/warnings on affected canonical routes;
5. confirm no parent nav/content overlap;
6. merge only after the branch is current with `main`;
7. run independent merged-main CI + exact Cloudflare production smoke;
8. then update `CURRENT_STATE.md` and this document to **MERGED / LIVE VERIFIED**.
