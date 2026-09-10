-- Mainlagi Expansion Batch 10 — Iqro Wave D (subject total 75 -> 100)
-- Adds 25 expert-review-required activities for Kaf through Ya, standalone Hamzah, and integrated review.
-- Additive/idempotent only; historical learning identities and attempt history remain unchanged.

insert into public.learning_skills(skill_key,subject_id,title,description,domain,age_min,age_max,active,updated_at) values
('iqro.hijaiyah.recognition.final','iqro','Kenali huruf akhir','Mengenali bentuk kelompok Kaf sampai Ya dan standalone Hamzah.','religious_literacy',4,7,true,now()),
('iqro.hijaiyah.listening.final','iqro','Dengar label huruf akhir','Menghubungkan label nama huruf akhir dengan bentuk; memerlukan review audio pengajar.','religious_literacy',4,7,true,now()),
('iqro.hijaiyah.dot_features.final','iqro','Ciri titik akhir','Menggunakan ciri jumlah titik untuk membedakan beberapa bentuk akhir.','religious_literacy',5,7,true,now()),
('iqro.hijaiyah.name_matching.final','iqro','Pasangkan nama dan bentuk akhir','Memasangkan bentuk huruf akhir dengan label nama kanonik Mainlagi.','religious_literacy',5,7,true,now()),
('iqro.hijaiyah.integration.final','iqro','Review integratif Hijaiyah','Menggabungkan beberapa petunjuk visual dan label nama pada review akhir Batch 10.','religious_literacy',5,7,true,now())
on conflict(skill_key) do update set subject_id=excluded.subject_id,title=excluded.title,description=excluded.description,domain=excluded.domain,age_min=excluded.age_min,age_max=excluded.age_max,active=true,updated_at=now();

insert into public.learning_content_packs(pack_id,subject_id,path_id,stage_id,title,version,age_min,age_max,review_status,active,updated_at) values
('iqro.pack.final-recognition','iqro','iqro-fondasi-hijaiyah','iqro-final-families','Final Recognition — Expert Review Required','1.0.0',4,7,'expert_required',true,now()),
('iqro.pack.final-listening','iqro','iqro-fondasi-hijaiyah','iqro-final-families','Final Listening — Expert Review Required','1.0.0',4,7,'expert_required',true,now()),
('iqro.pack.final-dots','iqro','iqro-fondasi-hijaiyah','iqro-final-families','Final Dot Features — Expert Review Required','1.0.0',5,7,'expert_required',true,now()),
('iqro.pack.final-name-matching','iqro','iqro-fondasi-hijaiyah','iqro-final-families','Final Name Matching — Expert Review Required','1.0.0',5,7,'expert_required',true,now()),
('iqro.pack.final-integration','iqro','iqro-fondasi-hijaiyah','iqro-final-families','Final Integrated Review — Expert Review Required','1.0.0',5,7,'expert_required',true,now())
on conflict(pack_id) do update set subject_id=excluded.subject_id,path_id=excluded.path_id,stage_id=excluded.stage_id,title=excluded.title,version=excluded.version,age_min=excluded.age_min,age_max=excluded.age_max,review_status=excluded.review_status,active=true,updated_at=now();

insert into public.learning_activities(activity_id,subject_id,stage_id,runtime,difficulty,assessment,required_for_stage,motion_optional,star_reward,content_pack_id,lesson_id,mechanic_id,evidence_contract,content_revision,active,updated_at) values
('iqro-find-kaf','iqro','iqro-final-families','tap_choice',2,'assessed',true,false,3,'iqro.pack.final-recognition','iqro-final-recognition','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-find-lam','iqro','iqro-final-families','tap_choice',2,'assessed',false,false,3,'iqro.pack.final-recognition','iqro-final-recognition','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-find-mim','iqro','iqro-final-families','tap_choice',2,'assessed',false,false,3,'iqro.pack.final-recognition','iqro-final-recognition','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-find-nun','iqro','iqro-final-families','tap_choice',2,'assessed',true,false,3,'iqro.pack.final-recognition','iqro-final-recognition','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-find-ha-besar','iqro','iqro-final-families','tap_choice',2,'assessed',false,false,3,'iqro.pack.final-recognition','iqro-final-recognition','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-find-wawu','iqro','iqro-final-families','tap_choice',2,'assessed',false,false,3,'iqro.pack.final-recognition','iqro-final-recognition','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-find-ya','iqro','iqro-final-families','tap_choice',2,'assessed',true,false,3,'iqro.pack.final-recognition','iqro-final-recognition','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-find-hamzah','iqro','iqro-final-families','tap_choice',2,'assessed',false,false,3,'iqro.pack.final-recognition','iqro-final-recognition','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-listen-kaf','iqro','iqro-final-families','listen_and_choose',2,'assessed',false,false,3,'iqro.pack.final-listening','iqro-final-listening','listen_and_choose','choice_accuracy_v1',1,true,now()),
('iqro-listen-lam','iqro','iqro-final-families','listen_and_choose',2,'assessed',true,false,3,'iqro.pack.final-listening','iqro-final-listening','listen_and_choose','choice_accuracy_v1',1,true,now()),
('iqro-listen-mim','iqro','iqro-final-families','listen_and_choose',2,'assessed',false,false,3,'iqro.pack.final-listening','iqro-final-listening','listen_and_choose','choice_accuracy_v1',1,true,now()),
('iqro-listen-nun','iqro','iqro-final-families','listen_and_choose',2,'assessed',false,false,3,'iqro.pack.final-listening','iqro-final-listening','listen_and_choose','choice_accuracy_v1',1,true,now()),
('iqro-listen-ha-besar','iqro','iqro-final-families','listen_and_choose',2,'assessed',true,false,3,'iqro.pack.final-listening','iqro-final-listening','listen_and_choose','choice_accuracy_v1',1,true,now()),
('iqro-listen-wawu','iqro','iqro-final-families','listen_and_choose',2,'assessed',false,false,3,'iqro.pack.final-listening','iqro-final-listening','listen_and_choose','choice_accuracy_v1',1,true,now()),
('iqro-listen-ya','iqro','iqro-final-families','listen_and_choose',2,'assessed',false,false,3,'iqro.pack.final-listening','iqro-final-listening','listen_and_choose','choice_accuracy_v1',1,true,now()),
('iqro-listen-hamzah','iqro','iqro-final-families','listen_and_choose',2,'assessed',true,false,3,'iqro.pack.final-listening','iqro-final-listening','listen_and_choose','choice_accuracy_v1',1,true,now()),
('iqro-dots-nun-final','iqro','iqro-final-families','tap_choice',2,'assessed',true,false,3,'iqro.pack.final-dots','iqro-final-dots','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-dots-ya-final','iqro','iqro-final-families','tap_choice',2,'assessed',true,false,3,'iqro.pack.final-dots','iqro-final-dots','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-dots-hamzah-final','iqro','iqro-final-families','tap_choice',3,'assessed',false,false,3,'iqro.pack.final-dots','iqro-final-dots','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-match-name-kaf-lam-mim','iqro','iqro-final-families','matching',2,'assessed',true,false,3,'iqro.pack.final-name-matching','iqro-final-name-matching','matching','matching_accuracy_v1',1,true,now()),
('iqro-match-name-nun-ha-wawu','iqro','iqro-final-families','matching',2,'assessed',true,false,3,'iqro.pack.final-name-matching','iqro-final-name-matching','matching','matching_accuracy_v1',1,true,now()),
('iqro-match-name-ya-hamzah','iqro','iqro-final-families','matching',2,'assessed',true,false,3,'iqro.pack.final-name-matching','iqro-final-name-matching','matching','matching_accuracy_v1',1,true,now()),
('iqro-review-order-kaf-lam','iqro','iqro-final-families','tap_choice',3,'assessed',true,false,3,'iqro.pack.final-integration','iqro-final-integration','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-review-distinguish-ha-wawu','iqro','iqro-final-families','tap_choice',3,'assessed',true,false,3,'iqro.pack.final-integration','iqro-final-integration','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-review-hamzah-identity','iqro','iqro-final-families','tap_choice',3,'assessed',true,false,3,'iqro.pack.final-integration','iqro-final-integration','tap_choice','choice_accuracy_v1',1,true,now())
on conflict(activity_id) do update set subject_id=excluded.subject_id,stage_id=excluded.stage_id,runtime=excluded.runtime,difficulty=excluded.difficulty,assessment=excluded.assessment,required_for_stage=excluded.required_for_stage,motion_optional=excluded.motion_optional,star_reward=excluded.star_reward,content_pack_id=excluded.content_pack_id,lesson_id=excluded.lesson_id,mechanic_id=excluded.mechanic_id,evidence_contract=excluded.evidence_contract,content_revision=excluded.content_revision,active=true,updated_at=now();

insert into public.learning_activity_skills(activity_id,skill_key,evidence_weight) values
('iqro-find-kaf','iqro.hijaiyah.recognition.final',1),('iqro-find-lam','iqro.hijaiyah.recognition.final',1),('iqro-find-mim','iqro.hijaiyah.recognition.final',1),('iqro-find-nun','iqro.hijaiyah.recognition.final',1),('iqro-find-ha-besar','iqro.hijaiyah.recognition.final',1),('iqro-find-wawu','iqro.hijaiyah.recognition.final',1),('iqro-find-ya','iqro.hijaiyah.recognition.final',1),('iqro-find-hamzah','iqro.hijaiyah.recognition.final',1),
('iqro-listen-kaf','iqro.hijaiyah.listening.final',1),('iqro-listen-lam','iqro.hijaiyah.listening.final',1),('iqro-listen-mim','iqro.hijaiyah.listening.final',1),('iqro-listen-nun','iqro.hijaiyah.listening.final',1),('iqro-listen-ha-besar','iqro.hijaiyah.listening.final',1),('iqro-listen-wawu','iqro.hijaiyah.listening.final',1),('iqro-listen-ya','iqro.hijaiyah.listening.final',1),('iqro-listen-hamzah','iqro.hijaiyah.listening.final',1),
('iqro-dots-nun-final','iqro.hijaiyah.dot_features.final',1),('iqro-dots-ya-final','iqro.hijaiyah.dot_features.final',1),('iqro-dots-hamzah-final','iqro.hijaiyah.dot_features.final',1),
('iqro-match-name-kaf-lam-mim','iqro.hijaiyah.name_matching.final',1),('iqro-match-name-nun-ha-wawu','iqro.hijaiyah.name_matching.final',1),('iqro-match-name-ya-hamzah','iqro.hijaiyah.name_matching.final',1),
('iqro-review-order-kaf-lam','iqro.hijaiyah.integration.final',1),('iqro-review-distinguish-ha-wawu','iqro.hijaiyah.integration.final',1),('iqro-review-hamzah-identity','iqro.hijaiyah.integration.final',1)
on conflict(activity_id,skill_key) do update set evidence_weight=excluded.evidence_weight;