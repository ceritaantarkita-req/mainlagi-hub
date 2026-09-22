# Mainlagi World — Eight-Stage Content Consistency Audit — 22 September 2026

Status: **IMPLEMENTED ON ISOLATED WORLD PRODUCTION BRANCH / CI VALIDATION PENDING**

Branch:

```text
feature/world-petualangan-uang-production-wave-20260922
```

Audio production remains deferred. This wave audits and tightens the actual Indonesian Petualangan Uang content across all eight Stages.

## 1. Machine-readable audit

Source:

```text
src/lib/learning/world/moneyWorldContentAudit.ts
version: money-world-content-audit-v1
```

The audit consumes the existing canonical Stage/Segment data. It does not create a second story/content registry.

Current topology remains:

```text
8 Stages
89 Segments
16 practice activities
1 open narrative choice
1 final recap
```

Every Stage remains two practice challenges and does not depend on the Bermain motion engine.

## 2. Stage-by-Stage review

| Stage | Focus | Review result |
| --- | --- | --- |
| 1 | Money + price | Clear first concept; price comes before price change. |
| 2 | Price change + inflation | Kept child-safe boundary: inflation is introduced as many prices rising over time, not one item changing once. |
| 3 | Work + business | Money is connected to real work/enterprise; magical acquisition stays only as a wrong practice distractor. |
| 4 | Needs + wants | Framed around the festival goal, avoiding moralizing that wants are inherently bad. |
| 5 | Saving | Clear future-goal sequence; saving follows prioritization naturally. |
| 6 | Saving vs investment | Adult framing retained; investment is “trying to grow value,” never guaranteed. |
| 7 | Risk | Outcome uncertainty is stated directly; guaranteed-return wording appears only as an incorrect option. |
| 8 | Integrated finale | Needs, remaining money, open choice, arithmetic, payoff, and recap remain distinct. |

## 3. Copy refinements made

Four weak/ambiguous transitions were tightened.

### Stage 2

Before:

```text
Kalau banyak harga naik dari waktu ke waktu, ada istilah inflasi.
```

Now:

```text
Kalau banyak harga naik dari waktu ke waktu, itu disebut inflasi.
```

Reason: clearer definition while keeping the important “many prices / over time” boundary.

### Stage 6

Before:

```text
Kalau ditabung, uangnya tetap ada.
```

Now:

```text
Kalau ditabung, uangnya disimpan untuk nanti.
```

Reason: avoids implying nominal/value stability and aligns with the Stage 5 saving definition.

### Stage 7

Before:

```text
Iya. Bisa lebih baik, bisa juga lebih kecil.
```

Now:

```text
Iya. Hasilnya bisa berbeda dari yang kita harapkan.
```

Reason: explains risk through uncertainty rather than an ambiguous “better/smaller” comparison.

### Stage 8

Before:

```text
Sekarang coba latihan hitung. Kalau delapan token dipakai dua, sisanya berapa?
```

Now:

```text
Sekarang latihan hitung lain. Bayangkan ada delapan token, lalu dua dipakai. Sisanya berapa?
```

Reason: the arithmetic is explicitly a separate exercise, so it remains coherent regardless of which open narrative choice the child selected immediately before it.

## 4. Audit invariants

The content validator now requires:

- exact canonical eight-Stage order;
- each Stage opens with narrative and closes with payoff;
- exactly two practice activities per Stage;
- no motion-game dependency;
- spoken child copy stays <=18 words per cue;
- required concept vocabulary remains present per Stage;
- no guaranteed-return claim appears as factual narration/concept/payoff;
- narrative choice + recap stay exclusive to Stage 8;
- Stage 6 saving bridge uses “disimpan untuk nanti”;
- Stage 7 explains risk through outcome uncertainty;
- Stage 8 post-choice arithmetic is explicitly a separate exercise.

## 5. Financial-safety boundary

Investment remains introduced only as a child-safe concept:

```text
orang dewasa
mencoba mengembangkan nilai
hasil tidak selalu naik
risiko
belum pasti
bisa naik atau turun
```

The World does not tell the child to buy an investment, pick a product, expect profit, or treat stars/completion as financial mastery.

## 6. What did not change

This audit does not change:

- World / Chapter / Stage / Scene / Segment IDs;
- Stage order;
- activity mechanics;
- completion/persistence;
- narrative-choice scoring (there is still no right/wrong answer);
- recap topology;
- narration cue count (still 88 spoken slots);
- Gavi/Paca runtime presentation;
- Belajar evidence/mastery;
- Bermain/motion;
- database schema.

Because fixed narration remains 0/88 approved, these copy refinements do not invalidate any approved production MP3.

## 7. Next non-audio work

After this exact wave is green:

```text
accessibility pass
-> performance/lazy-load pass
```

Audio remains safely deferred behind provider/voice/rights approval.
