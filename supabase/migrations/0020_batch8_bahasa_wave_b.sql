-- Mainlagi Expansion Batch 8 — Bahasa Indonesia Wave B (subject total 26-50)
-- Adds 25 reviewed Bahasa activities. Additive/idempotent; no historical learning identity is removed.

insert into public.learning_skills(skill_key,subject_id,title,description,domain,age_min,age_max,active,updated_at) values
('bahasa.suku_kata.recognition','bahasa','Mengenali suku kata','Mengenali suku kata terbuka sederhana pada bentuk tertulis.','literacy',4,7,true,now()),
('bahasa.suku_kata.blending','bahasa','Menggabungkan suku kata','Menggabungkan dua suku kata menjadi kata sederhana yang familiar.','literacy',4,7,true,now()),
('bahasa.kata.semantic_matching','bahasa','Memasangkan kata dan makna','Menghubungkan kata sederhana dengan objek atau pasangan maknanya.','language',4,7,true,now()),
('bahasa.kata.listening','bahasa','Menyimak kata sederhana','Memilih bentuk tertulis berdasarkan kata sederhana yang didengar.','language',4,7,true,now()),
('bahasa.kata.picture_matching','bahasa','Mencocokkan gambar dan kata','Memilih kata yang tepat untuk objek sehari-hari yang direpresentasikan secara visual.','language',4,7,true,now())
on conflict(skill_key) do update set subject_id=excluded.subject_id,title=excluded.title,description=excluded.description,domain=excluded.domain,age_min=excluded.age_min,age_max=excluded.age_max,active=true,updated_at=now();

insert into public.learning_content_packs(pack_id,subject_id,path_id,stage_id,title,version,age_min,age_max,review_status,active,updated_at) values
('bahasa.pack.suku-kata-kenal','bahasa','bahasa-fondasi-literasi','bahasa-suku-kata-kata','Kenal Suku Kata','1.0.0',4,7,'internal',true,now()),
('bahasa.pack.suku-kata-gabung','bahasa','bahasa-fondasi-literasi','bahasa-suku-kata-kata','Gabung Suku Kata','1.0.0',4,7,'internal',true,now()),
('bahasa.pack.kata-pasangan','bahasa','bahasa-fondasi-literasi','bahasa-suku-kata-kata','Pasangan Kata','1.0.0',4,7,'internal',true,now()),
('bahasa.pack.kata-dengar','bahasa','bahasa-fondasi-literasi','bahasa-suku-kata-kata','Dengar Kata','1.0.0',4,7,'internal',true,now()),
('bahasa.pack.kata-gambar','bahasa','bahasa-fondasi-literasi','bahasa-suku-kata-kata','Gambar & Kata','1.0.0',4,7,'internal',true,now())
on conflict(pack_id) do update set subject_id=excluded.subject_id,path_id=excluded.path_id,stage_id=excluded.stage_id,title=excluded.title,version=excluded.version,age_min=excluded.age_min,age_max=excluded.age_max,review_status=excluded.review_status,active=true,updated_at=now();

insert into public.learning_activities(activity_id,subject_id,stage_id,runtime,difficulty,assessment,required_for_stage,motion_optional,star_reward,content_pack_id,lesson_id,mechanic_id,evidence_contract,content_revision,active,updated_at) values
('bahasa-suku-ba','bahasa','bahasa-suku-kata-kata','tap_choice',2,'assessed',true,false,3,'bahasa.pack.suku-kata-kenal','bahasa-suku-kata-kenal','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-suku-ma','bahasa','bahasa-suku-kata-kata','tap_choice',2,'assessed',false,false,3,'bahasa.pack.suku-kata-kenal','bahasa-suku-kata-kenal','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-suku-sa','bahasa','bahasa-suku-kata-kata','tap_choice',2,'assessed',false,false,3,'bahasa.pack.suku-kata-kenal','bahasa-suku-kata-kenal','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-suku-ka','bahasa','bahasa-suku-kata-kata','tap_choice',2,'assessed',true,false,3,'bahasa.pack.suku-kata-kenal','bahasa-suku-kata-kenal','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-suku-pa','bahasa','bahasa-suku-kata-kata','tap_choice',2,'assessed',false,false,3,'bahasa.pack.suku-kata-kenal','bahasa-suku-kata-kenal','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-gabung-baju','bahasa','bahasa-suku-kata-kata','tap_choice',2,'assessed',true,false,3,'bahasa.pack.suku-kata-gabung','bahasa-suku-kata-gabung','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-gabung-buku','bahasa','bahasa-suku-kata-kata','tap_choice',2,'assessed',false,false,3,'bahasa.pack.suku-kata-gabung','bahasa-suku-kata-gabung','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-gabung-meja','bahasa','bahasa-suku-kata-kata','tap_choice',2,'assessed',false,false,3,'bahasa.pack.suku-kata-gabung','bahasa-suku-kata-gabung','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-gabung-bola','bahasa','bahasa-suku-kata-kata','tap_choice',2,'assessed',true,false,3,'bahasa.pack.suku-kata-gabung','bahasa-suku-kata-gabung','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-gabung-susu','bahasa','bahasa-suku-kata-kata','tap_choice',2,'assessed',false,false,3,'bahasa.pack.suku-kata-gabung','bahasa-suku-kata-gabung','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-pasang-kata-benda-1','bahasa','bahasa-suku-kata-kata','matching',2,'assessed',true,false,3,'bahasa.pack.kata-pasangan','bahasa-kata-pasangan','matching','matching_accuracy_v1',1,true,now()),
('bahasa-pasang-kata-benda-2','bahasa','bahasa-suku-kata-kata','matching',2,'assessed',false,false,3,'bahasa.pack.kata-pasangan','bahasa-kata-pasangan','matching','matching_accuracy_v1',1,true,now()),
('bahasa-pasang-kata-benda-3','bahasa','bahasa-suku-kata-kata','matching',2,'assessed',false,false,3,'bahasa.pack.kata-pasangan','bahasa-kata-pasangan','matching','matching_accuracy_v1',1,true,now()),
('bahasa-pasang-kata-tempat','bahasa','bahasa-suku-kata-kata','matching',2,'assessed',true,false,3,'bahasa.pack.kata-pasangan','bahasa-kata-pasangan','matching','matching_accuracy_v1',1,true,now()),
('bahasa-pasang-kata-alam','bahasa','bahasa-suku-kata-kata','matching',2,'assessed',false,false,3,'bahasa.pack.kata-pasangan','bahasa-kata-pasangan','matching','matching_accuracy_v1',1,true,now()),
('bahasa-dengar-buku','bahasa','bahasa-suku-kata-kata','listen_and_choose',2,'assessed',true,false,3,'bahasa.pack.kata-dengar','bahasa-kata-dengar','listen_and_choose','choice_accuracy_v1',1,true,now()),
('bahasa-dengar-meja','bahasa','bahasa-suku-kata-kata','listen_and_choose',2,'assessed',false,false,3,'bahasa.pack.kata-dengar','bahasa-kata-dengar','listen_and_choose','choice_accuracy_v1',1,true,now()),
('bahasa-dengar-susu','bahasa','bahasa-suku-kata-kata','listen_and_choose',2,'assessed',false,false,3,'bahasa.pack.kata-dengar','bahasa-kata-dengar','listen_and_choose','choice_accuracy_v1',1,true,now()),
('bahasa-dengar-bola','bahasa','bahasa-suku-kata-kata','listen_and_choose',2,'assessed',true,false,3,'bahasa.pack.kata-dengar','bahasa-kata-dengar','listen_and_choose','choice_accuracy_v1',1,true,now()),
('bahasa-dengar-kucing','bahasa','bahasa-suku-kata-kata','listen_and_choose',2,'assessed',false,false,3,'bahasa.pack.kata-dengar','bahasa-kata-dengar','listen_and_choose','choice_accuracy_v1',1,true,now()),
('bahasa-gambar-apel','bahasa','bahasa-suku-kata-kata','tap_choice',2,'assessed',true,false,3,'bahasa.pack.kata-gambar','bahasa-kata-gambar','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-gambar-mobil','bahasa','bahasa-suku-kata-kata','tap_choice',2,'assessed',false,false,3,'bahasa.pack.kata-gambar','bahasa-kata-gambar','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-gambar-kucing','bahasa','bahasa-suku-kata-kata','tap_choice',2,'assessed',false,false,3,'bahasa.pack.kata-gambar','bahasa-kata-gambar','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-gambar-rumah','bahasa','bahasa-suku-kata-kata','tap_choice',2,'assessed',true,false,3,'bahasa.pack.kata-gambar','bahasa-kata-gambar','tap_choice','choice_accuracy_v1',1,true,now()),
('bahasa-gambar-pisang','bahasa','bahasa-suku-kata-kata','tap_choice',2,'assessed',false,false,3,'bahasa.pack.kata-gambar','bahasa-kata-gambar','tap_choice','choice_accuracy_v1',1,true,now())
on conflict(activity_id) do update set subject_id=excluded.subject_id,stage_id=excluded.stage_id,runtime=excluded.runtime,difficulty=excluded.difficulty,assessment=excluded.assessment,required_for_stage=excluded.required_for_stage,motion_optional=excluded.motion_optional,star_reward=excluded.star_reward,content_pack_id=excluded.content_pack_id,lesson_id=excluded.lesson_id,mechanic_id=excluded.mechanic_id,evidence_contract=excluded.evidence_contract,content_revision=excluded.content_revision,active=true,updated_at=now();

insert into public.learning_activity_skills(activity_id,skill_key,evidence_weight) values
('bahasa-suku-ba','bahasa.suku_kata.recognition',1),('bahasa-suku-ma','bahasa.suku_kata.recognition',1),('bahasa-suku-sa','bahasa.suku_kata.recognition',1),('bahasa-suku-ka','bahasa.suku_kata.recognition',1),('bahasa-suku-pa','bahasa.suku_kata.recognition',1),
('bahasa-gabung-baju','bahasa.suku_kata.blending',1),('bahasa-gabung-buku','bahasa.suku_kata.blending',1),('bahasa-gabung-meja','bahasa.suku_kata.blending',1),('bahasa-gabung-bola','bahasa.suku_kata.blending',1),('bahasa-gabung-susu','bahasa.suku_kata.blending',1),
('bahasa-pasang-kata-benda-1','bahasa.kata.semantic_matching',1),('bahasa-pasang-kata-benda-2','bahasa.kata.semantic_matching',1),('bahasa-pasang-kata-benda-3','bahasa.kata.semantic_matching',1),('bahasa-pasang-kata-tempat','bahasa.kata.semantic_matching',1),('bahasa-pasang-kata-alam','bahasa.kata.semantic_matching',1),
('bahasa-dengar-buku','bahasa.kata.listening',1),('bahasa-dengar-meja','bahasa.kata.listening',1),('bahasa-dengar-susu','bahasa.kata.listening',1),('bahasa-dengar-bola','bahasa.kata.listening',1),('bahasa-dengar-kucing','bahasa.kata.listening',1),
('bahasa-gambar-apel','bahasa.kata.picture_matching',1),('bahasa-gambar-mobil','bahasa.kata.picture_matching',1),('bahasa-gambar-kucing','bahasa.kata.picture_matching',1),('bahasa-gambar-rumah','bahasa.kata.picture_matching',1),('bahasa-gambar-pisang','bahasa.kata.picture_matching',1)
on conflict(activity_id,skill_key) do update set evidence_weight=excluded.evidence_weight;
