# Pattern #39 Objective / Evidence Audit — 17 September 2026

Status: **AUDIT COMPLETE / IMPLEMENTATION CANDIDATE JUSTIFIED / CODE NOT STARTED**

Canonical audit base: `86e6b69d576d72fec73158a7a1c6d8961de36887`  
Latest fully closed gameplay at audit start: **Pattern #38 — `cloze_sentence_choice`**  
Merged distribution at audit start: **900/900 classified / 38 active patterns / `choice_grid` 272/900**.

## Audit rule

Pattern #39 is not selected by pattern-count pressure. The valid outcome of this audit included **“no justified candidate”**.

A candidate is accepted only when:

- the canonical lesson objective and skill evidence are materially under-represented by the current interaction;
- the proposed presentation is semantically distinct from an already implemented gameplay pattern;
- canonical activity identity, answer payload, assessment, mastery and progression can remain unchanged;
- the scope is small, deterministic and fail-closed.

## Candidate review

The audit reviewed remaining generic `choice_grid` families after Pattern #38.

### English sentence completion

The `english-complete-*` family is a sentence-completion candidate, but it should be evaluated for reuse of the already implemented `cloze_sentence_choice` mechanic rather than counted as a new Pattern #39. Reusing an existing mechanic is not a new gameplay pattern.

### Bahasa punctuation / capitalization

The five `bahasa-tanda-*` / `bahasa-kapital-*` activities already ask the learner to recognize the correctly written sentence among three complete sentence forms. Generic direct choice is not ideal visually, but the current interaction already directly measures the recognition objective. A new taxonomy label is not justified by this audit.

### Science life-cycle activities

The `science-cycle-*` activities have meaningful temporal content, but the exact choice evidence is heterogeneous: one asks for a full ordered sequence, while others ask about an earlier stage, adult form or young plant stage. The family does not yet yield one sufficiently strict presentation contract without either broad content-specific branching or changing task semantics. It remains a future audit candidate.

### Math visual word problems

The five `math-problem-*` activities form one exact lesson/skill family and expose the clearest objective-to-presentation gap.

## Selected candidate

Working pattern name:

```text
visual_word_problem
```

Exact scope:

```text
math-problem-apples
math-problem-birds
math-problem-cars
math-problem-cookies
math-problem-balloons
```

Canonical ownership:

```text
subject:     math
stage:       math-ukur-ruang
lesson:      math-visual-problems
pack:        math.pack.visual-problems
skill:       math.problem.visual
runtime:     tap_choice
assessment:  assessed
contract:    choice_accuracy_v1
```

## Canonical objective and skill

Lesson title:

```text
Masalah visual
```

Lesson objective:

> Mengubah cerita sehari-hari yang sederhana menjadi perhitungan kecil.

Mapped skill:

```text
math.problem.visual
```

Skill description:

> Menalar cerita pendek dengan jumlah kecil dan memilih hasil yang tepat.

The exact five prompts are:

```text
Gian punya 2 apel. Naya memberi 2 lagi. Berapa apel Gian sekarang?
Ada 5 burung. 2 terbang pergi. Berapa burung tersisa?
Paca punya 3 mobil, lalu menemukan 1 lagi. Berapa semuanya?
Ada 6 biskuit. 2 dimakan. Berapa yang tersisa?
Zia punya 4 balon lalu mendapat 3 lagi. Berapa balon sekarang?
```

All five retain three numeric canonical choices and one numeric `correctChoice`.

## Why the current representation is weak

The current `choice_grid` records a valid final numeric response but presents these activities like a generic quiz. That under-represents the canonical objective in two ways:

1. the lesson is explicitly named **Masalah visual**;
2. the objective is not merely arithmetic recall — it asks the learner to interpret a short everyday story as a small calculation.

A detached prompt plus three answer buttons does not make the quantity change in the story visible. The learner receives no structured visual representation of the starting quantity and the story change, even though the canonical lesson/skill explicitly frames the task as visual story reasoning.

A `visual_word_problem` presentation can materially improve fidelity by showing the unchanged story together with a concrete quantity-change board:

- starting quantity;
- added or removed quantity;
- object token matching the existing activity emoji;
- unknown final quantity;
- the unchanged three canonical numeric answers.

The learner still solves the same canonical problem and submits the same canonical answer payload. The visual board is a representation of the existing story, not a new assessment question.

## Why this is not an existing pattern

Relevant implemented patterns are semantically different:

- `choice_grid` — generic direct choice;
- `make_total` — direct addition composition from canonical arithmetic activities;
- `take_away` — direct subtraction/removal from canonical arithmetic activities;
- `equal_groups` — grouping/partition structure;
- `count_and_select` — count a represented set;
- `more_less_balance` — compare quantities;
- `number_line` — number-order representation.

`make_total` and `take_away` are the closest technical relatives, but they start from explicit arithmetic concepts. The selected Pattern #39 family starts from a **story context** whose evidence objective is interpreting a real-world quantity change before choosing the result.

The new presentation therefore must not collapse into a generic `make_total` or `take_away` board. The story remains the primary task context, while the visual quantity-change board supports the canonical word-problem interpretation.

## Exact deterministic model

The five audited prompts encode only simple one-step addition/subtraction and can be represented without rewriting content:

| Activity | Start | Change | Operation | Result | Token |
| --- | ---: | ---: | --- | ---: | --- |
| `math-problem-apples` | 2 | 2 | add | 4 | 🍎 |
| `math-problem-birds` | 5 | 2 | subtract | 3 | 🐦 |
| `math-problem-cars` | 3 | 1 | add | 4 | 🚗 |
| `math-problem-cookies` | 6 | 2 | subtract | 4 | 🍪 |
| `math-problem-balloons` | 4 | 3 | add | 7 | 🎈 |

Implementation should use an explicit exact-scope configuration for these values rather than heuristically parsing arbitrary Indonesian prose. This keeps classification fail-closed and prevents unrelated story prompts from being absorbed accidentally.

## Evidence contract

Pattern #39 must preserve the existing evidence model exactly:

- canonical activity IDs unchanged;
- runtime remains `tap_choice`;
- assessment remains `assessed`;
- contract remains `choice_accuracy_v1`;
- lesson/pack/skill links unchanged;
- three canonical choices unchanged and in canonical order;
- `correctChoice` unchanged;
- wrong selection remains measured/retryable and cannot complete;
- correct selection completes the existing activity;
- no new mastery threshold or progression rule;
- no schema, migration or content rewrite.

The implementation may add runtime metadata describing the visual-word-problem interaction, but that metadata must not redefine what counts as correct evidence.

## Exact presentation contract

Implementation may proceed only if all of these remain true:

1. Classification is exact-scoped to the five audited IDs and requires the canonical Math stage/lesson/pack/skill/runtime shape.
2. A deterministic config exists for start count, change count, operation and object token for every scoped activity.
3. The unchanged canonical prompt remains visible and remains the narration source.
4. The visual board clearly distinguishes starting quantity from the story change.
5. Addition and subtraction are represented differently without changing the canonical answer payload.
6. The final quantity stays unknown until the learner selects the correct canonical answer.
7. The three canonical choices remain direct keyboard/touch/pointer buttons; no drag-only dependency.
8. Wrong feedback is retryable and does not reveal the correct answer.
9. Correct feedback completes through the existing measured completion path.
10. No invented extra question, operation-choice checkpoint, confirmation step or hint that changes the assessed task.
11. Layout must remain usable at 320x720, 390x844, 768x1024 and desktop widths.
12. The implementation must not reclassify unrelated Math arithmetic activities.

## Required runtime evidence metadata

For assessed completion, metadata should identify the interaction without replacing canonical evidence semantics:

```text
source: visual-word-problem-runtime
evidenceFidelity: choice_visual_word_problem_interaction
startCount
changeCount
operation
selectedChoice
```

Accuracy, incorrect count and retry count must keep the same canonical measured semantics already used by other assessed choice presentations.

## Regression requirements

Before implementation merge, prove:

- exactly five activities classify as `visual_word_problem`;
- every scoped activity keeps canonical prompt, choices, choice order and `correctChoice` byte-for-byte;
- every scoped activity remains Math / `math-ukur-ruang` / `math-visual-problems` / `math.pack.visual-problems` / `math.problem.visual` / assessed `tap_choice`;
- deterministic config result matches canonical `correctChoice` for all five;
- addition and subtraction configs cover both operation branches;
- malformed/non-scope activities fail closed;
- wrong answer cannot complete and correct answer can complete;
- evidence metadata/count/accuracy/retry semantics are verified;
- keyboard plus touch/pointer are verified;
- representative idle/wrong/success browser states are captured at 320x720, 390x844 and 768x1024;
- no horizontal overflow or hidden answer controls;
- gameplay distribution remains 900/900 classified with exactly 39 active patterns after implementation;
- deterministic activity-quality remains clean;
- full CI, Windows compatibility, production build and independent exact Cloudflare release smoke pass.

## Decision

**Pattern #39 is justified as `visual_word_problem` for exactly the five `math-problem-*` activities listed above.**

The reason is objective fidelity: the canonical lesson and skill explicitly require interpreting a small everyday story as a calculation, while the current generic choice grid hides the quantity-change structure. A visual story board materially represents the intended reasoning without changing the answer, assessment, mastery or progression contract.

This audit does **not** approve:

- converting all Math story-like prompts;
- changing any canonical prompt or numeric answer;
- adding a new operation-selection assessment;
- reusing the label for Science lifecycle or English/Bahasa activities;
- any Pattern #40+ mechanic.

## Next step

After this audit is merged, implementation should start from the resulting latest `main` on a separate branch and add only the exact config/classifier, child-facing presentation, regression/browser QA, distribution registration and implementation documentation needed for these five activities.