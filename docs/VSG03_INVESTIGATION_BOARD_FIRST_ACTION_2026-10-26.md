# VSG-03 — Investigation Board visual-first pilot

Date: 26 October 2026
Base: current main after VSG-01 PR #531.
Status: **Draft implementation; no CI, merge, or live verification claimed yet.**

## Scope

The Investigation Board used three competing instructional layers before first action (Garden activity title, nested "Papan penyelidikan" card and explanatory paragraph) and an idle footer telling the child to choose again. At width 320px its old CSS even hid the prompt card altogether.

This scoped pilot:
- Uses existing `planChildVisualHierarchy()`, with one **stage-specific short question**: observe "Apa yang perlu diamati?", control "Apa yang harus sama?", predict "Apa yang akan terjadi?", conclude "Apa kesimpulannya?".
- Keeps original narration via Dengar, accessible context title, and long explanation in on-demand "Cara main" (question-mark icon). No canonical prompt is rewritten.
- Keeps all four process steps, selected stage, scientific scenario lines, focus label and focus hint, all three canonical answer choices and their icons.
- Shows a readable one-column evidence board at 320px instead of hiding the focus hint or hiding the question. Reuses existing child question typography tokens.
- Makes wrong-state feedback "Belum tepat. Coba lagi!" and adopts concise canonical three-star completion, retaining Back/Again/Next/Share.
- Keeps keyboard and touch selection behavior; correct/wrong outcome and assessment evidence code are untouched.

## QA gate

- Run `scripts/run-investigation-board-browser-tests.mjs` on **320, 390, 430, 768, 1280px**: readiness, one main question, question/help text, 4 steps, scenario and focus evidence, three canonical choices, no overflow, keyboard wrong answer, pointer correct answer, completion, assessed attempt, and local Again.
- Collect 15 original screenshots in the CI artifact `vsg03-investigation-board-screenshots`, then manually review full-size text and layout.
- All required quality, production, dependency, secret, Postgres staging, Windows and Chromium gates must pass at the final PR SHA before merge.
- Security gate on 26 October 2026 is independently blocked by newly disclosed npm advisories. See [#533](https://github.com/ceritaantarkita-req/mainlagi-hub/issues/533). **Do not bypass it or claim this visual PR is release-ready until patched and revalidated.**
- Cloudflare exact deployed SHA and physical iOS Safari approval remain separate verifications.

Not changed: World, Motion Engine, Shop, database, auth, 900 canonical activities, 47 gameplay patterns, answer choices, scoring, retry/error counting, mastery/evidence, stage locks, audio implementation, artwork or process sequencing.
