# Mainlagi World — Stage Completion UX Polish — 22 September 2026

Status: **IMPLEMENTED ON ISOLATED WORLD PRODUCTION BRANCH / CI VALIDATION PENDING**

Branch:

```text
feature/world-petualangan-uang-production-wave-20260922
```

This wave continues non-audio World production work.

## 1. Goal

The Stage-end contract remains:

```text
★★★
rotating praise
Back | Again | Next
Share
```

Production wave 13 keeps that contract but makes the completion screen structurally aware of canonical Chapter/Stage context.

## 2. Canonical completion context

The completion surface now exposes:

```text
data-world-completion-stage
data-world-completion-chapter
data-world-completion-final
data-world-completion-context
data-world-completion-message
```

Visible context is concise:

```text
Chapter 1 · Stage 1/8
Awesome!
★★★
```

No progression source of truth is duplicated.

## 3. Chapter milestones

Chapter milestone detection now derives from:

```text
chapter.stageIds.at(-1) === stageId
```

instead of hardcoding Stage 4.

That means:

- Stage 4 closes Chapter 1;
- Stage 8 closes Chapter 2;
- both milestones are represented by canonical Chapter IDs;
- final World completion is separately identified with `data-world-completion-final="true"`.

Presentation reward labels remain lightweight:

```text
Chapter 1 -> Pilih Pintar
Chapter 2 -> Festival Siap
```

## 4. Next-step clarity

Non-final completion copy now states the exact next Stage that opens.

Example:

```text
Uang Buat Apa? selesai. Stage 2 sekarang terbuka.
```

Final Stage keeps the existing public-facing payoff:

```text
Petualangan Uang selesai. Festival Mainlagi siap!
```

## 5. Action layout

The required order remains:

```text
Back | Again | Next
Share
```

On narrow mobile widths, Back/Again/Next are kept in one compact three-button row and Share remains a separate full-width action below them.

The controls retain minimum touch sizing and now have an explicit visible focus treatment.

## 6. QA

Static QA locks:

- Chapter milestone derives from canonical Chapter membership;
- no `stage?.order === 4` / `chapterOneComplete` shortcut;
- stable completion data attributes;
- compact three-action mobile row;
- separate Share action.

Browser QA locks:

- Stage 1 -> Chapter 1 / Stage 1/8 context;
- Stage 1 Next points directly to Stage 2;
- Stage 4 exposes canonical Chapter 1 milestone;
- Stage 8 exposes canonical Chapter 2 milestone + final World state;
- all eight Stage completions preserve exact Stage identity;
- Share remains below Back/Again/Next at 320 and 430px;
- ★★★ remain on every completion.

## 7. Boundaries

This wave does not:

- generate or approve narration audio;
- change Stage/Scene/Segment IDs;
- alter completion persistence semantics;
- change stars into mastery evidence;
- resume Gian/Naya final character work;
- touch Belajar;
- touch Bermain/motion;
- activate World -> Evidence;
- modify database schemas.

## 8. Next

After this exact wave is green:

```text
8-Stage content consistency audit
-> accessibility pass
-> performance/lazy-load pass
```

Narration remains safely deferred behind the existing provider/voice/rights gate.
