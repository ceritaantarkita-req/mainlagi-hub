# Mainlagi — Post-Shop Visual Execution Sessions — 27 September 2026

Status: **OWNER-APPROVED EXECUTION OUTLINE / START ONLY AFTER SHOP CLOSURE**

Purpose: convert the approved 27 September visual/product decisions into small,
finishable work sessions. No session should intentionally end with half of one
migration unit complete.

Primary contracts:

- `SHOP_IMPLEMENTATION.md`
- `MAINLAGI_POST_SHOP_CHILD_SURFACE_HANDOFF_2026-09-27.md`
- `MAINLAGI_CANONICAL_COMPLETION_SHARE_VISUAL_SPEC_2026-09-27.md`
- `MAINLAGI_CANONICAL_JOURNEY_MAP_SYSTEM_2026-09-27.md`

## Global sequence

```text
Shop closure
→ PR #360 synchronization / closure
→ Shared Interaction System
   (orientation + character + completion + share)
→ Canonical Journey Map System
   (9 Belajar subjects + Petualangan Uang)
→ integrated production closure
```

Do not reorder these waves.

---

# Documentation audit after final 27 September visual review

The current canonical docs were re-audited after the owner approved the Journey Map
desktop direction and portrait-mobile variants.

Resolved during this sync:

- stale wording in the Completion/Share spec that said no World redesign visual was
  approved is superseded and corrected to point at the Canonical Journey Map spec;
- `PRODUCT_DIRECTION.md` already defines Learning Journey Map + Stage Detail +
  Browse All as the canonical subject UX and now points to the dedicated later wave;
- `MAINLAGI_ART_BIBLE.md` now explicitly covers immersive journey/map surfaces and
  rejects a parallel generic glossy 3D/toy-island art language;
- `CURRENT_STATE.md`, `NEXT_PRODUCT_QUALITY_PLAN.md`, the post-Shop handoff and
  docs index all agree on the sequence Shop → PR #360 → Shared Interaction →
  Journey Map;
- PR #360's 3-column/2-column card-grid contract is intentionally **interim**. It is
  not the final Belajar subject UX once the later Journey Map wave lands;
- the generated journey concepts are composition references only; canonical stage
  truth, cast, assets, evidence/mastery and routes remain repository-controlled.

Historical docs that describe a card/carousel-first subject journey remain historical
evidence and are superseded where they conflict with the 27 September canonical
specs.

Audit result: **no blocking execution-order conflict remains in the canonical
post-Shop visual docs after this sync**.

---

# A. Shop prerequisite

Shop remains governed entirely by `SHOP_IMPLEMENTATION.md`.

Do not use this document to re-plan, widen or interrupt the active Shop release.

Exit before any session below:

- Shop release gates closed;
- Shop merged to latest `main`;
- merged-main CI green;
- production smoke/launch checkpoint recorded.

---

# B. PR #360 foundation closure

## P360-00 — Synchronize PR #360 onto post-Shop main

Scope:

- fetch latest `main`;
- inspect final Shop changes;
- synchronize `agent/child-surface-visual-alignment-20260927`;
- resolve only real conflicts;
- preserve final Shop behavior;
- preserve PR #360 navbar/page-atmosphere/grid intent.

Exit:

- clean ancestry;
- no unresolved conflicts;
- build/test preflight green;
- no merge yet.

## P360-01 — PR #360 QA + merge + production verify

Scope:

- Belajar Home;
- Bermain catalog;
- World catalog;
- navbar order `Belajar | Bermain | World | Shop`;
- desktop/mobile browser QA;
- full CI;
- merge;
- merged-main CI + production smoke;
- docs checkpoint.

Exit:

- PR #360 independently closed;
- exact merged SHA/CI/smoke recorded.

Important: PR #360 card/grid geometry is an **interim foundation**, not the final
Journey Map UX.

---

# C. Shared Interaction System

## SI-00 — Read-only runtime coverage audit

Scope:

- inventory every final-completion path across Belajar, Bermain and World;
- map current completion components;
- map Share implementations;
- map character-placement/name-label sources;
- map orientation-sensitive state owners;
- group Belajar routes by shared renderer/runtime family.

No runtime changes.

Exit:

- exact coverage matrix;
- each later migration batch has known ownership;
- route-specific exceptions identified before coding.

## SI-01 — Orientation-preserving layout substrate

Scope:

- shared orientation/container helpers;
- live portrait/landscape reflow;
- preserve route/game/dialog/modal state;
- no Completion visual migration yet.

Exit:

- orientation change does not reload/reset representative state;
- unit/browser tests green.

## SI-02 — Canonical Character Presentation correction

Scope:

- shared safe-area rules;
- no unintended crop;
- remove floating character-name labels;
- portrait/landscape placement;
- no new character identities/assets.

Exit:

- representative Belajar/World/Bermain character states fully visible;
- no label-under-character regression;
- canonical resolver unchanged.

## SI-03 — Canonical Completion component

Scope:

- implement the approved Completion visual/component;
- praise/stars/status;
- Back | Again | Next;
- Share action;
- responsive portrait/landscape composition;
- no broad runtime migration yet.

Exit:

- component story/test harness complete;
- action contract and responsive geometry green.

## SI-04 — Canonical Share component

Scope:

- implement approved Share modal;
- safe public URL resolver contract;
- Copy Link;
- provider actions;
- Share Device capability fallback;
- open/close state above Completion;
- portrait/landscape composition.

Exit:

- Share component independently green;
- no private child-route/data leakage.

## SI-05 — Belajar pilot runtime integration

Scope:

- select one representative common Belajar runtime family from SI-00;
- migrate final completion to canonical Completion + Share;
- consume corrected Character Presentation;
- preserve attempt/evidence semantics.

Exit:

- pilot runtime family complete end-to-end;
- no duplicate writes;
- desktop/portrait/landscape QA green.

## SI-06+ — Belajar runtime-family migration batches

SI-00 determines the exact number of these sessions.

Sizing rule:

- one shared renderer/runtime family per session; or
- at most 10 route-specific exceptions if they genuinely cannot share a renderer.

Each session must finish its whole declared batch.

Exit for every batch:

- all declared routes migrated;
- final Completion consistent;
- Share consistent;
- orientation state preserved;
- evidence/mastery unchanged;
- batch regression green.

Do not create one 900-activity migration session.

## SI-07 — Bermain games 1–3

Scope:

- first three existing Main Gerak/Bermain games;
- canonical Completion/Share/Character behavior;
- orientation state preservation.

Exit:

- all three complete and green.

## SI-08 — Bermain games 4–6

Same contract; only games 4–6.

Exit:

- all three complete and green.

## SI-09 — Bermain games 7–10

Same contract; only games 7–10.

Exit:

- all four complete and green.

## SI-10 — Petualangan Uang interaction migration

Scope:

- World story/activity/stage/finale completion;
- canonical Completion + Share;
- canonical character safe areas;
- preserve World evidence/progression/story semantics.

Exit:

- Petualangan Uang interaction system migrated;
- no map redesign yet;
- World tests green.

## SI-11 — Shared Interaction integrated closure

Scope:

- cross-domain coverage audit;
- portrait/landscape orientation transitions;
- Completion-open rotation;
- Share-open rotation;
- character containment;
- privacy;
- full CI;
- merge;
- merged-main production smoke;
- docs checkpoint.

Exit:

- Shared Interaction System independently production-verified.

---

# D. Canonical Journey Map System

Detailed visual/product contract:
`MAINLAGI_CANONICAL_JOURNEY_MAP_SYSTEM_2026-09-27.md`.

## JM-00 — Read-only exact map audit

All nine subjects + Petualangan Uang, exact stage data/routes/assets. No runtime changes.

## JM-01 — Shared journey data/state foundation

Types/adapters/stage states only. No visual migration.

## JM-02 — Immersive Mainlagi map header

Game-like lightweight header/HUD only.

## JM-03 — Bahasa Inggris desktop clean-map pilot

Full-page default map only. No stage-detail UI yet.

## JM-04 — Bahasa Inggris stage-open interaction

Contextual detail, text-first activity list, no mini-game thumbnails.

## JM-05 — Bahasa Inggris responsive orientation

Phone portrait, phone landscape, tablet, bottom sheet, state-preserving rotation.

## JM-06 — Shared engine extraction + Bahasa Indonesia proof

Remove English assumptions and prove a second subject.

## JM-07 — Matematika

One subject, end-to-end.

## JM-08 — Iqro

One subject, end-to-end.

## JM-09 — Huruf & Menulis

One subject, end-to-end.

## JM-10 — Logika

One subject, end-to-end.

## JM-11 — Sains

One subject, end-to-end.

## JM-12 — Mewarnai

One subject, end-to-end; preserve creative-workspace boundaries.

## JM-13 — Menggambar

One subject, end-to-end; preserve creative-workspace boundaries.

## JM-14 — Belajar nine-subject regression closure

All nine maps, routes, stage truth, Browse All, responsive QA.

## JM-15 — Petualangan Uang read-only adapter audit

Exact eight-stage/evidence/story/cast mapping. No visual change.

## JM-16 — Petualangan Uang desktop redesign

Full-page World adventure map; no evidence/story semantic changes.

## JM-17 — Petualangan Uang responsive orientation

Portrait + landscape + character safe areas + selected-stage state.

## JM-18 — Integrated journey-map production closure

Belajar + World regression, full CI, merge, production smoke, docs/screenshots.

---

# E. Session sizing / anti-half-finished rule

Every session must satisfy all of these:

1. one dominant goal;
2. declared route/component batch is small enough to finish in the session;
3. no unrelated backend/schema/product refactor;
4. tests and targeted browser QA happen before session exit;
5. working tree/branch is left at a clean checkpoint;
6. if new scope appears, stop **before** starting that scope and create the next
   session instead;
7. never intentionally stop with half a subject, half a game batch, or half a shared
   renderer migrated.

If a planned session proves too large during preflight, split it before mutation.

---

# F. Non-negotiable boundaries across all sessions

Do not change merely for visual convenience:

- curriculum/content truth;
- stage ordering/membership;
- age readiness;
- attempt semantics;
- evidence/mastery;
- reward meaning;
- World evidence/story progression;
- Motion Engine mechanics;
- Shop transaction/provider behavior;
- database schema without separate authorization.

Generated visual samples are composition references only. Canonical repo data,
canonical character assets/cast and authored content always win over accidental
generated mockup details.
