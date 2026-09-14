# Mainlagi Activity Quality Audit

Last reviewed: **14 September 2026**

Status: **WS-04 IN PROGRESS**.

Canonical execution plan: `NEXT_PRODUCT_QUALITY_PLAN.md`.

This document defines the repeatable audit contract for the current **9 subjects / 900 activities**. The audit exists to find product-quality problems that catalog integrity, route smoke, and mastery tests cannot prove.

## 1. Why this exists

A route can work, compile, save progress, and still be a poor learning activity.

Examples of problems this audit targets:

- the representation measures the wrong skill;
- the answer is leaked by visible text;
- distractors are technically valid but trivial;
- a young child is expected to read too much;
- multiple activity IDs are effectively the same task;
- a visual learning objective is presented only as text;
- creative activities reuse identical geometry;
- younger drawing tasks have no useful scaffold;
- assessment metadata does not match the actual interaction.

The current phase is **quality first, quantity later**. This audit does not add activities.

## 2. Classification

Every activity receives one current triage classification:

- `KEEP` — no deterministic red flag found; still eligible for later human review.
- `POLISH` — concept can remain but presentation, difficulty, scaffold, wording, or distractors need improvement.
- `REDESIGN` — representation/mechanic/content should materially change before it is considered high-quality.
- `REPLACE` — structural/evidence contract is invalid or the activity cannot be responsibly preserved in its current form.

Classification is the highest recommendation emitted by the audit rules for that activity.

`KEEP` does **not** mean pedagogically certified. It means the deterministic audit did not find one of its known problems.

## 3. Permanent command

```bash
npm run qa:activity-quality
```

Implementation:

```text
scripts/audit-learning-activity-quality.mjs
```

The command compiles the canonical learning modules, reads the complete `ACTIVITIES` catalog plus learning specs/skills, and writes:

```text
.qa/activity-quality/report.json
.qa/activity-quality/report.md
```

CI uploads these files as artifact:

```text
activity-quality-audit
```

The JSON report is the machine-readable handoff. The Markdown report is for fast human/agent review.

## 4. CI behavior

The audit has two layers.

### Structural contract — blocking

These findings fail `npm run qa:activity-quality`:

- `Q001_MISSING_CATALOG_SPEC`
- `Q002_ASSESSED_WITHOUT_SKILL`
- `Q003_CREATIVE_MARKED_ASSESSED`
- `Q004_CHOICE_CONTRACT_INVALID`
- `Q005_MATCHING_CONTRACT_INVALID`

These are implementation/evidence integrity errors, not subjective design judgments.

### Product-quality heuristics — advisory

These are recorded and classified but do not automatically fail CI:

- `Q101_TEXT_LABEL_USED_AS_COLOR_VISUAL`
- `Q102_VISUAL_SKILL_USES_TEXT_ONLY_CHOICES`
- `Q103_AUDIO_TARGET_VISIBLE_IN_PROMPT`
- `Q104_EARLY_AGE_READING_LOAD`
- `Q105_DIRECT_SYMBOL_DISCRIMINATION`
- `Q106_YOUNG_DRAWING_WITHOUT_SCAFFOLD`
- `Q107_EXACT_ACTIVITY_CONTENT_DUPLICATE`
- `Q108_DUPLICATE_COLORING_GEOMETRY`

A heuristic can produce false positives. Human/product review decides the final redesign.

## 5. Important rule interpretations

### Color recognition

If the objective is visual color recognition, choices such as:

```text
RED / BLUE / GREEN
```

are not a good visual representation. They primarily measure written color vocabulary.

Actual color objects/swatches/scene elements should be used when visual recognition is intended.

### Listening

For an assessed listening activity, visibly printing the same lexical answer that the child is supposed to identify from audio can allow reading to substitute for listening.

The correct fix may be content, runtime presentation, or both.

### Direct letter/number discrimination

A foundational task like:

```text
Find A -> A / B / D
```

is not automatically wrong. It is flagged as `POLISH` because repeated use of the same direct three-choice pattern creates shallow gameplay and poor variety.

The audit therefore distinguishes it from a representation error such as text labels used for visual color recognition.

### Creative visuals

Exact duplicate Coloring scene geometry is recorded because changing only the label/theme while reusing the same drawing creates catalog inflation rather than a genuinely different visual activity.

Drawing tasks for younger children without an explicit scaffold are flagged for visual review, not automatically rejected. Some free-drawing activities are intentionally open-ended.

## 6. What the automated audit cannot decide

Automation cannot reliably judge:

- whether artwork looks beautiful or coherent;
- whether a distractor is culturally/pedagogically ideal;
- whether a child actually understands the instruction;
- whether difficulty progression feels right in real play;
- whether a story is engaging;
- whether Iqro pronunciation/content is expert-approved;
- whether two activities feel repetitive despite different data structures.

Those require human review, screenshots, real-device testing, or competent subject-matter review.

## 7. Review workflow

For each flagged activity:

1. inspect activity definition and mapped skill;
2. verify intended learning objective;
3. inspect actual child-facing runtime representation;
4. decide `KEEP / POLISH / REDESIGN / REPLACE`;
5. if assessed, preserve or explicitly update evidence semantics;
6. implement only the minimum mechanic/content change needed;
7. run learning + mobile/product QA;
8. update this document and `NEXT_PRODUCT_QUALITY_PLAN.md`.

## 8. Work waves

WS-04 should be executed in waves rather than rewriting 900 activities at once.

### Wave A — deterministic baseline

- install permanent audit tooling;
- run all 900 activities;
- capture exact classification/rule counts;
- identify structural blockers and highest-severity semantic problems.

### Wave B — representation errors

Prioritize activities where the interaction measures the wrong skill or leaks the answer.

Examples:

- written color names used as visual color choices;
- assessed listening whose answer is visibly repeated;
- visual discrimination implemented as text-only labels.

### Wave C — shallow/repetitive activity families

Group repeated direct-choice/template families and redesign only where a better mechanic serves the same skill.

This wave feeds **WS-05 Mechanic Diversification**.

### Wave D — creative-content handoff

Coloring and Drawing findings are handed to:

- WS-06 Coloring rebuild;
- WS-07 Drawing rebuild;
- WS-08 Art direction / visual QA.

### Wave E — human curriculum/product review

Review remaining `KEEP/POLISH` activities subject-by-subject, including age fit, ambiguity, distractor quality, difficulty, cultural fit, and progression coherence.

## 9. Completion rule

WS-04 is not complete merely because the audit script exists.

It is complete when:

- all 900 activities have a recorded triage classification;
- structural findings are zero;
- high-severity representation errors are resolved or explicitly accepted;
- repeated/shallow families are assigned to concrete redesign waves;
- creative visual findings are transferred to WS-06/07/08;
- canonical docs and execution log are current;
- relevant CI/product QA passes.
