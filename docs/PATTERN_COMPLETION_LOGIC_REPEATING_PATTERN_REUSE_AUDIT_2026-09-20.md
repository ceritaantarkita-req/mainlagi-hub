# Logic Repeating-Pattern -> Existing `pattern_completion` Reuse Audit — 20 September 2026

Status: **AUDIT COMPLETE / EXISTING `pattern_completion` REUSE JUSTIFIED / EXACT 5-ID SCOPE / PATTERN COUNT STAYS 47 / CODE NOT STARTED**

## Verified baseline

```text
Audit base main:             974735698bf5e614f27a4a34961bb647e8fed820
Activities classified:       900 / 900
Unclassified:                  0
Active gameplay patterns:     47
choice_grid:                 179 / 900
pattern_completion:            5 / 900
Activity quality:            KEEP 900
```

Current remaining `choice_grid` inventory after the fully closed Math mixed-operation reuse:

```text
Iqro      58
Science   41
Logic     26
Bahasa    24
English   17
Math      13
total    179
```

Iqro remains excluded from mechanic transformation until external expert acceptance exists.

## Why this audit exists

Pattern #48 remains **NO JUSTIFIED NEW PATTERN YET**.

Earlier objective/evidence audits already identified Logic repeating-rule / sequence-continuation work as a reuse/generalization candidate for existing `pattern_completion`, rather than a reason to create another taxonomy entry. This audit rechecks that direction against the current merged baseline and exact catalog payload.

The reviewed family is one coherent lesson and one coherent skill:

```text
subject:        logic
stage:          logic-patterns-sequences-relations
lesson:         logic-patterns-intermediate
pack:           logic.pack.patterns-intermediate
skill:          logic.pattern.repeat.intermediate
runtime:        tap_choice
assessment:     assessed
evidence:       choice_accuracy_v1
activities:     5
```

All five activities ask the learner to inspect a visible repeating sequence and choose the canonical next token or next grouped token.

## Exact approved reuse scope

```text
logic-pattern-aab-stars
logic-pattern-abb-shapes
logic-pattern-abc-shapes
logic-pattern-paired-blocks
logic-pattern-abba
```

Canonical tasks:

```text
logic-pattern-aab-stars
prompt:  ★ ★ ○  ★ ★ ○  ★ ★ ... selanjutnya?
choices: ○ / ★ / ▲
answer:  ○

logic-pattern-abb-shapes
prompt:  ● ▲ ▲  ● ▲ ▲  ● ... selanjutnya?
choices: ▲ / ● / ■
answer:  ▲

logic-pattern-abc-shapes
prompt:  ● ▲ ■  ● ▲ ■  ● ... selanjutnya?
choices: ▲ / ■ / ●
answer:  ▲

logic-pattern-paired-blocks
prompt:  ▲ ▲  ● ●  ▲ ▲ ... kelompok berikutnya?
choices: ● ● / ▲ ● / ■ ■
answer:  ● ●

logic-pattern-abba
prompt:  ● ▲ ▲ ●  ● ▲ ▲ ... selanjutnya?
choices: ● / ▲ / ■
answer:  ●
```

## Objective / evidence fit

Existing `pattern_completion` represents:

1. a visible ordered pattern;
2. one unresolved next slot;
3. exactly three canonical answer choices;
4. one canonical choice fills the unresolved continuation;
5. wrong selection remains retryable and cannot complete;
6. correct selection completes the same assessed activity;
7. evidence remains one assessed choice interaction.

The five Logic activities use exactly this evidence structure. Their curriculum identity is Logic rather than Math, but that identity is orthogonal to the child-facing interaction.

Reuse therefore preserves the objective better than generic `choice_grid` and does not justify Pattern #48.

## Existing implementation compatibility

`PatternCompletionActivity` is already mostly subject-agnostic:

- back navigation derives from `activity.subjectId`;
- title and narration derive from the canonical activity;
- choices and `correctChoice` stay canonical;
- assessed status comes from the canonical learning spec;
- completion uses the canonical activity ID;
- evidence uses `choice_pattern_completion_interaction` without rewriting curriculum ownership.

The current eligibility/config layer is the limiting boundary:

- `gameplayPresentation.ts` owns a Math-only five-ID allowlist;
- `patternCompletionConfig.ts` currently contains only those five Math IDs;
- current config lookup is ID-only and predates the stricter fail-closed reuse standard used by later waves.

That is an implementation boundary, not a reason to duplicate the mechanic.

## Required implementation hardening

Implementation must not broaden by prefix, lesson ID, generic prompt parsing or subject-wide inference.

The complete post-reuse family should be exactly ten activities:

```text
legacy Math pattern_completion:  5
Logic repeating-pattern reuse:   5
total:                           10
```

The implementation should harden `patternCompletionConfig.ts` so every supported ID owns explicit canonical identity/evidence metadata and fails closed on at least:

- exact activity ID;
- subject;
- exact stage;
- runtime;
- canonical title;
- canonical prompt;
- exact three-choice order;
- canonical correct answer;
- deterministic visible sequence;
- deterministic continuation kind / visual mode;
- one and only one canonical answer represented by the unresolved slot.

`gameplayPresentation.ts` should delegate eligibility to the hardened config rather than maintaining a second broader allowlist if practical.

Expected Logic modes may remain implementation details, but must be deterministic. The grouped-token activity `logic-pattern-paired-blocks` must preserve its canonical grouped answer `● ●`; it must not be silently rewritten into two assessment steps.

## Explicit exclusions

This audit does **not** authorize the neighboring Logic sequence, comparison, spatial, association or rule-composition families.

In particular:

- `logic-sequence-*` can involve numeric growth/shrink or directional cycles and needs a separate evidence audit;
- comparison activities belong to comparison mechanics where exact fit is proven;
- spatial activities remain separate from repeating-pattern evidence;
- composed rules remain `rule_pipeline`;
- no generic `logic-*` or lesson-prefix conversion is approved.

The heterogeneous Math review pack also remains excluded as a pack-level conversion. Individual review items may only move through later exact objective/evidence audits.

Science force/motion remains heterogeneous and is not approved as one relation mechanic.

English initial-sound direct-choice remains excluded from existing Bahasa `initial_sound` because it asks for a word beginning with a target sound rather than selecting the initial letter itself.

## Expected distribution after runtime reuse

If and only if exactly these five Logic activities are implemented:

```text
activities:             900
classified:             900
unclassified:             0
active patterns:         47
choice_grid:            174
pattern_completion:      10
Logic choice_grid:       21
KEEP:                   900
```

Pattern count remains **47**.

No Pattern #48 is created.

## Required implementation QA

Before runtime merge:

1. exact 10-ID `pattern_completion` regression;
2. explicit exact five-ID Logic reuse assertion;
3. fail-closed drift tests for ID/subject/stage/runtime/title/prompt/choice order/answer;
4. legacy five Math `pattern_completion` activities remain behaviorally unchanged;
5. neighboring Logic sequence/comparison/spatial/rule families remain excluded;
6. representative Logic browser route at 320 / 390 / 768;
7. keyboard wrong/retry plus false-completion guard;
8. pointer and actual touchscreen completion;
9. touch targets >=44px and no horizontal overflow;
10. canonical prompt/choices/order/correct answer remain preserved;
11. assessed evidence remains `choice_pattern_completion_interaction`;
12. canonical skill remains `logic.pattern.repeat.intermediate`;
13. grouped-token evidence for `logic-pattern-paired-blocks` stays one canonical choice step;
14. gameplay distribution is exactly 900/900 / 47 / `choice_grid` 174 / `pattern_completion` 10;
15. activity quality remains KEEP 900;
16. manual visual review of representative idle/retry/success states;
17. exact-head CI, exact-head merge, then merged-main exact-SHA Cloudflare production smoke.

## Audit conclusion

**Reuse existing `pattern_completion` for exactly the five Logic repeating-pattern activities listed above.**

Do not create Pattern #48.

No runtime code is approved beyond this exact five-ID reuse scope until this docs-only audit PR passes CI, merges to `main`, and the merged audit SHA is live verified.
