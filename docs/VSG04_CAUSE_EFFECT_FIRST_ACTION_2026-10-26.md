# VSG-04 — Cause & Effect: child-first instruction and QA

**Date:** 26 October 2026
**Baseline:** `main@c4b90cdc0fe5dc1fbd4ba0509875103b7fa437e6` after VSG-03 / PR #534.
**Scope:** One Science Cause & Effect family only. Implementation in review PR, **not merged** until exact-head CI + screenshot acceptance.

## Problem / evidence

The `CauseEffectActivity` renderer displays a framed title ("Lihat sebab dan hasilnya"), a secondary content question (`config.cue`), an **idle status paragraph with another instruction**, and the three-phase causal evidence board. On short 320px screens the compact styles shrink answer touch targets to 46px and fonts to 11px. This is source-confirmed duplication and sub-preferred touch targets, not evidence that all other 47 patterns have the same problem.

## Visual-first change

1. One actionable first question: **"Apa yang terjadi?"** via the existing `planChildVisualHierarchy` opt-in contract, with activity title retained as accessible context.
2. The original `config.cue` is available via **Cara main (?)** on demand, not removed or rewritten. The original full `activity.prompt` remains in `Dengar`; all canonical science data and words remain unchanged.
3. The evidence stays visibly structured as **Awal → condition → Hasil** (including source icons and labels), plus all three answer choices; this is **not** flattened into a generic card grid.
4. Initial duplicated status copy is hidden; wrong feedback is **"Belum tepat. Coba lagi!"**. Correct scientific explanation is kept for assistive technology; canonical completion uses **"Hebat!"** + three stars, Back/Again/Next/Share without duplicate visible copy.
5. At 320px restore a 72px minimum answer target while retaining readable word-safe wrapping and scoped child-semantic question typography. No global CSS overrides.

## Explicit immutability boundary

Do **not** change `causeEffectConfig`, correct answers, options, evidence metadata, scoring/accuracy, attempted counts, stage readiness, completion/progression implementation, the background subject theme, World, Motion Engine, Shop or the database.

## Regression and evidence

`scripts/run-cause-effect-browser-tests.mjs` now checks five viewports: **320/390/430/768/1280**, exact first question and optional canonical cue, no idle duplicate, three intact answers, evidence board source values, keyboard wrong-state, no false completion, accurate assessed attempt, correct answer, concise canonical completion, and local Again without new attempts.

An isolated CI screenshot artifact `vsg04-cause-effect-screenshots` captures **15 PNGs**, idle/try/success at all five widths. Screenshot archive is generated after the canonical mobile browser matrix; do not claim visual approval until reviewed from exact-head PR CI.

### Merge gates

- [ ] Exact-head seven CI jobs all PASS (Cloudflare PR smoke is separate)
- [ ] Screenshots 320/390/430/768/1280 manually reviewed, including help in live browser QA
- [ ] Genuine browser interaction and attempt/evidence behavior PASS; no cut-off answers
- [ ] Merge only on success; merged SHA production smoke and physical iOS remain separate follow-ups

This is one scoped adoption wave, **not** a universal 900-activity UI rewrite.
