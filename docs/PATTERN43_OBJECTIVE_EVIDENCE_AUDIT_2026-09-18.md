# Pattern #43 Objective / Evidence Audit — 18 September 2026

Status: **AUDIT COMPLETE / IMPLEMENTATION CANDIDATE JUSTIFIED / CODE NOT STARTED**

Canonical audit base: `1577ee9a3384a6d8eaaa0b92810829f1bf90dc49`  
Verified audit-base CI: **#888 / run `35291546028` — full success including exact Cloudflare production smoke**  
Merged baseline: **900/900 classified / 42 active patterns / `choice_grid` 254/900**.

## Audit rule

Pattern #43 is selected only if the current interaction materially under-represents the learning objective. Existing mechanics must be reused when they already express the same evidence model.

Rejected during this audit:
- Bahasa sentence-detail scene treatment: rejected because a scene can reveal the literal answer and weaken reading evidence.
- English opposites: prior P41 rejection still applies; opposite-pair matching already directly represents the lesson relation.
- Logic multi-attribute classification: overlaps existing `set_reasoning` and should be handled as reuse/generalization, not a new pattern.
- Logic elimination/inference: the five activities mix several evidence forms and are not one clean interaction family.
- Science ecosystem dependency: related enough to existing relation mechanics that a new pattern is not yet justified.

## Selected candidate

Working pattern:

```text
single_rule_apply
```

Exact scope:

```text
logic-if-red-then-circle
logic-if-two-then-star
logic-rule-small-goes-left
logic-rule-up-means-one
logic-rule-switch-shape
```

Canonical ownership:

```text
subject:     logic
stage:       logic-conditional-analogy-inference
lesson:      logic-conditional-rules
pack:        logic.pack.conditional-rules
skill:       logic.conditional.rule.basic
runtime:     tap_choice
assessment:  assessed
contract:    choice_accuracy_v1
```

Lesson objective: **Mengikuti aturan jika-maka dan transformasi satu langkah sederhana.**

Skill description: **Mengikuti aturan kondisi dan transformasi satu langkah.**

## Exact canonical tasks

```text
logic-if-red-then-circle
  prompt: Aturannya: jika merah, pilih lingkaran. Mana yang benar?
  choices: 🔴 lingkaran | 🔴 segitiga | 🔵 lingkaran
  correct: 🔴 lingkaran

logic-if-two-then-star
  prompt: Aturannya: jika jumlahnya 2, pilih bintang. Mana yang cocok?
  choices: ★★ | ●● | ★★★
  correct: ★★

logic-rule-small-goes-left
  prompt: Aturannya: benda kecil harus di kiri benda besar. Mana susunan yang benar?
  choices: ●  ⬤ | ⬤  ● | ⬤  ⬤
  correct: ●  ⬤

logic-rule-up-means-one
  prompt: Aturannya: ↑ berarti satu titik dan → berarti dua titik. Apa pasangan untuk → ?
  choices: ●● | ● | ●●●
  correct: ●●

logic-rule-switch-shape
  prompt: Aturannya: lingkaran berubah jadi segitiga. Jika mulai dari ●, hasilnya?
  choices: ▲ | ■ | ●
  correct: ▲
```

## Why a distinct interaction is justified

All five activities measure application of **one explicit rule**. Generic `choice_grid` records the final answer but does not separate the rule from the object/state being evaluated.

A dedicated single-rule board can make the evidence structure visible as:

```text
RULE -> INPUT / CONDITION -> ?
```

without adding a new assessed step. The learner still selects the exact canonical answer.

## Why this is not existing `rule_pipeline`

`rule_pipeline` is intentionally scoped to five Logic Wave D **two-rule composition** activities. Its evidence model exposes rule one, an intermediate state, rule two, then a final result.

The Pattern #43 candidate has exactly one rule and no canonical intermediate state. Reusing the two-step pipeline would invent an intermediate checkpoint/state that the source activity does not contain.

Pattern #43 must therefore stay separate from `rule_pipeline`, while both preserve the same canonical final-choice evidence semantics.

## Deterministic model

Implementation must use exact-ID config only; no prompt parser.

Suggested modes:

```text
constraint_match
  logic-if-red-then-circle
  logic-if-two-then-star
  logic-rule-small-goes-left

symbol_mapping
  logic-rule-up-means-one

single_transform
  logic-rule-switch-shape
```

Each config must explicitly define:
- rule label;
- input/condition visual;
- target slot label;
- deterministic visual for all three canonical choices;
- exact expected prompt/choices/order/correctChoice.

The board must not style or reveal the correct answer before selection.

## Evidence contract

No canonical learning contract changes:
- exact IDs unchanged;
- subject/stage/lesson/pack/skill unchanged;
- runtime remains `tap_choice`;
- assessment remains assessed;
- evidence remains `choice_accuracy_v1`;
- prompts, choices/order and `correctChoice` stay byte-preserved;
- wrong answer is measured/retryable and cannot complete;
- correct answer completes through the existing attempt/evidence path;
- no mastery/progression/schema/database migration.

Suggested presentation metadata:

```text
source: single-rule-apply-runtime
evidenceFidelity: choice_single_rule_apply_interaction
ruleMode
selectedChoice
```

## Acceptance target after implementation

```text
900 / 900 classified
0 unclassified
43 active patterns
choice_grid                     249 / 900
single_rule_apply                 5 / 900
```

Required gates: exact five-ID regression, fail-closed config drift tests, unchanged rule_pipeline/set_reasoning scopes, keyboard + pointer + actual touch, wrong/success evidence, responsive 320/390/768 QA, permanent visual QA, full Ubuntu/Windows/build/security CI, exact-head merge, and merged-main Cloudflare production smoke.

## Decision

**Pattern #43 is justified as `single_rule_apply` for exactly the five Logic Wave C conditional-rule activities above.**

No other family is approved by this audit.
