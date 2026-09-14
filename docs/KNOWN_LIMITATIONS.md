# Known Limitations

Package ini adalah candidate rebuild V2 yang dapat diaudit dan diuji. Ia bukan jaminan bahwa setiap webcam, kondisi pencahayaan, browser, credential, dan deployment bebas defect.

## Status lingkungan lokal — 11 September 2026

Dependency, TypeScript, ESLint, production build, learning engine, dan audio
tests telah dijalankan di workspace Windows. Kegagalan registry di bawah
adalah catatan **historis environment pembuat ZIP**, bukan keadaan laptop saat ini.
Lihat [hasil perbaikan lokal](LOCAL_REDESIGN_2026-09-11.md) untuk validasi
revisi yang sekarang sudah di-commit dan di-push melalui PR #87, tetapi belum
di-merge atau di-deploy.

## Historis: dependency-aware build environment pembuat ZIP

`npm install` gagal karena registry internal environment mengembalikan `404` untuk:

```text
@mediapipe/tasks-vision@0.10.35
```

Karena dependency tidak dapat di-install, environment ini tidak dapat menjalankan:

- dependency-aware `tsc --noEmit`;
- ESLint dengan package Next;
- real `next build`;
- npm production audit.

Yang sudah dijalankan:

- portable TypeScript check;
- pure engine compilation;
- 13 engine tests;
- lima complete portable pass;
- 25 seeded simulation runs;
- source/security/structure audit;
- static responsive visual preview.

Laptop penerima wajib menjalankan:

```powershell
powershell -ExecutionPolicy Bypass -File .\VERIFY_WINDOWS.ps1
```

Jangan push/merge ketika script gagal.

## Physical webcam

Synthetic landmark tests tidak membuktikan akurasi kamera nyata. Pengujian fisik masih diperlukan untuk:

- internal/external webcam;
- terang, indoor, redup, dan backlight;
- child/adult;
- tangan kanan/kiri;
- 1/2 pemain;
- partial occlusion dan crossing hands;
- sesi 10 menit dan camera restart.

## Iqro

- Catalog saat ini berisi 100 aktivitas Iqro dan 22 active skills/packs; seluruh
  materi tetap berstatus `expert_required` sampai direview pengajar kompeten.
- Template bentuk, titik, transliterasi, dan speech synthesis wajib direview pengajar kompeten.
- Tidak menilai tajwid, pronunciation quality, huruf sambung, atau standard kaligrafi resmi.

## AirBoard

- PDF memakai browser object renderer sebagai satu embedded document.
- Per-page PDF rendering belum tersedia.
- Audience window synchronization belum dimigrasikan.
- Screen recording belum dimigrasikan.

## Full-body depth

Run to Target mengestimasi maju/mundur dari relative torso scale. Webcam biasa tidak mempunyai true depth sensor. Kalibrasi dan physical test wajib dilakukan.

## Google OAuth dan cloud data

Live OAuth, callback, RLS, RPC, dan database write membutuhkan Supabase project serta credential milik user. Credential tersebut tidak disertakan dalam ZIP.

## Affiliate

Default item memakai example/demo destination. Ganti dengan campaign affiliate URL yang sah melalui admin/database sebelum production.

## Browser support

Chrome dan Edge modern menjadi target utama. Safari/Firefox camera behavior belum dibuktikan dalam audit ini.
