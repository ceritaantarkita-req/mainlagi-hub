# Mainlagi World → Evidence — Activation Decision Design — 23 September 2026

Status: **DECISION DESIGN GREEN TARGET / PRE-ACTIVATION / DISABLED**

This document resolves the next decision wave after the fail-closed World → Evidence v1 architecture closure. It does **not** activate evidence or mastery writes.

## 1. Scope decision

The v1 audit had two candidate relationships. This wave resolves them differently.

### Deferred — Stage 2 price comparison

```text
money-s02-activity-01
Stage: money-stage-02-price-change
mechanic: compare
current assessment: practice
prompt: "Mana harga yang lebih mahal?"
values: Rp10 vs Rp12
```

Decision:

```text
canonical evidence: DEFERRED
```

Reason: the authored objective is contextual price comparison inside the inflation story. The canonical skill `math.quantity.comparison` is a Math quantity/number-comparison skill. Reusing it here would blur the difference between understanding price context and demonstrating canonical quantity-comparison mastery.

This activity remains World practice.

### Accepted for future supplemental evidence — Stage 8 subtraction

```text
money-s08-activity-02
Stage: money-stage-08-final-festival
mechanic: tap_choice
current assessment: practice
representation: 8 tokens, remove 2
prompt: "Ada 8 token. Dipakai 2. Berapa sisanya?"
correct answer: 6
```

Future mapping:

```text
skill: math.operation.subtraction.within_10
mechanic evidence contract: choice_accuracy_v1
role: supplemental evidence
```

This is a direct take-away representation and matches the canonical subtraction objective.

The mapping decision does **not** promote the current activity to assessed. A separate reviewed content change is required before runtime activation.

## 2. Age-8 decision

World remains:

```text
Petualangan Uang: age 6–8
```

Canonical subtraction skill remains:

```text
math.operation.subtraction.within_10: age 5–7
```

Decision:

```text
age 6–7 -> may become eligible for supplemental evidence after activation
age 8   -> World completion only; no canonical evidence/mastery contribution
```

Do not rewrite the canonical skill catalog to age 8 merely to make World evidence fit.

## 3. Evidence role

World evidence is **supplemental**, not a replacement for direct Belajar assessment.

For the Stage 8 static subtraction item:

```text
max qualifying World evidence per activity + content version = 1
repeated static replay = recorded/handled by the server, but not additional qualifying mastery evidence
World-only mastery ceiling = exploring
developing/proficient/mastered = require canonical Belajar qualifying evidence
```

This prevents one fixed `8 - 2` question from being replayed into false mastery.

Existing canonical scoring principles remain relevant:

- completed measured attempt required;
- accuracy must be server-validated;
- hints/retries reduce independence;
- retry count >= 7 is non-qualifying;
- server receipt time owns replay protection.

## 4. Selected server architecture

Do **not**:

```text
World client
→ guessed Belajar activity ID
→ record_learning_attempt(...)
```

Selected future boundary:

```text
World runtime
  ↓ raw observation only
POST /api/learning/world-evidence
  ↓
server auth + child ownership
  ↓
server-owned World source mapping
  ↓
age gate + assessment gate + measured-result validation
  ↓
idempotency / replay / retry / content-version anti-farming
  ↓
private.record_world_skill_evidence
  ↓
learning_supplemental_skill_evidence
  ↓
source-aware mastery recompute
```

The browser must not choose:

- canonical skill;
- canonical activity;
- assessment mode;
- evidence weight;
- mastery eligibility;
- progression effect;
- reward effect.

## 5. Why supplemental evidence storage is separate

Current `learning_attempts.activity_id` references canonical `learning_activities`.

Creating a fake Belajar activity row for World would couple World to:

- canonical completion;
- Belajar stars;
- stage progression;
- reporting semantics intended for direct Belajar activity attempts.

The selected design is additive instead:

```text
learning_supplemental_skill_evidence
```

The exact migration is intentionally not implemented in this design wave.

The future table must preserve at least:

- account/child ownership;
- idempotent client observation identity;
- source kind/world/stage/activity;
- source content version;
- canonical skill key;
- server-derived evidence score/weight;
- qualifying/non-qualifying state;
- server receipt timestamp;
- bounded metadata.

## 6. Progression, rewards and certificate isolation

The v1 invariant remains:

```text
World completion / ★★★
≠ Belajar completion
≠ Belajar stars
≠ Belajar stage readiness
≠ certificate eligibility
```

Future Stage 8 supplemental evidence must keep:

```text
progressionEffect = none
rewardEffect      = none
certificateEffect = none
```

Mastery can only become source-aware after implementation-level safeguards exist.

## 7. Parent-report semantics

When later implemented, parent reporting must distinguish:

```text
Belajar assessed attempt
vs
World supplemental evidence
```

Suggested meaning:

```text
"Latihan tambahan dari Petualangan Uang"
```

It must not display a World activity as if the child completed the corresponding Belajar activity.

## 8. Implementation blockers still open

Decision work closed in this wave:

- candidate scope;
- Stage 2 defer decision;
- Stage 8 future mapping decision;
- age-8 behavior;
- server architecture selection;
- progression/reward/certificate isolation design;
- anti-farming/mastery-ceiling design.

Still not implemented:

1. Stage 8 authored promotion from practice to assessed;
2. supplemental evidence schema;
3. private server write function;
4. `/api/learning/world-evidence` route;
5. source-aware mastery recompute;
6. certificate isolation implementation;
7. parent-report source labeling;
8. security/ownership/idempotency/replay regression;
9. runtime observation emission.

## 9. Activation rule

Until all implementation blockers are green:

```text
World → Evidence runtime = DISABLED
World → Mastery writes   = DISABLED
```

The current fail-closed v1 bridge remains the runtime authority.

## 10. Source contract

```text
src/lib/learning/world/moneyWorldEvidenceActivationDesign.ts
```

Expected state:

```text
version: money-world-evidence-activation-design-v1
mode:    pre-activation-design-disabled
enabled: false
```

No SQL migration, RPC, runtime hook, mastery write, progression mutation, reward mutation, or certificate mutation is authorized by this decision document.
