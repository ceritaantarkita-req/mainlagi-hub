# MAINLAGI HOME ↔ CHILD HOME VISUAL CONVERGENCE REVISION
**Date:** 2026-10-05  
**Status:** PHASE 1 LIVE VERIFIED; PHASE 2 CANONICAL ACCOUNT + NAVIGATION REVISION APPROVED / IN IMPLEMENTATION  
**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Current baseline:** `main@372007eeca26e2f3d90fe577109668fa88511d04`

---

## 1. Purpose

Dokumen ini mendefinisikan revisi canonical untuk menyatukan pengalaman visual antara:

- public homepage: `/`
- child homepage: `/child/:childId/home`

Tujuan utama revisi adalah menghilangkan rasa bahwa kedua route tersebut berasal dari dua aplikasi yang berbeda.

Public homepage **tidak** akan menjadi copy 1:1 Child Home. Namun, keduanya harus memakai **satu visual language, satu hierarchy, satu component family, dan satu Mainlagi identity**.

Prinsip utama:

> **Homepage adalah versi “belum dipersonalisasi” dari Child Home.**  
> Setelah anak dipilih, pengalaman berubah menjadi Child Home yang personalized tanpa terasa pindah produk.

---

## 2. Current Problem

Pada current production, dua route utama terlihat sangat berbeda.

### `/`

Current public root menggunakan:

- `HomePage`
- public/legacy `AppShell`
- header/navigation public
- bottom navigation:
  - Beranda
  - Main Gerak
  - Bacaan & ide
  - Skor game
  - Akun
- visual composition yang terasa lebih seperti public website / legacy product surface

### `/child/:childId/home`

Current child home menggunakan:

- `Batch14WorldHome`
- child-owned immersive experience
- visual hierarchy yang lebih playful
- hero personalized:
  - `Hai, {childName}!`
  - CTA `Lanjut belajar`
- Mainlagi character artwork
- cream / soft green / navy visual system
- stronger child-oriented composition

### UX issue

Perbedaan ini membuat user berpotensi merasa:

- berpindah website;
- berpindah produk;
- tidak memahami mana homepage utama Mainlagi;
- tidak memahami hubungan antara public site dan mode anak;
- melihat dua visual identity yang sama-sama tampak seperti “home”.

Revisi ini harus menyelesaikan masalah tersebut di level **product architecture + visual system**, bukan sekadar mengganti warna.

---

# 3. Product Architecture Decision

Mainlagi tetap memiliki tiga konteks berbeda:

```text
PUBLIC / FAMILY ENTRY
        /
        │
        ├── pilih / lanjutkan profil anak
        │
        ▼
CHILD EXPERIENCE
/child/:childId/*
        │
        └── area orang tua
                ▼
PARENT EXPERIENCE
/parent/*
```

Ketiganya boleh memiliki struktur navigasi berbeda.

Namun:

> **Public, Child, dan Parent harus tetap terasa sebagai satu produk Mainlagi.**

---

# 4. Canonical Visual Source of Truth

Untuk revisi ini:

**Child Home menjadi visual source of truth.**

Public homepage harus bergerak ke arah visual Child Home, bukan sebaliknya.

Elemen canonical yang diambil dari Child Home:

- cream / warm neutral background;
- soft green surface;
- navy typography;
- green primary CTA;
- rounded card language;
- generous border radius;
- playful but clean spacing;
- Mainlagi character illustration;
- large child-friendly headline;
- same logo treatment;
- same button family;
- same spacing rhythm;
- same icon family;
- same responsive behavior philosophy;
- soft, joyful, non-corporate visual tone.

---

# 5. Homepage Role After Revision

Public homepage `/` bukan dashboard anak dan bukan dashboard orang tua.

Perannya:

> **Family Entry / Mainlagi Gateway**

Homepage harus menjawab tiga hal dengan sangat cepat:

1. Apa itu Mainlagi?
2. Bagaimana anak mulai?
3. Bagaimana orang tua masuk ke area mereka?

Homepage tidak boleh terasa seperti content portal yang memiliki terlalu banyak navigasi level atas.

---

# 6. Target Homepage Hero

## 6.1 Public version

Recommended hero copy:

```text
Hai! 👋

Belajar,
berpetualang,
lalu main lagi.

Mainlagi menemani anak usia 3–7 tahun
belajar sambil bermain.

[ Mulai untuk anak ]
[ Area orang tua ]
```

Hero artwork:

- gunakan Mainlagi cast / approved character artwork;
- idealnya memperlihatkan Naya, Gian, Zia, Paca, dan Gavi;
- karakter harus menjadi bagian dari composition, bukan decorative image terpisah;
- style mengikuti canonical production character system;
- tidak membuat karakter alternatif hanya untuk homepage.

---

## 6.2 Personalized child version

Child Home tetap dapat menggunakan:

```text
Hai, Gian! 👋

Belajar,
berpetualang,
lalu main lagi.

Lanjutkan “Pasangkan huruf besar dan kecil”
atau pilih pengalaman Mainlagi yang kamu mau.

[ Lanjut belajar ]
```

Perbedaan utama antara public home dan child home adalah **personalization dan action**, bukan visual identity.

---

# 7. Header Revision

## Decision

**Menu dipindahkan ke sebelah kiri.**

Header baru harus konsisten antara public dan child surfaces.

### Mobile / tablet canonical order

```text
┌────────────────────────────────────┐
│  ☰ Menu        Mainlagi        👤  │
└────────────────────────────────────┘
```

atau versi compact:

```text
┌────────────────────────────────────┐
│  ☰          Mainlagi           👤  │
└────────────────────────────────────┘
```

Rules:

- menu trigger selalu di **kiri**;
- logo Mainlagi berada di area tengah / center-biased;
- profile/account berada di kanan;
- menu tidak boleh kembali ke posisi kanan;
- jangan membuat dua menu trigger;
- jangan mempertahankan top navigation lama paralel dengan menu baru.

---

# 8. Left Menu / Navigation Drawer

Menu utama dibuka dari kiri.

### Behavior

- drawer muncul dari **left edge**;
- overlay menutup content;
- swipe / close button / Escape harus menutup drawer;
- focus trap untuk keyboard;
- scroll halaman belakang dikunci saat drawer aktif;
- touch target minimum harus child-safe;
- opening animation singkat dan halus;
- reduced-motion tetap dihormati.

### Public menu

Suggested destinations:

```text
Beranda
Mulai untuk anak
Area orang tua
Main Gerak
Bacaan & ide
Tentang Mainlagi
```

Catatan:

- menu publik tidak perlu meniru seluruh child navigation;
- `Skor game` tidak perlu menjadi primary public destination;
- Shop tidak ditampilkan sebelum release gate Shop mengizinkan;
- hindari terlalu banyak link.

### Child menu

Suggested destinations:

```text
Beranda
Belajar
Bermain
World / Petualangan
Koleksi / Rewards
Profil
```

Final label harus mengikuti canonical terminology yang sudah berlaku pada runtime.

### Parent menu

Parent navigation boleh tetap memakai dedicated parent structure, tetapi visual drawer/header harus mengikuti Mainlagi shared tokens.

---

# 9. Public Bottom Navigation Decision

## Remove from public homepage

Current public bottom navigation:

```text
Beranda
Main Gerak
Bacaan & ide
Skor game
Akun
```

harus **dihilangkan dari public homepage experience**.

Reason:

- membuat `/` terasa seperti app dashboard;
- overlap dengan child navigation mental model;
- memperbesar gap visual dengan Child Home;
- terlalu banyak destination sebelum user memahami Mainlagi;
- mengaburkan primary CTA.

Public homepage menggunakan:

- top header;
- left menu;
- in-page CTA.

Child / Parent dapat tetap mempunyai navigation pattern yang sesuai konteksnya.

---

# 10. Homepage Content Structure

Canonical public homepage setelah revisi:

```text
HEADER
  Menu kiri
  Mainlagi logo
  Profile / account

HERO
  Hai! 👋
  Main headline
  supporting copy
  CTA anak
  CTA orang tua
  Mainlagi cast illustration

MAIN EXPERIENCE
  “Yang bisa kamu jelajahi”
  Belajar
  Bermain
  World / Petualangan
  Mewarnai / creative activities
  other approved surfaces

HOW MAINLAGI WORKS
  pilih anak
  main / belajar
  progress tersimpan

FOR PARENTS
  perkembangan anak
  laporan
  sertifikat
  privacy / camera explanation

FINAL CTA
  Mulai untuk anak
```

Tidak semua section harus muncul dalam first viewport.

First viewport harus tetap sederhana.

---

# 11. Homepage Experience Cards

Cards pada homepage harus memakai visual family yang sama dengan Child Home:

- same radius;
- same border;
- same background palette;
- same icon treatment;
- same shadow depth;
- same hover / press states;
- same mobile spacing;
- same typography scale logic.

Avoid:

- legacy dark sections;
- unrelated gradients;
- dense content portal cards;
- mixed visual systems;
- promotional banner style yang tidak ada di child app.

---

# 12. Mainlagi Character Use

Homepage bukan tempat membuat style karakter baru.

Gunakan canonical cast:

- Naya
- Gian
- Zia
- Paca
- Gavi

Rules:

- gunakan production-approved character presentation;
- character proportions tidak boleh berubah antar public / child;
- jangan memakai generated replacement character yang tidak canonical;
- personality setiap character tetap sama;
- character illustration harus support hierarchy, bukan menutupi CTA.

---

# 13. Color System

Canonical direction:

- warm cream / off-white background;
- navy headline;
- soft green surface;
- deeper green CTA;
- yellow accent;
- restrained supporting colors dari subject / character system.

Homepage **tidak** boleh kembali menggunakan dark navy shell besar sebagai visual default jika hal itu membuatnya terputus dari Child Home.

Dark navy tetap dapat digunakan sebagai:

- accent;
- footer;
- compact surface;
- selected navigation state;

tetapi bukan keseluruhan visual identity homepage.

---

# 14. Typography

Typography hierarchy harus sama dengan Child Home.

Required:

- large rounded headline;
- readable body;
- large CTA;
- simple Indonesian copy;
- short lines;
- no technical terminology;
- no parent jargon inside child-oriented blocks.

Homepage boleh memiliki parent-focused explanation, tetapi hierarchy utama tetap friendly untuk keluarga.

---

# 15. Root Route Behavior

Current root sudah memiliki konsep active-child resume.

Revisi harus mempertahankan prinsip ini dan membuatnya lebih predictable.

### State A — no child context

```text
/
→ tampil Public / Family Homepage
```

### State B — valid active child exists

```text
/
→ resume ke /child/:childId/home
```

### State C — multiple children, no clear active child

```text
/
→ Public Homepage
→ CTA “Mulai untuk anak”
→ child selector
```

### State D — invalid/stale active-child key

```text
/
→ fail safely ke Public Homepage
```

Tidak boleh redirect ke child ID yang sudah tidak valid.

---

# 16. Demo Gian Boundary

`demo-gian` adalah sandbox/demo child.

Jangan membuat behavior homepage production bergantung pada demo child.

Rules:

- demo route tetap tersedia untuk QA/demo sesuai existing boundary;
- public homepage tidak otomatis menganggap `demo-gian` adalah child production;
- tidak menyimpan demo identity sebagai real family child;
- visual QA boleh tetap menggunakan `/child/demo-gian/home`.

---

# 17. Shared Component Direction

Target jangka menengah adalah mengurangi drift antar surface.

Recommended shared primitives:

```text
MainlagiHeader
MainlagiMenuTrigger
MainlagiLeftDrawer
MainlagiLogo
MainlagiProfileButton
MainlagiHeroCard
MainlagiPrimaryButton
MainlagiSecondaryButton
MainlagiExperienceCard
MainlagiSectionHeading
MainlagiCharacterGroup
```

Tidak wajib membuat seluruh component tersebut dalam satu PR.

Namun implementasi baru harus menuju shared primitives, bukan membuat duplikasi baru.

---

# 18. Responsive Rules

## Mobile

Priority:

- clear header;
- menu kiri;
- readable hero;
- CTA above fold;
- character artwork tidak memotong CTA;
- no horizontal overflow;
- no public bottom navigation.

## Tablet

- hero dapat tetap stacked;
- jangan paksa layout desktop terlalu cepat;
- menu tetap kiri;
- artwork dapat diperbesar bila ruang cukup.

## Desktop

Header:

```text
Menu      Mainlagi logo                         Profile
```

Hero boleh menjadi two-column:

```text
copy / CTA                         character artwork
```

Tetapi hierarchy dan visual family tetap identik dengan mobile.

---

# 19. Accessibility

Required:

- menu trigger memiliki accessible name;
- drawer memakai proper dialog/navigation semantics;
- close control jelas;
- focus visible;
- keyboard navigation;
- reduced-motion;
- minimum touch target;
- sufficient text contrast;
- logo tidak menjadi satu-satunya home affordance;
- illustration decorative harus `aria-hidden` atau alt sesuai konteks.

---

# 20. Copy Direction

Mainlagi public copy harus:

- pendek;
- hangat;
- mudah dipahami;
- lebih banyak manfaat daripada feature jargon.

Recommended main headline:

> **Belajar, berpetualang, lalu main lagi.**

Recommended supporting copy:

> **Mainlagi menemani anak usia 3–7 tahun belajar sambil bermain.**

Primary CTA:

> **Mulai untuk anak**

Secondary CTA:

> **Area orang tua**

Avoid:

- “platform”;
- “learning engine”;
- “runtime”;
- “mastery system”;
- technical camera language di hero.

Camera/privacy explanation dipindahkan ke supporting section.

---

# 21. Navigation Mental Model

Setelah revisi:

```text
PUBLIC
/
│
├─ Menu kiri
│
├─ Mulai untuk anak
│
└─ Area orang tua
       │
       ▼
CHILD
/child/:childId/home
│
├─ Belajar
├─ Bermain
├─ World
└─ profile-specific journey

PARENT
/parent/*
│
├─ Progress
├─ Laporan
├─ Sertifikat
└─ Pengaturan
```

Setiap mode mempunyai role yang jelas.

---

# 22. Non-Goals

Revisi homepage ini **tidak boleh** sekaligus:

- mengubah learning evidence;
- mengubah mastery;
- mengubah progression;
- mengubah activity schema;
- mengubah World progression;
- merombak motion engine;
- membuka Shop sebelum release gate;
- mengganti canonical character art;
- mengganti database/auth architecture;
- mengubah parent reporting semantics.

Scope ini adalah **visual + navigation + entry experience convergence**.

---

# 23. Implementation Boundary

Implementation harus dilakukan dengan workflow repo yang sekarang:

```text
main
 ↓
short-lived branch
 ↓
implementation
 ↓
tests / QA
 ↓
PR
 ↓
CI green
 ↓
merge
 ↓
branch auto-delete
```

Jangan mengerjakan langsung di protected `main`.

---

# 24. Suggested Implementation Waves

## HOME-CONV-01 — Header + left menu foundation

- pindahkan menu ke kiri;
- build shared header;
- build left drawer;
- remove conflicting navigation;
- responsive / accessibility QA.

## HOME-CONV-02 — Public hero convergence

- redesign `/` hero mengikuti Child Home;
- same visual tokens;
- same CTA family;
- canonical character artwork;
- remove legacy dark hero treatment.

## HOME-CONV-03 — Public content convergence

- redesign subject / experience cards;
- parent section;
- how-it-works;
- final CTA;
- remove public bottom navigation.

## HOME-CONV-04 — State / routing validation

- active-child resume;
- no-child;
- stale child;
- multiple profiles;
- demo boundary.

## HOME-CONV-05 — Full QA + documentation closure

- 320 / 390 / 768 / desktop;
- Chrome / mobile Chromium;
- navigation;
- menu drawer;
- no overflow;
- no console errors;
- Cloudflare smoke;
- docs update.

---

# 25. Acceptance Criteria

Revision dianggap selesai hanya jika:

- [ ] `/` dan `/child/:childId/home` jelas terlihat berasal dari produk yang sama.
- [ ] Child Home tetap canonical personalized home.
- [ ] `/` terlihat seperti unpersonalized version dari Child Home.
- [ ] Menu berada di sebelah kiri.
- [ ] Menu membuka drawer dari kiri.
- [ ] Logo Mainlagi konsisten.
- [ ] Profile/account berada di kanan.
- [ ] Public bottom navigation lama tidak tampil di homepage.
- [ ] Primary CTA `/` adalah `Mulai untuk anak`.
- [ ] Secondary CTA adalah `Area orang tua`.
- [ ] Public hero menggunakan canonical Mainlagi character system.
- [ ] Tidak ada legacy visual shell yang bertabrakan dengan Child Home.
- [ ] Active child resume tetap aman.
- [ ] `demo-gian` tidak menjadi production identity.
- [ ] Mobile 320px tidak overflow.
- [ ] Mobile 390px tidak overflow.
- [ ] Tablet 768px tetap usable.
- [ ] Desktop hierarchy jelas.
- [ ] Drawer keyboard accessible.
- [ ] Reduced-motion tetap didukung.
- [ ] No learning/mastery/progression regression.
- [ ] Current CI suite tetap green.
- [ ] Production smoke Cloudflare green setelah merge.

---

# 26. Visual Success Test

User membuka:

```text
https://mainlagihub.my.id/
```

lalu memilih Gian dan masuk ke:

```text
/child/<gian-id>/home
```

User seharusnya merasa:

> “Homepage sekarang jadi punya Gian.”

Bukan:

> “Saya pindah ke website/aplikasi lain.”

Itu adalah UX success criterion terpenting untuk revisi ini.

---

# 27. Final Decision Summary

Canonical decisions:

1. Child Home menjadi visual reference utama.
2. Public homepage dibuat mirip Child Home secara visual.
3. Public homepage tetap memiliki role berbeda: family entry.
4. Menu dipindahkan ke **sebelah kiri**.
5. Menu menggunakan **left-side drawer**.
6. Public bottom navigation lama dihapus.
7. Logo / profile / button / typography / card / character system disatukan.
8. Root tetap mendukung safe active-child resume.
9. Parent, Child, dan Public tetap tiga contexts berbeda dalam satu Mainlagi product.
10. Tidak menyentuh learning logic / mastery / progression pada revision wave ini.

---

**Proposed canonical document name:**

`docs/MAINLAGI_HOME_CHILD_VISUAL_CONVERGENCE_REVISION_2026-10-05.md`


---

# 28. Implementation Closure — 5 October 2026

The approved convergence revision is now implemented, merged, and production-verified.

Canonical runtime merge:

```text
PR:               #477
final PR head:    aaa3545c265b020bae2628f5588f8e1be58fb872
merged main:      0fa36e51fd6217a33f5bcf2fc5e0641cc5924982
PR CI:            #2471 / run 37259553148 — FULL SUCCESS
merged-main CI:   #2472 / run 37260239442 — FULL SUCCESS
Cloudflare smoke: SUCCESS on exact merged main SHA
```

Verified implementation:

- public `/` now uses the Child Home visual language as its family-entry surface;
- the public hero uses the approved five-character Mainlagi SVG ensemble;
- Mainlagi menu ownership moved to a shared accessible **left drawer**;
- public header keeps the Mainlagi wordmark centered and account control on the right;
- the child Journey Map header uses the same left-drawer navigation pattern;
- the legacy public mobile bottom navigation is absent on `/`;
- active-child resume remains preserved;
- Shop remains parent-gated and commerce activation boundaries are unchanged;
- learning evidence, mastery, progression, activity schema, World progression, and Motion Engine semantics were not changed.

Regression coverage now locks:

- 320 / 360 / 375 / 390 / 430 / 768 / 1024 responsive route behavior;
- left-drawer positioning and keyboard/Escape behavior;
- public-root visual convergence and removal of the legacy bottom navigation;
- canonical five-character SVG hero provenance;
- child Shop parent-gate preservation;
- permanent visual baseline and no-horizontal-overflow checks.

The short-lived implementation branch was removed after merge by repository branch hygiene.

This document is now the canonical design + implementation closure for the Home ↔ Child Home visual convergence package.


---

# 29. Phase 2 — Canonical Account + Navigation Architecture Revision

**Decision date:** 5 October 2026  
**Baseline:** `main@7f122ec9b391a71c5a5a7dbd2e092661ff03d037`  
**Status:** APPROVED FOR IMPLEMENTATION

Phase 1 solved the largest Home ↔ Child Home visual split. The next audit showed that Mainlagi still exposes multiple competing navigation/account models:

- public/account routes use `AppShell -> TopNavbar`;
- child routes use `WorldChildShell -> PlayroomShell`;
- parent routes use `ParentShell` with its own sidebar/mobile navigation;
- auth routes use `AuthFamilyShell` without the global Mainlagi menu;
- `/account` and `/parent` both behave like adult/family areas;
- `/about` and `/account/about` contain stale, duplicate product descriptions;
- signed-out users can currently create persistent local child profiles, while signed-in users create cloud profiles.

This produces unnecessary cognitive switching and makes Mainlagi feel like multiple adjacent products.

## 29.1 Canonical product decision

Mainlagi will use:

> **one global Mainlagi navigation model + one authenticated family account + one parent area + child-specific subnavigation.**

Global navigation and contextual navigation are separate concepts.

### Global Mainlagi navigation

The visible global menu order is canonical:

```text
Beranda
Belajar
Bermain
World
Shop
Bacaan & ide
Area orang tua
Tentang Mainlagi
```

The order and labels must not change between public, child, parent, account, or auth browsing surfaces.

Destinations may resolve by context:

- with active child: Belajar/Bermain/World resolve directly into that child;
- without active child but authenticated: resolve through child selection;
- signed out: child-owned production journeys resolve through account entry / child selection;
- Shop remains parent-gated until commerce release gates change;
- immersive activity/gameplay routes remain allowed to suppress the global menu.

## 29.2 Canonical header

Non-immersive product surfaces use the same three-zone header:

```text
☰ Menu           Mainlagi           identity/context
```

Rules:

- left = global Mainlagi menu;
- center = Mainlagi wordmark;
- right = current identity/context;
- signed out right label = `Masuk`;
- parent/account context = family/account identity;
- child context = active child identity;
- header geometry and menu order remain stable when switching mode.

The child identity dropdown is contextual and may contain:

```text
Ganti profil anak
Koleksi bintang
Suara
Kembali ke area orang tua
```

It is not a replacement for the global Mainlagi menu.

## 29.3 Account-first production model

Production child profiles require a family account.

Canonical rule:

```text
SIGNED OUT
  ├─ browse public Mainlagi
  ├─ sign up / sign in
  └─ try Gian Demo

AUTHENTICATED FAMILY
  ├─ create cloud child profile
  ├─ choose child profile
  ├─ enter child mode
  └─ enter parent area
```

Signed-out users must not create new persistent production child profiles.

The guest exception is explicit:

> **Gian Demo remains available as the only no-account child sandbox.**

Existing local-profile compatibility must not silently become a new production identity model.

## 29.4 Parent/account convergence

`/parent` is the canonical adult/family product area.

It owns:

```text
Ringkasan
Anak
Laporan / perkembangan
Privasi
Pengaturan
Akun
Paket
```

`/account/*` may remain temporarily as compatibility/account-setting routes, but it must not present itself as a competing second "Area orang tua".

Global navigation must route **Area orang tua → /parent**.

Account settings may be linked from Parent Pengaturan.

## 29.5 About cleanup

Canonical About route:

```text
/about
```

`/account/about` is retired as a product-information owner and should redirect to `/about`.

The canonical About copy must describe current Mainlagi, not the old motion-only prototype.

Required current framing:

- children 3–7;
- Belajar + Bermain/Main Gerak + World;
- stage-based learning;
- touch, audio, trace, color, story and other approved learning interactions;
- motion/camera gameplay is optional, not the whole product;
- five canonical characters: Naya, Gian, Zia, Paca, Gavi;
- parent progress/reporting area;
- Indonesian/English direction where currently supported;
- no stale "10 motion games are the product" framing;
- no stale "teacher/presenter is a primary audience" framing unless re-approved separately.

## 29.6 Auth surface convergence

`/login`, `/signup`, `/forgot-password`, `/reset-password`, and auth callback/status flows are family/account surfaces, not gameplay.

They should retain the Mainlagi brand and expose the same global menu/header where navigation is safe.

Successful authentication defaults should support the canonical family flow rather than sending users into a separate legacy account world.

Preferred entry intent:

```text
Mulai untuk anak
→ /child/select
→ if signed out: sign up / sign in + Gian Demo
→ if authenticated: create/select cloud child
→ child home

Area orang tua
→ if signed out: login
→ if authenticated: /parent
```

## 29.7 Parent subnavigation

Parent-specific navigation remains useful, especially on desktop, but is a **subnavigation** underneath the global Mainlagi header.

It must not replace global navigation.

Conceptually:

```text
GLOBAL
  Beranda / Belajar / Bermain / World / Shop / Bacaan & ide / Area orang tua / Tentang

PARENT SUBNAV
  Ringkasan / Anak / Privasi / Paket / Pengaturan / Akun
```

## 29.8 Immersive exception

The global header/menu may be hidden only when the user is inside a truly immersive experience, for example:

- active learning activity;
- active World stage;
- active motion gameplay.

Browsing, profile selection, login/signup, parent dashboards, account settings, About, Discover, Games directory, and other navigation pages are not immersive.

## 29.9 Implementation scope

Phase 2 implementation should:

1. centralize the global Mainlagi menu definition;
2. reuse it from public, child, parent and auth non-immersive surfaces;
3. make `/parent` the canonical Area Orang Tua destination;
4. enforce account-first production child-profile creation while preserving Gian Demo;
5. update stale About content and retire `/account/about` as an owner;
6. remove remaining public bottom-navigation ownership where it conflicts with the new global-menu model;
7. preserve all existing learning/mastery/progression/World/Motion semantics;
8. preserve Shop parent-gating;
9. add permanent tests for menu order, auth-first profile rules, About redirect/content, and cross-surface header presence.

## 29.10 Non-goals

This phase does **not**:

- redesign learning activities;
- change mastery/evidence rules;
- change World progression;
- change Motion Engine gameplay;
- activate Shop transactions;
- change certificate criteria;
- change billing/entitlement;
- invent new product claims.

## 29.11 Acceptance criteria

Phase 2 is complete when:

- [ ] Public, child, parent and auth browsing surfaces expose the same global menu labels/order.
- [ ] Menu is always on the left on non-immersive surfaces.
- [ ] Mainlagi wordmark remains centered.
- [ ] Right-side identity changes by context without changing global navigation.
- [ ] `Area orang tua` resolves to `/parent`.
- [ ] Signed-out users cannot create new production child profiles.
- [ ] Signed-out users can still use Gian Demo.
- [ ] Signed-in users can create/select cloud child profiles.
- [ ] Parent remains server-auth-gated.
- [ ] Parent subnavigation remains available without replacing global navigation.
- [ ] `/about` contains current Mainlagi positioning.
- [ ] `/account/about` redirects to `/about`.
- [ ] Auth pages preserve Mainlagi global navigation.
- [ ] Truly immersive activity/gameplay routes may still suppress global navigation.
- [ ] Shop remains parent-gated.
- [ ] No regression to learning/mastery/progression/World/Motion behavior.
- [ ] Responsive QA remains green at canonical viewport matrix.
- [ ] Production smoke verifies the exact merged SHA.

