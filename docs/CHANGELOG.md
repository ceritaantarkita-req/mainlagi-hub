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
- Menambahkan production-only path `public/artwork/characters/`, machine-readable provenance registry Naya/Gian/Zia, WebP alpha/dimension/size validator, serta regression fixtures; wave ini tidak menambah atau mengaktifkan binary karakter manusia.
- Character asset pipeline PR #263 sudah merged/live verified di `e4d7b428...`; merged-main CI #1198 / run `35599025558` full success termasuk exact Cloudflare production smoke. Next gate adalah candidate production asset review/provenance, bukan runtime activation langsung.
- Docs closure PR #264 sudah merged/live verified di `bb0645d...`; CI #1201 / run `35600793815` full success termasuk exact Cloudflare production smoke.
- Fresh Drive candidate intake audit tidak menemukan separate Naya/Gian/Zia foreground candidate; hanya tiga canonical design sheet. Next order dikunci Naya first -> Gian -> Zia, tanpa binary/runtime activation pada audit wave ini.
- Next product UX dikunci: production spec Naya/Gian/Zia -> isolated transparent runtime assets -> provenance + responsive QA -> activation via central resolver -> baru five-character hero, English voice quality, learning illustration consistency, dan broader human/device acceptance.
- Cloud learning analytics bug sudah ditutup melalui PR #267 -> main `89a2bc629e...`: fixed-cap 500 attempts / 2000 evidence diganti complete pagination; authenticated cloud failure tidak lagi diam-diam memakai local browser analytics.
- Regression baru mengunci 1.201 attempts + 3.603 evidence rows, small server caps, later-page failure, reconnect, stale request dan guest isolation; `test:learning:cloud-analytics` masuk aggregate learning suite.
- Merged-main CI #1205 / run `35621724090` full success termasuk exact Cloudflare production smoke; analytics closure record ada di `CLOUD_ANALYTICS_PAGINATION_CLOSURE_2026-09-21.md`.
- Secret-history governance gap ditutup lewat PR #269 -> main `6fd9e3fc...`: Gitleaks full-history scan dipusatkan di satu script pinned dan juga dijalankan di dalam ruleset-required `Production dependency audit`, sehingga failure secret sekarang merge-blocking.
- PR CI #1208 dan merged-main CI #1209 membuktikan `Required full-history secret gate` PASS; #1209 juga lulus exact Cloudflare production smoke. Standalone `Secret history scan` tetap dipertahankan untuk visibility.
- Tidak ada perubahan mastery/evidence/progression/schema dari sinkronisasi dokumentasi ini.


## 2.0.1 — 5 Agustus 2026

- Memperbaiki urutan `VERIFY_WINDOWS.ps1`: `npm install` sekarang berjalan sebelum gate yang memerlukan TypeScript.
- Menambahkan pemeriksaan eksplisit untuk `node_modules\.bin\tsc.cmd`.
- Mengoreksi dokumentasi portable gate.
- Tidak mengubah gameplay, vision runtime, recognizer, maupun UI.
