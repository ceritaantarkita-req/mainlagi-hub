# Changelog

## Unreleased — 21 September 2026

- Menyelesaikan rangkaian WS-13 product UX sampai parent/profile/settings responsive redesign.
- Menambahkan child home/header/navigation baru dan subject directory 3 kolom.
- Menambahkan activity gallery hierarchy + QA unlock yang terisolasi.
- Menyatukan completion experience, memperbaiki matching randomization/retry, dan mengurangi first-instruction narration latency.
- Parent mobile sekarang memakai sticky header + fixed 5-item bottom navigation di bawah 760px; desktop memakai sidebar.
- Memisahkan identity child profile dari guide character pada parent UI dan memisahkan real family data dari `demo-gian`.
- Parent runtime live verified melalui PR #251 -> main `77bee682...`, CI #1160 exact Cloudflare smoke.
- Logic repeating-pattern audit PR #240 sudah merged/live verified; runtime `pattern_completion` reuse belum dimulai dan tidak membuat Pattern #48.
- Subject-background system sudah merged/live verified untuk 9 subject / 900 activity dengan 54 scene family dan 108 responsive WebP.
- Activity character-presentation foundation sudah merged/live verified via PR #259 -> `b5acbfcde66ea1451f3e55a8d469d33ba4845af1`; merged-main CI #1190 / run `35589937017` sukses termasuk exact Cloudflare production smoke.
- Runtime character sekarang fail closed: Gavi/Paca tetap satu-satunya approved foreground runtime asset; Naya/Gian/Zia design sheets hanya reference sampai production asset terpisah lolos review.
- Canonical five-character runtime asset registry PR #262 sudah merged/live verified di `ceb2546b...`; CI #1196 / run `35594336327` full success termasuk exact Cloudflare production smoke.
- Character asset production pipeline PR #263 sudah merged/live verified di `e4d7b428...`; CI #1198 / run `35599025558` full success termasuk exact Cloudflare production smoke.
- Production-only path `public/artwork/characters/`, machine-readable provenance registry Naya/Gian/Zia, WebP alpha/dimension/size validator, default git-ignore friction, serta regression fixtures sekarang blocking; wave ini tidak menambah atau mengaktifkan binary karakter manusia.
- Next product UX dikunci: production spec Naya/Gian/Zia -> isolated transparent runtime assets -> provenance + responsive QA -> activation via central resolver -> baru five-character hero, English voice quality, learning illustration consistency, dan broader human/device acceptance.
- Tidak ada perubahan mastery/evidence/progression/schema dari sinkronisasi dokumentasi ini.


## 2.0.1 — 5 Agustus 2026

- Memperbaiki urutan `VERIFY_WINDOWS.ps1`: `npm install` sekarang berjalan sebelum gate yang memerlukan TypeScript.
- Menambahkan pemeriksaan eksplisit untuk `node_modules\.bin\tsc.cmd`.
- Mengoreksi dokumentasi portable gate.
- Tidak mengubah gameplay, vision runtime, recognizer, maupun UI.
