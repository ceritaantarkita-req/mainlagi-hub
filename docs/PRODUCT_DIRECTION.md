# Mainlagi Hub — Product Direction

Status: **planned direction, not an implementation claim**.

This document records the agreed product direction while preserving the current Mainlagi Hub motion engine and existing games.

For the canonical product/UX behavior, screen model, activity architecture, migration rules, and AI-agent execution constraints, also read `docs/MAINLAGI_LEARNING_PLATFORM_UX_SPEC.md`.

## 1. Non-negotiable continuity

Mainlagi does **not** discard the current motion/vision engine.

Mainlagi does **not** remove the current 10 games simply because the product expands into a broader learning platform.

The existing engine and games become reusable activity/runtime capabilities inside the future learning system.

## 2. Target users

Primary market: Indonesian families.

- Buyer/decision maker: parent or guardian.
- Primary user: child approximately 3–7 years old.
- Secondary users: parent/guardian and, where appropriate later, educator.

The child-facing experience and parent-facing experience should not be treated as the same UX surface.

## 3. Learning areas

Planned top-level learning areas:

1. Bahasa Indonesia
2. English
3. Matematika
4. Iqro
5. Mewarnai

The motion games can appear inside these learning paths where pedagogically appropriate, while remaining available as recognizable Mainlagi experiences.

## 4. Learning structure

Preferred conceptual hierarchy:

```text
Subject
└── Learning Path
    └── Stage
        └── Lesson
            └── Activity
```

An activity can be a motion game, tracing exercise, listening activity, coloring activity, choice activity, OCR-supported worksheet, or another interaction type.

This avoids turning the product into a flat collection of disconnected games.

## 5. Age-aware design

The 3–7 range must not be treated as one identical reading/interaction level.

Design should progressively support:

- younger children: audio-first, large targets, minimal text, simple gestures, short sessions;
- middle range: guided tracing, phonics, counting, simple sequencing and matching;
- older range: early reading, arithmetic, pattern reasoning, bilingual challenge and more independent navigation.

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

## 9. Parent experience

Planned parent-facing capabilities:

- child profile management;
- learning progress summary;
- recent activity;
- strengths/areas to revisit;
- stage/subject progress;
- downloadable certificate or milestone output;
- privacy and AI/data controls;
- future subscription/commercial entitlement management.

Parent reports should use explainable learning events, not opaque AI-generated judgments.

## 10. OCR + AI direction

A future OCR/visual-understanding engine is planned for learning activities that need to read writing, worksheets or visual responses.

OpenRouter is the planned provider gateway for optional AI assistance, with the operator supplying the API key separately.

The AI layer must remain modular and must not become a prerequisite for the existing motion engine.

See `docs/AI_OCR_OPENROUTER.md`.

## 11. Experience principles

Child-facing Mainlagi should be:

- playful;
- joyful;
- gameful;
- visually clear;
- forgiving of imperfect motion input;
- rich in meaningful sound/animation feedback;
- low-friction for a child and parent starting a session;
- explicit about camera and privacy behavior.

References such as Khan Academy Kids and Lingokids can inform product study, but Mainlagi should preserve its own motion-learning identity and Indonesian context.

## 12. Implementation principle

Large product expansion should proceed by adding clean platform layers around the mature motion engine:

```text
Learning platform
  -> curriculum/stage system
  -> activity contract
  -> existing motion engine + new activity engines
  -> learning-event/mastery data
  -> parent reporting
```

Avoid a rewrite unless a specific subsystem is proven to block the target architecture.
