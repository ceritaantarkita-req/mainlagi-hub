# Mainlagi Expansion Implementation Plan

Last reviewed: 11 September 2026

This is the canonical sequencing and closure plan for the nine-track Mainlagi expansion and post-catalog learning-system work. `main` remains the implementation source of truth.

## Product target — achieved

The planned catalog target is complete in production: **900 meaningful playable activities**, exactly 100 each for Math, Bahasa Indonesia, English, Iqro, Letters/Menulis, Logic/Logika, Science/Sains, Drawing/Menggambar, and Coloring/Mewarnai.

Final catalog baseline:

- 9 subjects / 9 paths;
- 46 stages;
- 197 lessons;
- 197 content packs;
- 900 activities;
- 683 assessed / 217 practice;
- 200 skills;
- 8 manifest mechanics.

## Engineering rules

- release-critical phone widths remain 320, 360, 375, 390, and 430 px;
- touch is the core interaction; camera remains optional;
- completion-only participation never becomes academic accuracy/mastery;
- measured all-wrong remains accuracy `0`; missing measurement fails closed;
- replay/retry farming must not accelerate mastery;
- historical IDs remain stable;
- Iqro remains `expert_required` until competent human approval;
- generic Latin tracing remains practice-only until a validated shape evaluator exists;
- Drawing/Coloring remain practice/reporting activities unless a separately validated objective evidence contract is introduced;
- science remains age-appropriate and does not depend on unsafe unsupervised experiments;
- migrations are additive/idempotent unless a reviewed correction requires otherwise;
- application-only batches may omit migration/live-DB mutation steps only when persistence is intentionally unchanged;
- headless browser/device emulation must never be represented as physical-device acceptance;
- no batch is fully closed without the evidence relevant to that batch.

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
| 10 | Iqro to 100 | ENGINEERING/CATALOG COMPLETE IN PRODUCTION — EXPERT REVIEW OPEN |
| 11 | Letters/Menulis to 100 | COMPLETE IN PRODUCTION |
| 12 | Logic/Logika to 100 | COMPLETE IN PRODUCTION |
| 13 | Science/Sains to 100 | COMPLETE IN PRODUCTION |
| 14 | Drawing + Coloring to 100 each | COMPLETE IN PRODUCTION |
| 15 | Adaptive/mastery/report scaling | COMPLETE IN PRODUCTION |
| 16 | Performance/accessibility/security/device QA | AUTOMATED HARDENING COMPLETE IN PRODUCTION — PHYSICAL DEVICE EVIDENCE PENDING |
| 17 | Final acceptance and production closure | ENGINEERING ACCEPTANCE COMPLETE IN PRODUCTION — FULL PRODUCT ACCEPTANCE PENDING ISSUE #83 |

## Completed catalog expansion

- Batch 7 Math: historical 7 -> 100. Closure: `EXPANSION_BATCH7_CLOSURE_2026-09-10.md`.
- Batch 8 Bahasa: historical 6 -> 100. Closure: `EXPANSION_BATCH8_CLOSURE_2026-09-10.md`.
- Batch 9 English: historical 6 -> 100. Closure: `EXPANSION_BATCH9_CLOSURE_2026-09-10.md`.
- Batch 10 Iqro: historical 4 -> 100. Engineering/catalog closure: `EXPANSION_BATCH10_CLOSURE_2026-09-10.md`; expert approval remains separate.
- Batch 11 Letters: historical 3 -> 100. Closure: `EXPANSION_BATCH11_CLOSURE_2026-09-11.md`.
- Batch 12 Logic: historical 3 -> 100. Final SHA `553b9e28f91feefa9af9c2995f2f7e913bf31491`.
- Batch 13 Science: historical 3 -> 100. Final SHA `e35d211ada182e0c5379da7b9b33614309994852`.
- Batch 14 Creative: Drawing 0 -> 100, Coloring 2 -> 100. Final SHA `b273edc282261bbec89b0c3d438822204cd925e5`; every added creative activity is `practice` + `completion_only_v1`.

The planned catalog-count gap is **0**.

## Batch 15 — adaptive/mastery/report scaling — complete

Production evidence:

- PR #78;
- main SHA `58e5d14633dd3d105f383f56e016c61c9104a892`;
- main CI #312 — success;
- exact-SHA Cloudflare smoke — success;
- no DDL.

Closed contracts include nine-subject Adaptive Learning V2 coverage, alternate same-skill remediation, bounded Parent reporting, no synthetic creative mastery, certificate/mastery protection for completion-only activity, and a 1,200-attempt scale regression with `<64 KiB` Parent-report payload and `<5s` report + nine-subject adaptive sweep budget.

## Batch 16 — automated hardening complete; device acceptance open

Automated implementation:

- PR #80;
- main SHA `8193bccbab8293ec7e30fb4de54a0f86537cfa59`;
- main CI #318 — success;
- exact-SHA Cloudflare smoke — success;
- no DDL/catalog/evidence-classification change.

Closed automated work:

1. explicit production JS budgets;
2. MediaPipe dynamic/lazy loading and non-eager remote TTS guards;
3. Chromium reduced-motion, alt/form-label, keyboard-focus, `aria-hidden`, overflow, touch-target, and eager-network regressions;
4. source-security checks for credential boundaries, raw HTML/sanitization, SECURITY DEFINER search paths, RPC grants, account-bound credential-free outbox, and server-only service-role usage;
5. dependency audit and full-history secret scanning remain green.

Current production JS baseline: largest static chunk 0.35 MiB, total static JS 2.03 MiB, root/main JS 0.42 MiB.

Canonical physical-hardware matrix remains `BATCH16_PHYSICAL_DEVICE_QA.md`. Actual physical iPhone/Safari and Android/Chrome evidence is still pending and is tracked by issue #83.

## Batch 17 — engineering acceptance complete in production

Implementation:

- PR #82;
- main SHA `d27b32124d3df1613c648132aa2f1ff0ed94ebaa`;
- main CI #322 — all seven release jobs success;
- exact-SHA Cloudflare production smoke — success;
- final acceptance contract — PASS;
- no DDL/catalog/evidence-classification change.

`test:batch17:final` permanently locks:

- final counts and unique IDs;
- exact content-pack coverage;
- assessed/practice and runtime inventories;
- creative evidence boundaries;
- curriculum coverage;
- learning/outbox/isolation/adaptive/mastery/report test wiring;
- Batch 16 security/build/browser gate wiring;
- required CI job topology;
- commit-aware production smoke contract.

The final gate reports physical-device certification separately as `PENDING_EXTERNAL_EVIDENCE` rather than fabricating hardware acceptance.

Detailed evidence: `EXPANSION_BATCH17_ENGINEERING_ACCEPTANCE_2026-09-11.md`.

## Batch 17 live Supabase verification

Canonical project `estvtgflwkebomsqlolv` is `ACTIVE_HEALTHY` and matches repository contracts exactly:

- 900 active + unique activities;
- 683 assessed / 217 practice;
- 9 subjects, exactly 100 each;
- 46 distinct stages;
- 197 distinct lessons;
- 197 active/unique/referenced content packs;
- 200 active/unique skills;
- exact runtime inventory;
- creative evidence/runtime drift = 0.

Live RLS is enabled on account/learning ownership tables, `learning_attempt_child_ownership` remains installed, and `record_learning_attempt(...)` remains SECURITY DEFINER with `search_path=public`, authenticated execution allowed, anon/public execution denied.

Security advisors remain at the two known WARN categories; performance advisor has 17 `unused_index` INFO observations and no WARN regression.

## Remaining external acceptance — issue #83

All code/repository/CI/Cloudflare/Supabase work in this implementation plan is complete. Full product acceptance remains open only for evidence/actions that cannot be truthfully generated by headless CI or this connector surface:

1. physical-device QA recorded in `BATCH16_PHYSICAL_DEVICE_QA.md` on representative iPhone/Safari and Android/Chrome hardware;
2. GitHub repository Settings adds `Secret history scan` to the active `Protect main` required-status checks, or an explicit governance exception is reviewed and documented.

Canonical tracker: issue #83, `Final external acceptance: physical-device QA and required secret-scan check`.

## Production closure rule

A scope may be called complete only when its relevant conditions are evidenced:

- target counts/IDs/references/evidence contracts pass automated gates where applicable;
- migrations/live DB verification are performed where persistence changes;
- live DB/advisors are reviewed where relevant;
- implementation PR is merged;
- final `main` CI is green;
- exact-SHA Cloudflare smoke succeeds;
- physical-device evidence exists when the scope explicitly depends on physical hardware/browser behavior;
- canonical docs are synchronized;
- remaining external limitations are explicit.

Iqro expert approval remains separate from engineering closure. Generic Latin handwriting accuracy remains separate from completion-only tracing. Creative completion remains separate from objective mastery.