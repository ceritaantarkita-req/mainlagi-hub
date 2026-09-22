# Known Limitations

Last reviewed: **22 September 2026**

This file describes current known limitations. Historical ZIP/build-environment limitations belong in historical audit documents and must not be treated as current production state.

## Product/content quality

The catalog contains 9 subjects and 900 activity routes, but route count does not equal pedagogical or visual quality.

Current known issues include:

- many activities still rely on repeated `tap_choice` or `matching` patterns;
- some activity representations do not correctly measure the intended skill;
- some distractors/prompts are too trivial, repetitive, or age-inappropriate;
- Coloring contains duplicate/near-duplicate compositions and some complex scenes degrade visually;
- Drawing scaffolding is inconsistent across the full 100-activity set;
- activity variety needs to improve before expanding the catalog further.

The canonical remediation plan is `NEXT_PRODUCT_QUALITY_PLAN.md`.

## Stage progression vs activity gallery

The 20 September gallery/home work improved hierarchy and added isolated QA-unlock behavior, but the underlying product boundary remains: stage/progression truth and broad child browsing are different concerns.

Current presentation must continue to preserve recommendation, age eligibility, lock reasons and direct-route guards while avoiding an undifferentiated wall of activities. QA unlock must remain isolated from normal production profiles.

## Voice and narration

The first-instruction narration latency/preload wave is merged/live verified. English narration quality Wave 1 is also merged/live verified via PR #278 -> main `8d60a69a...`: all 27 English listening activities are explicitly reviewed, 22 vocabulary/letter/phrase activities use target-first spoken copy, 5 comprehension activities retain sentence-level narration, and the browser fallback now prefers higher-quality exact-locale English voices when available.

This is still a browser-dependent fallback improvement. Mainlagi does **not** yet claim final production-quality native Indonesian and English character narration.

Remaining work:

- provider abstraction;
- reviewed Indonesian and English voices;
- character voice registry;
- voice/model licence and provenance tracking;
- pre-generated reviewed audio for fixed lesson narration;
- runtime TTS only for justified dynamic content.

Iqro/Hijaiyah pronunciation requires competent human review. Generic TTS must not be treated as final pronunciation authority.

## Character production assets

Paca and Gavi have production Garden WebP artwork. Naya, Gian and Zia still lack production image files under `public/artwork`; their current fallback representations are not final brand assets.

Character production/development is **paused by the project owner**. Existing Drive character material is reference-only while paused. When explicitly resumed, the next character-specific gate is to lock production specifications, review candidate artwork, and document provenance/redistribution rights before integration. Child profile identity must remain separate from guide-character identity.

## About, FAQ, and affiliate discoverability

`/about`, `/faq`, affiliate redirect/catalog infrastructure, and `/discover/products` already exist.

Current limitations:

- About/FAQ copy still reflects older Mainlagi positioning;
- recommendations are not sufficiently discoverable from primary navigation;
- parent/public information architecture needs cleanup;
- affiliate content must remain outside the child learning flow and retain clear disclosure.

## Physical-device acceptance

Headless/synthetic QA does not prove real-device behavior.

Issue #83 still tracks representative physical validation for:

- iPhone + Safari;
- Android + Chrome;
- touch targets;
- tracing;
- drawing;
- coloring;
- audio/TTS;
- camera permission/recovery/denial;
- orientation and safe areas;
- reduced motion;
- text scaling;
- VoiceOver/TalkBack;
- offline/reconnect/session isolation.

## Iqro expert review

The current Iqro catalog contains 100 activities. Active Iqro content remains `expert_required`; it is not `expert_approved` merely because engineering tests pass.

Human expert review is still required for content, glyph/dot handling, transliteration where present, pronunciation/audio, and pedagogical appropriateness.

## Motion/camera accuracy

Synthetic landmark tests cannot certify every physical environment. Real-camera behavior can vary with:

- device/camera quality;
- lighting/backlight;
- child/adult proportions;
- left/right hand;
- occlusion/crossing hands;
- multi-player positioning;
- long-session camera restart/recovery.

Motion is optional for core learning and must not become a hidden requirement for phone/tablet users.

## Full-body depth

Run to Target estimates forward/back movement from relative torso scale. Standard webcams do not provide true depth sensing. Calibration and physical testing remain necessary.

## AirBoard

Known retained limitations include:

- PDF uses the browser object renderer rather than per-page rendering;
- audience-window synchronization is not a current canonical learning feature;
- screen recording is not a current canonical learning feature.

## Browser/device support

Chrome/Edge are the best-covered automated targets. Real Safari/iOS and Android Chrome acceptance is still part of issue #83.

Automated Chromium checks do not substitute for device-level touch/audio/accessibility testing.

## Affiliate content

Affiliate infrastructure is implemented, including validated redirect and disclosure flow, but operator-managed destinations/assets must be real, valid, and appropriately licensed before being treated as production-quality recommendations.

Affiliate recommendations belong to parent/public surfaces, not child learning activities.

## Repository governance

The protected `main` branch requires PR-based changes and four required CI contexts. The standalone `Secret history scan` is still not directly listed as a ruleset-required context, but PR #269 closed the enforcement gap by running the same pinned full-history Gitleaks scan inside ruleset-required `Production dependency audit`. A secret-scan failure therefore fails a required context and blocks merge.

Remaining governance limitations include approving-review count = 0 and `Mobile route QA (Chromium)` not being directly listed as a required ruleset context. Secret-scan enforcement itself is no longer an open limitation.

## OCR / AI

General OCR/AI learning support is planned, not production-complete, and is **not a priority before the current product-quality work is closed**.

Any future provider integration must keep secrets server-side, minimize child data, avoid automatic raw-camera uploads, and remain optional to core learning.
