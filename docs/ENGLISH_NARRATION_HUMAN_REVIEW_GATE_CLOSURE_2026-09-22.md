# English Narration Human-Review Gate Closure — 22 September 2026

Status: **CLOSED / MERGED / LIVE VERIFIED**

This is the final engineering closure record for the fail-closed human-review evidence gate that sits between local/server-side four-item narration generation and any later production-asset approval.

## 1. Closure checkpoint

```text
implementation PR:             #285
exact PR head:                 6e2a22057abb59c4bf6fc0f3298cd92e32de6463
exact-head PR CI:              #1412 / run 35724918622 — FULL SUCCESS
merged main:                   dd84579624212b387a4e54dc93a5892c04de83d6
merged-main CI:                #1415 / run 35725713601 — FULL SUCCESS
Cloudflare production smoke:   SUCCESS
```

Merged-main production smoke proved:

```text
release SHA:       dd84579624212b387a4e54dc93a5892c04de83d6
branch:            main
site:              https://mainlagihub.my.id
backend:           supabase
Supabase target:   canonical production project
```

## 2. What PR #285 closed

The merged gate adds:

- `scripts/review-english-narration-pilot.mjs`;
- `scripts/run-english-narration-pilot-review-tests.mjs`;
- `npm run pilot:narration:review`;
- `npm run test:assets:narration-pilot-review`;
- permanent inclusion of the review regression in `npm run validate:assets`;
- canonical documentation for the review contract.

The gate validates, before trusting any human review:

- exact provider/model/voice candidate identity;
- exact four pilot activity IDs and transcripts;
- canonical local candidate path;
- MP3 structure and minimum size;
- byte count;
- SHA-256 against the generation manifest;
- production registry lifecycle still `review-required`;
- review sheet bound to exact manifest SHA-256 and exact candidate SHA-256 values.

Completed human review requires:

- reviewer identity;
- valid review timestamp;
- explicit `listenedToExactFiles=true`;
- exact-word fidelity;
- pronunciation;
- child-learning pace;
- audio cleanliness.

An `accepted` decision requires **16/16 rubric checks to pass** across the four exact activities.

## 3. What the gate deliberately cannot do

A human-accepted local candidate set is **not production approval**.

The review tool cannot:

- mutate the 27-slot production narration registry;
- change any registry lifecycle to approved;
- copy candidate MP3 files to `public/audio/narration/en/`;
- select a permanent provider;
- perform final rights/commercial/redistribution approval;
- implement the required AI-voice disclosure surface;
- activate static narration playback;
- change browser fallback behavior.

## 4. Verification evidence

PR CI #1412 passed:

- Quality gate (Ubuntu);
- Windows compatibility;
- Secret history scan;
- Production dependency audit including the required full-history secret gate;
- Mobile route QA (Chromium), including canonical route/accessibility/lazy-load matrix and permanent visual product baseline;
- Production build.

Merged-main CI #1415 passed the same blocking matrix plus exact Cloudflare production smoke.

No Mainlagi World, character-development, WS-05 gameplay, learning evidence, mastery, progression, schema, stage ownership, choices, answers, or activity identity contract changed.

## 5. Current narration truth

```text
English listening activities reviewed:       27
target-first:                                22
sentence-level comprehension:                5
production registry slots:                   27
review-required registry slots:              27
generated four-item pilot audio:              0
human-reviewed generated pilot audio:         0
approved production narration assets:         0
production narration binaries:                0
static-audio runtime activation:               0
browser speechSynthesis fallback:              preserved
```

The engineering review gate is closed. The **audio pilot is still open** because no actual provider candidate audio has yet been generated or listened to.

## 6. Next safe execution

Resume only with the exact four-item pilot:

```text
english-listen-bird
english-listen-letter-a
english-listen-phrase-blue-book
english-detail-red-ball
```

Safe sequence:

1. keep `OPENAI_API_KEY` only in an authorized local/server environment;
2. generate `marin` candidates under gitignored `internal/`;
3. optionally generate `cedar` for direct comparison;
4. verify exact candidate integrity with the merged review tool;
5. create the non-overwriting review sheet;
6. listen to the exact MP3 files;
7. record and validate the human decision;
8. only after acceptance, perform a separate provider-rights/provenance production-approval wave;
9. runtime static-audio activation remains a separate later wave.

Do **not** bulk-generate all 27 yet.

## 7. Preserved project boundaries

- **Mainlagi World: DO NOT TOUCH.**
- **Character production/development: PAUSED.**
- WS-05 Logic repeating-pattern reuse: **CLOSED / LIVE VERIFIED**.
- Preserve 9 subjects / 900 activities / 47 active gameplay patterns.
- No Pattern #48.
- No provider credentials in client/browser source, docs, commits, or public logs.
- Human listening remains mandatory before production approval.
- Production approval remains separate from runtime activation.
