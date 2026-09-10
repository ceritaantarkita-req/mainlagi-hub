-- Mainlagi Expansion Batch 11 — Letters/Menulis Wave A (subject total 3 -> 25)
-- Adds 22 meaningful activities: 19 measured recognition/matching/discrimination + 3 completion-only pre-writing practices.
-- Generic letter tracing remains practice-only until letter-shape fidelity is explicitly implemented and validated.
-- Additive/idempotent only; historical activities, attempts, scores, progress, and mastery identities remain unchanged.

insert into public.learning_skills(skill_key,subject_id,title,description,domain,age_min,age_max,active,updated_at) values
('letters.latin.uppercase.recognition.early','letters','Kenali huruf besar awal','Mengenali bentuk huruf besar B sampai F pada pilihan visual sederhana.','literacy',3,7,true,now()),
('letters.latin.lowercase.recognition.early','letters','Kenali huruf kecil awal','Mengenali bentuk huruf kecil b sampai f pada pilihan visual sederhana.','literacy',3,7,true,now()),
('letters.latin.case_matching.early','letters','Pasangan huruf besar dan kecil','Memasangkan huruf besar dengan huruf kecil yang sesuai.','literacy',4,7,true,now()),
('letters.latin.visual_discrimination.early','letters','Bedakan bentuk huruf mirip','Membedakan beberapa bentuk huruf Latin yang tampak mirip secara visual.','literacy',4,7,true,now()),
('letters.prewriting.strokes.basic','letters','Gerak dasar pra-menulis','Melatih garis vertikal, horizontal, dan diagonal sebagai kesiapan motorik menulis.','motor',3,7,true,now())
on conflict(skill_key) do update set subject_id=excluded.subject_id,title=excluded.title,description=excluded.description,domain=excluded.domain,age_min=excluded.age_min,age_max=excluded.age_max,active=true,updated_at=now();

insert into public.learning_content_packs(pack_id,subject_id,path_id,stage_id,title,version,age_min,age_max,review_status,active,updated_at) values
('letters.pack.uppercase-b-f','letters','letters-writing-foundations','letters-recognition-prewriting-basics','Uppercase B–F','1.0.0',3,7,'internal',true,now()),
('letters.pack.lowercase-b-f','letters','letters-writing-foundations','letters-recognition-prewriting-basics','Lowercase b–f','1.0.0',3,7,'internal',true,now()),
('letters.pack.case-matching-early','letters','letters-writing-foundations','letters-recognition-prewriting-basics','Early Case Matching','1.0.0',4,7,'internal',true,now()),
('letters.pack.visual-discrimination-early','letters','letters-writing-foundations','letters-recognition-prewriting-basics','Early Letter Visual Discrimination','1.0.0',4,7,'internal',true,now()),
('letters.pack.prewriting-strokes','letters','letters-writing-foundations','letters-recognition-prewriting-basics','Basic Pre-writing Strokes','1.0.0',3,7,'internal',true,now())
on conflict(pack_id) do update set subject_id=excluded.subject_id,path_id=excluded.path_id,stage_id=excluded.stage_id,title=excluded.title,version=excluded.version,age_min=excluded.age_min,age_max=excluded.age_max,review_status=excluded.review_status,active=true,updated_at=now();

insert into public.learning_activities(activity_id,subject_id,stage_id,runtime,difficulty,assessment,required_for_stage,motion_optional,star_reward,content_pack_id,lesson_id,mechanic_id,evidence_contract,content_revision,active,updated_at) values
('letters-find-upper-b','letters','letters-recognition-prewriting-basics','tap_choice',1,'assessed',true,false,2,'letters.pack.uppercase-b-f','letters-uppercase-b-f','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-upper-c','letters','letters-recognition-prewriting-basics','tap_choice',1,'assessed',false,false,2,'letters.pack.uppercase-b-f','letters-uppercase-b-f','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-upper-d','letters','letters-recognition-prewriting-basics','tap_choice',1,'assessed',false,false,2,'letters.pack.uppercase-b-f','letters-uppercase-b-f','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-upper-e','letters','letters-recognition-prewriting-basics','tap_choice',1,'assessed',true,false,2,'letters.pack.uppercase-b-f','letters-uppercase-b-f','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-upper-f','letters','letters-recognition-prewriting-basics','tap_choice',1,'assessed',false,false,2,'letters.pack.uppercase-b-f','letters-uppercase-b-f','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-lower-b','letters','letters-recognition-prewriting-basics','tap_choice',1,'assessed',true,false,2,'letters.pack.lowercase-b-f','letters-lowercase-b-f','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-lower-c','letters','letters-recognition-prewriting-basics','tap_choice',1,'assessed',false,false,2,'letters.pack.lowercase-b-f','letters-lowercase-b-f','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-lower-d','letters','letters-recognition-prewriting-basics','tap_choice',1,'assessed',false,false,2,'letters.pack.lowercase-b-f','letters-lowercase-b-f','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-lower-e','letters','letters-recognition-prewriting-basics','tap_choice',1,'assessed',true,false,2,'letters.pack.lowercase-b-f','letters-lowercase-b-f','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-find-lower-f','letters','letters-recognition-prewriting-basics','tap_choice',1,'assessed',false,false,2,'letters.pack.lowercase-b-f','letters-lowercase-b-f','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-match-case-cd','letters','letters-recognition-prewriting-basics','matching',2,'assessed',true,false,3,'letters.pack.case-matching-early','letters-case-matching-early','matching','matching_accuracy_v1',1,true,now()),
('letters-match-case-ef','letters','letters-recognition-prewriting-basics','matching',2,'assessed',false,false,3,'letters.pack.case-matching-early','letters-case-matching-early','matching','matching_accuracy_v1',1,true,now()),
('letters-match-case-bce','letters','letters-recognition-prewriting-basics','matching',2,'assessed',true,false,3,'letters.pack.case-matching-early','letters-case-matching-early','matching','matching_accuracy_v1',1,true,now()),
('letters-discriminate-upper-b','letters','letters-recognition-prewriting-basics','tap_choice',2,'assessed',true,false,3,'letters.pack.visual-discrimination-early','letters-visual-discrimination-early','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-discriminate-upper-c','letters','letters-recognition-prewriting-basics','tap_choice',2,'assessed',false,false,3,'letters.pack.visual-discrimination-early','letters-visual-discrimination-early','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-discriminate-upper-e','letters','letters-recognition-prewriting-basics','tap_choice',2,'assessed',false,false,3,'letters.pack.visual-discrimination-early','letters-visual-discrimination-early','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-discriminate-lower-bd','letters','letters-recognition-prewriting-basics','tap_choice',2,'assessed',true,false,3,'letters.pack.visual-discrimination-early','letters-visual-discrimination-early','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-discriminate-lower-pq','letters','letters-recognition-prewriting-basics','tap_choice',2,'assessed',false,false,3,'letters.pack.visual-discrimination-early','letters-visual-discrimination-early','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-discriminate-lower-mn','letters','letters-recognition-prewriting-basics','tap_choice',2,'assessed',false,false,3,'letters.pack.visual-discrimination-early','letters-visual-discrimination-early','tap_choice','choice_accuracy_v1',1,true,now()),
('letters-stroke-vertical','letters','letters-recognition-prewriting-basics','trace',1,'practice',false,false,2,'letters.pack.prewriting-strokes','letters-prewriting-strokes','guided_trace','completion_only_v1',1,true,now()),
('letters-stroke-horizontal','letters','letters-recognition-prewriting-basics','trace',1,'practice',false,false,2,'letters.pack.prewriting-strokes','letters-prewriting-strokes','guided_trace','completion_only_v1',1,true,now()),
('letters-stroke-diagonal','letters','letters-recognition-prewriting-basics','trace',1,'practice',false,false,2,'letters.pack.prewriting-strokes','letters-prewriting-strokes','guided_trace','completion_only_v1',1,true,now())
on conflict(activity_id) do update set subject_id=excluded.subject_id,stage_id=excluded.stage_id,runtime=excluded.runtime,difficulty=excluded.difficulty,assessment=excluded.assessment,required_for_stage=excluded.required_for_stage,motion_optional=excluded.motion_optional,star_reward=excluded.star_reward,content_pack_id=excluded.content_pack_id,lesson_id=excluded.lesson_id,mechanic_id=excluded.mechanic_id,evidence_contract=excluded.evidence_contract,content_revision=excluded.content_revision,active=true,updated_at=now();

insert into public.learning_activity_skills(activity_id,skill_key,evidence_weight) values
('letters-find-upper-b','letters.latin.uppercase.recognition.early',1),
('letters-find-upper-c','letters.latin.uppercase.recognition.early',1),
('letters-find-upper-d','letters.latin.uppercase.recognition.early',1),
('letters-find-upper-e','letters.latin.uppercase.recognition.early',1),
('letters-find-upper-f','letters.latin.uppercase.recognition.early',1),
('letters-find-lower-b','letters.latin.lowercase.recognition.early',1),
('letters-find-lower-c','letters.latin.lowercase.recognition.early',1),
('letters-find-lower-d','letters.latin.lowercase.recognition.early',1),
('letters-find-lower-e','letters.latin.lowercase.recognition.early',1),
('letters-find-lower-f','letters.latin.lowercase.recognition.early',1),
('letters-match-case-cd','letters.latin.case_matching.early',1),
('letters-match-case-ef','letters.latin.case_matching.early',1),
('letters-match-case-bce','letters.latin.case_matching.early',1),
('letters-discriminate-upper-b','letters.latin.visual_discrimination.early',1),
('letters-discriminate-upper-c','letters.latin.visual_discrimination.early',1),
('letters-discriminate-upper-e','letters.latin.visual_discrimination.early',1),
('letters-discriminate-lower-bd','letters.latin.visual_discrimination.early',1),
('letters-discriminate-lower-pq','letters.latin.visual_discrimination.early',1),
('letters-discriminate-lower-mn','letters.latin.visual_discrimination.early',1),
('letters-stroke-vertical','letters.prewriting.strokes.basic',0.4),
('letters-stroke-horizontal','letters.prewriting.strokes.basic',0.4),
('letters-stroke-diagonal','letters.prewriting.strokes.basic',0.4)
on conflict(activity_id,skill_key) do update set evidence_weight=excluded.evidence_weight;
