# Mainlagi Learning Platform — Product, UX, and Activity Specification

Last reviewed: **14 September 2026**

Status: **canonical current UX/product specification**.

This document defines the product/UX rules that human contributors and AI agents must follow. Implementation truth remains code + `CURRENT_STATE.md`; execution priority is defined by `NEXT_PRODUCT_QUALITY_PLAN.md`.

## 1. Product intent

Mainlagi is a child-first learning and edutainment platform for children approximately **3–7 years old**, primarily for Indonesian families.

The product should feel like **one coherent learning world**, not a collection of unrelated mini-apps.

The current motion/vision engine and 10 existing Mainlagi games remain first-class capabilities, but core learning is **mobile-first and touch-first** and must not require camera motion.

## 2. Primary users

### Child

Primary learning user, approximately 3–7 years old.

### Parent/guardian

Account owner, buyer/decision maker, privacy controller and reader of progress/reporting.

Child and parent are separate UX surfaces. Do not put adult configuration, affiliate shopping, billing or technical controls into child learning screens.

## 3. Current learning areas

Canonical subjects:

1. Bahasa Indonesia
2. English
3. Matematika
4. Iqro
5. Huruf & Menulis
6. Logika
7. Sains
8. Mewarnai
9. Menggambar

Current baseline: **100 activities per subject / 900 total**.

The current priority is improving these 900 activities, not increasing their count.

## 4. Learning/data hierarchy

```text
Account / Household
└── Child Profile
    └── Subject
        └── Learning Path / Stage
            └── Lesson
                └── Activity
                    └── Attempt
                        └── Evidence / Mastery
```

The child does not need to understand this entire internal hierarchy.

Data/progression structure and visible navigation are different concerns.

## 5. Current frontend baseline

The Garden/Playroom redesign merged in PR #87 is the visual baseline for future work.

Preserve and improve, rather than reverting without evidence:

- active-child/continuation flow;
- playful Garden/Playroom visual language;
- large mobile-friendly controls;
- Nunito typography;
- Phosphor icon system;
- subject/stage/activity surfaces;
- activity previews;
- modernized Coloring and Drawing shells;
- audio/session improvements.

A redesign task should improve coherence inside this baseline unless a measured regression justifies replacing it.

## 6. Child Home

Child Home should prioritize:

1. **Lanjut Belajar / Continue Learning**;
2. recommended next activity;
3. current subject/stage context;
4. one clear character/feedback moment where useful;
5. a small number of subject shortcuts;
6. direct access to Main Gerak where appropriate.

Do not turn Child Home into a dense adult dashboard.

## 7. Subject browsing and progression

Current data progression is stage-based, while current subject UI can expose a broad activity gallery.

This creates an unresolved product question:

```text
stage-first
vs
recommended path + browse all
vs
gallery grouped by stage
vs
another validated hybrid
```

Rules until WS-09 is closed:

- recommendation/continue-learning must remain prominent;
- do not remove stage/evidence readiness to make browsing easier;
- do not make the child scan dozens of unexplained locked cards;
- browse-all may exist, but must not obscure the intended learning path;
- age-ineligible/locked states must be understandable and non-frustrating.

The final model must be documented before large navigation changes.

## 8. Age-aware UX

Age changes interaction complexity, representation and language—not just metadata.

### Approximately 3–4

Prefer:

- audio-first instruction;
- almost no required reading;
- one concept per screen;
- very large touch targets;
- simple visual tap/match/drag/trace;
- short sessions;
- character guidance;
- immediate positive feedback;
- forgiving input.

### Approximately 5–6

Add:

- phonics;
- letter recognition;
- numbers/counting;
- guided writing/tracing;
- sorting/sequencing;
- basic bilingual exposure;
- slightly longer activity chains.

### Approximately 6–7

Add:

- early reading;
- arithmetic;
- patterns/reasoning;
- more independent navigation;
- multi-step tasks;
- richer bilingual challenges.

## 9. Activity screen contract

A child activity screen should normally contain:

- one clear learning goal;
- one dominant interaction area;
- minimal competing controls;
- obvious back/exit behavior;
- audio/replay instruction where useful;
- immediate understandable feedback;
- large mobile touch targets;
- character feedback only when it helps rather than clutters.

If the child must interpret system terminology or scan many unrelated controls, the screen is too dense.

## 10. Activity-quality contract

**Learning objective determines representation and mechanic.**

Do not confuse different skills simply because the answer label is related.

Examples:

### Color recognition

Good representation:

- colored objects;
- color swatches;
- find colored object in a scene;
- sort objects by color.

Reading `BLUE / RED / GREEN` measures written color vocabulary, not pure visual color recognition.

### Letter recognition

Possible representations:

- discriminate target letter among visually plausible letters;
- upper/lowercase matching;
- find target letter in a scene/word;
- audio phoneme -> letter where appropriate;
- letter -> beginning-sound object mapping;
- tracing/writing practice.

Do not create dozens of activities that are only the same three-button template with different letters.

### Phonics/listening

Audio must carry meaningful evidence. Do not make the answer obvious from redundant on-screen text.

### Logic/order

Use ordering/sorting/sequence interactions when those better represent the skill than a generic multiple-choice card.

## 11. Activity review classification

Every current activity should eventually be classified:

- `KEEP`
- `POLISH`
- `REDESIGN`
- `REPLACE`

Review at minimum:

- age fit;
- learning objective;
- mapped skill;
- prompt clarity;
- representation;
- distractor quality;
- mechanic validity;
- ambiguity;
- difficulty;
- uniqueness;
- visual quality;
- assessed/practice/evidence compatibility.

Route validity alone is not a quality pass.

## 12. Gameplay mechanics

Current production families include tap choice, listen-and-choose, matching, trace, story, motion game, coloring and drawing.

Additional/reused interaction patterns may include:

- drag/drop;
- sorting;
- ordering/sequence;
- find-in-scene/hotspot;
- memory;
- puzzle/assembly;
- count/select objects;
- classification;
- optional motion.

Only add a mechanic if it better serves the activity's learning goal or play value.

All mechanics require mobile and accessibility QA.

## 13. Drawing

Drawing should be creative practice with useful scaffolding, not a text prompt attached to an empty canvas.

Complex activities may use progressive guide layers:

1. basic shape;
2. major structure;
3. detail;
4. optional decoration.

Rules:

- guide must not obstruct the drawing area;
- free drawing remains allowed;
- scaffolding complexity should match age;
- creative completion must not automatically become academic mastery evidence.

## 14. Coloring

Coloring should use authored/curated child-friendly vector art rather than uncontrolled procedural complexity.

Production asset rules:

- clear silhouette;
- consistent stroke;
- closed/fillable shapes;
- no accidental overlap;
- adequate fill/touch area;
- complexity appropriate to age;
- correct layer order;
- readable on phone;
- no disguised heavy duplicate composition.

Generated/procedural output can be a draft, but human visual approval is required for production-quality content.

## 15. Visual/art direction

The product should use an original Mainlagi visual identity.

Desired properties:

- friendly simple 2D illustration;
- rounded readable forms;
- consistent line/stroke language;
- generous whitespace;
- controlled palette;
- strong hierarchy;
- minimal decorative noise;
- large touch targets;
- predictable interaction states;
- age-appropriate visual complexity.

A permanent **Mainlagi Art Bible** must define characters, line/stroke style, palette, backgrounds, object style, shadows, spacing, touch/fill sizing and animation principles.

Automated SVG/DOM checks do not replace human visual judgment.

## 16. Characters

Canonical Mainlagi characters:

### Naya
Older sister figure, approximately 8, wears hijab; warm and encouraging.

### Gian
Boy, approximately 5; energetic, curious and playful.

### Zia
Girl, approximately 3; expressive and beginner-friendly.

### Paca
Friendly male-coded robot; useful for hints/system/discovery moments.

### Gavi
Orange cat; playful mascot for humor, rewards and reactions.

Characters are not decorative stickers only. They can provide narration, hints, retry feedback, celebrations, transitions and story continuity.

## 17. Voice and narration

Target languages:

- Bahasa Indonesia;
- English.

Target architecture:

```text
narration request
  -> provider-independent narration contract
      -> character/voice registry
          -> approved pre-generated audio asset for fixed content
          -> runtime TTS only when dynamic content requires it
```

Requirements:

- native-feeling pronunciation;
- child-friendly pace;
- stable character identity;
- engine/model/voice licence review;
- asset provenance;
- human review before fixed narration becomes approved;
- graceful fallback when audio is unavailable.

Iqro/Hijaiyah pronunciation requires competent human review and must not be approved solely through generic TTS.

## 18. Rewards, progression and mastery

Keep concepts separate:

- completion;
- stars/rewards;
- evidence;
- mastery;
- achievement;
- certificate.

Young children should receive forgiving retry/hint behavior. A failed answer is feedback, not punishment.

Do not turn every result into competitive ranking.

Practice-only creative content must not imply measured competency without valid assessed evidence.

## 19. Parent/public UX

Parent/public surfaces should provide clear access to:

- About Mainlagi;
- FAQ/help;
- child/account management;
- progress/reporting;
- privacy/data information;
- suitable parent recommendations;
- affiliate disclosure where applicable.

Current About/FAQ content needs updating from older Mainlagi positioning.

Affiliate recommendations may use the existing catalog/redirect infrastructure, but shopping CTA must not appear inside child learning flow.

## 20. Main Gerak

The existing motion/game catalog remains visible as a distinctive Mainlagi area.

The same game may be:

- directly playable from Main Gerak;
- adapted into a learning stage/activity;
- surfaced by recommendation when appropriate.

Direct game access does not bypass academic evidence rules for learning progress.

## 21. Accessibility/mobile rules

Every child-facing activity must consider:

- mobile portrait layout;
- adequate touch targets;
- text overflow;
- contrast;
- keyboard interaction where applicable;
- reduced motion;
- screen-reader semantics where meaningful;
- audio replay/control;
- safe area/orientation behavior;
- no accidental horizontal overflow.

Automated Chromium QA must be complemented by representative physical iPhone/Safari and Android/Chrome testing.

## 22. Privacy rules

Child UX must not casually send sensitive data to external providers.

Required principles:

- data minimization;
- explicit permission boundaries;
- no camera-frame retention by default;
- no client-side provider secrets;
- RLS/server authorization for account data;
- auditable dependencies/providers/assets.

## 23. OCR/AI

General OCR/AI support is future modular work, not a current product-quality blocker.

Do not couple core child UX to an external AI provider.

If later implemented:

- use deterministic/local recognition when sufficient;
- use server-side provider boundaries;
- minimize child data;
- do not upload raw camera frames automatically;
- remain usable when AI is unavailable whenever practical.

## 24. Quality gates

A visible product task is not done because TypeScript compiles.

Relevant completion checks include:

- typecheck/lint/build;
- learning/evidence regression where affected;
- mobile route QA;
- accessibility checks;
- screenshot review;
- visual human approval for art changes;
- pedagogical/content review for assessed activity changes;
- licence/provenance review for new audio/art/model dependencies;
- physical-device QA where interaction depends on device behavior;
- documentation updates.

**Code merged without the related documentation update is not complete.**

## 25. Agent execution constraints

Before changing frontend, learning content, audio or visuals, an AI agent must read:

1. `NEXT_PRODUCT_QUALITY_PLAN.md`;
2. `CURRENT_STATE.md`;
3. `ARCHITECTURE.md`;
4. `LEARNING_ATTEMPTS_MASTERY.md` when activities/evidence are affected;
5. this UX specification.

Do not:

- rewrite the motion engine without a demonstrated need;
- rewrite mastery/evidence as part of a visual cleanup;
- increase activity count before current quality work is substantially complete;
- treat generated art as automatically approved;
- use non-commercial voice/model assets in a commercial path without explicit compatibility;
- put affiliate CTA inside child learning flow;
- claim Iqro expert approval from engineering tests;
- silently change product scope without updating canonical docs.

## 26. North Star

A Mainlagi activity is successful when a child can quickly understand what to do, interact comfortably on their device, receive clear joyful feedback, hear appropriate narration, and genuinely practice or demonstrate the intended skill.

**Quality first. Quantity later.**
