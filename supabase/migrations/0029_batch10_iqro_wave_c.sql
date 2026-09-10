-- Mainlagi Expansion Batch 10 — Iqro Wave C (subject total 50 -> 75)
-- Adds 25 expert-review-required activities for Shad through Qaf.
-- Additive/idempotent only; historical learning identities and attempt history remain unchanged.

insert into public.learning_skills(skill_key,subject_id,title,description,domain,age_min,age_max,active,updated_at) values
('iqro.hijaiyah.recognition.advanced','iqro','Kenali huruf lanjutan','Mengenali bentuk Shad, Dhad, Tha, Zha, Ain, Ghain, Fa, dan Qaf.','religious_literacy',4,7,true,now()),
('iqro.hijaiyah.listening.advanced','iqro','Dengar label huruf lanjutan','Menghubungkan label nama kelompok lanjutan dengan bentuk; memerlukan review audio pengajar.','religious_literacy',4,7,true,now()),
('iqro.hijaiyah.dot_features.advanced','iqro','Ciri titik huruf lanjutan','Menggunakan jumlah titik untuk membedakan beberapa huruf pada kelompok lanjutan.','religious_literacy',4,7,true,now()),
('iqro.hijaiyah.name_matching.advanced','iqro','Pasangkan nama dan bentuk lanjutan','Memasangkan bentuk kelompok lanjutan dengan label nama registry Mainlagi.','religious_literacy',5,7,true,now()),
('iqro.hijaiyah.family_discrimination.advanced','iqro','Bedakan keluarga bentuk lanjutan','Membedakan pasangan Shad–Dhad, Ain–Ghain, dan Fa–Qaf secara visual.','religious_literacy',5,7,true,now())
on conflict(skill_key) do update set subject_id=excluded.subject_id,title=excluded.title,description=excluded.description,domain=excluded.domain,age_min=excluded.age_min,age_max=excluded.age_max,active=true,updated_at=now();

insert into public.learning_content_packs(pack_id,subject_id,path_id,stage_id,title,version,age_min,age_max,review_status,active,updated_at) values
('iqro.pack.advanced-recognition','iqro','iqro-fondasi-hijaiyah','iqro-advanced-families','Advanced Recognition — Expert Review Required','1.0.0',4,7,'expert_required',true,now()),
('iqro.pack.advanced-listening','iqro','iqro-fondasi-hijaiyah','iqro-advanced-families','Advanced Listening — Expert Review Required','1.0.0',4,7,'expert_required',true,now()),
('iqro.pack.advanced-dots','iqro','iqro-fondasi-hijaiyah','iqro-advanced-families','Advanced Dot Features — Expert Review Required','1.0.0',4,7,'expert_required',true,now()),
('iqro.pack.advanced-name-matching','iqro','iqro-fondasi-hijaiyah','iqro-advanced-families','Advanced Name Matching — Expert Review Required','1.0.0',5,7,'expert_required',true,now()),
('iqro.pack.advanced-families','iqro','iqro-fondasi-hijaiyah','iqro-advanced-families','Advanced Family Discrimination — Expert Review Required','1.0.0',5,7,'expert_required',true,now())
on conflict(pack_id) do update set subject_id=excluded.subject_id,path_id=excluded.path_id,stage_id=excluded.stage_id,title=excluded.title,version=excluded.version,age_min=excluded.age_min,age_max=excluded.age_max,review_status=excluded.review_status,active=true,updated_at=now();

insert into public.learning_activities(activity_id,subject_id,stage_id,runtime,difficulty,assessment,required_for_stage,motion_optional,star_reward,content_pack_id,lesson_id,mechanic_id,evidence_contract,content_revision,active,updated_at) values
('iqro-find-shad','iqro','iqro-advanced-families','tap_choice',2,'assessed',true,false,3,'iqro.pack.advanced-recognition','iqro-advanced-recognition','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-find-dhad','iqro','iqro-advanced-families','tap_choice',2,'assessed',false,false,3,'iqro.pack.advanced-recognition','iqro-advanced-recognition','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-find-tha','iqro','iqro-advanced-families','tap_choice',2,'assessed',false,false,3,'iqro.pack.advanced-recognition','iqro-advanced-recognition','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-find-zha','iqro','iqro-advanced-families','tap_choice',2,'assessed',false,false,3,'iqro.pack.advanced-recognition','iqro-advanced-recognition','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-find-ain','iqro','iqro-advanced-families','tap_choice',2,'assessed',true,false,3,'iqro.pack.advanced-recognition','iqro-advanced-recognition','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-find-ghain','iqro','iqro-advanced-families','tap_choice',2,'assessed',false,false,3,'iqro.pack.advanced-recognition','iqro-advanced-recognition','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-find-fa','iqro','iqro-advanced-families','tap_choice',2,'assessed',true,false,3,'iqro.pack.advanced-recognition','iqro-advanced-recognition','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-find-qaf','iqro','iqro-advanced-families','tap_choice',2,'assessed',false,false,3,'iqro.pack.advanced-recognition','iqro-advanced-recognition','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-listen-shad','iqro','iqro-advanced-families','listen_and_choose',2,'assessed',false,false,3,'iqro.pack.advanced-listening','iqro-advanced-listening','listen_and_choose','choice_accuracy_v1',1,true,now()),
('iqro-listen-dhad','iqro','iqro-advanced-families','listen_and_choose',2,'assessed',true,false,3,'iqro.pack.advanced-listening','iqro-advanced-listening','listen_and_choose','choice_accuracy_v1',1,true,now()),
('iqro-listen-tha','iqro','iqro-advanced-families','listen_and_choose',2,'assessed',false,false,3,'iqro.pack.advanced-listening','iqro-advanced-listening','listen_and_choose','choice_accuracy_v1',1,true,now()),
('iqro-listen-zha','iqro','iqro-advanced-families','listen_and_choose',2,'assessed',false,false,3,'iqro.pack.advanced-listening','iqro-advanced-listening','listen_and_choose','choice_accuracy_v1',1,true,now()),
('iqro-listen-ain','iqro','iqro-advanced-families','listen_and_choose',2,'assessed',false,false,3,'iqro.pack.advanced-listening','iqro-advanced-listening','listen_and_choose','choice_accuracy_v1',1,true,now()),
('iqro-listen-ghain','iqro','iqro-advanced-families','listen_and_choose',2,'assessed',true,false,3,'iqro.pack.advanced-listening','iqro-advanced-listening','listen_and_choose','choice_accuracy_v1',1,true,now()),
('iqro-listen-fa','iqro','iqro-advanced-families','listen_and_choose',2,'assessed',false,false,3,'iqro.pack.advanced-listening','iqro-advanced-listening','listen_and_choose','choice_accuracy_v1',1,true,now()),
('iqro-listen-qaf','iqro','iqro-advanced-families','listen_and_choose',2,'assessed',true,false,3,'iqro.pack.advanced-listening','iqro-advanced-listening','listen_and_choose','choice_accuracy_v1',1,true,now()),
('iqro-dots-dhad','iqro','iqro-advanced-families','tap_choice',2,'assessed',true,false,3,'iqro.pack.advanced-dots','iqro-advanced-dots','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-dots-zha','iqro','iqro-advanced-families','tap_choice',2,'assessed',false,false,3,'iqro.pack.advanced-dots','iqro-advanced-dots','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-dots-ghain','iqro','iqro-advanced-families','tap_choice',2,'assessed',true,false,3,'iqro.pack.advanced-dots','iqro-advanced-dots','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-dots-qaf','iqro','iqro-advanced-families','tap_choice',3,'assessed',false,false,3,'iqro.pack.advanced-dots','iqro-advanced-dots','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-match-name-shad-zha','iqro','iqro-advanced-families','matching',2,'assessed',true,false,3,'iqro.pack.advanced-name-matching','iqro-advanced-name-matching','matching','matching_accuracy_v1',1,true,now()),
('iqro-match-name-ain-qaf','iqro','iqro-advanced-families','matching',2,'assessed',true,false,3,'iqro.pack.advanced-name-matching','iqro-advanced-name-matching','matching','matching_accuracy_v1',1,true,now()),
('iqro-family-shad-dhad','iqro','iqro-advanced-families','tap_choice',2,'assessed',true,false,3,'iqro.pack.advanced-families','iqro-advanced-families','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-family-ain-ghain','iqro','iqro-advanced-families','tap_choice',2,'assessed',true,false,3,'iqro.pack.advanced-families','iqro-advanced-families','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-family-fa-qaf','iqro','iqro-advanced-families','tap_choice',3,'assessed',false,false,3,'iqro.pack.advanced-families','iqro-advanced-families','tap_choice','choice_accuracy_v1',1,true,now())
on conflict(activity_id) do update set subject_id=excluded.subject_id,stage_id=excluded.stage_id,runtime=excluded.runtime,difficulty=excluded.difficulty,assessment=excluded.assessment,required_for_stage=excluded.required_for_stage,motion_optional=excluded.motion_optional,star_reward=excluded.star_reward,content_pack_id=excluded.content_pack_id,lesson_id=excluded.lesson_id,mechanic_id=excluded.mechanic_id,evidence_contract=excluded.evidence_contract,content_revision=excluded.content_revision,active=true,updated_at=now();

insert into public.learning_activity_skills(activity_id,skill_key,evidence_weight) values
('iqro-find-shad','iqro.hijaiyah.recognition.advanced',1),('iqro-find-dhad','iqro.hijaiyah.recognition.advanced',1),('iqro-find-tha','iqro.hijaiyah.recognition.advanced',1),('iqro-find-zha','iqro.hijaiyah.recognition.advanced',1),('iqro-find-ain','iqro.hijaiyah.recognition.advanced',1),('iqro-find-ghain','iqro.hijaiyah.recognition.advanced',1),('iqro-find-fa','iqro.hijaiyah.recognition.advanced',1),('iqro-find-qaf','iqro.hijaiyah.recognition.advanced',1),
('iqro-listen-shad','iqro.hijaiyah.listening.advanced',1),('iqro-listen-dhad','iqro.hijaiyah.listening.advanced',1),('iqro-listen-tha','iqro.hijaiyah.listening.advanced',1),('iqro-listen-zha','iqro.hijaiyah.listening.advanced',1),('iqro-listen-ain','iqro.hijaiyah.listening.advanced',1),('iqro-listen-ghain','iqro.hijaiyah.listening.advanced',1),('iqro-listen-fa','iqro.hijaiyah.listening.advanced',1),('iqro-listen-qaf','iqro.hijaiyah.listening.advanced',1),
('iqro-dots-dhad','iqro.hijaiyah.dot_features.advanced',1),('iqro-dots-zha','iqro.hijaiyah.dot_features.advanced',1),('iqro-dots-ghain','iqro.hijaiyah.dot_features.advanced',1),('iqro-dots-qaf','iqro.hijaiyah.dot_features.advanced',1),
('iqro-match-name-shad-zha','iqro.hijaiyah.name_matching.advanced',1),('iqro-match-name-ain-qaf','iqro.hijaiyah.name_matching.advanced',1),
('iqro-family-shad-dhad','iqro.hijaiyah.family_discrimination.advanced',1),('iqro-family-ain-ghain','iqro.hijaiyah.family_discrimination.advanced',1),('iqro-family-fa-qaf','iqro.hijaiyah.family_discrimination.advanced',1)
on conflict(activity_id,skill_key) do update set evidence_weight=excluded.evidence_weight;