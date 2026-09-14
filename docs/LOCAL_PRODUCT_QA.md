# Local Product QA

`npm run qa:local:product` is the local product-audit layer for Mainlagi. It is intentionally separate from the permanent release gates: release CI proves engineering contracts, while this command produces product-facing evidence for catalog exposure, user-flow reachability, and visual review.

It does **not** modify production data, Supabase, mastery rules, activity evidence, or UI state in the repository. Generated artifacts stay under `.qa/`, which is gitignored.

## Prerequisites

From WSL/Linux in the repository:

```bash
npm ci
npx playwright install chromium
sudo env "PATH=$PATH" npx playwright install-deps chromium
```

The dependency-install step normally only needs to be done once per WSL image.

## Primary-flow diagnostic

For a quick hydration-safe diagnostic of the canonical fresh-demo path:

```bash
npm run qa:local:flow
```

The diagnostic waits for visible client-rendered links at each step before navigating:

```text
/child/demo-gian/home
→ /child/demo-gian/learn
→ /child/demo-gian/subject/bahasa
→ /child/demo-gian/stage/bahasa-huruf
→ /child/demo-gian/activity/bahasa-cari-a
```

This small command exists so a browser timing/hydration problem in the broader auditor can be distinguished from an actual product dead end. The main product auditor now uses the same hydration-safe navigation behavior rather than immediately treating a not-yet-hydrated stage as empty.

## Run

Full product audit:

```bash
npm run qa:local:product
```

Quick product audit without the 900-activity crawl:

```bash
npm run qa:local:product:quick
```

The commands first run a production Next.js build, then execute the product auditor against a local server.

Default full mode performs:

1. canonical catalog/curriculum integrity audit;
2. subject-level distinction between 100 catalog activities, age-eligible activities, assessed/practice activities, and required-for-stage activities;
3. orphan / duplicate / broken-reference checks across subjects, paths, stages, lessons, packs, skills, and activities;
4. browser checks for major child, parent, games, all 9 subject pages, and all 46 stage pages;
5. a hydration-safe fresh-demo Home → Learn → Subject → Stage → Activity flow check;
6. fresh-demo subject exposure measurements, including unlocked stage links and activity links reachable through those unlocked stages;
7. structural browser smoke for all 900 activity routes at a 390x844 viewport;
8. screenshot capture for the major product surfaces at phone, tablet, and desktop review sizes.

## Output

```text
.qa/
├── product-report.json
├── product-report.md
└── screenshots/
    ├── 390x844/
    ├── 768x1024/
    └── 1440x900/
```

`product-report.md` is the human review entry point. `product-report.json` keeps the same evidence in machine-readable form for future tooling. Each captured screenshot is also recorded with its route, viewport, relative file path, and SHA-256 digest so visual evidence can be identified deterministically.

The report deliberately separates these concepts:

- **catalog activities** — canonical authored inventory;
- **age eligible** — activities valid for the demo child's age;
- **required for stage** — progression-blocking/core activity count;
- **fresh-profile exposure** — activity links a new demo user can actually reach through currently unlocked stages.

This distinction prevents “100 activities exist” from being treated as equivalent to “the child can understand, discover, and reach 100 activities in the current UX.”

## Fast iteration mode

`npm run qa:local:product:quick` is the preferred fast loop when working only on page hierarchy or visual changes and the full 900-route crawl is unnecessary.

The equivalent environment form remains available:

```bash
MAINLAGI_PRODUCT_QA_SKIP_ACTIVITY_CRAWL=1 npm run qa:local:product
```

The catalog audit, major routes, stages, fresh-profile exposure, hydration-safe flow check, and screenshots still run.

The default full crawl uses four browser workers. It can be reduced on a smaller laptop:

```bash
MAINLAGI_PRODUCT_QA_ACTIVITY_CONCURRENCY=2 npm run qa:local:product
```

## Existing server mode

The auditor can target an already-running local instance instead of starting its own Next server:

```bash
MAINLAGI_PRODUCT_QA_BASE_URL=http://127.0.0.1:3000 node scripts/run-local-product-qa.mjs
```

Use this direct form only when the app has already been built/run appropriately. The normal npm scripts remain the canonical workflow.

## Pass/fail semantics

The command exits non-zero for machine-verifiable blockers such as catalog drift, duplicate IDs, missing ownership/specs, broken references, failed primary learning flow after hydration wait, failed browser routes, runtime console/page errors, or horizontal overflow.

Product/UX findings such as low fresh-profile activity exposure are recorded as warnings. They do not automatically fail the build because a heuristic cannot truthfully decide whether a product is attractive, understandable, or pedagogically good.

Screenshot evidence is therefore a required human review input for the next UI/UX teardown rather than an automated “design score.”

## Product truth boundaries

This QA layer must not weaken existing learning contracts. In particular, it does not change mastery progression, assessed-evidence requirements, retry/replay anti-farming, practice/completion-only behavior, Latin trace boundaries, creative completion-only evidence, optional motion, Iqro expert review status, or physical-device acceptance requirements.
