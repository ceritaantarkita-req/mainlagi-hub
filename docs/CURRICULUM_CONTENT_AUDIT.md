# Mainlagi Curriculum & Content Audit

Status: implementation baseline for the Mainlagi product curriculum.

This document describes the curriculum structure implemented in the repository. It is **not** a claim that Mainlagi is aligned or equivalent to a government, school, Montessori, Cambridge, or other third-party curriculum unless a later review explicitly establishes that alignment.

## Canonical hierarchy

Mainlagi uses one educational hierarchy consistently:

`Subject -> Learning Path -> Stage -> Lesson -> Activity`

- **Subject** is the broad learning area.
- **Learning Path** groups a coherent progression inside a subject.
- **Stage** is an unlock/progression boundary.
- **Lesson** states a small learning objective and groups related activities.
- **Activity** is the actual child interaction and the only layer that records a learning attempt.

The hierarchy is defined in `src/lib/learning/curriculum.ts`; runtime activity definitions remain in `src/lib/learning/system.ts`; assessed/practice classification and skill evidence mappings remain in `src/lib/learning/catalog.ts`.

## Current content coverage

| Subject | Learning path | Stages | Main assessed focus | Practice / creative focus |
| --- | --- | ---: | --- | --- |
| Bahasa Indonesia | Fondasi Literasi | 2 | huruf A, huruf awal | cerita pendek |
| English | First English Steps | 1 | color word, listening word, word-picture matching | - |
| Matematika | Fondasi Numerasi | 2 | count 1-3, numeral 5 formation, pattern matching | optional motion |
| Iqro | Fondasi Hijaiyah | 1 | Alif recognition | optional Hijaiyah motion |
| Mewarnai | Creative Color Play | 1 | none by design | free color exploration |

## Content quality rules now enforced

1. Every runtime stage must belong to exactly one learning path.
2. Every runtime activity must belong to exactly one lesson.
3. Lesson, stage, path, activity, subject, and age ranges must remain consistent.
4. Assessed activities remain restricted to runtimes with measurable evidence contracts.
5. Creative/practice activities cannot be promoted to academic mastery by a caller flag.
6. Camera/motion activities are opt-in and are not required for core completion unless a future curriculum decision explicitly changes that rule.
7. Adaptive ranking uses age as a hard eligibility boundary.
8. Adaptive ranking prefers unfinished core work and weak/low-confidence assessed skills while avoiding immediate replay loops and camera pressure.
9. Parent recommendations explain the reason for the recommended activity rather than presenting a black-box score.
10. Mastery remains separate from completion, rewards, achievements, and certificates.

## Gaps identified for the next content-expansion wave

The current structure is now coherent, but content breadth is still intentionally small. The next expansion should add **distinct assessed activities** for foundational skills so children can accumulate varied evidence without relying on repeated identical prompts.

Priority gaps:

- Bahasa: more letter recognition and beginning-sound variants.
- English: more distinct evidence for colors, listening vocabulary, and picture matching.
- Math: more counting variants and additional pattern items; numeral tracing should only expand when the guided-trace measurement contract supports the new glyph safely.
- Iqro: additional Alif variants first, then new Hijaiyah skills in small increments.
- Mewarnai: expand creative variety without inventing academic mastery or a competency certificate.

## Adaptive learning behavior

The recommendation engine is deliberately deterministic and explainable. It considers:

- child age eligibility;
- stage unlock state;
- unfinished required/core activities;
- whether a skill has qualifying evidence;
- mastery score and confidence;
- whether the skill is already mastered;
- activity difficulty as a soft age-fit signal;
- the immediately previous activity;
- whether motion/camera was explicitly allowed.

It does **not** infer intelligence, diagnosis, personality, or developmental disorder from performance.

## Release rule

New curriculum content must not be merged merely because the UI renders. A content expansion is complete only when:

1. runtime activity definition exists;
2. learning catalog classification exists;
3. skill mapping exists;
4. canonical lesson/path mapping exists;
5. Supabase learning catalog migration exists when the activity can sync to cloud;
6. assessed-runtime contract tests pass;
7. curriculum hierarchy tests pass;
8. Ubuntu + Windows CI pass;
9. Cloudflare production build and exact-commit smoke pass after merge.
