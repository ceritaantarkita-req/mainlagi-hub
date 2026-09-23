# Mainlagi World — Petualangan Uang Evidence Bridge Audit — 22 September 2026

Status: **AUDIT / FAIL-CLOSED / NO MASTERY ACTIVATION**

This audit answers one narrow question:

> Which Petualangan Uang activities could defensibly contribute to existing canonical Belajar Skill Mastery later, without inventing fake evidence?

It does **not** activate mastery.

## 1. Current runtime truth

Petualangan Uang currently has:

- 8 Stages;
- 16 reusable mechanic activity placements;
- all 16 marked `practice`;
- all 16 resolving to `completion_only_v1`;
- World ★★★ used only for Stage completion/progression;
- World progress stored separately from canonical Belajar progress/mastery.

This remains correct until a server-owned bridge is explicitly approved.

## 2. Canonical server boundary audited

The existing `record_learning_attempt(...)` RPC:

1. requires an authenticated account;
2. looks up the supplied `activity_id` in `public.learning_activities`;
3. rejects unknown activity IDs;
4. canonicalizes subject/stage/runtime from the server-owned activity row;
5. only creates mastery evidence when the canonical activity is `assessment='assessed'`;
6. derives Skill evidence through `public.learning_activity_skills`;
7. recomputes mastery server-side.

Therefore a World client must **not** submit arbitrary World IDs or skill IDs directly.

## 3. Current blockers

The bridge is intentionally disabled while these blockers remain:

```text
world-activity-ids-are-not-canonical-learning-activities
canonical-learning-skill-age-contract-currently-stops-at-7
server-owned-world-activity-to-skill-registration-not-defined
world-completion-stars-must-remain-separate-from-mastery
```

The 6–8 pilot is especially important here: existing canonical skill age metadata still tops out at 7, so an age-8 learner cannot be silently treated as fully covered by the current Belajar skill-age contract.

The exact profile/catalog/database/runtime blockers and safe migration phases are recorded in `WORLD_AGE_MIGRATION_AUDIT_2026-09-22.md`.

## 4. Evidence audit result

Only **2 of 16** World activities currently have a defensible objective-level match to an existing canonical Skill.

### Candidate A — Stage 2 price comparison

```text
World activity: money-s02-activity-01
Stage:          money-stage-02-price-change
Mechanic:       compare
World prompt:   Mana harga yang lebih mahal?
Candidate Skill:math.quantity.comparison
Assessed evidence if enabled later: choice_accuracy_v1
Current status: CANDIDATE ONLY / NOT ACTIVE
```

Why it is plausible:

- the learner compares two numeric amounts;
- the reusable `compare` mechanic can produce measured choice accuracy;
- the canonical Math skill already includes direct numeric greater/smaller comparisons in its activity family.

Why it is not active:

- World activity ID is not in the canonical server activity registry;
- pilot includes age 8 while current canonical skill-age contract ends at 7;
- server-owned activity-to-skill linkage for World has not been designed.

### Candidate B — Stage 8 subtraction

```text
World activity: money-s08-activity-02
Stage:          money-stage-08-final-festival
Mechanic:       tap_choice
Presentation:   take_away
Prompt:         Ada 8 token. Dipakai 2. Berapa sisanya?
Candidate Skill:math.operation.subtraction.within_10
Assessed evidence if enabled later: choice_accuracy_v1
Current status: CANDIDATE ONLY / NOT ACTIVE
```

Why it is plausible:

- the task directly represents 8 − 2;
- the existing canonical Skill is specifically subtraction within 10;
- `tap_choice` supports measured `choice_accuracy_v1`.

Why it is not active:

- same registry/age/server-link blockers above;
- World completion must not award Belajar stars/certificates by accident.

## 5. Explicit exclusions

The other 14 activities remain excluded from canonical mastery at this checkpoint.

| World activity | Why excluded |
| --- | --- |
| `money-s01-activity-01` | money-use / price-recognition objective has no compatible canonical Skill |
| `money-s01-activity-02` | item-price matching is financial-literacy context; matching mechanic alone does not justify a Skill |
| `money-s02-activity-02` | price-movement classification has no canonical financial Skill |
| `money-s03-activity-01` | work/business income-source recognition has no canonical Skill |
| `money-s03-activity-02` | productive-activity recognition is contextual financial learning |
| `money-s04-activity-01` | needs/wants classification has no canonical Skill |
| `money-s04-activity-02` | contextual priority choice has no canonical Skill |
| `money-s05-activity-01` | counting tokens is incidental; learning objective is saving toward a goal |
| `money-s05-activity-02` | saving-process sequencing is not canonical Math number ordering |
| `money-s06-activity-01` | saving/investment-purpose recognition has no canonical Skill |
| `money-s06-activity-02` | investment introduction remains concept exposure |
| `money-s07-activity-01` | up/down classification is embedded in financial-risk meaning, not canonical number ordering |
| `money-s07-activity-02` | risk-statement recognition has no canonical Skill |
| `money-s08-activity-01` | integrated budget/needs choice combines concepts and should not be collapsed into one Skill |

## 6. Why mechanic measurability is not enough

A reusable mechanic may support assessed evidence technically, but that does not make every use of the mechanic valid mastery evidence.

The bridge requires both:

```text
objective match
+
compatible measured evidence contract
```

Examples:

- `ordering_sequence` can measure sequence accuracy, but sequencing how to save money is not automatically `math.number.ordering`;
- `sort_classify` can measure classification accuracy, but classifying needs/wants does not create an existing Math/Logic Skill by itself;
- `matching` can measure matching accuracy, but matching jobs to outputs is not existing word-picture or shape mastery.

## 7. Required architecture before activation

Do not enable the two candidates until all of these are resolved:

1. define how a World activity becomes a canonical server-recognized activity without forcing it into Belajar subject hierarchy;
2. define server-owned World activity -> canonical Skill links;
3. migrate/resolve the current 3–7 canonical age constraints before age-8 mastery is possible;
4. preserve existing replay/anti-farming/hint/retry behavior;
5. ensure World Stage ★★★ does not increment canonical learning stars;
6. ensure World completion cannot issue Belajar certificates/achievements merely because the World was completed;
7. preserve stable World activity IDs and evidence contract versions;
8. add server/database tests before changing any World placement from `practice` to `assessed`.

## 8. Recommended implementation shape later

The safest future direction is **server-owned registration**, not a client-side shortcut.

Conceptually:

```text
World activity placement
        |
        v
registered canonical evidence activity
        |
        +--> canonical mechanic/evidence contract
        |
        +--> approved canonical Skill link
        |
        v
record_learning_attempt(...)
        |
        v
server-owned evidence + mastery recompute
```

World progression should continue to use its own Stage/Segment progress store.

## 9. What this branch implements now

Machine-readable audit manifest:

```text
src/lib/learning/world/moneyWorldEvidenceBridge.ts
version: money-world-evidence-bridge-v0
enabled: false
```

Tests enforce:

- bridge remains disabled;
- exactly two candidates;
- exactly fourteen exclusions;
- all sixteen World activity placements are covered exactly once;
- candidate Skill IDs exist in the canonical catalog;
- candidate assessed evidence contracts match the reusable mechanic library;
- the age-7 canonical blocker remains explicit.

No SQL migration, mastery mutation, activity assessment change or RPC bypass is added by this audit.

## 10. Next gate

The next safe step is **not** to flip `enabled=true`.

First decide the canonical registration architecture and age-schema migration strategy. Only after those are separately accepted should the two candidate activities be implemented as assessed evidence in an isolated migration/runtime wave.
