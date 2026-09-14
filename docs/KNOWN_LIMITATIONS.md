# Known Limitations

Last reviewed: **14 September 2026**

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

The underlying learning model is stage/progression-based, while the current subject UI can display a broad 100-card gallery with locked or age-ineligible activities visible.

The final child-facing model is not yet resolved. The next product-quality phase must reconcile recommendation, progression, browse-all behavior, and locked-content visibility without weakening evidence/mastery rules.

## Voice and narration

Mainlagi has audio/TTS infrastructure but does **not** yet claim final production-quality native Indonesian and English character narration.

Remaining work:

- provider abstraction;
- reviewed Indonesian and English voices;
- character voice registry;
- voice/model licence and provenance tracking;
- pre-generated reviewed audio for fixed lesson narration;
- runtime TTS only for justified dynamic content.

Iqro/Hijaiyah pronunciation requires competent human review. Generic TTS must not be treated as final pronunciation authority.

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

The protected `main` branch requires PR-based changes and four required CI checks. `Secret history scan` currently runs but is not required by the ruleset, and approving-review count is zero.

This is a governance limitation tracked for hardening; it is not evidence that the current code failed secret scanning.

## OCR / AI

General OCR/AI learning support is planned, not production-complete, and is **not a priority before the current product-quality work is closed**.

Any future provider integration must keep secrets server-side, minimize child data, avoid automatic raw-camera uploads, and remain optional to core learning.
