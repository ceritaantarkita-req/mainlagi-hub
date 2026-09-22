# Mainlagi World — Chapter Navigation Visual Polish — 22 September 2026

Status: **IMPLEMENTED ON ISOLATED WORLD PRODUCTION BRANCH / CI VALIDATION PENDING**

Branch:

```text
feature/world-petualangan-uang-production-wave-20260922
```

This wave continues World production work without touching fixed narration generation.

## 1. Goal

The World hierarchy was already canonical:

```text
World -> Chapter -> Stage -> Scene -> Segment
```

but Chapter identity on the journey map was still presented through hardcoded CSS pseudo-content.

Production wave 12 makes Chapter hierarchy visible, semantic and progress-aware in the actual runtime DOM.

## 2. Map Chapter banners

The Petualangan Uang map now renders one semantic Chapter banner per canonical Chapter.

Source of truth:

```text
MONEY_WORLD_CHAPTERS
```

Current map banners:

```text
Chapter 1 · Jalan ke Festival
Chapter 2 · Siapkan Festival!
```

Each banner also derives completed Stage count from canonical Chapter membership and World progress.

Example:

```text
Chapter 1
Jalan ke Festival
1/4 Stage selesai
```

No Chapter title or Stage count is hardcoded in CSS.

## 3. Stage shell hierarchy

The active Stage shell now exposes:

```text
data-world-chapter-id
data-world-chapter-order
data-world-chapter-label
```

Visible hierarchy becomes:

```text
Chapter 1 · Jalan ke Festival
Uang Buat Apa?
Stage 1 · Halaman rumah · Bagian 1/10
```

This makes World/Chapter/Stage context clearer without changing progression or adding another navigation state.

## 4. CSS cleanup

Removed the old CSS pseudo-content implementation:

```css
content: "Chapter 1 · Jalan ke Festival";
content: "Chapter 2 · Siapkan Festival!";
```

The new `.chapterMapBanner` is a real runtime element and can expose dynamic progress and accessible text.

Responsive styling keeps the banner inside 320/390/430 layouts and allows Stage metadata to wrap instead of forcing horizontal overflow.

## 5. QA

Static World QA now requires:

- visible Chapter navigation derives from `MONEY_WORLD_CHAPTERS`;
- map/Stage shell expose canonical Chapter IDs;
- Stage shell exposes authored Chapter label;
- Chapter progress derives from `chapter.stageIds` + completed Stage IDs;
- `.chapterMapBanner` styling remains present;
- Chapter titles are not reintroduced through CSS pseudo-content.

Browser QA verifies:

- Stage 1 shell resolves Chapter 1 identity/title;
- after Stage 1 completion, Chapter 1 reports `1/4 Stage selesai`;
- Chapter 2 remains `0/4 Stage selesai`;
- fully completed World reports `4/4 Stage selesai` for both Chapters;
- semantic Chapter map banners fit without horizontal overflow at 320 and 430px;
- screenshots are emitted for narrow Chapter-map review.

## 6. Boundaries

This wave does not:

- generate or approve audio;
- change the narration pipeline;
- resume Gian/Naya production;
- change Stage/Scene/Segment IDs;
- change completion or resume semantics;
- touch Belajar;
- touch Bermain/motion;
- activate World -> Evidence;
- modify database schemas.

## 7. Next non-audio work

After this wave is green, continue with:

```text
completion UX polish
-> end-to-end 8-Stage content audit
-> accessibility pass
-> performance/lazy-load pass
```

Audio can remain blocked behind the existing voice/provider/rights decision while those runtime/product passes continue.
