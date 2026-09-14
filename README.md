# Mainlagi Hub

**Mainlagi Hub** adalah platform belajar dan edutainment untuk anak usia **3–7 tahun** yang mempertahankan motion/vision engine Mainlagi sebagai salah satu runtime, bukan sebagai satu-satunya cara belajar.

Status: **public open-source core, active development**. Source repository menggunakan `AGPL-3.0-only`; jalur commercial/paid dapat memakai terms terpisah.

## Production

```text
GitHub protected `main`
  -> Cloudflare Git integration / build
  -> OpenNext for Cloudflare Workers
  -> https://mainlagihub.my.id/
```

Production tidak memakai VPS/SSH sebagai jalur canonical.

## Current baseline — 14 September 2026

PR #87, **Redesign child learning experience and product QA**, sudah merged ke `main` pada commit:

```text
25c83840b74c4eca1dd3d3b71e888f7dfc4d8b21
```

Post-merge CI dan exact-SHA Cloudflare smoke sudah lulus. Current learning catalog:

- 9 subjects;
- 900 activities;
- 683 assessed / 217 practice;
- 46 stages;
- 197 lessons;
- 197 content packs;
- 200 active skills.

Current subjects:

1. Bahasa Indonesia
2. English
3. Matematika
4. Iqro
5. Huruf & Menulis
6. Logika
7. Sains
8. Mewarnai
9. Menggambar

Current frontend memakai Garden/Playroom visual system, child profile + continue-learning flow, subject/activity browsing, stage/progression protection, activity runtimes, parent reporting, and retained motion games.

## Retained Mainlagi games

Sepuluh motion/game experiences tetap dipertahankan dan dapat digunakan sebagai activity runtime atau direct game experience:

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

Canonical definitions: `src/lib/data/games.ts`.

## Learning architecture

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

Completion, reward/stars, and mastery are separate concepts. Drawing/Coloring remain practice/completion-only unless a validated assessed evidence model exists. Legacy `game_sessions` and `game_scores` are not reinterpreted as academic mastery.

## Activity runtimes

Current 900-activity inventory includes:

- `tap_choice`
- `listen_and_choose`
- `matching`
- `trace`
- `story`
- `motion_game`
- `coloring`
- `drawing`

The next phase prioritizes **quality and variety of the existing 900 activities**, not increasing the count.

## Current product-quality priorities

Canonical execution plan: [`docs/NEXT_PRODUCT_QUALITY_PLAN.md`](docs/NEXT_PRODUCT_QUALITY_PLAN.md).

The next phase focuses on:

- native-feeling Indonesian and English narration with reviewed/licensed audio;
- current About/FAQ and discoverable parent-facing affiliate recommendations;
- audit/redesign of trivial, invalid, or repetitive activities;
- broader meaningful gameplay mechanics;
- rebuilding weak/duplicate Coloring and Drawing visuals;
- an explicit Mainlagi art direction and visual QA gate;
- reconciling stage progression with the current 100-card activity gallery;
- physical-device/accessibility acceptance and Iqro expert review;
- repository governance hardening.

**Quality first. Quantity later.**

## Motion/vision architecture

```text
Shared browser vision runtime
├── MediaPipe Hand Landmarker
├── MediaPipe Pose Landmarker
├── optional face signal
├── player assignment / hand ownership
├── gesture latch / smoothing
└── body-action classification
```

Motion remains a first-class optional capability. Core learning must remain usable on phone/tablet without requiring motion capture.

## Voice/audio direction

Fixed lesson narration should prefer **pre-generated, human-reviewed audio assets**. Runtime TTS is a fallback for genuinely dynamic content. Voice/model/provider choice must remain behind an abstraction and every engine/model/voice licence must be reviewed before commercial use.

Iqro/Hijaiyah pronunciation requires competent human review and must not treat generic TTS as final authority.

## OCR + AI — planned, not current priority

OCR/AI remains a modular future capability. It must not block current touch-first learning or replace deterministic runtimes where they are sufficient.

Requirements include:

- server-side provider keys only;
- no `NEXT_PUBLIC_` secret;
- no automatic raw-camera upload;
- payload minimization and explicit privacy boundaries;
- configurable provider/model.

See [`docs/AI_OCR_OPENROUTER.md`](docs/AI_OCR_OPENROUTER.md).

## Local setup

Requirements:

- Node.js 20.9+
- npm 10+
- Chrome/Edge modern
- `localhost` or HTTPS for camera access

```bash
git clone https://github.com/ceritaantarkita-req/mainlagi-hub.git
cd mainlagi-hub
npm ci
cp .env.example .env.local
npm run dev
```

Never commit `.env.local`, Supabase service-role keys, provider/API keys, Cloudflare tokens, or other credentials.

## Quality gates

Use repository scripts as the source of truth. Important aggregate/local commands include:

```bash
npm run check
npm run test:learning
npm run qa:local:product
npm run build:cloudflare
npm audit --omit=dev --audit-level=high
```

CI also covers Windows compatibility, mobile Chromium QA, production build/budgets, dependency audit, secret-history scan, and exact-SHA Cloudflare production smoke.

Physical-device testing is still required; headless CI cannot certify real touch, camera, Safari/Chrome device behavior, VoiceOver/TalkBack, or device audio quality.

## Privacy and safety

Mainlagi is child-facing software. Changes involving camera, child profiles, analytics, audio/voice, OCR, or AI must use:

- data minimization;
- least privilege;
- explicit server/client boundaries;
- no raw-camera retention by default;
- RLS/server authorization for cloud data;
- bounded external-provider input/output;
- auditable dependencies, models, assets, and licences.

See [`SECURITY.md`](SECURITY.md).

## Open source + commercial edition

Source code is released under **GNU Affero General Public License v3.0 only (`AGPL-3.0-only`)**, except files that explicitly state another licence.

AGPL permits commercial use when its obligations are followed. Mainlagi may separately offer commercial terms, services, premium/proprietary content, assets, or licences.

Software-code licensing does not automatically grant rights to Mainlagi trademarks, character artwork, voice identities, or proprietary premium content.

See:

- [`LICENSE`](LICENSE)
- [`OPEN_CORE.md`](OPEN_CORE.md)
- [`COMMERCIAL_LICENSE.md`](COMMERCIAL_LICENSE.md)
- [`TRADEMARKS.md`](TRADEMARKS.md)
- [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md)

## Canonical documentation

Start with [`docs/README.md`](docs/README.md), then read:

- [`docs/NEXT_PRODUCT_QUALITY_PLAN.md`](docs/NEXT_PRODUCT_QUALITY_PLAN.md)
- [`docs/CURRENT_STATE.md`](docs/CURRENT_STATE.md)
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/MAINLAGI_LEARNING_PLATFORM_UX_SPEC.md`](docs/MAINLAGI_LEARNING_PLATFORM_UX_SPEC.md)
- [`docs/LEARNING_ATTEMPTS_MASTERY.md`](docs/LEARNING_ATTEMPTS_MASTERY.md)
- [`docs/KNOWN_LIMITATIONS.md`](docs/KNOWN_LIMITATIONS.md)

Historical audit/redesign documents describe the state at the time they were written and must not override the canonical current-state documents above.

## Disclaimer

Mainlagi Hub is actively developed software and is not a replacement for teachers, parents/guardians, healthcare professionals, or professional developmental assessment. Product learning signals are internal educational signals, not medical or intelligence diagnoses.
