# Architecture — Mainlagi Hub

Last reviewed: **20 September 2026**

This document describes the current implemented architecture and the explicit boundaries for planned work. `main` is the implementation source of truth.

## 1. Current platform shape

```text
Next.js App Router
├── Public / parent surfaces
│   ├── home / about / faq
│   ├── discover / affiliate
│   ├── auth / account / parent
│   └── owner admin
├── Child learning platform
│   ├── child profile / active-child state
│   ├── recommendation / continue learning
│   ├── subject / stage / activity routes
│   ├── activity gallery
│   ├── progression guard
│   └── activity runtimes
├── Retained Mainlagi games
│   ├── GameShell + Preflight
│   └── 10 internal motion/game experiences
├── Learning evidence/mastery engine
└── Shared browser vision runtime
    ├── MediaPipe Hand Landmarker
    ├── MediaPipe Pose Landmarker
    ├── optional face signal
    ├── player assignment / hand ownership
    ├── gesture latch / smoothing
    └── body-action classification
```

The current motion/vision engine is a retained capability. It must not be rewritten merely because the product is now a broader learning platform.

### Current parent presentation ownership

The 20 September WS-13 parent wave converged active presentation ownership without changing the learning/data model:

- `/parent/*` routes enter through `LearningPlatform`;
- canonical parent overview is `CloudParentOverviewScreen`;
- shared parent shell/settings are owned by `ParentLearningPlatform.tsx`;
- below 760px the parent shell uses a sticky header + fixed five-destination bottom nav;
- at/above 760px it uses the parent sidebar;
- legacy MobileFoundation behavior that forced a parent sidebar on mobile is retired.

The parent overview uses existing completion/stars/recent-activity/recommendation data. It does not create a second mastery model.

Character/profile architecture boundary:

- `LearningChildProfile.guide` points to a Mainlagi guide-character ID;
- the child's profile identity is not the guide character;
- parent surfaces now render neutral child identity separately from guide metadata;
- Paca/Gavi use production image assets; Naya/Gian/Zia currently use fallback visual representations pending production assets.

## 2. Current learning hierarchy

```text
Account / Household
└── Child Profile
    └── Subject
        └── Learning Path / Stage
            └── Lesson
                └── Activity
                    └── Learning Attempt
                        └── Skill Evidence
                            └── Skill Mastery
                                └── Progress / Recommendation / Parent Report
```

The current catalog has **9 subjects**:

1. Bahasa Indonesia
2. English
3. Matematika
4. Iqro
5. Huruf & Menulis
6. Logika
7. Sains
8. Mewarnai
9. Menggambar

Current baseline:

- 900 activities;
- 46 stages;
- 197 lessons;
- 197 active content packs;
- 200 active skills;
- 683 assessed / 217 practice activities.

## 3. Activity runtime layer

Current activity families include:

```text
tap_choice
listen_and_choose
matching
trace
story
motion_game
coloring
drawing
```

The platform contract must allow new mechanics only when they improve the representation of a learning objective. A new runtime is not valuable merely because it increases variety counts.

The next product-quality phase may add/reuse adapters for meaningful interactions such as sorting, ordering, sequence, hotspot/find-in-scene, puzzle, memory, or drag/drop. Every runtime must preserve completion/evidence semantics and mobile/accessibility requirements.

## 4. Retained motion/game layer

Canonical direct games remain in `src/lib/data/games.ts`:

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

They remain directly playable and can also be adapted into subject/stage activity placement where pedagogically appropriate.

Motion is optional for core learning. The platform must remain usable on a phone/tablet without requiring camera motion.

## 5. Vision interaction contract

Vision modes remain:

- `hand`
- `pose`
- `hybrid`

Typical writing gesture contract:

```text
pinch start   -> begin stroke
pinch hold    -> append points
pinch release -> end stroke
open palm     -> submit
fist          -> clear
```

Temporal stabilization, hand ownership, bounded reacquisition and input smoothing reduce detector churn. Physical-device testing remains required.

## 6. Learning evidence/mastery boundary

Legacy `game_sessions` and `game_scores` remain separate from academic mastery.

Current learning write/read architecture uses:

- learning attempts;
- activity-skill evidence;
- child skill mastery;
- child learning progress;
- achievements/certificates where valid;
- parent reporting and adaptive recommendation consumers.

Core learning ownership/security migrations `0001–0007` remain part of the foundation. Later catalog/content migrations extend the learning content but do not change the principle that legacy scores are not converted into artificial mastery.

See `LEARNING_ATTEMPTS_MASTERY.md`.

## 7. Progression vs presentation

The **data model remains stage/progression-based**.

The current frontend also exposes a broad subject activity gallery. Those are different concerns:

```text
Progression/data truth
  -> stage unlock / readiness / recommendation

Presentation
  -> continue learning / subject browsing / activity gallery
```

The next phase must reconcile how much of the stage model is visible to a child. Do not remove progression/evidence rules merely to simplify navigation.

Canonical decision work is tracked in `NEXT_PRODUCT_QUALITY_PLAN.md` WS-09.

## 8. Voice/audio architecture target

Current audio/TTS infrastructure exists, but final native Indonesian/English character narration is not yet complete.

Target boundary:

```text
Activity / character narration request
  -> Narration contract
      -> voice registry
          -> approved pre-generated asset for fixed content
          -> dynamic TTS provider only when required
```

The frontend must not become tightly coupled to one TTS repository/provider.

Each engine/model/voice requires independent licence/provenance review. Fixed lesson audio should be human-reviewed before becoming approved production content. Iqro pronunciation requires competent human review rather than generic TTS approval.

## 9. Visual/content architecture target

Procedural/generated content is not automatically production art.

Coloring/Drawing content should move toward:

```text
learning objective
  -> authored/curated content definition
      -> approved illustration/scaffold asset
          -> runtime renderer
              -> screenshot/geometry/accessibility QA
                  -> human visual approval
```

A future Mainlagi Art Bible should define stroke, shape language, palette, complexity-by-age, touch/fill sizing, characters and illustration rules.

## 10. Public/parent and affiliate boundary

Public/parent surfaces may contain:

- About / FAQ;
- parent information;
- articles/discover;
- affiliate recommendations;
- account/privacy controls.

Child learning activities must not contain shopping CTA or affiliate persuasion.

Affiliate destinations flow through validated internal redirect infrastructure and require clear disclosure.

## 11. Data/auth boundary

- Supabase Auth supports configured cloud authentication.
- Supabase Postgres + RLS backs cloud learning/account/content paths.
- Canonical production project: `estvtgflwkebomsqlolv` (`ap-southeast-1`).
- Parent and authenticated child routes enforce account/child ownership.
- Service-role operations remain server-side only.
- Guest/local child play can remain local where explicitly supported.

## 12. OCR + AI boundary — planned

General OCR/AI is not production-complete and is not the priority of the current quality phase.

Future preferred boundary:

```text
Activity
  -> OCR/visual request contract
      -> local/deterministic recognizer when sufficient
      -> optional server-side AI verification/enrichment
          -> configured provider gateway
```

Requirements:

- no provider secret in client bundles;
- no automatic raw-camera upload;
- data minimization;
- bounded input/output and timeout behavior;
- core learning remains understandable if AI is unavailable whenever practical.

See `AI_OCR_OPENROUTER.md`.

## 13. Security/privacy boundaries

Mainlagi is child-facing software. Any architecture change involving child data, camera, voice, analytics, OCR, or external AI must preserve:

- least privilege;
- data minimization;
- explicit server/client boundaries;
- RLS/server authorization;
- no secret exposure to browser bundles;
- no camera-frame retention by default;
- auditable external dependencies, models and assets.

## 14. Canonical production deployment

```text
GitHub `ceritaantarkita-req/mainlagi-hub`
  -> protected `main`
  -> Cloudflare Git integration / build
  -> OpenNext for Cloudflare Workers
  -> Worker `mainlagi-hub`
  -> https://mainlagihub.my.id/
```

GitHub Actions provides code/security/compatibility/build gates. It does not deploy Mainlagi through SSH/VPS.

Capacitor remains a possible native-wrapper path, not the canonical web production deployment.

## 15. Canonical next-work rule

Before substantial frontend/content/audio changes, read:

- `NEXT_PRODUCT_QUALITY_PLAN.md`;
- `CURRENT_STATE.md`;
- `MAINLAGI_LEARNING_PLATFORM_UX_SPEC.md`;
- the subsystem-specific documentation.

A task is not complete until relevant docs and the execution log are updated.
