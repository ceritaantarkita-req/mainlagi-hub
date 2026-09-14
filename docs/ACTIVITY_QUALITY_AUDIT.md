# Mainlagi Activity Quality Audit

Last reviewed: **14 September 2026**

Status: **WS-04 IN PROGRESS — Wave A baseline complete on PR #91 branch**.

Canonical execution plan: `NEXT_PRODUCT_QUALITY_PLAN.md`.

This document defines the repeatable quality-audit contract for the current **9 subjects / 900 activities**. It targets problems that route integrity, catalog counts, mastery tests, and build success cannot prove.

## 1. Calibrated baseline

Latest calibrated audit evidence:

```text
PR:                  #91
CI run:              #377
activities:          900
structural findings: 0
KEEP:                640
POLISH:              186
REDESIGN:             74
REPLACE:               0
flagged total:       260
repeated templates:    9 families
```

Per subject:

| Subject | KEEP | POLISH | REDESIGN | REPLACE |
|---|---:|---:|---:|---:|
| Bahasa Indonesia | 79 | 6 | 15 | 0 |
| English | 79 | 7 | 14 | 0 |
| Matematika | 96 | 2 | 2 | 0 |
| Iqro | 100 | 0 | 0 | 0 |
| Huruf & Menulis | 36 | 64 | 0 | 0 |
| Logika | 93 | 7 | 0 | 0 |
| Sains | 91 | 5 | 4 | 0 |
| Mewarnai | 41 | 20 | 39 | 0 |
| Menggambar | 25 | 75 | 0 | 0 |

Current advisory finding counts:

| Rule | Count | Default action |
|---|---:|---|
| `Q105_DIRECT_SYMBOL_DISCRIMINATION` | 83 | POLISH |
| `Q106_YOUNG_DRAWING_WITHOUT_SCAFFOLD` | 75 | POLISH |
| `Q108_DUPLICATE_COLORING_GEOMETRY` | 59 | POLISH / REDESIGN |
| `Q103_AUDIO_TARGET_VISIBLE_IN_PROMPT` | 26 | REDESIGN |
| `Q104_EARLY_AGE_READING_LOAD` | 8 | POLISH |
| `Q102_VISUAL_SKILL_USES_TEXT_ONLY_CHOICES` | 6 | REDESIGN |
| `Q101_TEXT_LABEL_USED_AS_COLOR_VISUAL` | 3 | REDESIGN |
| `Q107_EXACT_ACTIVITY_CONTENT_DUPLICATE` | 0 | REDESIGN if found |

The baseline was calibrated before being accepted. Earlier audit runs incorrectly stripped emoji/Arabic characters while fingerprinting and were **not** accepted as canonical evidence. The current fingerprint preserves Unicode/symbols and runtime-specific fields.

## 2. What the baseline means

`KEEP` does **not** mean expert-approved or perfect. It means no known deterministic audit rule flagged the activity.

`POLISH` means the learning idea can generally remain but the activity needs better presentation, wording, scaffold, distractors, age fit, or mechanic variety.

`REDESIGN` means the current representation/mechanic risks measuring the wrong thing, leaking the answer, or materially repeating content and should change before being considered high-quality.

`REPLACE` is reserved for structural/evidence-contract failure or content that cannot responsibly remain in its current form. The calibrated baseline has **0 REPLACE** and **0 structural findings**.

## 3. Confirmed high-confidence examples

### English color recognition

The audit correctly flags these three activities:

- `english-find-red`
- `english-find-green`
- `english-find-blue`

They currently ask the child to recognize a color while presenting written labels such as `RED / BLUE / GREEN`. That primarily measures written color vocabulary, not visual color recognition.

Wave B should preserve the canonical string answer/evidence mapping while changing presentation to actual visual color choices.

### Direct letter/symbol identification

A task such as:

```text
Find A -> A / B / D
```

is not automatically invalid. It can be a useful foundation check. It is classified `POLISH` when used as part of a large repeated family because the gameplay becomes shallow and repetitive.

### Listening answer leakage

26 assessed listening activities are flagged because the visible prompt contains the lexical answer the child is expected to identify from audio. The runtime currently needs a cleaner distinction between **spoken narration** and **displayed child instruction**.

### Coloring repetition

59 Coloring activities share exact scene geometry with another activity. Large duplicate groups include reused robot/Paca scenes and repeated sky/time/mood compositions. These findings feed WS-06 and WS-08.

### Drawing scaffolding

75 Drawing activities available to younger children do not currently have an explicit `drawingGuide`; only 25 are unflagged by this rule. These findings feed WS-07/08 and require visual review rather than automatic rejection.

## 4. Permanent command and evidence

```bash
npm run qa:activity-quality
```

Implementation:

```text
scripts/audit-learning-activity-quality.mjs
```

Outputs:

```text
.qa/activity-quality/report.json
.qa/activity-quality/report.md
```

CI uploads them as the `activity-quality-audit` artifact. `report.json` is the machine-readable handoff; `report.md` is the human/agent summary.

## 5. CI behavior

### Blocking structural rules

These fail `npm run qa:activity-quality`:

- `Q001_MISSING_CATALOG_SPEC`
- `Q002_ASSESSED_WITHOUT_SKILL`
- `Q003_CREATIVE_MARKED_ASSESSED`
- `Q004_CHOICE_CONTRACT_INVALID`
- `Q005_MATCHING_CONTRACT_INVALID`

They are implementation/evidence integrity errors rather than subjective design judgments.

### Advisory product-quality rules

These produce triage evidence but do not automatically fail CI:

- `Q101_TEXT_LABEL_USED_AS_COLOR_VISUAL`
- `Q102_VISUAL_SKILL_USES_TEXT_ONLY_CHOICES`
- `Q103_AUDIO_TARGET_VISIBLE_IN_PROMPT`
- `Q104_EARLY_AGE_READING_LOAD`
- `Q105_DIRECT_SYMBOL_DISCRIMINATION`
- `Q106_YOUNG_DRAWING_WITHOUT_SCAFFOLD`
- `Q107_EXACT_ACTIVITY_CONTENT_DUPLICATE`
- `Q108_DUPLICATE_COLORING_GEOMETRY`

Heuristics are deliberately advisory because human pedagogical/visual review remains necessary.

## 6. What automation cannot decide

The audit cannot reliably decide:

- whether artwork is attractive or coherent;
- whether a distractor is pedagogically ideal;
- whether a child understands an instruction in real play;
- whether difficulty progression feels right;
- whether a story is engaging;
- whether Iqro pronunciation/content is expert-approved;
- whether two structurally different activities still feel repetitive;
- whether an illustration is production-quality rather than visual slop.

Those require screenshot/human review, real-device testing, child/product evaluation, or competent subject-matter review.

## 7. Review workflow

For a flagged activity:

1. inspect its definition and mapped skill;
2. verify the intended learning objective;
3. inspect the real child-facing representation;
4. confirm or override `KEEP / POLISH / REDESIGN / REPLACE` with a recorded reason;
5. preserve or explicitly update evidence semantics when assessed;
6. make the smallest correct content/runtime change;
7. run learning + mobile/product QA;
8. update this document and `NEXT_PRODUCT_QUALITY_PLAN.md`.

## 8. Work waves

### Wave A — deterministic baseline — COMPLETE

- permanent audit tooling installed;
- all 900 activities evaluated;
- structural findings = 0;
- calibrated baseline recorded above;
- report artifact produced by CI.

### Wave B — representation errors — NEXT

Highest-confidence targets:

1. three English visual color activities;
2. six non-language visual/shape/pattern activities using text-only choices;
3. 26 assessed listening activities with visible answer leakage;
4. eight age-3 activities with text-heavy choices and no audio mode.

The fix should introduce reusable presentation/runtime capability where needed rather than hardcoding one-off screens.

### Wave C — shallow/repetitive families

Review the 83 direct-symbol activities and the nine repeated-template families. Redesign only when another mechanic better serves the same skill.

This wave feeds **WS-05 Mechanic Diversification**.

### Wave D — creative-content handoff

- 59 duplicate Coloring geometry findings -> WS-06 + WS-08;
- 75 young Drawing/no-scaffold findings -> WS-07 + WS-08.

### Wave E — human curriculum/product review

Review remaining `KEEP/POLISH` activities subject-by-subject for age fit, ambiguity, distractors, difficulty, cultural fit, visual quality, and progression coherence.

## 9. Completion rule

WS-04 is complete only when:

- all 900 activities retain a current triage record;
- structural findings remain zero;
- high-severity representation errors are fixed or explicitly accepted;
- shallow/repeated families have concrete redesign decisions;
- creative visual findings are transferred/resolved in WS-06/07/08;
- canonical docs and execution log are current;
- relevant CI/product QA passes.
