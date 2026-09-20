# WS-13 — Activity Gallery + Isolated QA Unlock

Date: **20 September 2026**  
Status: **IMPLEMENTATION PR / VALIDATION PENDING**  
Base when branch opened: `main` = `901e79f162dfe1bfe7b341b40bf78d260f222a93`

## Scope

This wave implements the next approved WS-13 step after the child-home/directory wave:

1. grouped, picture-first activity catalog;
2. temporary unlock-all mode for local/demo QA;
3. no change to real learning progression, mastery, evidence, scoring, or catalog semantics.

## QA unlock contract

Unlock-all is active only when all three conditions are true:

- child key is exactly `demo-gian`;
- request query is exactly `?qa=unlock-all`;
- server runtime has `MAINLAGI_QA_UNLOCK_ALL=1`.

Normal production deploys do not set that server-only QA flag. Query-string access by itself is therefore insufficient.

When active, the subject catalog treats every stage/activity as inspectable/playable for QA. It does not write progress, alter readiness calculations, change mastery rules, or mutate the production catalog.

## Activity catalog changes

- Recommended activity remains prominent.
- Learning journey/stages remain visible.
- Playable and browse-all activities are grouped by stage instead of becoming one undifferentiated card wall.
- QA unlock-all also remains stage-grouped even though all 100 subject activities become inspectable.
- Mini-question thumbnails that embedded answer/choice text are removed.
- Non-creative cards use a large activity visual + mechanic icon; coloring/drawing keep authored previews; trace keeps its trace glyph.
- This is a structural picture-first improvement, not a claim that final learning illustration art is complete.

## QA coverage

Local/browser QA checks:

- normal progression still exposes locked/unavailable catalog content;
- normal availability dialog still works;
- QA unlock-all exposes exactly 100 direct activity links for a subject;
- QA mode leaves no locked browse-all remainder;
- every stage journey item becomes inspectable in QA mode;
- catalog remains grouped by multiple stages;
- every activity card owns one visual preview;
- canonical responsive/error/overflow/touch-target/browser-warning gates remain active.

## Non-goals

- no permanent progression bypass;
- no database/schema change;
- no mastery/evidence change;
- no WS-05 mechanic taxonomy change;
- no claim that emoji/activity visuals are final production illustration assets.
