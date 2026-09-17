# Mainlagi Hub Documentation Index

Last reviewed: **17 September 2026**

Use this file to decide which documentation is current and which files are historical snapshots.

## Canonical current documents

Read these first for current work:

1. [`NEXT_PRODUCT_QUALITY_PLAN.md`](NEXT_PRODUCT_QUALITY_PLAN.md) — current execution order, workstreams, status and mandatory gates.
2. [`CURRENT_STATE.md`](CURRENT_STATE.md) — current repository/product/production baseline.
3. [`PRODUCTION_VISUAL_PRODUCT_BASELINE_2026-09-16.md`](PRODUCTION_VISUAL_PRODUCT_BASELINE_2026-09-16.md) — active production visual/product audit and P0/P1/P2 state.
4. [`MAINLAGI_ART_BIBLE.md`](MAINLAGI_ART_BIBLE.md) — canonical visual direction.
5. [`MOBILE_ROUTE_QA.md`](MOBILE_ROUTE_QA.md) — blocking browser route and permanent visual QA contract.
6. [`ARCHITECTURE.md`](ARCHITECTURE.md) — current technical boundaries and system architecture.
7. [`MAINLAGI_LEARNING_PLATFORM_UX_SPEC.md`](MAINLAGI_LEARNING_PLATFORM_UX_SPEC.md) — child/product/UX/activity rules.
8. [`LEARNING_ATTEMPTS_MASTERY.md`](LEARNING_ATTEMPTS_MASTERY.md) — evidence/mastery/progression contract.
9. [`GAMEPLAY_VARIATION_CATALOG.md`](GAMEPLAY_VARIATION_CATALOG.md) — canonical gameplay-pattern catalog and WS-05 boundaries.
10. [`PRODUCT_DIRECTION.md`](PRODUCT_DIRECTION.md) — product principles and direction.
11. [`KNOWN_LIMITATIONS.md`](KNOWN_LIMITATIONS.md) — current known limitations and external acceptance gaps.

Subsystem docs remain authoritative for their specific scope when they do not conflict with the canonical documents above.

## Current execution checkpoint

Pattern #39 `visual_word_problem` is **FULLY CLOSED**. Its implementation is live on main `bcb8479514f44d46ebc68917981699240aabc3b2` with CI #809 / run `35187506724`, and its docs/live closure was merged by PR #171 to `98725727c866d410b2d0caa206e86e70cd0e5741`; final main CI #811 / run `35190499794` passed the full matrix including exact Cloudflare release/public smoke.

Its exact scope is five Math visual story-problem activities. Merged-main gameplay distribution remains **900/900 classified, 39 active patterns, 0 unclassified**, with `choice_grid` 267/900 and `visual_word_problem` 5/900.

The next gameplay step is a fresh Pattern #40 objective/evidence audit with no mechanic, subject or activity family pre-approved.

Pattern #38 `cloze_sentence_choice` is **FULLY CLOSED** via implementation PR #166 and closure PR #168. Final closure main `86e6b69d576d72fec73158a7a1c6d8961de36887` passed CI #803 / run `35180530822` including exact Cloudflare smoke.

The production visual P1 checkpoint remains closed:

```text
P0 = 0
P1 = 0
P2 = 3
Permanent visual QA = 21 routes / 63 captures / BLOCKING
Pattern #38 = FULLY CLOSED
Pattern #39 = FULLY CLOSED / LIVE VERIFIED
```

## Pattern #39 verified closure chain

- objective/evidence audit PR #169;
- implementation PR #170 head `df503b95abf86e2b530dd9ff18bd5d8b9707e2db`;
- implementation squash merge/main `bcb8479514f44d46ebc68917981699240aabc3b2`;
- implementation main CI #809 / run `35187506724` — full success including exact Cloudflare smoke;
- responsive QA at 320x720, 390x844 and 768x1024 across idle/wrong/success;
- merged-main gameplay-distribution artifact `10482459288`, digest `sha256:4bacc984852eb4befd352a727935daf8e75cb0b30ec1a58af8451895649ae967`;
- closure PR #171;
- closure main `98725727c866d410b2d0caa206e86e70cd0e5741`;
- final main CI #811 / run `35190499794` — full success including exact Cloudflare release/public smoke.

## Closure/evidence records

- [`PATTERN39_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`](PATTERN39_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md) — historical pre-implementation Pattern #39 audit and exact-scope justification.
- [`WS05_VISUAL_WORD_PROBLEM_WAVE_2026-09-17.md`](WS05_VISUAL_WORD_PROBLEM_WAVE_2026-09-17.md) — Pattern #39 implementation/QA/live-closure record.
- [`PATTERN39_VISUAL_WORD_PROBLEM_CLOSURE_2026-09-17.md`](PATTERN39_VISUAL_WORD_PROBLEM_CLOSURE_2026-09-17.md) — Pattern #39 implementation/main/final closure evidence.
- [`PATTERN38_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`](PATTERN38_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md)
- [`PATTERN38_CLOZE_SENTENCE_CHOICE_CLOSURE_2026-09-17.md`](PATTERN38_CLOZE_SENTENCE_CHOICE_CLOSURE_2026-09-17.md)
- [`VBASE_P1_01_VISUAL_TOKEN_CLOSURE_2026-09-17.md`](VBASE_P1_01_VISUAL_TOKEN_CLOSURE_2026-09-17.md)

Historical closure/candidate/audit records must not be rewritten to pretend later QA or implementation state existed at their original checkpoint. Active closure records may be finalized when the documented closure gate itself later succeeds.

## Remaining product-quality work

Still open:

- Pattern #40 objective/evidence audit;
- P2 game detail/preflight vocabulary convergence;
- P2 canonical semantic icon convergence;
- P2 inline-style drift cleanup;
- WS-02 narration;
- WS-10 real-device/accessibility/human acceptance;
- Iqro expert review;
- WS-11 governance;
- later WS-12 cleanup;
- WS-05 continuation toward 50–60 meaningful patterns.

## Historical snapshot documents

Dated audit/redesign/validation documents record what was true at the time they were written. They are evidence/history, **not the current product baseline**, unless explicitly promoted above as an active canonical audit.

If a historical document conflicts with current code or a canonical current document, use the current code/current canonical docs and record the reconciliation in `NEXT_PRODUCT_QUALITY_PLAN.md`.

## Mandatory documentation rule

Every developer/AI agent completing product-quality work must update affected canonical docs, workstream status, QA/results/remaining work, avoid unsupported deployment/approval claims, and keep visual documentation aligned with implemented reality.

**Code merged without related documentation updates is not complete.**
