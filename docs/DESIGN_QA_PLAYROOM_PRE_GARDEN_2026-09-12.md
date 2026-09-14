# Design QA — Mainlagi Playroom

Tanggal: 12 September 2026
State: child home untuk profil demo dan halaman subject Bahasa Indonesia
Final result: `passed`

## Bukti pembanding

- Source visual truth: `C:/Users/Amand/.codex/generated_images/01a09023-21ac-7731-b550-7c46ac70d588/exec-dd40e886-0136-45d7-805c-a5142ae99840.png`
- Source pixels: 1505×1045, density metadata 72 dpi.
- Implementasi: `C:/Users/Amand/Documents/ChatGPT/mainlagihub/.qa/screenshots/1440x900/child-demo-gian-home.png`
- Implementation pixels/CSS viewport: 1440×900, deviceScaleFactor 1.
- Normalisasi: source di-fit tanpa distorsi ke frame 1440×900 dengan latar cream; implementasi dipertahankan 1440×900.
- Combined comparison: `C:/Users/Amand/Documents/ChatGPT/mainlagihub/.qa-playroom/design-comparison.png` (kiri source, kanan implementasi).
- Subject before/after: `C:/Users/Amand/Documents/ChatGPT/mainlagihub/.qa-playroom/subject-before-after.png` (kiri UI lama dari screenshot user, kanan implementasi baru pada fresh demo).

## Hasil full-view

Tidak ada temuan P0/P1/P2. Hierarki Playroom tetap sama: sapaan, satu rekomendasi utama, lalu direktori 3×3. Palet cream/forest/coral/sage, radius, whitespace, dan ilustrasi karakter mempertahankan arah visual source. Penghapusan `Jelajahi` adalah perubahan produk yang diminta user agar tidak ada navigasi ganda, bukan drift yang perlu dipulihkan.

## Fidelity surfaces

- Typography: Noto Sans konsisten, bobot display dan body terbaca, tanpa truncation pada desktop/mobile. Skala implementasi sedikit lebih tenang daripada concept art; diklasifikasikan P3 karena user sudah menyetujui beranda.
- Spacing/layout: struktur dan ritme sesuai konsep. Browser 390×844 dan desktop tidak memiliki horizontal overflow atau interactive control di luar viewport.
- Colors/tokens: cream, forest teal, sage, coral, dan pastel subject konsisten; CTA coral cukup kontras dan state aktif jelas.
- Image quality: ilustrasi kucing/robot memakai aset raster transparan yang dibuat khusus dari arah visual, tajam dan tidak diregangkan. Ikon subject memakai keluarga vector icon yang konsisten; tidak menggantikan hero art dengan CSS/placeholder.
- Copy/content: bahasa anak singkat; tidak ada jargon mastery/evidence pada flow aktif. Jumlah `siap dimainkan`, `selesai`, dan `100 total` dipisahkan agar breadth katalog tidak disamakan dengan unlock.
- Responsiveness/accessibility: mobile 390×844 tidak overflow; kontrol bisa dibaca oleh accessibility tree; state audio fallback memakai status text; console error/warn kosong.

Focused-region comparison tidak diperlukan untuk hero karena full-view 2880×900 membuat tipografi, CTA, crop aset, dan sembilan subject terbaca. Halaman subject diperiksa terpisah dengan combined before/after karena perubahan utamanya adalah struktur informasi, bukan pixel matching.

## Interaksi browser yang diuji

- Beranda hanya menampilkan `Beranda` dan `Main gerak`; tidak ada `Jelajahi`.
- Bahasa Indonesia dibuka langsung dari `Pilih kesukaanmu`.
- Halaman subject tidak menampilkan switcher sembilan subject; menampilkan jumlah ready/completed/total dan progression stage.
- `/child/demo-gian/learn` mengarah ke `/child/demo-gian/home#choose-subject`.
- Activity `bahasa-dengar-a` menolak voice non-Indonesia dan menampilkan petunjuk teks; tidak ada console error/warn.
- Desktop dan mobile diperiksa, termasuk bounds seluruh link/button dan document width.

## Comparison history

1. Versi awal memiliki halaman `Jelajahi` terpisah dan subject switcher di dalam halaman Bahasa; user menilai ini sebagai sistem di dalam sistem. Perbaikan: hapus nav duplikat, redirect route legacy, dan jadikan beranda satu-satunya direktori subject.
2. Versi awal menyatakan `100 aktivitas · terbuka bertahap` tanpa membedakan yang bisa dimainkan. Perbaikan: tiga angka eksplisit `siap dimainkan`, `selesai`, dan `100 total`, sementara aturan unlock tetap sama.
3. Browser/OS tanpa voice `id-ID` sebelumnya dapat memakai default English voice. Perbaikan: locale gate fail-closed dan fallback teks; regression test memastikan English-only voice tidak pernah membaca prompt Indonesia.
4. Post-fix evidence: full QA PASS 900/900 activity route, 0 blocker, 8 warning exposure; browser desktop/mobile tidak menemukan overflow atau console error.

## Follow-up polish

- P3: ornament logo dan avatar anak di concept art tidak dipakai; implementation memakai profil netral agar tidak menciptakan foto anak palsu.
- P3: ukuran heading/category icon lebih kecil daripada concept art. Ini dapat dieksplorasi lagi setelah usability test anak/orang tua, tanpa mengubah hierarchy saat ini.
- Audio Indonesia berkualitas natural masih memerlukan aset prerecorded/neural yang dilisensikan dan diuji di perangkat; fallback sekarang hanya mencegah voice Inggris yang menyesatkan.

## Implementation checklist

- [x] Tidak ada P0/P1/P2 visual atau interaction blocker.
- [x] Source dan implementation dibandingkan dalam satu gambar.
- [x] Desktop/mobile, primary interactions, dan console diperiksa.
- [x] Full product QA memeriksa 900/900 activity route.
- [x] Perubahan belum di-commit, push, atau deploy.

final result: passed
