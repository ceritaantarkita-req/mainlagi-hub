# English Narration Provider Pilot — 2026-09-22

Status: **HARNESS CLOSED / MERGED / LIVE VERIFIED / CANDIDATE GENERATION + HUMAN REVIEW OPEN / NOT RUNTIME-ACTIVE**

This document advances the closed English narration asset gate into the next reversible step: a four-item provider/voice pilot. It does **not** select a permanent production provider and it does **not** approve or activate any narration binary.

## 1. Preserved boundaries

- Mainlagi World: **DO NOT TOUCH**.
- Character production/development: **PAUSED**.
- WS-05 Logic `pattern_completion`: closed/live verified.
- Preserve 9 subjects / 900 activities / 47 active gameplay patterns.
- No Pattern #48.
- No changes to choices, correct answers, evidence, mastery, progression, schema, or stage ownership.
- No provider credential may enter client/browser code or the repository.
- No pilot output may enter `public/` before human and provenance approval.
- Pilot generation never updates the production registry automatically.
- Static narration playback remains unimplemented; browser speech fallback remains unchanged.

## 2. Exact pilot sample

The pilot remains exactly:

```text
english-listen-bird
  "Bird."

english-listen-letter-a
  "Letter A."

english-listen-phrase-blue-book
  "A blue book."

english-detail-red-ball
  "The ball is red. What color is the ball?"
```

This covers noun, letter name, short phrase, and sentence-level listening comprehension.

## 3. Provider evidence reviewed on 22 September 2026

### Primary pilot candidate: OpenAI API

The pilot harness uses OpenAI as a **candidate**, not as the production lock.

Official evidence reviewed on 22 September 2026:

- the Speech API supports `gpt-4o-mini-tts`, MP3 output, and voice-control instructions;
- the current guide lists `marin` and `cedar` among built-in voices and recommends them for best quality;
- the model page exposes the pinned snapshot `gpt-4o-mini-tts-2025-12-15`;
- the Services Agreement says the customer owns Output, to the extent permitted by applicable law;
- the API Service Terms explicitly discuss customer **use or distribution of Output**;
- OpenAI's TTS guide requires a clear disclosure to end users that the TTS voice is AI-generated and not a human voice.

Canonical evidence links are stored in `src/lib/data/english-narration-pilot-spec.json`.

Important: this evidence makes OpenAI suitable for a controlled pilot, but it is **not** a legal sign-off for a future public binary. Exact terms must be rechecked on the date a candidate is proposed for production approval.

### Other candidates remain open

Google Cloud Text-to-Speech remains a valid comparison candidate: current documentation supports MP3 and broad English voice options, and says created audio can be used to power applications or augment media subject to Google Cloud terms.

ElevenLabs remains a valid comparison candidate: current documentation states users retain rights to generated audio, while commercial usage requires a paid plan; paid-plan commercial rights are subject to its terms and prohibited-use policy.

No provider is permanently selected by this wave.

## 4. Machine-readable pilot spec

Canonical file:

```text
src/lib/data/english-narration-pilot-spec.json
```

Locked candidate configuration:

```text
provider:        OpenAI
model snapshot:  gpt-4o-mini-tts-2025-12-15
voice candidates: marin, cedar
default voice:   marin
format:          mp3
output root:     internal/english-narration-pilot/openai/
```

`internal/` is already gitignored and is not served by Next.js.

## 5. Generation harness

Canonical script:

```text
scripts/generate-english-narration-openai-pilot.mjs
```

Safe dry run:

```bash
node scripts/generate-english-narration-openai-pilot.mjs
node scripts/generate-english-narration-openai-pilot.mjs --dry-run --voice marin
node scripts/generate-english-narration-openai-pilot.mjs --dry-run --voice cedar
```

Dry-run is the default and performs **no network call and no file write**.

Real local generation is deliberately explicit:

```bash
node scripts/generate-english-narration-openai-pilot.mjs --generate --voice marin
```

The command requires `OPENAI_API_KEY` to already exist in the local/server environment. Never paste the key into source, docs, browser code, CI logs, or a committed `.env`.

The script writes only local candidate files plus a local manifest under `internal/`. It does not write `public/audio/narration/en/`, does not update the provenance registry, and does not touch runtime playback.

## 6. Permanent regression gate

New command:

```bash
npm run test:assets:narration-pilot
```

It proves:

- exact four-item scope;
- exact transcript lock against the 27-slot canonical registry;
- all four remain `review-required`;
- local-only/non-production output contract;
- pinned model snapshot;
- voice allowlist;
- AI-disclosure decision recorded for the candidate;
- default dry-run performs no network call;
- unsupported voice is rejected;
- real generation fails closed when `OPENAI_API_KEY` is missing.

This regression is wired into `npm run validate:assets`.

## 7. Human review gate after generation

A local candidate is still **not approved**.

For both `marin` and `cedar`, listen to the four exact outputs and record:

1. exact-word fidelity / no added or omitted words;
2. pronunciation;
3. letter-name clarity for “Letter A”;
4. natural phrase stress for “A blue book”;
5. comprehension sentence/question separation;
6. child-learning pace;
7. warmth without exaggerated character acting;
8. consistency across the four samples;
9. absence of clipping, silence tails, artifacts, or strange prosody.

Only after a human chooses an acceptable candidate may a later approval change update matching registry records, compute final SHA-256, deliberately add reviewed MP3s, and pass the existing provenance gate.

## 8. Runtime boundary

Even if all four candidates are later provenance-approved:

```text
provider pilot approval != runtime activation
```

A separate runtime wave must add the static-audio resolver, AI-voice disclosure surface if required, fallback behavior, browser/device tests, and rollback behavior.

Current production behavior remains browser `speechSynthesis`.


## 9. Harness verification record

```text
PR:                         #283
final PR head:              ed1a0d08107fb35b5030fe296268eeb90b759170
PR CI:                      #1395 / run 35719163695 — FULL SUCCESS
merged implementation main: 4b975130bf6e5fc28cecbf6aea5373b7a1430c65
merged-main CI:             #1396 / run 35719862989 — FULL SUCCESS
Cloudflare production:      SUCCESS — exact merged implementation SHA
generated pilot audio:      0
approved production audio:  0
runtime static audio:       NOT ACTIVATED
```

Merged-main production smoke verified `https://mainlagihub.my.id` serving exact SHA `4b975130bf6e5fc28cecbf6aea5373b7a1430c65` from branch `main` with the canonical Supabase target.

## 10. Next execution step

The harness itself is closed. Next work is **candidate generation and human listening**, not more provider-harness architecture. Provide `OPENAI_API_KEY` only through a local/server environment, generate the exact four-item set with `marin`, use `cedar` as the planned comparison candidate, and keep production registry lifecycles unchanged until human review is complete. Do not copy candidates into `public/` or activate static playback in the same step.

Closure summary: `ENGLISH_NARRATION_PROVIDER_PILOT_HARNESS_CLOSURE_2026-09-22.md`.
