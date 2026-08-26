# Visual and Product Fidelity Ledger

Target yang diminta bukan mempertahankan screenshot V1, melainkan membuat rebuild yang jelas berbeda dan memenuhi keputusan produk baru.

## Perbandingan material

| V1 yang ditolak | V2 corrected |
|---|---|
| Header Motion Learning Hub dengan emoji | Header Mainlagi Hub memakai asset logo user |
| Hero `Belajar Seru, Gerak & Pintar` | Hero `Gerak badan. Gerak pikiran.` |
| Empat card besar + companion section | Sembilan internal module dalam indexed activity list |
| Companion project membuka app eksternal | Semua route `/play/[slug]` internal |
| Kamera langsung tertutup panel game | Layar preflight terpisah sebelum countdown |
| Satu pemain masih terasa split | Satu pad penuh; divider hanya untuk 2 pemain |
| Tidak ada body skeleton | Preflight/arena memiliki pose skeleton overlay |
| Satu-stroke auto-finish | Multi-stroke pinch/release + explicit submit |
| Local-only identity | Guest mode + optional Google OAuth/Supabase |
| Tidak ada affiliate management | Affiliate API, redirect tracking, dan admin route |

## Screenshot evidence

- `qa/home-desktop.png`
- `qa/home-mobile.png`
- `qa/preflight-desktop.png`

## Comparison points yang diperiksa

1. Brand mark dan product naming berbeda dari V1.
2. Hero copy, composition, dan visual stage berbeda.
3. Tepat sembilan module muncul sebagai internal activity list.
4. Desktop tidak memiliki horizontal overflow.
5. Mobile 390 px tidak memiliki horizontal overflow.
6. Preflight mempunyai lima diagnostic steps sebelum countdown.
7. Player-count control dan camera/demo control terlihat sebelum arena.
8. Preflight tidak menggunakan “kotak dalam kotak” di atas live gameplay.

## Intentional limitations

- Screenshot QA berasal dari generated static preview karena dependency registry environment tidak menyediakan MediaPipe package untuk menjalankan full Next.js build.
- Preview memastikan visual structure, bukan runtime camera behavior.
- Final runtime visual harus diperiksa kembali setelah `npm install` dan `npm run dev` di laptop target.
