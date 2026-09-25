# Mainlagi Hub — Product Direction

Last reviewed: **21 September 2026**

Status: **current product direction**. Some items are implemented, some remain next-phase work. Implementation claims must be checked against `CURRENT_STATE.md` and code.

Canonical execution plan: `NEXT_PRODUCT_QUALITY_PLAN.md`.  
Canonical child UX specification: `MAINLAGI_LEARNING_PLATFORM_UX_SPEC.md`.

## 1. Product identity

Mainlagi is a learning and edutainment platform for children approximately **3–7 years old**, built primarily for Indonesian families.

- buyer/decision maker: parent/guardian;
- primary user: child;
- primary child devices: phone/tablet;
- parent and child use separate UX surfaces;
- motion/vision remains a differentiator, not a requirement for all learning.

Mainlagi should feel like **one coherent learning world**, not disconnected mini-apps.

## 2. Current learning areas

Current top-level areas:

1. Bahasa Indonesia
2. English
3. Matematika
4. Iqro
5. Huruf & Menulis
6. Logika
7. Sains
8. Mewarnai
9. Menggambar

Current baseline contains 100 activity routes per subject, 900 total.

Quantity is no longer the immediate goal. Improve quality, validity, variety and visual execution before major catalog expansion.

## 3. Retained motion capability

Mainlagi does not discard the current motion/vision engine or the existing 10 games.

Motion remains an optional first-class activity/input mode where it genuinely improves learning or play. Core child learning remains mobile-first and touch-first.

## 4. Learning structure and visible journey

Canonical data hierarchy:

```text
Subject
└── Learning Path / Stage
    └── Lesson
        └── Activity
            └── Attempt
                └── Evidence / Mastery
```

Canonical subject UX is **Recommended Path + Stage Journey + Browse All**:

- recommendation is prominent;
- open stages are visible as a structured journey;
- stage pages provide richer lesson-level structure;
- the default subject grid shows currently playable + age-eligible activities;
- all 100 activities remain available through secondary browse-all;
- stage navigation is helpful context, not a mandatory extra click before every activity;
- presentation never weakens readiness/evidence/mastery rules.

## 5. Age-aware experience

The 3–7 range must not be treated as one identical reading/interaction level.

### Approximately 3–4

Prefer audio-first guidance, minimal reading, large touch targets, simple visual discrimination, short tap/drag/trace tasks, strong feedback and forgiving input.

### Approximately 5–6

Add phonics, letters/early writing, number concepts, guided tracing, matching/sorting/sequencing and simple bilingual exposure.

### Approximately 6–7

Add early reading, arithmetic, patterns/reasoning, more independent navigation, multi-step tasks and richer bilingual challenges.

Age targeting must affect representation and difficulty, not only metadata.

## 6. Activity-quality principle

**Learning objective determines representation and mechanic.**

Examples:

- visual color recognition uses meaningful visual colors/objects;
- reading `BLUE` is different from recognizing the color blue;
- phonics uses audio/sound mapping rather than visually obvious text shortcuts;
- letter recognition uses meaningful discrimination, not endless trivial multiple choice;
- sequencing uses ordering interaction when appropriate;
- matching pairs semantically meaningful items;
- creative activities remain practice unless a validated evidence model exists.

An activity is not good merely because its route works or its answer is technically correct.

## 7. Gameplay variety

The current catalog is heavily concentrated in tap-choice/matching. Variety should improve through reusable mechanics only when pedagogically justified.

Candidate interactions include visual tap/select, audio choose, matching, drag/drop, sorting, ordering/sequence, find-in-scene/hotspot, memory, puzzle, tracing, drawing, coloring, counting/selecting objects, story interaction and optional motion.

Do not add mechanics solely for novelty.

## 8. Character system

Five canonical Mainlagi characters:

- **Naya** — older sister figure, approximately 8, wears hijab;
- **Gian** — boy, approximately 5;
- **Zia** — girl, approximately 3;
- **Paca** — friendly male-coded robot;
- **Gavi** — orange cat.

Current production-asset truth:

- Paca and Gavi have production Garden WebP assets in `public/artwork`;
- Naya, Gian and Zia do not yet have production image files under `public/artwork`;
- current Naya/Gian/Zia avatars are fallback representations, not final production art;
- child profile identity is separate from guide-character identity;
- generated character candidates require review and provenance before production use.

Characters are a reusable narrative/feedback system, not decoration only. Roles can include narration, introductions, hints, retry guidance, celebrations, stage transitions, story continuity and bilingual voice identity.

## 9. Voice and language

Primary language experience:

- Bahasa Indonesia;
- English.

Target narration principles:

- native-feeling pronunciation;
- child-friendly pacing;
- stable character identity;
- pre-generated, human-reviewed audio for fixed lesson content;
- runtime TTS only where dynamic content truly needs it;
- provider abstraction;
- engine/model/voice licence and provenance review before commercial use.

Iqro/Hijaiyah pronunciation requires competent human review and must not be approved solely by generic TTS output.

## 10. Visual direction

The Garden/Playroom redesign remains the frontend baseline.

The subject-background system is now production truth:

- 9 subjects;
- 54 scene families;
- 108 responsive WebP assets;
- deterministic activity-to-scene mapping;
- one project-owner production preview route for each subject;
- automated responsive/mobile QA plus exact Cloudflare production verification.

Next visual goals:

- production-grade Naya/Gian/Zia character assets and dynamic foreground character use;
- coherent Mainlagi illustration language for learning objects/icons;
- simple readable silhouettes;
- consistent stroke/shape language;
- controlled complexity by age;
- large interaction/fill areas;
- strong mobile readability;
- less procedural/generated visual slop;
- continued human visual approval for important child-facing art.

The Mainlagi Art Bible and visual quality gate remain permanent controls.

## 11. Child navigation

Child surfaces prioritize:

1. Continue Learning / recommended next activity;
2. current subject/stage context;
3. a small number of meaningful choices;
4. subject browsing;
5. Main Gerak where appropriate.

Do not expose admin, billing, affiliate shopping, provider configuration or adult/system concepts inside child learning flow.

## 12. Parent/public experience

Parent/public surfaces should make it easy to find About, FAQ/help, account/child profile management, progress/reporting, privacy/data information, appropriate recommendations, and affiliate disclosure.

Affiliate shopping belongs to adult/public surfaces, never as a child-learning CTA.

## 13. Progression and reporting

Current systems include stage progression, completion, stars/rewards, evidence-backed mastery, adaptive recommendation, parent reporting and achievements/certificates where evidence supports them.

Completion, score, reward and mastery remain separate. Parent reports remain explainable and must not present opaque AI judgments as developmental truth.

## 14. OCR + AI direction

OCR/visual-understanding and optional AI support remain future modular capabilities, not current blockers.

They must not replace deterministic/local runtimes where simpler methods suffice. Keep provider secrets server-side, minimize child data, avoid automatic raw-camera uploads, support configurable providers/models and fail gracefully.

See `AI_OCR_OPENROUTER.md`.

## 15. Current execution priority

**25 September project-owner override:** Mainlagi World is now treated as a first-class domain of one Mainlagi product system, and character development is resumed for this integration. The 22 September “World separate / character paused” boundary is historical for that earlier workstream.

Current character decisions are locked:

1. use isolated single-character SVG assets directly;
2. canonical states are `hero`, `welcome`, `pointing`, `thinking`, `correct`, `try_again`, `celebrate`;
3. `gavi-panel-hero.svg` is Gavi hero/default;
4. design-set SVGs / `.ai` remain reference/master assets;
5. existing Gavi/Paca Garden WebP remains temporary fallback;
6. provenance + SVG sanitization/validator + runtime activation stay separate fail-closed gates.

Current execution order for the World + character program:

1. synchronize canonical docs and boundaries;
2. exact Drive single-SVG inventory + provenance mapping;
3. migrate character provenance/validator to the seven-state SVG model;
4. promote reviewed SVGs to normalized production paths;
5. implement shared character resolver/layer without touching learning semantics;
6. expose unified Home with Belajar / World / Bermain;
7. integrate Petualangan Uang Gavi+Paca through the shared runtime;
8. add parent World journey context without collapsing World progress into Belajar mastery;
9. close with responsive/browser/CI/deploy verification.

Belajar WS-05 Logic `pattern_completion` remains closed/live verified. Pattern #48 remains unjustified; character/World work must not reopen curriculum/mastery/progression unless separately authorized.

The subject background system remains closed/live verified and should not be reopened without a concrete defect.

**Quality first. Quantity later.**
