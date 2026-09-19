# Phenomenon Relation Board Ecosystem-Dependency Reuse Audit — 19 September 2026

Status: **AUDIT COMPLETE / REUSE JUSTIFIED / CODE NOT STARTED**

## Audit base

```text
main:                           5ee96071e92906fcabf56dd31aa6541e7fa75dee
final environment docs PR:      #223
final environment main CI:      #1022 / run 35439479291
production smoke:               exact main SHA PASS
classified:                     900 / 900
active gameplay patterns:        47
choice_grid:                    210 / 900
phenomenon_relation_board:        4 / 900
```

This is a fresh objective/evidence audit after all five previously authorized reuse waves were fully closed/live verified.

## Candidate family

Exact direct-choice scope:

```text
science-eco-plant-sun-water
science-eco-bee-flower
science-eco-bird-tree
science-eco-food-chain-change
```

Canonical ownership:

```text
subject:          science
stage:            science-earth-body-environment
lesson:           science-ecosystem-dependencies
pack:             science.pack.ecosystem-dependencies
skill:            science.ecosystem.dependencies.basic
runtime:          tap_choice
assessment:       assessed
evidence:         choice_accuracy_v1
ages:             4–7
```

Lesson objective: **Mengenali hubungan sederhana antara makhluk hidup dan sumber daya lingkungannya.**

Skill description: **Mengenali hubungan sederhana makhluk hidup dengan makanan, air, cahaya, dan habitat.**

## Exact canonical evidence

### `science-eco-plant-sun-water`

```text
prompt:  Tanaman di kebun membutuhkan kombinasi mana untuk tumbuh?
choices: air dan cahaya | plastik dan kaca | mainan dan kertas
correct: air dan cahaya
```

Evidence meaning: connect a plant to environmental resources required for growth.

### `science-eco-bee-flower`

```text
prompt:  Mengapa lebah sering mendatangi bunga?
choices: mencari nektar | mencari batu | mencari plastik
correct: mencari nektar
```

Evidence meaning: connect an animal to a familiar food resource.

### `science-eco-bird-tree`

```text
prompt:  Pohon dapat membantu burung dengan menyediakan apa?
choices: tempat bertengger atau bersarang | air laut | roda kendaraan
correct: tempat bertengger atau bersarang
```

Evidence meaning: connect an animal to habitat/shelter support.

### `science-eco-food-chain-change`

```text
prompt:  Jika makanan utama suatu hewan sangat berkurang, apa yang mungkin terjadi?
choices: hewan lebih sulit mendapat makanan | hewan tidak perlu makan lagi | semua benda menjadi hidup
correct: hewan lebih sulit mendapat makanan
```

Evidence meaning: connect a resource change to a simple ecosystem consequence.

## Matching exclusion

```text
science-match-ecosystem-needs-c
runtime: matching
evidence: matching_accuracy_v1
```

It remains canonical matching and must not be absorbed into this reuse family.

## Why existing `phenomenon_relation_board` fits

Pattern #46 already measures one stated observation/context -> one direct-choice related result while preserving one assessed `choice_accuracy_v1` checkpoint.

The ecosystem activities use the same evidence shape:
1. present one organism/resource context;
2. ask for the most relevant dependency/resource/result;
3. select one of three canonical choices;
4. preserve direct-choice correct/incorrect/retry/accuracy evidence.

The interaction does not need:
- ordering;
- matching multiple pairs;
- sorting;
- multi-rule set membership;
- a second assessed checkpoint;
- a novel runtime.

Therefore a new Pattern #48 would duplicate an existing relation interaction.

## Required implementation boundary

The current Pattern #46 component has Earth/sky-specific copy and metadata. Safe reuse requires an explicit domain variant:

```text
earth_sky
ecosystem_dependency
```

Existing four Earth/sky activities must retain current behavior and metadata.

Ecosystem presentation should use domain-correct language such as:
- heading around ecosystem relationships/dependencies;
- neutral relation board labels for organism/context -> need/resource/result;
- no Earth/sky badge or astronomy wording.

Ecosystem evidence metadata should identify the domain explicitly while retaining one assessed direct-choice result. A domain-specific evidence fidelity is preferred:

```text
source: phenomenon-relation-board-runtime
evidenceFidelity: choice_ecosystem_dependency_relation_interaction
domainVariant: ecosystem_dependency
relationMode
selectedChoice
observationLabel
relationLabel
```

The historical pattern identifier remains `phenomenon_relation_board` for compatibility.

## Fail-closed requirement

Implementation may classify an ecosystem activity only when all canonical identity fields match:
- exact activity ID;
- subject `science`;
- stage `science-earth-body-environment`;
- runtime `tap_choice`;
- exact prompt;
- exact three-choice order;
- exact correct answer;
- complete explicit choice visuals.

Prompt-shape inference or generic Science relation detection is not allowed.

## Rejected alternative: Science force/motion as one reuse family

The four force/motion direct-choice activities remain heterogeneous:
- identify push;
- identify pull;
- predict gravity direction;
- compare friction effect.

They share a lesson/skill but not one relation evidence presentation. Moving all four into one relation-board skin would blur different reasoning forms. No force/motion runtime change is authorized by this audit.

## Expected distribution only after verified implementation

```text
900 / 900 classified
47 active gameplay patterns
choice_grid                    206 / 900
phenomenon_relation_board        8 / 900
```

Active pattern count remains 47. **Pattern #48 is not created.**

## Audit conclusion

**Reuse justified** for exactly the four ecosystem direct-choice activities above.

Implementation is authorized only after this audit itself passes exact-head CI, merges to `main`, and the audit-main exact-SHA Cloudflare smoke passes.

No other Science, Math, English, Bahasa, Logic, or Iqro family is authorized by this audit.
