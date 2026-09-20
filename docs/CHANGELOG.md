# Changelog

## Unreleased — 20 September 2026

- Menyelesaikan rangkaian WS-13 product UX sampai parent/profile/settings responsive redesign.
- Menambahkan child home/header/navigation baru dan subject directory 3 kolom.
- Menambahkan activity gallery hierarchy + QA unlock yang terisolasi.
- Menyatukan completion experience, memperbaiki matching randomization/retry, dan mengurangi first-instruction narration latency.
- Parent mobile sekarang memakai sticky header + fixed 5-item bottom navigation di bawah 760px; desktop memakai sidebar.
- Memisahkan identity child profile dari guide character pada parent UI dan memisahkan real family data dari `demo-gian`.
- Parent runtime live verified melalui PR #251 -> main `77bee682...`, CI #1160 exact Cloudflare smoke.
- Logic repeating-pattern audit PR #240 sudah merged/live verified; runtime `pattern_completion` reuse belum dimulai dan tidak membuat Pattern #48.
- Next product UX: production character specification + Naya/Gian/Zia assets, lalu subject themes dan English voice quality.
- Tidak ada perubahan mastery/evidence/progression/schema dari sinkronisasi dokumentasi ini.


## 2.0.1 — 5 Agustus 2026

- Memperbaiki urutan `VERIFY_WINDOWS.ps1`: `npm install` sekarang berjalan sebelum gate yang memerlukan TypeScript.
- Menambahkan pemeriksaan eksplisit untuk `node_modules\.bin\tsc.cmd`.
- Mengoreksi dokumentasi portable gate.
- Tidak mengubah gameplay, vision runtime, recognizer, maupun UI.
