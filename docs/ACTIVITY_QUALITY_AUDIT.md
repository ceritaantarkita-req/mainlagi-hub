# Mainlagi Activity Quality Audit

Last reviewed: **14 September 2026**

Status: **WS-04 IN PROGRESS — Wave A baseline complete; Wave B representation fixes complete on PR #92 branch**.

Canonical execution plan: `NEXT_PRODUCT_QUALITY_PLAN.md`.

This document defines the repeatable quality-audit contract for the current **9 subjects / 900 activities**. It targets problems that route integrity, catalog counts, mastery tests, and build success cannot prove.

## 1. Current calibrated state

Latest Wave B audit evidence:

```text
PR:                  #92
CI run:              #385
activities:          900
structural findings: 0
KEEP:                683
POLISH:              178
REDESIGN:             39
REPLACE:               0
flagged total:       217
repeated templates:    9 families
```

Per subject:

| Subject | KEEP | POLISH | REDESIGN | REPLACE |
|---|---:|---:|---:|---:|
| Bahasa Indonesia | 94 | 6 | 0 | 0 |
| English | 96 | 4 | 0 | 0 |
| Matematika | 98 | 2 | 0 | 0 |
| Iqro | 100 | 0 | 0 | 0 |
| Huruf & Menulis | 36 | 64 | 0 | 0 |
| Logika | 93 | 7 | 0 | 0 |
| Sains | 100 | 0 | 0 | 0 |
| Mewarnai | 41 | 20 | 39 | 0 |
| Menggambar | 25 | 75 | 0 | 0 |

Current advisory finding counts:

| Rule | Count | Default action |
|---|---:|---|
| `Q105_DIRECT_SYMBOL_DISCRIMINATION` | 83 | POLISH |
| `Q106_YOUNG_DRAWING_WITHOUT_SCAFFOLD` | 75 | POLISH |
| `Q108_DUPLICATE_COLORING_GEOMETRY` | 59 | POLISH / REDESIGN |
| `Q101_TEXT_LABEL_USED_AS_COLOR_VISUAL` | 0 | REDESIGN if found |
| `Q102_VISUAL_SKILL_USES_TEXT_ONLY_CHOICES` | 0 | REDESIGN if found |
| `Q103_AUDIO_TARGET_VISIBLE_IN_PROMPT` | 0 | REDESIGN if found |
| `Q104_EARLY_AGE_READING_LOAD` | 0 | POLISH if found |
| `Q107_EXACT_ACTIVITY_CONTENT_DUPLICATE` | 0 | REDESIGN if found |

Wave A's accepted baseline was `640 KEEP / 186 POLISH / 74 REDESIGN / 0 REPLACE`, with 260 flagged activities and zero structural findings. Wave B reduced the flagged set from **260 to 217** without changing mastery/progression/evidence semantics.

The audit was calibrated before being accepted. Earlier runs that stripped emoji/Arabic characters from duplicate fingerprints were rejected. The current fingerprint preserves Unicode/symbols and runtime-specific fields. Wave B also narrowed `Q102` so conceptual Science use of words such as `pola/pattern` is not automatically treated as a visual-representation defect; pattern-based visual heuristics apply only when the mapped skill explicitly requires visual/shape discrimination or is a structured Math/Logic pattern task.

## 2. What the classifications mean

`KEEP` does **not** mean expert-approved or perfect. It means no known deterministic audit rule currently flags the activity.

`POLISH` means the learning idea can generally remain but the activity needs better presentation, wording, scaffold, distractors, age fit, or mechanic variety.

`REDESIGN` means the current representation/mechanic risks measuring the wrong thing, leaking the answer, or materially repeating content and should change before it is considered high-quality.

`REPLACE` is reserved for structural/evidence-contract failure or content that cannot responsibly remain in its current form. The current state has **0 REPLACE** and **0 structural findings**.

## 3. Wave B resolved representation problems

### English visual color recognition

These activities were corrected:

- `english-find-red`
- `english-find-green`
- `english-find-blue`

They no longer present written `RED / BLUE / GREEN` labels as the answer representation. The child now chooses actual visual color symbols while the canonical skill and assessment contract remain intact.

Result: `Q101_TEXT_LABEL_USED_AS_COLOR_VISUAL` **3 -> 0**.

### Visual shape/pattern representation

`math-shape-three-sides` and `math-pattern-size` now present shape/size symbols rather than requiring the child to read shape names. The audit heuristic was also narrowed so non-visual conceptual Science questions are not falsely classified as visual-representation defects.

Result: `Q102_VISUAL_SKILL_USES_TEXT_ONLY_CHOICES` **6 -> 0**.

### Listening answer leakage

Canonical `LearningActivity` now supports a separate `audioPrompt`. For every `listen_and_choose` activity:

- the original lexical/audio target is preserved as `audioPrompt`;
- the visible screen prompt is a generic listening instruction;
- the activity UI speaks `audioPrompt`, not the visible instruction;
- answer choices remain disabled until speech actually starts with status `spoken`;
- muted/unavailable/error states never expose the hidden audio target as fallback answer text;
- an audio failure cannot be bypassed by guessing to manufacture completion/evidence.

Result: `Q103_AUDIO_TARGET_VISIBLE_IN_PROMPT` **26 -> 0**.

### Age-three reading load

The three English animal activities that explicitly ask a child to read words (`DOG`, `RABBIT`, `FISH`) now enter the direct word-reading path at age 4+. The animal vocabulary lesson/pack/skill remains available from age 3 because age-three children still have audio and picture/matching activities.

Five age-three Science choices were made pre-reader friendlier by adding clear visual symbols for plant parts/growth and senses while keeping the same science concepts.

Result: `Q104_EARLY_AGE_READING_LOAD` **8 -> 0**.

## 4. Remaining quality work

The remaining deterministic findings are now concentrated in three real product-quality families rather than representation bugs:

1. **83 direct-symbol activities** — mostly foundational letter/symbol identification. These are valid checks but become shallow when repeated. They feed WS-04 Wave C + WS-05 mechanic diversification.
2. **75 young Drawing activities without explicit scaffold** — these require authored guide/design review and feed WS-07 + WS-08.
3. **59 duplicate Coloring geometry findings** — different activity IDs reuse identical scene geometry; these feed WS-06 + WS-08.

The next activity-content work should not chase a lower audit number by cosmetic rewrites. A direct-symbol activity should be redesigned only where a better mechanic genuinely trains the same skill.

## 5. Permanent command and evidence

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

## 6. CI behavior

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

## 7. What automation cannot decide

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

## 8. Review workflow

For a flagged activity:

1. inspect its definition and mapped skill;
2. verify the intended learning objective;
3. inspect the real child-facing representation;
4. confirm or override `KEEP / POLISH / REDESIGN / REPLACE` with a recorded reason;
5. preserve or explicitly update evidence semantics when assessed;
6. make the smallest correct content/runtime change;
7. run learning + mobile/product QA;
8. update this document and `NEXT_PRODUCT_QUALITY_PLAN.md`.

## 9. Work waves

### Wave A — deterministic baseline — COMPLETE

- permanent audit tooling installed;
- all 900 activities evaluated;
- structural findings = 0;
- calibrated baseline recorded;
- report artifact produced by CI;
- PR #91 merged to `main` at `7a087d590381dd4487811027690ac187ff87954b` after CI #378 success.

### Wave B — representation errors — COMPLETE ON PR #92 BRANCH

Resolved:

- visual color recognition represented by written color words;
- non-language visual/shape tasks represented only by text;
- assessed listening target leakage;
- age-three reading-load flags;
- listening evidence without confirmed audio playback.

Evidence: CI #385 success on the implementation head before the documentation closeout; final audit is `683 KEEP / 178 POLISH / 39 REDESIGN / 0 REPLACE`, 217 flagged, structural findings 0.

### Wave C — shallow/repetitive families — NEXT

Review the 83 direct-symbol activities and the nine repeated-template families. Redesign only where another mechanic better serves the same skill.

This wave feeds **WS-05 Mechanic Diversification**. Priority should be reusable mechanic/runtime capability, not one-off content hacks.

### Wave D — creative-content handoff

- 59 duplicate Coloring geometry findings -> WS-06 + WS-08;
- 75 young Drawing/no-scaffold findings -> WS-07 + WS-08.

### Wave E — human curriculum/product review

Review remaining `KEEP/POLISH` activities subject-by-subject for age fit, ambiguity, distractors, difficulty, cultural fit, visual quality, and progression coherence.

## 10. Completion rule

WS-04 is complete only when:

- all 900 activities retain a current triage record;
- structural findings remain zero;
- high-severity representation errors are fixed or explicitly accepted;
- shallow/repeated families have concrete redesign decisions;
- creative visual findings are transferred/resolved in WS-06/07/08;
- canonical docs and execution log are current;
- relevant CI/product QA passes.
