# WS-13 — Parent / Profile / Settings Responsive Redesign

Date: **20 September 2026**  
Status: **MERGED / LIVE VERIFIED**  
Base: `main` = `a3223fa96788c12dcfcce575f0cb8a4e34206793`  
Implementation branch: `agent/ws13-parent-responsive-redesign-20260920`  
PR: **#251**  
Final PR head: `1c2017e28c8c74b6cdf50adad07b59511a3c3d56`  
Merged main: `77bee682f84b5d68b85d2c91b1d6f2ca4c93d2d9`

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
- existing public About, FAQ, Privacy, Terms, and Recommendations/Affiliate routes.

No broken public routes are invented in this wave; settings links only to routes that already exist.

## Regression gates

The canonical mobile-route browser suite is extended to require:

- parent root heading and family/demo separation;
- five primary mobile parent destinations;
- mobile parent navigation pinned to the viewport bottom below 760px;
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
- invent new parent/public routes when an existing canonical route already owns the surface.

## Validation evidence

- PR #251 final head: `1c2017e28c8c74b6cdf50adad07b59511a3c3d56`.
- Exact-head PR CI: **#1159 / run `35520233825` — full success**.
- Manual artifact review: **ACCEPTED** at 320 / 390 / 768 / 1024 with no parent-nav overlap or P0-P1 visual blocker.
- The 768px review caught and fixed an overly narrow two-column hero before merge; the accepted tablet hero stays stacked.
- PR #251 merged to main: `77bee682f84b5d68b85d2c91b1d6f2ca4c93d2d9`.
- Independent merged-main CI: **#1160 / run `35520629179` — full success including exact Cloudflare production smoke**.
- Merged-main responsive QA artifact: **`10608044389`**.
- Canonical browser matrix passed with no unexpected console/page errors or document-level overflow on the gated routes.
- Parent mobile breakpoint is canonicalized at **760px**; legacy MobileFoundation parent-aside forcing was retired.

## Documentation closure

Post-implementation closure:

```text
Closure PR:        #252
Closure head:      163b9c537deaef26dbbf98f73d07b988083f5901
Closure main:      a04bd51fb02dedf56b5cd62f7f579eb53c4be251
Closure main CI:   #1162 / run 35521404941 — full success
```

The implementation itself is already independently live verified through `77bee682...` / CI #1160. A pending docs-only closure run must not be confused with missing runtime verification.
