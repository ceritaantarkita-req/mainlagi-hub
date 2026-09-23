# Mainlagi World — Petualangan Uang Social Card — 22 September 2026

Status: **VALIDATED GREEN AT `9f6953302ee82db62a7362288233a77db2251743`**

Branch:

```text
feature/world-petualangan-uang-production-wave-20260922
```

This wave closes the generic social-preview fallback for Petualangan Uang without introducing a new binary asset dependency.

## 1. Dedicated public route

Social-card contract:

```text
src/lib/learning/world/moneyWorldSocial.ts
MONEY_WORLD_SOCIAL_CARD_VERSION = money-world-social-card-v1
```

Renderer:

```text
src/app/worlds/money-festival/social-card/route.tsx
```

Stable public path:

```text
/worlds/money-festival/social-card
```

The route returns a **1200 × 630 PNG** through `ImageResponse`.

## 2. Public-safe contract

The card contains only public World presentation information:

- Mainlagi World identity;
- Petualangan Uang title;
- Gavi + Paca current runtime identity;
- eight-Stage / story / mini-game framing;
- Festival payoff language.

It contains no:

- child name;
- child ID;
- account ID;
- exact child age;
- progress state;
- mastery;
- attempt history;
- private child route.

The contract carries explicit `publicSafe`, `containsChildProgress=false`, and `containsAccountIdentity=false` fields and validates them statically.

## 3. Metadata integration

`/worlds/money-festival` now uses the dedicated card for both:

```text
og:image
twitter:image
```

The previous generic fallback:

```text
/og/math-warung.png
```

is no longer used by Petualangan Uang metadata.

The social description also follows the currently active presentation identity:

```text
Gavi + Paca
```

rather than advertising paused Gian/Naya production artwork.

## 4. Why the card is generated

The social card is generated at the dedicated route rather than committed as another binary PNG.

Benefits:

- deterministic 1200 × 630 output;
- no duplicate binary artifact to manually keep in sync;
- title/copy can stay tied to the repository contract;
- no external image-generation/provider dependency;
- no child/account data can be interpolated at runtime;
- normal Next production build/route QA validates the renderer.

This does not block a future bespoke illustrated binary card if the final Gian/Naya visual identity is later resumed and approved.

## 5. Asset-plan status

`public-share-card` moves from:

```text
temporary-runtime
```

to:

```text
production-ready
```

Current source:

```text
dynamic ImageResponse route /worlds/money-festival/social-card
```

The remaining explicit production gaps are therefore:

```text
fixed-narration
gian-foreground
naya-foreground
```

Character production remains paused, and fixed narration remains 0/88 approved.

## 6. QA gates

Static World QA verifies:

- social-card contract version;
- 1200 × 630 dimensions;
- public-safe flags;
- no private/progress terminology;
- public landing metadata uses the dedicated contract;
- generic `/og/math-warung.png` fallback is absent from the World page;
- the route uses `ImageResponse`;
- the route does not contain child/account/mastery identifiers.

Browser QA verifies:

- public World landing remains unauthenticated/public-safe;
- Open Graph metadata points to the dedicated route;
- Twitter metadata points to the same route;
- social description matches current Gavi/Paca presentation;
- the social-card route returns HTTP 200;
- content type is PNG;
- returned image payload is non-trivial.

## 7. Boundary

This wave does not:

- resume Gian/Naya production;
- create fixed narration audio;
- change Stage/Scene/Segment IDs;
- change progress or completion semantics;
- change Belajar;
- touch Bermain/motion;
- activate World -> Evidence;
- modify database schemas.

## 8. Green validation / checkpoint

Exact validated head:

```text
9f6953302ee82db62a7362288233a77db2251743
```

Draft PR / CI:

```text
PR #282
Mainlagi TV V3 CI #1391
run 35716360918

Quality gate (Ubuntu):        PASS
Windows compatibility:        PASS
Production build:             PASS
Production dependency audit:  PASS
Secret history scan:          PASS
Mobile route QA (Chromium):   PASS
overall:                      SUCCESS
```

Relevant CI artifact:

```text
mobile-route-qa-screenshots
artifact id 10689696970
```

Frozen immutable checkpoint:

```text
checkpoint/world-petualangan-uang-social-green-20260922
@ 9f6953302ee82db62a7362288233a77db2251743
```

Do not move or force-push that checkpoint branch.

PR #282 remains Draft and is not merge authorization. PR #272 remains untouched.
