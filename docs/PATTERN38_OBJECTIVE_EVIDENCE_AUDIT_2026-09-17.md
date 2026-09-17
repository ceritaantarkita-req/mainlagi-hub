# Pattern #38 Objective / Evidence Audit — 17 September 2026

Status: **AUDIT COMPLETE / IMPLEMENTATION CANDIDATE JUSTIFIED / CODE NOT STARTED**

Canonical audit base: `3751fb49c261a98eacd4080def0e18acdb8c578a`  
Production state at audit start: **P0=0 / P1=0 / P2=3**, visual checkpoint live verified.

## Audit rule

Pattern #38 was intentionally blocked until the production visual P1 checkpoint reached zero. This audit starts only after that closure and follows the canonical requirement that a mechanic must be justified by learning objective and evidence need, not by pattern-count pressure.

The valid audit outcome included **“no justified candidate”**. A candidate is selected below only because the current representation is materially weaker than the objective it claims to measure.

## Candidate

Working pattern name:

```text
cloze_sentence_choice
```

Exact scope:

```text
bahasa-lengkap-ayah-minum
bahasa-lengkap-burung-terbang
bahasa-lengkap-kucing-tidur
bahasa-lengkap-ibu-pasar
bahasa-lengkap-rina-payung
```

Canonical ownership:

```text
subject:  bahasa
stage:    bahasa-literasi-terapan
lesson:   bahasa-kalimat-lengkap
pack:     bahasa.pack.kalimat-lengkap
skill:    bahasa.kalimat.context_completion
runtime:  tap_choice
assessment: assessed
contract: choice_accuracy_v1
```

## Learning objective

The lesson objective is explicit:

> Memilih kata yang melengkapi kalimat sesuai konteks sederhana.

The mapped skill is `bahasa.kalimat.context_completion`: choosing a word that makes a simple sentence complete and sensible.

Each scoped prompt already contains one literal blank marker (`___`) and three canonical choices. Examples include:

```text
Ayah minum ___ setelah berolahraga.
Burung ___ di langit.
Kucing tidur di atas ___.
Ibu membeli sayur di ___.
Saat hujan, Rina memakai ___.
```

## Why the current representation is weak

These activities currently use generic `choice_grid` because there is no exact-scoped presentation classifier for this family.

A detached three-button quiz technically records the correct choice, but it weakens the intended representation: the learner is asked to complete a sentence, while the UI presents the sentence and answer list as separate generic regions. The interaction therefore under-expresses the actual context-completion task.

A cloze presentation materially improves objective fidelity by placing a visible blank slot inside the unchanged sentence and presenting the same three canonical choices as candidate words for that slot.

This is not a cosmetic re-skin: the interaction model changes from “answer a generic question” to “complete this sentence at the missing position,” while retaining the exact canonical answer/evidence semantics.

## Why this is not an existing pattern

Current implemented gameplay taxonomy contains no cloze/fill-blank sentence pattern.

Relevant existing patterns are semantically different:

- `choice_grid` — generic direct choice;
- `missing_sequence_slot` — letter-sequence completion, not sentence context;
- `syllable_assembly` — assemble word syllables;
- `sentence_order_cards` — reorder words into a sentence;
- `reading_passage_question` — read passage then answer a comprehension question.

Repository search at the audit base found no existing `cloze`, fill-blank, or `context_completion` gameplay presentation that would make this candidate a duplicate taxonomy label.

## Evidence contract

The five activities are already assessed through `choice_accuracy_v1` and map with weight 1 to `bahasa.kalimat.context_completion`.

Pattern #38 must preserve this evidence model exactly:

- canonical activity IDs unchanged;
- runtime remains `tap_choice`;
- three canonical choices unchanged and in canonical order;
- `correctChoice` unchanged;
- wrong selection remains measured/retryable and does not complete;
- correct selection completes the existing activity;
- attempt accuracy/retry metadata continues through the existing choice evidence path;
- no new mastery threshold, progression rule, schema or migration.

The interaction therefore changes presentation/fidelity, not what counts as a correct academic response.

## Exact presentation contract

The implementation may proceed only if it can satisfy all of these:

1. Parse exactly one literal `___` blank from the unchanged canonical prompt; fail closed to generic presentation if malformed.
2. Render text before and after the blank as one sentence surface with a visually explicit blank slot.
3. Present the unchanged three canonical choices as touch/keyboard-accessible word cards/buttons.
4. Selection must visibly bind the selected word to the blank without changing the canonical answer payload.
5. Wrong feedback must remain retryable and must not reveal or auto-complete the correct answer.
6. Correct feedback completes through the existing canonical `tap_choice` completion/evidence path.
7. No drag-only requirement. Direct button selection must remain the primary accessible interaction.
8. No content rewrite, extra confirmation question, invented hint, or additional assessment step.
9. Layout must remain usable at 320, 390, 768 and desktop widths and respect the permanent visual QA rules.
10. Pattern classification must be exact-scoped to the five audited IDs and must not opportunistically absorb other blank-like prompts.

## Regression requirements

Before merge, implementation must prove:

- exactly 5 activities classify as `cloze_sentence_choice`;
- all 5 remain subject/stage/lesson/pack/skill/runtime/evidence-identical;
- canonical choices and `correctChoice` are byte-for-byte unchanged;
- non-scope Bahasa choice activities keep their current gameplay pattern;
- wrong/retry/correct completion semantics remain canonical;
- keyboard + touch/pointer work;
- phone/tablet/desktop screenshots include idle, wrong and success states for a representative activity;
- gameplay distribution remains 900/900 classified;
- no mastery/progression/schema migration;
- full CI and independent post-merge production smoke remain required.

## Decision

**Pattern #38 is justified as `cloze_sentence_choice` for the exact five `bahasa-lengkap-*` activities above.**

Reason: the current generic choice presentation records valid evidence but under-represents the explicit sentence-context completion objective. A scoped cloze interaction makes the learner perform the intended cognitive action more directly while preserving the existing assessed choice evidence contract.

This audit does **not** approve broader cloze conversion, content changes, or any other Pattern #39+ candidate.

## Next step

After this audit is reviewed/merged, implementation should start from the latest live-verified main SHA on a separate branch. The implementation wave should add only the exact classifier/config/runtime presentation/tests/docs required for these five activities and should not modify unrelated gameplay families.
