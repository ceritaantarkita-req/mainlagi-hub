# Mainlagi Hub — Product Direction

Last reviewed: **14 September 2026**

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

The Garden/Playroom redesign is the frontend baseline.

Next goals:

- coherent Mainlagi illustration language;
- simple readable silhouettes;
- consistent stroke/shape language;
- controlled complexity by age;
- large interaction/fill areas;
- strong mobile readability;
- less procedural/generated visual slop;
- human visual approval for important child-facing art.

Coloring and Drawing need dedicated asset/scaffolding cleanup. A Mainlagi Art Bible and visual quality gate should become permanent controls.

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

Before major new features or catalog expansion, finish `NEXT_PRODUCT_QUALITY_PLAN.md` workstreams:

1. canonical docs;
2. stage/gallery UX coherence;
3. 900-activity quality audit/redesign;
4. meaningful mechanic diversification;
5. Coloring rebuild;
6. Drawing rebuild;
7. art direction/visual QA;
8. native Indonesian/English narration;
9. About/FAQ/parent affiliate UX;
10. external device/accessibility/Iqro acceptance;
11. governance hardening;
12. technical cleanup.

**Quality first. Quantity later.**
