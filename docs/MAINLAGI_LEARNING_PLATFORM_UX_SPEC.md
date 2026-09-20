# Mainlagi Learning Platform — Product, UX, and Activity Specification

Last reviewed: **20 September 2026**

Status: **canonical current UX/product specification**.

Implementation truth remains code + `CURRENT_STATE.md`; execution priority/status is defined by `NEXT_PRODUCT_QUALITY_PLAN.md`.

## 1. Product intent

Mainlagi is a child-first learning and edutainment platform for children approximately **3–7 years old**, primarily for Indonesian families.

The product should feel like **one coherent learning world**, not a collection of unrelated mini-apps.

The motion/vision engine and 10 existing Mainlagi games remain first-class capabilities, but core learning is **mobile-first and touch-first** and must not require camera motion.

## 2. Primary users

- **Child:** primary learning user, approximately 3–7 years old.
- **Parent/guardian:** account owner, buyer/decision maker, privacy controller, and reader of progress/reporting.

Child and parent are separate UX surfaces. Do not put affiliate shopping, billing, admin, provider configuration, or other adult/system controls inside child learning screens.

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

The priority is improving these 900 activities, not increasing their count.

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

The child does not need to understand the internal hierarchy. Data/progression truth and visible navigation are separate concerns.

## 5. Current frontend baseline

The Garden/Playroom redesign remains the visual anchor. The current implementation also includes the 20 September WS-13 child-home/gallery/completion/matching/audio-latency/parent-responsive waves.

Preserve and improve:

- active-child/continuation flow;
- Garden/Playroom visual language;
- large mobile-friendly controls;
- Nunito typography;
- Phosphor icons;
- subject/stage/activity surfaces;
- activity previews;
- Coloring/Drawing shells;
- audio/session improvements.

Do not revert to pre-PR #87 UI without a measured reason.

## 6. Child Home

Child Home prioritizes:

1. **Lanjut Belajar / Continue Learning**;
2. recommended next activity;
3. current subject/stage context;
4. useful character/feedback moment;
5. a small number of subject shortcuts;
6. direct route to Main Gerak where appropriate.

Do not turn Child Home into a dense dashboard.

## 7. Subject browsing and progression

Canonical model: **Recommended Path + Stage Journey + Browse All**.

### Default subject page

The subject page must show, in this order:

1. one prominent recommended next activity when available;
2. a compact stage journey showing current/open/locked progression;
3. a default grid containing only activities that are currently playable and age-eligible;
4. a secondary **Lihat semua** control for the complete 100-activity subject catalog.

### Stage journey

- Open stages link to the existing Stage/Lesson view.
- Locked stages remain understandable but are not presented as playable links.
- Stage navigation provides structured context; it is **not a mandatory extra click** before every activity.
- Stage/Lesson screens remain the richer structured curriculum view.

### Browse all

- The complete 100-activity catalog must remain available for exploration/audit.
- Locked or age-ineligible activities belong in secondary browse-all rather than dominating the default screen.
- Locked states must explain whether progression or age is the reason.

### Fast path

Direct **Home -> Subject -> Activity** remains valid through recommendation/playable cards.

### Non-negotiable boundary

Presentation changes do not weaken stage readiness, evidence, mastery, age eligibility, or direct-route progression guards.

This model was selected in WS-09 and implemented in PR #89 candidate work.

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
- immediate positive feedback;
- forgiving input.

### Approximately 5–6

Add:
- phonics;
- letter recognition;
- numbers/counting;
- guided writing/tracing;
- sorting/sequencing;
- basic bilingual exposure.

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
- character feedback only when useful.

If a child must interpret system terminology or scan many unrelated controls, the screen is too dense.

## 10. Activity-quality contract

**Learning objective determines representation and mechanic.**

### Color recognition

Use colored objects, color swatches, scene search, or sorting. Reading `BLUE / RED / GREEN` measures written color vocabulary, not pure visual color recognition.

### Letter recognition

Possible representations include plausible letter discrimination, upper/lowercase matching, find-letter-in-scene, phoneme-to-letter, beginning-sound mapping, and tracing.

Do not create dozens of activities that are only the same three-button template with different labels.

### Phonics/listening

Audio must carry meaningful evidence. Do not make the answer obvious from redundant visible text.

### Logic/order

Use ordering/sorting/sequence interactions when they better represent the skill than generic multiple choice.

## 11. Activity review classification

Every activity must eventually be classified:

- `KEEP`
- `POLISH`
- `REDESIGN`
- `REPLACE`

Review at minimum: age fit, objective, skill mapping, prompt, representation, distractors, mechanic, ambiguity, difficulty, uniqueness, visual quality, and assessed/practice/evidence compatibility.

Route validity alone is not a quality pass.

## 12. Gameplay mechanics

Current production families include tap choice, listen-and-choose, matching, trace, story, motion game, coloring and drawing.

Additional/reused patterns may include drag/drop, sorting, ordering/sequence, find-in-scene/hotspot, memory, puzzle/assembly, count/select objects, classification, and optional motion.

Only add a mechanic if it better serves the learning goal or play value. Every mechanic needs mobile/accessibility QA.

## 13. Drawing

Drawing is creative practice with useful scaffolding, not merely a text prompt plus empty canvas.

Complex activities may use progressive guide layers:

1. basic shape;
2. major structure;
3. detail;
4. optional decoration.

Guide must not obstruct the canvas; free drawing remains allowed; creative completion must not automatically become academic mastery evidence.

## 14. Coloring

Coloring should use authored/curated child-friendly vector art rather than uncontrolled procedural complexity.

Production art rules:

- clear silhouette;
- consistent stroke;
- closed/fillable shapes;
- no accidental overlap;
- adequate fill/touch area;
- age-appropriate complexity;
- correct layer order;
- readable on phone;
- no disguised heavy duplicate composition.

Generated/procedural output can be a draft, but human visual approval is required for production-quality content.

## 15. Visual/art direction

Mainlagi needs an original, consistent visual identity with friendly 2D illustration, rounded readable forms, consistent line language, controlled palette, strong hierarchy, low decorative noise, large touch targets, predictable interaction states, and age-appropriate visual complexity.

A permanent **Mainlagi Art Bible** must define characters, stroke, palette, backgrounds, objects/icons, shadows, spacing, touch/fill sizing, complexity-by-age and animation principles.

Automated SVG/DOM checks do not replace human visual judgment.

## 16. Characters

Canonical characters:

- **Naya** — older sister figure, approximately 8, wears hijab; warm/encouraging.
- **Gian** — boy, approximately 5; energetic/curious/playful.
- **Zia** — girl, approximately 3; expressive/beginner-friendly.
- **Paca** — friendly male-coded robot; hints/system/discovery.
- **Gavi** — orange cat; humor/rewards/reactions.

Characters are a narrative/feedback system, not decorative stickers only.

## 17. Voice and narration

Target languages: Bahasa Indonesia and English.

```text
narration request
  -> provider-independent narration contract
      -> character/voice registry
          -> approved pre-generated audio for fixed content
          -> runtime TTS only when dynamic content requires it
```

Requirements: native-feeling pronunciation, child-friendly pace, stable character identity, licence/provenance review, human approval for fixed narration, and graceful fallback.

Iqro/Hijaiyah pronunciation requires competent human review and must not be approved solely through generic TTS.

## 18. Rewards, progression and mastery

Keep separate:

- completion;
- stars/rewards;
- evidence;
- mastery;
- achievement;
- certificate.

Young children get forgiving retry/hint behavior. Practice-only creative content must not imply measured competency without valid assessed evidence.

## 19. Parent/public UX

Parent/public surfaces should provide clear access to About, FAQ/help, child/account management, progress/reporting, privacy/data information, suitable parent recommendations, and affiliate disclosure.

Current About/FAQ copy needs updating. Affiliate shopping CTA must never appear inside child learning flow.

Current parent responsive contract:

- below 760px: sticky parent header + fixed five-destination bottom navigation;
- at/above 760px: parent sidebar;
- parent/product destinations remain separated from child navigation;
- real family profiles and demo data are visually separated;
- child profile identity is not represented by the selected guide character;
- primary parent summaries use existing completion/stars/activity data and do not invent mastery.

Current character-production boundary:

- Paca/Gavi production Garden assets exist;
- Naya/Gian/Zia still require reviewed production artwork;
- canonical character roles come from the documented character system;
- generated art is not automatically approved;
- coloring-character content remains a separate content decision.

## 20. Main Gerak

The existing motion/game catalog remains a distinctive Mainlagi area. A game may be directly playable, adapted into a learning stage, or surfaced by recommendation when appropriate.

Direct game access does not bypass academic evidence rules.

## 21. Accessibility/mobile rules

Every child-facing activity must consider mobile portrait layout, touch targets, text overflow, contrast, keyboard interaction where applicable, reduced motion, meaningful screen-reader semantics, audio controls, safe areas/orientation, and horizontal overflow.

Automated Chromium QA must be complemented by representative physical iPhone/Safari and Android/Chrome testing.

## 22. Privacy rules

Required principles:

- data minimization;
- explicit permission boundaries;
- no camera-frame retention by default;
- no client-side provider secrets;
- RLS/server authorization;
- auditable dependencies/providers/assets.

## 23. OCR/AI

General OCR/AI support is future modular work, not a current product-quality blocker.

Do not couple core child UX to an external AI provider. Prefer deterministic/local recognition when sufficient and keep AI optional, server-bounded, minimized and failure-tolerant.

## 24. Quality gates

A visible product task is not done because TypeScript compiles.

Relevant gates include typecheck/lint/build, learning/evidence regressions, mobile route QA, accessibility, screenshot review, human visual approval, pedagogical review for assessed changes, licence/provenance review, physical-device QA where needed, and documentation updates.

**Code merged without the related documentation update is not complete.**

## 25. Agent execution constraints

Before changing frontend, learning content, audio or visuals, read:

1. `NEXT_PRODUCT_QUALITY_PLAN.md`;
2. `CURRENT_STATE.md`;
3. `ARCHITECTURE.md`;
4. `LEARNING_ATTEMPTS_MASTERY.md` when evidence is affected;
5. this UX specification.

Do not rewrite motion/mastery casually, expand activity count before quality closure, auto-approve generated art, use licence-incompatible voice/model assets, put affiliate CTA in child flow, claim Iqro approval from engineering tests, or silently change product scope.

## 26. North Star

A Mainlagi activity is successful when a child quickly understands what to do, interacts comfortably, receives joyful clear feedback, hears appropriate narration, and genuinely practices or demonstrates the intended skill.

**Quality first. Quantity later.**
