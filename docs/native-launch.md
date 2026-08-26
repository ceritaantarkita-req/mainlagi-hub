# Native Launch (Android / iOS via Capacitor)

Direction: `docs/adr-0001-architecture.md` (Decision A: SSR standalone). This page
covers the wrapper strategy, the store-readiness checklist, and the honest
architecture trade-off.

---

## The one decision you must understand

Aap menggunakan **SSR** (cookie session via Supabase + `proxy.ts`) dan **Next server
actions**. Ini tidak bisa berjalan dari file statis di dalam WebView. Jadi wrapper
Capacitor memakai **`server.url`**: WebView memuat web app yang sudah di-deploy di
HTTPS. Aplikasi native adalah shell tipis yang menunjuk ke URL produksi.

| Pendekatan | Status |
|---|---|
| `server.url` → WebView memuat app ter-hosting | ✅ Dipakai. Mempertahankan SSR, auth cookie, SEO. |
| Static export (`output: "export"`) + `webDir` | ❌ Tidak dipakai. Membuang cookie session SSR & server actions; perlu auth rewrite. |

Konsekuensi: aplikasi butuh backend selalu online. Ini wajar untuk launch awal.
Bila butuh offline penuh, itu adalah keputusan besar terpisah (statis + auth
browser-only) yang sebaiknya didiskusikan sebelum dikerjakan.

---

## Prerequisites

- Android: Android Studio + SDK.
- iOS: macOS + Xcode (tidak bisa dibangun di Windows).
- Backend production (Supabase + site URL) sudah live dan HTTPS.
- `NEXT_PUBLIC_SITE_URL` dienv production = URL yang akan dipakai WebView.

---

## Commands

```bash
# build web + sync native
npm run cap:sync

# add platforms (sekali saja)
npm run cap:add:android
npm run cap:add:ios

# buka IDE
npm run cap:open:android
npm run cap:open:ios
```

---

## Permissions yang harus didaftarkan

- **Camera** — diperlukan untuk game gerak.
  - Android: `CAMERA` di manifest + runtime permission.
  - iOS: `NSCameraUsageDescription` (teks jelas untuk apa).
- **Microphone** — aplikasi **tidak** memakai audio → jangan daftarkan izin mikrofon (minimalkan permission).
- **Internet** — wajib (WebView memuat `server.url`).

Teks permission wajib menjelaskan tujuan (bahasa Indonesia + bahasa app store).

---

## App Store readiness checklist

### Android (Google Play)

- [ ] Package/appId sesuai (`tv.mainlagi.motionlearnhub`).
- [ ] Ikon launcher + adaptive icon (maskable).
- [ ] Screenshot (min 2, ukuran sesuai ketentuan).
- [ ] **Data safety form** jujur sesuai `docs/prd.md` + `docs/data-layer.md`.
- [ ] URL privacy policy (`/privacy`).
- [ ] URL account deletion (`/account/delete`).
- [ ] Kids/Families policy jika target anak.
- [ ] Versi + signing config.
- [ ] Test pada perangkat low-end.

### iOS (App Store)

- [ ] Bundle ID konsisten.
- [ ] Ikon + launch screen.
- [ ] Screenshot (viewport perangkat).
- [ ] **Privacy policy URL**.
- [ ] **Account deletion URL** (wajib untuk app dengan akun).
- [ ] Support URL.
- [ ] App Privacy (data collection) akurat.
- [ ] Sign in with Apple bila menawarkan login sosial (review requirement).
- [ ] Test iPhone Safari/WebView camera + memory.

---

## Privacy declarations (sesuai PRD)

- Data yang dikumpulkan: akun (email/nama), profil pemain (alias, kelompok umur), skor, preferensi.
- Kamera: diproses lokal, tidak disimpan/diunggah.
- Tidak ada biometrik dikirim.
- Affiliate: tracking click diminimalkan.
- Retention: sesuai dokumen legal + delete account.

---

## Device matrix (wajib sebelum submission)

| Perangkat | Status |
|---|---|
| iPhone (Safari/WebView) | Perlu uji |
| Android low-end | Perlu uji |
| Permission denied | Perlu uji |
| Permission revoked | Perlu uji |
| App background saat kamera aktif | Perlu uji |
| Back navigation dari game | Perlu uji |
| Orientation change | Perlu uji |
| Memory pressure | Perlu uji |
| Offline | WebView butuh backend; tampilkan pesan |
| Model load failure | Perlu uji |
| Account deletion | Perlu uji |
| Share (native share sheet) | Perlu uji |

---

## Implementation status

- `capacitor.config.ts` ✅ (server.url WebView).
- `@capacitor/core`, `@capacitor/cli` ✅ (deps).
- Scripts `cap:*` ✅.
- Platform `android/`, `ios/` belum di-generate (butuh environment native).
- Build native belum dijalankan (butuh Android Studio / Xcode).

## Notes

- Karena memakai `server.url`, perubahan web langsung tersedia di app setelah re-deploy — tidak perlu re-bundle tiap perubahan.
- Remote MediaPipe WASM/model memakai CDN; pastikan di-review security (integrity) sebelum produksi.
