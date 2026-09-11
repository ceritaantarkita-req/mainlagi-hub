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
- every content wave follows branch -> PR -> full CI -> migration verification -> live DB verification/advisors -> squash merge -> exact-SHA Cloudflare production smoke;
- post-catalog application-only batches may omit migration/live-DB steps only when schema/catalog persistence is intentionally unchanged and that boundary is documented;
- automated browser/device emulation must not be represented as physical-device acceptance;
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
| 14 | Drawing/Menggambar + Coloring/Mewarnai to 100 each | COMPLETE IN PRODUCTION |
| **15** | **Adaptive/mastery/report scaling across 900 activities** | **COMPLETE IN PRODUCTION** |
| **16** | **Performance/accessibility/security/device QA** | **IN PROGRESS — AUTOMATED HARDENING COMPLETE IN PRODUCTION; PHYSICAL-DEVICE ACCEPTANCE PENDING** |
| 17 | Final acceptance and production closure | PLANNED — BLOCKED ON BATCH 16 CLOSURE |

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

## Current production baseline after Batch 16 automated hardening

Batch 16 does not change the catalog baseline:

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

The planned catalog-count gap remains **0**.

### Batch 15 — Adaptive/mastery/report scaling — COMPLETE

Batch 15 scales recommendations and reporting over the full 900-activity catalog rather than adding activities merely to increase counts.

Closed work:

1. adaptive ranking is regression-validated across all nine subjects, including practice-only creative tracks;
2. assessed mastery remains driven only by qualifying measured evidence;
3. Drawing/Coloring remain recommendation-capable while report mastery stays absent (`null`) and certificate mastery gates remain false;
4. weak-skill remediation can prefer alternate same-skill activities/runtimes over immediate exact replay loops;
5. catalog-scale ranking continues to honor age, stage, difficulty, confidence/evidence state, retry/frustration, spacing/review, completion, and motion opt-in;
6. Parent Progress/Reports use bounded subject/stage/skill projections instead of raw 900-activity dumps;
7. certificate/achievement regression prevents completion-only creative activity from satisfying assessed mastery gates;
8. Batch 15 adds a 1,200-attempt scale regression with bounded report payload `<64 KiB` and conservative report + nine-subject adaptive sweep budget `<5s` in CI.

Implementation/production evidence:

- PR #78;
- PR head `c5ca9c186c810e5ba219169c0dd387d744b13bf7`;
- main SHA `58e5d14633dd3d105f383f56e016c61c9104a892`;
- main CI #312 — success;
- exact-SHA Cloudflare production smoke — success;
- no Supabase migration/DDL required because persistence schema and canonical catalog data are unchanged.

Closure: `EXPANSION_BATCH15_CLOSURE_2026-09-11.md`.

Batch 15 is not a license to reinterpret completion-only evidence as accuracy. Any new objective creative evaluator requires its own reviewed evidence contract.

## Batch 16 — Performance, accessibility, security, device QA — IN PROGRESS

### Automated hardening — COMPLETE IN PRODUCTION

PR #80 shipped the automated Batch 16 foundation to main SHA `8193bccbab8293ec7e30fb4de54a0f86537cfa59`. Main CI #318 is green, including exact-SHA Cloudflare production smoke.

Closed automated work:

1. production JavaScript regression budgets are enforced in CI;
2. the current production baseline is approximately 0.35 MiB largest static chunk, 2.03 MiB total static JS, and 0.42 MiB root/main JS against materially higher explicit ceilings;
3. executable MediaPipe remains behind dynamic-import boundaries and remote TTS is not eagerly initialized before interaction;
4. Chromium QA now includes representative reduced-motion, visible image-alt/form-label, keyboard-focus, `aria-hidden` focusability, and eager vision/TTS network regressions;
5. source/security regression gates constrain client credential exposure, raw-HTML sinks/sanitization, `SECURITY DEFINER` search paths, learning RPC grants, outbox credential storage, and the server-only Supabase service-role helper;
6. dependency audit, full-history secret scan, Ubuntu quality/simulations, Windows compatibility, production build, and responsive route matrix remain green;
7. no Supabase migration/DDL or learning-evidence/catalog change is introduced.

Progress evidence: `EXPANSION_BATCH16_PROGRESS_2026-09-11.md`.

### Representative physical-device acceptance — OPEN

Canonical matrix: `BATCH16_PHYSICAL_DEVICE_QA.md`.

Batch 16 still requires actual recorded evidence on representative physical iPhone/Safari and Android/Chrome hardware for real browser safe areas/orientation/keyboard behavior, finger trace/drawing/coloring input, audio/TTS, camera permission/recovery/alignment, VoiceOver/TalkBack, text scaling, and offline/reconnect/session-isolation flows.

Headless Chromium, responsive desktop mode, and emulator evidence do not by themselves close this requirement.

**Batch 16 remains IN PROGRESS and Batch 17 must not start until the physical-device requirement is satisfied or an explicit reviewed blocker is recorded.**

## Batch 17 — Final acceptance and production closure — PLANNED

Batch 17 remains blocked on Batch 16 closure.

When unblocked, CI must verify final target counts, unique IDs, content references, evidence contracts, adaptive/mastery/outbox regressions, mobile overflow/accessibility/performance/security gates, typecheck/lint/Ubuntu/Windows/simulations/build/audit/secret scan. Then run guest/authenticated/offline/multi-child acceptance, exact-SHA Cloudflare production smoke, and synchronize canonical docs.

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

No batch is production-closed until the requirements relevant to that batch are evidenced:

- target counts and unique-ID/content/evidence contracts pass automated gates where catalog data changes;
- required migrations are applied to canonical Supabase where schema/catalog persistence changes;
- live DB counts match repository contracts where persisted catalog state changes;
- advisor changes are reviewed where DDL/security posture changes;
- PR is merged to `main`;
- final `main` CI is green;
- exact-SHA Cloudflare production smoke succeeds;
- representative physical-device acceptance is recorded when that batch explicitly depends on hardware/browser behavior;
- canonical handoff/coverage/deployment docs are synchronized;
- remaining limitations are documented explicitly.

Iqro engineering closure remains separate from expert approval. Generic Latin tracing remains separate from objectively measured handwriting accuracy. Creative-practice completion remains separate from academic or creative mastery.