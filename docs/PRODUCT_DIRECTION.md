# Mainlagi Hub — Product Direction

Status: **planned direction, not an implementation claim**.

This document records the agreed product direction while preserving the current Mainlagi Hub motion engine and existing games.

For the canonical product/UX behavior, screen model, activity architecture, migration rules, and AI-agent execution constraints, also read `docs/MAINLAGI_LEARNING_PLATFORM_UX_SPEC.md`.

For the mandatory mobile-first input policy, also read `docs/MOBILE_FIRST_INTERACTION_STRATEGY.md`.

## 1. Non-negotiable continuity

Mainlagi does **not** discard the current motion/vision engine.

Mainlagi does **not** remove the current 10 games simply because the product expands into a broader learning platform.

The existing engine and games become reusable activity/runtime capabilities inside the future learning system.

However, preserving motion does **not** mean forcing motion into every learning activity. The broader child learning experience is **mobile-first and touch-first**. Motion capture is an optional first-class capability used where it genuinely improves learning or play.

## 2. Target users

Primary market: Indonesian families.

- Buyer/decision maker: parent or guardian.
- Primary user: child approximately 3–7 years old.
- Primary child device assumption: phone or tablet.
- Secondary users: parent/guardian and, where appropriate later, educator.

The child-facing experience and parent-facing experience should not be treated as the same UX surface.

The platform must remain fully useful for a child who only has a phone and does not use motion capture.

## 3. Learning areas

Planned top-level learning areas:

1. Bahasa Indonesia
2. English
3. Matematika
4. Iqro
5. Mewarnai

The motion games can appear inside these learning paths where pedagogically appropriate, while remaining available as recognizable Mainlagi experiences.

Motion should be an optional activity/input mode, not a curriculum requirement by default.

## 4. Learning structure

Preferred conceptual hierarchy:

```text
Subject
└── Learning Path
    └── Stage
        └── Lesson
            └── Activity
```

An activity can be a tap/choice activity, matching activity, tracing exercise, listening activity, coloring activity, motion game, OCR-supported worksheet, or another interaction type.

This avoids turning the product into a flat collection of disconnected games and avoids making the entire curriculum dependent on camera motion.

## 5. Age-aware design

The 3–7 range must not be treated as one identical reading/interaction level.

Design should progressively support:

- younger children: audio-first, large touch targets, minimal text, simple tap/drag/trace interactions, short sessions;
- middle range: guided tracing, phonics, counting, simple sequencing and matching;
- older range: early reading, arithmetic, pattern reasoning, bilingual challenge and more independent navigation;
- optional motion activities when device/context makes them practical.

Exact curriculum rules still require dedicated curriculum design and validation.

## 6. Character system

Five planned main characters:

- **Naya** — older sister figure, age 8, wears hijab.
- **Gian** — boy, age 5.
- **Zia** — girl, age 3.
- **Paca** — male-coded robot character.
- **Gavi** — orange cat.

These characters should become a reusable narrative/feedback system, not decoration only.

Potential roles:

- narrator/guide;
- encouragement and error-recovery reactions;
- stage introductions;
- celebration and reward moments;
- contextual hints;
- story continuity;
- bilingual voice identity;
- animation states and expressions.

Character art, character names as brand elements, voice identity, and related commercial assets are governed separately from the source-code license. See `TRADEMARKS.md`.

## 7. Audio and language

Planned language support:

- Bahasa Indonesia
- English

Planned experience:

- child-friendly narration;
- native-sounding Indonesian and English voice;
- sound effects and feedback audio;
- animation synchronized with important feedback;
- pre-generated reviewed audio where fixed lesson content allows it;
- dynamic TTS only where a real product need justifies runtime generation.

Voice model/provider choice is not frozen by this document.

## 8. Progression and rewards

Planned systems include:

- stage progression;
- stars/rewards;
- activity completion;
- skill/mastery signals;
- achievements;
- certificate/export milestones.

Scores from the current games should not automatically be reinterpreted as educational mastery. The future data model needs explicit learning objectives and evidence rules.

The input mode used—touch, trace, motion, OCR capture, etc.—may be recorded as learning-event context, but motion should not automatically receive higher mastery value.

## 9. Parent experience

Planned parent-facing capabilities:

- child profile management;
- learning progress summary;
- recent activity;
- strengths/areas to revisit;
- stage/subject progress;
- downloadable certificate or milestone output;
- privacy and AI/data controls;
- motion/camera preference where needed;
- future subscription/commercial entitlement management.

Parent reports should use explainable learning events, not opaque AI-generated judgments.

## 10. OCR + AI direction

A future OCR/visual-understanding engine is planned for learning activities that need to read writing, worksheets or visual responses.

OpenRouter is the planned provider gateway for optional AI assistance, with the operator supplying the API key separately.

The AI layer must remain modular and must not become a prerequisite for the existing motion engine or the core touch-first learning experience.

See `docs/AI_OCR_OPENROUTER.md`.

## 11. Mobile-first interaction policy

Mainlagi's core child UX is **mobile-first and touch-first**.

Default activity selection should prefer the simplest interaction that teaches the intended skill:

```text
tap / choice
→ drag / matching
→ touch tracing / drawing / coloring
→ audio interaction
→ deliberate camera capture such as OCR
→ motion capture when it adds clear value
```

The existing motion engine remains available and all motion games remain part of Mainlagi, but camera motion is not a gate to core learning.

Where pedagogically valid, one learning objective may offer more than one interaction mode. Example: trace a number with a finger by default, with optional `Main pakai gerakan` for air-writing.

See `docs/MOBILE_FIRST_INTERACTION_STRATEGY.md` for the full constraint.

## 12. Experience principles

Child-facing Mainlagi should be:

- playful;
- joyful;
- gameful;
- mobile-first;
- touch-first;
- visually clear;
- forgiving of imperfect input;
- usable without motion capture for core learning;
- rich in meaningful sound/animation feedback;
- low-friction for a child and parent starting a session;
- explicit about camera and privacy behavior;
- willing to offer motion as an optional enhanced mode where it works well.

References such as Khan Academy Kids and Lingokids can inform product study, but Mainlagi should preserve its own characters, curriculum, visual identity, Indonesian context, and motion-learning capability.

## 13. Implementation principle

Large product expansion should proceed by adding clean platform layers around the mature motion engine while making the broader interaction system input-agnostic:

```text
Learning platform
  -> mobile-first child shell
  -> curriculum/stage system
  -> activity contract
  -> touch/audio/drawing runtimes + existing motion runtime + future OCR runtime
  -> learning-event/mastery data
  -> parent reporting
```

Avoid a rewrite unless a specific subsystem is proven to block the target architecture.

Do not force motion capture into new activities solely because the engine already exists.
