-- Mainlagi Expansion Batch 8 — Bahasa Indonesia Wave D (subject total 76-100)
-- Adds the final 25 reviewed Bahasa activities so canonical Bahasa reaches exactly 100.
-- Additive/idempotent only; historical activities, attempts, scores, progress, and mastery identities remain unchanged.

insert into public.learning_skills(skill_key,subject_id,title,description,domain,age_min,age_max,active,updated_at) values
('bahasa.kalimat.punctuation_capitalization','bahasa','Tanda baca dan huruf kapital','Mengenali tanda titik, tanya, seru, dan penggunaan huruf kapital dasar.','literacy',5,7,true,now()),
('bahasa.kalimat.context_completion','bahasa','Melengkapi kalimat sesuai konteks','Memilih kata yang membuat kalimat sederhana lengkap dan masuk akal.','language',5,7,true,now()),
('bahasa.kosakata.category','bahasa','Mengelompokkan kosakata','Menghubungkan kosakata sehari-hari dengan kategori maknanya.','language',5,7,true,now()),
('bahasa.kalimat.listening_detail','bahasa','Menangkap detail dari kalimat lisan','Menentukan detail literal dari kalimat pendek yang didengar.','language',5,7,true,now()),
('bahasa.bacaan.integrated','bahasa','Pemahaman bacaan terpadu','Menggunakan detail dan urutan kejadian untuk memahami bacaan pendek.','literacy',5,7,true,now())
on conflict(skill_key) do update set subject_id=excluded.subject_id,title=excluded.title,description=excluded.description,domain=excluded.domain,age_min=excluded.age_min,age_max=excluded.age_max,active=true,updated_at=now();

insert into public.learning_content_packs(pack_id,subject_id,path_id,stage_id,title,version,age_min,age_max,review_status,active,updated_at) values
('bahasa.pack.ejaan-dasar','bahasa','bahasa-fondasi-literasi','bahasa-literasi-terapan','Ejaan & Tanda Baca','1.0.0',5,7,'internal',true,now()),
('bahasa.pack.kalimat-lengkap','bahasa','bahasa-fondasi-literasi','bahasa-literasi-terapan','Lengkapi Kalimat','1.0.0',5,7,'internal',true,now()),
('bahasa.pack.kategori-kata','bahasa','bahasa-fondasi-literasi','bahasa-literasi-terapan','Kategori Kata','1.0.0',5,7,'internal',true,now()),
('bahasa.pack.detail-dengar','bahasa','bahasa-fondasi-literasi','bahasa-literasi-terapan','Simak Detail','1.0.0',5,7,'internal',true,now()),
('bahasa.pack.bacaan-terapan','bahasa','bahasa-fondasi-literasi','bahasa-literasi-terapan','Bacaan Terpadu','1.0.0',5,7,'internal',true,now())
on conflict(pack_id) do update set subject_id=excluded.subject_id,path_id=excluded.path_id,stage_id=excluded.stage_id,title=excluded.title,version=excluded.version,age_min=excluded.age_min,age_max=excluded.age_max,review_status=excluded.review_status,active=true,updated_at=now();

insert into public.learning_activities(activity_id,subject_id,stage_id,runtime,difficulty,assessment,required_for_stage,motion_optional,star_reward,content_pack_id,lesson_id,mechanic_id,evidence_contract,content_revision,active,updated_at) values
('bahasa-tanda-titik','bahasa','bahasa-literasi-terapan','tap_choice',3,'assessed',true,false,3,'bahasa.pack.ejaan-dasar','bahasa-ejaan-dasar','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-tanda-tanya','bahasa','bahasa-literasi-terapan','tap_choice',3,'assessed',false,false,3,'bahasa.pack.ejaan-dasar','bahasa-ejaan-dasar','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-tanda-seru','bahasa','bahasa-literasi-terapan','tap_choice',3,'assessed',false,false,3,'bahasa.pack.ejaan-dasar','bahasa-ejaan-dasar','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-kapital-awal','bahasa','bahasa-literasi-terapan','tap_choice',3,'assessed',true,false,3,'bahasa.pack.ejaan-dasar','bahasa-ejaan-dasar','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-kapital-nama','bahasa','bahasa-literasi-terapan','tap_choice',3,'assessed',false,false,3,'bahasa.pack.ejaan-dasar','bahasa-ejaan-dasar','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-lengkap-ayah-minum','bahasa','bahasa-literasi-terapan','tap_choice',3,'assessed',true,false,3,'bahasa.pack.kalimat-lengkap','bahasa-kalimat-lengkap','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-lengkap-burung-terbang','bahasa','bahasa-literasi-terapan','tap_choice',3,'assessed',false,false,3,'bahasa.pack.kalimat-lengkap','bahasa-kalimat-lengkap','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-lengkap-kucing-tidur','bahasa','bahasa-literasi-terapan','tap_choice',3,'assessed',false,false,3,'bahasa.pack.kalimat-lengkap','bahasa-kalimat-lengkap','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-lengkap-ibu-pasar','bahasa','bahasa-literasi-terapan','tap_choice',3,'assessed',true,false,3,'bahasa.pack.kalimat-lengkap','bahasa-kalimat-lengkap','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-lengkap-rina-payung','bahasa','bahasa-literasi-terapan','tap_choice',3,'assessed',false,false,3,'bahasa.pack.kalimat-lengkap','bahasa-kalimat-lengkap','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-kategori-hewan-buah','bahasa','bahasa-literasi-terapan','matching',3,'assessed',true,false,3,'bahasa.pack.kategori-kata','bahasa-kategori-kata','matching','matching_accuracy_v1',1,true,now()),
('bahasa-kategori-transport-tempat','bahasa','bahasa-literasi-terapan','matching',3,'assessed',false,false,3,'bahasa.pack.kategori-kata','bahasa-kategori-kata','matching','matching_accuracy_v1',1,true,now()),
('bahasa-kategori-warna-bentuk','bahasa','bahasa-literasi-terapan','matching',3,'assessed',false,false,3,'bahasa.pack.kategori-kata','bahasa-kategori-kata','matching','matching_accuracy_v1',1,true,now()),
('bahasa-kategori-sekolah-dapur','bahasa','bahasa-literasi-terapan','matching',3,'assessed',true,false,3,'bahasa.pack.kategori-kata','bahasa-kategori-kata','matching','matching_accuracy_v1',1,true,now()),
('bahasa-kategori-tubuh-pakaian','bahasa','bahasa-literasi-terapan','matching',3,'assessed',false,false,3,'bahasa.pack.kategori-kata','bahasa-kategori-kata','matching','matching_accuracy_v1',1,true,now()),
('bahasa-dengar-detail-bola-merah','bahasa','bahasa-literasi-terapan','listen_and_choose',3,'assessed',true,false,3,'bahasa.pack.detail-dengar','bahasa-detail-dengar','listen_and_choose','choice_accuracy_v1',1,true,now()),
('bahasa-dengar-detail-dua-buku','bahasa','bahasa-literasi-terapan','listen_and_choose',3,'assessed',false,false,3,'bahasa.pack.detail-dengar','bahasa-detail-dengar','listen_and_choose','choice_accuracy_v1',1,true,now()),
('bahasa-dengar-detail-bawah-kursi','bahasa','bahasa-literasi-terapan','listen_and_choose',3,'assessed',false,false,3,'bahasa.pack.detail-dengar','bahasa-detail-dengar','listen_and_choose','choice_accuracy_v1',1,true,now()),
('bahasa-dengar-detail-pagi-pasar','bahasa','bahasa-literasi-terapan','listen_and_choose',3,'assessed',true,false,3,'bahasa.pack.detail-dengar','bahasa-detail-dengar','listen_and_choose','choice_accuracy_v1',1,true,now()),
('bahasa-dengar-detail-pisang','bahasa','bahasa-literasi-terapan','listen_and_choose',3,'assessed',false,false,3,'bahasa.pack.detail-dengar','bahasa-detail-dengar','listen_and_choose','choice_accuracy_v1',1,true,now()),
('bahasa-terapan-mila-pagi','bahasa','bahasa-literasi-terapan','tap_choice',3,'assessed',true,false,3,'bahasa.pack.bacaan-terapan','bahasa-bacaan-terapan','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-terapan-tono-ikan','bahasa','bahasa-literasi-terapan','tap_choice',3,'assessed',false,false,3,'bahasa.pack.bacaan-terapan','bahasa-bacaan-terapan','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-terapan-nisa-hujan','bahasa','bahasa-literasi-terapan','tap_choice',3,'assessed',false,false,3,'bahasa.pack.bacaan-terapan','bahasa-bacaan-terapan','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-terapan-beni-perpus','bahasa','bahasa-literasi-terapan','tap_choice',3,'assessed',true,false,3,'bahasa.pack.bacaan-terapan','bahasa-bacaan-terapan','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-terapan-lani-tunas','bahasa','bahasa-literasi-terapan','tap_choice',3,'assessed',false,false,3,'bahasa.pack.bacaan-terapan','bahasa-bacaan-terapan','tap_choice','choice_accuracy_v1',1,true,now())
on conflict(activity_id) do update set subject_id=excluded.subject_id,stage_id=excluded.stage_id,runtime=excluded.runtime,difficulty=excluded.difficulty,assessment=excluded.assessment,required_for_stage=excluded.required_for_stage,motion_optional=excluded.motion_optional,star_reward=excluded.star_reward,content_pack_id=excluded.content_pack_id,lesson_id=excluded.lesson_id,mechanic_id=excluded.mechanic_id,evidence_contract=excluded.evidence_contract,content_revision=excluded.content_revision,active=true,updated_at=now();

insert into public.learning_activity_skills(activity_id,skill_key,evidence_weight) values
('bahasa-tanda-titik','bahasa.kalimat.punctuation_capitalization',1),('bahasa-tanda-tanya','bahasa.kalimat.punctuation_capitalization',1),('bahasa-tanda-seru','bahasa.kalimat.punctuation_capitalization',1),('bahasa-kapital-awal','bahasa.kalimat.punctuation_capitalization',1),('bahasa-kapital-nama','bahasa.kalimat.punctuation_capitalization',1),
('bahasa-lengkap-ayah-minum','bahasa.kalimat.context_completion',1),('bahasa-lengkap-burung-terbang','bahasa.kalimat.context_completion',1),('bahasa-lengkap-kucing-tidur','bahasa.kalimat.context_completion',1),('bahasa-lengkap-ibu-pasar','bahasa.kalimat.context_completion',1),('bahasa-lengkap-rina-payung','bahasa.kalimat.context_completion',1),
('bahasa-kategori-hewan-buah','bahasa.kosakata.category',1),('bahasa-kategori-transport-tempat','bahasa.kosakata.category',1),('bahasa-kategori-warna-bentuk','bahasa.kosakata.category',1),('bahasa-kategori-sekolah-dapur','bahasa.kosakata.category',1),('bahasa-kategori-tubuh-pakaian','bahasa.kosakata.category',1),
('bahasa-dengar-detail-bola-merah','bahasa.kalimat.listening_detail',1),('bahasa-dengar-detail-dua-buku','bahasa.kalimat.listening_detail',1),('bahasa-dengar-detail-bawah-kursi','bahasa.kalimat.listening_detail',1),('bahasa-dengar-detail-pagi-pasar','bahasa.kalimat.listening_detail',1),('bahasa-dengar-detail-pisang','bahasa.kalimat.listening_detail',1),
('bahasa-terapan-mila-pagi','bahasa.bacaan.integrated',1),('bahasa-terapan-tono-ikan','bahasa.bacaan.integrated',1),('bahasa-terapan-nisa-hujan','bahasa.bacaan.integrated',1),('bahasa-terapan-beni-perpus','bahasa.bacaan.integrated',1),('bahasa-terapan-lani-tunas','bahasa.bacaan.integrated',1)
on conflict(activity_id,skill_key) do update set evidence_weight=excluded.evidence_weight;
