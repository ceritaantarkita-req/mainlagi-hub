# Mainlagi Art Bible — v1

Status: **CANONICAL VISUAL DIRECTION / SUBJECT BACKGROUNDS LIVE VERIFIED / CHARACTER PRODUCTION NEXT**  
Established: **16 September 2026**  
Last synchronized: **21 September 2026**  
Source audit: `PRODUCTION_VISUAL_PRODUCT_BASELINE_2026-09-16.md`

This document defines the visual language that future Mainlagi product work must converge toward. It does **not** require a one-shot rewrite of every existing screen. Migration is wave-based, evidence-backed and must preserve learning/progression/auth behavior.

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

Use the same Mainlagi family, but calmer and denser than child gameplay. Keep cream/white surfaces, navy ink, green primary actions, restrained sky/sage accents and consistent rounded geometry. Avoid enterprise-dashboard styling and avoid isolated generic utility dialogs that feel unrelated to the family product.

Accepted VUI-03 precedent:
- auth routes may own the viewport when they already provide their own Mainlagi family navigation/context, preventing duplicate public + auth shells;
- family auth may use a contextual Garden panel beside a focused form/status panel on desktop, stacking on phone/tablet where needed;
- account settings may use a calmer two-column family card grid at tablet/desktop and one column on phone;
- visual migration must not alter session, recovery, validation or redirect semantics.

Accepted VBASE-P1-01 precedent:
- account subpages should reuse a scoped family shell rather than falling back to unrelated generic utility cards;
- an empty/stub route must not render a visually false blank card merely to satisfy structural consistency;
- system states such as not-found should use Mainlagi color/type/control language while preserving exact HTTP and navigation behavior;
- visual convergence must not invent account/security functionality that does not exist.

### Public / clean-session entry

The public root must explain the product before assuming child mode. A clean session should make it obvious that Mainlagi is for families with children 3–7, provide a clear child-start action and a distinct parent/account action, and explain that movement-camera play is optional without inventing privacy/security claims that the product cannot substantiate.

Known-child fast resume remains desirable and may bypass the public landing when a valid active child is already known.

Accepted VUI-03 precedent: clean-session root uses the public/family navigation and Garden family hero; it must not force the child `PlayroomShell` before a child profile is selected.

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
coral                  #e46c49
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
- Auth/public utility pages should use wide-screen space to provide context, not center a tiny isolated card in a large empty canvas.

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

VUI-03 precedent: public child/parent CTAs and auth controls are permanently guarded at >=44px height.

## 9. Cards

### Child cards

Use friendly icon/illustration, clear title, minimal metadata and an obvious status/progress signal.

### Parent cards

Use fewer cards with stronger grouping. Prefer a summary statement first, supporting metric second, technical detail behind disclosure or lower hierarchy.

VUI-01 establishes the accepted family-report example: weekly summary first, evidence-based patterns second, grouped subject detail third, diagnostics behind disclosure.

### Stage / lesson cards

Must communicate at least one of: progress, readiness, recommendation, completion or lock reason. Do not present repeated white rectangles with equal emphasis if their states differ.

Accepted VUI-02 rules:
- stage title/subtitle and readiness may share one major Garden panel when this makes current state easier to read;
- readiness visual emphasis must use existing readiness data and may not invent or weaken a progression gate;
- lesson title/objective/progress should form a clear group before activity cards;
- lesson card count must follow usable width **and actual item count**, not a global fixed 3/4-column grid;
- for one to three stage activities, content-aware layouts such as `auto-fit` are preferred when they prevent accidental empty canvas;
- recommendation may receive visual emphasis, but canonical recommendation source and activity ordering must remain unchanged;
- optional motion must remain visually distinguishable from required learning steps.

### Auth cards / family utility panels

Auth surfaces should not look like a generic product bolted onto Mainlagi. A login/signup/forgot/reset/callback panel should share family typography, cream/white surfaces, green actions, navy text, visible focus states and restrained Garden context. The visual shell may change; Supabase operations, validation, recovery and redirect semantics must not change unless separately justified and tested.

Accepted VUI-03 desktop pattern is a contextual family/Garden panel plus a focused form/status panel; at narrower widths the panels stack rather than shrink into unreadable columns.

### Account/settings cards

Use restrained family utility cards with clear icon, title and short purpose. Do not compress a desktop account surface into one narrow column when usable width allows two readable columns. Destructive actions may receive restrained danger styling but must not dominate the page.

Accepted VBASE-P1-01 rules:
- account profile/player/preferences/security/delete/about routes share family shell vocabulary;
- route content may remain a genuine stub, but the shell must not imply missing content with a decorative empty card;
- destructive and utility states remain calmer than child gameplay and preserve existing account semantics.

## 10. Icons and symbols

Priority:
1. Mainlagi `LearningSymbol` for learning concepts/runtime;
2. Mainlagi `Icon` for navigation/product controls;
3. artwork/character assets for illustration;
4. emoji only as decoration/content, not the primary semantic icon for permanent navigation or analytics.

Do not mix several unrelated icon styles in one surface.

VUI-03 public child/parent path icons use canonical `Icon` assets rather than raw semantic emoji/text symbols.

## 11. Characters and artwork

Gavi/Paca and approved Garden artwork are brand assets, not filler.

Use characters when they:
- welcome/encourage;
- explain a next step;
- provide visual balance around a child task;
- mark rewards or celebration.

Do not place characters where they obstruct choices, reading surfaces, canvas or motion tracking.

Adult surfaces may use smaller/restrained character presence to preserve family continuity. Public/auth character use should support context, not make parent flows feel like child gameplay.

### Canonical five-character production contract

Canonical identities are intentionally narrow:

- **Naya** — older sister figure, approximately 8, wears hijab; warm and encouraging.
- **Gian** — boy, approximately 5; active, curious and playful.
- **Zia** — girl, approximately 3; expressive and beginner-friendly.
- **Paca** — friendly male-coded robot; hints, system guidance and discovery.
- **Gavi** — orange cat; humor, rewards and reactions.

Do not invent unsupported biography, hobby, hairstyle, clothing details beyond Naya's documented hijab, family relationship, or personality traits merely to make generated art more specific.

Current production-asset truth:

```text
Paca  -> public/artwork/garden-paca.webp       production asset exists
Gavi  -> public/artwork/garden-gavi.webp       production asset exists
Naya  -> no production file in public/artwork  fallback representation only
Gian  -> no production file in public/artwork  fallback representation only
Zia   -> no production file in public/artwork  fallback representation only
```

The next character-production wave must preserve the Garden style and define/review, at minimum:

- stable silhouette and age-readable proportions;
- front, three-quarter and back reference views;
- neutral, happy/encouraging, curious/focused and celebration expressions where appropriate;
- canonical palette slots and clothing continuity;
- consistent outline/stroke language with Paca/Gavi and Garden artwork;
- transparent-background export for reusable character placement;
- small-avatar legibility and full-body scene legibility;
- pose/motion constraints that do not obstruct learning controls;
- provenance/rights record before public-repository production use.

#### Reviewed human-character identity lock

The 21 September reviewed design sheets are the canonical visual identity references for the first human-character production pass:

- `kak-naya-character-design-set-v1.png`;
- `gian-character-design-set-v1.png`;
- `zia-character-design-set-v1.png`.

Visible traits that production assets must preserve:

**Naya**
- pink hijab with a darker inner face-framing layer; hair remains fully covered;
- pink long-sleeve top with a simple white flower motif;
- blue wide-leg trousers;
- pink sneakers with white sole/details;
- large dark-brown eyes, rounded child face and soft rosy cheeks;
- tallest/oldest-readable silhouette of the human trio.

**Gian**
- black side-swept hair with the small top/side tuft shown in the sheet;
- white shirt with blue raglan sleeves and the blue car motif;
- blue shorts;
- white socks and blue sneakers;
- large dark-brown eyes, rounded child face and rosy cheeks;
- middle-height silhouette: younger/smaller than Naya, older/taller than Zia.

**Zia**
- black hair in two rounded side buns with pink ties and straight bangs;
- purple short-sleeve dress with a simple white flower motif;
- white socks and purple shoes;
- large dark-brown eyes, rounded toddler face and rosy cheeks;
- shortest/youngest-readable silhouette of the human trio.

The design sheets also contain alternate expressions, gestures, poses and props. Those are **reference options**, not automatically canonical runtime requirements. Props such as books, toys, sports items, magnifiers or bags must not become permanent identity features unless a later product decision explicitly approves them.

#### Activity production export contract

For the first activity-foreground production asset of Naya, Gian and Zia:

- one isolated full-body character per file;
- transparent background / alpha preserved;
- no text, labels, floor shadow, scenery or baked-in task content;
- neutral-friendly or lightly encouraging pose suitable for repeated use;
- feet/body fully inside the canvas with no clipped hijab, hair, hands or shoes;
- consistent foot baseline and transparent padding so Naya > Gian > Zia remains visibly age-readable when the shared activity slot renders them;
- preserve the reviewed outfit, face, palette and hairstyle/hijab identity above;
- optimize the reviewed production derivative for web delivery without flattening transparency;
- do not activate the file until provenance/redistribution and responsive screenshot review are complete.

Planned public runtime naming convention, if redistribution is approved:

```text
public/artwork/characters/naya-activity-v1.webp
public/artwork/characters/gian-activity-v1.webp
public/artwork/characters/zia-activity-v1.webp
```

These paths are a production convention only; their presence in a branch does not imply approval. Runtime activation is controlled separately by the canonical character asset registry.

Generated candidates are **review material**, not production truth. A visually plausible image is not approved until identity consistency, asset quality and redistribution/provenance requirements are satisfied.

Child profile identity and guide-character identity are separate concepts. Never use a guide character as the child's actual profile identity by default.

The current Coloring content contract remains separate: existing coloring-character support is Paca/Gavi only. This Art Bible does not authorize new Naya/Gian/Zia coloring activities or evidence changes.


### Activity foreground character contract

Detailed execution source: [`CHARACTER_PRESENTATION_SYSTEM.md`](CHARACTER_PRESENTATION_SYSTEM.md).

- Characters are a foreground presentation layer and remain separate from gameplay background art.
- Activity renderers must not hardcode character asset paths; one central presentation resolver owns runtime character selection.
- A preferred character cannot render until its production asset is explicitly approved.
- Unapproved human-character preferences fail closed to approved mascot artwork rather than using design sheets or fallback emoji as full-size activity art.
- Naya/Gian/Zia design sheets are identity references only; production activity assets require isolated transparent full-body files.
- Creative Coloring/Drawing workspaces may suppress decorative foreground characters when they compete with the canvas/tools.
- Child profile identity and guide-character identity remain separate from activity presentation.
- Character presentation must not change activity identity, answers, evidence, mastery, progression or narration semantics.

### Subject background / scene contract

Detailed execution source: [`SUBJECT_BACKGROUND_SYSTEM.md`](SUBJECT_BACKGROUND_SYSTEM.md).

- A subject uses a small reusable scene family, not one identical Garden background and not 100 one-off backgrounds.
- Production now covers **9 subjects / 54 scene families / 108 responsive WebP assets**.
- Backgrounds remain decorative and sit behind a separate gameplay-safe UI layer.
- Keep central gameplay space quiet; place major decorative context near edges; protect header/title and bottom controls.
- Never bake answers, task text, progress, assessment evidence or interactive-looking fake controls into scenery.
- Wide/mobile scene pairs are separately art-directed; mobile is not treated as a blind crop.
- Scene resolution is deterministic and data-driven through the central subject/theme resolver.
- Normal gameplay keeps character art as separate foreground layers; do not bake Naya/Gian/Zia/Paca/Gavi into gameplay scenery.
- Creative Coloring/Drawing workspaces keep their subject environment visible behind the canvas/tools.
- Visual changes must not alter curriculum, answers, mastery, evidence, progression, activity order or runtime semantics.
- The 21 September project-owner production preview represents all nine subjects and is recorded in `SUBJECT_BACKGROUND_PRODUCTION_PREVIEW_REVIEW_2026-09-21.md`.
- Future replacement artwork returns to review status until visual acceptance and provenance/redistribution checks are complete.

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

Auth status/error copy must remain readable and must not be visually confused with ordinary helper text.

## 13. Navigation

### Child

Navigation should be minimal and predictable. Activities hide global navigation when focus is required. Back must have an accessible name even when only an icon is visible.

For subject stage journeys:
- phone may use a compact horizontal carousel; showing a partial next card is acceptable as a deliberate scroll affordance when current card remains fully readable;
- tablet/desktop should normally expose stage choices without an internal horizontal scroller when usable width is sufficient;
- changing journey layout must not change stage order, stage status or destination routes.

### Parent/public

Navigation may be broader, but should remain clearly separated from child mode. Parent settings/report/account should not feel like hidden child controls.

### Root entry

Known-child fast resume is desirable. First-time/signed-out visitors need a deliberate adult/family entry with a clear path to start/select a child profile and a distinct path to parent/account controls.

Accepted VUI-03 behavior:
- clean session uses public navigation and family hierarchy;
- a valid remembered child still fast-resumes through the existing child destination logic;
- public root must not wrap itself in child `PlayroomShell` before profile selection.

### Auth navigation

A family auth route may be immersive if its own shell contains the Mainlagi brand and a clear route back to public entry. Avoid duplicate public navbar + auth brand stacks. Account pages may retain the public/family navigation where it improves orientation.

## 14. Responsive baseline

Permanent visual QA must cover at least:

```text
390x844   phone portrait
768x1024  tablet portrait
1280x800  desktop/laptop
```

Use 320px width additionally for high-risk child/activity flows. Motion-game QA must include suitable landscape viewports.

Rules:
- no horizontal page overflow;
- CTA and current task must remain discoverable without layout ambiguity;
- tablet/desktop must use available space intentionally, not merely stretch mobile whitespace;
- navigation must not cover content;
- cards should reflow based on readable width, not fixed desktop assumptions;
- a layout is not accepted merely because it does not overflow: pathological word wrapping, clipped internal scrollers, cramped columns or visibly poor hierarchy are visual failures;
- column count must follow **usable content width after sidebars/padding** and actual content count, not viewport width alone;
- internal horizontal scrolling should be intentional and device-appropriate, not an accidental consequence of desktop card widths;
- public/auth desktop layouts should use contextual composition rather than leaving the primary panel floating alone in excessive empty space.

VUI-01 precedent: report metrics are one column on phone, 2+1 at 768 because the parent sidebar reduces usable width, and three columns on 1280.

VUI-02 precedent: subject journey stays horizontal on 390 as an intentional carousel, but switches to grid at tablet/desktop; stage lessons with two activities expand to two broad columns rather than occupying two cells of a fixed four-column desktop grid.

VUI-03 precedent: public hero uses wide desktop context, account settings become two columns at tablet/desktop, and auth uses two contextual panels on wide desktop while stacking at <=820px.

VBASE-P1-01 precedent: all migrated account/system surfaces are permanently evidenced at 390 / 768 / 1280; manual screenshot review remains mandatory even when structural no-overflow checks pass.

## 15. Copy rules

Child copy:
- short;
- concrete;
- action-oriented;
- no engineering or assessment jargon.

Parent copy:
- explain what happened and what to do next;
- preserve truthfulness of evidence/mastery;
- translate internal analytics vocabulary into normal parent language in primary UI;
- technical labels may appear in diagnostic/detail views.

Public copy:
- explain what Mainlagi is and who it is for;
- distinguish child play from parent/account controls;
- explain that movement-camera play is optional when relevant;
- do not state privacy/security guarantees that are not implemented or documented.

Auth copy:
- use normal family-facing language;
- preserve exact validation/error meaning;
- do not hide account/session consequences behind playful wording.

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

Native elements such as `<progress>` are preferred when they accurately express canonical state without replacing existing semantics.

## 17. Visual regression rules

A visual change is not accepted solely because build/lint passes.

Permanent representative screenshots must cover public, child shell, subject/gallery, stage, representative activities, rewards, parent, account/auth and system states. Tests must assert expected pathname so a progression redirect cannot count as screenshot PASS.

Visual acceptance requires:
- no clipping/overflow;
- hierarchy readable at actual screenshot scale;
- interactive controls fully visible and correctly labeled;
- state screenshots show intended differences;
- source/content semantics remain unchanged unless the change explicitly targets content/copy;
- automated structure checks **and** manual screenshot review agree that the layout is usable.

The live permanent gate now operationalizes this with **63 exact-path captures across 21 canonical routes** at 390x844, 768x1024 and 1280x800 plus a machine-readable manifest. The production-live strengthening was verified on main `2d3f95066e1106c43c76bf91dd29bf5707dca52c`, CI #788 including exact Cloudflare release smoke.

VUI-01 adds a product-level regression: Parent Report primary layer must not leak guarded internal analytics vocabulary; diagnostic disclosure may retain technical terms.

VUI-02 adds geometry regressions on canonical Math subject/stage routes: tablet/desktop stage journey may not require internal horizontal scrolling, stage lesson cards must retain readable widths, readiness summary must exist and exactly one canonical recommendation remains visually marked.

Accepted VUI-03 regressions add:
- clean-session family/public marker;
- exactly one child CTA and one parent CTA plus optional-camera copy;
- >=44px public CTA target height;
- auth family shell/context/panel markers;
- expected login/signup/forgot/reset form mode and >=44px controls;
- callback error family status;
- account family/settings markers, seven canonical settings destinations and readable account card geometry.

Accepted VBASE-P1-01 regressions add:
- shared account-section shell/panel markers on all six migrated account subpages;
- readable tablet/desktop account-section panel geometry;
- preferences control-count and >=44px target guard;
- reset-password auth form mode in the permanent baseline;
- canonical not-found system-state and CTA markers;
- exact HTTP 404/path protection for not-found;
- manual screenshot review as a release requirement for changed surfaces, with #780 as the concrete negative precedent.

## 18. Migration policy

Do not replace all existing CSS at once.

Migration order/history:
1. permanent visual-baseline QA;
2. parent report;
3. stage/gallery;
4. public/auth/account;
5. residual P1 token consolidation;
6. game shell/preflight;
7. lower-priority legal/utility convergence;
8. broader technical cleanup after visual behavior is stable.

Steps 1–5 are closed/live verified. Steps 6–8 remain later work and must be prioritized against gameplay, external acceptance and governance needs.

Every migration wave gets its own browser screenshots, exact-scope regression and production verification.

## 19. Non-goals

This Art Bible does not authorize:
- changing curriculum answers or learning objectives for visual reasons;
- weakening readiness/mastery gates to make screenshots easier;
- changing adaptive recommendation ranking merely to make a highlighted card convenient;
- reordering lessons/activities for visual symmetry without a learning reason;
- changing auth/session/security behavior merely to simplify public/auth presentation;
- deleting known-child fast resume merely so public root always displays;
- inventing privacy or camera guarantees not backed by implementation;
- inventing account/security capabilities for visual completeness;
- replacing Iqro expert review;
- mass-generating decorative assets without provenance;
- converting all parent metrics into gamified scores.

## Current acceptance

Garden representative activities: **ACCEPTED anchor**.  
Visual P1 checkpoint: **ACCEPTED / LIVE VERIFIED**.  
Permanent visual QA gate: **21 routes / 63 exact-path captures / BLOCKING**, verified on main `2d3f95066e1106c43c76bf91dd29bf5707dca52c`, CI #788 including exact Cloudflare release smoke.  
Parent Report VUI-01: **FULLY CLOSED on main `e212002e...`, CI #758**.  
Stage/Gallery VUI-02: **FULLY CLOSED on main `fe260ba7...`, CI #764**.  
Public/Auth/Account VUI-03: **FULLY CLOSED on main `415008a4...`, CI #776**.  
Residual visual-token VBASE-P1-01: **FULLY CLOSED on main `2d3f95066...`, CI #788**.  
Current verified-production baseline: **P0=0 / P1=0 / P2=3**.  
P2 game-shell/icon/inline-style work remains open and must not be described as complete.  
Pattern #38: **UNBLOCKED FOR FRESH OBJECTIVE/EVIDENCE AUDIT ONLY; no mechanic is pre-approved**.