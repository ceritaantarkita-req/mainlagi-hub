# Design System — Mainlagi Hub

- **Status:** Approved direction (playful-balanced). Referensi implementable; source of truth untuk kerja visual.
- **Scope:** seluruh frontend. Berlaku untuk web, PWA, dan wrapper native.
- **Spirit:** joyful untuk anak, rapi dan dipercaya untuk orang tua & guru.

## 1. Design Direction

**Aesthetic:** Playful-balanced.

- **Playful secukupnya, bukan maksimal.** Warna berkarakter, sudut membulat, gerakan ringan, ikon ramah.
- **Kredibel & readable.** Layout bersih, teks terbaca, hierarki jelas — parent/guru yang mendampingi percaya.
- **Satu bahasa di semua halaman.** Homepage, game, katalog, discover, akun, leaderboard — bercerita sama.

**Memorable thing (yang ingin diingat user):**
> "Mainlagi Hub terasa hidup: belajar sambil bergerak, dan tiap game punya warna & gerakan khas."

## 2. Color System

### 2.1 Tokens (semantic)

Warna dibangun sebagai token semantik, bukan hex hardcoded. Token sama menghasilkan kontras yang benar di light & dark.

```css
:root {
  --brand:        #3f7ad8;   /* aksi, link, fokus */
  --brand-strong: #2f63bd;   /* hover/aktif */
  --brand-soft:   #e7eefb;   /* permukaan aksen */
  --lime:         #c8f26b;   /* energi, bintang */
  --pink:         #ff567f;   /* CTA hero, momen joyful */
  --gold:         #fcd34d;   /* medali, poin */
  --good:         #17a866;
  --bad:          #e2445c;
  --navy:         #0f2344;   /* judul, teks kuat */
  --ink:          #17233b;   /* teks body */
  --muted:        #5d6b85;   /* teks sekunder */
  --line:         #dce3ef;   /* border */
  --surface:      #ffffff;   /* kartu */
  --page:         #f5f7fb;   /* latar halaman */
}
```

### 2.2 Palette resmi (hex yang boleh dipakai)

Turunkan dari 53 hex campur ke ~6 keluarga. Di luar ini, **tidak boleh** hardcode kecuali ada alasan tercatat.

| Keluarga | Light | Dark | Dipakai untuk |
|---|---|---|---|
| Brand blue | `#3f7ad8` | `#6ea8f5` | aksi, link, fokus, ikon |
| Lime | `#c8f26b` | `#d3f46f` | energi, bintang, step |
| Pink | `#ff567f` | `#ff6f92` | CTA hero, aksen joyful |
| Gold | `#fcd34d` | `#ffd76a` | medali, poin |
| Navy | `#0f2344` | `#ecf2ff` | judul, teks kuat |
| Surface | `#fff` / `#f5f7fb` | `#0b1122` / `#121a2f` | kartu / halaman |

### 2.3 Dark palette (ditetapkan, bukan 53 hex)

```css
html[data-theme="dark"] {
  --color-brand:   #6ea8f5;
  --color-brand-2: #8fc1ff;
  --page:      #0b1122;
  --surface:   #121a2f;
  --surface-2: #1a2743;  /* kartu/elevasi kedua */
  --navy:      #ecf2ff;  /* teks terang */
  --ink:       #e6ecf7;
  --muted:     #a3b0c8;
  --line:      #22304d;
}
```

Aturan kontras dark:
- Teks utama di atas `--surface` memakai `--navy`/`--ink` (terang).
- **Jangan** pakai `--navy` sebagai *background* di dark (jadi terang → teks putih nyambung). Kalau perlu background aktif, pakai `--surface-2` + teks terang.

## 3. Gradient Recipe

**Satu resep, satu sudut, satu pola.** Semua gradien aksen memakai 135°, dua stop, "soft-to-strong" (lebih terang → lebih gelap). Perbedaan tinggal palet warnanya.

```css
.gradient-accent {
  background: linear-gradient(135deg, var(--g-from), var(--g-to));
}
```

### 3.1 Tiga tingkatan saturasi (konsisten tapi tidak norak)

| Level | Dipakai di | Saturasi |
|---|---|---|
| `strong` | kartu game home, CTA hero | 100% |
| `mid` | tile `/games`, chip Discover, ikon step | ~60% |
| `soft` | hover, latar ikon, skeleton | ~25% |

### 3.2 Identitas warna per game (wajib konsisten)

Setiap game punya `from → to`, dipakai **di semua halaman** (home, `/games`, `/games/[slug]`, Discover), hanya beda tingkatan saturasi.

| Game | from | to |
|---|---|---|
| Math Choice | `#23c99a` | `#078b78` |
| Math Motion Battle | `#4f8df7` | `#2862c9` |
| Number Trace | `#9b72ee` | `#6841c5` |
| Shape Quest | `#f5b51b` | `#e67b12` |
| Pattern Race | `#ee5f9d` | `#c93172` |
| Math Warung | `#fb8a27` | `#e55416` |
| Iqro Motion | `#22bcae` | `#0b8f8f` |
| AirBoard | `#7779ed` | `#4c4bc8` |
| Beat Motion | `#ef6268` | `#d83e4f` |
| Run to Target | `#25add2` | `#087dbd` |

**Aturan identitas:** di home pakai `strong`; di `/games` & Discover pakai `mid`; hover pakai `soft`. **Jangan** ganti tile `/games` jadi abu-abu seragam lagi.

## 4. Typography

- **Font utama:** Noto Sans (variable, 400–900). Self-hosted via `@fontsource-variable/noto-sans`.
- **Tidak ada font kedua untuk sekarang.** Kalau mau distinct heading, tambah satu font display rounded nanti — keputusan terpisah.
- **Skala (tokens):** `--text-xs: 12px`, `--text-sm: 13px`, `--text-md: 15px`, `--text-lg: 18px`, `--text-xl: 24px`.
- **Heading:** hero `clamp(40px, 6vw, 76px)`, section `clamp(26px, 3vw, 42px)`.
- **Berat:** judul & tombol → 800–900; body → 400–500; label → 600–700.
- **Wrap:** heading pendek `text-wrap: balance`; body/deskripsi `text-wrap: pretty`. Angka skor/poin/countdown → `font-variant-numeric: tabular-nums`.
- **Jangan ada teks < 12px** di seluruh produk.

## 5. Spacing & Radius

### 5.1 Spacing (base unit)

```css
--gap-1: 6px;   --gap-2: 10px;  --gap-3: 16px;
--gap-4: 24px;  --gap-5: 36px;
```

- Padding kartu: `gap-3` (16) atau `gap-4` (24).
- Padding section: `clamp(34px, 5vw, 70px) 0`.
- Gap antar kartu: 14px mobile, 16–18px desktop.

### 5.2 Radius (satu skala)

| Token | Nilai | Dipakai di |
|---|---|---|
| `--radius-sm` | 12px | input, chip, tombol kecil, thumbnail |
| `--radius` | 18px | kartu, tile, panel |
| `--radius-lg` | 24px | modal, hero, surface besar |
| pill | 999px | badge, tab, tombol rounded-full |

**Aturan:** elemen bertingkat pakai "concentric radius" — radius luar = radius dalam + padding. Jangan campur radius eksentrik acak.

## 6. Icon System

- Satu set ikon sistem: `src/components/Icon.tsx` (stroke tunggal, viewBox 24, `currentColor`). Ukuran default 24; kecil 18; besar 40.
- Icon game memakai `GameIcon` (filled, dua-tone) — dipakai ulang di kartu home, tile `/games`, hero `/games/[slug]`.
- **Aturan:** jangan pakai emoji sebagai ikon navigasi. Icon ikon tidak boleh beda-beda stroke untuk fungsi yang sama.
- Hit area minimum 44×44 px.

## 7. Motion

- **Enter:** opacity + translateY kecil (8–12px). **Exit:** lebih pendek & tenang (~150ms).
- **Press (touch):** `scale(0.96)`.
- **Hover kartu:** translateY(-3px) + shadow; jangan `transition: all`, sebut property.
- **Durasi:** 140–180ms ease-out.
- **`prefers-reduced-motion`:** matikan animasi transisi (sudah ada di base).
- Jangan pakai `will-change: all`.

## 8. Component States

Setiap komponen interaktif wajib punya state: default, hover, active, focus-visible, disabled, dan (bila perlu) loading/empty/error.

- **Focus:** outline 3px `rgba(var(--brand), .45)`, offset 3px.
- **Disabled:** opacity ~.6, cursor not-allowed, tanpa shadow.
- **Tombol:** min-height 56px (`--tap`) untuk aksi utama; 48px (`--tap-sm`) sekunder.
- **Kartu tautan:** satu target tap utuh; jangan ada banyak target kecil bertumpuk.

## 9. Core Components

| Komponen | Spesifikasi |
|---|---|
| `AppShell` | satu shell; mobile bottom nav icon-only + Discover FAB tengah; desktop top navbar full-width + glass saat scroll |
| `TopNavbar` | full-width bar, `--brand` hanya di link aktif, tanpa login |
| `BottomNavbar` | 5 item icon-only; Discover = kotak membulat `--brand` di tengah |
| `GameCard` (home) | gradien `strong` game + nomor badge + overlay hover |
| `GameTile` (`/games`) | gradien `mid` game + GameIcon + label; hover `soft` + teks |
| `Tile` (Discover) | surface + aksen `--brand-soft`, icon/huruf; hover lift |
| `LeaderboardRow` | rank circle, nama, skor besar `tabular-nums`, tombol "..." dengan menu share icon |
| `Modal` (leaderboard) | `--radius-lg`, avatar, skor besar, share icon, footer brand |
| `Button` | `--brand` primary, `--surface` ghost, `--bad` danger; semua `--radius-sm` atau pill |
| `Badge / Pill` | `--gold` untuk poin/medali, `--brand-soft` untuk tag |

## 10. Page Rules (per halaman)

**Home**
- Hero: gradien `--brand-soft`→lembut, headline besar + `--pink` CTA, ilustrasi `hero-product` (geometri, bukan SVG acak).
- Game grid: `strong` gradien per game + nomor badge 01–10 + overlay hover.
- "Rekomendasi Hari ini": 4 tile foto, hover overlay, acak tiap buka.
- Leaderboard strip: baris `surface` + rank badge gold.

**Games (`/games`)**
- Toggle grid/list. Grid pakai gradien `mid` per game + GameIcon. **Jangan abu-abu seragam.**

**Game detail (`/games/[slug]`)**
- Hero pakai `soft` warna game + GameIcon besar; fakta (usia/pemain/input) jadi chip; CTA `--brand`.

**Discover**
- Toggle grid/list. Tile surface + aksen `--brand-soft`; produk = foto + overlay; artikel = tile surface + judul.
- Pagination: 9 per kategori + tombol "More".

**Leaderboards**
- Banner countdown (timer besar + "reset sebelum dd/mm/yy" kecil, terpusat).
- Baris: rank circle, nama, skor besar, tombol "..." (menu share icon). Klik baris → modal profil + share.

**Account & About**
- Menu grid `surface` + aksen icon. Halaman About 5W2H memakai `LegalPage` (surface + muted), judul `--navy`.

**Auth (login/signup/forgot/reset)**
- `dialog-card` `--radius-lg`, input `--radius-sm`, tombol `--brand`. Fokus jelas.

**Admin (owner)**
- Stat cards `--surface-2` + angka `tabular-nums`; grafik menyusul.

## 11. Responsive

- **Mobile-first.** Breakpoint: 640px (2 kolom), 768px (tablet, bottom-nav hilang), 960px (3 kolom), 1080px+ (desktop penuh).
- Bottom-nav mobile: fixed + safe-area; disembunyikan di immersive `(/play`, `/admin)`.
- Grid game: 2 → 3 → 5 kolom. Discover/artikel: 1 → 2 → 3 kolom.
- Kamus lebar: jangan `overflow-x: hidden` tanpa alasan; lay out `min-width:0` pada grid item.

## 12. Accessibility

- Keyboard navigation untuk seluruh public UI; focus-visible jelas.
- Contrast AA untuk body & controls; jangan warna sebagai satu-satunya sinyal status.
- Hit area ≥ 44×44; label untuk icon button (aria-label).
- `aria-live` hanya untuk feedback penting (countdown, score, toast).
- Hormati `prefers-reduced-motion` & `prefers-color-scheme`.
- Semantic landmark (`<main>`, `<nav>`, `<section>`); jangan nested `<main>` ganda.
- Form error dekat field + summary.

## 13. Reference tokens (CSS, salin ke `:root`)

```css
:root {
  --brand: #3f7ad8; --brand-strong: #2f63bd; --brand-soft: #e7eefb;
  --lime: #c8f26b; --pink: #ff567f; --gold: #fcd34d;
  --good: #17a866; --bad: #e2445c;
  --navy: #0f2344; --ink: #17233b; --muted: #5d6b85;
  --line: #dce3ef; --surface: #ffffff; --page: #f5f7fb; --surface-2: #eef2fa;
  --radius-sm: 12px; --radius: 18px; --radius-lg: 24px;
  --shadow: 0 18px 48px rgba(26,47,83,.12);
  --shadow-sm: 0 6px 16px rgba(15,35,68,.06);
}
```

## 14. Migration checklist (urutan kerja)

1. Terapkan token baru `--brand/*`, `--surface-2`, `--radius-lg`, `--shadow-sm` di `globals.css`.
2. Buat helper gradien (`strong`/`mid`/`soft`) dari `CARD_THEMES` per game.
3. Terapkan identitas game konsisten: home → `strong`, `/games` & Discover → `mid`, hover → `soft`.
4. Ganti hex navy hardcoded (~53) ke token `--page`/`--surface`/`--surface-2`; hapus yang tidak perlu.
5. Rapi-kan radius ke skala `--radius-*`; terapkan concentric radius.
6. Konsolidasikan `.gradient-text` jadi satu definisi.
7. Pastikan overlay/teks di dark memakai `--surface-2` + teks terang (bukan `--navy` background).
8. Audit warna per halaman; pastikan tiap halaman punya minimal satu aksen playful (lime/pink/gold/game color).

## 15. Anti-pattern (jangan)

- Jangan pakai banyak hex navy/blue campur; pakai token.
- Jangan seragamkan semua game jadi abu-abu di katalog; pertahankan identitas.
- Jangan `transition: all` atau `will-change: all`.
- Jangan pakai emoji sebagai ikon navigasi.
- Jangan buat nested `<main>` atau nested card dalam card.
- Jangan hardcode kontras yang gagal di dark (bg `--navy` + teks putih).

## 16. Keputusan yang berdampak luas (untuk dikoreksi user)

1. **Identitas game konsisten di semua halaman** (rekomendasi: ya) vs game colorful hanya di home.
2. **Dark palette** diperluas (bg `#0b1122`, surface `#121a2f`, elevated `#1a2743`, brand light).
3. **Font kedua** heading ditunda; kalau mau, satu font rounded display untuk judul saja.
4. **Aksen playful** dipilih: lime (energi) + pink (CTA) + gold (poin). Bisa disesuaikan intensitasnya.

Dokumen ini adalah satu-satunya acuan visual. Perubahan visual harus konsisten dengan (atau memodifikasi) file ini.
