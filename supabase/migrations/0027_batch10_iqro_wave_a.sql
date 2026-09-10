-- Mainlagi Expansion Batch 10 — Iqro Wave A (subject total 4 -> 25)
-- Adds 21 reviewed-draft Hijaiyah recognition/listening/dot/name-matching activities.
-- All new packs remain expert_required. Code/DB/CI success is not religious-learning expert approval.
-- Additive/idempotent only; historical activities, attempts, scores, progress, and mastery identities remain unchanged.

insert into public.learning_skills(skill_key,subject_id,title,description,domain,age_min,age_max,active,updated_at) values
('iqro.hijaiyah.recognition.early_bowl','iqro','Kenali Ba Ta Tsa','Membedakan bentuk Ba, Ta, dan Tsa pada latihan visual awal.','religious_literacy',3,7,true,now()),
('iqro.hijaiyah.visual_discrimination.early_curve','iqro','Bedakan Jim Ha Kha','Membedakan bentuk Jim, Ha, dan Kha dengan perhatian pada ciri visualnya.','religious_literacy',3,7,true,now()),
('iqro.hijaiyah.listening.early','iqro','Dengar label huruf awal','Menghubungkan label nama huruf awal dengan bentuk yang sesuai; memerlukan review audio pengajar.','religious_literacy',3,7,true,now()),
('iqro.hijaiyah.dot_count.early','iqro','Jumlah titik huruf awal','Menggunakan jumlah titik sebagai petunjuk visual pembeda huruf Hijaiyah awal.','religious_literacy',4,7,true,now()),
('iqro.hijaiyah.name_matching.early','iqro','Pasangkan nama dan bentuk awal','Memasangkan bentuk huruf dengan label nama kanonik yang digunakan Mainlagi.','religious_literacy',4,7,true,now())
on conflict(skill_key) do update set subject_id=excluded.subject_id,title=excluded.title,description=excluded.description,domain=excluded.domain,age_min=excluded.age_min,age_max=excluded.age_max,active=true,updated_at=now();

insert into public.learning_content_packs(pack_id,subject_id,path_id,stage_id,title,version,age_min,age_max,review_status,active,updated_at) values
('iqro.pack.early-bowl-family','iqro','iqro-fondasi-hijaiyah','iqro-recognition-basics','Ba Ta Tsa — Expert Review Required','1.0.0',3,7,'expert_required',true,now()),
('iqro.pack.early-curve-family','iqro','iqro-fondasi-hijaiyah','iqro-recognition-basics','Jim Ha Kha — Expert Review Required','1.0.0',3,7,'expert_required',true,now()),
('iqro.pack.early-listening','iqro','iqro-fondasi-hijaiyah','iqro-recognition-basics','Early Letter Listening — Expert Review Required','1.0.0',3,7,'expert_required',true,now()),
('iqro.pack.early-dots','iqro','iqro-fondasi-hijaiyah','iqro-recognition-basics','Early Dot Awareness — Expert Review Required','1.0.0',4,7,'expert_required',true,now()),
('iqro.pack.early-name-matching','iqro','iqro-fondasi-hijaiyah','iqro-recognition-basics','Early Name Matching — Expert Review Required','1.0.0',4,7,'expert_required',true,now())
on conflict(pack_id) do update set subject_id=excluded.subject_id,path_id=excluded.path_id,stage_id=excluded.stage_id,title=excluded.title,version=excluded.version,age_min=excluded.age_min,age_max=excluded.age_max,review_status=excluded.review_status,active=true,updated_at=now();

insert into public.learning_activities(activity_id,subject_id,stage_id,runtime,difficulty,assessment,required_for_stage,motion_optional,star_reward,content_pack_id,lesson_id,mechanic_id,evidence_contract,content_revision,active,updated_at) values
('iqro-find-ba','iqro','iqro-recognition-basics','tap_choice',1,'assessed',true,false,2,'iqro.pack.early-bowl-family','iqro-early-bowl-family','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-find-ta','iqro','iqro-recognition-basics','tap_choice',1,'assessed',false,false,2,'iqro.pack.early-bowl-family','iqro-early-bowl-family','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-find-tsa','iqro','iqro-recognition-basics','tap_choice',1,'assessed',false,false,2,'iqro.pack.early-bowl-family','iqro-early-bowl-family','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-find-jim','iqro','iqro-recognition-basics','tap_choice',1,'assessed',true,false,2,'iqro.pack.early-curve-family','iqro-early-curve-family','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-find-ha','iqro','iqro-recognition-basics','tap_choice',1,'assessed',false,false,2,'iqro.pack.early-curve-family','iqro-early-curve-family','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-find-kha','iqro','iqro-recognition-basics','tap_choice',1,'assessed',false,false,2,'iqro.pack.early-curve-family','iqro-early-curve-family','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-listen-ba','iqro','iqro-recognition-basics','listen_and_choose',1,'assessed',true,false,2,'iqro.pack.early-listening','iqro-early-listening','listen_and_choose','choice_accuracy_v1',1,true,now()),
('iqro-listen-ta','iqro','iqro-recognition-basics','listen_and_choose',1,'assessed',false,false,2,'iqro.pack.early-listening','iqro-early-listening','listen_and_choose','choice_accuracy_v1',1,true,now()),
('iqro-listen-tsa','iqro','iqro-recognition-basics','listen_and_choose',1,'assessed',false,false,2,'iqro.pack.early-listening','iqro-early-listening','listen_and_choose','choice_accuracy_v1',1,true,now()),
('iqro-listen-jim','iqro','iqro-recognition-basics','listen_and_choose',1,'assessed',true,false,2,'iqro.pack.early-listening','iqro-early-listening','listen_and_choose','choice_accuracy_v1',1,true,now()),
('iqro-listen-ha','iqro','iqro-recognition-basics','listen_and_choose',1,'assessed',false,false,2,'iqro.pack.early-listening','iqro-early-listening','listen_and_choose','choice_accuracy_v1',1,true,now()),
('iqro-listen-kha','iqro','iqro-recognition-basics','listen_and_choose',1,'assessed',false,false,2,'iqro.pack.early-listening','iqro-early-listening','listen_and_choose','choice_accuracy_v1',1,true,now()),
('iqro-dots-ba','iqro','iqro-recognition-basics','tap_choice',2,'assessed',false,false,3,'iqro.pack.early-dots','iqro-early-dots','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-dots-ta','iqro','iqro-recognition-basics','tap_choice',2,'assessed',true,false,3,'iqro.pack.early-dots','iqro-early-dots','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-dots-tsa','iqro','iqro-recognition-basics','tap_choice',2,'assessed',false,false,3,'iqro.pack.early-dots','iqro-early-dots','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-dots-jim','iqro','iqro-recognition-basics','tap_choice',2,'assessed',false,false,3,'iqro.pack.early-dots','iqro-early-dots','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-dots-ha','iqro','iqro-recognition-basics','tap_choice',2,'assessed',true,false,3,'iqro.pack.early-dots','iqro-early-dots','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-dots-kha','iqro','iqro-recognition-basics','tap_choice',2,'assessed',false,false,3,'iqro.pack.early-dots','iqro-early-dots','tap_choice','choice_accuracy_v1',1,true,now()),
('iqro-match-name-ba-ta','iqro','iqro-recognition-basics','matching',2,'assessed',true,false,3,'iqro.pack.early-name-matching','iqro-early-name-matching','matching','matching_accuracy_v1',1,true,now()),
('iqro-match-name-tsa-jim','iqro','iqro-recognition-basics','matching',2,'assessed',false,false,3,'iqro.pack.early-name-matching','iqro-early-name-matching','matching','matching_accuracy_v1',1,true,now()),
('iqro-match-name-ha-kha','iqro','iqro-recognition-basics','matching',2,'assessed',true,false,3,'iqro.pack.early-name-matching','iqro-early-name-matching','matching','matching_accuracy_v1',1,true,now())
on conflict(activity_id) do update set subject_id=excluded.subject_id,stage_id=excluded.stage_id,runtime=excluded.runtime,difficulty=excluded.difficulty,assessment=excluded.assessment,required_for_stage=excluded.required_for_stage,motion_optional=excluded.motion_optional,star_reward=excluded.star_reward,content_pack_id=excluded.content_pack_id,lesson_id=excluded.lesson_id,mechanic_id=excluded.mechanic_id,evidence_contract=excluded.evidence_contract,content_revision=excluded.content_revision,active=true,updated_at=now();

insert into public.learning_activity_skills(activity_id,skill_key,evidence_weight) values
('iqro-find-ba','iqro.hijaiyah.recognition.early_bowl',1),('iqro-find-ta','iqro.hijaiyah.recognition.early_bowl',1),('iqro-find-tsa','iqro.hijaiyah.recognition.early_bowl',1),
('iqro-find-jim','iqro.hijaiyah.visual_discrimination.early_curve',1),('iqro-find-ha','iqro.hijaiyah.visual_discrimination.early_curve',1),('iqro-find-kha','iqro.hijaiyah.visual_discrimination.early_curve',1),
('iqro-listen-ba','iqro.hijaiyah.listening.early',1),('iqro-listen-ta','iqro.hijaiyah.listening.early',1),('iqro-listen-tsa','iqro.hijaiyah.listening.early',1),('iqro-listen-jim','iqro.hijaiyah.listening.early',1),('iqro-listen-ha','iqro.hijaiyah.listening.early',1),('iqro-listen-kha','iqro.hijaiyah.listening.early',1),
('iqro-dots-ba','iqro.hijaiyah.dot_count.early',1),('iqro-dots-ta','iqro.hijaiyah.dot_count.early',1),('iqro-dots-tsa','iqro.hijaiyah.dot_count.early',1),('iqro-dots-jim','iqro.hijaiyah.dot_count.early',1),('iqro-dots-ha','iqro.hijaiyah.dot_count.early',1),('iqro-dots-kha','iqro.hijaiyah.dot_count.early',1),
('iqro-match-name-ba-ta','iqro.hijaiyah.name_matching.early',1),('iqro-match-name-tsa-jim','iqro.hijaiyah.name_matching.early',1),('iqro-match-name-ha-kha','iqro.hijaiyah.name_matching.early',1)
on conflict(activity_id,skill_key) do update set evidence_weight=excluded.evidence_weight;