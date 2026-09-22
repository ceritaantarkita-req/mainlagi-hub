# Changelog

## Unreleased — 22 September 2026

- English narration quality Wave 1 PR #278 sudah merged/live verified: 27 English listening activities direview, terdiri dari 22 target-first narration + 5 sentence-level comprehension; browser English fallback sekarang memprioritaskan exact-locale Natural/Neural/Premium/Enhanced voice bila tersedia dan memakai prompt rate 0.92.
- English narration docs closure PR #279 sudah merged/live verified di main `397bcab1...`, CI #1369 exact Cloudflare smoke.
- English narration production asset gate PR #280 sudah merged/live verified ke main `2cc7d5be4d14f22a4efbb4ea27580d7a91a5bf48`; PR CI #1371 dan merged-main CI #1372 full success termasuk exact Cloudflare smoke.
- Registry produksi English narration sekarang mengunci exact 27 slot + exact runtime transcript, dengan status sengaja tetap 27 `review-required` / 0 approved / 0 binary / tanpa static-audio runtime activation.
- Permanent narration gate memblok stray public audio, missing provider/model/voice rights review, commercial-use/redistribution clearance, unresolved AI-disclosure decision, missing pronunciation/child-learning approval, invalid MP3 payload, SHA-256 drift, dan registry/runtime transcript drift.
- Safe handoff baru: `ENGLISH_NARRATION_SAFE_CHECKPOINT_2026-09-22.md`. Next aman adalah four-item provider/voice pilot + human listening/provenance review; jangan bulk generate 27 dan jangan activate runtime playback dulu.

- Menyelesaikan rangkaian WS-13 product UX sampai parent/profile/settings responsive redesign.
- Menambahkan child home/header/navigation baru dan subject directory 3 kolom.
- Menambahkan activity gallery hierarchy + QA unlock yang terisolasi.
- Menyatukan completion experience, memperbaiki matching randomization/retry, dan mengurangi first-instruction narration latency.
- Parent mobile sekarang memakai sticky header + fixed 5-item bottom navigation di bawah 760px; desktop memakai sidebar.
- Memisahkan identity child profile dari guide character pada parent UI dan memisahkan real family data dari `demo-gian`.
- Parent runtime live verified melalui PR #251 -> main `77bee682...`, CI #1160 exact Cloudflare smoke.
- Logic repeating-pattern audit PR #240 dan runtime reuse PR #273 sekarang **fully closed/live verified**; PR #273 merged ke main `709e2b7d...`, final PR CI #1321 dan merged-main CI #1353 full success termasuk exact Cloudflare smoke: 900/900, 47 active, `choice_grid` 174, `pattern_completion` 10, KEEP 900, tanpa Pattern #48.
- Dedicated Logic Pattern Completion browser QA lulus 320/390/768 dengan legitimate Wave A progression prerequisites, keyboard retry, touch/pointer completion, grouped `● ●` one-step evidence, dan permanent visual baseline 63 exact-path captures; merged-main artifacts tersimpan pada CI #1353.
- Subject-background system sudah merged/live verified untuk 9 subject / 900 activity dengan 54 scene family dan 108 responsive WebP.
- Activity character-presentation foundation sudah merged/live verified via PR #259 -> `b5acbfcde66ea1451f3e55a8d469d33ba4845af1`; merged-main CI #1190 / run `35589937017` sukses termasuk exact Cloudflare production smoke.
- Runtime character sekarang fail closed: Gavi/Paca tetap satu-satunya approved foreground runtime asset; Naya/Gian/Zia design sheets hanya reference sampai production asset terpisah lolos review.
- Canonical five-character runtime asset registry PR #262 sudah merged/live verified di `ceb2546b...`; CI #1196 / run `35594336327` full success termasuk exact Cloudflare production smoke.
- Menambahkan production-only path `public/artwork/characters/`, machine-readable provenance registry Naya/Gian/Zia, WebP alpha/dimension/size validator, serta regression fixtures; wave ini tidak menambah atau mengaktifkan binary karakter manusia.
- Character asset pipeline PR #263 sudah merged/live verified di `e4d7b428...`; merged-main CI #1198 / run `35599025558` full success termasuk exact Cloudflare production smoke. Next gate adalah candidate production asset review/provenance, bukan runtime activation langsung.
- Docs closure PR #264 sudah merged/live verified di `bb0645d...`; CI #1201 / run `35600793815` full success termasuk exact Cloudflare production smoke.
- Fresh Drive candidate intake audit tidak menemukan separate Naya/Gian/Zia foreground candidate; hanya tiga canonical design sheet. Next order dikunci Naya first -> Gian -> Zia, tanpa binary/runtime activation pada audit wave ini.
- Character production/development sekarang **PAUSED** oleh project owner; asset Drive karakter dipakai sebagai reference-only sampai ada instruksi eksplisit untuk resume. Mainlagi World juga dikerjakan terpisah dan tidak disentuh WS-05.
- Cloud learning analytics bug sudah ditutup melalui PR #267 -> main `89a2bc629e...`: fixed-cap 500 attempts / 2000 evidence diganti complete pagination; authenticated cloud failure tidak lagi diam-diam memakai local browser analytics.
- Regression baru mengunci 1.201 attempts + 3.603 evidence rows, small server caps, later-page failure, reconnect, stale request dan guest isolation; `test:learning:cloud-analytics` masuk aggregate learning suite.
- Merged-main CI #1205 / run `35621724090` full success termasuk exact Cloudflare production smoke; analytics closure record ada di `CLOUD_ANALYTICS_PAGINATION_CLOSURE_2026-09-21.md`.
- Repository governance hardening PR #269 sudah merged/live verified di `6fd9e3fc...`; PR CI #1208 dan merged-main CI #1209 full success termasuk exact Cloudflare production smoke.
- Pinned full-history Gitleaks sekarang juga berjalan sebagai `Required full-history secret gate` di dalam ruleset-required `Production dependency audit`, sehingga secret finding memblok merge; standalone `Secret history scan` tetap dipertahankan untuk visibility.
- Issue #83 sekarang hanya melacak physical-device acceptance; tidak ada lagi account/UI action terpisah untuk secret-scan enforcement.
- Tidak ada perubahan mastery/evidence/progression/schema dari sinkronisasi dokumentasi ini.


## 2.0.1 — 5 Agustus 2026

- Memperbaiki urutan `VERIFY_WINDOWS.ps1`: `npm install` sekarang berjalan sebelum gate yang memerlukan TypeScript.
- Menambahkan pemeriksaan eksplisit untuk `node_modules\.bin\tsc.cmd`.
- Mengoreksi dokumentasi portable gate.
- Tidak mengubah gameplay, vision runtime, recognizer, maupun UI.
