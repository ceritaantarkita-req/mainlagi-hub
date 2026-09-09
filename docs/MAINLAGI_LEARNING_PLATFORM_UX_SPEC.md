# Mainlagi Learning Platform — Product, UX, and Activity System Specification

Status: **canonical planned product/UX specification**.

This document explains how the future Mainlagi learning platform should behave and how it should be structured so that human contributors and AI agents can implement it consistently.

It is **not** a claim that every system described below already exists.

This specification extends, and must be read together with:

- `README.md`
- `docs/PRODUCT_DIRECTION.md`
- `docs/ARCHITECTURE.md`
- `docs/AI_OCR_OPENROUTER.md`
- `TRADEMARKS.md`

---

## 1. Product intent

Mainlagi is evolving from a motion-learning game hub into a broader learning platform for children, while preserving the existing motion/vision technology and all existing games.

The target experience is a child-friendly learning environment where a child can:

1. enter through a simple profile;
2. receive age-appropriate learning recommendations;
3. browse learning areas and activities visually;
4. complete short activities with minimal reading burden;
5. learn through touch, mouse, keyboard, drawing, audio, camera motion, tracing, coloring, and later OCR/AI-assisted interactions;
6. earn visible progress and rewards;
7. return easily to the next recommended activity;
8. allow a parent/guardian to understand progress from a separate parent-facing surface.

Mainlagi should feel like **one coherent learning world**, not a collection of disconnected mini-apps.

---

## 2. Reference interpretation

The supplied Khan Academy Kids screenshots are references for **product interaction patterns**, not assets or layouts to clone.

Useful patterns observed in the references include:

- extremely simple child onboarding;
- age selection;
- child/avatar selection;
- large visual category buttons;
- horizontal category navigation;
- large content thumbnails in a predictable grid;
- content grouped by learning domain;
- clear selected-state feedback;
- dedicated creation/coloring experiences;
- reading, letters, math, logic, and social-emotional activity libraries;
- low visual density;
- large back/next controls;
- minimal text during child activity;
- friendly recurring characters;
- a clean white/pastel visual shell around colorful activities.

### 2.1 What Mainlagi should borrow

Borrow the **clarity, hierarchy, low cognitive load, category browsing model, child-first navigation, and activity-library mental model**.

### 2.2 What Mainlagi must not copy

Do not copy:

- Khan Academy Kids branding;
- logo;
- mascot designs;
- illustrations;
- exact UI composition;
- exact category iconography;
- exact wording;
- exact screen layouts;
- proprietary content.

Mainlagi must use its own brand, characters, illustrations, curriculum, motion-learning identity, Indonesian context, and visual system.

---

## 3. Non-negotiable continuity

The following are hard product constraints.

### 3.1 Preserve the existing motion engine

Do **not** remove, replace, or rewrite the current MediaPipe-based hand/pose/hybrid runtime merely because the product becomes a broader learning platform.

The current vision engine becomes one reusable **Activity Runtime** inside Mainlagi.

### 3.2 Preserve all 10 existing games

All current games remain part of Mainlagi:

1. Math Pilih Jawaban
2. Math Motion Battle
3. Number Trace Adventure
4. Shape Quest
5. Pattern Race
6. Math Warung
7. Iqro Motion
8. AirBoard Presenter
9. Beat Motion
10. Run to Target

They may be reorganized, surfaced in learning paths, or additionally grouped in a dedicated game/motion area, but they must not disappear merely because a new navigation model is introduced.

### 3.3 Existing games are activities, not legacy baggage

The future system should treat existing games as reusable capabilities.

Example:

```text
Matematika
└── Stage: Mengenal Angka
    ├── Tap activity
    ├── Number Trace Adventure
    ├── Listening activity
    └── Math Pilih Jawaban
```

The same game runtime can therefore be used inside a learning stage while remaining directly playable from a game library.

---

## 4. Target users

### 4.1 Primary child user

Approximate age: **3–7 years**.

This range must not be treated as one identical UX level.

### 4.2 Parent/guardian

The parent is normally the account owner, decision maker, privacy controller, and subscription owner.

### 4.3 Future secondary users

Possible future users include teachers, schools, tutors, and caregivers, but they are not the primary child UX.

---

## 5. Age-aware UX model

Age is used to recommend complexity, not to permanently lock a child into one rigid curriculum.

### Ages approximately 3–4

Prefer:

- audio-first instructions;
- almost no required reading;
- one concept per screen;
- very large tap targets;
- simple matching and tracing;
- short sessions;
- strong character guidance;
- immediate positive feedback;
- forgiving input.

### Ages approximately 5–6

Add:

- phonics;
- letter recognition;
- number concepts;
- counting;
- guided tracing;
- simple sequencing;
- simple bilingual exposure;
- slightly longer activity chains.

### Ages approximately 6–7

Add:

- early reading;
- word construction;
- arithmetic;
- patterns and reasoning;
- more independent navigation;
- multi-step tasks;
- bilingual challenges;
- richer motion activities.

Exact curriculum mapping requires a dedicated curriculum specification and must not be invented casually by implementation agents.

---

## 6. Canonical information architecture

The learning hierarchy is:

```text
Household / Account
└── Child Profile
    └── Subject
        └── Learning Path
            └── Stage
                └── Lesson
                    └── Activity
                        └── Attempt
                            └── Learning Evidence
```

### Definitions

**Child Profile**  
A child-specific profile containing display name, age/birth-year band, progress, preferences, and optional avatar.

**Subject**  
One of the main learning areas.

**Learning Path**  
A coherent sequence inside a subject.

**Stage**  
A visible progress unit suitable for a child, normally containing several activities.

**Lesson**  
A smaller pedagogical unit inside a stage.

**Activity**  
The actual interactive experience.

**Attempt**  
One child session on one activity.

**Learning Evidence**  
Explainable outcome data used for progress reporting.

---

## 7. Main learning areas

The agreed top-level learning areas are:

1. **Bahasa Indonesia**
2. **English**
3. **Matematika**
4. **Iqro**
5. **Mewarnai**

These should be represented with original Mainlagi visual identities, not copied category icons.

### 7.1 Additional retained area: Main Gerak / Games

Because the existing motion games are a core differentiator, Mainlagi should also provide a visible way to browse the existing game catalogue directly.

Working concept:

- `Belajar` = curriculum/stage-driven experience;
- `Main Gerak` or `Games` = direct access to existing motion/game experiences;
- `Mewarnai` may appear both as a learning area and a creative library where appropriate.

The final naming can change, but the direct game access must remain.

---

## 8. Recommended child navigation model

The child-facing shell should remain extremely simple.

Preferred primary destinations:

```text
Home
Belajar
Main Gerak
Hadiah / Progress
```

A child should not see admin, billing, database, AI-provider, or technical configuration screens.

### 8.1 Home

The child Home screen should prioritize:

1. **Lanjut Belajar** / Continue Learning;
2. current stage;
3. recommended next activity;
4. one character guide/reaction;
5. a small number of subject shortcuts;
6. optional daily/recent activity;
7. a visible route to Main Gerak.

Do not turn Home into a dense dashboard.

### 8.2 Belajar / Library

The learning library uses large visual filters and activity cards.

Recommended pattern:

```text
[ Bahasa ] [ English ] [ Matematika ] [ Iqro ] [ Mewarnai ]

Stage / topic heading

[ Activity card ] [ Activity card ] [ Activity card ]
[ Activity card ] [ Activity card ] [ Activity card ]
```

On smaller screens, use horizontal scrolling or fewer columns rather than shrinking cards excessively.

### 8.3 Main Gerak

Direct catalogue of retained games.

Possible filters:

- Tangan
- Tubuh
- 1 Pemain
- 2 Pemain
- Matematika
- Iqro
- Kreatif

This area does not replace curriculum placement. A game may exist both here and inside a stage.

---

## 9. Child onboarding flow

The reference screenshots demonstrate a useful low-friction model.

Mainlagi's recommended flow:

```text
Parent creates/signs into account
        ↓
Create Child Profile
        ↓
Child display name
        ↓
Age / age band
        ↓
Optional avatar selection
        ↓
Optional language preference
        ↓
Recommended starting path
        ↓
Child Home
```

### 9.1 Age selection

Use large tap targets.

Avoid typing a date of birth directly on a child-facing screen unless required by parent workflow.

### 9.2 Avatar selection

A child avatar is conceptually separate from the five Mainlagi guide characters.

- Naya, Gian, Zia, Paca, and Gavi are recurring Mainlagi characters.
- A future user-avatar set may be offered separately.
- If avatar customization is not implemented, do not pretend that it exists.

### 9.3 Parent gate

Account settings, privacy, subscriptions, AI configuration, and destructive actions require a parent gate.

The exact gate mechanism can be PIN, simple adult challenge, or authenticated parent surface; it must not depend on a child understanding account security.

---

## 10. Character system

The canonical five Mainlagi characters are:

### Naya

- older sister figure;
- approximately age 8;
- girl;
- wears hijab;
- warm, encouraging, capable guide.

### Gian

- boy;
- approximately age 5;
- energetic, curious, playful.

### Zia

- younger sister figure;
- approximately age 3;
- girl;
- expressive, curious, beginner-friendly.

### Paca

- simple friendly robot;
- male-coded character;
- should remain visually simple and child-friendly;
- useful for hints, system reactions, discovery, and technology-related moments.

### Gavi

- orange cat;
- playful mascot;
- useful for humor, rewards, emotional reactions, and lightweight guidance.

### 10.1 Character roles

Characters may support:

- activity introduction;
- narration;
- hints;
- encouragement;
- retry feedback;
- celebrations;
- transitions between stages;
- story continuity;
- bilingual voice identity;
- reward moments;
- emotional/social learning scenes.

### 10.2 Character rule

Characters are **not decorative stickers only**.

They should function as a consistent narrative and feedback layer across the product.

### 10.3 Character IP

Character names, artwork, voice identity, branded appearances, and related assets are not automatically granted under the software code license. See `TRADEMARKS.md`.

---

## 11. Visual design direction

The child experience should be visually simple, cheerful, and original.

### 11.1 Desired characteristics

- simple 2D illustration;
- rounded forms;
- friendly expressions;
- large readable shapes;
- generous whitespace;
- low clutter;
- soft/pastel base UI with stronger activity accents;
- large touch targets;
- limited choices per screen;
- clear selected states;
- strong hierarchy;
- minimal decorative noise;
- child-friendly motion/animation;
- character-led feedback.

### 11.2 Reference relationship

Khan Academy Kids can inform the **simplicity and information hierarchy**.

Other preschool visual references may inform the **energy and friendliness**.

Mainlagi must still create its own:

- illustration style;
- color system;
- icon system;
- card system;
- motion language;
- characters;
- backgrounds;
- typography choices;
- learning-world identity.

### 11.3 Screen density rule

A child activity screen should normally have:

- one primary learning goal;
- one dominant interaction area;
- one obvious back/exit mechanism;
- one character or feedback region where needed;
- minimal competing navigation.

If an activity requires the child to scan many unrelated controls, the screen is probably too dense.

---

## 12. Activity card model

Each activity displayed in a library should have a consistent descriptor.

Conceptual shape:

```ts
interface LearningActivityDefinition {
  id: string;
  title: string;
  subject: SubjectId;
  stageId?: string;
  lessonId?: string;
  runtime: ActivityRuntimeType;
  ageMin?: number;
  ageMax?: number;
  skillIds: string[];
  thumbnail: string;
  durationHint?: number;
  supportsAudio: boolean;
  supportsMotion: boolean;
  availability: "free" | "premium" | "internal";
}
```

This is a conceptual contract, not a requirement to copy this exact TypeScript interface.

---

## 13. Activity runtime system

Mainlagi should support multiple activity engines behind one common platform contract.

Canonical runtime categories may include:

```text
motion_hand
motion_pose
motion_hybrid
tap_choice
trace
free_draw
coloring
drag_drop
matching
sequence
listen_and_choose
speak
story
puzzle
ocr_capture
ocr_write
video_or_media
```

Not all runtimes need to exist in the first implementation wave.

### 13.1 Existing motion runtime

Current hand/pose/hybrid MediaPipe systems map into the new activity contract rather than being replaced.

### 13.2 Coloring runtime

A future Mewarnai experience may support:

- selectable coloring page;
- large color palette;
- brush/fill modes;
- undo;
- reset;
- completion action;
- optional save/export;
- character coloring packs;
- topic-based coloring packs.

Use original Mainlagi content and properly licensed third-party assets only.

### 13.3 Tracing runtime

Tracing can support:

- letters;
- numbers;
- Hijaiyah;
- shapes;
- line control;
- simple handwriting preparation.

The existing tracing work should be reused where technically appropriate.

---

## 14. Existing games inside the new system

No agent should assume a flat migration where each old game becomes a separate obsolete page.

Instead:

```text
Existing Game
    ↓
Activity Adapter / Activity Definition
    ↓
Can appear in:
- direct Games library
- subject learning path
- stage recommendation
- challenge/reward event
```

Examples:

- `Math Pilih Jawaban` → Matematika activity + Games library;
- `Math Motion Battle` → Matematika activity + Main Gerak;
- `Number Trace Adventure` → Matematika/number-writing path;
- `Shape Quest` → early geometry/creative motor activity;
- `Pattern Race` → Matematika reasoning;
- `Math Warung` → applied numeracy;
- `Iqro Motion` → Iqro path;
- `AirBoard Presenter` → creative/classroom tool, possibly outside the main preschool curriculum;
- `Beat Motion` → movement/play zone;
- `Run to Target` → movement/play zone.

Final curriculum placement requires product/curriculum review.

---

## 15. Stage and progression model

The platform should make learning progress visible to a child without turning every result into competition.

Possible progression model:

```text
Subject
  Stage 1  ●●●○○
  Stage 2  locked/recommended
  Stage 3  future
```

A stage may contain 3–8 short activities depending on age and topic.

### 15.1 Completion

An activity can be:

- not started;
- started;
- completed;
- recommended to repeat;
- mastered only if an explicit evidence rule exists.

### 15.2 Do not equate score with mastery automatically

A motion-game score is not automatically a learning mastery score.

Mastery requires an explainable learning objective and evidence rule.

### 15.3 Forgiving progression

Young children should not be trapped by harsh failure states.

Use:

- retry;
- hints;
- alternate easier activity;
- extra time;
- reduced complexity;
- encouraging feedback.

---

## 16. Rewards

Possible reward system:

- stars;
- stickers;
- badges;
- character reactions;
- stage celebration;
- collectible visual items;
- certificates/milestones.

Rewards should reinforce participation and learning, not create punitive streak anxiety for young children.

---

## 17. Parent experience

Parent UX is separate from child UX.

Recommended parent sections:

```text
Overview
Children
Progress
Recent Activity
Reports
Certificates
Privacy & AI
Subscription / Plan
Settings
```

### 17.1 Parent report principles

Reports should answer:

- What did the child practice?
- What did the child complete?
- What appears easy?
- What should be repeated?
- Which subject/stage is next?
- How much activity occurred recently?

Do not generate opaque labels such as "weak child" or high-stakes educational judgments from a single game score.

---

## 18. Learning evidence model

The future system needs explicit event/evidence data.

Examples:

```text
activity_started
activity_completed
answer_correct
answer_retry
trace_completed
trace_accuracy_band
motion_round_completed
letter_recognized
word_matched
coloring_completed
hint_requested
ocr_submission_received
ocr_result_confirmed
stage_completed
```

Events should support parent reporting without storing unnecessary sensitive child data.

---

## 19. OCR + AI engine direction

OCR/AI is a **new optional activity subsystem** and must not replace the existing vision engine.

Recommended relationship:

```text
Learning Activity
    ↓
Capture / Drawing / Worksheet Input
    ↓
Local deterministic preprocessing where possible
    ↓
OCR / recognition adapter
    ↓
Optional AI verification
    ↓
Learning result
```

### 19.1 OpenRouter

OpenRouter is the planned gateway for optional AI-provider access.

The operator supplies the API key separately.

Never expose the API key to the browser.

Expected environment variable pattern:

```text
OPENROUTER_API_KEY=...
```

Never use:

```text
NEXT_PUBLIC_OPENROUTER_API_KEY
```

### 19.2 Child privacy boundary

Do not continuously upload camera frames to an AI provider.

Prefer the smallest necessary input:

- stroke coordinates;
- cropped answer region;
- preprocessed image;
- recognized candidate text;
- low-resolution task-specific capture.

See `docs/AI_OCR_OPENROUTER.md` for the provider boundary.

---

## 20. Audio and bilingual system

Planned language support:

- Bahasa Indonesia;
- English.

Child instructions should support audio-first delivery.

Recommended fixed-content approach:

```text
lesson text
    ↓
reviewed narration asset
    ↓
playback in activity
```

Use dynamic TTS only where content truly needs runtime generation.

Voice identity should be consistent per character and legally usable for commercial distribution.

---

## 21. Content library model

The screenshots show the value of a visual content library.

Mainlagi should support browsing by:

- subject;
- stage;
- skill/topic;
- activity type;
- age recommendation;
- completion state;
- free/premium entitlement where applicable.

The child-facing implementation should expose only a small subset of these filters visually.

Complex filtering belongs in parent/admin/content-management surfaces.

---

## 22. Search

Child-facing search is not a first priority for ages 3–7 because it requires literacy and keyboard input.

Prefer visual browsing and recommendations.

Parent/admin search may be added independently.

---

## 23. Offline direction

Offline support is desirable but is **not an implementation claim in this specification**.

If implemented later, priority should be:

1. cached fixed learning assets;
2. pre-generated audio;
3. deterministic activities;
4. local progress queue;
5. sync when connection returns.

AI-dependent activities must fail gracefully when offline.

---

## 24. Free/open-source and paid product boundary

The source code is currently prepared under the repository's declared software license, while Mainlagi may also have commercial offerings.

A possible product split is:

### Community / open-source capability

- core application shell;
- activity framework;
- motion runtime;
- selected example/basic content;
- local development tools;
- contribution interfaces.

### Commercial/premium capability

May include:

- premium curriculum packs;
- premium character/audio assets;
- hosted cloud services;
- cross-device cloud sync;
- advanced parent reports;
- subscriptions/entitlements;
- school/teacher analytics;
- managed AI usage;
- premium certificates/content;
- support/SLA/white-label arrangements.

This list is directional. Do not implement arbitrary paywalls without an explicit monetization specification.

See `COMMERCIAL_LICENSE.md` and `TRADEMARKS.md`.

---

## 25. Child privacy and safety principles

Because the product is designed for children:

- collect the minimum data needed;
- keep parent controls separate;
- do not expose provider API keys;
- do not upload continuous camera video unless a future feature explicitly requires and legally supports it;
- avoid unnecessary face/image retention;
- keep camera processing local where the current engine already supports it;
- make camera state obvious;
- provide camera-off/fallback routes where activity design permits;
- avoid manipulative reward/streak mechanics;
- avoid public child profiles by default;
- treat analytics and AI outputs as sensitive product surfaces.

Any production expansion into child accounts, AI image processing, voice, or school deployment requires dedicated privacy/legal review.

---

## 26. Recommended screen map

Conceptual child screen map:

```text
/child/select
/child/[id]/home
/child/[id]/learn
/child/[id]/subject/[subject]
/child/[id]/stage/[stage]
/child/[id]/activity/[activity]
/child/[id]/games
/child/[id]/rewards
```

Conceptual parent screen map:

```text
/parent
/parent/children
/parent/children/[id]
/parent/children/[id]/progress
/parent/children/[id]/reports
/parent/children/[id]/certificates
/parent/privacy
/parent/plan
/parent/settings
```

These routes are conceptual. Existing routes must be audited before changing route architecture.

---

## 27. Activity lifecycle

A generic activity should follow a predictable lifecycle:

```text
enter activity
    ↓
load assets/runtime
    ↓
show minimal instruction
    ↓
ready/preflight if needed
    ↓
active interaction
    ↓
feedback
    ↓
retry or complete
    ↓
record learning event
    ↓
reward/reaction
    ↓
next activity / return to stage
```

Motion activities may insert the existing camera/model preflight before active interaction.

---

## 28. Error and retry design

For a child-facing activity:

Avoid:

- technical error messages;
- stack traces;
- provider names;
- HTTP codes;
- frightening failure language.

Prefer:

- "Coba lagi";
- visual hint;
- character reaction;
- alternate control;
- parent-help route when necessary.

Technical detail should be available only in parent/developer diagnostics.

---

## 29. Visual states

Every interactive item should define at least:

- default;
- hover where pointer exists;
- focused;
- pressed;
- selected;
- completed;
- locked if applicable;
- disabled;
- loading.

Selected categories should be visually obvious without relying only on tiny text or color differences.

---

## 30. Accessibility direction

Even though this is child-focused, accessibility is required.

Design toward:

- large touch targets;
- keyboard fallback where practical;
- strong focus visibility;
- readable contrast;
- captions/transcripts where relevant;
- audio replay;
- reduced motion option;
- left/right hand tolerance;
- forgiving gesture thresholds;
- no essential meaning conveyed only by color;
- parent-visible accessibility settings.

---

## 31. Implementation layering

The preferred architecture is additive:

```text
Mainlagi Learning Platform
├── Child Shell
├── Parent Shell
├── Curriculum / Content Layer
├── Learning Path / Stage Engine
├── Recommendation / Progress Layer
├── Activity Contract
│   ├── Existing Motion Runtime
│   ├── Tracing Runtime
│   ├── Choice Runtime
│   ├── Coloring Runtime
│   ├── Matching / Drag Runtime
│   └── Future OCR / AI Runtime
├── Character / Audio Layer
├── Learning Event Layer
└── Persistence / Entitlement Layer
```

The existing motion engine sits **inside** this architecture rather than underneath a rewrite.

---

## 32. Suggested implementation order

Do not attempt the whole platform in one giant implementation.

Recommended order:

### Phase A — Foundation

- finalize content/activity schema;
- child profile data model;
- subject/stage/activity registry;
- activity adapter contract;
- route/navigation shell;
- preserve all existing routes/games during migration.

### Phase B — Child learning shell

- child selector;
- age-aware profile;
- Home;
- subject library;
- stage view;
- activity cards;
- Continue Learning.

### Phase C — Existing game integration

- wrap existing games in activity definitions;
- surface games inside relevant subjects;
- preserve direct Main Gerak catalogue;
- map game completion into learning events without inventing mastery.

### Phase D — New lightweight runtimes

- tap/choice;
- matching;
- tracing reuse;
- coloring;
- simple listening activities.

### Phase E — Character/audio layer

- Naya/Gian/Zia/Paca/Gavi states;
- intro/hint/retry/success animations;
- reviewed Indonesian audio;
- reviewed English audio.

### Phase F — Parent progress

- activity history;
- subject/stage progress;
- report summary;
- certificate milestones;
- privacy controls.

### Phase G — OCR/AI

- OCR adapter;
- image/stroke preprocessing;
- server OpenRouter adapter;
- AI timeout/rate limit/privacy controls;
- AI fallback behavior;
- parent-visible AI settings.

### Phase H — Commercial/premium layer

Only after explicit entitlement/product decisions:

- subscriptions;
- premium content;
- managed cloud features;
- school capabilities.

---

## 33. Explicit non-goals

Unless separately approved, an implementation agent must not:

- delete the existing games;
- replace the MediaPipe runtime with AI vision;
- send the full child camera stream to OpenRouter;
- clone Khan Academy Kids visually;
- copy third-party mascots or illustrations;
- redesign Mainlagi as a text-heavy school LMS;
- assume every child activity requires AI;
- make AI a dependency for launching existing games;
- treat a game score as educational mastery automatically;
- expose admin/parent complexity to the child UI;
- invent curriculum claims without curriculum evidence;
- hardcode a commercial paywall structure that has not been approved.

---

## 34. AI-agent execution rules

Any AI agent modifying Mainlagi should follow these rules.

### Before coding

1. Read this document.
2. Read `docs/PRODUCT_DIRECTION.md`.
3. Read `docs/ARCHITECTURE.md`.
4. If touching OCR/AI, read `docs/AI_OCR_OPENROUTER.md`.
5. Inspect the current implementation before proposing a rewrite.
6. Confirm the current default-branch HEAD.
7. Work on a branch/PR rather than casually editing `main`.

### During implementation

1. Preserve existing engine behavior unless the task explicitly changes it.
2. Preserve all 10 existing games.
3. Reuse existing runtime/engine code where appropriate.
4. Keep planned features labelled as planned until implemented and verified.
5. Do not silently change product taxonomy.
6. Do not copy reference product assets.
7. Keep child UX low-density and age-appropriate.
8. Keep parent/admin settings outside child surfaces.
9. Keep OpenRouter credentials server-only.
10. Add tests for new contracts and migration adapters.

### Before completion

1. Run typecheck.
2. Run lint.
3. Run engine tests.
4. Run simulations where relevant.
5. Run production build.
6. Run dependency audit where required by CI.
7. Perform visual verification for child-facing UI changes.
8. Check mobile layout.
9. Check that existing games still launch.
10. Update documentation when architecture or product behavior changes.

An agent must not report work as complete solely because source code was written.

---

## 35. Acceptance criteria for the future learning shell

The first coherent learning-shell milestone is successful when:

- a parent can create/select a child profile;
- a child can enter an age-appropriate Home screen;
- the five agreed learning areas are visible;
- the child can open a subject;
- subject content is shown as large visual activity cards;
- a stage can contain multiple activity runtime types;
- at least one existing game appears inside a learning path without being removed from direct game access;
- Continue Learning returns to the correct next item;
- completion generates learning-event data;
- child UX is clearly separated from parent UX;
- all existing motion games still function;
- mobile and desktop layouts remain usable;
- no third-party reference artwork is copied.

---

## 36. Open decisions that must not be guessed

The following remain product decisions and should be resolved explicitly before deep implementation:

- exact curriculum per age and subject;
- exact stage names and number of stages;
- exact skill/mastery rules;
- whether child avatars ship at launch;
- exact Home navigation labels;
- exact reward economy;
- certificate criteria;
- whether books/stories/videos become first-class Mainlagi content categories;
- full offline/PWA scope;
- exact premium/free content split;
- subscription pricing;
- school/teacher scope;
- final voice model/provider;
- final OCR model/provider strategy;
- which OpenRouter models are approved for which activity types;
- character animation production pipeline.

When one of these decisions blocks implementation, an agent should flag it rather than inventing a permanent product rule.

---

## 37. One-sentence product model

> Mainlagi is a playful, character-led learning platform for children approximately age 3–7 where structured learning paths, simple visual libraries, creative activities, and future OCR/AI capabilities are built **around** the existing motion-learning engine and 10 existing games—not in place of them.

---

## 38. Compact mental model for agents

If an agent remembers only one diagram, use this:

```text
PARENT ACCOUNT
    ↓
CHILD PROFILE + AGE
    ↓
CHILD HOME
    ↓
┌──────────────────────────────────────────┐
│ Bahasa │ English │ Math │ Iqro │ Color │
└──────────────────────────────────────────┘
    ↓
STAGE / VISUAL ACTIVITY LIBRARY
    ↓
ACTIVITY CONTRACT
    ↓
┌───────────────────────────────────────────────┐
│ Existing Motion │ Trace │ Tap │ Color │ OCR │
│ 10 Games        │ Match │ Audio │ Story │ AI │
└───────────────────────────────────────────────┘
    ↓
LEARNING EVENT + REWARD
    ↓
NEXT ACTIVITY / CONTINUE LEARNING
    ↓
PARENT PROGRESS & REPORT
```

The existing engine and games are therefore retained as first-class Mainlagi capabilities while the platform grows around them.
