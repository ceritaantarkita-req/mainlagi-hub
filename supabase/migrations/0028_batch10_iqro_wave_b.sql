-- Mainlagi Expansion Batch 10 — Iqro Wave B (subject total 25 -> 50)
-- Adds 25 expert-review-required activities for Dal/Dzal, Ra/Zai, and Sin/Syin.
-- Additive/idempotent only; historical learning identities and attempt history remain unchanged.

insert into public.learning_skills(skill_key,subject_id,title,description,domain,age_min,age_max,active,updated_at) values
('iqro.hijaiyah.recognition.middle','iqro','Kenali huruf menengah','Mengenali bentuk Dal, Dzal, Ra, Zai, Sin, dan Syin.','religious_literacy',3,7,true,now()),
('iqro.hijaiyah.listening.middle','iqro','Dengar label huruf menengah','Menghubungkan label nama huruf menengah dengan bentuk; memerlukan review audio pengajar.','religious_literacy',3,7,true,now()),
('iqro.hijaiyah.dot_count.middle','iqro','Jumlah titik huruf menengah','Menggunakan jumlah titik sebagai petunjuk visual pada kelompok menengah.','religious_literacy',4,7,true,now()),
('iqro.hijaiyah.name_matching.middle','iqro','Pasangkan nama dan bentuk menengah','Memasangkan bentuk kelompok menengah dengan label nama registry Mainlagi.','religious_literacy',4,7,true,now()),
('iqro.hijaiyah.family_discrimination.middle','iqro','Bedakan keluarga bentuk menengah','Membedakan pasangan keluarga Dal–Dzal, Ra–Zai, dan Sin–Syin.','religious_literacy',4,7,true,now())
on conflict(skill_key) do update set subject_id=excluded.subject_id,title=excluded.title,description=excluded.description,domain=excluded.domain,age_min=excluded.age_min,age_max=excluded.age_max,active=true,updated_at=now();

insert into public.learning_content_packs(pack_id,subject_id,path_id,stage_id,title,version,age_min,age_max,review_status,active,updated_at) values
('iqro.pack.middle-recognition','iqro','iqro-fondasi-hijaiyah','iqro-middle-families','Middle Recognition — Expert Review Required','1.0.0',3,7,'expert_required',true,now()),
('iqro.pack.middle-listening','iqro','iqro-fondasi-hijaiyah','iqro-middle-families','Middle Listening — Expert Review Required','1.0.0',3,7,'expert_required',true,now()),
('iqro.pack.middle-dots','iqro','iqro-fondasi-hijaiyah','iqro-middle-families','Middle Dot Awareness — Expert Review Required','1.0.0',4,7,'expert_required',true,now()),
('iqro.pack.middle-name-matching','iqro','iqro-fondasi-hijaiyah','iqro-middle-families','Middle Name Matching — Expert Review Required','1.0.0',4,7,'expert_required',true,now()),
('iqro.pack.middle-families','iqro','iqro-fondasi-hijaiyah','iqro-middle-families','Middle Family Discrimination — Expert Review Required','1.0.0',4,7,'expert_required',true,now())
on conflict(pack_id) do update set subject_id=excluded.subject_id,path_id=excluded.path_id,stage_id=excluded.stage_id,title=excluded.title,version=excluded.version,age_min=excluded.age_min,age_max=excluded.age_max,review_status=excluded.review_status,active=true,updated_at=now();

insert into public.learning_activities(activity_id,subject_id,stage_id,runtime,difficulty,assessment,required_for_stage,motion_optional,star_reward,content_pack_id,lesson_id,mechanic_id,evidence_contract,content_revision,active,updated_at) values
('iqro-find-dal','iqro','iqro-middle-families','tap_choice',1,'assessed',true,false,2,'iqro.pack.middle-recognition','iqro-middle-recognition','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-find-dzal','iqro','iqro-middle-families','tap_choice',1,'assessed',false,false,2,'iqro.pack.middle-recognition','iqro-middle-recognition','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-find-ra','iqro','iqro-middle-families','tap_choice',1,'assessed',false,false,2,'iqro.pack.middle-recognition','iqro-middle-recognition','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-find-zai','iqro','iqro-middle-families','tap_choice',1,'assessed',false,false,2,'iqro.pack.middle-recognition','iqro-middle-recognition','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-find-sin','iqro','iqro-middle-families','tap_choice',1,'assessed',true,false,2,'iqro.pack.middle-recognition','iqro-middle-recognition','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-find-syin','iqro','iqro-middle-families','tap_choice',1,'assessed',false,false,2,'iqro.pack.middle-recognition','iqro-middle-recognition','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-listen-dal','iqro','iqro-middle-families','listen_and_choose',1,'assessed',false,false,2,'iqro.pack.middle-listening','iqro-middle-listening','listen_and_choose','choice_accuracy_v1',1,true,now()),
('iqro-listen-dzal','iqro','iqro-middle-families','listen_and_choose',1,'assessed',true,false,2,'iqro.pack.middle-listening','iqro-middle-listening','listen_and_choose','choice_accuracy_v1',1,true,now()),
('iqro-listen-ra','iqro','iqro-middle-families','listen_and_choose',1,'assessed',false,false,2,'iqro.pack.middle-listening','iqro-middle-listening','listen_and_choose','choice_accuracy_v1',1,true,now()),
('iqro-listen-zai','iqro','iqro-middle-families','listen_and_choose',1,'assessed',false,false,2,'iqro.pack.middle-listening','iqro-middle-listening','listen_and_choose','choice_accuracy_v1',1,true,now()),
('iqro-listen-sin','iqro','iqro-middle-families','listen_and_choose',1,'assessed',false,false,2,'iqro.pack.middle-listening','iqro-middle-listening','listen_and_choose','choice_accuracy_v1',1,true,now()),
('iqro-listen-syin','iqro','iqro-middle-families','listen_and_choose',1,'assessed',true,false,2,'iqro.pack.middle-listening','iqro-middle-listening','listen_and_choose','choice_accuracy_v1',1,true,now()),
('iqro-dots-dal','iqro','iqro-middle-families','tap_choice',2,'assessed',false,false,3,'iqro.pack.middle-dots','iqro-middle-dots','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-dots-dzal','iqro','iqro-middle-families','tap_choice',2,'assessed',false,false,3,'iqro.pack.middle-dots','iqro-middle-dots','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-dots-ra','iqro','iqro-middle-families','tap_choice',2,'assessed',true,false,3,'iqro.pack.middle-dots','iqro-middle-dots','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-dots-zai','iqro','iqro-middle-families','tap_choice',2,'assessed',false,false,3,'iqro.pack.middle-dots','iqro-middle-dots','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-dots-sin','iqro','iqro-middle-families','tap_choice',2,'assessed',false,false,3,'iqro.pack.middle-dots','iqro-middle-dots','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-dots-syin','iqro','iqro-middle-families','tap_choice',2,'assessed',false,false,3,'iqro.pack.middle-dots','iqro-middle-dots','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-match-name-dal-dzal','iqro','iqro-middle-families','matching',2,'assessed',true,false,3,'iqro.pack.middle-name-matching','iqro-middle-name-matching','matching','matching_accuracy_v1',1,true,now()),
('iqro-match-name-ra-zai','iqro','iqro-middle-families','matching',2,'assessed',false,false,3,'iqro.pack.middle-name-matching','iqro-middle-name-matching','matching','matching_accuracy_v1',1,true,now()),
('iqro-match-name-sin-syin','iqro','iqro-middle-families','matching',2,'assessed',true,false,3,'iqro.pack.middle-name-matching','iqro-middle-name-matching','matching','matching_accuracy_v1',1,true,now()),
('iqro-family-dal-dzal','iqro','iqro-middle-families','tap_choice',2,'assessed',true,false,3,'iqro.pack.middle-families','iqro-middle-families','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-family-ra-zai','iqro','iqro-middle-families','tap_choice',2,'assessed',false,false,3,'iqro.pack.middle-families','iqro-middle-families','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-family-sin-syin','iqro','iqro-middle-families','tap_choice',2,'assessed',true,false,3,'iqro.pack.middle-families','iqro-middle-families','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-family-three-dot-contrast','iqro','iqro-middle-families','tap_choice',3,'assessed',false,false,3,'iqro.pack.middle-families','iqro-middle-families','tap_choice','choice_accuracy_v1',1,true,now())
on conflict(activity_id) do update set subject_id=excluded.subject_id,stage_id=excluded.stage_id,runtime=excluded.runtime,difficulty=excluded.difficulty,assessment=excluded.assessment,required_for_stage=excluded.required_for_stage,motion_optional=excluded.motion_optional,star_reward=excluded.star_reward,content_pack_id=excluded.content_pack_id,lesson_id=excluded.lesson_id,mechanic_id=excluded.mechanic_id,evidence_contract=excluded.evidence_contract,content_revision=excluded.content_revision,active=true,updated_at=now();

insert into public.learning_activity_skills(activity_id,skill_key,evidence_weight) values
('iqro-find-dal','iqro.hijaiyah.recognition.middle',1),('iqro-find-dzal','iqro.hijaiyah.recognition.middle',1),('iqro-find-ra','iqro.hijaiyah.recognition.middle',1),('iqro-find-zai','iqro.hijaiyah.recognition.middle',1),('iqro-find-sin','iqro.hijaiyah.recognition.middle',1),('iqro-find-syin','iqro.hijaiyah.recognition.middle',1),
('iqro-listen-dal','iqro.hijaiyah.listening.middle',1),('iqro-listen-dzal','iqro.hijaiyah.listening.middle',1),('iqro-listen-ra','iqro.hijaiyah.listening.middle',1),('iqro-listen-zai','iqro.hijaiyah.listening.middle',1),('iqro-listen-sin','iqro.hijaiyah.listening.middle',1),('iqro-listen-syin','iqro.hijaiyah.listening.middle',1),
('iqro-dots-dal','iqro.hijaiyah.dot_count.middle',1),('iqro-dots-dzal','iqro.hijaiyah.dot_count.middle',1),('iqro-dots-ra','iqro.hijaiyah.dot_count.middle',1),('iqro-dots-zai','iqro.hijaiyah.dot_count.middle',1),('iqro-dots-sin','iqro.hijaiyah.dot_count.middle',1),('iqro-dots-syin','iqro.hijaiyah.dot_count.middle',1),
('iqro-match-name-dal-dzal','iqro.hijaiyah.name_matching.middle',1),('iqro-match-name-ra-zai','iqro.hijaiyah.name_matching.middle',1),('iqro-match-name-sin-syin','iqro.hijaiyah.name_matching.middle',1),
('iqro-family-dal-dzal','iqro.hijaiyah.family_discrimination.middle',1),('iqro-family-ra-zai','iqro.hijaiyah.family_discrimination.middle',1),('iqro-family-sin-syin','iqro.hijaiyah.family_discrimination.middle',1),('iqro-family-three-dot-contrast','iqro.hijaiyah.family_discrimination.middle',1)
on conflict(activity_id,skill_key) do update set evidence_weight=excluded.evidence_weight;