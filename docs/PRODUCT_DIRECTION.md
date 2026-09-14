# Mainlagi Hub — Product Direction

Last reviewed: **14 September 2026**

Status: **current product direction**. Some items are implemented, some remain next-phase work. Implementation claims must be checked against `CURRENT_STATE.md` and code.

Canonical next execution plan: `NEXT_PRODUCT_QUALITY_PLAN.md`.

Canonical child UX specification: `MAINLAGI_LEARNING_PLATFORM_UX_SPEC.md`.

## 1. Product identity

Mainlagi is a learning and edutainment platform for children approximately **3–7 years old**, built primarily for Indonesian families.

- buyer/decision maker: parent/guardian;
- primary user: child;
- primary child devices: phone/tablet;
- parent and child use separate UX surfaces;
- current motion/vision technology remains a differentiator, not a requirement for all learning.

Mainlagi should feel like **one coherent learning world**, not a collection of disconnected mini-apps.

## 2. Current learning areas

The current top-level learning areas are:

1. Bahasa Indonesia
2. English
3. Matematika
4. Iqro
5. Huruf & Menulis
6. Logika
7. Sains
8. Mewarnai
9. Menggambar

The current baseline contains 100 activity routes per subject, for 900 total.

Quantity is no longer the immediate goal. The next phase improves the quality, validity, variety and visual execution of these 900 activities before major catalog expansion.

## 3. Retained motion capability

Mainlagi does not discard the existing motion/vision engine or the existing 10 games.

Motion remains an optional first-class activity/input mode where it genuinely improves learning or play.

Core child learning remains mobile-first and touch-first. A child should be able to use the core platform without camera motion.

## 4. Learning structure

Canonical data hierarchy:

```text
Subject
└── Learning Path / Stage
    └── Lesson
        └── Activity
            └── Attempt
                └── Evidence / Mastery
```

Current presentation also includes broad subject activity browsing. The final relationship between visible stages, recommendations and the 100-card gallery remains a product decision for the current quality phase.

Do not weaken progression/mastery rules merely to simplify presentation.

## 5. Age-aware experience

The 3–7 range must not be treated as one identical reading/interaction level.

### Approximately 3–4

Prefer:

- audio-first guidance;
- minimal required reading;
- large touch targets;
- simple visual discrimination;
- short tap/drag/trace tasks;
- strong character feedback;
- forgiving input.

### Approximately 5–6

Add:

- phonics;
- letters/early writing;
- number concepts;
- guided tracing;
- matching/sorting/sequencing;
- simple bilingual exposure.

### Approximately 6–7

Add:

- early reading;
- arithmetic;
- patterns/reasoning;
- more independent navigation;
- multi-step tasks;
- richer bilingual challenges.

Age targeting must affect representation and difficulty, not only metadata.

## 6. Activity-quality principle

**Learning objective determines representation and mechanic.**

Examples:

- visual color recognition should show meaningful visual colors/objects;
- reading the word `BLUE` is a different skill from recognizing the color blue;
- phonics should use audio/sound mapping rather than visually obvious text shortcuts;
- letter recognition should use meaningful visual discrimination, not endless trivial multiple choice;
- sequencing should use ordering interaction when appropriate;
- matching must pair semantically meaningful items;
- creative activities should remain creative practice unless a validated evidence model exists.

An activity is not considered good merely because its route works or its answer is technically correct.

## 7. Gameplay variety

The current catalog is heavily concentrated in tap-choice/matching families. Variety should improve through reusable mechanics only when pedagogically justified.

Candidate interactions include:

- visual tap/select;
- audio choose;
- matching;
- drag/drop;
- sorting;
- ordering/sequence;
- find-in-scene/hotspot;
- memory;
- puzzle;
- tracing;
- drawing;
- coloring;
- counting/selecting objects;
- story interaction;
- optional motion.

Do not add mechanics solely for novelty.

## 8. Character system

Five canonical Mainlagi characters:

- **Naya** — older sister figure, approximately 8, wears hijab;
- **Gian** — boy, approximately 5;
- **Zia** — girl, approximately 3;
- **Paca** — friendly male-coded robot;
- **Gavi** — orange cat.

Characters are a reusable narrative/feedback system, not decoration only.

Possible roles:

- narration;
- activity introductions;
- hints/retry guidance;
- celebration/rewards;
- stage transitions;
- story continuity;
- bilingual voice identity.

Character artwork, voice identity and branded assets remain subject to separate IP/licensing rules.

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
- provider abstraction so the frontend is not locked to one TTS project;
- engine/model/voice licence and provenance review before commercial use.

Iqro/Hijaiyah pronunciation requires competent human review and must not be approved solely by generic TTS output.

## 10. Visual direction

The current Garden/Playroom redesign is the frontend baseline.

Next-phase visual goals:

- one coherent Mainlagi illustration language;
- simple readable silhouettes;
- consistent stroke/shape language;
- controlled complexity by age;
- large interaction/fill areas;
- strong mobile readability;
- less procedural/generated visual slop;
- human visual approval for important child-facing art.

Coloring and Drawing need dedicated asset/scaffolding cleanup before catalog expansion.

A Mainlagi Art Bible and visual quality gate should become permanent production controls.

## 11. Child navigation

Child surfaces should prioritize:

1. Continue Learning / recommended next activity;
2. current subject/stage context;
3. a small number of meaningful choices;
4. clear route to subject browsing;
5. clear route to Main Gerak where appropriate.

Do not expose admin, billing, affiliate shopping, provider configuration or other adult/system concepts inside child learning flow.

## 12. Parent/public experience

Parent/public surfaces should make it easy to find:

- About Mainlagi;
- FAQ/help;
- account/child profile management;
- progress/reporting;
- privacy/data information;
- appropriate recommendations for parents;
- affiliate disclosure where affiliate links are used.

Affiliate shopping belongs to adult/public surfaces, never as a child-learning CTA.

## 13. Progression and reporting

Current systems include:

- stage progression;
- completion;
- stars/rewards;
- evidence-backed mastery;
- adaptive recommendation;
- parent reporting;
- achievements/certificates where evidence supports them.

Completion, score, reward and mastery remain separate concepts.

Parent reports must remain explainable and must not present opaque AI judgments as developmental truth.

## 14. OCR + AI direction

OCR/visual-understanding and optional AI support remain future modular capabilities, not current blockers.

They must not replace deterministic/local runtimes where simpler methods are sufficient.

Requirements include:

- provider secrets server-side only;
- no automatic raw-camera upload;
- payload minimization/privacy gates;
- configurable providers/models;
- graceful failure when AI is unavailable.

See `AI_OCR_OPENROUTER.md`.

## 15. Current execution priority

Before major new features or catalog expansion, finish the workstreams in `NEXT_PRODUCT_QUALITY_PLAN.md`:

1. canonical docs;
2. stage/gallery UX coherence;
3. 900-activity quality audit/redesign;
4. meaningful mechanic diversification;
5. Coloring rebuild;
6. Drawing rebuild;
7. art direction/visual QA;
8. native Indonesian/English narration system;
9. About/FAQ/parent affiliate UX;
10. external device/accessibility/Iqro acceptance;
11. governance hardening;
12. technical cleanup.

**Quality first. Quantity later.**
