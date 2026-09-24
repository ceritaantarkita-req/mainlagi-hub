# Changelog
- World evidence private-registry RLS read-only audit: table owner `postgres`, RLS disabled/no policies; `record_world_skill_evidence(...)` owner `postgres` + SECURITY DEFINER; browser roles have no direct table privileges/RPC execute; service_role has RPC execute only. No DB change applied; RLS enablement remains explicit operator decision.
- World evidence PR #312 merged/live verified ke `main` `ca7f0e77b296682935f9ecbe311cc1028168986f`; merged-main CI #1587 / run `35899987986` full success termasuk exact-SHA Cloudflare smoke. Production checkpoint `checkpoint/world-evidence-production-green-20260924`; DB tetap 0 supplemental evidence rows; first eligible live write pending; private-registry RLS hardening dicatat sebagai explicit operator decision.
- Historical World Draft PRs #282/#295/#305/#307/#308/#309/#310 ditutup sebagai superseded setelah ancestry diverifikasi; seluruh head sudah terkandung di PR #312, yang tetap Draft/unmerged sebagai satu-satunya release path.
- World evidence release candidate integrated current `main` semantic/narration/illustration work with the full Petualangan Uang + evidence stack via two-parent merge `e4999265033b0263e906c2fe287fc08d09bde0bc`; Draft PR #312 / CI #1584 full success. Supabase remains live through 0051; main/Cloudflare deployment and controlled Stage 8 evidence verification remain pending.
- Semantic P0 human-review gate PR #304 merged ke main `f0b48cbdbe162fd19e0665f4b29945f6aaa16a5f`; PR CI #1552 / run `35816166334` full success. Gate mengikat review ke exact 9 file + manifest/file SHA, mendukung per-item accept/reject, dan tetap 0 human decision / 0 production approval / 0 runtime activation.
- PR #302 ditutup sebagai superseded agar docs prereview lama tidak mengembalikan wording next-gate yang sudah usang.
- Semantic P0 source refinement PR #301 merged/live verified ke main `9f6270c79bb92f7cb6ce1d29a2165df54801debf`; merged-main CI #1548 / run `35807137419` full success termasuk exact Cloudflare production smoke.
- Semantic P0 human-review evidence gate disiapkan pada branch `agent/semantic-p0-human-review-gate-20260923`: exact 9 files + manifest/file SHA binding, per-item accept/reject, tamper/stale rejection, dan zero registry/public/runtime mutation. Human decision belum direkam dan tidak boleh difabrikasi.
- Safe checkpoint baru: `LEARNING_SEMANTIC_SAFE_CHECKPOINT_2026-09-23.md`.
- Semantic P0 candidate generator PR #300 merged/live verified ke main `89adf887e270c2451ae81af8cd6a9bae0b798fbd`; merged-main CI #1546 / run `35805378889` full success termasuk exact Cloudflare production smoke.
- AI visual pre-review 96/64/48/32px menemukan tujuh candidate cukup jelas untuk lanjut exact human review; source `action.jump` dan `feature.cactus-thick-stem` diperjelas sebelum human review. Tidak ada production approval/runtime activation.

## Unreleased — 23 September 2026

- Semantic illustration provenance gate PR #297 sudah merged/live verified ke main `ed7db8a6c5b8a3ee4acc9bcca260b4e0b5776773`; PR CI #1536 / run `35769098899` dan merged-main CI #1537 / run `35770021133` full success termasuk exact Cloudflare smoke.
- Menambahkan registry semantic illustration 17-slot + dedicated `public/artwork/learning-illustrations/` fail-closed validator: 17 review-required / 0 approved / 0 production binary / 0 runtime activation.
- Preliminary reuse review: apple/cat/fish/umbrella/car/cup/house/bird visually-suitable tetapi provenance-pending; `color-object-ball.webp` eksplisit rejected sebagai semantic ball.
- Next aktif bukan infrastructure lagi: exact P0 art untuk HEAD/JUMP/gills/beak/cactus stem/towel/raincoat/toy-block, lalu provenance + child-readability approval + SHA, dan runtime mapping terpisah.
- Learning-illustration audit PR #287 sudah merged/live verified ke main `bea1380e...`, main CI #1453 exact Cloudflare smoke; inventory 43 source files / 280 canonical batch-wave `emoji:` fields tetap dianggap inventory signal, bukan 280 defect.
- Learning visual containment PR #294 sudah merged/live verified ke main `6d0f9bd8972297e316bdf031603d160d901d8d04`; PR CI #1529 / run `35763091032` dan merged-main CI #1531 / run `35764397545` full success termasuk exact Cloudflare production smoke.
- Menambahkan shared `LearningVisualToken` + blocking bounding-box QA untuk Activity Gallery, Bahasa Initial Sound, Bahasa/English Picture & Word, Science Feature/Function, dan Science Material Lab pada 320/390/768/1280 plus canonical gallery matrix. CI menemukan dan memaksa fix Material Lab 30px collapse serta short-desktop feedback/CTA fit tanpa melemahkan assertion.
- Representative screenshot artifact #10710764036 direview; tidak ditemukan P0/P1 containment/readability blocker pada pilot surfaces.
- Containment sekarang closed. Next aktif adalah semantic illustration/provenance pilot kecil; mismatch seperti HEAD=`🙂`, JUMP=`🤸`, gills=`🫧`, beak=`👄`, towel=`🧺` tidak dianggap final production art.
- English narration quality Wave 1 PR #278 sudah merged/live verified: 27 English listening activities direview, terdiri dari 22 target-first narration + 5 sentence-level comprehension; browser English fallback sekarang memprioritaskan exact-locale Natural/Neural/Premium/Enhanced voice bila tersedia dan memakai prompt rate 0.92.
- English narration docs closure PR #279 sudah merged/live verified di main `397bcab1...`, CI #1369 exact Cloudflare smoke.
- English narration production asset gate PR #280 sudah merged/live verified ke main `2cc7d5be4d14f22a4efbb4ea27580d7a91a5bf48`; PR CI #1371 dan merged-main CI #1372 full success termasuk exact Cloudflare smoke.
- Registry produksi English narration sekarang mengunci exact 27 slot + exact runtime transcript, dengan status sengaja tetap 27 `review-required` / 0 approved / 0 binary / tanpa static-audio runtime activation.
- Permanent narration gate memblok stray public audio, missing provider/model/voice rights review, commercial-use/redistribution clearance, unresolved AI-disclosure decision, missing pronunciation/child-learning approval, invalid MP3 payload, SHA-256 drift, dan registry/runtime transcript drift.
- Safe handoff baru: `ENGLISH_NARRATION_SAFE_CHECKPOINT_2026-09-22.md`.
- Provider-pilot harness PR #283 sudah merged/live verified ke implementation baseline `4b975130bf6e5fc28cecbf6aea5373b7a1430c65`; PR CI #1395 / run `35719163695` dan merged-main CI #1396 / run `35719862989` full success, termasuk exact Cloudflare smoke.
- Harness mengunci exact empat activity, candidate OpenAI `gpt-4o-mini-tts-2025-12-15`, voice `marin`/`cedar`, dry-run default, output hanya di gitignored `internal/`, dan explicit `OPENAI_API_KEY` gate. Tidak ada audio candidate yang di-generate/commit oleh wave ini, registry tetap 27 `review-required`, 0 approved, 0 production binary, dan runtime static audio tetap tidak aktif.
- Next aman WS-02 sekarang adalah actual local/server-side candidate generation + human listening/provenance review untuk empat item itu; jangan bulk generate 27 dan jangan activate runtime playback dalam approval step yang sama.
- Human-review evidence gate PR #285 sudah **merged/live verified** ke main `dd84579624212b387a4e54dc93a5892c04de83d6`; exact-head PR CI #1412 / run `35724918622` dan merged-main CI #1415 / run `35725713601` full success, termasuk exact Cloudflare production smoke. Gate memverifikasi candidate manifest/path/MP3/bytes/SHA/transcript, mengikat review ke exact manifest/file SHA, dan human `accepted` wajib 16/16 rubric checks pass + reviewer/timestamp/listening attestation. Tool tidak bisa auto-approve registry, copy ke `public/`, atau activate runtime. Status tetap 0 generated pilot audio / 0 human-reviewed generated audio / 0 approved production audio.

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


- Draft PR #272 menambahkan implementasi terisolasi **Mainlagi World / Petualangan Uang**: 8 Stage, illustrated journey map, audio-first story segments, reusable mini-game mechanics, Chapter 1 milestone, final visual recap, public-safe share landing, dan World-progress persistence terpisah dari canonical mastery.
- Known-green World code checkpoint `5c76f9812a93eb7ef07fff1880af4da5af2b4927` lulus CI #1290 / run `35679390492` pada Ubuntu, Windows, secret scan, dependency audit, production build, dan Mobile Chromium. PR tetap draft dan belum production.
- World checkpoint/restart record: `WORLD_PETUALANGAN_UANG_SAFE_CHECKPOINT_2026-09-22.md`.
- Visual World wave: Stage map diubah dari card-list menjadi compact alternating game-map nodes mengikuti winding path; activity UI dibuat sebagai floating tray di dalam illustrated scene; Chapter banner/star/finale spacing dipoles agar tidak saling menutup.
- Latest visual-green rollback: `checkpoint/world-petualangan-uang-visual-green-20260922` @ `3b033405b41abcfab4c70d9db76265095ff7c5e2`, CI #1314 / run `35682393320` full pass.
- World presentation policy dikunci di code: pilot tetap usia **6–8**, 3–5 adalah future separate variant, 9–12 future separate series; satu World tidak boleh diam-diam berubah menjadi rentang 3–12 berdasarkan umur.
- Asset production manifest baru mencatat reuse yang sudah approved dan gap yang belum final: Gian foreground, Naya foreground, fixed narration, dan dedicated World social card.
- Production policy/handoff: `WORLD_PETUALANGAN_UANG_PRODUCTION_POLICY_2026-09-22.md`.
- World → Evidence audit ditambahkan fail-closed: hanya `money-s02-activity-01` → `math.quantity.comparison` dan `money-s08-activity-02` → `math.operation.subtraction.within_10` yang lolos sebagai **candidate only**; 14 activity lain eksplisit excluded; bridge tetap disabled.
- Evidence audit/handoff: `WORLD_PETUALANGAN_UANG_EVIDENCE_BRIDGE_AUDIT_2026-09-22.md`.
- Global age migration tetap fail-closed: audit menemukan blocker di cloud profile parser/create, local+cloud profile UI, content validator, learning-skill/content-pack SQL age constraints, canonical catalog 3–7, age-filtered Belajar runtime, public copy, dan regression tests.
- Audit age migration menegaskan `player_profiles.age_group` sendiri adalah text tanpa numeric 3–7 SQL check; hard stop profile saat ini berada pada parser/UI/app contract.
- Age migration audit/handoff: `WORLD_AGE_MIGRATION_AUDIT_2026-09-22.md`; tidak ada blanket `ageMax 7 -> 12` rewrite.
- Narration registry World sekarang memakai stable cue ID untuk narrative/concept/payoff/activity prompt + final narrative-choice prompt; runtime speech key tidak lagi berbasis copy text.
- Fixed narration tetap fail-closed: semua cue `fallback-runtime`, `productionSrc=null`, future path deterministic di `/audio/world/money-festival/id-ID/<cue-id>.mp3`.
- Narration contract/handoff: `WORLD_PETUALANGAN_UANG_NARRATION_CONTRACT_2026-09-22.md`.
- Age/evidence-green rollback: `checkpoint/world-petualangan-uang-age-evidence-green-20260922` @ `f09c01dc54061cd3ce2d895bfa7f7477b9bf39c7`, CI #1352 / run `35684673952` full success.

## 2.0.1 — 5 Agustus 2026

- Memperbaiki urutan `VERIFY_WINDOWS.ps1`: `npm install` sekarang berjalan sebelum gate yang memerlukan TypeScript.
- Menambahkan pemeriksaan eksplisit untuk `node_modules\.bin\tsc.cmd`.
- Mengoreksi dokumentasi portable gate.
- Tidak mengubah gameplay, vision runtime, recognizer, maupun UI.
