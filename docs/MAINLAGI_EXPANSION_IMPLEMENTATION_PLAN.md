# Mainlagi Expansion Implementation Plan

Last reviewed: 11 September 2026

This is the canonical repository plan for scaling Mainlagi across nine structured learning/creative tracks and the post-catalog learning-system phases. `main` remains the implementation source of truth; this document defines sequencing, evidence boundaries, and closure rules.

## Product target — catalog achieved

The planned content target is now **complete in production: 900 meaningful playable activities** across:

- Math — 100
- Bahasa Indonesia — 100
- English — 100
- Iqro — 100
- Letters/Menulis — 100
- Logic/Logika — 100
- Science/Sains — 100
- Drawing/Menggambar — 100
- Coloring/Mewarnai — 100

Seven academic subjects account for 700 activities; Drawing + Coloring account for 200 creative-practice activities.

A distinct activity requires meaningful educational or interaction variation. Answer shuffling, cosmetic changes, or decorative asset swaps do not create a new count by themselves.

## Engineering rules

- mobile release widths remain 320, 360, 375, 390, and 430 px;
- core learning remains touch-first; camera remains optional;
- completion-only participation never manufactures academic accuracy;
- assessed activities require validated measurable evidence;
- measured all-wrong outcomes remain accuracy `0`; missing measurement fails closed;
- trivial replay/variant farming must not accelerate mastery;
- historical IDs remain stable;
- every activity needs valid subject/path/stage/lesson/pack ownership, age/difficulty metadata, skill mapping, mechanic, and evidence metadata;
- Iqro packs remain `expert_required` until competent human approval; engineering success is not expert religious-learning approval;
- generic Latin tracing remains practice-only until a validated glyph-shape fidelity evaluator exists;
- science activities remain age-appropriate and do not depend on unsafe unsupervised experiments;
- Drawing/Coloring remain practice/reporting activities unless a separately validated objective evidence contract is introduced;
- migrations are additive/idempotent unless an explicitly reviewed corrective migration requires otherwise;
- every wave follows branch -> PR -> full CI -> migration verification -> live DB verification/advisors -> squash merge -> exact-SHA Cloudflare production smoke;
- target floors rise only when real playable instances exist and pass validation.

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
| **14** | **Drawing/Menggambar + Coloring/Mewarnai to 100 each** | **COMPLETE IN PRODUCTION** |
| **15** | **Adaptive/mastery/report scaling across 900 activities** | **NEXT** |
| 16 | Performance/accessibility/security/device QA | PLANNED |
| 17 | Final acceptance and production closure | PLANNED |

## Completed expansion sequence

### Batches 7–11

- Batch 7 — Math entered with 7 historical activities; Wave A added 18 and Waves B–D added 25 each. Closure: `EXPANSION_BATCH7_CLOSURE_2026-09-10.md`.
- Batch 8 — Bahasa Indonesia entered with 6 historical activities; Wave A added 19 and Waves B–D added 25 each. Closure: `EXPANSION_BATCH8_CLOSURE_2026-09-10.md`.
- Batch 9 — English entered with 6 historical activities; Wave A added 19 and Waves B–D added 25 each. Closure: `EXPANSION_BATCH9_CLOSURE_2026-09-10.md`.
- Batch 10 — Iqro entered with 4 historical activities and added 96 through `0027`–`0030`; closes at 99 assessed / 1 historical practice. Active Iqro packs remain `expert_required`. Closure: `EXPANSION_BATCH10_CLOSURE_2026-09-10.md`.
- Batch 11 — Letters/Menulis entered with 3 historical activities and added 97 through `0031`–`0034`; closes at 87 assessed / 13 practice. Generic formation traces remain `completion_only_v1`. Closure: `EXPANSION_BATCH11_CLOSURE_2026-09-11.md`.

### Batch 12 — Logic/Logika to 100 — COMPLETE

Logic entered with 3 historical assessed activities and added 97 measured assessed activities across `22 + 25 + 25 + 25`. Final implementation SHA: `553b9e28f91feefa9af9c2995f2f7e913bf31491`; closes at **100 assessed / 0 practice**. Closure: `EXPANSION_BATCH12_CLOSURE_2026-09-11.md`.

### Batch 13 — Science/Sains to 100 — COMPLETE

Science entered with 3 historical assessed activities and added 97 measured assessed activities across `22 + 25 + 25 + 25`. Final implementation SHA: `e35d211ada182e0c5379da7b9b33614309994852`; closes at **100 assessed / 0 practice**. Closure: `EXPANSION_BATCH13_CLOSURE_2026-09-11.md`.

### Batch 14 — Drawing + Coloring to 100 each — COMPLETE

Batch 14 introduced Drawing as a first-class track and preserved two historical Coloring activities. It added exactly **198 creative-practice activities**: Drawing 100 + Coloring 98.

- [x] Wave A — Drawing 0 -> 25, Coloring 2 -> 25, +48; PR #73; migration `0043`; main SHA `f27ea5b047e657e896d991656bfe64cdb215c84e`; main CI #301.
- [x] Wave B — both 25 -> 50, +50; PR #74; migration `0044`; main SHA `62e88a5f696d2b4eb2e691298671e137e91caa30`; main CI #304.
- [x] Wave C — both 50 -> 75, +50; PR #75; migration `0045`; main SHA `e120d1fa098ff9f1a7949ba3d1ffa0dee00d312c`; main CI #306.
- [x] Wave D — both 75 -> 100, +50; PR #76; migration `0046`; main SHA `b273edc282261bbec89b0c3d438822204cd925e5`; main CI #308.

All four post-merge runs passed exact-SHA Cloudflare production smoke. Every Batch 14 addition is `practice` + `completion_only_v1`; creative participation does not become objective mastery. Closure: `EXPANSION_BATCH14_CLOSURE_2026-09-11.md`.

## Current production baseline after Batch 14

- **900 playable activities**;
- **683 assessed / 217 practice**;
- 9 first-class subjects / 9 paths;
- 46 stages;
- 197 lessons;
- 197 content packs;
- 200 skills;
- 8 manifest mechanics;
- every subject exactly 100 activities;
- Drawing 100 practice-only;
- Coloring 100 practice-only.

The planned catalog-count gap is now **0**.

## Batch 15 — Adaptive/mastery/report scaling — NEXT

Batch 15 should scale recommendations and reporting over the full 900-activity catalog rather than add more activities merely to increase counts.

Primary work:

1. validate adaptive ranking across all nine subjects, including practice-only creative tracks;
2. keep assessed mastery driven only by qualifying measured evidence;
3. keep Drawing/Coloring recommendations useful without fabricating mastery scores;
4. improve weak-skill remediation using alternate activities/mechanics instead of exact replay loops;
5. validate confidence/evidence spacing, age, stage, difficulty, frustration/retry, and motion preferences at catalog scale;
6. ensure Parent Progress/Reports summarize hundreds of activities by skill/stage/subject rather than dumping raw activity lists;
7. regression-test certificate/achievement qualification so completion-only creative activity cannot satisfy academic mastery gates;
8. benchmark query/payload behavior introduced by larger mastery/recommendation sets before Batch 16.

Batch 15 is not a license to reinterpret completion-only evidence as accuracy. Any new objective creative evaluator requires its own reviewed evidence contract.

## Batch 16 — Performance, accessibility, security, device QA

Audit catalog payload size, route/mechanic code splitting, assets, initial JS, TTS initialization, query volume, accessibility, RLS/ownership/RPC/outbox/dependency/secret/advisor checks, and representative physical-device mobile/camera/audio/trace flows.

## Batch 17 — Final acceptance and production closure

CI must verify final target counts, unique IDs, content references, evidence contracts, adaptive/mastery/outbox regressions, mobile overflow gates, typecheck/lint/Ubuntu/Windows/simulations/build/audit/secret scan. Then run guest/authenticated/offline/multi-child acceptance, exact-SHA Cloudflare production smoke, and synchronize canonical docs.

## Content-wave rule

```text
Wave A: canonical count 1–25
Wave B: canonical count 26–50
Wave C: canonical count 51–75
Wave D: canonical count 76–100
```

Existing validated activities count toward boundaries. Never add 25 blindly on top of a non-zero baseline.

Completed entry baselines:

- Math 7 -> Wave A +18;
- Bahasa 6 -> Wave A +19;
- English 6 -> Wave A +19;
- Iqro 4 -> Wave A +21;
- Letters 3 -> Wave A +22;
- Logic 3 -> Wave A +22;
- Science 3 -> Wave A +22;
- Coloring 2 -> Wave A +23;
- Drawing 0 -> Wave A +25 after first-class ownership/evidence architecture was added.

## Production closure rule

No batch is production-closed until:

- target counts and unique-ID/content/evidence contracts pass automated gates;
- required migrations are applied to canonical Supabase;
- live DB counts match repository contracts;
- advisor changes are reviewed;
- PR is merged to `main`;
- final `main` CI is green;
- exact-SHA Cloudflare production smoke succeeds;
- canonical handoff/coverage/deployment docs are synchronized;
- remaining limitations are documented explicitly.

Iqro engineering closure remains separate from expert approval. Generic Latin tracing remains separate from objectively measured handwriting accuracy. Creative-practice completion remains separate from academic or creative mastery.
