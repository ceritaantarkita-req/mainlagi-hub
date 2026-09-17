# Pattern #42 Objective / Evidence Audit — 17 September 2026

Status: **AUDIT COMPLETE / IMPLEMENTATION CANDIDATE JUSTIFIED / CODE NOT STARTED**

Canonical audit base: `e20b50431d907f9ca6f3ef254b7c69aa24a132a5`  
Latest fully closed gameplay at audit start: **Pattern #41 — `phrase_scene_match`**  
Verified audit-base CI: **#869 / run `35241959755` — full success including exact Cloudflare production smoke**  
Merged distribution at audit start: **900/900 classified / 41 active patterns / `choice_grid` 257/900**.

## Audit rule

Pattern #42 is not selected to increase the pattern count. A valid audit result remains **“no justified Pattern #42 candidate yet.”**

A candidate is accepted only when:

- the canonical learning objective is materially under-represented by the current presentation;
- the proposed interaction is semantically distinct from existing patterns;
- canonical activity identity, prompt, answer payload, assessment, evidence, mastery and progression can remain unchanged;
- deterministic explicit config is possible without heuristic prompt parsing;
- the scope is small, coherent, reusable and fail-closed.

## Candidate review

### English sentence completion

The remaining `english-complete-*` activities should reuse the existing `cloze_sentence_choice` family if separately approved for reuse. Reuse is not a new gameplay pattern.

### Bahasa punctuation / capitalization

The `bahasa-tanda-*` and `bahasa-kapital-*` activities directly assess recognition of correctly written sentences. A proofreading skin would mainly be cosmetic and does not justify Pattern #42.

### Science forces and motion

The `science-force-*` direct-choice activities cover push, pull, gravity direction and friction. The evidence is heterogeneous enough that one new mechanic would either become broad content-specific branching or collapse distinct scientific relations into a cosmetic wrapper. This audit does not approve the family.

### Science food chain

`science-simple-food-chain` has meaningful ordered-system content, but one direct-choice activity does not yet provide a sufficiently reusable exact family for a new child-facing pattern. It remains a future candidate if a coherent evidence family appears.

### Iqro

Iqro remains `expert_required`, not `expert_approved`. This audit does not introduce a new Iqro mechanic without expert evidence.

### Broad Science life-cycle family

Prior audits correctly rejected the full `science-cycle-*` family as heterogeneous. That rejection remains valid for the broad family:

- `science-cycle-butterfly` asks the learner to identify a complete four-stage ordered sequence;
- `science-cycle-frog`, `science-cycle-chick`, and `science-cycle-seed-sprout` ask for one target growth stage relative to a known stage;
- `science-match-young-adult-b` uses canonical `matching` evidence.

Pattern #42 must not erase those semantic/runtime differences simply because the activities share one lesson.

## Narrowed candidate discovered by this audit

Three direct-choice activities form a coherent sub-family that prior broad-family audits did not isolate:

```text
science-cycle-frog
science-cycle-chick
science-cycle-seed-sprout
```

Working pattern name:

```text
growth_stage_transition
```

These three activities all measure a **single biological growth-stage transition**: a known stage/context is presented and the learner identifies the adjacent or target growth stage.

The candidate deliberately excludes:

```text
science-cycle-butterfly
science-match-young-adult-b
```

The butterfly activity remains a full-sequence task. The matching activity remains canonical multi-pair matching. Neither is Pattern #42.

## Canonical ownership

```text
subject:     science
stage:       science-life-material-motion
lesson:      science-life-cycles
pack:        science.pack.life-cycles
skill:       science.life_cycles.basic
runtime:     tap_choice
assessment:  assessed
contract:    choice_accuracy_v1
```

Lesson objective:

> Mengenali tahap pertumbuhan sederhana pada hewan dan tumbuhan.

Skill description:

> Mengenali tahap pertumbuhan sederhana pada hewan dan tumbuhan.

## Exact canonical tasks

```text
science-cycle-frog
  title: Katak tumbuh dari berudu
  description: Mengenali tahap awal pertumbuhan katak.
  prompt: Sebelum menjadi katak dewasa, anak katak hidup di air sebagai apa?
  choices: berudu | ulat | anak ayam
  correct: berudu

science-cycle-chick
  title: Anak ayam bertumbuh
  description: Menghubungkan anak hewan dengan bentuk dewasanya.
  prompt: Anak ayam akan tumbuh menjadi apa?
  choices: ayam dewasa | bebek dewasa | burung merpati
  correct: ayam dewasa

science-cycle-seed-sprout
  title: Biji mulai berkecambah
  description: Mengenali kecambah sebagai tahap awal pertumbuhan tanaman.
  prompt: Setelah biji mulai tumbuh, tahap muda yang muncul disebut apa?
  choices: kecambah | batu | buah matang
  correct: kecambah
```

## Why the current representation is weak

All three activities currently resolve through a generic direct-choice presentation. The final answer evidence is valid, but the interaction does not visibly represent the temporal/growth relation required by the lesson objective.

A child can currently scan three labels without seeing a stable representation of:

```text
known growth stage -> target growth stage
```

The learning objective is not merely vocabulary recognition. It is recognizing how a living thing changes from one growth stage to another.

A dedicated transition board can make that relation visible while keeping the exact canonical choice as the assessed answer.

## Why this is not an existing pattern

### Not `cause_effect`

Existing `cause_effect` is intentionally scoped to four Science water-change activities:

```text
melting
freezing
evaporation
condensation
```

Those activities represent a starting physical state plus an environmental condition that causes a physical-state change. Biological growth-stage progression is not the same evidence model. Pattern #42 must not broaden `cause_effect` into a generic “anything changes” mechanic.

### Not `relative_order_track`

`relative_order_track` measures abstract positional/order reasoning over a visible track of at least four items, with relations such as before, after, between, third position or two steps after. The life-cycle candidate measures a biological transition between known and target stages rather than index reasoning in an arbitrary ordered list.

### Not `missing_sequence_slot`

The existing sequence-slot family is an ordered-symbol/alphabet completion interaction. Pattern #42 does not ask the learner to fill a generic sequence slot and must not convert the butterfly full-cycle sequence into the candidate scope.

### Not matching

`science-match-young-adult-b` already has a canonical `matching_accuracy_v1` contract and should continue using its matching runtime. Pattern #42 preserves that boundary.

## Deterministic transition model

Implementation, if approved after this audit merges, should use explicit config for the three audited IDs only.

Suggested normalized model:

```text
science-cycle-frog
  mode: previous_stage
  knownStage: katak dewasa
  knownIcon: 🐸
  transitionDirection: backward
  targetChoice: berudu
  choiceScenes:
    berudu -> tadpole / aquatic young frog
    ulat -> caterpillar
    anak ayam -> chick

science-cycle-chick
  mode: next_adult_stage
  knownStage: anak ayam
  knownIcon: 🐥
  transitionDirection: forward
  targetChoice: ayam dewasa
  choiceScenes:
    ayam dewasa -> adult chicken
    bebek dewasa -> adult duck
    burung merpati -> adult pigeon

science-cycle-seed-sprout
  mode: next_young_stage
  knownStage: biji
  knownIcon: 🌱/seed representation
  transitionDirection: forward
  targetChoice: kecambah
  choiceScenes:
    kecambah -> young sprout
    batu -> stone
    buah matang -> ripe fruit
```

Exact iconography may be adjusted to the Mainlagi art system, but config must remain explicit and deterministic. No prompt parser is permitted for classification or correctness.

## Evidence contract

Pattern #42 must preserve the existing canonical evidence model exactly:

- activity IDs unchanged;
- subject/stage/lesson/pack/skill ownership unchanged;
- runtime remains `tap_choice`;
- assessment remains `assessed`;
- evidence contract remains `choice_accuracy_v1`;
- prompt unchanged;
- canonical three choices unchanged and in canonical order;
- `correctChoice` unchanged;
- selected answer payload remains the canonical choice string;
- wrong answer remains measured/retryable and cannot complete;
- correct answer completes the existing activity;
- no new mastery threshold or stage progression rule;
- no schema, migration or database rewrite.

## Exact presentation contract

Implementation may proceed only if all of these remain true:

1. Classification is exact-scoped to the three audited IDs.
2. Classification requires canonical Science subject/stage/runtime and exact deterministic config.
3. Canonical prompt remains visible and remains the narration source.
4. The board shows the known growth stage and a clearly unknown target slot before successful completion.
5. The board may indicate forward/backward growth relation, but must not reveal the canonical correct answer before selection.
6. Every canonical choice receives an equivalent deterministic visual affordance; styling must not identify the correct answer pre-selection.
7. Canonical choice labels/order and submitted values remain unchanged.
8. Wrong feedback remains retryable and must not reveal or auto-fill the correct answer.
9. Correct feedback may reveal/complete the transition only after the canonical correct choice is selected.
10. Direct keyboard/touch/pointer controls remain available; no drag-only requirement.
11. No extra assessed checkpoint, spoken-answer checkpoint, animation timing score, or translation task is added.
12. The board remains usable at 320x720, 390x844, 768x1024 and desktop widths.
13. Butterfly full-sequence, life-cycle matching and unrelated Science activities remain outside the classifier.

## Suggested runtime evidence metadata

For assessed completion, metadata should identify the presentation without replacing canonical correctness semantics:

```text
source: growth-stage-transition-runtime
evidenceFidelity: choice_growth_stage_transition_interaction
transitionMode
selectedChoice
```

Accuracy, incorrect count, retry count and canonical skill evidence remain unchanged.

## Required regression before implementation merge

Implementation is not accepted unless it proves all of the following:

- exactly 3 activities classify as `growth_stage_transition`;
- exact ID set equals frog/chick/seed-sprout above;
- canonical prompt is byte-preserved for all three;
- canonical choices and their order are byte-preserved;
- canonical `correctChoice` is byte-preserved;
- exact ownership remains Science / `science-life-material-motion` / `science-life-cycles` / `science.pack.life-cycles` / `science.life_cycles.basic`;
- runtime remains `tap_choice`;
- assessment remains assessed and evidence contract remains `choice_accuracy_v1`;
- deterministic config exists for every scoped ID and every canonical choice;
- previous-stage, next-adult-stage and next-young-stage branches are covered;
- config fails closed if ID ownership, prompt, choices/order, correct answer or runtime drifts;
- `science-cycle-butterfly` does not classify as Pattern #42;
- `science-match-young-adult-b` does not classify as Pattern #42;
- existing `cause_effect`, `relative_order_track`, sequence and matching families remain unchanged;
- idle state cannot complete;
- wrong answer increments canonical incorrect/retry evidence and cannot complete;
- correct answer completes and records the canonical assessed evidence;
- keyboard and pointer/touch answer paths work;
- minimum 44px interactive targets remain available;
- browser captures cover idle/wrong/success at 320x720, 390x844 and 768x1024;
- no horizontal overflow or unintentionally clipped primary content;
- activity-quality audit remains clean;
- permanent visual QA remains P0=0 / P1=0;
- full Ubuntu/Windows/build/dependency/security/mobile CI remains green;
- resulting merged-main release passes exact Cloudflare production smoke.

## Distribution acceptance target

This is an **implementation target**, not current merged truth:

```text
classified:                    900 / 900
unclassified:                    0
active patterns:                42
choice_grid                    254 / 900
growth_stage_transition          3 / 900
```

Until implementation merges and is independently verified on `main`, canonical merged truth remains **41 active patterns / `choice_grid` 257/900**.

## Explicitly not approved by this audit

- converting all `science-cycle-*` activities to Pattern #42;
- converting `science-cycle-butterfly` to Pattern #42;
- changing `science-match-young-adult-b` away from canonical matching;
- introducing an arbitrary life-cycle prompt parser;
- rewriting canonical prompts, choices or answers;
- drag-only interaction;
- animation speed/timing as assessment evidence;
- new mastery/progression thresholds;
- schema/database migrations;
- Pattern #43 or later implementation.

## Audit conclusion

A justified Pattern #42 candidate exists: **`growth_stage_transition` for exactly three Science life-cycle direct-choice activities**.

The important change from prior audits is not a reversal of their broad-family rejection. It is a narrower evidence boundary: full sequence and matching remain excluded, leaving a coherent single-transition family that can be represented more faithfully than generic choice without changing canonical evidence.

**Runtime implementation has not started in this audit branch.**
