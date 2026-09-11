# Mainlagi Expansion Implementation Plan

Last reviewed: 11 September 2026

This is the canonical repository plan for scaling Mainlagi across nine structured learning/creative tracks and the post-catalog learning-system phases. `main` remains the implementation source of truth.

## Product target — catalog achieved

The planned content target is complete in production: **900 meaningful playable activities** across nine tracks, each exactly 100 activities.

Canonical catalog baseline:

- 900 activities = 683 assessed / 217 practice;
- 9 subjects / 9 paths;
- 46 stages;
- 197 lessons / 197 packs;
- 200 skills;
- 8 reusable manifest mechanics.

The post-catalog phases must improve system quality without inflating activity counts or weakening evidence integrity.

## Engineering rules

- mobile release widths remain 320, 360, 375, 390, and 430 px;
- core learning remains touch-first; camera remains optional;
- completion-only participation never manufactures academic accuracy;
- assessed activities require validated measurable evidence;
- measured all-wrong outcomes remain accuracy `0`; missing measurement fails closed;
- trivial replay/variant farming must not accelerate mastery;
- historical IDs remain stable;
- Iqro packs remain `expert_required` until competent human approval;
- generic Latin tracing remains practice-only until a validated glyph-shape fidelity evaluator exists;
- Science remains age-appropriate and does not depend on unsafe unsupervised experiments;
- Drawing/Coloring remain practice/reporting activities unless a separately validated objective evidence contract is introduced;
- migrations are additive/idempotent when persistence changes; do not create no-op migrations merely to assign a batch number;
- each production batch follows branch -> PR -> full CI -> persistence/live verification as applicable -> squash merge -> exact-SHA Cloudflare production smoke -> synchronized closure docs;
- recommendation policy must not mutate mastery merely to implement review spacing or product prioritization.

## Batch status

| Batch | Scope | Status |
| --- | --- | --- |
| 0 | Baseline, metrics, acceptance contracts | COMPLETE |
| 1 | Mobile design-system foundation | COMPLETE |
| 2 | Mobile route migration + Chromium QA | COMPLETE |
| 3 | AudioManager / voice latency architecture | COMPLETE |
| 4 | Scalable content architecture | COMPLETE IN PRODUCTION |
| 5 | Reusable mechanic library | COMPLETE IN PRODUCTION |
| 6 | Letters/Logic/Science foundations | COMPLETE IN PRODUCTION |
| 7 | Math to 100 | COMPLETE IN PRODUCTION |
| 8 | Bahasa Indonesia to 100 | COMPLETE IN PRODUCTION |
| 9 | English to 100 | COMPLETE IN PRODUCTION |
| 10 | Iqro to 100 | ENGINEERING/CATALOG COMPLETE IN PRODUCTION — EXPERT REVIEW STILL REQUIRED |
| 11 | Letters/Menulis to 100 | COMPLETE IN PRODUCTION |
| 12 | Logic/Logika to 100 | COMPLETE IN PRODUCTION |
| 13 | Science/Sains to 100 | COMPLETE IN PRODUCTION |
| 14 | Drawing/Menggambar + Coloring/Mewarnai to 100 each | COMPLETE IN PRODUCTION |
| **15** | **Adaptive/mastery/report scaling across 900 activities** | **COMPLETE IN PRODUCTION** |
| **16** | **Performance/accessibility/security/device QA** | **NEXT** |
| 17 | Final acceptance and production closure | PLANNED |

## Completed catalog expansion sequence

Batches 7–14 completed the planned nine-track catalog. Historical closure files remain the detailed evidence source:

- `EXPANSION_BATCH7_CLOSURE_2026-09-10.md`
- `EXPANSION_BATCH8_CLOSURE_2026-09-10.md`
- `EXPANSION_BATCH9_CLOSURE_2026-09-10.md`
- `EXPANSION_BATCH10_CLOSURE_2026-09-10.md`
- `EXPANSION_BATCH11_CLOSURE_2026-09-11.md`
- `EXPANSION_BATCH12_CLOSURE_2026-09-11.md`
- `EXPANSION_BATCH13_CLOSURE_2026-09-11.md`
- `EXPANSION_BATCH14_CLOSURE_2026-09-11.md`

Batch 14 is the final content-count expansion. It closes the target at 900 activities while preserving Drawing/Coloring as completion-only creative practice.

## Batch 15 — Adaptive/mastery/report scaling — COMPLETE

Final implementation:

- PR #78;
- PR head `c5ca9c186c810e5ba219169c0dd387d744b13bf7`;
- PR CI #311 — full green;
- main implementation SHA `58e5d14633dd3d105f383f56e016c61c9104a892`;
- main CI #312 — full green including exact-SHA Cloudflare production smoke;
- no Supabase migration/DDL required; migration chain remains through `0046`.

Shipped scope:

1. **One Adaptive V2 recommendation policy** across child landing, child path, Parent Progress, and Parent Reports.
2. **Catalog-scale progression/ranking optimization**: stage unlock is evaluated once per stage, static catalog descriptors are reused, and attempts are indexed per skill instead of repeatedly filtered for every candidate.
3. **Remediation diversity**: weak measured evidence prefers a different same-skill activity; a different runtime/mechanic receives an additional diversity boost; exact recent replay is penalized.
4. **Confidence and spaced review**: low-confidence evidence can trigger evidence-building; proficient/mastered skills can return after spacing without decaying or rewriting mastery.
5. **Frustration-aware soft difficulty** using recent measured accuracy, retries, hints, and interruptions while age/stage/motion remain hard gates.
6. **Creative integrity**: Drawing/Coloring remain recommendation-capable but do not read or manufacture mastery; completion-only creative completion cannot satisfy academic certificate mastery gates.
7. **Bounded Parent projections**: one row per subject, assessed-only mastery summaries, stage status counts, per-subject recommendation, weekly assessed/practice split, and capped recent attempts.
8. **Catalog-scale CI benchmark**: 1,200 synthetic attempts plus a 9-subject recommendation/report sweep. PR CI #311 measured **72.8 ms** and a **7,937-byte** serialized report against guards of 5 seconds / 64 KiB.

Live Supabase state after the behavioral release remained exactly 900 activities / 683 assessed / 217 practice / 197 packs / 200 skills, with zero creative integrity/runtime drift.

Detailed closure: `EXPANSION_BATCH15_CLOSURE_2026-09-11.md`.

## Batch 16 — Performance, accessibility, security, device QA — NEXT

Batch 16 is a validation/hardening phase, not a new content-count phase.

Primary work:

1. audit production-route JS/payload size, dynamic loading/code splitting, content payload materialization, asset weight, TTS initialization, and query/network volume;
2. exercise WCAG-oriented keyboard/focus/labels/contrast/reduced-motion semantics on canonical child/parent routes;
3. re-audit RLS, child ownership/isolation, `record_learning_attempt` RPC boundary, outbox replay/account binding, dependency audit, secret history, and Supabase advisors;
4. perform representative physical-device acceptance for touch, camera/gesture, audio/TTS fallback, trace/drawing/coloring canvas, orientation/responsive layout, and low-power/mobile behavior;
5. verify offline -> reconnect reconciliation and multi-child/account isolation with controlled authenticated test profiles;
6. preserve Batch 15 recommendation/mastery/report benchmark as a regression gate while measuring real route/runtime performance;
7. document platform limitations separately from code defects; do not mark physical-device or account-level checks complete without actually exercising them.

## Batch 17 — Final acceptance and production closure

After Batch 16 hardening, Batch 17 must run the full final acceptance matrix: catalog/evidence contracts, adaptive/mastery/outbox regressions, responsive/mobile gates, guest/authenticated/offline/multi-child flows, build/security gates, exact-SHA Cloudflare production smoke, and final canonical documentation synchronization.

## Production closure rule

No batch is production-closed until:

- its defined behavior/contracts pass automated gates;
- required persistence changes, if any, are applied to canonical Supabase;
- live state is verified against repository contracts;
- advisor changes are reviewed;
- PR is merged to `main`;
- final `main` CI is green;
- exact-SHA Cloudflare production smoke succeeds;
- canonical handoff/coverage/deployment docs are synchronized;
- remaining limitations are documented explicitly.

Iqro engineering closure remains separate from expert approval. Generic Latin tracing remains separate from objectively measured handwriting accuracy. Creative-practice completion remains separate from academic or creative mastery.
