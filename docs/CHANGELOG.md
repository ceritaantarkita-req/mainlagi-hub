# Changelog

## Unreleased — 22 September 2026

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
- Repository governance hardening PR #269 sudah merged/live verified di `6fd9e3fc...`; PR CI #1208 dan merged-main CI #1209 full success termasuk exact Cloudflare production smoke.
- Pinned full-history Gitleaks sekarang juga berjalan sebagai `Required full-history secret gate` di dalam ruleset-required `Production dependency audit`, sehingga secret finding memblok merge; standalone `Secret history scan` tetap dipertahankan untuk visibility.
- Issue #83 sekarang hanya melacak physical-device acceptance; tidak ada lagi account/UI action terpisah untuk secret-scan enforcement.
- Tidak ada perubahan mastery/evidence/progression/schema dari sinkronisasi dokumentasi ini.
- Draft PR #272 menambahkan implementasi terisolasi **Mainlagi World / Petualangan Uang**: 8 Stage, illustrated journey map, audio-first story segments, reusable mini-game mechanics, Chapter 1 milestone, final visual recap, public-safe share landing, dan World-progress persistence terpisah dari canonical mastery.
- Known-green World code checkpoint `5c76f9812a93eb7ef07fff1880af4da5af2b4927` lulus CI #1290 / run `35679390492` pada Ubuntu, Windows, secret scan, dependency audit, production build, dan Mobile Chromium. PR tetap draft dan belum production.
- World checkpoint/restart record: `WORLD_PETUALANGAN_UANG_SAFE_CHECKPOINT_2026-09-22.md`.
- Visual World wave: Stage map diubah dari card-list menjadi compact alternating game-map nodes mengikuti winding path; activity UI dibuat sebagai floating tray di dalam illustrated scene; Chapter banner/star/finale spacing dipoles agar tidak saling menutup.
- Latest visual-green rollback: `checkpoint/world-petualangan-uang-visual-green-20260922` @ `3b033405b41abcfab4c70d9db76265095ff7c5e2`, CI #1314 / run `35682393320` full pass.


## 2.0.1 — 5 Agustus 2026

- Memperbaiki urutan `VERIFY_WINDOWS.ps1`: `npm install` sekarang berjalan sebelum gate yang memerlukan TypeScript.
- Menambahkan pemeriksaan eksplisit untuk `node_modules\.bin\tsc.cmd`.
- Mengoreksi dokumentasi portable gate.
- Tidak mengubah gameplay, vision runtime, recognizer, maupun UI.
