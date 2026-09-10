-- Mainlagi Expansion Batch 8 — Bahasa Indonesia Wave C (subject total 51-75)
-- Adds 25 reviewed Bahasa activities. Additive/idempotent; historical learning identities remain unchanged.

insert into public.learning_skills(skill_key,subject_id,title,description,domain,age_min,age_max,active,updated_at) values
('bahasa.kalimat.order','bahasa','Menyusun urutan kalimat','Memilih urutan kata yang membentuk kalimat sederhana dan masuk akal.','literacy',5,7,true,now()),
('bahasa.kalimat.comprehension','bahasa','Memahami makna kalimat','Mengambil informasi literal dari kalimat sederhana.','language',5,7,true,now()),
('bahasa.instruksi.listening','bahasa','Memahami instruksi lisan','Mengikuti instruksi lisan satu langkah dengan kosakata familiar.','language',5,7,true,now()),
('bahasa.kosakata.relations','bahasa','Mengenali hubungan kosakata','Mengenali lawan kata dan kata bermakna dekat pada level dasar.','language',5,7,true,now()),
('bahasa.bacaan.short_comprehension','bahasa','Memahami bacaan pendek','Menjawab pertanyaan literal dari bacaan satu atau dua kalimat.','literacy',5,7,true,now())
on conflict(skill_key) do update set subject_id=excluded.subject_id,title=excluded.title,description=excluded.description,domain=excluded.domain,age_min=excluded.age_min,age_max=excluded.age_max,active=true,updated_at=now();

insert into public.learning_content_packs(pack_id,subject_id,path_id,stage_id,title,version,age_min,age_max,review_status,active,updated_at) values
('bahasa.pack.kalimat-urutan','bahasa','bahasa-fondasi-literasi','bahasa-kalimat-pemahaman','Urutan Kalimat','1.0.0',5,7,'internal',true,now()),
('bahasa.pack.kalimat-makna','bahasa','bahasa-fondasi-literasi','bahasa-kalimat-pemahaman','Makna Kalimat','1.0.0',5,7,'internal',true,now()),
('bahasa.pack.instruksi-dengar','bahasa','bahasa-fondasi-literasi','bahasa-kalimat-pemahaman','Dengar Instruksi','1.0.0',5,7,'internal',true,now()),
('bahasa.pack.hubungan-kata','bahasa','bahasa-fondasi-literasi','bahasa-kalimat-pemahaman','Hubungan Kata','1.0.0',5,7,'internal',true,now()),
('bahasa.pack.bacaan-pendek','bahasa','bahasa-fondasi-literasi','bahasa-kalimat-pemahaman','Bacaan Pendek','1.0.0',5,7,'internal',true,now())
on conflict(pack_id) do update set subject_id=excluded.subject_id,path_id=excluded.path_id,stage_id=excluded.stage_id,title=excluded.title,version=excluded.version,age_min=excluded.age_min,age_max=excluded.age_max,review_status=excluded.review_status,active=true,updated_at=now();

insert into public.learning_activities(activity_id,subject_id,stage_id,runtime,difficulty,assessment,required_for_stage,motion_optional,star_reward,content_pack_id,lesson_id,mechanic_id,evidence_contract,content_revision,active,updated_at) values
('bahasa-urut-ibu-memasak','bahasa','bahasa-kalimat-pemahaman','tap_choice',2,'assessed',true,false,3,'bahasa.pack.kalimat-urutan','bahasa-kalimat-urutan','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-urut-adi-berlari','bahasa','bahasa-kalimat-pemahaman','tap_choice',2,'assessed',false,false,3,'bahasa.pack.kalimat-urutan','bahasa-kalimat-urutan','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-urut-kucing-tidur','bahasa','bahasa-kalimat-pemahaman','tap_choice',2,'assessed',false,false,3,'bahasa.pack.kalimat-urutan','bahasa-kalimat-urutan','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-urut-siti-membaca','bahasa','bahasa-kalimat-pemahaman','tap_choice',2,'assessed',true,false,3,'bahasa.pack.kalimat-urutan','bahasa-kalimat-urutan','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-urut-burung-terbang','bahasa','bahasa-kalimat-pemahaman','tap_choice',2,'assessed',false,false,3,'bahasa.pack.kalimat-urutan','bahasa-kalimat-urutan','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-makna-rina-apel','bahasa','bahasa-kalimat-pemahaman','tap_choice',2,'assessed',true,false,3,'bahasa.pack.kalimat-makna','bahasa-kalimat-makna','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-makna-budi-sekolah','bahasa','bahasa-kalimat-pemahaman','tap_choice',2,'assessed',false,false,3,'bahasa.pack.kalimat-makna','bahasa-kalimat-makna','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-makna-ikan-air','bahasa','bahasa-kalimat-pemahaman','tap_choice',2,'assessed',false,false,3,'bahasa.pack.kalimat-makna','bahasa-kalimat-makna','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-makna-ayah-koran','bahasa','bahasa-kalimat-pemahaman','tap_choice',2,'assessed',true,false,3,'bahasa.pack.kalimat-makna','bahasa-kalimat-makna','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-makna-dina-payung','bahasa','bahasa-kalimat-pemahaman','tap_choice',2,'assessed',false,false,3,'bahasa.pack.kalimat-makna','bahasa-kalimat-makna','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-instruksi-ambil-buku','bahasa','bahasa-kalimat-pemahaman','listen_and_choose',2,'assessed',true,false,3,'bahasa.pack.instruksi-dengar','bahasa-instruksi-dengar','listen_and_choose','choice_accuracy_v1',1,true,now()),
('bahasa-instruksi-tutup-pintu','bahasa','bahasa-kalimat-pemahaman','listen_and_choose',2,'assessed',false,false,3,'bahasa.pack.instruksi-dengar','bahasa-instruksi-dengar','listen_and_choose','choice_accuracy_v1',1,true,now()),
('bahasa-instruksi-duduk-kursi','bahasa','bahasa-kalimat-pemahaman','listen_and_choose',2,'assessed',false,false,3,'bahasa.pack.instruksi-dengar','bahasa-instruksi-dengar','listen_and_choose','choice_accuracy_v1',1,true,now()),
('bahasa-instruksi-angkat-tangan','bahasa','bahasa-kalimat-pemahaman','listen_and_choose',2,'assessed',true,false,3,'bahasa.pack.instruksi-dengar','bahasa-instruksi-dengar','listen_and_choose','choice_accuracy_v1',1,true,now()),
('bahasa-instruksi-taruh-pensil','bahasa','bahasa-kalimat-pemahaman','listen_and_choose',2,'assessed',false,false,3,'bahasa.pack.instruksi-dengar','bahasa-instruksi-dengar','listen_and_choose','choice_accuracy_v1',1,true,now()),
('bahasa-relasi-panas-dingin','bahasa','bahasa-kalimat-pemahaman','matching',2,'assessed',true,false,3,'bahasa.pack.hubungan-kata','bahasa-hubungan-kata','matching','matching_accuracy_v1',1,true,now()),
('bahasa-relasi-atas-bawah','bahasa','bahasa-kalimat-pemahaman','matching',2,'assessed',false,false,3,'bahasa.pack.hubungan-kata','bahasa-hubungan-kata','matching','matching_accuracy_v1',1,true,now()),
('bahasa-relasi-cepat-lambat','bahasa','bahasa-kalimat-pemahaman','matching',2,'assessed',false,false,3,'bahasa.pack.hubungan-kata','bahasa-hubungan-kata','matching','matching_accuracy_v1',1,true,now()),
('bahasa-relasi-senang-gembira','bahasa','bahasa-kalimat-pemahaman','matching',2,'assessed',true,false,3,'bahasa.pack.hubungan-kata','bahasa-hubungan-kata','matching','matching_accuracy_v1',1,true,now()),
('bahasa-relasi-indah-cantik','bahasa','bahasa-kalimat-pemahaman','matching',2,'assessed',false,false,3,'bahasa.pack.hubungan-kata','bahasa-hubungan-kata','matching','matching_accuracy_v1',1,true,now()),
('bahasa-baca-lala-kucing','bahasa','bahasa-kalimat-pemahaman','tap_choice',3,'assessed',true,false,3,'bahasa.pack.bacaan-pendek','bahasa-bacaan-pendek','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-baca-dodi-sepeda','bahasa','bahasa-kalimat-pemahaman','tap_choice',3,'assessed',false,false,3,'bahasa.pack.bacaan-pendek','bahasa-bacaan-pendek','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-baca-nina-bunga','bahasa','bahasa-kalimat-pemahaman','tap_choice',3,'assessed',false,false,3,'bahasa.pack.bacaan-pendek','bahasa-bacaan-pendek','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-baca-raka-sarapan','bahasa','bahasa-kalimat-pemahaman','tap_choice',3,'assessed',true,false,3,'bahasa.pack.bacaan-pendek','bahasa-bacaan-pendek','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-baca-sari-hujan','bahasa','bahasa-kalimat-pemahaman','tap_choice',3,'assessed',false,false,3,'bahasa.pack.bacaan-pendek','bahasa-bacaan-pendek','tap_choice','choice_accuracy_v1',1,true,now())
on conflict(activity_id) do update set subject_id=excluded.subject_id,stage_id=excluded.stage_id,runtime=excluded.runtime,difficulty=excluded.difficulty,assessment=excluded.assessment,required_for_stage=excluded.required_for_stage,motion_optional=excluded.motion_optional,star_reward=excluded.star_reward,content_pack_id=excluded.content_pack_id,lesson_id=excluded.lesson_id,mechanic_id=excluded.mechanic_id,evidence_contract=excluded.evidence_contract,content_revision=excluded.content_revision,active=true,updated_at=now();

insert into public.learning_activity_skills(activity_id,skill_key,evidence_weight) values
('bahasa-urut-ibu-memasak','bahasa.kalimat.order',1),('bahasa-urut-adi-berlari','bahasa.kalimat.order',1),('bahasa-urut-kucing-tidur','bahasa.kalimat.order',1),('bahasa-urut-siti-membaca','bahasa.kalimat.order',1),('bahasa-urut-burung-terbang','bahasa.kalimat.order',1),
('bahasa-makna-rina-apel','bahasa.kalimat.comprehension',1),('bahasa-makna-budi-sekolah','bahasa.kalimat.comprehension',1),('bahasa-makna-ikan-air','bahasa.kalimat.comprehension',1),('bahasa-makna-ayah-koran','bahasa.kalimat.comprehension',1),('bahasa-makna-dina-payung','bahasa.kalimat.comprehension',1),
('bahasa-instruksi-ambil-buku','bahasa.instruksi.listening',1),('bahasa-instruksi-tutup-pintu','bahasa.instruksi.listening',1),('bahasa-instruksi-duduk-kursi','bahasa.instruksi.listening',1),('bahasa-instruksi-angkat-tangan','bahasa.instruksi.listening',1),('bahasa-instruksi-taruh-pensil','bahasa.instruksi.listening',1),
('bahasa-relasi-panas-dingin','bahasa.kosakata.relations',1),('bahasa-relasi-atas-bawah','bahasa.kosakata.relations',1),('bahasa-relasi-cepat-lambat','bahasa.kosakata.relations',1),('bahasa-relasi-senang-gembira','bahasa.kosakata.relations',1),('bahasa-relasi-indah-cantik','bahasa.kosakata.relations',1),
('bahasa-baca-lala-kucing','bahasa.bacaan.short_comprehension',1),('bahasa-baca-dodi-sepeda','bahasa.bacaan.short_comprehension',1),('bahasa-baca-nina-bunga','bahasa.bacaan.short_comprehension',1),('bahasa-baca-raka-sarapan','bahasa.bacaan.short_comprehension',1),('bahasa-baca-sari-hujan','bahasa.bacaan.short_comprehension',1)
on conflict(activity_id,skill_key) do update set evidence_weight=excluded.evidence_weight;
