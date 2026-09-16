# Mainlagi Art Bible — v1

Status: **CANONICAL VISUAL DIRECTION / MIGRATION IN PROGRESS**  
Established: **16 September 2026**  
Source audit: `PRODUCTION_VISUAL_PRODUCT_BASELINE_2026-09-16.md`

This document defines the visual language that future Mainlagi product work must converge toward. It does **not** require a one-shot rewrite of every existing screen. Migration is wave-based, evidence-backed and must preserve learning/progression behavior.

## 1. Product feeling

Mainlagi should feel:

- warm, playful and calm rather than noisy;
- child-friendly without looking babyish;
- trustworthy for parents without turning into a generic SaaS dashboard;
- tactile and obvious on touch devices;
- visually consistent across child, parent and public surfaces;
- focused on one clear next action at a time.

The accepted Garden activity direction is the child-facing anchor.

## 2. Surface families

### Child learning / play

Use the fullest Garden expression: cream paper, sky/grass environment, friendly rounded cards, character artwork, large controls and Nunito typography.

### Parent / family / account / auth

Use the same Mainlagi family, but calmer and denser than child gameplay. Keep cream/white surfaces, navy ink, green primary actions, restrained sky/sage accents and consistent rounded geometry. Avoid enterprise-dashboard styling.

### Motion-game runtime

A dark functional camera stage is allowed when it improves body tracking, contrast and safety. Entry, setup, pause, result and exit surfaces must still use Mainlagi navigation, type and control language.

### Admin / diagnostics

May be denser and more utilitarian. Admin styling must not leak into child/parent-facing routes.

## 3. Canonical colors

Primary product tokens:

```text
paper                 #fffcf0
ink                   #193b55
ink-green             #164b43
primary-green         #287158
primary-green-pressed #195541
sky                   #d5eef6
sage                  #dbe6c8
soft-sage             #e5edd9
coral                 #e46c49
yellow                #ffdb7d
soft-coral            #ffc6ac
soft-blue             #d0e4ee
white-card            #fffef8
border-soft           #e1e5d7
```

Rules:

- Default page/background is cream/paper, not cold blue-gray.
- Primary CTA is green unless a runtime has a strong semantic reason otherwise.
- Navy/ink is the default text color.
- Sky, sage, yellow and coral are support/accent colors, not competing primary CTAs.
- Success/wrong states must use text/icon semantics in addition to color.
- Avoid introducing new brand colors when an existing token is sufficient.

## 4. Typography

### Primary family

`Nunito Variable` is the default Mainlagi product UI family for child and family-facing product surfaces.

### Fallback / language support

`Noto Sans Variable` remains the general fallback and may be used where script shaping, legal density or platform coverage requires it. Arabic/Iqro text must preserve appropriate native shaping and readability; never force display typography onto Arabic glyphs.

### Hierarchy

```text
Display / child task title   36–64px depending viewport and text length
Page H1                      32–48px desktop/tablet; 30–40px phone
Section H2                   22–30px
Card title                   16–20px
Body                         15–18px
Metadata                     12–14px
```

Rules:

- No essential product copy below 12px.
- Child-answer controls should normally be 18px or larger; high-salience symbol/letter activities may be much larger.
- Long technical labels must not inherit oversized display type.
- Avoid excessive all-caps. Eyebrows may use uppercase sparingly.
- Parent copy should translate internal evidence vocabulary into normal family language; diagnostics can retain technical terminology.

## 5. Spacing system

Canonical rhythm:

```text
4, 8, 12, 16, 24, 32, 48, 64
```

Rules:

- Prefer 16–24px internal card padding.
- Section separation should normally be 24–40px.
- Do not create large empty desktop regions unless they improve task focus.
- Mobile content must respect safe areas.
- Child task composition should fit the primary decision and feedback state without unnecessary scrolling whenever feasible.

## 6. Radius and shape

```text
small controls / tags        10–14px
buttons / inputs             14–18px
cards                        20–24px
hero / major Garden panels   28–30px
pills                        999px only for true pill semantics
```

Playful asymmetry is allowed for decorative child icons/blobs, not for every product surface.

## 7. Elevation

Use soft, low-contrast shadows. Mainlagi should feel layered, not floating like a dashboard template.

Recommended pattern:

```text
small card    0 4px 0 rgba(...very light...) or subtle 0 6px 18px
raised card   0 8px 24px rgba(44,73,94,.07)
hero          0 12px 30px rgba(...,.08)
```

Avoid heavy black shadows and excessive glassmorphism.

## 8. Buttons and touch targets

Minimum interactive target: **44x44px**. Recommended child target: **52–56px+**.

### Primary

Green filled button, high contrast, clear action verb, one primary action per local decision area.

### Secondary

Cream/white surface with visible border and navy/green text.

### Tertiary

Text/icon control only when the target remains >=44px and hierarchy is obvious.

Rules:

- Avoid multiple equally loud primary buttons.
- Disabled state must remain readable and not appear interactive.
- Hover is enhancement only; touch state must stand alone.
- Focus-visible outline is mandatory.

## 9. Cards

### Child cards

Use friendly icon/illustration, clear title, minimal metadata and an obvious status/progress signal.

### Parent cards

Use fewer cards with stronger grouping. Prefer a summary statement first, supporting metric second, technical detail behind disclosure or lower hierarchy.

### Stage / lesson cards

Must communicate at least one of: progress, readiness, recommendation, completion or lock reason. Do not present repeated white rectangles with equal emphasis if their states differ.

## 10. Icons and symbols

Priority:

1. Mainlagi `LearningSymbol` for learning concepts/runtime;
2. Mainlagi `Icon` for navigation/product controls;
3. artwork/character assets for illustration;
4. emoji only as decoration/content, not the primary semantic icon for permanent navigation or analytics.

Do not mix several unrelated icon styles in one surface.

## 11. Characters and artwork

Gavi/Paca and approved Garden artwork are brand assets, not filler.

Use characters when they:

- welcome/encourage;
- explain a next step;
- provide visual balance around a child task;
- mark rewards or celebration.

Do not place characters where they obstruct choices, reading surfaces, canvas or motion tracking.

Adult surfaces may use smaller/restrained character presence to preserve family continuity.

## 12. Feedback states

Every assessed child interaction needs visually distinct:

- idle;
- selected/pending where relevant;
- wrong/try again;
- success/completed;
- disabled/locked where relevant.

Do not encode state by color alone. Maintain readable copy/iconography and stable layout so feedback does not cause unexpected jumps.

Parent/system surfaces additionally require:

- loading;
- empty;
- error;
- degraded/offline when applicable;
- success/confirmation.

## 13. Navigation

### Child

Navigation should be minimal and predictable. Activities hide global navigation when focus is required. Back must have an accessible name even when only an icon is visible.

### Parent/public

Navigation may be broader, but should remain clearly separated from child mode. Parent settings/report/account should not feel like hidden child controls.

### Root entry

Known-child fast resume is desirable. First-time/signed-out visitors still need a deliberate adult/public entry with a clear path to start/create/select a child profile.

## 14. Responsive baseline

Permanent visual QA must cover at least:

```text
390x844   phone portrait
768x1024  tablet portrait
1280x800  desktop/laptop
```

Use 320px width additionally for high-risk child/activity flows. Motion-game QA must include suitable landscape viewports.

Rules:

- no horizontal overflow;
- CTA and current task must remain discoverable without layout ambiguity;
- tablet/desktop must use available space intentionally, not merely stretch mobile whitespace;
- navigation must not cover content;
- cards should reflow based on readable width, not fixed desktop assumptions.

## 15. Copy rules

Child copy:

- short;
- concrete;
- action-oriented;
- no engineering or assessment jargon.

Parent copy:

- explain what happened and what to do next;
- preserve truthfulness of evidence/mastery;
- translate `attempt`, `assessed`, `qualifying evidence`, etc. into normal parent language in the primary UI;
- technical labels may appear in diagnostic/detail views.

Public copy:

- explain what Mainlagi is, who it is for, why it is useful and what camera/data expectations are;
- distinguish child play from parent controls.

## 16. Accessibility

- semantic headings/landmarks;
- accessible names for icon-only controls;
- keyboard reachable primary flows;
- focus-visible state;
- minimum target size;
- text/icon support for color states;
- reduced-motion support;
- native/script-correct text rendering;
- avoid drag-only requirements where an accessible alternative is feasible.

## 17. Visual regression rules

A visual change is not accepted solely because build/lint passes.

Permanent representative screenshots must cover public, child shell, subject/gallery, stage, representative activities, rewards, parent, account/auth and system states. Tests must assert the expected pathname so a progression redirect cannot count as a screenshot PASS.

Visual acceptance requires:

- no clipping/overflow;
- hierarchy is readable at actual screenshot scale;
- interactive controls are fully visible and correctly labeled;
- state screenshots show intended differences;
- source/content semantics remain unchanged unless the change explicitly targets content/copy.

## 18. Migration policy

Do not replace all existing CSS at once.

Migration order:

1. permanent visual-baseline QA;
2. parent report;
3. stage/gallery;
4. public/auth/account;
5. game shell/preflight;
6. lower-priority legal/utility convergence;
7. technical token consolidation after visual behavior is stable.

Every migration wave gets its own browser screenshots, exact-scope regression and production verification.

## 19. Non-goals

This Art Bible does not authorize:

- changing curriculum answers or learning objectives for visual reasons;
- weakening readiness/mastery gates to make screenshots easier;
- inventing new audio/illustration claims;
- replacing Iqro expert review;
- mass-generating decorative assets without provenance;
- converting all parent metrics into gamified scores.

## Current acceptance

Garden representative activities: **ACCEPTED anchor**.  
Whole-product visual system: **MIGRATION REQUIRED**.  
Permanent visual QA gate: **PENDING IMPLEMENTATION**.  
Pattern #38: **BLOCKED until baseline P1 findings are closed**.